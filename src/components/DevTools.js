import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

const DevTools = ({ onClose }) => {
  const [text, setText] = useState('DEV');
  const [font, setFont] = useState('system-ui');
  const [color, setColor] = useState('#2563eb');
  const [bgColor, setBgColor] = useState('#f3f4f6');
  const previewRef = useRef(null);
  const canvasRef = useRef(null);

  const handleDownload = (type) => {
    if (!previewRef.current) return;

    const svgContent = `
      <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="${bgColor}"/>
        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" 
              font-family="${font}" font-size="64" fill="${color}">
          ${text}
        </text>
      </svg>
    `;

    if (type === 'svg') {
      const blob = new Blob([svgContent], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${text}-logo.svg`;
      link.click();
    } else {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 200;
        canvas.height = 200;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${text}-logo.png`;
          link.click();
        });
      };
      img.src = `data:image/svg+xml;base64,${btoa(svgContent)}`;
    }
  };

  const generateFavicon = () => {
    if (!previewRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 32, 32);
    
    // Draw background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, 32, 32);
    
    // Draw text
    ctx.fillStyle = color;
    ctx.font = `24px ${font}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 16, 16);
    
    // Trigger download
    const link = document.createElement('a');
    link.download = `${text}-favicon.ico`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 p-4 space-y-4">
      {/* Window Controls */}
      <div className="flex space-x-2">
        <button onClick={onClose} className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600"/>
        <div className="w-3 h-3 rounded-full bg-yellow-500"/>
        <div className="w-3 h-3 rounded-full bg-green-500"/>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 space-x-4">
        {/* Controls */}
        <div className="w-1/3 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Text</label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Font</label>
            <select
              value={font}
              onChange={(e) => setFont(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="system-ui">System UI</option>
              <option value="Arial">Arial</option>
              <option value="Helvetica">Helvetica</option>
              <option value="Menlo">Menlo</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Text Color</label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-full h-10 rounded-lg cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Background Color</label>
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="w-full h-10 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Preview */}
        <div className="flex-1 flex flex-col space-y-4">
          <div className="flex-1 bg-white rounded-xl p-4 shadow-sm border">
            <div 
              ref={previewRef}
              className="w-full h-full flex items-center justify-center rounded-lg overflow-hidden"
              style={{ backgroundColor: bgColor }}
            >
              <motion.span 
                style={{ fontFamily: font, color, fontSize: '4rem' }}
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                {text}
              </motion.span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleDownload('png')}
              className="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-500"
            >
              Download PNG
            </button>
            <button
              onClick={() => handleDownload('svg')}
              className="py-2 px-4 bg-gray-800 text-white rounded-lg hover:bg-gray-900 focus:ring-2 focus:ring-gray-500"
            >
              Download SVG
            </button>
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center space-x-4">
              <canvas ref={canvasRef} width="32" height="32" className="border rounded"/>
              <button
                onClick={generateFavicon}
                className="py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:ring-2 focus:ring-green-500"
              >
                Generate Favicon
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevTools;