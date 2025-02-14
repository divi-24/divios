import React, { useState } from 'react';
import { motion } from 'framer-motion';

const RegexTester = ({ onClose }) => {
  const [regex, setRegex] = useState('');
  const [testString, setTestString] = useState('');
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState(null);

  const handleTest = () => {
    try {
      const pattern = new RegExp(regex, 'g');
      const matchResults = testString.match(pattern) || [];
      setMatches(matchResults);
      setError(null);
    } catch (err) {
      setError('Invalid Regular Expression');
      setMatches([]);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white p-4 rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-2 mb-4">
        <h2 className="text-lg font-bold text-gray-800">Regex Tester</h2>
        <button onClick={onClose} className="text-red-500 hover:text-red-700">✖</button>
      </div>

      {/* Input Fields */}
      <label className="text-sm font-medium text-gray-700">Regular Expression:</label>
      <input
        type="text"
        className="border p-2 rounded mb-2 w-full"
        placeholder="Enter your regex here..."
        value={regex}
        onChange={(e) => setRegex(e.target.value)}
      />

      <label className="text-sm font-medium text-gray-700">Test String:</label>
      <textarea
        className="border p-2 rounded mb-2 w-full h-24"
        placeholder="Enter text to test the regex..."
        value={testString}
        onChange={(e) => setTestString(e.target.value)}
      />

      {/* Test Button */}
      <button
        onClick={handleTest}
        className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
      >
        Test Regex
      </button>

      {/* Error Display */}
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      {/* Results */}
      <div className="mt-4">
        <h3 className="text-md font-semibold">Matches:</h3>
        <div className="border p-2 rounded bg-gray-100 h-24 overflow-auto">
          {matches.length > 0 ? (
            matches.map((match, index) => (
              <motion.p 
                key={index} 
                className="text-green-600 text-sm" 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {match}
              </motion.p>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No matches found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegexTester;
