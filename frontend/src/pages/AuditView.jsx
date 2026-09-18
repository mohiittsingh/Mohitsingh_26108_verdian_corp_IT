import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AuditView = () => {
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAudits = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/audits`);
        setAudits(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAudits();
  }, []);

  if (loading) return <div className="content-wrapper">Loading...</div>;

  return (
    <div className="content-wrapper">
      <h1 className="page-title" style={{ marginBottom: '2rem' }}>Audit Log</h1>
      <div className="card">
        <div className="card-body">
          <table className="data-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Request ID</th>
                <th>Ticket ID</th>
                <th>Action</th>
                <th>Decision</th>
              </tr>
            </thead>
            <tbody>
              {audits.map(a => (
                <tr key={a._id}>
                  <td>{new Date(a.timestamp).toLocaleString()}</td>
                  <td style={{ fontFamily: 'monospace' }}>{a.requestId || '-'}</td>
                  <td style={{ fontFamily: 'monospace' }}>{a.ticketId || '-'}</td>
                  <td>{a.action}</td>
                  <td><span className={`badge badge-${a.decision?.toLowerCase() || 'open'}`}>{a.decision}</span></td>
                </tr>
              ))}
              {audits.length === 0 && <tr><td colSpan="5">No audits found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AuditView;
