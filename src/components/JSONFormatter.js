// JSONFormatter.js
import React, { useState } from 'react';
import { FiCheckCircle, FiXCircle, FiWifi, FiWifiOff, FiMoon, FiSun } from 'react-icons/fi';
import { motion } from 'framer-motion';

const JSONFormatter = ({ onClose }) => {
  const [input, setInput] = useState('');
  const [formatted, setFormatted] = useState('');
  const [isValid, setIsValid] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  const formatJSON = () => {
    try {
      const parsed = JSON.parse(input);
      const formattedJSON = JSON.stringify(parsed, null, 2);
      setFormatted(formattedJSON);
      setIsValid(true);
    } catch (error) {
      setIsValid(false);
      setFormatted(error.message);
    }
  };

  const validateJSON = () => {
    try {
      JSON.parse(input);
      setIsValid(true);
    } catch (error) {
      setIsValid(false);
    }
  };

  const copyToClipboard = async () => {
    if (formatted) {
      await navigator.clipboard.writeText(formatted);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Window Title Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-100 border-b">
        <div className="flex items-center space-x-2">
          <button
            onClick={onClose}
            className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600"
          />
          <button className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600" />
          <button className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600" />
        </div>
        <h1 className="text-sm font-medium text-gray-700">JSON Formatter</h1>
        <div className="w-12" /> {/* Spacer for balance */}
      </div>

      {/* Main Content */}
      <div className="flex flex-1 p-4 space-x-4 overflow-hidden">
        <div className="flex flex-col flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-600">Input JSON</label>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-1 rounded hover:bg-gray-200"
              >
                {darkMode ? <FiSun className="w-4 h-4" /> : <FiMoon className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className={`flex-1 p-3 font-mono text-sm rounded-lg border focus:outline-none focus:ring-2 ${
              darkMode 
                ? 'bg-gray-800 text-gray-100 border-gray-700'
                : 'bg-white text-gray-800 border-gray-300'
            }`}
            placeholder="Paste your JSON here..."
          />
        </div>

        <div className="flex flex-col flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-600">Formatted Output</label>
            <div className="flex items-center space-x-2">
              {isValid !== null && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center space-x-1"
                >
                  {isValid ? (
                    <FiCheckCircle className="text-green-500" />
                  ) : (
                    <FiXCircle className="text-red-500" />
                  )}
                  <span className="text-xs">
                    {isValid ? 'Valid JSON' : 'Invalid JSON'}
                  </span>
                </motion.div>
              )}
            </div>
          </div>
          <pre
            className={`flex-1 p-3 font-mono text-sm rounded-lg overflow-auto ${
              darkMode
                ? 'bg-gray-800 text-gray-100'
                : 'bg-white text-gray-800'
            }`}
          >
            {formatted}
          </pre>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-100 border-t">
        <div className="flex space-x-2">
          <button
            onClick={formatJSON}
            className="px-3 py-1 text-sm font-medium rounded-md bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Format
          </button>
          <button
            onClick={validateJSON}
            className="px-3 py-1 text-sm font-medium rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Validate
          </button>
          <button
            onClick={copyToClipboard}
            className="px-3 py-1 text-sm font-medium rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Copy
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">
            {input.length} characters
          </span>
          {input.length > 0 && (
            <button
              onClick={() => {
                setInput('');
                setFormatted('');
                setIsValid(null);
              }}
              className="text-sm text-red-500 hover:text-red-600"
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default JSONFormatter;