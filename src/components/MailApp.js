import React, { useState } from 'react';

const MailApp = () => {
  const [emails, setEmails] = useState([
    { id: 1, sender: 'John Doe', subject: 'Meeting Reminder', content: 'Don\'t forget about our meeting tomorrow at 10 AM.', timestamp: '2025-02-14 09:00', read: false, starred: false },
    { id: 2, sender: 'Jane Smith', subject: 'Project Update', content: 'The project is progressing well. Here are the latest updates...', timestamp: '2025-02-13 15:30', read: true, starred: false }
  ]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [composeMode, setComposeMode] = useState(false);
  const [drafts, setDrafts] = useState([]);
  const [sentEmails, setSentEmails] = useState([]);
  const [newEmail, setNewEmail] = useState({ to: '', subject: '', content: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('inbox');
  const [starredEmails, setStarredEmails] = useState([]);

  const openEmail = (email) => {
    setSelectedEmail(email);
    // Mark email as read when opened
    if (!email.read) {
      setEmails(emails.map(e => e.id === email.id ? { ...e, read: true } : e));
    }
  };

  const closeEmail = () => {
    setSelectedEmail(null);
  };

  const toggleCompose = () => {
    setComposeMode(!composeMode);
    setNewEmail({ to: '', subject: '', content: '' });
  };

  const saveDraft = () => {
    setDrafts([...drafts, { ...newEmail, id: drafts.length + 1, timestamp: new Date().toISOString() }]);
    toggleCompose();
  };

  const sendEmail = () => {
    const sentEmail = { id: sentEmails.length + 1, sender: 'Me', subject: newEmail.subject, content: newEmail.content, timestamp: new Date().toISOString(), read: true };
    setSentEmails([...sentEmails, sentEmail]);
    toggleCompose();
  };

  const deleteEmail = (id) => {
    setEmails(emails.filter(email => email.id !== id));
    closeEmail();
  };

  const toggleStarred = (email) => {
    const isStarred = starredEmails.some(e => e.id === email.id);
    if (isStarred) {
      setStarredEmails(starredEmails.filter(e => e.id !== email.id));
    } else {
      setStarredEmails([...starredEmails, email]);
    }
  };

  const filteredEmails = (emails) => emails.filter(email =>
    email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    email.sender.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getEmailsForTab = () => {
    switch (activeTab) {
      case 'inbox':
        return filteredEmails(emails);
      case 'sent':
        return filteredEmails(sentEmails);
      case 'drafts':
        return filteredEmails(drafts);
      case 'starred':
        return filteredEmails(starredEmails);
      default:
        return [];
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex-none p-2 border-b border-gray-200 flex justify-between items-center">
        <h1 className="text-xl font-bold">Mail</h1>
        <div className="flex">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="rounded p-1 border border-gray-300"
          />
          <button onClick={toggleCompose} className="ml-2 rounded bg-blue-500 text-white px-3 py-1">Compose</button>
        </div>
      </div>
      <div className="flex flex-row h-full">
        <div className="flex-none w-1/4 border-r border-gray-200 p-2">
          <h2 className="text-lg font-bold mb-2">Folders</h2>
          <ul>
            <li onClick={() => setActiveTab('inbox')} className={`cursor-pointer mb-1 p-2 hover:bg-gray-100 ${activeTab === 'inbox' ? 'bg-gray-200' : ''}`}>Inbox</li>
            <li onClick={() => setActiveTab('sent')} className={`cursor-pointer mb-1 p-2 hover:bg-gray-100 ${activeTab === 'sent' ? 'bg-gray-200' : ''}`}>Sent</li>
            <li onClick={() => setActiveTab('drafts')} className={`cursor-pointer mb-1 p-2 hover:bg-gray-100 ${activeTab === 'drafts' ? 'bg-gray-200' : ''}`}>Drafts</li>
            <li onClick={() => setActiveTab('starred')} className={`cursor-pointer mb-1 p-2 hover:bg-gray-100 ${activeTab === 'starred' ? 'bg-gray-200' : ''}`}>Starred</li>
          </ul>
        </div>
        <div className="flex-1 p-2">
          {composeMode ? (
            <div>
              <h2 className="text-lg font-bold">Compose New Email</h2>
              <input
                type="text"
                placeholder="To"
                value={newEmail.to}
                onChange={(e) => setNewEmail({ ...newEmail, to: e.target.value })}
                className="w-full mb-2 p-1 border border-gray-300 rounded"
              />
              <input
                type="text"
                placeholder="Subject"
                value={newEmail.subject}
                onChange={(e) => setNewEmail({ ...newEmail, subject: e.target.value })}
                className="w-full mb-2 p-1 border border-gray-300 rounded"
              />
              <textarea
                placeholder="Content"
                value={newEmail.content}
                onChange={(e) => setNewEmail({ ...newEmail, content: e.target.value })}
                className="w-full mb-2 p-1 border border-gray-300 rounded"
                rows="10"
              />
              <button onClick={sendEmail} className="rounded bg-green-500 text-white px-3 py-1 mr-2">Send</button>
              <button onClick={saveDraft} className="rounded bg-yellow-500 text-white px-3 py-1 mr-2">Save as Draft</button>
              <button onClick={toggleCompose} className="rounded bg-gray-500 text-white px-3 py-1">Cancel</button>
            </div>
          ) : selectedEmail ? (
            <div>
              <h2 className="text-lg font-bold">{selectedEmail.subject}</h2>
              <p><strong>From:</strong> {selectedEmail.sender}</p>
              <p><strong>Date:</strong> {new Date(selectedEmail.timestamp).toLocaleString()}</p>
              <p>{selectedEmail.content}</p>
              <button onClick={() => deleteEmail(selectedEmail.id)} className="mt-2 rounded bg-red-500 text-white px-3 py-1 mr-2">Delete</button>
              <button onClick={() => toggleStarred(selectedEmail)} className="mt-2 rounded bg-yellow-500 text-white px-3 py-1 mr-2">
                {starredEmails.some(e => e.id === selectedEmail.id) ? 'Unstar' : 'Star'}
              </button>
              <button onClick={closeEmail} className="mt-2 rounded bg-blue-500 text-white px-3 py-1">Back to Inbox</button>
            </div>
          ) : (
            <div>
              <h2 className="text-lg font-bold mb-2">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
              <ul>
                {getEmailsForTab().map(email => (
                  <li key={email.id} onClick={() => openEmail(email)} className="cursor-pointer mb-1 p-2 hover:bg-gray-100">
                    <div className="flex justify-between">
                      <strong>{email.sender}</strong>
                      <span>{new Date(email.timestamp).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{email.subject}</span>
                      {!email.read && <span className="text-blue-500">•</span>}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MailApp;