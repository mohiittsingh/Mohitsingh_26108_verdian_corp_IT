import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import Sidebar from './components/Sidebar';
import DashboardHome from './pages/DashboardHome';
import ITServiceChat from './pages/ITServiceChat';
import RequestsView from './pages/RequestsView';
import TicketsView from './pages/TicketsView';
import AuditView from './pages/AuditView';
import './index.css';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '1rem' }}>
            <button 
              className="btn" 
              onClick={() => setDarkMode(!darkMode)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardHome />} />
            <Route path="/agent" element={<ITServiceChat />} />
            <Route path="/requests" element={<RequestsView />} />
            <Route path="/tickets" element={<TicketsView />} />
            <Route path="/audit" element={<AuditView />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
