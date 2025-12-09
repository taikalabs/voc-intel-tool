import { useState } from 'react';
import { searchBrave, SEARCH_QUERIES } from '../utils/brave';
import { analyzeWebSignal } from '../utils/mistral';
import { saveWebSignal, generateId } from '../utils/storage';

const SOURCE_COLORS = {
  'Reddit': 'bg-orange-100 text-orange-800',
  'Hacker News': 'bg-amber-100 text-amber-800',
  'X/Twitter': 'bg-sky-100 text-sky-800',
  'GitHub': 'bg-gray-100 text-gray-800',
  'Medium': 'bg-green-100 text-green-800',
  'Dev.to': 'bg-indigo-100 text-indigo-800',
  'Stack Overflow': 'bg-orange-100 text-orange-700'
};

const SENTIMENT_BADGES = {
  positive: 'bg-green-100 text-green-800',
  neutral: 'bg-gray-100 text-gray-800',
  negative: 'bg-red-100 text-red-800',
  mixed: 'bg-yellow-100 text-yellow-800'
};

export default function WebSignals({ signals, onSignalsUpdated }) {
  const [selectedQueries, setSelectedQueries] = useState(['general', 'reddit']);
  const [customQuery, setCustomQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(null);
  const [error, setError] = useState(null);

  const handleQueryToggle = (queryId) => {
    setSelectedQueries(prev =>
      prev.includes(queryId)
        ? prev.filter(id => id !== queryId)
        : [...prev, queryId]
    );
  };

  const handleSearch = async () => {
    if (selectedQueries.length === 0 && !customQuery.trim()) return;

    setIsSearching(true);
    setError(null);
    setSearchResults([]);

    try {
      const allResults = [];

      // Search selected predefined queries
      for (const queryId of selectedQueries) {
        const query = SEARCH_QUERIES.find(q => q.id === queryId);
        if (query) {
          const results = await searchBrave(query.query, 5);
          allResults.push({
            queryId: query.id,
            queryLabel: query.label,
            query: query.query,
            results
          });
        }
      }

      // Search custom query if provided
      if (customQuery.trim()) {
        const results = await searchBrave(customQuery, 5);
        allResults.push({
          queryId: 'custom',
          queryLabel: 'Custom Search',
          query: customQuery,
          results
        });
      }

      setSearchResults(allResults);
    } catch (err) {
      setError(err.message || 'Failed to search');
    } finally {
      setIsSearching(false);
    }
  };

  const handleAnalyzeAndSave = async (result, queryLabel) => {
    setIsAnalyzing(result.url);

    try {
      // Analyze with Mistral
      const analysis = await analyzeWebSignal(
        `${result.title}\n\n${result.description}`,
        result.source
      );

      // Create signal object
      const signal = {
        id: generateId(),
        timestamp: new Date().toISOString(),
        source: 'web',
        web_source: result.source,
        web_url: result.url,
        raw_text: `${result.title}\n\n${result.description}`,
        title: result.title,
        search_query: queryLabel,
        age: result.age,
        ...analysis
      };

      // Save to storage
      saveWebSignal(signal);

      // Update parent
      onSignalsUpdated();

      // Show success briefly
      alert('Signal analyzed and saved!');
    } catch (err) {
      alert(`Failed to analyze: ${err.message}`);
    } finally {
      setIsAnalyzing(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Panel */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Search Web Signals</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        {/* Predefined Queries */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Search Topics
          </label>
          <div className="flex flex-wrap gap-2">
            {SEARCH_QUERIES.map(query => (
              <button
                key={query.id}
                onClick={() => handleQueryToggle(query.id)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  selectedQueries.includes(query.id)
                    ? 'bg-[#ff7000] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {query.label}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Query */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Custom Search Query
          </label>
          <input
            type="text"
            value={customQuery}
            onChange={(e) => setCustomQuery(e.target.value)}
            placeholder="e.g., Mistral fine-tuning enterprise"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff7000] focus:border-transparent"
          />
        </div>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          disabled={isSearching || (selectedQueries.length === 0 && !customQuery.trim())}
          className="w-full py-2 px-4 bg-[#ff7000] hover:bg-[#e06000] text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSearching ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Searching...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search Web
            </>
          )}
        </button>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="space-y-6">
          {searchResults.map(group => (
            <div key={group.queryId} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{group.queryLabel}</h3>
              <p className="text-sm text-gray-500 mb-4">Query: "{group.query}"</p>

              {group.results.length === 0 ? (
                <p className="text-gray-500 text-sm">No results found</p>
              ) : (
                <div className="space-y-4">
                  {group.results.map((result, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${SOURCE_COLORS[result.source] || 'bg-gray-100 text-gray-800'}`}>
                              {result.source}
                            </span>
                            <span className="text-xs text-gray-500">{result.age}</span>
                          </div>
                          <a
                            href={result.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 font-medium line-clamp-2"
                          >
                            {result.title}
                          </a>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {result.description}
                          </p>
                        </div>
                        <button
                          onClick={() => handleAnalyzeAndSave(result, group.queryLabel)}
                          disabled={isAnalyzing === result.url}
                          className="flex-shrink-0 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-md transition-colors disabled:opacity-50 flex items-center gap-1"
                        >
                          {isAnalyzing === result.url ? (
                            <>
                              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                              </svg>
                              Analyzing...
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                              Analyze & Save
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Saved Signals */}
      {signals.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Saved Web Signals ({signals.length})
          </h2>
          <div className="space-y-3">
            {signals.map(signal => (
              <div key={signal.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${SOURCE_COLORS[signal.web_source] || 'bg-gray-100 text-gray-800'}`}>
                        {signal.web_source}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${SENTIMENT_BADGES[signal.sentiment] || 'bg-gray-100 text-gray-800'}`}>
                        {signal.sentiment}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        signal.relevance === 'high' ? 'bg-purple-100 text-purple-800' :
                        signal.relevance === 'medium' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {signal.relevance} relevance
                      </span>
                    </div>
                    <a
                      href={signal.web_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {signal.title}
                    </a>
                    <p className="text-sm text-gray-700 mt-1">{signal.theme}</p>

                    {signal.key_points?.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-500 mb-1">Key Points:</p>
                        <ul className="text-sm text-gray-600 list-disc list-inside">
                          {signal.key_points.map((point, i) => (
                            <li key={i}>{point}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {signal.competitors_mentioned?.length > 0 && (
                      <div className="flex items-center gap-1 mt-2">
                        <span className="text-xs text-gray-500">Competitors:</span>
                        {signal.competitors_mentioned.map((comp, i) => (
                          <span key={i} className="bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded text-xs">
                            {comp}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-gray-500 flex-shrink-0">
                    {new Date(signal.timestamp).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {signals.length === 0 && searchResults.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
          <p className="text-lg font-medium">Search for Web Signals</p>
          <p className="text-sm">Select topics above and search to find public sentiment about Mistral AI</p>
        </div>
      )}
    </div>
  );
}
