import React, { useState } from 'react';

const GitHubDesktop = ({ onClose }) => {
  const [repositories, setRepositories] = useState([]);
  const [currentRepo, setCurrentRepo] = useState(null);
  const [cloneUrl, setCloneUrl] = useState('');
  const [commitMessage, setCommitMessage] = useState('');
  const [changes, setChanges] = useState([]);

  const handleCloneRepository = () => {
    if (cloneUrl) {
      const repoName = cloneUrl.split('/').pop().replace('.git', '');
      const newRepo = { name: repoName, url: cloneUrl, changes: [] };
      setRepositories([...repositories, newRepo]);
      setCloneUrl('');
      alert(`Repository "${repoName}" cloned successfully!`);
    } else {
      alert('Please enter a valid repository URL.');
    }
  };

  const handleSelectRepository = (repo) => {
    setCurrentRepo(repo);
    setChanges(repo.changes || []);
  };

  const handleStageChange = (change) => {
    setChanges((prevChanges) =>
      prevChanges.map((c) =>
        c.file === change.file ? { ...c, staged: !c.staged } : c
      )
    );
  };

  const handleCommitChanges = () => {
    if (commitMessage && changes.some((change) => change.staged)) {
      const updatedRepo = {
        ...currentRepo,
        changes: changes.filter((change) => !change.staged),
      };
      setRepositories((prevRepos) =>
        prevRepos.map((repo) =>
          repo.name === currentRepo.name ? updatedRepo : repo
        )
      );
      setCurrentRepo(updatedRepo);
      setChanges(updatedRepo.changes);
      setCommitMessage('');
      alert('Changes committed successfully!');
    } else {
      alert('Please stage changes and enter a commit message.');
    }
  };

  const handlePushChanges = () => {
    if (currentRepo) {
      alert(`Pushing changes to repository "${currentRepo.name}"...`);
      // Simulate pushing changes
      setChanges([]);
      alert('Changes pushed successfully!');
    } else {
      alert('No repository selected.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>GitHub Desktop</h2>
        <button onClick={onClose} style={styles.closeButton}>
          Close
        </button>
      </div>
      <div style={styles.content}>
        <div style={styles.sidebar}>
          <h3>Repositories</h3>
          <ul style={styles.repoList}>
            {repositories.map((repo, index) => (
              <li
                key={index}
                style={styles.repoItem}
                onClick={() => handleSelectRepository(repo)}
              >
                {repo.name}
              </li>
            ))}
          </ul>
          <div style={styles.cloneSection}>
            <input
              type="text"
              placeholder="Enter repository URL to clone"
              value={cloneUrl}
              onChange={(e) => setCloneUrl(e.target.value)}
              style={styles.cloneInput}
            />
            <button onClick={handleCloneRepository} style={styles.cloneButton}>
              Clone
            </button>
          </div>
        </div>
        <div style={styles.mainContent}>
          {currentRepo ? (
            <>
              <h3>{currentRepo.name}</h3>
              <div style={styles.changesSection}>
                <h4>Changes</h4>
                {changes.length > 0 ? (
                  changes.map((change, index) => (
                    <div key={index} style={styles.changeItem}>
                      <input
                        type="checkbox"
                        checked={change.staged}
                        onChange={() => handleStageChange(change)}
                      />
                      <span>{change.file}</span>
                    </div>
                  ))
                ) : (
                  <p>No changes detected.</p>
                )}
              </div>
              <div style={styles.commitSection}>
                <input
                  type="text"
                  placeholder="Enter commit message"
                  value={commitMessage}
                  onChange={(e) => setCommitMessage(e.target.value)}
                  style={styles.commitInput}
                />
                <button onClick={handleCommitChanges} style={styles.commitButton}>
                  Commit
                </button>
                <button onClick={handlePushChanges} style={styles.pushButton}>
                  Push
                </button>
              </div>
            </>
          ) : (
            <p>Select a repository to view changes.</p>
          )}
        </div>
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
  closeButton: {
    padding: '10px 20px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#ff3b30',
    color: '#fff',
    cursor: 'pointer',
  },
  content: {
    display: 'flex',
    height: 'calc(100% - 60px)',
  },
  sidebar: {
    width: '250px',
    borderRight: '1px solid #ccc',
    paddingRight: '20px',
  },
  repoList: {
    listStyle: 'none',
    padding: '0',
  },
  repoItem: {
    padding: '10px',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: '#e0e0e0',
    },
  },
  cloneSection: {
    marginTop: '20px',
  },
  cloneInput: {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    marginBottom: '10px',
  },
  cloneButton: {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#28a745',
    color: '#fff',
    cursor: 'pointer',
  },
  mainContent: {
    flex: 1,
    paddingLeft: '20px',
  },
  changesSection: {
    marginBottom: '20px',
  },
  changeItem: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
  },
  commitSection: {
    display: 'flex',
    gap: '10px',
  },
  commitInput: {
    flex: 1,
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  commitButton: {
    padding: '10px 20px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer',
  },
  pushButton: {
    padding: '10px 20px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#6f42c1',
    color: '#fff',
    cursor: 'pointer',
  },
};

export default GitHubDesktop;