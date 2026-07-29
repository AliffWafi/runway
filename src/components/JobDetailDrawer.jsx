import React from 'react';
import { STATUS_CONFIG } from '../types/job';
import { 
  X, 
  Building2, 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Calendar, 
  ExternalLink, 
  Edit3, 
  Trash2, 
  Clock, 
  FileText,
  Tag
} from 'lucide-react';

export function JobDetailDrawer({ job, onClose, onEdit, onDelete, onUpdateStatus }) {
  if (!job) return null;

  const config = STATUS_CONFIG[job.status] || STATUS_CONFIG.applied;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '540px' }}
      >
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className={`badge ${config.badgeClass}`}>
              <span className="badge-dot" />
              {config.label}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button 
              className="btn-icon" 
              onClick={() => { onClose(); onEdit(job); }} 
              title="Edit Application"
            >
              <Edit3 size={15} />
            </button>
            <button 
              className="btn-icon" 
              onClick={() => { onClose(); onDelete(job.id); }} 
              title="Delete Application"
              style={{ color: 'var(--accent-rose)' }}
            >
              <Trash2 size={15} />
            </button>
            <button className="btn-icon" onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Main Info */}
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--accent-indigo)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <Building2 size={15} /> {job.company}
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '8px' }}>
              {job.title}
            </h2>
            {job.url && (
              <a 
                href={job.url} 
                target="_blank" 
                rel="noreferrer" 
                className="btn-secondary"
                style={{ fontSize: '0.8rem', padding: '6px 12px', display: 'inline-flex', gap: '6px' }}
              >
                <ExternalLink size={14} /> Open Original Job Posting
              </a>
            )}
          </div>

          {/* Key Parameters */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', background: 'rgba(15, 23, 42, 0.6)', padding: '14px 16px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
            <div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '2px' }}>Location</div>
              <div style={{ fontSize: '0.88rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={14} color="var(--accent-indigo)" /> {job.location || 'Not specified'}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '2px' }}>Compensation</div>
              <div style={{ fontSize: '0.88rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <DollarSign size={14} color="var(--accent-emerald)" /> {job.salary || 'Not specified'}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '2px' }}>Date Applied</div>
              <div style={{ fontSize: '0.88rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={14} color="var(--accent-blue)" /> {job.appliedDate}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '2px' }}>Quick Status Change</div>
              <select
                value={job.status}
                onChange={(e) => onUpdateStatus(job.id, e.target.value)}
                style={{ fontSize: '0.8rem', padding: '4px 8px' }}
              >
                {Object.keys(STATUS_CONFIG).map((k) => (
                  <option key={k} value={k}>
                    {STATUS_CONFIG[k].label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tags */}
          {job.tags && job.tags.length > 0 && (
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Tag size={14} /> Tags & Keywords
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {job.tags.map((tag, idx) => (
                  <span 
                    key={idx} 
                    style={{ 
                      fontSize: '0.75rem', 
                      background: 'rgba(99, 102, 241, 0.15)', 
                      color: '#818cf8',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      border: '1px solid rgba(99, 102, 241, 0.3)'
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {job.notes && (
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FileText size={14} /> Application Notes
              </div>
              <div 
                style={{ 
                  background: 'rgba(15, 23, 42, 0.6)', 
                  padding: '12px 14px', 
                  borderRadius: '10px', 
                  border: '1px solid var(--border-light)',
                  fontSize: '0.86rem',
                  whiteSpace: 'pre-wrap',
                  color: 'var(--text-primary)'
                }}
              >
                {job.notes}
              </div>
            </div>
          )}

          {/* Activity History Timeline */}
          {job.history && job.history.length > 0 && (
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={14} /> Status Activity Log
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {job.history.map((log, idx) => (
                  <div 
                    key={idx} 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'flex-start', 
                      gap: '10px',
                      fontSize: '0.8rem',
                      position: 'relative',
                      paddingLeft: '14px',
                      borderLeft: '2px solid rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    <div style={{ minWidth: '80px', color: 'var(--text-muted)', fontSize: '0.74rem' }}>
                      {log.date}
                    </div>
                    <div>
                      <span className={`badge ${STATUS_CONFIG[log.status]?.badgeClass || 'badge-applied'}`} style={{ fontSize: '0.7rem', padding: '2px 7px' }}>
                        {STATUS_CONFIG[log.status]?.label || log.status}
                      </span>
                      {log.note && (
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                          {log.note}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
