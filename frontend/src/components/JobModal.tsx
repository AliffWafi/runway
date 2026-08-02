'use client';

import React, { useState, useEffect } from 'react';
import { JobApplication, STATUS_CONFIG, ApplicationStatus } from '../types/job';
import { ChevronDown, Loader2 } from 'lucide-react';

interface JobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: Partial<JobApplication>) => Promise<void> | void;
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

  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const statusKeys = Object.keys(STATUS_CONFIG) as ApplicationStatus[];

  const bannerColors: Record<ApplicationStatus, { bg: string; text: string }> = {
    taxiing: { bg: '#d5c4a1', text: '#282828' },
    holding: { bg: '#7c6f64', text: '#fbf1c7' },
    radar_contact: { bg: '#fe8019', text: '#282828' },
    cleared_for_takeoff: { bg: '#98971a', text: '#282828' },
    airborne: { bg: '#458588', text: '#fbf1c7' },
    holding_pattern: { bg: '#fabd2f', text: '#282828' },
    return_to_gate: { bg: '#ea696c', text: '#282828' }
  };

  useEffect(() => {
    setIsSubmitting(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.company.trim() || !formData.title.trim() || isSubmitting) return;

    const formattedTags = formData.tags
      ? formData.tags.split(',').map(t => t.trim()).filter(Boolean)
      : [];

    setIsSubmitting(true);
    try {
      await onSave({
        ...formData,
        tags: formattedTags
      });
    } catch (err) {
      console.error('Error submitting form:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentStatusConfig = STATUS_CONFIG[formData.status] || STATUS_CONFIG.taxiing;
  const currentBanner = bannerColors[formData.status] || { bg: '#d5c4a1', text: '#282828' };

  return (
    <div className="modal-overlay" onClick={onClose}>
      {/* Physical Paper Document Form Container - Compact Fits Whole Screen Without Scroll */}
      <div 
        className="modal-container bg-[#fbf1c7] border-2 border-[#3c3836] rounded-sm max-w-xl p-5 shadow-[6px_6px_0px_#3c3836] relative font-mono text-xs text-[#282828]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Corner Bracket Marks Framing */}
        <div className="absolute top-2 left-2 w-3.5 h-3.5 border-t-2 border-l-2 border-[#3c3836]" />
        <div className="absolute top-2 right-2 w-3.5 h-3.5 border-t-2 border-r-2 border-[#3c3836]" />
        <div className="absolute bottom-2 left-2 w-3.5 h-3.5 border-b-2 border-l-2 border-[#3c3836]" />
        <div className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b-2 border-r-2 border-[#3c3836]" />

        {/* 1. Centered Underlined Header Title */}
        <div className="text-center mb-4">
          <h2 className="text-lg font-bold font-mono text-[#282828] underline underline-offset-4 tracking-wider uppercase">
            {editingJob ? 'MANIFEST LOG [AMENDMENT]' : 'MANIFEST LOG'}
          </h2>
        </div>

        {/* Form Body - Compact Grid Spacing */}
        <form onSubmit={handleSubmit} className="space-y-4 px-1">
          
          {/* Row 1: [ COMPANY ] __________   [ ROLE ] __________ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div className="flex items-center gap-2">
              <div className="bg-[#ebdbb2] border border-[#3c3836] px-2.5 py-0.5 text-center min-w-[85px] font-bold text-[10px] shadow-[1px_1px_0px_#3c3836]">
                COMPANY
              </div>
              <input
                type="text"
                required
                placeholder="e.g. Stripe, Vercel"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full bg-[#fbf1c7] border-b-2 border-[#3c3836] focus:border-[#d65d0e] focus:outline-none px-1 py-0.5 font-mono text-xs font-bold"
              />
            </div>

            <div className="flex items-center gap-2">
              <div className="bg-[#ebdbb2] border border-[#3c3836] px-2.5 py-0.5 text-center min-w-[85px] font-bold text-[10px] shadow-[1px_1px_0px_#3c3836]">
                ROLE / TITLE
              </div>
              <input
                type="text"
                required
                placeholder="e.g. Frontend Dev"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-[#fbf1c7] border-b-2 border-[#3c3836] focus:border-[#d65d0e] focus:outline-none px-1 py-0.5 font-mono text-xs font-bold"
              />
            </div>
          </div>

          {/* Row 2: [ LOCATION ] __________ [ SALARY / COMP ] __________ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div className="flex items-center gap-2">
              <div className="bg-[#ebdbb2] border border-[#3c3836] px-2.5 py-0.5 text-center min-w-[85px] font-bold text-[10px] shadow-[1px_1px_0px_#3c3836]">
                LOCATION
              </div>
              <input
                type="text"
                placeholder="e.g. Remote, San Francisco"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full bg-[#fbf1c7] border-b-2 border-[#3c3836] focus:border-[#d65d0e] focus:outline-none px-1 py-0.5 font-mono text-xs font-bold"
              />
            </div>

            <div className="flex items-center gap-2">
              <div className="bg-[#ebdbb2] border border-[#3c3836] px-2.5 py-0.5 text-center min-w-[85px] font-bold text-[10px] shadow-[1px_1px_0px_#3c3836]">
                SALARY/COMP
              </div>
              <input
                type="text"
                placeholder="e.g. $140k/yr, RM8,000"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                className="w-full bg-[#fbf1c7] border-b-2 border-[#3c3836] focus:border-[#d65d0e] focus:outline-none px-1 py-0.5 font-mono text-xs font-bold"
              />
            </div>
          </div>

          {/* Row 3: [ LINK / URL ] __________ [ DATE LOGGED ] [ YYYY-MM-DD ] */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div className="flex items-center gap-2">
              <div className="bg-[#ebdbb2] border border-[#3c3836] px-2.5 py-0.5 text-center min-w-[85px] font-bold text-[10px] shadow-[1px_1px_0px_#3c3836]">
                LINK / URL
              </div>
              <input
                type="url"
                placeholder="https://..."
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="w-full bg-[#fbf1c7] border-b-2 border-[#3c3836] focus:border-[#d65d0e] focus:outline-none px-1 py-0.5 font-mono text-xs font-bold"
              />
            </div>

            <div className="flex items-center gap-2">
              <div className="bg-[#ebdbb2] border border-[#3c3836] px-2.5 py-0.5 text-center min-w-[85px] font-bold text-[10px] shadow-[1px_1px_0px_#3c3836]">
                DATE LOGGED
              </div>
              <input
                type="date"
                value={formData.appliedDate}
                onChange={(e) => setFormData({ ...formData, appliedDate: e.target.value })}
                className="w-full bg-[#fbf1c7] border-b-2 border-[#3c3836] focus:border-[#d65d0e] focus:outline-none px-1 py-0.5 font-mono text-xs font-bold"
              />
            </div>
          </div>

          {/* Row 4: [ STATUS ] Custom Retro Banner Selector */}
          <div className="flex items-center gap-2">
            <div className="bg-[#ebdbb2] border border-[#3c3836] px-2.5 py-0.5 text-center min-w-[85px] font-bold text-[10px] shadow-[1px_1px_0px_#3c3836]">
              FLIGHT STATUS
            </div>
            
            <div className="relative flex-1">
              <button
                type="button"
                onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                className="w-full border border-[#3c3836] px-3 py-1 font-extrabold text-xs uppercase shadow-[2px_2px_0px_#3c3836] flex items-center justify-between transition-all"
                style={{ backgroundColor: currentBanner.bg, color: currentBanner.text }}
              >
                <span>{currentStatusConfig.label} {currentStatusConfig.sublabel}</span>
                <ChevronDown className="w-4 h-4 ml-1" />
              </button>

              {/* Status Select Options Menu */}
              {isStatusDropdownOpen && (
                <div className="absolute left-0 right-0 top-full mt-1 z-50 border-2 border-[#3c3836] shadow-[4px_4px_0px_#3c3836] bg-[#282828]">
                  {statusKeys.map((key) => {
                    const banner = bannerColors[key];
                    const cfg = STATUS_CONFIG[key];

                    return (
                      <div
                        key={key}
                        onClick={() => {
                          setFormData({ ...formData, status: key });
                          setIsStatusDropdownOpen(false);
                        }}
                        className="py-1.5 px-3 text-xs font-mono font-bold uppercase cursor-pointer hover:brightness-110 flex items-center justify-between border-b border-[#3c3836] last:border-b-0"
                        style={{ backgroundColor: banner.bg, color: banner.text }}
                      >
                        <span>{cfg.label} {cfg.sublabel}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Row 5: [ TAGS / METRICS ] comma separated tags */}
          <div className="flex items-center gap-2">
            <div className="bg-[#ebdbb2] border border-[#3c3836] px-2.5 py-0.5 text-center min-w-[85px] font-bold text-[10px] shadow-[1px_1px_0px_#3c3836]">
              TAGS (COMMA)
            </div>
            <input
              type="text"
              placeholder="e.g. React, Remote, High Priority"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full bg-[#fbf1c7] border-b-2 border-[#3c3836] focus:border-[#d65d0e] focus:outline-none px-1 py-0.5 font-mono text-xs font-bold"
            />
          </div>

          {/* Row 6: [ LOG NOTES ] multiline operational memo */}
          <div>
            <div className="bg-[#ebdbb2] border border-[#3c3836] px-2.5 py-0.5 inline-block font-bold text-[10px] shadow-[1px_1px_0px_#3c3836] mb-1.5">
              OPERATIONAL LOG NOTES
            </div>
            <textarea
              rows={2}
              placeholder="Add interview notes, recruiter contacts, follow-up dates..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full bg-[#ebdbb2]/40 border-2 border-[#3c3836] focus:border-[#d65d0e] focus:outline-none p-2 font-mono text-xs font-bold rounded-sm resize-none"
            />
          </div>

          {/* Dashed Horizontal Line Separator */}
          <div className="border-b-2 border-dashed border-[#3c3836] pt-1" />

          {/* Footer Bar: ENTRY № [ID]      [ ABORT / REVERT ] [ ADD / UPDATE ] */}
          <div className="flex items-center justify-between pt-1">
            <div className="text-xs font-bold font-mono text-[#3c3836]">
              ENTRY № {editingJob ? 'AMD' : 'NEW'}
            </div>

            <div className="flex items-center gap-3">
              {/* Abort / Revert Button */}
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="bg-[#ea696c] hover:bg-[#fb4934] text-[#282828] font-mono font-extrabold text-xs px-4 py-1 border border-[#3c3836] shadow-[2px_2px_0px_#3c3836] active:translate-x-0.5 active:translate-y-0.5 transition-all uppercase disabled:opacity-50 cursor-pointer"
              >
                {editingJob ? 'REVERT' : 'ABORT'}
              </button>

              {/* Add / Update Button with Loading Spinner */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#458588] hover:bg-[#83a598] text-[#fbf1c7] font-mono font-extrabold text-xs px-4 py-1 border border-[#3c3836] shadow-[2px_2px_0px_#3c3836] active:translate-x-0.5 active:translate-y-0.5 transition-all uppercase flex items-center gap-1.5 disabled:opacity-60 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>{editingJob ? 'UPDATING...' : 'ADDING...'}</span>
                  </>
                ) : (
                  <span>{editingJob ? 'UPDATE' : 'ADD'}</span>
                )}
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
