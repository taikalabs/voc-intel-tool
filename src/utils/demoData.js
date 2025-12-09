// Realistic demo data for Mistral AI VoC Intelligence Tool
// This showcases the tool's capabilities with realistic customer feedback

export const DEMO_FEEDBACK = [
  {
    id: 'demo-1',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    source: 'call_notes',
    raw_text: "QBR with TechCorp - They're scaling up their usage significantly. Currently processing 50M tokens/month but expect to hit 200M by Q2. Main ask: they need guaranteed latency SLAs for Mistral Large. Their production systems can't handle variability above 500ms p99. Also mentioned they evaluated GPT-4 but chose us for cost efficiency. Want to discuss enterprise pricing tiers.",
    category: 'feature_request',
    features_mentioned: ['latency SLAs', 'enterprise pricing', 'Mistral Large'],
    competitors_mentioned: ['OpenAI', 'GPT-4'],
    use_case: 'Production API integration at scale',
    sentiment: 'positive',
    urgency: 'high',
    summary: 'Enterprise customer scaling to 200M tokens needs latency SLAs and enterprise pricing',
    customer_name: 'TechCorp',
    arr_tier: 'enterprise',
    customer_health: 'healthy',
    strategic_value: 'lighthouse'
  },
  {
    id: 'demo-2',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    source: 'support',
    raw_text: "URGENT: Our batch processing jobs are failing intermittently. Getting 503 errors during peak hours (2-4pm UTC). This is blocking our daily report generation. We've tried implementing retries but the errors persist. Need immediate escalation - our CFO is asking questions about reliability.",
    category: 'bug',
    features_mentioned: ['batch processing', 'API reliability', 'rate limiting'],
    competitors_mentioned: [],
    use_case: 'Batch report generation',
    sentiment: 'frustrated',
    urgency: 'critical',
    summary: 'Critical API reliability issues during peak hours blocking production workflows',
    customer_name: 'FinanceAI',
    arr_tier: 'enterprise',
    customer_health: 'at_risk',
    strategic_value: 'lighthouse'
  },
  {
    id: 'demo-3',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    source: 'nps',
    raw_text: "NPS: 9. Love the model quality and the team responsiveness. Mistral Small is perfect for our classification tasks - fast and accurate. Only wish: better documentation for fine-tuning. Had to figure out a lot through trial and error.",
    category: 'praise',
    features_mentioned: ['Mistral Small', 'fine-tuning', 'documentation'],
    competitors_mentioned: [],
    use_case: 'Text classification',
    sentiment: 'positive',
    urgency: 'low',
    summary: 'Happy customer loves Mistral Small, wants better fine-tuning docs',
    customer_name: 'DataFlow Inc',
    arr_tier: 'mid_market',
    customer_health: 'healthy',
    strategic_value: 'standard'
  },
  {
    id: 'demo-4',
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    source: 'email',
    raw_text: "Following up on our conversation about function calling. We're building an agent framework and need more reliable structured outputs. Currently using JSON mode but getting malformed responses ~5% of the time. Claude's tool use is more consistent. Can you share your roadmap for improving this?",
    category: 'competitive',
    features_mentioned: ['function calling', 'JSON mode', 'structured outputs', 'agents'],
    competitors_mentioned: ['Anthropic', 'Claude'],
    use_case: 'AI agent framework',
    sentiment: 'neutral',
    urgency: 'medium',
    summary: 'Customer comparing function calling reliability to Claude, needs improvement',
    customer_name: 'AgentStack',
    arr_tier: 'mid_market',
    customer_health: 'at_risk',
    strategic_value: 'standard'
  },
  {
    id: 'demo-5',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    source: 'slack',
    raw_text: "Hey team, quick heads up - we're evaluating whether to renew next quarter. The new Llama 3.1 405B is showing competitive results in our benchmarks and it's open source. Our ML team is pushing to self-host. Can we discuss what Mistral offers that justifies the premium?",
    category: 'churn_signal',
    features_mentioned: ['self-hosting', 'open source'],
    competitors_mentioned: ['Meta', 'Llama'],
    use_case: 'General LLM workloads',
    sentiment: 'negative',
    urgency: 'high',
    summary: 'Customer considering switching to Llama 3.1 for self-hosting, renewal at risk',
    customer_name: 'CloudScale',
    arr_tier: 'enterprise',
    customer_health: 'at_risk',
    strategic_value: 'lighthouse'
  },
  {
    id: 'demo-6',
    timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    source: 'qbr',
    raw_text: "Product feedback from QBR: Customer loves Le Chat for internal knowledge base queries. Requesting: 1) SSO integration for enterprise deployment, 2) Usage analytics dashboard, 3) Custom system prompts per workspace. Would increase seats from 50 to 500 if these ship.",
    category: 'feature_request',
    features_mentioned: ['Le Chat', 'SSO', 'analytics dashboard', 'custom prompts', 'workspaces'],
    competitors_mentioned: [],
    use_case: 'Enterprise knowledge base',
    sentiment: 'positive',
    urgency: 'medium',
    summary: 'Le Chat expansion opportunity: SSO, analytics, custom prompts could drive 10x seat growth',
    customer_name: 'GlobalCorp',
    arr_tier: 'enterprise',
    customer_health: 'healthy',
    strategic_value: 'lighthouse'
  },
  {
    id: 'demo-7',
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    source: 'support',
    raw_text: "We're getting inconsistent results with code generation. Same prompt produces working Python code 80% of the time but the other 20% has syntax errors or missing imports. This is blocking our code review automation project. Codex and Copilot are more reliable for this use case.",
    category: 'use_case_gap',
    features_mentioned: ['code generation', 'Python', 'consistency'],
    competitors_mentioned: ['OpenAI', 'Codex', 'GitHub Copilot'],
    use_case: 'Code review automation',
    sentiment: 'frustrated',
    urgency: 'high',
    summary: 'Code generation inconsistency blocking automation project, comparing to Copilot',
    customer_name: 'DevTools Pro',
    arr_tier: 'mid_market',
    customer_health: 'at_risk',
    strategic_value: 'standard'
  },
  {
    id: 'demo-8',
    timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    source: 'call_notes',
    raw_text: "Pricing discussion: Customer currently on $50K/year plan. Usage has grown 3x but they're hesitant to upgrade because committed pricing is unclear. They want annual commits with volume discounts. Mentioned that OpenAI offered them a 30% discount for annual commitment.",
    category: 'pricing',
    features_mentioned: ['volume discounts', 'annual commits', 'enterprise pricing'],
    competitors_mentioned: ['OpenAI'],
    use_case: 'General API usage',
    sentiment: 'neutral',
    urgency: 'high',
    summary: 'Customer wants volume discounts and annual commits, OpenAI offering 30% discount',
    customer_name: 'StartupAI',
    arr_tier: 'mid_market',
    customer_health: 'healthy',
    strategic_value: 'standard'
  },
  {
    id: 'demo-9',
    timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    source: 'nps',
    raw_text: "NPS: 4. Disappointed with the EU data residency situation. We're a German healthcare company and GDPR compliance is non-negotiable. You promised EU hosting 6 months ago but still nothing. We may need to evaluate alternatives if this doesn't ship soon.",
    category: 'churn_signal',
    features_mentioned: ['EU data residency', 'GDPR', 'compliance', 'healthcare'],
    competitors_mentioned: [],
    use_case: 'Healthcare data processing',
    sentiment: 'frustrated',
    urgency: 'critical',
    summary: 'Healthcare customer frustrated about delayed EU data residency, considering alternatives',
    customer_name: 'MedTech GmbH',
    arr_tier: 'enterprise',
    customer_health: 'at_risk',
    strategic_value: 'lighthouse'
  },
  {
    id: 'demo-10',
    timestamp: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    source: 'email',
    raw_text: "Just wanted to share some positive feedback - we switched from GPT-4 to Mistral Large for our customer support chatbot and saw 40% cost reduction with comparable quality. Response times also improved. Our CTO is very happy. Looking forward to exploring more use cases with your team.",
    category: 'praise',
    features_mentioned: ['Mistral Large', 'customer support', 'chatbot', 'cost efficiency'],
    competitors_mentioned: ['OpenAI', 'GPT-4'],
    use_case: 'Customer support chatbot',
    sentiment: 'positive',
    urgency: 'low',
    summary: 'Customer saved 40% switching from GPT-4 to Mistral Large with better response times',
    customer_name: 'SupportHub',
    arr_tier: 'mid_market',
    customer_health: 'healthy',
    strategic_value: 'standard'
  },
  {
    id: 'demo-11',
    timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    source: 'call_notes',
    raw_text: "Discovery call with potential enterprise customer. They need vision capabilities for document processing - invoices, contracts, handwritten notes. Currently using GPT-4V but cost is prohibitive at their scale (processing 100K documents/month). Very interested in Pixtral pricing.",
    category: 'feature_request',
    features_mentioned: ['vision', 'Pixtral', 'document processing', 'OCR'],
    competitors_mentioned: ['OpenAI', 'GPT-4V'],
    use_case: 'Document processing at scale',
    sentiment: 'positive',
    urgency: 'medium',
    summary: 'New enterprise prospect interested in Pixtral for document processing, GPT-4V too expensive',
    customer_name: 'DocuProcess',
    arr_tier: 'enterprise',
    customer_health: 'healthy',
    strategic_value: 'lighthouse'
  },
  {
    id: 'demo-12',
    timestamp: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    source: 'support',
    raw_text: "Hitting context window limits with Mistral Large. Our legal team needs to process 200-page contracts but we're having to chunk and lose context. Is there a roadmap for longer context? GPT-4 Turbo supports 128K which would solve this.",
    category: 'feature_request',
    features_mentioned: ['context window', 'long documents', 'legal'],
    competitors_mentioned: ['OpenAI', 'GPT-4 Turbo'],
    use_case: 'Legal document analysis',
    sentiment: 'neutral',
    urgency: 'medium',
    summary: 'Customer needs longer context window for legal documents, comparing to GPT-4 Turbo 128K',
    customer_name: 'LegalTech Solutions',
    arr_tier: 'mid_market',
    customer_health: 'healthy',
    strategic_value: 'standard'
  }
];

