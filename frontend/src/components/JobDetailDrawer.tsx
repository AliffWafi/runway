import React from 'react';
import { JobApplication, ApplicationStatus, STATUS_CONFIG } from '../types/job';

interface JobDetailDrawerProps {
  job: JobApplication | null;
  onClose: () => void;
  onEdit: (job: JobApplication) => void;
  onDelete: (id: string) => void;
  onUpdateStatus?: (id: string, newStatus: ApplicationStatus) => void;
  onStatusChange?: (id: string, newStatus: ApplicationStatus) => void;
}

export function JobDetailDrawer({
  job,
  onClose,
  onEdit,
  onDelete,
  onUpdateStatus,
  onStatusChange
}: JobDetailDrawerProps) {
  if (!job) return null;

  const handleStatusUpdate = (id: string, newStatus: ApplicationStatus) => {
    if (onUpdateStatus) {
      onUpdateStatus(id, newStatus);
    } else if (onStatusChange) {
      onStatusChange(id, newStatus);
    }
  };

  const statusKeys = Object.keys(STATUS_CONFIG) as ApplicationStatus[];

  const bannerColors: Record<ApplicationStatus, { bg: string; text: string }> = {
    taxiing: { bg: '#d5c4a1', text: '#282828' },
    holding: { bg: '#7c6f64', text: '#fbf1c7' },
    radar_contact: { bg: '#fe8019', text: '#282828' },
    cleared_for_takeoff: { bg: '#98971a', text: '#282828' },
    airborne: { bg: '#b8bb26', text: '#282828' },
    holding_pattern: { bg: '#d3869b', text: '#282828' },
    return_to_gate: { bg: '#fb4934', text: '#fbf1c7' }
  };

  const currentBanner = bannerColors[job.status] || { bg: '#d5c4a1', text: '#282828' };

  return (
    <div className="modal-overlay" onClick={onClose}>
      {/* Physical Paper Document Form Container - Centered Popup Modal */}
      <div 
        className="modal-container bg-[#fbf1c7] border-2 border-[#3c3836] rounded-sm max-w-xl w-full p-5 shadow-[6px_6px_0px_#3c3836] relative font-mono text-xs text-[#282828]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Corner Bracket Marks Framing */}
        <div className="absolute top-2 left-2 w-3.5 h-3.5 border-t-2 border-l-2 border-[#3c3836]" />
        <div className="absolute top-2 right-2 w-3.5 h-3.5 border-t-2 border-r-2 border-[#3c3836]" />
        <div className="absolute bottom-2 left-2 w-3.5 h-3.5 border-b-2 border-l-2 border-[#3c3836]" />
        <div className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b-2 border-r-2 border-[#3c3836]" />

        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-[#3c3836] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold font-mono px-2 py-0.5 bg-[#ebdbb2] border border-[#3c3836] text-[#3c3836]">
              FLIGHT DOSSIER
            </span>
            <span className="text-xs font-mono text-[#665c54]">
              ID: #{job.id.substring(0, 6)}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onEdit(job)}
              className="text-xs font-bold font-mono text-[#458588] hover:underline"
            >
              EDIT
            </button>
            <button
              onClick={() => {
                if (confirm('Are you sure you want to scrub this flight entry?')) {
                  onDelete(job.id);
                  onClose();
                }
              }}
              className="text-xs font-bold font-mono text-[#fb4934] hover:underline"
            >
              SCRUB
            </button>
            <button
              onClick={onClose}
              className="text-base font-bold text-[#3c3836] hover:text-[#fb4934] px-1"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Job Title & Company */}
        <div className="mb-4">
          <h2 className="text-xl font-black text-[#282828] uppercase tracking-wide">
            {job.title}
          </h2>
          <div className="text-sm font-bold text-[#d65d0e] uppercase tracking-wider mt-0.5">
            {job.company}
          </div>
        </div>

        {/* Status Quick Switcher Dropdown */}
        <div className="mb-4 bg-[#ebdbb2] border border-[#3c3836] p-3 rounded-sm">
          <div className="text-[10px] font-bold text-[#665c54] uppercase mb-1">
            CURRENT FLIGHT STATUS
          </div>
          <div className="relative">
            <select
              value={job.status}
              onChange={(e) => handleStatusUpdate(job.id, e.target.value as ApplicationStatus)}
              className="w-full border border-[#3c3836] text-xs font-bold p-2 pr-8 rounded-sm appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#d65d0e]"
              style={{
                backgroundColor: currentBanner.bg,
                color: currentBanner.text
              }}
            >
              {statusKeys.map((key) => {
                const cfg = STATUS_CONFIG[key];
                return (
                  <option
                    key={key}
                    value={key}
                    style={{
                      backgroundColor: bannerColors[key].bg,
                      color: bannerColors[key].text
                    }}
                  >
                    {cfg.label} {cfg.sublabel}
                  </option>
                );
              })}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#3c3836]">
              ▼
            </div>
          </div>
        </div>

        {/* Flight Details Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4 text-xs font-mono">
          <div className="bg-[#ebdbb2]/60 border border-[#3c3836]/60 p-2.5 rounded-sm">
            <div className="text-[10px] text-[#7c6f64] uppercase font-bold">LOCATION</div>
            <div className="font-bold text-[#282828] mt-0.5">{job.location || 'N/A'}</div>
          </div>
          <div className="bg-[#ebdbb2]/60 border border-[#3c3836]/60 p-2.5 rounded-sm">
            <div className="text-[10px] text-[#7c6f64] uppercase font-bold">SALARY / COMP</div>
            <div className="font-bold text-[#282828] mt-0.5">{job.salary || 'N/A'}</div>
          </div>
          <div className="bg-[#ebdbb2]/60 border border-[#3c3836]/60 p-2.5 rounded-sm">
            <div className="text-[10px] text-[#7c6f64] uppercase font-bold">DATE LOGGED</div>
            <div className="font-bold text-[#282828] mt-0.5">{job.appliedDate}</div>
          </div>
          <div className="bg-[#ebdbb2]/60 border border-[#3c3836]/60 p-2.5 rounded-sm">
            <div className="text-[10px] text-[#7c6f64] uppercase font-bold">APPLICATION LINK</div>
            {job.url ? (
              <a
                href={job.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-[#458588] hover:underline truncate block mt-0.5"
              >
                OPEN LINK ↗
              </a>
            ) : (
              <div className="font-bold text-[#7c6f64] mt-0.5">NONE</div>
            )}
          </div>
        </div>

        {/* Tags */}
        {job.tags && job.tags.length > 0 && (
          <div className="mb-4">
            <div className="text-[10px] font-bold text-[#665c54] uppercase mb-1">
              [ TAGS / METRICS ]
            </div>
            <div className="flex flex-wrap gap-1.5">
              {job.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-[10px] font-mono px-2 py-0.5 bg-[#ebdbb2] border border-[#3c3836] text-[#3c3836] font-bold"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        <div className="mb-4">
          <div className="text-[10px] font-bold text-[#665c54] uppercase mb-1">
            [ APPLICATION NOTES ]
          </div>
          <div className="bg-[#ebdbb2] border border-[#3c3836] p-2.5 rounded-sm text-xs font-mono text-[#282828] min-h-[45px]">
            {job.notes || 'No operational notes attached to this dossier entry.'}
          </div>
        </div>

        {/* Timeline Log */}
        {job.history && job.history.length > 0 && (
          <div className="mb-4">
            <div className="text-[10px] font-bold text-[#665c54] uppercase mb-1.5">
              [ FLIGHT ACTIVITY TIMELINE ]
            </div>
            <div className="bg-[#ebdbb2]/50 border border-[#3c3836] p-2 rounded-sm space-y-1.5 max-h-[100px] overflow-y-auto">
              {job.history.map((entry, idx) => {
                const statusKey = (entry.status || '').toLowerCase() as ApplicationStatus;
                const config = STATUS_CONFIG[statusKey];
                const label = config ? `${config.label} ${config.sublabel}` : entry.status;

                return (
                  <div key={idx} className="flex items-start gap-2 text-[10px] font-mono border-b border-dashed border-[#3c3836]/40 last:border-b-0 pb-1">
                    <span className="text-[#665c54] shrink-0 font-bold">{entry.date}</span>
                    <span className="font-bold uppercase text-[#d65d0e] shrink-0">
                      [{label}]
                    </span>
                    <span className="text-[#3c3836] truncate">{entry.note}</span>
                  </div>
                );
              })}
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
