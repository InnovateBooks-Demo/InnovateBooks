import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, X, ArrowRight, UserPlus, Building, Truck, FileText, 
  Receipt, Folder, User, CheckSquare, FileSignature, Zap,
  Clock, ArrowUp, ArrowDown, Loader2
} from 'lucide-react';
import { authService } from '../utils/auth';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const iconMap = {
  'user-plus': UserPlus,
  'building': Building,
  'truck': Truck,
  'file-text': FileText,
  'receipt': Receipt,
  'folder': Folder,
  'user': User,
  'check-square': CheckSquare,
  'file-signature': FileSignature,
  'zap': Zap
};

const moduleColors = {
  'Commerce': 'bg-blue-100 text-blue-700',
  'Finance': 'bg-green-100 text-green-700',
  'Operations': 'bg-purple-100 text-purple-700',
  'Workforce': 'bg-orange-100 text-orange-700',
  'Intelligence': 'bg-rose-100 text-rose-700',
  'Workspace': 'bg-cyan-100 text-cyan-700'
};

const GlobalSearch = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState([]);
  const inputRef = useRef(null);
  const resultsRef = useRef(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      fetchRecentSearches();
    }
  }, [isOpen]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (results[selectedIndex]) {
            handleSelect(results[selectedIndex]);
          }
          break;
        case 'Escape':
          onClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onClose]);

  // Scroll selected item into view
  useEffect(() => {
    if (resultsRef.current && results.length > 0) {
      const selectedElement = resultsRef.current.children[selectedIndex];
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex, results.length]);

  const fetchRecentSearches = async () => {
    try {
      const token = authService.getToken();
      const response = await fetch(`${API_URL}/api/search/recent`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setRecentSearches(data.recent || []);
      }
    } catch (error) {
      console.error('Failed to fetch recent searches:', error);
    }
  };

  const search = useCallback(async (searchQuery) => {
    if (!searchQuery || searchQuery.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const token = authService.getToken();
      const response = await fetch(`${API_URL}/api/search/global?q=${encodeURIComponent(searchQuery)}&limit=10`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setResults(data.results || []);
        setSelectedIndex(0);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      search(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query, search]);

  const handleSelect = async (result) => {
    // Log search
    try {
      const token = authService.getToken();
      await fetch(`${API_URL}/api/search/log?query=${encodeURIComponent(query)}&result_type=${result.type}&result_id=${result.id}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (error) {
      // Ignore logging errors
    }

    navigate(result.path);
    onClose();
    setQuery('');
  };

  if (!isOpen) return null;

  const Icon = (iconName) => iconMap[iconName] || FileText;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" data-testid="global-search">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Search Modal */}
      <div className="relative min-h-screen flex items-start justify-center pt-[15vh] px-4">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center gap-3 px-4 py-4 border-b">
            <Search className="w-5 h-5 text-slate-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search leads, invoices, projects, people..."
              className="flex-1 text-lg outline-none placeholder-slate-400"
            />
            {loading && <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />}
            <kbd className="hidden sm:inline-flex items-center px-2 py-1 bg-slate-100 text-slate-500 text-xs rounded font-mono">
              ESC
            </kbd>
          </div>

          {/* Results */}
          <div ref={resultsRef} className="max-h-[400px] overflow-y-auto">
            {results.length > 0 ? (
              <div className="py-2">
                {results.map((result, index) => {
                  const ResultIcon = Icon(result.icon);
                  return (
                    <button
                      key={`${result.type}-${result.id}`}
                      onClick={() => handleSelect(result)}
                      className={`w-full flex items-center gap-4 px-4 py-3 text-left transition-colors ${
                        index === selectedIndex ? 'bg-slate-100' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                        <ResultIcon className="w-5 h-5 text-slate-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-slate-900 truncate">{result.title}</span>
                          <span className={`px-2 py-0.5 text-xs rounded-full ${moduleColors[result.module] || 'bg-slate-100 text-slate-600'}`}>
                            {result.module}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500 truncate">{result.subtitle}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                    </button>
                  );
                })}
              </div>
            ) : query.length >= 2 && !loading ? (
              <div className="py-12 text-center">
                <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">No results found for "{query}"</p>
              </div>
            ) : recentSearches.length > 0 && query.length < 2 ? (
              <div className="py-2">
                <p className="px-4 py-2 text-xs font-medium text-slate-400 uppercase">Recent Searches</p>
                {recentSearches.map((recent, index) => (
                  <button
                    key={`item-${index}`}
                    onClick={() => setQuery(recent.query)}
                    className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-slate-50"
                  >
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-700">{recent.query}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-slate-500">
                <p>Start typing to search across all modules</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t bg-slate-50 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <ArrowUp className="w-3 h-3" />
                <ArrowDown className="w-3 h-3" />
                to navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white border rounded">↵</kbd>
                to select
              </span>
            </div>
            <span>Search across Commerce, Finance, Operations, Workforce</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalSearch;
