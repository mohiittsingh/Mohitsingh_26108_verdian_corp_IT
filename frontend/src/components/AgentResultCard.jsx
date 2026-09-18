import React from 'react';
import { Bot, AlertCircle, CheckCircle, Info } from 'lucide-react';

const AgentResultCard = ({ result }) => {
  if (!result) return null;

  const { decision, reason, sources } = result;

  const getDecisionIcon = () => {
    switch (decision) {
      case 'RESOLVE': return <CheckCircle size={20} className="text-success" />;
      case 'ESCALATE': return <AlertCircle size={20} className="text-danger" />;
      default: return <Info size={20} className="text-warning" />;
    }
  };

  const badgeClass = `badge badge-${decision?.toLowerCase() || 'follow_up'}`;

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Bot size={20} /> Agent Decision
        </div>
        <span className={badgeClass}>{decision}</span>
      </div>
      <div className="card-body">
        <p style={{ marginBottom: '1rem' }}><strong>Reason:</strong> {reason}</p>
        
        {sources && sources.length > 0 && (
          <div>
            <strong>Source Policies:</strong>
            <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem', color: 'var(--text-muted)' }}>
              {sources.map((src, idx) => (
                <li key={idx}>{src}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentResultCard;
