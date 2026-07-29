import React from 'react';
import { STATUS_CONFIG } from '../types/job';
import { 
  Building2, 
  MapPin, 
  DollarSign, 
  Calendar, 
  ExternalLink, 
  Plus, 
  ChevronRight, 
  ChevronLeft,
  MoreVertical
} from 'lucide-react';

export function KanbanBoard({ jobs, onOpenDetail, onOpenAddModal, onUpdateStatus }) {
  const statusKeys = Object.keys(STATUS_CONFIG);

  return (
    <div 
      style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '16px',
        alignItems: 'start'
      }}
    >
      {statusKeys.map((statusKey) => {
        const config = STATUS_CONFIG[statusKey];
        const columnJobs = jobs.filter((j) => j.status === statusKey);

        return (
          <div 
            key={statusKey} 
            className="glass-panel"
            style={{ 
              padding: '16px', 
              background: 'rgba(15, 23, 42, 0.5)',
              minHeight: '480px',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Column Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', paddingBottom: '10px', borderBottom: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className={`badge ${config.badgeClass}`}>
                  <span className="badge-dot" />
                  {config.label}
                </span>
                <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', background: 'rgba(255, 255, 255, 0.06)', padding: '2px 8px', borderRadius: '12px' }}>
                  {columnJobs.length}
                </span>
              </div>

              <button 
                className="btn-icon" 
                onClick={() => onOpenAddModal(statusKey)} 
                title={`Add job to ${config.label}`}
                style={{ width: '28px', height: '28px', padding: 0 }}
              >
                <Plus size={15} />
              </button>
            </div>

            {/* Application Cards List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
              {columnJobs.length === 0 ? (
                <div 
                  style={{ 
                    border: '1px dashed rgba(255, 255, 255, 0.08)', 
                    borderRadius: '10px', 
                    padding: '32px 16px', 
                    textAlign: 'center',
                    color: 'var(--text-muted)',
                    fontSize: '0.82rem',
                    margin: 'auto 0'
                  }}
                >
                  No applications in {config.label.toLowerCase()}
                </div>
              ) : (
                columnJobs.map((job) => (
                  <div
                    key={job.id}
                    className="glass-panel animate-fade-in"
                    onClick={() => onOpenDetail(job)}
                    style={{
                      padding: '14px 16px',
                      background: 'rgba(30, 41, 59, 0.5)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      position: 'relative'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = config.color;
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = `0 6px 18px rgba(0,0,0,0.4), 0 0 12px ${config.color}22`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                    }}
                  >
                    {/* Company & Role */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div>
                        <div style={{ fontSize: '0.78rem', fontWeight: '600', color: 'var(--accent-indigo)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <Building2 size={13} /> {job.company}
                        </div>
                        <h4 style={{ fontSize: '0.96rem', fontWeight: '700', color: 'var(--text-primary)', marginTop: '2px' }}>
                          {job.title}
                        </h4>
                      </div>

                      {job.url && (
                        <a
                          href={job.url}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          style={{ color: 'var(--text-muted)', padding: '4px' }}
                          title="Open job link"
                        >
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </div>

                    {/* Key Details */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                      {job.location && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <MapPin size={12} color="var(--text-muted)" /> {job.location}
                        </div>
                      )}
                      {job.salary && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <DollarSign size={12} color="var(--text-muted)" /> {job.salary}
                        </div>
                      )}
                      {job.appliedDate && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Calendar size={12} color="var(--text-muted)" /> Applied: {job.appliedDate}
                        </div>
                      )}
                    </div>

                    {/* Tags */}
                    {job.tags && job.tags.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '12px' }}>
                        {job.tags.map((tag, i) => (
                          <span 
                            key={i} 
                            style={{ 
                              fontSize: '0.68rem', 
                              background: 'rgba(255, 255, 255, 0.05)', 
                              color: 'var(--text-secondary)',
                              padding: '2px 7px',
                              borderRadius: '6px',
                              border: '1px solid rgba(255, 255, 255, 0.05)'
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Quick Move Footer */}
                    <div 
                      onClick={(e) => e.stopPropagation()} 
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justify: 'space-between',
                        paddingTop: '8px', 
                        borderTop: '1px solid rgba(255, 255, 255, 0.06)' 
                      }}
                    >
                      <select
                        value={job.status}
                        onChange={(e) => onUpdateStatus(job.id, e.target.value)}
                        style={{
                          fontSize: '0.72rem',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          background: 'rgba(15, 23, 42, 0.9)',
                          color: config.color,
                          border: `1px solid ${config.color}44`,
                          fontWeight: '600',
                          width: 'auto'
                        }}
                      >
                        {statusKeys.map((k) => (
                          <option key={k} value={k} style={{ background: '#0f172a', color: '#fff' }}>
                            Move to {STATUS_CONFIG[k].label}
                          </option>
                        ))}
                      </select>

                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        Details &rarr;
                      </span>
                    </div>

                  </div>
                ))
              )}
            </div>

            {/* Column Footer Add Button */}
            <button 
              className="btn-secondary" 
              onClick={() => onOpenAddModal(statusKey)}
              style={{ 
                marginTop: '12px', 
                width: '100%', 
                justifyContent: 'center', 
                fontSize: '0.8rem',
                padding: '8px',
                borderStyle: 'dashed'
              }}
            >
              <Plus size={14} /> Add Application
            </button>
          </div>
        );
      })}
    </div>
  );
}
