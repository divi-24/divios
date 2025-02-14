// CSSGradientGenerator.js
import React, { useState, useEffect } from 'react';
import { FiCopy, FiPlus, FiX } from 'react-icons/fi';
import { motion } from 'framer-motion';

const CSSGradientGenerator = ({ onClose }) => {
  const [angle, setAngle] = useState(90);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [colors, setColors] = useState([
    { value: '#3b82f6', position: 0 },
    { value: '#8b5cf6', position: 100 },
  ]);
  const [showCopied, setShowCopied] = useState(false);

  const gradientString = `linear-gradient(${angle}deg, ${colors
    .map(c => `${c.value} ${c.position}%`)
    .join(', ')})`;

  const addColorStop = () => {
    const newColors = [...colors];
    newColors.splice(selectedColorIndex + 1, 0, {
      value: '#ffffff',
      position: Math.round((colors[selectedColorIndex].position + colors[selectedColorIndex + 1]?.position) / 2) || 50,
    });
    setColors(newColors);
  };

  const removeColorStop = index => {
    if (colors.length <= 2) return;
    setColors(colors.filter((_, i) => i !== index));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`background: ${gradientString};`);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Window Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">CSS Gradient Generator</h2>
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-gray-200 transition-colors"
          aria-label="Close"
        >
          <FiX className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <div className="flex-1 p-6 space-y-6 overflow-auto">
        {/* Gradient Preview */}
        <motion.div
          className="w-full h-32 rounded-xl shadow-sm border border-gray-200"
          style={{ background: gradientString }}
          animate={{ background: gradientString }}
          transition={{ duration: 0.3 }}
        />

        {/* Controls */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Angle</label>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="0"
                max="360"
                value={angle}
                onChange={e => setAngle(e.target.value)}
                className="w-32 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <input
                type="number"
                value={angle}
                onChange={e => setAngle(Math.min(360, Math.max(0, e.target.value)))}
                className="w-16 px-2 py-1 text-sm border border-gray-300 rounded-md"
              />
            </div>
          </div>

          {/* Color Stops */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-700">Color Stops</h3>
              <button
                onClick={addColorStop}
                className="flex items-center px-3 py-1 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors"
              >
                <FiPlus className="mr-1" /> Add Stop
              </button>
            </div>

            <div className="space-y-2">
              {colors.map((color, index) => (
                <motion.div
                  key={index}
                  className="flex items-center space-x-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <input
                    type="color"
                    value={color.value}
                    onChange={e => {
                      const newColors = [...colors];
                      newColors[index].value = e.target.value;
                      setColors(newColors);
                    }}
                    className="w-10 h-10 border border-gray-300 rounded-md cursor-pointer"
                  />
                  <input
                    type="number"
                    value={color.position}
                    min="0"
                    max="100"
                    onChange={e => {
                      const newColors = [...colors];
                      newColors[index].position = Math.min(100, Math.max(0, e.target.value));
                      setColors(newColors);
                    }}
                    className="w-20 px-2 py-1 text-sm border border-gray-300 rounded-md"
                  />
                  <span className="text-gray-500">%</span>
                  {colors.length > 2 && (
                    <button
                      onClick={() => removeColorStop(index)}
                      className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Output Section */}
        <div className="p-4 bg-white rounded-lg border border-gray-200">
          <div className="flex items-center justify-between space-x-3">
            <code className="flex-1 text-sm font-mono text-gray-800 truncate">
              {gradientString}
            </code>
            <button
              onClick={copyToClipboard}
              className="flex items-center px-4 py-2 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors"
            >
              <FiCopy className="mr-2" /> Copy CSS
            </button>
          </div>
          {showCopied && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 text-sm text-green-600"
            >
              Copied to clipboard!
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CSSGradientGenerator;