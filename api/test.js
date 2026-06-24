// api/test.js
export default async function handler(req, res) {
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
        max_tokens: 64,
        messages: [{ role: 'user', content: 'Say hello in one word.' }],
      }),
    });

    const data = await response.json();
    return res.status(200).json({ success: true, data });

  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
