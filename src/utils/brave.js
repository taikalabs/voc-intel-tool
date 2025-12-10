// In development: use Vite proxy (API key in vite.config.js)
// In production: use Vercel serverless function (API key in env var)
const isDev = import.meta.env.DEV;
const BRAVE_SEARCH_URL = isDev
  ? '/api/brave/res/v1/web/search'
  : '/api/brave-search';

// Predefined search queries for Mistral
export const SEARCH_QUERIES = [
  { id: 'general', label: 'General Mentions', query: 'Mistral AI' },
  { id: 'vs_openai', label: 'vs OpenAI', query: 'Mistral vs OpenAI GPT' },
  { id: 'vs_anthropic', label: 'vs Anthropic', query: 'Mistral vs Claude Anthropic' },
  { id: 'vs_llama', label: 'vs Llama', query: 'Mistral vs Llama Meta' },
  { id: 'mistral_large', label: 'Mistral Large', query: 'Mistral Large model review' },
  { id: 'le_chat', label: 'Le Chat', query: 'Le Chat Mistral AI' },
  { id: 'api', label: 'API Experience', query: 'Mistral API developer experience' },
  { id: 'pricing', label: 'Pricing', query: 'Mistral AI pricing cost' },
  { id: 'reddit', label: 'Reddit Discussions', query: 'site:reddit.com Mistral AI' },
  { id: 'hackernews', label: 'Hacker News', query: 'site:news.ycombinator.com Mistral' }
];

export async function searchBrave(query, count = 10) {
  try {
    // Build params based on environment
    const params = isDev
      ? new URLSearchParams({
          q: query,
          count: count.toString(),
          freshness: 'pm',
          text_decorations: 'false',
          search_lang: 'en'
        })
      : new URLSearchParams({
          q: query,
          count: count.toString()
        });

    const response = await fetch(`${BRAVE_SEARCH_URL}?${params}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Brave Search API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    // Transform results to our format
    const results = (data.web?.results || []).map(result => ({
      title: result.title,
      url: result.url,
      description: result.description,
      age: result.age || 'Unknown',
      source: extractSource(result.url)
    }));

    return results;
  } catch (error) {
    console.error('Brave Search error:', error);
    throw error;
  }
}

function extractSource(url) {
  try {
    const hostname = new URL(url).hostname;
    if (hostname.includes('reddit.com')) return 'Reddit';
    if (hostname.includes('news.ycombinator.com')) return 'Hacker News';
    if (hostname.includes('twitter.com') || hostname.includes('x.com')) return 'X/Twitter';
    if (hostname.includes('github.com')) return 'GitHub';
    if (hostname.includes('medium.com')) return 'Medium';
    if (hostname.includes('dev.to')) return 'Dev.to';
    if (hostname.includes('stackoverflow.com')) return 'Stack Overflow';
    return hostname.replace('www.', '');
  } catch {
    return 'Web';
  }
}

export async function searchMultipleQueries(queryIds) {
  const queries = SEARCH_QUERIES.filter(q => queryIds.includes(q.id));
  const results = [];

  for (const query of queries) {
    try {
      const searchResults = await searchBrave(query.query, 5);
      results.push({
        queryId: query.id,
        queryLabel: query.label,
        results: searchResults
      });
    } catch (error) {
      console.error(`Error searching for ${query.label}:`, error);
      results.push({
        queryId: query.id,
        queryLabel: query.label,
        results: [],
        error: error.message
      });
    }
  }

  return results;
}
