import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, List, Ticket, ShieldCheck, Activity } from 'lucide-react';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <Activity size={24} />
          Veridian Corp IT
        </div>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
          <LayoutDashboard size={20} /> Dashboard
        </NavLink>
        <NavLink to="/agent" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
          <MessageSquare size={20} /> Service Agent
        </NavLink>
        <NavLink to="/requests" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
          <List size={20} /> Requests
        </NavLink>
        <NavLink to="/tickets" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
          <Ticket size={20} /> Tickets
        </NavLink>
        <NavLink to="/audit" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
          <ShieldCheck size={20} /> Audit Log
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
