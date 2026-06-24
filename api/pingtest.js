// api/pingtest.js
export default async function handler(req, res) {
  try {
    console.log('Attempting fetch to Anthropic...');
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 10,
        messages: [{ role: 'user', content: 'Hi' }],
      }),
    });
    console.log('Got response, status:', response.status);
    const data = await response.json();
    console.log('Data:', JSON.stringify(data));
    return res.status(200).json({ ok: true, status: response.status, data });
  } catch (err) {
    console.error('Fetch failed:', err.message);
    return res.status(500).json({ ok: false, error: err.message });
  }
}
