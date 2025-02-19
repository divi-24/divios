import React, { useState } from 'react';

const Chrome = ({ onClose }) => {
  const [url, setUrl] = useState('https://www.google.com');
  const [currentUrl, setCurrentUrl] = useState('https://www.google.com');

  const handleNavigate = () => {
    setCurrentUrl(url);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleNavigate();
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.urlBar}>
          <input
            type="text"
            placeholder="Enter URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyPress={handleKeyPress}
            style={styles.urlInput}
          />
          <button onClick={handleNavigate} style={styles.goButton}>
            Go
          </button>
        </div>
        <button onClick={onClose} style={styles.closeButton}>
          Close
        </button>
      </div>
      <div style={styles.browserWindow}>
        <iframe
          src={currentUrl}
          title="Browser"
          style={styles.iframe}
          sandbox="allow-scripts allow-same-origin allow-forms allow-modals allow-popups"
        />
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f5f5f7',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px',
    backgroundColor: '#e0e0e0',
    borderTopLeftRadius: '10px',
    borderTopRightRadius: '10px',
  },
  urlBar: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    marginRight: '10px',
  },
  urlInput: {
    flex: 1,
    padding: '8px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    marginRight: '10px',
  },
  goButton: {
    padding: '8px 16px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer',
  },
  closeButton: {
    padding: '8px 16px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#ff3b30',
    color: '#fff',
    cursor: 'pointer',
  },
  browserWindow: {
    flex: 1,
    backgroundColor: '#fff',
    borderBottomLeftRadius: '10px',
    borderBottomRightRadius: '10px',
    overflow: 'hidden',
  },
  iframe: {
    width: '100%',
    height: '100%',
    border: 'none',
  },
};

export default Chrome;