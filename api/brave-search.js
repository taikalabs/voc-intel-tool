// Vercel Serverless Function to proxy Brave Search API
// This avoids CORS issues in production

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { q, count = 10 } = req.query;

  if (!q) {
    return res.status(400).json({ error: 'Missing query parameter "q"' });
  }

  const BRAVE_API_KEY = process.env.BRAVE_API_KEY;

  if (!BRAVE_API_KEY) {
    return res.status(500).json({ error: 'BRAVE_API_KEY not configured' });
  }

  try {
    const searchUrl = `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(q)}&count=${count}`;

    const response = await fetch(searchUrl, {
      headers: {
        'Accept': 'application/json',
        'X-Subscription-Token': BRAVE_API_KEY
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Brave API error:', response.status, errorText);
      return res.status(response.status).json({
        error: 'Brave API request failed',
        status: response.status
      });
    }

    const data = await response.json();

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    return res.status(200).json(data);
  } catch (error) {
    console.error('Brave search proxy error:', error);
    return res.status(500).json({ error: 'Failed to fetch from Brave API' });
  }
}
