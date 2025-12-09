import { useState, useMemo } from 'react';

const CATEGORY_LABELS = {
  feature_request: 'Feature Request',
  bug: 'Bug Report',
  use_case_gap: 'Use Case Gap',
  pricing: 'Pricing/Packaging',
  competitive: 'Competitive Intel',
  praise: 'Praise',
  churn_signal: 'Churn Signal'
};

const CATEGORY_COLORS = {
  feature_request: 'bg-blue-500',
  bug: 'bg-red-500',
  use_case_gap: 'bg-purple-500',
  pricing: 'bg-green-500',
  competitive: 'bg-yellow-500',
  praise: 'bg-emerald-500',
  churn_signal: 'bg-rose-500'
};

const SENTIMENT_COLORS = {
  positive: 'bg-green-500',
  neutral: 'bg-gray-400',
  negative: 'bg-orange-500',
  frustrated: 'bg-red-500'
};

const ARR_VALUES = {
  enterprise: 100000,
  mid_market: 50000,
  smb: 15000
};

export default function Dashboard({ feedbackItems, webSignals }) {
  const [filters, setFilters] = useState({
    category: 'all',
    sentiment: 'all',
    arrTier: 'all',
    dateRange: 'all'
  });

  // Calculate stats
  const stats = useMemo(() => {
    const categoryCount = {};
    const sentimentCount = {};
    const tierCount = {};
    let totalARR = 0;
    let atRiskARR = 0;

    feedbackItems.forEach(item => {
      // Category
      categoryCount[item.category] = (categoryCount[item.category] || 0) + 1;

      // Sentiment
      sentimentCount[item.sentiment] = (sentimentCount[item.sentiment] || 0) + 1;

      // Tier
      tierCount[item.arr_tier] = (tierCount[item.arr_tier] || 0) + 1;

      // ARR calculations
      const arrValue = ARR_VALUES[item.arr_tier] || 0;
      totalARR += arrValue;

      if (item.customer_health === 'at_risk' || item.category === 'churn_signal') {
        atRiskARR += arrValue;
      }
    });

    return {
      total: feedbackItems.length,
      categoryCount,
      sentimentCount,
      tierCount,
      totalARR,
      atRiskARR,
      webSignalsCount: webSignals.length
    };
  }, [feedbackItems, webSignals]);

  // Filter items
  const filteredItems = useMemo(() => {
    return feedbackItems.filter(item => {
      if (filters.category !== 'all' && item.category !== filters.category) return false;
      if (filters.sentiment !== 'all' && item.sentiment !== filters.sentiment) return false;
      if (filters.arrTier !== 'all' && item.arr_tier !== filters.arrTier) return false;

      if (filters.dateRange !== 'all') {
        const itemDate = new Date(item.timestamp);
        const now = new Date();
        const daysDiff = (now - itemDate) / (1000 * 60 * 60 * 24);

        if (filters.dateRange === '7d' && daysDiff > 7) return false;
        if (filters.dateRange === '30d' && daysDiff > 30) return false;
        if (filters.dateRange === '90d' && daysDiff > 90) return false;
      }

      return true;
    });
  }, [feedbackItems, filters]);

  // Cluster by features mentioned
  const featureClusters = useMemo(() => {
    const clusters = {};

    feedbackItems.forEach(item => {
      (item.features_mentioned || []).forEach(feature => {
        const key = feature.toLowerCase();
        if (!clusters[key]) {
          clusters[key] = {
            feature: feature,
            count: 0,
            items: [],
            totalARR: 0,
            sentiments: { positive: 0, neutral: 0, negative: 0, frustrated: 0 }
          };
        }
        clusters[key].count++;
        clusters[key].items.push(item);
        clusters[key].totalARR += ARR_VALUES[item.arr_tier] || 0;
        clusters[key].sentiments[item.sentiment]++;
      });
    });

    return Object.values(clusters)
      .sort((a, b) => b.totalARR - a.totalARR)
      .slice(0, 10);
  }, [feedbackItems]);

  // Competitor mentions
  const competitorMentions = useMemo(() => {
    const mentions = {};

    [...feedbackItems, ...webSignals].forEach(item => {
      (item.competitors_mentioned || []).forEach(comp => {
        const key = comp.toLowerCase();
        if (!mentions[key]) {
          mentions[key] = { name: comp, count: 0, internal: 0, external: 0 };
        }
        mentions[key].count++;
        if (item.source === 'web' || item.web_source) {
          mentions[key].external++;
        } else {
          mentions[key].internal++;
        }
      });
    });

    return Object.values(mentions).sort((a, b) => b.count - a.count).slice(0, 8);
  }, [feedbackItems, webSignals]);

  const formatCurrency = (value) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value}`;
  };

  if (feedbackItems.length === 0 && webSignals.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
        <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <p className="text-lg font-medium">No Data Yet</p>
        <p className="text-sm">Add feedback or collect web signals to see insights</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-sm text-gray-500">Total Feedback</p>
          <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-sm text-gray-500">Web Signals</p>
          <p className="text-3xl font-bold text-gray-900">{stats.webSignalsCount}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-sm text-gray-500">Total ARR Represented</p>
          <p className="text-3xl font-bold text-gray-900">{formatCurrency(stats.totalARR)}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-sm text-gray-500">At-Risk ARR</p>
          <p className="text-3xl font-bold text-rose-600">{formatCurrency(stats.atRiskARR)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Filters</h3>
        <div className="flex flex-wrap gap-3">
          <select
            value={filters.category}
            onChange={(e) => setFilters(f => ({ ...f, category: e.target.value }))}
            className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#ff7000]"
          >
            <option value="all">All Categories</option>
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>

          <select
            value={filters.sentiment}
            onChange={(e) => setFilters(f => ({ ...f, sentiment: e.target.value }))}
            className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#ff7000]"
          >
            <option value="all">All Sentiments</option>
            <option value="positive">Positive</option>
            <option value="neutral">Neutral</option>
            <option value="negative">Negative</option>
            <option value="frustrated">Frustrated</option>
          </select>

          <select
            value={filters.arrTier}
            onChange={(e) => setFilters(f => ({ ...f, arrTier: e.target.value }))}
            className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#ff7000]"
          >
            <option value="all">All Tiers</option>
            <option value="enterprise">Enterprise</option>
            <option value="mid_market">Mid-Market</option>
            <option value="smb">SMB</option>
          </select>

          <select
            value={filters.dateRange}
            onChange={(e) => setFilters(f => ({ ...f, dateRange: e.target.value }))}
            className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#ff7000]"
          >
            <option value="all">All Time</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>

          {(filters.category !== 'all' || filters.sentiment !== 'all' || filters.arrTier !== 'all' || filters.dateRange !== 'all') && (
            <button
              onClick={() => setFilters({ category: 'all', sentiment: 'all', arrTier: 'all', dateRange: 'all' })}
              className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900"
            >
              Clear filters
            </button>
          )}
        </div>
        {filters.category !== 'all' || filters.sentiment !== 'all' || filters.arrTier !== 'all' || filters.dateRange !== 'all' ? (
          <p className="mt-2 text-sm text-gray-500">
            Showing {filteredItems.length} of {feedbackItems.length} items
          </p>
        ) : null}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">By Category</h3>
          <div className="space-y-3">
            {Object.entries(stats.categoryCount)
              .sort((a, b) => b[1] - a[1])
              .map(([category, count]) => (
                <div key={category} className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${CATEGORY_COLORS[category] || 'bg-gray-400'}`} />
                  <span className="flex-1 text-sm text-gray-700">{CATEGORY_LABELS[category] || category}</span>
                  <span className="text-sm font-medium text-gray-900">{count}</span>
                  <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${CATEGORY_COLORS[category] || 'bg-gray-400'}`}
                      style={{ width: `${(count / stats.total) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Sentiment Breakdown */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">By Sentiment</h3>
          <div className="space-y-3">
            {Object.entries(stats.sentimentCount)
              .sort((a, b) => b[1] - a[1])
              .map(([sentiment, count]) => (
                <div key={sentiment} className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${SENTIMENT_COLORS[sentiment] || 'bg-gray-400'}`} />
                  <span className="flex-1 text-sm text-gray-700 capitalize">{sentiment}</span>
                  <span className="text-sm font-medium text-gray-900">{count}</span>
                  <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${SENTIMENT_COLORS[sentiment] || 'bg-gray-400'}`}
                      style={{ width: `${(count / stats.total) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Feature Clusters */}
      {featureClusters.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Feature Themes (by ARR Impact)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {featureClusters.map((cluster, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{cluster.feature}</span>
                  <span className="text-sm text-gray-500">{cluster.count} mentions</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">ARR Impact: <span className="font-medium text-gray-900">{formatCurrency(cluster.totalARR)}</span></span>
                  <div className="flex gap-1">
                    {cluster.sentiments.positive > 0 && <span className="w-2 h-2 rounded-full bg-green-500" title={`${cluster.sentiments.positive} positive`} />}
                    {cluster.sentiments.neutral > 0 && <span className="w-2 h-2 rounded-full bg-gray-400" title={`${cluster.sentiments.neutral} neutral`} />}
                    {cluster.sentiments.negative > 0 && <span className="w-2 h-2 rounded-full bg-orange-500" title={`${cluster.sentiments.negative} negative`} />}
                    {cluster.sentiments.frustrated > 0 && <span className="w-2 h-2 rounded-full bg-red-500" title={`${cluster.sentiments.frustrated} frustrated`} />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Competitor Mentions */}
      {competitorMentions.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Competitor Mentions</h3>
          <div className="flex flex-wrap gap-3">
            {competitorMentions.map((comp, idx) => (
              <div key={idx} className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2">
                <span className="font-medium text-yellow-800">{comp.name}</span>
                <span className="ml-2 text-sm text-yellow-600">
                  {comp.count} ({comp.internal} internal, {comp.external} web)
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filtered Results Preview */}
      {filteredItems.length > 0 && filteredItems.length !== feedbackItems.length && (
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtered Feedback ({filteredItems.length})</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {filteredItems.slice(0, 10).map(item => (
              <div key={item.id} className="border-b border-gray-100 pb-2 last:border-0">
                <p className="text-sm text-gray-900">{item.summary}</p>
                <p className="text-xs text-gray-500">
                  {item.customer_name || 'Unknown'} • {CATEGORY_LABELS[item.category]}
                </p>
              </div>
            ))}
            {filteredItems.length > 10 && (
              <p className="text-sm text-gray-500 text-center pt-2">
                + {filteredItems.length - 10} more items
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
