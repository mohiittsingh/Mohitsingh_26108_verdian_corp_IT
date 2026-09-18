import React from 'react';
import { ShieldCheck } from 'lucide-react';

const AuditCard = ({ audit }) => {
  if (!audit) return null;

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldCheck size={20} /> Audit Log Record
        </div>
        <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          {new Date(audit.timestamp).toLocaleString()}
        </span>
      </div>
      <div className="card-body">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div><strong>Action:</strong> {audit.action}</div>
          {audit.requestId && <div><strong>Request ID:</strong> <span style={{ fontFamily: 'monospace' }}>{audit.requestId}</span></div>}
          {audit.ticketId && <div><strong>Ticket ID:</strong> <span style={{ fontFamily: 'monospace' }}>{audit.ticketId}</span></div>}
          <div><strong>Decision Recorded:</strong> {audit.decision}</div>
        </div>
      </div>
    </div>
  );
};

export default AuditCard;
