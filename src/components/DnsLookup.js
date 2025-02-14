import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FiRefreshCw, FiClipboard, FiXCircle, FiSearch } from 'react-icons/fi';

const DNSRecordType = {
  A: 'text-green-600 bg-green-50',
  AAAA: 'text-blue-600 bg-blue-50',
  CNAME: 'text-purple-600 bg-purple-50',
  MX: 'text-red-600 bg-red-50',
  TXT: 'text-orange-600 bg-orange-50',
  NS: 'text-cyan-600 bg-cyan-50'
};

const DnsLookup = ({ onClose }) => {
  const [domain, setDomain] = useState('');
  const [records, setRecords] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchDNSRecords = async (e) => {
    e.preventDefault();
    if (!domain) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch(`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=A,AAAA,CNAME,MX,TXT,NS`, {
        headers: { 'Accept': 'application/dns-json' }
      });
      
      if (!response.ok) throw new Error('DNS query failed');
      
      const data = await response.json();
      const grouped = data.Answer?.reduce((acc, record) => {
        const type = record.type;
        acc[type] = [...(acc[type] || []), record];
        return acc;
      }, {}) || {};
      
      setRecords(grouped);
    } catch (err) {
      setError('Failed to fetch DNS records. Please check the domain name.');
    } finally {
      setIsLoading(false);
    }
  };

  const RecordCard = ({ type, records }) => (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 rounded-lg shadow-sm mb-4`}
    >
      <div className="flex items-center mb-3">
        <span className={`${DNSRecordType[type]} px-3 py-1 rounded-full text-sm font-medium`}>
          {type}
        </span>
      </div>
      <div className="space-y-2">
        {records?.map((record, i) => (
          <div key={i} className="flex items-center justify-between group">
            <span className="font-mono text-sm truncate">
              {record.data.replace(/"/g, '')}
            </span>
            <CopyToClipboard text={record.data}>
              <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded">
                <FiClipboard className="text-gray-500" size={14} />
              </button>
            </CopyToClipboard>
          </div>
        ))}
      </div>
    </motion.div>
  );

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Window Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="font-semibold">DNS Lookup</h2>
        <button 
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-full"
        >
          <FiXCircle className="text-gray-600" size={20} />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-4">
        <form onSubmit={fetchDNSRecords} className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="Enter domain (e.g., example.com)"
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center"
            >
              <FiSearch className="mr-2" />
              {isLoading ? 'Searching...' : 'Lookup'}
            </button>
          </div>
        </form>

        {error && (
          <div className="p-3 mb-4 bg-red-50 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid gap-4">
          {Object.entries(records).map(([type, records]) => (
            <RecordCard key={type} type={type} records={records} />
          ))}
        </div>

        {!isLoading && Object.keys(records).length === 0 && !error && (
          <div className="text-center text-gray-500 mt-8">
            <FiRefreshCw className="mx-auto mb-2" />
            Enter a domain to lookup DNS records
          </div>
        )}
      </div>
    </div>
  );
};

export default DnsLookup;