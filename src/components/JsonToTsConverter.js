import React, { useState } from 'react';

const JsonToTsConverter = ({ onClose }) => {
  const [jsonInput, setJsonInput] = useState('');
  const [tsInterface, setTsInterface] = useState('');
  
  const generateInterface = () => {
    try {
      const jsonObject = JSON.parse(jsonInput);
      let result = 'interface GeneratedInterface {\n';
      
      for (const key in jsonObject) {
        const value = jsonObject[key];
        let type = typeof value;

        if (Array.isArray(value)) {
          type = `${typeof value[0]}[]`;
        } else if (value === null) {
          type = 'any';
        }

        result += `  ${key}: ${type};\n`;
      }

      result += '}';
      setTsInterface(result);
    } catch (error) {
      setTsInterface('// Invalid JSON format');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(tsInterface);
  };

  return (
    <div className="flex flex-col h-full bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-2">JSON to TypeScript Converter</h2>
      <textarea
        className="w-full h-40 p-2 border rounded-md focus:outline-none focus:ring"
        placeholder="Paste JSON here..."
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
      />
      <button 
        onClick={generateInterface} 
        className="mt-2 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Convert
      </button>
      {tsInterface && (
        <div className="mt-3">
          <h3 className="text-md font-semibold">Generated TypeScript Interface:</h3>
          <pre className="bg-gray-100 p-2 rounded-md">{tsInterface}</pre>
          <button 
            onClick={copyToClipboard} 
            className="mt-2 p-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Copy to Clipboard
          </button>
        </div>
      )}
      <button 
        onClick={onClose} 
        className="mt-4 p-2 bg-red-500 text-white rounded-md hover:bg-red-600"
      >
        Close
      </button>
    </div>
  );
};

export default JsonToTsConverter;