export const DEMO_WEB_SIGNALS = [
  {
    id: 'web-demo-1',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    source: 'web',
    web_source: 'Reddit',
    web_url: 'https://reddit.com/r/LocalLLaMA/example',
    raw_text: "Just tested Mistral Large 2 against GPT-4 and Claude 3.5 on our internal benchmarks. Mistral is winning on speed and cost, but Claude still edges out on complex reasoning tasks. For most production use cases though, Mistral is the sweet spot.",
    title: 'Mistral Large 2 vs GPT-4 vs Claude 3.5 - Real benchmarks',
    search_query: 'Mistral AI comparison',
    theme: 'Model comparison and benchmarking',
    sentiment: 'positive',
    competitors_mentioned: ['OpenAI', 'GPT-4', 'Anthropic', 'Claude'],
    key_points: ['Mistral winning on speed and cost', 'Claude better at complex reasoning', 'Mistral best for production'],
    relevance: 'high'
  },
  {
    id: 'web-demo-2',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    source: 'web',
    web_source: 'Hacker News',
    web_url: 'https://news.ycombinator.com/example',
    raw_text: "Le Chat is surprisingly good. Been using it as my daily driver for coding and it's faster than ChatGPT. The web search integration is seamless. Only complaint: wish it had better code execution like Claude Artifacts.",
    title: 'Le Chat Review - A viable ChatGPT alternative?',
    search_query: 'Le Chat Mistral',
    theme: 'Le Chat user experience',
    sentiment: 'positive',
    competitors_mentioned: ['OpenAI', 'ChatGPT', 'Anthropic', 'Claude'],
    key_points: ['Faster than ChatGPT', 'Good web search', 'Missing code execution feature'],
    relevance: 'high'
  },
  {
    id: 'web-demo-3',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    source: 'web',
    web_source: 'Reddit',
    web_url: 'https://reddit.com/r/MachineLearning/example',
    raw_text: "Anyone else having issues with Mistral API rate limits? Getting throttled way more aggressively than the docs suggest. Support has been slow to respond. Considering moving our dev workloads back to OpenAI.",
    title: 'Mistral API rate limiting issues',
    search_query: 'Mistral API',
    theme: 'API reliability concerns',
    sentiment: 'negative',
    competitors_mentioned: ['OpenAI'],
    key_points: ['Rate limit issues', 'Slow support response', 'Considering switching'],
    relevance: 'high'
  },
  {
    id: 'web-demo-4',
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    source: 'web',
    web_source: 'Dev.to',
    web_url: 'https://dev.to/example',
    raw_text: "Tutorial: How we migrated from OpenAI to Mistral and saved 60% on our AI costs. The models are comparable for our summarization use case, and the European data residency was a bonus for GDPR compliance.",
    title: 'Migrating from OpenAI to Mistral: A Cost Analysis',
    search_query: 'Mistral vs OpenAI',
    theme: 'Cost comparison and migration',
    sentiment: 'positive',
    competitors_mentioned: ['OpenAI'],
    key_points: ['60% cost savings', 'Comparable quality', 'GDPR compliance benefit'],
    relevance: 'high'
  }
];

export function loadDemoData() {
  // Load demo feedback
  localStorage.setItem('voc_feedback_items', JSON.stringify(DEMO_FEEDBACK));

  // Load demo web signals
  localStorage.setItem('voc_web_signals', JSON.stringify(DEMO_WEB_SIGNALS));

  // Clear any existing briefs
  localStorage.setItem('voc_product_briefs', JSON.stringify([]));

  return {
    feedbackCount: DEMO_FEEDBACK.length,
    signalsCount: DEMO_WEB_SIGNALS.length
  };
}

export function clearAllData() {
  localStorage.removeItem('voc_feedback_items');
  localStorage.removeItem('voc_web_signals');
  localStorage.removeItem('voc_product_briefs');
}
