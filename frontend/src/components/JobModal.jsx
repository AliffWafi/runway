'use client';

import React, { useState, useEffect } from 'react';
import { JobApplication, STATUS_CONFIG, ApplicationStatus } from '../types/job';
import { X, Save } from 'lucide-react';

interface JobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: Partial<JobApplication>) => void;
  editingJob: JobApplication | null;
  initialStatus?: ApplicationStatus;
}

export function JobModal({ isOpen, onClose, onSave, editingJob, initialStatus }: JobModalProps) {
  const [formData, setFormData] = useState({
    company: '',
    title: '',
    location: '',
    salary: '',
    url: '',
    appliedDate: new Date().toISOString().split('T')[0],
    status: 'taxiing' as ApplicationStatus,
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
        status: editingJob.status || 'taxiing',
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
        status: initialStatus || 'taxiing',
        tags: '',
        notes: ''
      });
    }
  }, [editingJob, initialStatus, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
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
      <div className="modal-container bg-[#282828] border border-[#504945] rounded-lg max-w-xl" onClick={(e) => e.stopPropagation()}>
        
        {/* Header - Physical Form Document Header */}
        <div className="p-4 border-b border-[#504945] flex items-center justify-between bg-[#1d2021]">
          <div>
            <div className="text-[10px] font-mono font-bold tracking-widest text-[#fe8019] uppercase">
              FLIGHT MANIFEST ENTRY FORM
            </div>
            <h3 className="text-base font-bold text-[#fbf1c7] mt-0.5">
              {editingJob ? 'EDIT APPLICATION RECORD' : 'NEW APPLICATION ENTRY'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded bg-[#3c3836] border border-[#504945] text-[#a89984] hover:text-[#ebdbb2]">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-3.5">
          
          {/* Company & Position */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-mono font-bold tracking-wider text-[#a89984] uppercase mb-1">
                COMPANY NAME *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Stripe, Airbnb, Google"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full bg-[#1d2021] border border-[#504945] rounded px-3 py-1.5 text-xs text-[#ebdbb2] placeholder:text-[#928374] focus:outline-none focus:border-[#fe8019]"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono font-bold tracking-wider text-[#a89984] uppercase mb-1">
                JOB POSITION / TITLE *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Senior Frontend Engineer"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-[#1d2021] border border-[#504945] rounded px-3 py-1.5 text-xs text-[#ebdbb2] placeholder:text-[#928374] focus:outline-none focus:border-[#fe8019]"
              />
            </div>
          </div>

          {/* Location & Compensation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-mono font-bold tracking-wider text-[#a89984] uppercase mb-1">
                LOCATION / WORKMODE
              </label>
              <input
                type="text"
                placeholder="e.g. Remote, San Francisco, Hybrid"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full bg-[#1d2021] border border-[#504945] rounded px-3 py-1.5 text-xs text-[#ebdbb2] placeholder:text-[#928374] focus:outline-none focus:border-[#fe8019]"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono font-bold tracking-wider text-[#a89984] uppercase mb-1">
                COMPENSATION / SALARY
              </label>
              <input
                type="text"
                placeholder="e.g. $150,000 - $180,000"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                className="w-full bg-[#1d2021] border border-[#504945] rounded px-3 py-1.5 text-xs font-mono text-[#ebdbb2] placeholder:text-[#928374] focus:outline-none focus:border-[#fe8019]"
              />
            </div>
          </div>

          {/* Job URL & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-mono font-bold tracking-wider text-[#a89984] uppercase mb-1">
                JOB LISTING URL
              </label>
              <input
                type="url"
                placeholder="https://..."
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="w-full bg-[#1d2021] border border-[#504945] rounded px-3 py-1.5 text-xs text-[#ebdbb2] placeholder:text-[#928374] focus:outline-none focus:border-[#fe8019]"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono font-bold tracking-wider text-[#a89984] uppercase mb-1">
                FILED DATE
              </label>
              <input
                type="date"
                value={formData.appliedDate}
                onChange={(e) => setFormData({ ...formData, appliedDate: e.target.value })}
                className="w-full bg-[#1d2021] border border-[#504945] rounded px-3 py-1.5 text-xs font-mono text-[#ebdbb2] focus:outline-none focus:border-[#fe8019]"
              />
            </div>
          </div>

          {/* Status Stage & Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-mono font-bold tracking-wider text-[#a89984] uppercase mb-1">
                STATUS STAGE
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as ApplicationStatus })}
                className="w-full bg-[#1d2021] border border-[#504945] rounded px-3 py-1.5 text-xs font-mono text-[#fe8019] font-bold focus:outline-none"
              >
                {Object.keys(STATUS_CONFIG).map((k) => (
                  <option key={k} value={k} className="bg-[#282828] text-[#ebdbb2]">
                    {STATUS_CONFIG[k as ApplicationStatus].label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-mono font-bold tracking-wider text-[#a89984] uppercase mb-1">
                TAGS (COMMA SEPARATED)
              </label>
              <input
                type="text"
                placeholder="e.g. Remote, Referral, Urgent"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full bg-[#1d2021] border border-[#504945] rounded px-3 py-1.5 text-xs text-[#ebdbb2] placeholder:text-[#928374] focus:outline-none focus:border-[#fe8019]"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-[10px] font-mono font-bold tracking-wider text-[#a89984] uppercase mb-1">
              LOGBOOK NOTES & INTERVIEW DETAILS
            </label>
            <textarea
              rows={3}
              placeholder="Add interview contacts, key requirements, technical prep notes..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full bg-[#1d2021] border border-[#504945] rounded px-3 py-1.5 text-xs text-[#ebdbb2] placeholder:text-[#928374] focus:outline-none focus:border-[#fe8019]"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-3 mt-2 border-t border-[#504945]">
            <button 
              type="button" 
              onClick={onClose}
              className="px-3.5 py-1.5 rounded bg-[#3c3836] border border-[#504945] text-[#a89984] hover:text-[#ebdbb2] text-xs font-mono font-semibold transition-all"
            >
              CANCEL
            </button>
            <button 
              type="submit" 
              className="px-4 py-1.5 rounded bg-[#fe8019] hover:bg-[#fabd2f] text-[#282828] text-xs font-mono font-extrabold flex items-center gap-1 transition-all"
            >
              <Save className="w-3.5 h-3.5" /> SAVE ENTRY
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
