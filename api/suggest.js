// api/suggest.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { user1, user2 } = req.body;

  if (!user1 || !user2) {
    return res.status(400).json({ error: 'Missing user data' });
  }

  const sharedInterests = user1.interests.filter(i =>
    user2.interests.includes(i)
  );
  const sharedDays = user1.availability.filter(d =>
    user2.availability.includes(d)
  );

  const prompt = `You are helping two people meet for the first time through an app called Tessera.

Person 1: ${user1.name}, age ${user1.age}
Person 2: ${user2.name}, age ${user2.age}
Shared interests: ${sharedInterests.join(', ')}
Days they're both free: ${sharedDays.join(', ')}

Suggest one specific, real activity they could do together. Be warm and specific — name an actual type of place or activity (not a specific venue since you don't know their city). Keep it to 1-2 sentences max. Also suggest a time of day that fits the activity.

Respond in this exact JSON format with no extra text:
{
  "activity": "one sentence describing what to do",
  "time": "suggested time e.g. Saturday morning or Sunday afternoon",
  "reason": "one short sentence on why this suits them both"
}`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 256,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Anthropic API error:', errText);
      return res.status(500).json({ error: 'Anthropic API failed', detail: errText });
    }

    const data = await response.json();

    if (!data.content || !data.content[0]) {
      return res.status(500).json({ error: 'Empty response from Claude' });
    }

    const text = data.content[0].text.trim();

    let suggestion;
    try {
      suggestion = JSON.parse(text);
    } catch (parseErr) {
      console.error('JSON parse error:', text);
      return res.status(500).json({ error: 'Could not parse Claude response', raw: text });
    }

    return res.status(200).json({ suggestion });

  } catch (err) {
    console.error('Suggest function error:', err);
    return res.status(500).json({ error: err.message });
  }
}
