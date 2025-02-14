import React, { useState } from 'react';
import { motion } from 'framer-motion';

const CSSHelper = ({ onClose }) => {
  const [expandedSection, setExpandedSection] = useState(null);

  const categories = [
    {
      name: 'Flexbox',
      icon: '↔️',
      properties: [
        {
          name: 'justify-content',
          values: ['center', 'space-between', 'space-around', 'flex-start', 'flex-end'],
          examples: [
            {
              code: 'justify-content: center;',
              preview: 'flex justify-center'
            },
            {
              code: 'justify-content: space-between;',
              preview: 'flex justify-between'
            }
          ]
        }
      ]
    },
    {
      name: 'Grid',
      icon: '⏹️',
      properties: [
        {
          name: 'grid-template-columns',
          values: ['repeat(3, 1fr)', '1fr 2fr', '100px auto'],
          examples: [
            {
              code: 'grid-template-columns: repeat(3, 1fr);',
              preview: 'grid grid-cols-3'
            }
          ]
        }
      ]
    },
    {
      name: 'Shadows',
      icon: '🌑',
      properties: [
        {
          name: 'box-shadow',
          values: ['sm', 'md', 'lg', 'xl'],
          examples: [
            {
              code: 'box-shadow: 0 1px 3px rgba(0,0,0,0.12);',
              preview: 'shadow-sm'
            },
            {
              code: 'box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);',
              preview: 'shadow-lg'
            }
          ]
        }
      ]
    }
  ];

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h1 className="text-lg font-semibold text-gray-700">CSS Helper</h1>
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-gray-100 transition-colors"
        >
          ⨉
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {categories.map((category) => (
          <motion.div
            key={category.name}
            className="rounded-lg border bg-gray-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <button
              className="w-full p-3 flex items-center space-x-2 hover:bg-gray-100 transition-colors"
              onClick={() => setExpandedSection(expandedSection === category.name ? null : category.name)}
            >
              <span>{category.icon}</span>
              <h2 className="text-gray-700 font-medium">{category.name}</h2>
            </button>

            {expandedSection === category.name && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 space-y-4 border-t"
              >
                {category.properties.map((property) => (
                  <div key={property.name} className="space-y-3">
                    <h3 className="font-medium text-gray-700">{property.name}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {property.examples.map((example, index) => (
                        <div key={index} className="rounded border bg-white p-3">
                          <div className={`flex gap-2 p-2 mb-3 ${example.preview}`}>
                            {[...Array(3)].map((_, i) => (
                              <div key={i} className="w-6 h-6 bg-blue-200 rounded" />
                            ))}
                          </div>
                          <pre className="p-2 bg-gray-800 text-gray-100 rounded text-sm font-mono overflow-x-auto">
                            {example.code}
                          </pre>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CSSHelper;