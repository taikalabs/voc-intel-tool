const MISTRAL_API_KEY = 'vwCWrHycvsRxNSgpbFptrk9eZM74x5bO';
const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions';

export async function classifyFeedback(feedbackText) {
  const prompt = `You are analyzing customer feedback for an AI company.

Analyze this feedback and return ONLY valid JSON (no markdown, no code blocks):

{
  "category": "feature_request" | "bug" | "use_case_gap" | "pricing" | "competitive" | "praise" | "churn_signal",
  "features_mentioned": ["list of specific features or capabilities mentioned"],
  "competitors_mentioned": ["list of competitor names mentioned"],
  "use_case": "brief description of the use case if mentioned, or empty string",
  "sentiment": "positive" | "neutral" | "negative" | "frustrated",
  "urgency": "low" | "medium" | "high" | "critical",
  "summary": "one sentence summary of the core feedback"
}

Feedback to analyze:
"""
${feedbackText}
"""`;

  try {
    const response = await fetch(MISTRAL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MISTRAL_API_KEY}`
      },
      body: JSON.stringify({
        model: 'mistral-small-latest',
        messages: [
          { role: 'user', content: prompt }
        ],
        temperature: 0.1,
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      throw new Error(`Mistral API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    return JSON.parse(content);
  } catch (error) {
    console.error('Error classifying feedback:', error);
    throw error;
  }
}

export async function generateProductBrief(feedbackItems, webSignals = []) {
  const prompt = `You are a Customer Success leader preparing a brief for the Product team.

Given this collection of customer feedback, generate a Product Intelligence Brief.

Structure your response as JSON:
{
  "executive_summary": "3 sentences max summarizing the key insights",
  "themes": [
    {
      "theme": "theme name",
      "frequency": number_of_mentions,
      "arr_impact": estimated_arr_at_stake,
      "evidence": ["quote 1", "quote 2"],
      "recommended_action": "specific action to take"
    }
  ],
  "web_correlation": "how public sentiment aligns or conflicts with internal feedback",
  "priority_recommendation": "what to prioritize and why"
}

Feedback data:
"""
${JSON.stringify(feedbackItems, null, 2)}
"""

Web signals:
"""
${JSON.stringify(webSignals, null, 2)}
"""

Write in direct, actionable language. No fluff. Product team has 2 minutes to read this.`;

  try {
    const response = await fetch(MISTRAL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MISTRAL_API_KEY}`
      },
      body: JSON.stringify({
        model: 'mistral-small-latest',
        messages: [
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      throw new Error(`Mistral API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    return JSON.parse(content);
  } catch (error) {
    console.error('Error generating brief:', error);
    throw error;
  }
}

export async function analyzeWebSignal(signalText, source) {
  const prompt = `Analyze this public web signal about Mistral AI and return ONLY valid JSON:

{
  "theme": "main topic being discussed",
  "sentiment": "positive" | "neutral" | "negative" | "mixed",
  "competitors_mentioned": ["list of competitors mentioned"],
  "key_points": ["main points or concerns raised"],
  "relevance": "high" | "medium" | "low"
}

Source: ${source}
Content:
"""
${signalText}
"""`;

  try {
    const response = await fetch(MISTRAL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MISTRAL_API_KEY}`
      },
      body: JSON.stringify({
        model: 'mistral-small-latest',
        messages: [
          { role: 'user', content: prompt }
        ],
        temperature: 0.1,
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      throw new Error(`Mistral API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    return JSON.parse(content);
  } catch (error) {
    console.error('Error analyzing web signal:', error);
    throw error;
  }
}
