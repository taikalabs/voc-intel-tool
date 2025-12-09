import { useState } from 'react';
import { classifyFeedback } from '../utils/mistral';
import { saveFeedbackItem, generateId } from '../utils/storage';

const SOURCE_OPTIONS = [
  { value: 'call_notes', label: 'Call Notes' },
  { value: 'support', label: 'Support Ticket' },
  { value: 'nps', label: 'NPS Comment' },
  { value: 'qbr', label: 'QBR Notes' },
  { value: 'email', label: 'Email' },
  { value: 'slack', label: 'Slack Message' }
];

const ARR_TIERS = [
  { value: 'enterprise', label: 'Enterprise ($100K+)' },
  { value: 'mid_market', label: 'Mid-Market ($25-100K)' },
  { value: 'smb', label: 'SMB (<$25K)' }
];

const HEALTH_OPTIONS = [
  { value: 'healthy', label: 'Healthy' },
  { value: 'at_risk', label: 'At Risk' },
  { value: 'churned', label: 'Churned' }
];

const STRATEGIC_VALUE = [
  { value: 'lighthouse', label: 'Lighthouse' },
  { value: 'standard', label: 'Standard' },
  { value: 'low_touch', label: 'Low-touch' }
];

export default function FeedbackForm({ onFeedbackAdded }) {
  const [feedbackText, setFeedbackText] = useState('');
  const [source, setSource] = useState('call_notes');
  const [customerName, setCustomerName] = useState('');
  const [arrTier, setArrTier] = useState('mid_market');
  const [customerHealth, setCustomerHealth] = useState('healthy');
  const [strategicValue, setStrategicValue] = useState('standard');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;

    setIsProcessing(true);
    setError(null);

    try {
      // Classify feedback using Mistral
      const classification = await classifyFeedback(feedbackText);

      // Create feedback item
      const feedbackItem = {
        id: generateId(),
        timestamp: new Date().toISOString(),
        source,
        raw_text: feedbackText,
        customer_name: customerName,
        arr_tier: arrTier,
        customer_health: customerHealth,
        strategic_value: strategicValue,
        ...classification
      };

      // Save to localStorage
      const updatedItems = saveFeedbackItem(feedbackItem);

      // Reset form
      setFeedbackText('');
      setCustomerName('');

      // Notify parent
      onFeedbackAdded(updatedItems);
    } catch (err) {
      setError(err.message || 'Failed to process feedback');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Add Customer Feedback</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      {/* Feedback Text */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Feedback Text
        </label>
        <textarea
          value={feedbackText}
          onChange={(e) => setFeedbackText(e.target.value)}
          placeholder="Paste customer feedback here (call notes, support ticket, NPS comment, etc.)"
          className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff7000] focus:border-transparent resize-none"
          required
        />
      </div>

      {/* Two column layout for customer context */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Customer Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Customer Name
          </label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="e.g., Acme Corp"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff7000] focus:border-transparent"
          />
        </div>

        {/* Source */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Source
          </label>
          <select
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff7000] focus:border-transparent"
          >
            {SOURCE_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* ARR Tier */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ARR Tier
          </label>
          <select
            value={arrTier}
            onChange={(e) => setArrTier(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff7000] focus:border-transparent"
          >
            {ARR_TIERS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Customer Health */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Customer Health
          </label>
          <select
            value={customerHealth}
            onChange={(e) => setCustomerHealth(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff7000] focus:border-transparent"
          >
            {HEALTH_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Strategic Value */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Strategic Value
          </label>
          <select
            value={strategicValue}
            onChange={(e) => setStrategicValue(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff7000] focus:border-transparent"
          >
            {STRATEGIC_VALUE.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isProcessing || !feedbackText.trim()}
        className="w-full py-2 px-4 bg-[#ff7000] hover:bg-[#e06000] text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isProcessing ? (
          <>
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Processing with Mistral...
          </>
        ) : (
          'Analyze & Store Feedback'
        )}
      </button>
    </form>
  );
}
