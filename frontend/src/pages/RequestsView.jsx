import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Play } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const RequestsView = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/requests`);
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleProcessBacklog = async () => {
    setProcessing(true);
    try {
      await axios.post(`${API_URL}/api/agent/process-backlog`);
      await fetchRequests(); // Refresh data
    } catch (error) {
      console.error("Failed to process backlog", error);
      alert("Failed to process backlog.");
    } finally {
      setProcessing(false);
    }
  };

  if (loading && requests.length === 0) return <div className="content-wrapper">Loading...</div>;

  return (
    <div className="content-wrapper">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="page-title">All Employee Requests</h1>
        <button 
          className="btn btn-primary" 
          onClick={handleProcessBacklog} 
          disabled={processing}
        >
          {processing ? <span className="loading-spinner"></span> : <><Play size={18} /> Run Agent on Backlog</>}
        </button>
      </div>
      <div className="card">
        <div className="card-body">
          <table className="data-table">
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Employee</th>
                <th>Text</th>
                <th>Status</th>
                <th>Action Taken So Far</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(req => (
                <tr key={req._id}>
                  <td style={{ fontFamily: 'monospace' }}>{req.requestId}</td>
                  <td>{req.employeeName}</td>
                  <td>{req.requestText}</td>
                  <td>
                    <span className={`badge badge-${req.status?.toLowerCase().replace(/\s/g, '_') || 'open'}`}>
                      {req.status}
                    </span>
                  </td>
                  <td>{req.actionTakenSoFar}</td>
                </tr>
              ))}
              {requests.length === 0 && <tr><td colSpan="5">No requests found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RequestsView;
