import { useState, useEffect } from 'react';
import FeedbackForm from './components/FeedbackForm';
import FeedbackList from './components/FeedbackList';
import WebSignals from './components/WebSignals';
import Dashboard from './components/Dashboard';
import BriefGenerator from './components/BriefGenerator';
import { getFeedbackItems, getWebSignals, getBriefs } from './utils/storage';
import { loadDemoData, clearAllData, shouldAutoLoadDemo } from './utils/demoData';

function App() {
  const [feedbackItems, setFeedbackItems] = useState([]);
  const [webSignals, setWebSignals] = useState([]);
  const [briefs, setBriefs] = useState([]);
  const [activeTab, setActiveTab] = useState('input');

  useEffect(() => {
    // Auto-load demo data on first visit
    if (shouldAutoLoadDemo()) {
      loadDemoData();
    }
    // Load existing data on mount
    setFeedbackItems(getFeedbackItems());
    setWebSignals(getWebSignals());
    setBriefs(getBriefs());
  }, []);

  const handleSignalsUpdated = () => {
    setWebSignals(getWebSignals());
  };

  const handleBriefsUpdated = () => {
    setBriefs(getBriefs());
  };

  const handleLoadDemo = () => {
    if (confirm('This will replace all current data with demo data. Continue?')) {
      loadDemoData();
      setFeedbackItems(getFeedbackItems());
      setWebSignals(getWebSignals());
      setBriefs(getBriefs());
      setActiveTab('dashboard');
    }
  };

  const handleClearData = () => {
    if (confirm('This will delete all feedback, signals, and briefs. Continue?')) {
      clearAllData();
      setFeedbackItems([]);
      setWebSignals([]);
      setBriefs([]);
    }
  };

  const handleFeedbackAdded = (items) => {
    setFeedbackItems(items);
    setActiveTab('feedback'); // Switch to feedback tab after adding
  };

  const handleFeedbackDeleted = (items) => {
    setFeedbackItems(items);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#ff7000] rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">VoC Intelligence</h1>
                <p className="text-sm text-gray-500">Voice of Customer → Product Intelligence</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleLoadDemo}
                  className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  Load Demo Data
                </button>
                <button
                  onClick={handleClearData}
                  className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                  Clear All
                </button>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>Powered by</span>
                <span className="font-semibold text-[#ff7000]">Mistral AI</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab('input')}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'input'
                  ? 'border-[#ff7000] text-[#ff7000]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Add Feedback
            </button>
            <button
              onClick={() => setActiveTab('feedback')}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                activeTab === 'feedback'
                  ? 'border-[#ff7000] text-[#ff7000]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Feedback
              {feedbackItems.length > 0 && (
                <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                  {feedbackItems.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('signals')}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                activeTab === 'signals'
                  ? 'border-[#ff7000] text-[#ff7000]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Web Signals
              {webSignals.length > 0 && (
                <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                  {webSignals.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'dashboard'
                  ? 'border-[#ff7000] text-[#ff7000]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('briefs')}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                activeTab === 'briefs'
                  ? 'border-[#ff7000] text-[#ff7000]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Product Briefs
              {briefs.length > 0 && (
                <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                  {briefs.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {activeTab === 'input' && (
          <div className="max-w-2xl mx-auto">
            <FeedbackForm onFeedbackAdded={handleFeedbackAdded} />
          </div>
        )}

        {activeTab === 'feedback' && (
          <FeedbackList
            items={feedbackItems}
            onItemDeleted={handleFeedbackDeleted}
          />
        )}

        {activeTab === 'signals' && (
          <WebSignals
            signals={webSignals}
            onSignalsUpdated={handleSignalsUpdated}
          />
        )}

        {activeTab === 'dashboard' && (
          <Dashboard
            feedbackItems={feedbackItems}
            webSignals={webSignals}
          />
        )}

        {activeTab === 'briefs' && (
          <BriefGenerator
            feedbackItems={feedbackItems}
            webSignals={webSignals}
            briefs={briefs}
            onBriefsUpdated={handleBriefsUpdated}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-auto">
        <div className="max-w-6xl mx-auto px-4 py-4 text-center text-sm text-gray-500">
          Built for Mistral AI Customer Success
        </div>
      </footer>
    </div>
  );
}

export default App;
