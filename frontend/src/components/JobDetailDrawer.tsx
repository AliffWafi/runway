'use client';

import React, { useState } from 'react';
import { JobApplication, STATUS_CONFIG, ApplicationStatus } from '../types/job';
import { ChevronDown, ExternalLink } from 'lucide-react';

interface JobDetailDrawerProps {
  job: JobApplication | null;
  onClose: () => void;
  onEdit: (job: JobApplication) => void;
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, newStatus: ApplicationStatus) => void;
}

export function JobDetailDrawer({
  job,
  onClose,
  onEdit,
  onDelete,
  onUpdateStatus
}: JobDetailDrawerProps) {
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  if (!job) return null;

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

  const currentStatusConfig = STATUS_CONFIG[job.status] || STATUS_CONFIG.taxiing;
  const currentBanner = bannerColors[job.status] || { bg: '#d5c4a1', text: '#282828' };

  return (
    <div className="modal-overlay" onClick={onClose}>
      {/* Gruvbox Paper Document Dossier Sheet Container */}
      <div 
        className="modal-container bg-[#fbf1c7] border-2 border-[#3c3836] rounded-sm max-w-2xl p-5 shadow-[6px_6px_0px_#3c3836] relative font-mono text-xs text-[#282828]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Corner Bracket Marks Framing */}
        <div className="absolute top-2 left-2 w-3.5 h-3.5 border-t-2 border-l-2 border-[#3c3836]" />
        <div className="absolute top-2 right-2 w-3.5 h-3.5 border-t-2 border-r-2 border-[#3c3836]" />
        <div className="absolute bottom-2 left-2 w-3.5 h-3.5 border-b-2 border-l-2 border-[#3c3836]" />
        <div className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b-2 border-r-2 border-[#3c3836]" />

        {/* 1. Header Bar with Action Controls */}
        <div className="flex justify-between items-center mb-4 pb-2 border-b-2 border-dashed border-[#3c3836]">
          <h2 className="text-lg font-bold font-mono text-[#282828] underline underline-offset-4 uppercase">
            MANIFEST DOSSIER: {job.company}
          </h2>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(job)}
              className="bg-[#458588] text-[#fbf1c7] font-bold text-[10px] px-2.5 py-1 border border-[#3c3836] shadow-[1px_1px_0px_#3c3836] hover:bg-[#83a598] transition-all uppercase"
            >
              [ EDIT ]
            </button>
            <button
              onClick={() => onDelete(job.id)}
              className="bg-[#ea696c] text-[#282828] font-bold text-[10px] px-2.5 py-1 border border-[#3c3836] shadow-[1px_1px_0px_#3c3836] hover:bg-[#fb4934] transition-all uppercase"
            >
              [ DELETE ]
            </button>
            <button
              onClick={onClose}
              className="bg-[#3c3836] text-[#ebdbb2] font-bold text-[10px] px-2 py-1 rounded-sm hover:bg-[#504945] transition-all"
            >
              [X]
            </button>
          </div>
        </div>

        {/* 2. Position Title & Job Link */}
        <div className="mb-4">
          <div className="text-base font-bold font-mono text-[#282828] uppercase">
            {job.title}
          </div>
          {job.url && (
            <a
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-1 text-[11px] font-mono text-[#b16286] font-bold underline hover:text-[#d3869b]"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              OPEN ORIGINAL JOB POSTING
            </a>
          )}
        </div>

        {/* 3. Metadata Grid: Location, Salary, Date, Status */}
        <div className="bg-[#ebdbb2] border border-[#3c3836] p-3 rounded-sm mb-4 grid grid-cols-1 sm:grid-cols-2 gap-3 shadow-[2px_2px_0px_#3c3836]">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#665c54] min-w-[75px]">LOCATION:</span>
            <span className="font-bold text-[#282828] uppercase">{job.location || 'KL'}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-bold text-[#665c54] min-w-[75px]">SALARY:</span>
            <span className="font-bold text-[#282828]">{job.salary || 'NOT DISCLOSED'}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-bold text-[#665c54] min-w-[75px]">DATE APPLIED:</span>
            <span className="font-bold text-[#282828]">{job.appliedDate || '2026-07-27'}</span>
          </div>

          {/* Custom Status Dropdown Menu inside Dossier */}
          <div className="flex items-center gap-2 relative">
            <span className="font-bold text-[#665c54] min-w-[75px]">STATUS:</span>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                className="border border-[#3c3836] px-2.5 py-0.5 font-extrabold text-[10px] uppercase shadow-[1px_1px_0px_#3c3836] flex items-center gap-1.5 transition-all"
                style={{ backgroundColor: currentBanner.bg, color: currentBanner.text }}
              >
                {currentStatusConfig.label}
                <ChevronDown className="w-3 h-3" />
              </button>

              {isStatusDropdownOpen && (
                <div className="absolute left-0 top-full mt-1 z-50 border-2 border-[#3c3836] shadow-[3px_3px_0px_#3c3836] bg-[#282828] min-w-[170px]">
                  {statusKeys.map((key) => {
                    const optBanner = bannerColors[key];
                    const optConfig = STATUS_CONFIG[key];

                    return (
                      <div
                        key={key}
                        onClick={() => {
                          onUpdateStatus(job.id, key);
                          setIsStatusDropdownOpen(false);
                        }}
                        className="py-1.5 px-2.5 text-[10px] font-mono font-bold uppercase text-center border-b border-[#3c3836] last:border-b-0 cursor-pointer hover:brightness-110"
                        style={{ backgroundColor: optBanner.bg, color: optBanner.text }}
                      >
                        {optConfig.label}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 4. Tags & Keywords */}
        {job.tags && job.tags.length > 0 && (
          <div className="mb-3">
            <div className="text-[10px] font-bold text-[#665c54] uppercase mb-1">
              [ TAGS & KEYWORDS ]
            </div>
            <div className="flex flex-wrap gap-1.5">
              {job.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-[#ebdbb2] border border-[#3c3836] px-2 py-0.5 text-[10px] font-mono font-bold uppercase text-[#282828]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 5. Application Notes */}
        <div className="mb-4">
          <div className="text-[10px] font-bold text-[#665c54] uppercase mb-1">
            [ APPLICATION NOTES ]
          </div>
          <div className="bg-[#ebdbb2] border border-[#3c3836] p-2.5 rounded-sm text-xs font-mono text-[#282828] min-h-[50px]">
            {job.notes || 'No operational notes attached to this dossier entry.'}
          </div>
        </div>

        {/* 6. Timeline Log */}
        {job.history && job.history.length > 0 && (
          <div className="mb-4">
            <div className="text-[10px] font-bold text-[#665c54] uppercase mb-1.5">
              [ FLIGHT ACTIVITY TIMELINE ]
            </div>
            <div className="bg-[#ebdbb2]/50 border border-[#3c3836] p-2 rounded-sm space-y-1.5 max-h-[100px] overflow-y-auto">
              {job.history.map((entry, idx) => (
                <div key={idx} className="flex items-start gap-2 text-[10px] font-mono border-b border-dashed border-[#3c3836]/40 last:border-b-0 pb-1">
                  <span className="text-[#665c54] shrink-0 font-bold">{entry.date}</span>
                  <span className="font-bold uppercase text-[#d65d0e] shrink-0">
                    [{STATUS_CONFIG[entry.status as ApplicationStatus]?.label || entry.status}]
                  </span>
                  <span className="text-[#3c3836] truncate">{entry.note}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Bar */}
        <div className="border-t-2 border-dashed border-[#3c3836] pt-3 flex items-center justify-between">
          <div className="text-xs font-bold font-mono text-[#665c54]">
            DOSSIER RECORD № {job.id.substring(0, 8).toUpperCase()}
          </div>
          <button
            onClick={onClose}
            className="bg-[#fe8019] text-[#282828] font-bold text-xs px-4 py-1 border border-[#3c3836] shadow-[2px_2px_0px_#3c3836] active:translate-x-0.5 active:translate-y-0.5 transition-all uppercase"
          >
            CLOSE DOSSIER
          </button>
        </div>

      </div>
    </div>
  );
}
