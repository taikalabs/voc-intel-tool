import { useState, useMemo } from 'react';
import { generateProductBrief } from '../utils/mistral';
import { saveBrief, generateId } from '../utils/storage';

const ARR_VALUES = {
  enterprise: 100000,
  mid_market: 50000,
  smb: 15000
};

const PRESET_BRIEFS = [
  {
    id: 'enterprise_churn',
    name: 'Enterprise Churn Risk',
    description: 'Focus on churn signals from Enterprise customers',
    filters: { arrTier: 'enterprise', category: 'churn_signal' },
    icon: '🚨'
  },
  {
    id: 'feature_requests',
    name: 'Feature Requests Summary',
    description: 'All feature requests across customer segments',
    filters: { category: 'feature_request' },
    icon: '✨'
  },
  {
    id: 'competitive_intel',
    name: 'Competitive Intelligence',
    description: 'Competitor mentions from customers and web',
    filters: { category: 'competitive' },
    icon: '🎯'
  },
  {
    id: 'enterprise_all',
    name: 'Enterprise Overview',
    description: 'All feedback from Enterprise tier customers',
    filters: { arrTier: 'enterprise' },
    icon: '🏢'
  },
  {
    id: 'bugs_urgent',
    name: 'Critical Bugs',
    description: 'Bug reports with high/critical urgency',
    filters: { category: 'bug', urgency: ['high', 'critical'] },
    icon: '🐛'
  },
  {
    id: 'negative_sentiment',
    name: 'Negative Feedback',
    description: 'Negative and frustrated customer feedback',
    filters: { sentiment: ['negative', 'frustrated'] },
    icon: '😟'
  }
];

