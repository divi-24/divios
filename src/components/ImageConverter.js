import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';

const ImageConverter = ({ onClose }) => {
  const [originalImage, setOriginalImage] = useState(null);
  const [compressedImage, setCompressedImage] = useState(null);
  const [compressionLevel, setCompressionLevel] = useState(80);
  const [selectedFormat, setSelectedFormat] = useState('jpeg');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setOriginalImage({
        src: event.target.result,
        name: file.name,
        size: (file.size / 1024).toFixed(2) + ' KB'
      });
    };
    reader.readAsDataURL(file);
  };

  const compressImage = useCallback(async () => {
    if (!originalImage) return;
    setIsProcessing(true);

    try {
      const img = new Image();
      img.src = originalImage.src;
      
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Maintain aspect ratio
      const MAX_WIDTH = 2000;
      const scale = Math.min(1, MAX_WIDTH / img.width);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        const compressedUrl = URL.createObjectURL(blob);
        setCompressedImage({
          src: compressedUrl,
          size: (blob.size / 1024).toFixed(2) + ' KB'
        });
        setIsProcessing(false);
      }, `image/${selectedFormat}`, compressionLevel / 100);
    } catch (error) {
      console.error('Error compressing image:', error);
      setIsProcessing(false);
    }
  }, [originalImage, compressionLevel, selectedFormat]);

  const downloadImage = () => {
    const link = document.createElement('a');
    link.download = `compressed.${selectedFormat}`;
    link.href = compressedImage.src;
    link.click();
  };

  return (
    <div className="flex flex-col h-full bg-white p-4 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-2">
        <h2 className="text-lg font-semibold text-gray-800">Image Converter</h2>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col space-y-4 overflow-auto">
        {/* File Upload */}
        <label className="flex flex-col items-center px-4 py-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors cursor-pointer">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <span className="text-gray-600 mb-2">📤 Click to upload or drag image</span>
          <span className="text-sm text-gray-500">(Max 5MB)</span>
        </label>

        {/* Original Image Preview */}
        {originalImage && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Original ({originalImage.size})</h3>
            <img 
              src={originalImage.src}
              alt="Original preview"
              className="max-h-40 object-contain border rounded-lg"
            />
          </div>
        )}

        {/* Controls */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Compression Quality: {compressionLevel}%
            </label>
            <input
              type="range"
              min="10"
              max="100"
              value={compressionLevel}
              onChange={(e) => setCompressionLevel(e.target.value)}
              className="w-full accent-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Output Format</label>
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="jpeg">JPEG</option>
              <option value="png">PNG</option>
              <option value="webp">WEBP</option>
            </select>
          </div>
        </div>

        {/* Compressed Preview */}
        {compressedImage && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Compressed ({compressedImage.size})</h3>
            <img 
              src={compressedImage.src}
              alt="Compressed preview"
              className="max-h-40 object-contain border rounded-lg"
            />
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <motion.div className="flex justify-end space-x-3 border-t pt-4">
        <button
          onClick={compressImage}
          disabled={!originalImage || isProcessing}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isProcessing ? 'Processing...' : 'Compress Image'}
        </button>
        
        {compressedImage && (
          <button
            onClick={downloadImage}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
          >
            Download
          </button>
        )}
      </motion.div>
    </div>
  );
};

export default ImageConverter;