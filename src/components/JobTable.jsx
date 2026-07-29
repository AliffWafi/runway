import React, { useState } from 'react';
import { STATUS_CONFIG } from '../types/job';
import { 
  Building2, 
  ExternalLink, 
  Trash2, 
  Edit3, 
  ArrowUpDown,
  Calendar,
  DollarSign
} from 'lucide-react';

export function JobTable({ jobs, onOpenDetail, onOpenEditModal, onDeleteJob, onUpdateStatus }) {
  const [sortField, setSortField] = useState('appliedDate');
  const [sortOrder, setSortOrder] = useState('desc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedJobs = [...jobs].sort((a, b) => {
    let valA = a[sortField] || '';
    let valB = b[sortField] || '';

    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="glass-panel" style={{ overflow: 'hidden' }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
          <thead>
            <tr style={{ background: 'rgba(15, 23, 42, 0.8)', borderBottom: '1px solid var(--border-light)', color: 'var(--text-secondary)' }}>
              <th style={{ padding: '14px 18px', cursor: 'pointer' }} onClick={() => handleSort('company')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  Company <ArrowUpDown size={13} />
                </div>
              </th>
              <th style={{ padding: '14px 18px', cursor: 'pointer' }} onClick={() => handleSort('title')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  Role / Title <ArrowUpDown size={13} />
                </div>
              </th>
              <th style={{ padding: '14px 18px' }}>Location</th>
              <th style={{ padding: '14px 18px' }}>Salary</th>
              <th style={{ padding: '14px 18px', cursor: 'pointer' }} onClick={() => handleSort('appliedDate')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  Applied Date <ArrowUpDown size={13} />
                </div>
              </th>
              <th style={{ padding: '14px 18px', cursor: 'pointer' }} onClick={() => handleSort('status')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  Status <ArrowUpDown size={13} />
                </div>
              </th>
              <th style={{ padding: '14px 18px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedJobs.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No job applications found matching your criteria.
                </td>
              </tr>
            ) : (
              sortedJobs.map((job) => {
                const config = STATUS_CONFIG[job.status] || STATUS_CONFIG.applied;
                return (
                  <tr 
                    key={job.id} 
                    style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', transition: 'background 0.15s ease', cursor: 'pointer' }}
                    onClick={() => onOpenDetail(job)}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    {/* Company */}
                    <td style={{ padding: '14px 18px', fontWeight: '600', color: 'var(--text-primary)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Building2 size={16} color="var(--accent-indigo)" />
                        {job.company}
                      </div>
                    </td>

                    {/* Role */}
                    <td style={{ padding: '14px 18px', fontWeight: '500' }}>
                      {job.title}
                    </td>

                    {/* Location */}
                    <td style={{ padding: '14px 18px', color: 'var(--text-secondary)' }}>
                      {job.location || '—'}
                    </td>

                    {/* Salary */}
                    <td style={{ padding: '14px 18px', color: 'var(--text-secondary)' }}>
                      {job.salary || '—'}
                    </td>

                    {/* Applied Date */}
                    <td style={{ padding: '14px 18px', color: 'var(--text-secondary)' }}>
                      {job.appliedDate}
                    </td>

                    {/* Status Select Badge */}
                    <td style={{ padding: '14px 18px' }} onClick={(e) => e.stopPropagation()}>
                      <select
                        value={job.status}
                        onChange={(e) => onUpdateStatus(job.id, e.target.value)}
                        style={{
                          fontSize: '0.78rem',
                          padding: '4px 10px',
                          borderRadius: '20px',
                          background: config.color + '18',
                          color: config.color,
                          border: `1px solid ${config.color}44`,
                          fontWeight: '600',
                          width: 'auto',
                          cursor: 'pointer'
                        }}
                      >
                        {Object.keys(STATUS_CONFIG).map((k) => (
                          <option key={k} value={k} style={{ background: '#0f172a', color: '#fff' }}>
                            {STATUS_CONFIG[k].label}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '14px 18px', textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                        {job.url && (
                          <a 
                            href={job.url} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="btn-icon" 
                            title="Visit Job Listing"
                            style={{ padding: '6px' }}
                          >
                            <ExternalLink size={14} />
                          </a>
                        )}
                        <button 
                          className="btn-icon" 
                          onClick={() => onOpenEditModal(job)} 
                          title="Edit Job Application"
                          style={{ padding: '6px' }}
                        >
                          <Edit3 size={14} />
                        </button>
                        <button 
                          className="btn-icon" 
                          onClick={() => onDeleteJob(job.id)} 
                          title="Delete Job"
                          style={{ padding: '6px', color: 'var(--accent-rose)' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
