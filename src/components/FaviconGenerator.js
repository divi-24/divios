import React, { useState, useRef } from 'react';
import { useDropzone } from 'react-dropzone';

const FaviconGenerator = ({ onClose }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [convertedImage, setConvertedImage] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: 'image/*',
    maxSize: 5 * 1024 * 1024, // 5MB
    onDrop: files => handleFileSelect(files[0]),
    multiple: false
  });

  const handleFileSelect = async (file) => {
    setError('');
    setLoading(true);
    
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = () => {
          const canvas = canvasRef.current;
          const ctx = canvas.getContext('2d');
          
          // Resize image to 64x64
          canvas.width = 64;
          canvas.height = 64;
          ctx.drawImage(img, 0, 0, 64, 64);
          
          setConvertedImage(canvas.toDataURL());
          setSelectedFile(URL.createObjectURL(file));
          setLoading(false);
        };
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError('Error processing image');
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.download = 'favicon.png';
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Window Header */}
      <div className="flex items-center justify-between p-4 bg-gray-100 border-b">
        <h2 className="text-sm font-semibold text-gray-700">Favicon Generator</h2>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-gray-500 transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Drop Zone */}
          <div 
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center 
              ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
              ${loading ? 'opacity-50 pointer-events-none' : ''}`}
          >
            <input {...getInputProps()} />
            <div className="space-y-2">
              <div className="text-4xl">📁</div>
              <p className="text-sm text-gray-600">
                {isDragActive ? 'Drop image here' : 'Drag & drop image, or click to select'}
              </p>
              <p className="text-xs text-gray-400">Max file size: 5MB</p>
            </div>
          </div>

          {/* Preview Section */}
          {convertedImage && (
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <h3 className="text-sm font-semibold mb-4">Preview</h3>
              <div className="flex items-center space-x-6">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 border rounded bg-gray-50 p-2">
                    <img 
                      src={convertedImage} 
                      alt="Favicon preview" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-xs text-gray-500 mt-2">64x64px</span>
                </div>
                <div className="flex-1">
                  <button
                    onClick={handleDownload}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 
                      rounded-md text-sm font-medium transition-colors"
                  >
                    Download Favicon
                  </button>
                  <p className="text-xs text-gray-500 mt-2">
                    Right-click the preview to copy image or save in different formats
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
              ⚠️ {error}
            </div>
          )}
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default FaviconGenerator;