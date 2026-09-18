import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Users, Ticket, CheckCircle, AlertTriangle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const DashboardHome = () => {
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const statsRes = await axios.get(`${API_URL}/api/dashboard/stats`);
        setStats(statsRes.data);
        
        const activityRes = await axios.get(`${API_URL}/api/dashboard/activity`);
        setActivities(activityRes.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div className="content-wrapper"><div className="loading-spinner"></div> Loading Dashboard...</div>;

  return (
    <div className="content-wrapper">
      <h1 className="page-title" style={{ marginBottom: '2rem' }}>Dashboard Overview</h1>
      
      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon"><Users size={24} /></div>
            <div className="stat-details">
              <h3>Total Requests</h3>
              <p>{stats.totalRequests}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><Ticket size={24} /></div>
            <div className="stat-details">
              <h3>Active Tickets</h3>
              <p>{stats.activeTickets}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ color: 'var(--brand-success)' }}><CheckCircle size={24} /></div>
            <div className="stat-details">
              <h3>Resolved Cases</h3>
              <p>{stats.resolvedTickets}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ color: 'var(--brand-danger)' }}><AlertTriangle size={24} /></div>
            <div className="stat-details">
              <h3>Escalated Cases</h3>
              <p>{stats.escalatedCases}</p>
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <div className="card-title">Recent Activity Log</div>
        </div>
        <div className="card-body">
          <table className="data-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Action</th>
                <th>Decision</th>
                <th>Ticket ID</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((act) => (
                <tr key={act._id}>
                  <td>{new Date(act.timestamp).toLocaleString()}</td>
                  <td>{act.action}</td>
                  <td>
                    <span className={`badge badge-${act.decision?.toLowerCase() || 'open'}`}>
                      {act.decision}
                    </span>
                  </td>
                  <td style={{ fontFamily: 'monospace' }}>{act.ticketId || '-'}</td>
                </tr>
              ))}
              {activities.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No recent activity.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
