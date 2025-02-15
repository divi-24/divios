import React, { useState, useRef } from 'react';

const SafariApp = () => {
  const [url, setUrl] = useState('https://www.wikipedia.org'); // Default URL
  const [inputUrl, setInputUrl] = useState(url);
  const [history, setHistory] = useState([url]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);
  const [tabs, setTabs] = useState([{ url, title: 'New Tab' }]);
  const [activeTab, setActiveTab] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const iframeRef = useRef(null);

  const handleInputChange = (e) => {
    setInputUrl(e.target.value);
  };

  const handleGoClick = () => {
    navigateToUrl(inputUrl);
  };

  const navigateToUrl = (newUrl) => {
    setIsLoading(true);
    if (!newUrl.startsWith('http://') && !newUrl.startsWith('https://')) {
      newUrl = 'https://' + newUrl;
    }
    setUrl(newUrl);
    setInputUrl(newUrl);
    const newHistory = [...history];
    newHistory.splice(currentIndex + 1);
    newHistory.push(newUrl);
    setHistory(newHistory);
    setCurrentIndex(newHistory.length - 1);

    // Update the active tab's URL
    const updatedTabs = [...tabs];
    updatedTabs[activeTab].url = newUrl;
    setTabs(updatedTabs);
  };

  const handleBackClick = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      setUrl(history[newIndex]);
      setInputUrl(history[newIndex]);
    }
  };

  const handleForwardClick = () => {
    if (currentIndex < history.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      setUrl(history[newIndex]);
      setInputUrl(history[newIndex]);
    }
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
    const iframe = iframeRef.current;
    if (iframe) {
      const title = iframe.contentDocument?.title || 'New Tab';
      const updatedTabs = [...tabs];
      updatedTabs[activeTab].title = title;
      setTabs(updatedTabs);
    }
  };

  const handleIframeError = () => {
    setIsLoading(false);
    alert('Unable to load the requested page. This might be due to security restrictions set by the website.');
    setUrl('about:blank');
  };

  const handleAddBookmark = () => {
    if (!bookmarks.includes(url)) {
      setBookmarks([...bookmarks, url]);
    }
  };

  const handleRemoveBookmark = (bookmarkUrl) => {
    setBookmarks(bookmarks.filter(b => b !== bookmarkUrl));
  };

  const handleNewTab = () => {
    const newTab = { url: 'https://www.google.com', title: 'New Tab' };
    setTabs([...tabs, newTab]);
    setActiveTab(tabs.length);
  };

  const handleCloseTab = (index) => {
    const updatedTabs = tabs.filter((_, i) => i !== index);
    setTabs(updatedTabs);
    if (index === activeTab) {
      setActiveTab(Math.max(0, index - 1));
    }
  };

  const handleTabChange = (index) => {
    setActiveTab(index);
    setUrl(tabs[index].url);
    setInputUrl(tabs[index].url);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`flex flex-col h-full ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
      <div className="flex-none p-2 bg-gray-200 flex items-center space-x-2">
        <div className="flex space-x-2">
          <button
            onClick={handleBackClick}
            disabled={currentIndex === 0}
            className={`p-2 ${currentIndex === 0 ? 'text-gray-400' : 'text-black'} rounded-l`}
          >
            ◀
          </button>
          <button
            onClick={handleForwardClick}
            disabled={currentIndex === history.length - 1}
            className={`p-2 ${currentIndex === history.length - 1 ? 'text-gray-400' : 'text-black'}`}
          >
            ▶
          </button>
        </div>
        <div className="flex flex-grow items-center bg-white rounded border border-gray-300">
          <img src="https://www.apple.com/favicon.ico" alt="Site Icon" className="h-6 w-6 ml-2" />
          <input
            type="text"
            value={inputUrl}
            onChange={handleInputChange}
            className="flex-grow p-2 bg-transparent outline-none"
            placeholder="Enter URL"
          />
          <button onClick={handleGoClick} className="p-2 bg-blue-500 text-white rounded-r">
            Go
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={handleAddBookmark} className="p-2 bg-green-500 text-white rounded">
            Bookmark
          </button>
          <button onClick={handleNewTab} className="p-2 bg-blue-500 text-white rounded">
            New Tab
          </button>
          <button onClick={toggleDarkMode} className="p-2 bg-gray-500 text-white rounded">
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
          {isLoading && <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-6 w-6"></div>}
        </div>
      </div>
      <div className="flex-none p-2 bg-gray-200 flex items-center space-x-2">
        {tabs.map((tab, index) => (
          <div
            key={index}
            className={`p-2 ${index === activeTab ? 'bg-blue-500 text-white' : 'bg-white text-black'} rounded cursor-pointer`}
            onClick={() => handleTabChange(index)}
          >
            {tab.title}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCloseTab(index);
              }}
              className="ml-2 text-red-500"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <div className="flex-1 overflow-auto">
        <iframe
          ref={iframeRef}
          src={url}
          title="Safari Browser"
          className="w-full h-full border-none"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
        ></iframe>
      </div>
      <div className="flex-none p-2 bg-gray-200">
        <h3 className="font-bold">Bookmarks</h3>
        <ul>
          {bookmarks.map((bookmark, index) => (
            <li key={index} className="flex items-center justify-between">
              <a href={bookmark} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                {bookmark}
              </a>
              <button onClick={() => handleRemoveBookmark(bookmark)} className="text-red-500">
                ✕
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SafariApp;