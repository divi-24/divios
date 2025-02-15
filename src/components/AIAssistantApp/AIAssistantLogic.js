import React from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY || "AIzaSyDC_nwnZggf8CYID3qvJfazEE8KBnqd9Ro"; // Fallback API key
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const AIAssistantLogic = ({
  input,
  setInput,
  isLoading,
  setIsLoading,
  messages,
  setMessages,
  selectedModel,
  context,
  setContext,
  uploadedFiles,
  setUploadedFiles,
  scrollToBottom,
  handleRemoveFile,
}) => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() && uploadedFiles.length === 0) return;

    setIsLoading(true);

    // Add user message to the chat
    const userMessage = { role: 'user', content: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput('');

    // Add a placeholder for the AI's response
    const aiMessage = { role: 'assistant', content: '' };
    setMessages((prevMessages) => [...prevMessages, aiMessage]);

    try {
      // Combine context, uploaded files, and chat history
      const fullContext = [
        context,
        ...uploadedFiles.map((file) => `File: ${file.name}\nContent: ${file.content}`),
        ...messages.map((msg) => `${msg.role}: ${msg.content}`),
        `user: ${input}`,
      ].join('\n\n');

      // Send the prompt to Gemini
      const result = await model.generateContent(fullContext);
      const response = await result.response;
      const text = response.text();

      // Update the AI's message with the response
      setMessages((prevMessages) => [
        ...prevMessages.slice(0, -1),
        { ...aiMessage, content: text },
      ]);
    } catch (error) {
      console.error('Error generating response:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'system', content: 'Sorry, there was an error processing your request.' },
      ]);
    } finally {
      setIsLoading(false);
      scrollToBottom();
      setUploadedFiles([]); // Clear uploaded files after processing
    }
  };

  return (
    <div className="p-4 bg-white border-t border-gray-200">
      {uploadedFiles.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {uploadedFiles.map((file, index) => (
            <div key={index} className="flex items-center bg-blue-100 p-2 rounded">
              <span className="text-sm text-blue-800 mr-2">{file.name}</span>
              <button
                type="button"
                onClick={() => handleRemoveFile(file.name)}
                className="text-red-500 hover:text-red-700"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
          disabled={isLoading}
        >
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default AIAssistantLogic;