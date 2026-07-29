'use client';

import React, { useState } from 'react';
import { JobApplication, STATUS_CONFIG, ApplicationStatus } from '../types/job';
import { Plus, Flame, HeartHandshake, Smile, RefreshCcw } from 'lucide-react';

interface KanbanBoardProps {
  jobs: JobApplication[];
  onOpenDetail: (job: JobApplication) => void;
  onOpenAddModal: (status?: ApplicationStatus) => void;
  onUpdateStatus: (id: string, newStatus: ApplicationStatus) => void;
}

export function KanbanBoard({ jobs, onOpenDetail, onOpenAddModal, onUpdateStatus }: KanbanBoardProps) {
  const [isMiseryModalOpen, setIsMiseryModalOpen] = useState(false);
  const statusKeys = Object.keys(STATUS_CONFIG) as ApplicationStatus[];

  // Status banner color map (matching user sketch reference)
  const bannerColors: Record<ApplicationStatus, { bg: string; text: string }> = {
    return_to_gate: { bg: '#ea696c', text: '#282828' },       // Coral Red
    taxiing: { bg: '#83a598', text: '#282828' },              // Teal/Blue
    holding: { bg: '#e5c07b', text: '#282828' },              // Warm Gold
    airborne: { bg: '#8ec07c', text: '#282828' },             // Sage Green
    holding_pattern: { bg: '#d3869b', text: '#282828' },      // Soft Purple
    cleared_for_takeoff: { bg: '#a9b665', text: '#282828' }   // Muted Green
  };

  const totalApplied = jobs.length;
  const totalRejected = jobs.filter(j => j.status === 'return_to_gate').length;
  const totalGhosted = jobs.filter(j => j.status === 'holding_pattern').length;

  return (
    <div className="relative border-2 border-[#3c3836] rounded-md p-6 bg-[#ebdbb2]/30 min-h-[620px] flex flex-col justify-between">
      
      {/* Corner Bracket Marks Framing */}
      <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#3c3836]" />
      <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#3c3836]" />
      <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#3c3836]" />
      <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#3c3836]" />

      <div>
        {/* Main Title Header: [Flight Log] */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-mono font-bold text-[#282828] tracking-wider">
            [Flight Log]
          </h2>
          <div className="text-xs font-mono text-[#665c54]">
            MANIFEST TOTAL: {jobs.length} ENTRIES
          </div>
        </div>

        {/* Application Cards Grid (3 Columns / Responsive) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {jobs.map((job) => {
            const banner = bannerColors[job.status] || { bg: '#d5c4a1', text: '#282828' };
            const statusConfig = STATUS_CONFIG[job.status] || STATUS_CONFIG.taxiing;

            return (
              <div
                key={job.id}
                onClick={() => onOpenDetail(job)}
                className="ticket-card cursor-pointer group"
              >
                {/* Top Section: Company & Position Header */}
                <div className="ticket-header bg-[#d5c4a1] p-3 border-b border-dashed border-[#3c3836]">
                  <div className="text-sm font-mono font-extrabold text-[#282828] uppercase tracking-wide group-hover:text-[#fe8019] transition-colors leading-tight">
                    {job.company}
                  </div>
                  <div className="text-[11px] font-mono font-semibold text-[#504945] uppercase mt-0.5">
                    {job.title}
                  </div>
                </div>

                {/* Middle Section: Location & Date */}
                <div className="ticket-body bg-[#ebdbb2] p-3 flex flex-col justify-between min-h-[70px]">
                  <div className="text-[11px] font-mono font-bold text-[#3c3836] uppercase">
                    {job.location || 'GLOBAL'}
                  </div>
                  <div className="text-[11px] font-mono text-[#665c54]">
                    {job.appliedDate || '27-07-27'}
                  </div>
                </div>

                {/* Bottom Section: Full Width Status Banner */}
                <div 
                  className="ticket-footer py-2 px-3 border-t-1.5 border-[#3c3836] flex items-center justify-between"
                  style={{ backgroundColor: banner.bg, color: banner.text }}
                >
                  <span className="text-[11px] font-mono font-extrabold uppercase tracking-tight">
                    {statusConfig.label}
                  </span>
                  
                  <select
                    value={job.status}
                    onChange={(e) => {
                      e.stopPropagation();
                      onUpdateStatus(job.id, e.target.value as ApplicationStatus);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-[9px] font-mono bg-[#282828] text-[#ebdbb2] rounded px-1 py-0.5 border border-[#3c3836]"
                  >
                    {statusKeys.map((k) => (
                      <option key={k} value={k}>
                        {STATUS_CONFIG[k].label}
                      </option>
                    ))}
                  </select>
                </div>

              </div>
            );
          })}

          {/* Add New Ticket Card Button */}
          <div
            onClick={() => onOpenAddModal()}
            className="border-2 border-dashed border-[#3c3836] rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-[#d5c4a1]/50 transition-all text-[#504945] min-h-[160px]"
          >
            <Plus className="w-6 h-6 mb-1" />
            <span className="text-xs font-mono font-bold uppercase">
              + NEW TICKET
            </span>
          </div>

        </div>
      </div>

      {/* Bottom Footer & MISERY BUTTON */}
      <div className="flex items-center justify-between pt-8 mt-6 border-t border-[#3c3836]">
        <div className="text-[11px] font-mono text-[#665c54]">
          RUNWAY FLIGHT SYSTEM • ALL SYSTEMS NOMINAL
        </div>

        {/* MISERY BUTTON (Bottom Right Corner as drawn in sketch) */}
        <button
          onClick={() => setIsMiseryModalOpen(true)}
          className="bg-[#a9b665] hover:bg-[#8ec07c] text-[#282828] font-mono font-extrabold text-xs px-4 py-2 border-2 border-[#3c3836] rounded-sm shadow-[2px_2px_0px_#3c3836] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5"
        >
          <Flame className="w-4 h-4 text-[#282828]" />
          MISERY BUTTON
        </button>
      </div>

      {/* Misery Button Modal */}
      {isMiseryModalOpen && (
        <div className="modal-overlay" onClick={() => setIsMiseryModalOpen(false)}>
          <div className="modal-container p-6 bg-[#fbf1c7] border-2 border-[#3c3836] shadow-[4px_4px_0px_#3c3836]" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4 pb-2 border-b-2 border-dashed border-[#3c3836]">
              <h3 className="text-lg font-mono font-bold text-[#282828]">
                🔥 THE MISERY COMPASS & STATS
              </h3>
              <button onClick={() => setIsMiseryModalOpen(false)} className="text-xs font-mono font-bold bg-[#3c3836] text-[#ebdbb2] px-2 py-1 rounded">
                CLOSE [X]
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs text-[#3c3836] mb-6">
              <p className="font-bold text-sm text-[#fe8019]">
                "Job hunting is tough, pilot. But every rejection is just an altered flight path!" ✈️
              </p>
              <div className="bg-[#ebdbb2] p-3 rounded border border-[#3c3836] space-y-1">
                <div>• Total Flights Filed: <strong>{totalApplied}</strong></div>
                <div>• Returned to Gate (Rejections): <strong>{totalRejected}</strong></div>
                <div>• In Holding Pattern (Ghosted): <strong>{totalGhosted}</strong></div>
                <div>• Coffee Consumed: <strong>∞ cups</strong></div>
              </div>
              <p className="italic text-[11px] text-[#665c54]">
                Tip: Keep submitting tickets. The right offer is waiting for cleared takeoff!
              </p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setIsMiseryModalOpen(false)}
                className="bg-[#fe8019] text-[#282828] font-mono font-bold px-4 py-1.5 border border-[#3c3836] rounded"
              >
                BACK TO FLIGHT DECK &rarr;
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
