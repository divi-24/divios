import React, { useState } from 'react';
import appConfig from './appConfig'; // Import the appConfig to get the list of apps

const AppStore = ({ onClose, onOpenApp }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const appsPerPage = 12; // Number of apps to display per page

  // Filter apps based on the search query
  const filteredApps = appConfig.filter(app =>
    app.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate the total number of pages
  const totalPages = Math.ceil(filteredApps.length / appsPerPage);

  // Get the apps for the current page
  const indexOfLastApp = currentPage * appsPerPage;
  const indexOfFirstApp = indexOfLastApp - appsPerPage;
  const currentApps = filteredApps.slice(indexOfFirstApp, indexOfLastApp);

  // Handle page change
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>App Store</h2>
        <input
          type="text"
          placeholder="Search apps..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={styles.searchInput}
        />
        <button onClick={onClose} style={styles.closeButton}>Close</button>
      </div>
      <div style={styles.appList}>
        {currentApps.map((app, index) => (
          <div key={index} style={styles.appCard} onClick={() => onOpenApp(app)}>
            <div style={styles.appIcon}>{app.icon}</div>
            <div style={styles.appName}>{app.name}</div>
          </div>
        ))}
      </div>
      <div style={styles.pagination}>
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          style={styles.paginationButton}
        >
          &#10688;
        </button>
        <span style={styles.pageInfo}>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          style={styles.paginationButton}
        >
          &#10689;
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
    height: '100%',
    padding: '20px',
    backgroundColor: '#f5f5f7',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  searchInput: {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    width: '300px',
  },
  closeButton: {
    padding: '10px 20px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#ff3b30',
    color: '#fff',
    cursor: 'pointer',
  },
  appList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
    gap: '20px',
    marginBottom: '20px',
  },
  appCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    cursor: 'pointer',
    transition: 'transform 0.2s',
    ':hover': {
      transform: 'scale(1.05)',
    },
  },
  appIcon: {
    fontSize: '40px',
    marginBottom: '10px',
  },
  appName: {
    fontSize: '16px',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '20px',
  },
  paginationButton: {
    padding: '10px 20px',
    borderRadius: '50%',
    border: 'none',
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer',
    ':disabled': {
      backgroundColor: '#ccc',
      cursor: 'not-allowed',
    },
  },
  pageInfo: {
    fontSize: '16px',
    fontWeight: 'bold',
  },
};

export default AppStore;