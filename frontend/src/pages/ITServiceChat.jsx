import React, { useState } from 'react';
import axios from 'axios';
import AgentResultCard from '../components/AgentResultCard';
import TicketCard from '../components/TicketCard';
import AuditCard from '../components/AuditCard';
import { Send } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const exampleQueries = [
  "I locked my account",
  "My VPN expired",
  "Need guest wifi",
  "I clicked a weird link in an email",
  "Help my computer is broken"
];

const ITServiceChat = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resultData, setResultData] = useState(null);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    setError('');
    setResultData(null);

    try {
      const res = await axios.post(`${API_URL}/api/agent/process`, { message });
      setResultData(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to process request. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (query) => {
    setMessage(query);
  };

  return (
    <div className="content-wrapper">
      <h1 className="page-title" style={{ marginBottom: '2rem' }}>IT Service Agent</h1>
      
      <div className="chat-container">
        <div className="card">
          <div className="card-header">
            <div className="card-title">Employee Request Input</div>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit} className="chat-input-area">
              <textarea 
                className="chat-input"
                placeholder="Type the employee's request here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={loading}
              />
              <button type="submit" className="btn btn-primary" disabled={loading || !message.trim()}>
                {loading ? <span className="loading-spinner"></span> : <Send size={20} />}
              </button>
            </form>
            
            <div style={{ marginTop: '1.5rem' }}>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Example Requests:</p>
              <div className="suggestions">
                {exampleQueries.map((query, idx) => (
                  <button 
                    key={idx} 
                    type="button" 
                    className="suggestion-chip"
                    onClick={() => handleSuggestionClick(query)}
                    disabled={loading}
                  >
                    {query}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="error-message">
            <strong>Error:</strong> {error}
          </div>
        )}

        {resultData && (
          <div className="result-section">
            <AgentResultCard result={resultData} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {resultData.ticket && <TicketCard ticket={resultData.ticket} />}
              {resultData.audit && <AuditCard audit={resultData.audit} />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ITServiceChat;
