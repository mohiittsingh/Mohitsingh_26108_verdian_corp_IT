import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const TicketsView = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/tickets`);
        setTickets(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  if (loading) return <div className="content-wrapper">Loading...</div>;

  return (
    <div className="content-wrapper">
      <h1 className="page-title" style={{ marginBottom: '2rem' }}>All Tickets</h1>
      <div className="card">
        <div className="card-body">
          <table className="data-table">
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Employee</th>
                <th>Status</th>
                <th>Summary</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map(t => (
                <tr key={t._id}>
                  <td style={{ fontFamily: 'monospace' }}>{t.ticketId}</td>
                  <td>{t.employeeName}</td>
                  <td><span className={`badge badge-${t.status.toLowerCase()}`}>{t.status}</span></td>
                  <td>{t.issueSummary}</td>
                  <td>{new Date(t.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {tickets.length === 0 && <tr><td colSpan="5">No tickets found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TicketsView;
