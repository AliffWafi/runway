'use client';

import React, { useState, useEffect } from 'react';
import { JobApplication, STATUS_CONFIG, ApplicationStatus } from '../types/job';
import { ChevronDown } from 'lucide-react';

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

  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
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
        appliedDate: initialStatus || 'taxiing',
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
                placeholder="e.g. MAYBANK"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="flex-1 bg-transparent border-b-2 border-[#3c3836] px-1 py-0.5 font-bold text-xs text-[#282828] outline-none focus:border-[#fe8019]"
              />
            </div>

            <div className="flex items-center gap-2">
              <div className="bg-[#ebdbb2] border border-[#3c3836] px-2.5 py-0.5 text-center min-w-[85px] font-bold text-[10px] shadow-[1px_1px_0px_#3c3836]">
                ROLE
              </div>
              <input
                type="text"
                required
                placeholder="e.g. PROTEGE"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="flex-1 bg-transparent border-b-2 border-[#3c3836] px-1 py-0.5 font-bold text-xs text-[#282828] outline-none focus:border-[#fe8019]"
              />
            </div>
          </div>

          {/* Row 2: [ DATE ] __________   [ LOCATION ] __________ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div className="flex items-center gap-2">
              <div className="bg-[#ebdbb2] border border-[#3c3836] px-2.5 py-0.5 text-center min-w-[85px] font-bold text-[10px] shadow-[1px_1px_0px_#3c3836]">
                DATE
              </div>
              <input
                type="date"
                value={formData.appliedDate}
                onChange={(e) => setFormData({ ...formData, appliedDate: e.target.value })}
                className="flex-1 bg-transparent border-b-2 border-[#3c3836] px-1 py-0.5 font-mono text-xs text-[#282828] outline-none focus:border-[#fe8019]"
              />
            </div>

            <div className="flex items-center gap-2">
              <div className="bg-[#ebdbb2] border border-[#3c3836] px-2.5 py-0.5 text-center min-w-[85px] font-bold text-[10px] shadow-[1px_1px_0px_#3c3836]">
                LOCATION
              </div>
              <input
                type="text"
                placeholder="e.g. KL"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="flex-1 bg-transparent border-b-2 border-[#3c3836] px-1 py-0.5 font-bold text-xs text-[#282828] outline-none focus:border-[#fe8019]"
              />
            </div>
          </div>

          {/* Row 3: Compensation & Listing URL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div className="flex items-center gap-2">
              <div className="bg-[#ebdbb2] border border-[#3c3836] px-2.5 py-0.5 text-center min-w-[85px] font-bold text-[10px] shadow-[1px_1px_0px_#3c3836]">
                SALARY
              </div>
              <input
                type="text"
                placeholder="e.g. RM 3,500"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                className="flex-1 bg-transparent border-b-2 border-[#3c3836] px-1 py-0.5 font-mono text-xs text-[#282828] outline-none focus:border-[#fe8019]"
              />
            </div>

            <div className="flex items-center gap-2">
              <div className="bg-[#ebdbb2] border border-[#3c3836] px-2.5 py-0.5 text-center min-w-[85px] font-bold text-[10px] shadow-[1px_1px_0px_#3c3836]">
                LINK
              </div>
              <input
                type="url"
                placeholder="https://..."
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="flex-1 bg-transparent border-b-2 border-[#3c3836] px-1 py-0.5 text-xs text-[#282828] outline-none focus:border-[#fe8019]"
              />
            </div>
          </div>

          {/* Row 4 (Center): [ STATUS ] [ DROPDOWN ] */}
          <div className="flex items-center justify-center gap-3 pt-1">
            <div className="bg-[#ebdbb2] border border-[#3c3836] px-3 py-1 font-bold text-[10px] shadow-[1px_1px_0px_#3c3836]">
              STATUS
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                className="border border-[#3c3836] px-3 py-1 font-mono text-[10px] uppercase shadow-[1px_1px_0px_#3c3836] flex items-center justify-between gap-2 transition-all min-w-[160px]"
                style={{ backgroundColor: currentBanner.bg, color: currentBanner.text }}
              >
                <div className="flex flex-col text-left leading-tight overflow-hidden">
                  <span className="font-extrabold truncate">{currentStatusConfig.label}</span>
                  <span className="font-normal opacity-85 text-[8.5px] truncate">{currentStatusConfig.sublabel}</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 opacity-80 shrink-0 ml-1" />
              </button>

              {/* Custom Gruvbox Dropdown Menu */}
              {isStatusDropdownOpen && (
                <div className="absolute left-0 right-0 top-full mt-1 z-50 border-2 border-[#3c3836] shadow-[3px_3px_0px_#3c3836] bg-[#282828] min-w-[180px]">
                  {statusKeys.map((key) => {
                    const optBanner = bannerColors[key];
                    const optConfig = STATUS_CONFIG[key];

                    return (
                      <div
                        key={key}
                        onClick={() => {
                          setFormData({ ...formData, status: key });
                          setIsStatusDropdownOpen(false);
                        }}
                        className="py-1.5 px-3 text-center border-b border-[#3c3836] last:border-b-0 cursor-pointer hover:brightness-110"
                        style={{ backgroundColor: optBanner.bg, color: optBanner.text }}
                      >
                        <div className="text-[10px] font-mono font-extrabold uppercase leading-tight">
                          {optConfig.label}
                        </div>
                        <div className="text-[8.5px] font-mono font-normal opacity-85 uppercase leading-tight mt-0.5">
                          {optConfig.sublabel}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
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
                className="bg-[#ea696c] hover:bg-[#fb4934] text-[#282828] font-mono font-extrabold text-xs px-4 py-1 border border-[#3c3836] shadow-[2px_2px_0px_#3c3836] active:translate-x-0.5 active:translate-y-0.5 transition-all uppercase"
              >
                {editingJob ? 'REVERT' : 'ABORT'}
              </button>

              {/* Add / Update Button */}
              <button
                type="submit"
                className="bg-[#458588] hover:bg-[#83a598] text-[#fbf1c7] font-mono font-extrabold text-xs px-4 py-1 border border-[#3c3836] shadow-[2px_2px_0px_#3c3836] active:translate-x-0.5 active:translate-y-0.5 transition-all uppercase"
              >
                {editingJob ? 'UPDATE' : 'ADD'}
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
