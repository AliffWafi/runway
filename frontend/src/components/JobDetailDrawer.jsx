'use client';

import React from 'react';
import { JobApplication, STATUS_CONFIG, ApplicationStatus } from '../types/job';
import { X, ExternalLink, Edit3, Trash2 } from 'lucide-react';

interface JobDetailDrawerProps {
  job: JobApplication | null;
  onClose: () => void;
  onEdit: (job: JobApplication) => void;
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, newStatus: ApplicationStatus) => void;
}

export function JobDetailDrawer({ job, onClose, onEdit, onDelete, onUpdateStatus }: JobDetailDrawerProps) {
  if (!job) return null;

  const config = STATUS_CONFIG[job.status] || STATUS_CONFIG.taxiing;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-container bg-[#282828] border border-[#504945] rounded-lg max-w-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        style={{
          borderLeftWidth: '5px',
          borderLeftColor: config.color
        }}
      >
        {/* Header - Pilot Logbook Dossier Title */}
        <div className="p-4 bg-[#1d2021] border-b border-[#504945] flex items-center justify-between">
          <div>
            <div className="text-[9px] font-mono font-bold tracking-widest text-[#a89984] uppercase">
              APPLICATION DOSSIER RECORD
            </div>
            <span className={`badge ${config.badgeClass} mt-1 text-[10px]`}>
              <span className="badge-dot" />
              {config.label}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button 
              onClick={() => { onClose(); onEdit(job); }} 
              title="Edit Record"
              className="p-1.5 rounded bg-[#3c3836] border border-[#504945] text-[#a89984] hover:text-[#ebdbb2]"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={() => { onClose(); onDelete(job.id); }} 
              title="Delete Record"
              className="p-1.5 rounded bg-[#3c3836] border border-[#504945] text-[#fb4934] hover:bg-[#fb4934]/20"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={onClose} 
              className="p-1.5 rounded bg-[#3c3836] border border-[#504945] text-[#a89984] hover:text-[#ebdbb2]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-5 flex flex-col gap-4 text-xs font-sans">
          
          {/* Main Info Block */}
          <div>
            <div className="text-[10px] font-mono font-bold tracking-widest text-[#83a598] uppercase">
              COMPANY
            </div>
            <h2 className="text-lg font-bold text-[#fbf1c7] mb-1">
              {job.company}
            </h2>

            <div className="text-[10px] font-mono font-bold tracking-widest text-[#a89984] uppercase mt-2">
              POSITION / ROLE
            </div>
            <div className="text-sm font-semibold text-[#ebdbb2] mb-3">
              {job.title}
            </div>

            {job.url && (
              <a 
                href={job.url} 
                target="_blank" 
                rel="noreferrer" 
                className="inline-flex items-center gap-1.5 text-[11px] font-mono text-[#fe8019] bg-[#fe8019]/10 border border-[#fe8019]/30 px-2.5 py-1 rounded hover:bg-[#fe8019]/20 transition-all"
              >
                <ExternalLink className="w-3 h-3" /> OPEN ORIGINAL JOB LISTING
              </a>
            )}
          </div>

          {/* Form Grid Blocks */}
          <div className="grid grid-cols-2 gap-3 bg-[#3c3836] p-3.5 rounded border border-[#504945]">
            <div>
              <div className="text-[9px] font-mono font-bold tracking-widest text-[#928374] uppercase">
                LOCATION
              </div>
              <div className="text-xs font-medium text-[#ebdbb2] mt-0.5">
                {job.location || '—'}
              </div>
            </div>

            <div>
              <div className="text-[9px] font-mono font-bold tracking-widest text-[#928374] uppercase">
                COMPENSATION
              </div>
              <div className="text-xs font-mono font-medium text-[#b8bb26] mt-0.5">
                {job.salary || '—'}
              </div>
            </div>

            <div>
              <div className="text-[9px] font-mono font-bold tracking-widest text-[#928374] uppercase">
                FILED ON
              </div>
              <div className="text-xs font-mono text-[#ebdbb2] mt-0.5">
                {job.appliedDate}
              </div>
            </div>

            <div>
              <div className="text-[9px] font-mono font-bold tracking-widest text-[#928374] uppercase">
                UPDATE STATUS STAGE
              </div>
              <select
                value={job.status}
                onChange={(e) => onUpdateStatus(job.id, e.target.value as ApplicationStatus)}
                className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#1d2021] border border-[#504945] text-[#fe8019] focus:outline-none mt-0.5"
              >
                {Object.keys(STATUS_CONFIG).map((k) => (
                  <option key={k} value={k} className="bg-[#282828] text-[#ebdbb2]">
                    {STATUS_CONFIG[k as ApplicationStatus].label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tags */}
          {job.tags && job.tags.length > 0 && (
            <div>
              <div className="text-[9px] font-mono font-bold tracking-widest text-[#928374] uppercase mb-1.5">
                TAGS & CATEGORIES
              </div>
              <div className="flex flex-wrap gap-1">
                {job.tags.map((tag, idx) => (
                  <span 
                    key={idx} 
                    className="text-[10px] font-mono bg-[#3c3836] text-[#d5c4a1] px-2 py-0.5 rounded border border-[#504945]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Logbook Notes */}
          {job.notes && (
            <div>
              <div className="text-[9px] font-mono font-bold tracking-widest text-[#928374] uppercase mb-1.5">
                INTERVIEW & LOGBOOK NOTES
              </div>
              <div className="bg-[#1d2021] p-3 rounded border border-[#504945] text-xs text-[#ebdbb2] whitespace-pre-wrap leading-relaxed">
                {job.notes}
              </div>
            </div>
          )}

          {/* Activity History Timeline */}
          {job.history && job.history.length > 0 && (
            <div>
              <div className="text-[9px] font-mono font-bold tracking-widest text-[#928374] uppercase mb-2">
                FLIGHT STATUS TIMELINE LOG
              </div>
              <div className="flex flex-col gap-2">
                {job.history.map((log, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-start gap-2.5 text-xs relative pl-3 border-l-2 border-[#504945]"
                  >
                    <div className="w-16 text-[#928374] font-mono text-[10px]">
                      {log.date}
                    </div>
                    <div>
                      <span className={`badge ${STATUS_CONFIG[log.status]?.badgeClass || 'badge-taxiing'} text-[9px] px-1.5 py-0.5`}>
                        {STATUS_CONFIG[log.status]?.label || log.status}
                      </span>
                      {log.note && (
                        <div className="text-[11px] text-[#a89984] mt-0.5">
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
