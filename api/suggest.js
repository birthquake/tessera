// api/suggest.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { user1, user2 } = req.body;

  if (!user1 || !user2) {
    return res.status(400).json({ error: 'Missing user data' });
  }

  const sharedInterests = (user1.interests || []).filter(i =>
    (user2.interests || []).includes(i)
  );
  const sharedDays = (user1.availability || []).filter(d =>
    (user2.availability || []).includes(d)
  );

  console.log('Calling Claude with shared:', sharedInterests, sharedDays);

  const prompt = `Two people both enjoy: ${sharedInterests.join(', ')}. They are both free on: ${sharedDays.join(', ')}. Suggest one activity. Reply only with this JSON, no other text: {"activity":"one sentence","time":"e.g. Saturday morning","reason":"one sentence"}`;

  try {
    // Race the Claude call against a 8 second timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 128,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    clearTimeout(timeout);

    console.log('Claude response status:', response.status);

    const data = await response.json();
    console.log('Claude data:', JSON.stringify(data));

    if (!response.ok) {
      return res.status(500).json({ error: 'Claude API failed', detail: data });
    }

    const text = data.content[0].text.trim();
    console.log('Claude text:', text);

    // Strip any markdown fences just in case
    const clean = text.replace(/```json|```/g, '').trim();
    const suggestion = JSON.parse(clean);

    console.log('Suggestion:', suggestion);
    return res.status(200).json({ suggestion });

  } catch (err) {
    console.error('Error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}
