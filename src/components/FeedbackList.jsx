import { deleteFeedbackItem } from '../utils/storage';

const CATEGORY_COLORS = {
  feature_request: 'bg-blue-100 text-blue-800',
  bug: 'bg-red-100 text-red-800',
  use_case_gap: 'bg-purple-100 text-purple-800',
  pricing: 'bg-green-100 text-green-800',
  competitive: 'bg-yellow-100 text-yellow-800',
  praise: 'bg-emerald-100 text-emerald-800',
  churn_signal: 'bg-rose-100 text-rose-800'
};

const SENTIMENT_ICONS = {
  positive: '😊',
  neutral: '😐',
  negative: '😟',
  frustrated: '😤'
};

const URGENCY_COLORS = {
  low: 'text-gray-500',
  medium: 'text-yellow-600',
  high: 'text-orange-600',
  critical: 'text-red-600 font-bold'
};

const ARR_BADGES = {
  enterprise: 'bg-purple-600 text-white',
  mid_market: 'bg-blue-600 text-white',
  smb: 'bg-gray-600 text-white'
};

function formatCategory(category) {
  return category.split('_').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export default function FeedbackList({ items, onItemDeleted }) {
  const handleDelete = (id) => {
    if (confirm('Delete this feedback item?')) {
      const updatedItems = deleteFeedbackItem(id);
      onItemDeleted(updatedItems);
    }
  };

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
        <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="text-lg font-medium">No feedback yet</p>
        <p className="text-sm">Add your first customer feedback above</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          Feedback ({items.length})
        </h2>
      </div>

      <div className="space-y-3">
        {items.map(item => (
          <div key={item.id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${CATEGORY_COLORS[item.category] || 'bg-gray-100 text-gray-800'}`}>
                  {formatCategory(item.category)}
                </span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${ARR_BADGES[item.arr_tier]}`}>
                  {item.arr_tier.replace('_', '-').toUpperCase()}
                </span>
                <span className="text-lg" title={`Sentiment: ${item.sentiment}`}>
                  {SENTIMENT_ICONS[item.sentiment]}
                </span>
                <span className={`text-xs ${URGENCY_COLORS[item.urgency]}`}>
                  {item.urgency.toUpperCase()} urgency
                </span>
              </div>
              <button
                onClick={() => handleDelete(item.id)}
                className="text-gray-400 hover:text-red-600 transition-colors"
                title="Delete"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>

            {/* Summary */}
            <p className="text-gray-900 font-medium mb-2">{item.summary}</p>

            {/* Customer Info */}
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
              {item.customer_name && (
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  {item.customer_name}
                </span>
              )}
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formatDate(item.timestamp)}
              </span>
              <span className="capitalize">{item.source.replace('_', ' ')}</span>
            </div>

            {/* Extracted entities */}
            <div className="flex flex-wrap gap-2 text-xs">
              {item.features_mentioned?.length > 0 && (
                <div className="flex items-center gap-1">
                  <span className="text-gray-500">Features:</span>
                  {item.features_mentioned.map((feature, i) => (
                    <span key={i} className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                      {feature}
                    </span>
                  ))}
                </div>
              )}
              {item.competitors_mentioned?.length > 0 && (
                <div className="flex items-center gap-1">
                  <span className="text-gray-500">Competitors:</span>
                  {item.competitors_mentioned.map((comp, i) => (
                    <span key={i} className="bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded">
                      {comp}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Raw text (collapsible) */}
            <details className="mt-3">
              <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
                View original feedback
              </summary>
              <p className="mt-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-md whitespace-pre-wrap">
                {item.raw_text}
              </p>
            </details>
          </div>
        ))}
      </div>
    </div>
  );
}