export default function BriefGenerator({ feedbackItems, webSignals, briefs, onBriefsUpdated }) {
  const [selectedItems, setSelectedItems] = useState([]);
  const [dateFilter, setDateFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [tierFilter, setTierFilter] = useState('all');
  const [sentimentFilter, setSentimentFilter] = useState('all');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentBrief, setCurrentBrief] = useState(null);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('generate'); // 'generate' | 'history'
  const [selectionMode, setSelectionMode] = useState('preset'); // 'preset' | 'custom'

  // Apply filters to get filtered items
  const filteredItems = useMemo(() => {
    return feedbackItems.filter(item => {
      // Date filter
      if (dateFilter !== 'all') {
        const now = new Date();
        const daysMap = { '7d': 7, '30d': 30, '90d': 90 };
        const days = daysMap[dateFilter] || 0;
        const itemDate = new Date(item.timestamp);
        const daysDiff = (now - itemDate) / (1000 * 60 * 60 * 24);
        if (daysDiff > days) return false;
      }

      // Category filter
      if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;

      // Tier filter
      if (tierFilter !== 'all' && item.arr_tier !== tierFilter) return false;

      // Sentiment filter
      if (sentimentFilter !== 'all' && item.sentiment !== sentimentFilter) return false;

      return true;
    });
  }, [feedbackItems, dateFilter, categoryFilter, tierFilter, sentimentFilter]);

  // Get counts for each preset
  const presetCounts = useMemo(() => {
    const counts = {};
    PRESET_BRIEFS.forEach(preset => {
      counts[preset.id] = feedbackItems.filter(item => {
        const { filters } = preset;
        if (filters.arrTier && item.arr_tier !== filters.arrTier) return false;
        if (filters.category && item.category !== filters.category) return false;
        if (filters.sentiment) {
          const sentiments = Array.isArray(filters.sentiment) ? filters.sentiment : [filters.sentiment];
          if (!sentiments.includes(item.sentiment)) return false;
        }
        if (filters.urgency) {
          const urgencies = Array.isArray(filters.urgency) ? filters.urgency : [filters.urgency];
          if (!urgencies.includes(item.urgency)) return false;
        }
        return true;
      }).length;
    });
    return counts;
  }, [feedbackItems]);

  const handlePresetSelect = (preset) => {
    const { filters } = preset;
    const matchingItems = feedbackItems.filter(item => {
      if (filters.arrTier && item.arr_tier !== filters.arrTier) return false;
      if (filters.category && item.category !== filters.category) return false;
      if (filters.sentiment) {
        const sentiments = Array.isArray(filters.sentiment) ? filters.sentiment : [filters.sentiment];
        if (!sentiments.includes(item.sentiment)) return false;
      }
      if (filters.urgency) {
        const urgencies = Array.isArray(filters.urgency) ? filters.urgency : [filters.urgency];
        if (!urgencies.includes(item.urgency)) return false;
      }
      return true;
    });
    setSelectedItems(matchingItems.map(item => item.id));
    setSelectionMode('custom'); // Switch to custom to show selection
  };

  const clearFilters = () => {
    setDateFilter('all');
    setCategoryFilter('all');
    setTierFilter('all');
    setSentimentFilter('all');
    setSelectedItems([]);
  };

  const handleSelectAll = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredItems.map(item => item.id));
    }
  };

  const handleToggleItem = (id) => {
    setSelectedItems(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  const handleGenerateBrief = async () => {
    const itemsToAnalyze = feedbackItems.filter(item => selectedItems.includes(item.id));

    if (itemsToAnalyze.length === 0) {
      setError('Please select at least one feedback item');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const briefData = await generateProductBrief(itemsToAnalyze, webSignals);

      const brief = {
        id: generateId(),
        generated_at: new Date().toISOString(),
        feedback_count: itemsToAnalyze.length,
        feedback_ids: selectedItems,
        ...briefData
      };

      setCurrentBrief(brief);

      // Save to storage
      saveBrief(brief);
      onBriefsUpdated();

    } catch (err) {
      setError(err.message || 'Failed to generate brief');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportMarkdown = (brief) => {
    const markdown = generateMarkdown(brief);
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `product-brief-${new Date(brief.generated_at).toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyMarkdown = (brief) => {
    const markdown = generateMarkdown(brief);
    navigator.clipboard.writeText(markdown);
    alert('Copied to clipboard!');
  };

  const generateMarkdown = (brief) => {
    let md = `# Product Intelligence Brief\n\n`;
    md += `**Generated:** ${new Date(brief.generated_at).toLocaleDateString()}\n`;
    md += `**Feedback Analyzed:** ${brief.feedback_count} items\n\n`;
    md += `---\n\n`;
    md += `## Executive Summary\n\n${brief.executive_summary}\n\n`;

    if (brief.themes && brief.themes.length > 0) {
      md += `## Top Themes\n\n`;
      brief.themes.forEach((theme, idx) => {
        md += `### ${idx + 1}. ${theme.theme}\n\n`;
        md += `- **Frequency:** ${theme.frequency} mentions\n`;
        md += `- **ARR Impact:** $${theme.arr_impact?.toLocaleString() || 'N/A'}\n`;
        md += `- **Recommended Action:** ${theme.recommended_action}\n\n`;
        if (theme.evidence && theme.evidence.length > 0) {
          md += `**Evidence:**\n`;
          theme.evidence.forEach(e => {
            md += `> "${e}"\n\n`;
          });
        }
      });
    }

    if (brief.web_correlation) {
      md += `## Web Signal Correlation\n\n${brief.web_correlation}\n\n`;
    }

    if (brief.priority_recommendation) {
      md += `## Priority Recommendation\n\n${brief.priority_recommendation}\n\n`;
    }

    md += `---\n\n*Generated by VoC Intelligence Tool powered by Mistral AI*\n`;

    return md;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Tab Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setViewMode('generate')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
            viewMode === 'generate'
              ? 'bg-[#ff7000] text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Generate New Brief
        </button>
        <button
          onClick={() => setViewMode('history')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
            viewMode === 'history'
              ? 'bg-[#ff7000] text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Brief History ({briefs.length})
        </button>
      </div>

      {viewMode === 'generate' && (
        <>
          {/* Preset Brief Types */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Brief Templates</h2>
            <p className="text-sm text-gray-500 mb-4">Select a template to quickly generate a focused brief</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {PRESET_BRIEFS.map(preset => (
                <button
                  key={preset.id}
                  onClick={() => handlePresetSelect(preset)}
                  disabled={presetCounts[preset.id] === 0}
                  className={`text-left p-4 border rounded-lg transition-all ${
                    presetCounts[preset.id] === 0
                      ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                      : 'border-gray-200 hover:border-[#ff7000] hover:bg-orange-50'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{preset.icon}</span>
                    <span className="font-medium text-gray-900">{preset.name}</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">{preset.description}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    presetCounts[preset.id] > 0
                      ? 'bg-[#ff7000] text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {presetCounts[preset.id]} items
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Selection Panel */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Custom Selection</h2>
              {(categoryFilter !== 'all' || tierFilter !== 'all' || sentimentFilter !== 'all' || dateFilter !== 'all') && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Clear all filters
                </button>
              )}
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}

            {/* Filters Row */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <select
                value={dateFilter}
                onChange={(e) => {
                  setDateFilter(e.target.value);
                  setSelectedItems([]);
                }}
                className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#ff7000]"
              >
                <option value="all">All Time</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
              </select>

              <select
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setSelectedItems([]);
                }}
                className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#ff7000]"
              >
                <option value="all">All Categories</option>
                <option value="feature_request">Feature Request</option>
                <option value="bug">Bug Report</option>
                <option value="use_case_gap">Use Case Gap</option>
                <option value="pricing">Pricing</option>
                <option value="competitive">Competitive</option>
                <option value="praise">Praise</option>
                <option value="churn_signal">Churn Signal</option>
              </select>

              <select
                value={tierFilter}
                onChange={(e) => {
                  setTierFilter(e.target.value);
                  setSelectedItems([]);
                }}
                className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#ff7000]"
              >
                <option value="all">All Tiers</option>
                <option value="enterprise">Enterprise</option>
                <option value="mid_market">Mid-Market</option>
                <option value="smb">SMB</option>
              </select>

              <select
                value={sentimentFilter}
                onChange={(e) => {
                  setSentimentFilter(e.target.value);
                  setSelectedItems([]);
                }}
                className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#ff7000]"
              >
                <option value="all">All Sentiments</option>
                <option value="positive">Positive</option>
                <option value="neutral">Neutral</option>
                <option value="negative">Negative</option>
                <option value="frustrated">Frustrated</option>
              </select>

              <button
                onClick={handleSelectAll}
                className="text-sm text-[#ff7000] hover:text-[#e06000]"
              >
                {selectedItems.length === filteredItems.length && filteredItems.length > 0 ? 'Deselect All' : 'Select All Filtered'}
              </button>

              <span className="text-sm text-gray-500">
                {selectedItems.length} of {filteredItems.length} selected
              </span>
            </div>

            {/* Feedback List */}
            {filteredItems.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No feedback items found for this time range</p>
              </div>
            ) : (
              <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg divide-y divide-gray-100">
                {filteredItems.map(item => (
                  <label
                    key={item.id}
                    className={`flex items-start gap-3 p-3 cursor-pointer hover:bg-gray-50 ${
                      selectedItems.includes(item.id) ? 'bg-orange-50' : ''
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleToggleItem(item.id)}
                      className="mt-1 h-4 w-4 text-[#ff7000] border-gray-300 rounded focus:ring-[#ff7000]"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 line-clamp-2">{item.summary}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {item.customer_name || 'Unknown'} • {item.arr_tier?.replace('_', '-')} • {item.category?.replace('_', ' ')}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            )}

            {/* Generate Button */}
            <button
              onClick={handleGenerateBrief}
              disabled={isGenerating || selectedItems.length === 0}
              className="mt-4 w-full py-3 px-4 bg-[#ff7000] hover:bg-[#e06000] text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Generating with Mistral AI...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Generate Product Brief ({selectedItems.length} items)
                </>
              )}
            </button>
          </div>

          {/* Current Brief Display */}
          {currentBrief && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Generated Brief</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCopyMarkdown(currentBrief)}
                    className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
                  >
                    Copy Markdown
                  </button>
                  <button
                    onClick={() => handleExportMarkdown(currentBrief)}
                    className="px-3 py-1.5 text-sm bg-[#ff7000] hover:bg-[#e06000] text-white rounded-md transition-colors"
                  >
                    Download .md
                  </button>
                </div>
              </div>

              <BriefDisplay brief={currentBrief} />
            </div>
          )}
        </>
      )}

      {viewMode === 'history' && (
        <div className="space-y-4">
          {briefs.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-lg font-medium">No Briefs Generated Yet</p>
              <p className="text-sm">Generate your first brief to see it here</p>
            </div>
          ) : (
            briefs.map(brief => (
              <div key={brief.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-500">{formatDate(brief.generated_at)}</p>
                    <p className="text-sm text-gray-600">{brief.feedback_count} feedback items analyzed</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCopyMarkdown(brief)}
                      className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
                    >
                      Copy
                    </button>
                    <button
                      onClick={() => handleExportMarkdown(brief)}
                      className="px-3 py-1.5 text-sm bg-[#ff7000] hover:bg-[#e06000] text-white rounded-md transition-colors"
                    >
                      Download
                    </button>
                  </div>
                </div>
                <BriefDisplay brief={brief} />
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function BriefDisplay({ brief }) {
  return (
    <div className="prose prose-sm max-w-none">
      {/* Executive Summary */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Executive Summary</h3>
        <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{brief.executive_summary}</p>
      </div>

      {/* Themes */}
      {brief.themes && brief.themes.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Top Themes</h3>
          <div className="space-y-4">
            {brief.themes.map((theme, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{idx + 1}. {theme.theme}</h4>
                  <div className="flex gap-4 text-sm">
                    <span className="text-gray-500">{theme.frequency} mentions</span>
                    {theme.arr_impact && (
                      <span className="text-green-600 font-medium">${theme.arr_impact.toLocaleString()} ARR</span>
                    )}
                  </div>
                </div>

                {theme.evidence && theme.evidence.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 mb-1">Evidence:</p>
                    {theme.evidence.map((quote, i) => (
                      <blockquote key={i} className="border-l-2 border-gray-300 pl-3 text-sm text-gray-600 italic mb-2">
                        "{quote}"
                      </blockquote>
                    ))}
                  </div>
                )}

                <div className="bg-blue-50 p-3 rounded">
                  <p className="text-xs text-blue-600 font-medium mb-1">Recommended Action:</p>
                  <p className="text-sm text-blue-800">{theme.recommended_action}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Web Correlation */}
      {brief.web_correlation && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Web Signal Correlation</h3>
          <p className="text-gray-700 bg-purple-50 p-4 rounded-lg">{brief.web_correlation}</p>
        </div>
      )}

      {/* Priority Recommendation */}
      {brief.priority_recommendation && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Priority Recommendation</h3>
          <p className="text-gray-700 bg-orange-50 p-4 rounded-lg border-l-4 border-[#ff7000]">
            {brief.priority_recommendation}
          </p>
        </div>
      )}
    </div>
  );
}
