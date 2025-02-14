import React, { useState } from 'react';
import { motion } from 'framer-motion';

const URLParser = ({ onClose }) => {
  const [urlInput, setUrlInput] = useState('');
  const [parsedData, setParsedData] = useState(null);
  const [error, setError] = useState('');

  const parseURL = () => {
    try {
      const url = new URL(urlInput);
      const queryParams = {};
      url.searchParams.forEach((value, key) => {
        queryParams[key] = value;
      });

      setParsedData({
        protocol: url.protocol.replace(':', ''),
        hostname: url.hostname,
        port: url.port || '80',
        pathname: url.pathname,
        queryParams,
        hash: url.hash.replace('#', '') || 'None'
      });
      setError('');
    } catch (err) {
      setError('Invalid URL format. Please enter a valid URL.');
      setParsedData(null);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 p-4 space-y-4">
      {/* Window Header */}
      <div className="flex items-center justify-between pb-2 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-700">URL Parser</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          ✕
        </button>
      </div>

      {/* Main Content */}
      <div className="flex flex-col space-y-4 flex-grow overflow-hidden">
        <div className="flex space-x-2">
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Enter URL to parse..."
            className="flex-grow px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="URL input"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={parseURL}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Parse
          </motion.button>
        </div>

        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        {parsedData && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col space-y-4 overflow-y-auto"
          >
            {/* Protocol Section */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Protocol</h3>
              <p className="font-mono text-blue-600">{parsedData.protocol}</p>
            </div>

            {/* Hostname Section */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Hostname</h3>
              <p className="font-mono text-green-600">{parsedData.hostname}</p>
            </div>

            {/* Path Section */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Path</h3>
              <p className="font-mono text-purple-600">{parsedData.pathname}</p>
            </div>

            {/* Query Parameters */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Query Parameters</h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(parsedData.queryParams).map(([key, value]) => (
                  <div key={key} className="flex space-x-2">
                    <span className="text-gray-600">{key}:</span>
                    <span className="font-mono text-orange-600">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default URLParser;