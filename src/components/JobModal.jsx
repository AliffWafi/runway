import React, { useState, useEffect } from 'react';
import { STATUS_CONFIG } from '../types/job';
import { X, Save, Building2, Briefcase, MapPin, DollarSign, Link as LinkIcon, Calendar, Tag, FileText } from 'lucide-react';

export function JobModal({ isOpen, onClose, onSave, editingJob, initialStatus }) {
  const [formData, setFormData] = useState({
    company: '',
    title: '',
    location: '',
    salary: '',
    url: '',
    appliedDate: new Date().toISOString().split('T')[0],
    status: 'applied',
    tags: '',
    notes: ''
  });

  useEffect(() => {
    if (editingJob) {
      setFormData({
        company: editingJob.company || '',
        title: editingJob.title || '',
        location: editingJob.location || '',
        salary: editingJob.salary || '',
        url: editingJob.url || '',
        appliedDate: editingJob.appliedDate || new Date().toISOString().split('T')[0],
        status: editingJob.status || 'applied',
        tags: editingJob.tags ? editingJob.tags.join(', ') : '',
        notes: editingJob.notes || ''
      });
    } else {
      setFormData({
        company: '',
        title: '',
        location: '',
        salary: '',
        url: '',
        appliedDate: new Date().toISOString().split('T')[0],
        status: initialStatus || 'applied',
        tags: '',
        notes: ''
      });
    }
  }, [editingJob, initialStatus, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.company.trim() || !formData.title.trim()) return;

    const formattedTags = formData.tags
      ? formData.tags.split(',').map(t => t.trim()).filter(Boolean)
      : [];

    onSave({
      ...formData,
      tags: formattedTags
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        
        {/* Modal Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>
              {editingJob ? 'Edit Application' : 'Add New Application'}
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Enter application details to track in your Runway dashboard
            </p>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Company & Role */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                <Building2 size={14} color="var(--accent-indigo)" /> Company Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Stripe, Airbnb, Google"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              />
            </div>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                <Briefcase size={14} color="var(--accent-indigo)" /> Job Title / Role *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Senior Frontend Developer"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
          </div>

          {/* Location & Salary */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                <MapPin size={14} color="var(--accent-indigo)" /> Location
              </label>
              <input
                type="text"
                placeholder="e.g. Remote, San Francisco, Hybrid"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                <DollarSign size={14} color="var(--accent-indigo)" /> Salary / Compensation
              </label>
              <input
                type="text"
                placeholder="e.g. $150,000 - $180,000"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
              />
            </div>
          </div>

          {/* Job URL & Applied Date */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                <LinkIcon size={14} color="var(--accent-indigo)" /> Job Posting URL
              </label>
              <input
                type="url"
                placeholder="https://..."
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              />
            </div>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                <Calendar size={14} color="var(--accent-indigo)" /> Date Applied
              </label>
              <input
                type="date"
                value={formData.appliedDate}
                onChange={(e) => setFormData({ ...formData, appliedDate: e.target.value })}
              />
            </div>
          </div>

          {/* Status & Tags */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Application Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                {Object.keys(STATUS_CONFIG).map((k) => (
                  <option key={k} value={k}>
                    {STATUS_CONFIG[k].label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                <Tag size={14} color="var(--accent-indigo)" /> Tags (comma-separated)
              </label>
              <input
                type="text"
                placeholder="e.g. Remote, Referral, Urgent"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              <FileText size={14} color="var(--accent-indigo)" /> Notes & Interview Details
            </label>
            <textarea
              rows={3}
              placeholder="Add recruiter contact, interview preparation details, key requirements..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          {/* Form Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px', paddingTop: '16px', borderTop: '1px solid var(--border-light)' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <Save size={16} /> Save Application
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
