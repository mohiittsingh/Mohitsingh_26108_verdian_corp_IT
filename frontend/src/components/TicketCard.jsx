import React from 'react';
import { Ticket as TicketIcon } from 'lucide-react';

const TicketCard = ({ ticket }) => {
  if (!ticket) return null;

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <TicketIcon size={20} /> Generated Ticket
        </div>
        <span className="badge badge-open">{ticket.status}</span>
      </div>
      <div className="card-body">
        <div style={{ marginBottom: '0.5rem' }}>
          <strong>Ticket ID:</strong> <span style={{ fontFamily: 'monospace' }}>{ticket.ticketId}</span>
        </div>
        <div style={{ marginBottom: '0.5rem' }}>
          <strong>Employee:</strong> {ticket.employeeName}
        </div>
        <div>
          <strong>Issue:</strong> {ticket.issueSummary}
        </div>
      </div>
    </div>
  );
};

export default TicketCard;
