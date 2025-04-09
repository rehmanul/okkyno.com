import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Command } from "cmdk";

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchResult {
  id: string;
  type: 'product' | 'article' | 'category';
  title: string;
  description?: string;
  image?: string;
  url: string;
}

const SearchDialog: React.FC<SearchDialogProps> = ({ isOpen, onClose }) => {
  const [, setLocation] = useLocation();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Mock search results - replace with actual API call
  const searchItems = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const mockResults: SearchResult[] = [
      {
        id: '1',
        type: 'product' as const,
        title: 'Organic Vegetable Seeds Collection',
        description: 'Premium quality seeds for your garden',
        image: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=120&h=120&fit=crop',
        url: '/products/organic-seeds'
      },
      {
        id: '2',
        type: 'article' as const,
        title: 'Growing Guide: Starting Your First Garden',
        description: 'Learn the basics of gardening',
        image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=120&h=120&fit=crop',
        url: '/guides/beginners'
      },
      {
        id: '3',
        type: 'category' as const,
        title: 'Raised Beds',
        description: 'Explore our raised bed collection',
        image: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=120&h=120&fit=crop',
        url: '/category/raised-beds'
      },
    ].filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setResults(mockResults);
    setLoading(false);
  }, []);

  useEffect(() => {
    searchItems(query);
  }, [query, searchItems]);

  const handleSelect = (result: SearchResult) => {
    setLocation(result.url);
    onClose();
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex(i => (i + 1) % results.length);
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex(i => (i - 1 + results.length) % results.length);
          break;
        case "Enter":
          e.preventDefault();
          if (results[selectedIndex]) {
            handleSelect(results[selectedIndex]);
          }
          break;
        case "Escape":
          e.preventDefault();
          onClose();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, results, selectedIndex, handleSelect, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50"
            onClick={onClose}
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative min-h-screen flex items-start justify-center p-4 sm:p-6"
          >
            <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden mt-[10vh]">
              {/* Search Input */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <i className="fas fa-search text-gray-400"></i>
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search Okkyno Gardening..."
                    className="flex-1 bg-transparent border-none outline-none text-lg placeholder:text-gray-400"
                    autoFocus
                  />
                  <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs font-mono font-medium text-gray-500 bg-gray-100 rounded">
                    <span className="text-xs">⌘</span>K
                  </kbd>
                </div>
              </div>

              {/* Results */}
              <div className="max-h-[60vh] overflow-y-auto">
                {loading ? (
                  <div className="p-4 text-center text-gray-500">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="inline-block"
                    >
                      <i className="fas fa-circle-notch text-xl"></i>
                    </motion.div>
                    <p className="mt-2">Searching...</p>
                  </div>
                ) : results.length > 0 ? (
                  <div className="p-2">
                    {results.map((result, index) => (
                      <motion.div
                        key={result.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`p-2 rounded-lg cursor-pointer ${
                          selectedIndex === index ? 'bg-gray-100' : 'hover:bg-gray-50'
                        }`}
                        onClick={() => handleSelect(result)}
                      >
                        <div className="flex items-center gap-4">
                          {result.image && (
                            <img
                              src={result.image}
                              alt={result.title}
                              className="w-12 h-12 rounded-md object-cover"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className={`
                                px-2 py-1 rounded-full text-xs font-medium
                                ${result.type === 'product' ? 'bg-primary/10 text-primary' :
                                  result.type === 'article' ? 'bg-blue-100 text-blue-700' :
                                  'bg-gray-100 text-gray-700'}
                              `}>
                                {result.type}
                              </span>
                              <h3 className="font-medium text-gray-900 truncate">
                                {result.title}
                              </h3>
                            </div>
                            {result.description && (
                              <p className="text-sm text-gray-500 truncate">
                                {result.description}
                              </p>
                            )}
                          </div>
                          <i className="fas fa-arrow-right text-gray-400"></i>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : query ? (
                  <div className="p-8 text-center text-gray-500">
                    <i className="fas fa-search text-4xl mb-4"></i>
                    <p>No results found for "{query}"</p>
                    <p className="text-sm mt-2">Try searching for something else</p>
                  </div>
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    <i className="fas fa-keyboard text-4xl mb-4"></i>
                    <p>Start typing to search</p>
                    <p className="text-sm mt-2">Search Okkyno's products, guides, or categories</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-4">
                    <span>
                      <kbd className="px-2 py-1 text-xs font-mono bg-gray-100 rounded">↑</kbd>
                      <kbd className="px-2 py-1 text-xs font-mono bg-gray-100 rounded ml-1">↓</kbd>
                      to navigate
                    </span>
                    <span>
                      <kbd className="px-2 py-1 text-xs font-mono bg-gray-100 rounded">enter</kbd>
                      to select
                    </span>
                  </div>
                  <span>
                    <kbd className="px-2 py-1 text-xs font-mono bg-gray-100 rounded">esc</kbd>
                    to close
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SearchDialog;