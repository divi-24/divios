import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const Base64EncoderDecoder = ({ onClose }) => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState('encode');
  const [inputMode, setInputMode] = useState('text');
  const [fileName, setFileName] = useState('');

  const handleEncode = () => {
    try {
      setError('');
      const encoded = btoa(unescape(encodeURIComponent(input)));
      setOutput(encoded);
    } catch (err) {
      setError('Invalid input for encoding');
    }
  };

  const handleDecode = () => {
    try {
      setError('');
      const decoded = decodeURIComponent(escape(atob(input)));
      setOutput(decoded);
    } catch (err) {
      setError('Invalid Base64 input for decoding');
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target.result.split(',')[1];
      setInput(base64);
    };
    reader.onerror = () => setError('Error reading file');
    reader.readAsDataURL(file);
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setError('');
    setFileName('');
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Window Header */}
      <div className="flex items-center justify-between p-4 bg-gray-100 border-b">
        <div className="flex space-x-2">
          <button onClick={onClose} className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600"/>
          <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600"/>
          <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600"/>
        </div>
        <h1 className="text-sm font-semibold text-gray-700">Base64 Converter</h1>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 space-y-4 overflow-auto">
        {/* Mode Selector */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setMode('encode')}
            className={`px-4 py-1 rounded-lg text-sm ${mode === 'encode' ? 
              'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Encode
          </button>
          <button
            onClick={() => setMode('decode')}
            className={`px-4 py-1 rounded-lg text-sm ${mode === 'decode' ? 
              'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Decode
          </button>
        </div>

        {/* Input Mode Selector */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setInputMode('text')}
            className={`px-4 py-1 rounded-lg text-sm ${inputMode === 'text' ? 
              'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Text
          </button>
          <button
            onClick={() => setInputMode('file')}
            className={`px-4 py-1 rounded-lg text-sm ${inputMode === 'file' ? 
              'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            File
          </button>
        </div>

        {/* Input Section */}
        {inputMode === 'file' ? (
          <div className="space-y-2">
            <label className="flex flex-col items-center px-4 py-6 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <span className="text-gray-500 mb-2">Click to upload file</span>
              <input
                type="file"
                className="hidden"
                onChange={handleFileUpload}
              />
              {fileName && <span className="text-sm text-gray-600 mt-2">{fileName}</span>}
            </label>
          </div>
        ) : (
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Enter ${mode === 'encode' ? 'text to encode' : 'Base64 to decode'}`}
            className="w-full h-32 p-3 border rounded-lg font-mono text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={mode === 'encode' ? handleEncode : handleDecode}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 active:bg-blue-700 transition-colors"
          >
            {mode === 'encode' ? 'Encode' : 'Decode'}
          </button>
          <button
            onClick={clearAll}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Clear
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-3 text-red-600 bg-red-100 rounded-lg"
          >
            {error}
          </motion.div>
        )}

        {/* Output Section */}
        {output && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-700">Result:</h3>
              <CopyToClipboard text={output}>
                <button className="px-3 py-1 text-sm bg-gray-200 rounded-lg hover:bg-gray-300">
                  Copy
                </button>
              </CopyToClipboard>
            </div>
            <pre className="p-3 bg-white border rounded-lg overflow-x-auto font-mono text-sm">
              {output}
            </pre>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Base64EncoderDecoder;