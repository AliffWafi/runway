'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { JobApplication, STATUS_CONFIG, ApplicationStatus } from '../types/job';
import { SkeletonGrid } from './SkeletonCard';
import { Plus, Flame, ChevronDown } from 'lucide-react';

interface KanbanBoardProps {
  jobs: JobApplication[];
  isLoading?: boolean;
  onOpenDetail: (job: JobApplication) => void;
  onOpenAddModal: (status?: ApplicationStatus) => void;
  onUpdateStatus: (id: string, newStatus: ApplicationStatus) => void;
}

export function KanbanBoard({ jobs, isLoading, onOpenDetail, onOpenAddModal, onUpdateStatus }: KanbanBoardProps) {
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const statusKeys = Object.keys(STATUS_CONFIG) as ApplicationStatus[];

  // Banner Colors matching Gruvbox aesthetic & status identities
  const bannerColors: Record<ApplicationStatus, { bg: string; text: string }> = {
    taxiing: { bg: '#d5c4a1', text: '#282828' },              // Warm Sand
    holding: { bg: '#7c6f64', text: '#fbf1c7' },              // Warm Slate
    radar_contact: { bg: '#fe8019', text: '#282828' },        // Gruvbox Orange
    cleared_for_takeoff: { bg: '#98971a', text: '#282828' },   // Olive Sage
    airborne: { bg: '#458588', text: '#fbf1c7' },             // Teal
    holding_pattern: { bg: '#fabd2f', text: '#282828' },      // Gold Amber
    return_to_gate: { bg: '#ea696c', text: '#282828' }        // Coral Red
  };

  // Fixed Chronological Sorting: Earlier to Latest Applied / Created
  const sortedJobs = useMemo(() => {
    return [...jobs].sort((a, b) => {
      const dateA = a.appliedDate ? new Date(a.appliedDate).getTime() : 0;
      const dateB = b.appliedDate ? new Date(b.appliedDate).getTime() : 0;
      if (dateA !== dateB) return dateA - dateB; // Ascending: Earliest to Latest
      return (a.id || '').localeCompare(b.id || '');
    });
  }, [jobs]);

  // Safe outside click handler
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.status-dropdown-container')) {
        setOpenDropdownId(null);
      }
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

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
            MANIFEST TOTAL: {isLoading ? '...' : jobs.length} ENTRIES
          </div>
        </div>

        {/* Loading Skeleton Grid vs Application Cards Grid */}
        {isLoading ? (
          <SkeletonGrid count={6} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
            {sortedJobs.map((job) => {
              const banner = bannerColors[job.status] || { bg: '#d5c4a1', text: '#282828' };
              const statusConfig = STATUS_CONFIG[job.status] || STATUS_CONFIG.taxiing;
              const isDropdownOpen = openDropdownId === job.id;

              return (
                <div
                  key={job.id}
                  onClick={() => onOpenDetail(job)}
                  className={`ticket-card min-h-[235px] cursor-pointer group flex flex-col justify-between relative ${
                    isDropdownOpen ? 'z-40' : 'z-10'
                  }`}
                  style={{ overflow: 'visible' }}
                >
                  {/* 1. Top Section: Company & Position */}
                  <div className="ticket-header bg-[#d5c4a1] px-3 py-2.5 h-[62px] border-b border-dashed border-[#3c3836] flex flex-col justify-center rounded-t-[3px]">
                    <div className="text-xs font-mono font-extrabold text-[#282828] uppercase tracking-wide truncate group-hover:text-[#fe8019] transition-colors">
                      {job.company}
                    </div>
                    <div className="text-[10px] font-mono font-semibold text-[#504945] uppercase truncate mt-0.5">
                      {job.title}
                    </div>
                  </div>

                  {/* 2. Middle Section: Location & Date */}
                  <div className="ticket-body bg-[#ebdbb2] px-3 py-2.5 flex-1 flex flex-col justify-between min-h-[85px]">
                    <div className="text-[10px] font-mono text-[#665c54] uppercase font-bold flex items-center justify-between">
                      <span>{job.location || 'KL'}</span>
                      {job.salary && (
                        <span className="text-[#b8bb26] font-bold truncate max-w-[80px]">
                          {job.salary}
                        </span>
                      )}
                    </div>

                    <div className="text-[10px] font-mono text-[#7c6f64] font-semibold">
                      FILED: {job.appliedDate || '2026-07-27'}
                    </div>

                    {/* Tags Pills */}
                    {job.tags && job.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {job.tags.slice(0, 2).map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-[9px] font-mono px-1.5 py-0.5 bg-[#d5c4a1]/60 border border-[#3c3836]/40 text-[#3c3836] rounded-[2px]"
                          >
                            #{tag}
                          </span>
                        ))}
                        {job.tags.length > 2 && (
                          <span className="text-[9px] font-mono text-[#7c6f64]">
                            +{job.tags.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* 3. Bottom Status Banner Bar with Custom Dropdown */}
                  <div
                    className="ticket-status px-2 py-1.5 border-t-2 border-[#3c3836] rounded-b-[3px] flex items-center justify-between transition-colors relative status-dropdown-container"
                    style={{ backgroundColor: banner.bg, color: banner.text }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Status Label (2 lines: Bold Main Term + Normal Sublabel) */}
                    <div className="flex flex-col leading-tight overflow-hidden select-none">
                      <span className="font-extrabold text-[10px] tracking-wide uppercase truncate">
                        {statusConfig.label}
                      </span>
                      <span className="font-normal text-[8.5px] uppercase tracking-normal opacity-85 truncate mt-[1px]">
                        {statusConfig.sublabel}
                      </span>
                    </div>

                    {/* Dropdown Toggle Trigger Button */}
                    <button
                      type="button"
                      onClick={() => setOpenDropdownId(isDropdownOpen ? null : job.id)}
                      className="p-1 hover:bg-black/15 rounded transition-colors shrink-0 ml-1"
                      title="Change Status"
                    >
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-150 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Custom Status Dropdown Menu */}
                    {isDropdownOpen && (
                      <div className="absolute right-0 top-full mt-1 z-50 border-2 border-[#3c3836] shadow-[4px_4px_0px_#3c3836] bg-[#282828] min-w-[190px] rounded-[2px] py-0.5">
                        {statusKeys.map((key) => {
                          const optBanner = bannerColors[key];
                          const optConfig = STATUS_CONFIG[key];
                          const isSelected = key === job.status;

                          return (
                            <div
                              key={key}
                              onClick={() => {
                                onUpdateStatus(job.id, key);
                                setOpenDropdownId(null);
                              }}
                              className={`py-1.5 px-2.5 text-[10px] font-mono font-bold uppercase cursor-pointer transition-all flex items-center justify-between border-b border-[#3c3836] last:border-b-0 ${
                                isSelected ? 'ring-2 ring-inset ring-[#fbf1c7]' : 'hover:brightness-110'
                              }`}
                              style={{ backgroundColor: optBanner.bg, color: optBanner.text }}
                            >
                              <span>{optConfig.label} {optConfig.sublabel}</span>
                              {isSelected && <span className="text-[10px]">✓</span>}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Quick Add Application Card Button */}
            <button
              onClick={() => onOpenAddModal('taxiing')}
              className="border-2 border-dashed border-[#3c3836] bg-[#ebdbb2]/20 hover:bg-[#ebdbb2]/50 hover:border-[#fe8019] text-[#504945] hover:text-[#282828] rounded-[3px] p-4 flex flex-col items-center justify-center gap-2 transition-all min-h-[235px] group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full border-2 border-dashed border-[#504945] group-hover:border-[#fe8019] flex items-center justify-center transition-colors">
                <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </div>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-center">
                + ADD FLIGHT APPLICATION
              </span>
              <span className="font-mono text-[9px] text-[#7c6f64] text-center">
                Log new pilot entry
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Footer Navigation Bar */}
      <div className="mt-8 pt-4 border-t-2 border-dashed border-[#3c3836] flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-[#665c54]">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-[#fe8019]" />
          <span>RUNWAY FLIGHT TRACKER v1.0 • GRUVBOX CONTROL CENTER</span>
        </div>

        <div className="flex items-center gap-4 font-bold">
          <Link
            href="/diagnostics"
            className="text-[#458588] hover:text-[#83a598] hover:underline uppercase"
          >
            [ SYSTEM DIAGNOSTICS ]
          </Link>
          <span className="text-[#3c3836]">|</span>
          <span className="text-[#b8bb26] uppercase">SYSTEM OPERATIONAL</span>
        </div>
      </div>

    </div>
  );
}
