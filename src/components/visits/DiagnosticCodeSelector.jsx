import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { searchDiagnosticCodes } from '../../services/diagnosticCodeService';
import debounce from 'lodash.debounce';

const DiagnosticCodeSelector = ({ onSelect, selectedCodes = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Create a debounced search function
  const debouncedSearch = debounce(async (term) => {
    if (!term || term.trim().length < 2) {
      setSearchResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const result = await searchDiagnosticCodes(term);
    
    if (result.success) {
      // Filter out already selected codes
      const selectedIds = selectedCodes.map(code => code.id);
      const filteredResults = result.data.filter(code => !selectedIds.includes(code.id));
      setSearchResults(filteredResults);
    } else {
      setSearchResults([]);
    }
    
    setIsLoading(false);
  }, 300);

  // Handle search input changes
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  // Clear search when component unmounts
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, []);

  // Handle code selection
  const handleSelectCode = (code) => {
    onSelect(code);
    setSearchTerm('');
    setSearchResults([]);
  };

  return (
    <div className="relative">
      <div className="relative">
        <SafeIcon 
          icon={FiIcons.FiSearch} 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" 
        />
        <input
          type="text"
          placeholder="Search diagnostic codes by code or description..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600"></div>
          </div>
        )}
      </div>
      
      {searchResults.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          <ul>
            {searchResults.map((code) => (
              <li 
                key={code.id} 
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                onClick={() => handleSelectCode(code)}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{code.code}</p>
                    <p className="text-sm text-gray-600">{code.description}</p>
                  </div>
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                    {code.category}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
      
      {searchTerm && searchResults.length === 0 && !isLoading && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg p-4 text-center"
        >
          <p className="text-gray-500">No diagnostic codes found. Try another search term.</p>
        </motion.div>
      )}
    </div>
  );
};

export default DiagnosticCodeSelector;