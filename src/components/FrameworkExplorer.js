import React, { useState } from 'react';
import { motion } from 'framer-motion';

const FrameworkExplorer = ({ onClose }) => {
  const [selectedFramework, setSelectedFramework] = useState(null);

  // Sample data for frameworks
  const frameworks = [
    {
      name: 'React',
      description: 'A JavaScript library for building user interfaces.',
      features: ['Component-based', 'Virtual DOM', 'JSX Syntax'],
      example: `function App() {
  return <h1>Hello, React!</h1>;
}`,
    },
    {
      name: 'Vue',
      description: 'A progressive framework for building UIs.',
      features: ['Reactive Data Binding', 'Component-based', 'Directives'],
      example: `<template>
  <h1>Hello, Vue!</h1>
</template>`,
    },
    {
      name: 'Angular',
      description: 'A platform for building mobile and desktop web applications.',
      features: ['Two-way Data Binding', 'Dependency Injection', 'TypeScript-based'],
      example: `@Component({
  selector: 'app-root',
  template: '<h1>Hello, Angular!</h1>',
})
export class AppComponent {}`,
    },
    {
      name: 'Svelte',
      description: 'A modern JavaScript compiler for building efficient UIs.',
      features: ['No Virtual DOM', 'Reactive State', 'Compiled at Build Time'],
      example: `<script>
  let name = 'Svelte';
</script>

<h1>Hello, {name}!</h1>`,
    },
  ];

  return (
    <div className="flex flex-col h-full bg-white rounded-lg overflow-hidden">
      {/* Title Bar */}
      <div className="flex items-center justify-between p-2 bg-gray-100 border-b">
        <h2 className="text-lg font-semibold">Framework Explorer</h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-200 rounded-full"
        >
          ✕
        </button>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-gray-50 border-r p-4 overflow-y-auto">
          <h3 className="text-sm font-semibold mb-4">Frameworks</h3>
          <ul>
            {frameworks.map((framework, index) => (
              <motion.li
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="p-2 mb-2 cursor-pointer hover:bg-gray-100 rounded-lg"
                onClick={() => setSelectedFramework(framework)}
              >
                <span className="text-sm">{framework.name}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Framework Details */}
        <div className="flex-1 p-4 overflow-y-auto">
          {selectedFramework ? (
            <>
              <h3 className="text-xl font-semibold mb-4">
                {selectedFramework.name}
              </h3>
              <p className="text-sm text-gray-700 mb-4">
                {selectedFramework.description}
              </p>
              <h4 className="text-lg font-semibold mb-2">Key Features</h4>
              <ul className="list-disc list-inside mb-4">
                {selectedFramework.features.map((feature, index) => (
                  <li key={index} className="text-sm text-gray-700">
                    {feature}
                  </li>
                ))}
              </ul>
              <h4 className="text-lg font-semibold mb-2">Example Code</h4>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm font-mono">
                <code>{selectedFramework.example}</code>
              </pre>
            </>
          ) : (
            <p className="text-sm text-gray-500">
              Select a framework to view details.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FrameworkExplorer;