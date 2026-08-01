'use client';

import React, { useState, useEffect } from 'react';
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
            {jobs.map((job) => {
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
                    <div className="text-[10px] font-mono font-bold text-[#3c3836] uppercase line-clamp-2 leading-tight">
                      {job.location || 'KL'}
                    </div>
                    <div className="text-[10px] font-mono text-[#665c54] font-medium tracking-tight">
                      {job.appliedDate || '27-07-27'}
                    </div>
                  </div>

                  {/* 3. Bottom Section: Status Banner (Two Lines: Main Term + (Bracket Sublabel)) */}
                  <div className="relative status-dropdown-container">
                    <div 
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenDropdownId(isDropdownOpen ? null : job.id);
                      }}
                      className="ticket-footer py-2 px-2.5 border-t-1.5 border-[#3c3836] flex items-center justify-between cursor-pointer hover:brightness-95 transition-all rounded-b-[3px]"
                      style={{ backgroundColor: banner.bg, color: banner.text }}
                    >
                      <div className="flex flex-col leading-tight overflow-hidden text-left">
                        <span className="text-[10px] font-mono font-extrabold uppercase tracking-tight truncate">
                          {statusConfig.label}
                        </span>
                        <span className="text-[8.5px] font-mono font-normal opacity-85 uppercase tracking-tight truncate">
                          {statusConfig.sublabel}
                        </span>
                      </div>
                      
                      <ChevronDown className={`w-3.5 h-3.5 opacity-80 shrink-0 ml-1 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </div>

                    {/* Custom Gruvbox Flight Menu Dropdown */}
                    {isDropdownOpen && (
                      <div 
                        onClick={(e) => e.stopPropagation()}
                        className="absolute left-0 right-0 top-full z-[100] shadow-2xl border-2 border-[#3c3836] flex flex-col overflow-hidden bg-[#282828]"
                        style={{ marginTop: '-1.5px' }}
                      >
                        {statusKeys.map((key) => {
                          const optBanner = bannerColors[key];
                          const optConfig = STATUS_CONFIG[key];
                          const isCurrent = job.status === key;

                          return (
                            <div
                              key={key}
                              onClick={(e) => {
                                e.stopPropagation();
                                onUpdateStatus(job.id, key);
                                setOpenDropdownId(null);
                              }}
                              className={`py-2 px-2 text-center border-b border-[#3c3836] last:border-b-0 cursor-pointer transition-all hover:brightness-110 active:brightness-90 ${
                                isCurrent ? 'ring-2 ring-inset ring-[#282828]' : ''
                              }`}
                              style={{ backgroundColor: optBanner.bg, color: optBanner.text }}
                            >
                              <div className="text-[10px] font-mono font-extrabold uppercase tracking-tight leading-tight">
                                {optConfig.label}
                              </div>
                              <div className="text-[8.5px] font-mono font-normal opacity-85 uppercase tracking-tight leading-tight mt-0.5">
                                {optConfig.sublabel}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                  </div>

                </div>
              );
            })}

            {/* Add New Ticket Card Button */}
            <div
              onClick={() => onOpenAddModal()}
              className="border-2 border-dashed border-[#3c3836] rounded-md min-h-[235px] p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-[#d5c4a1]/50 transition-all text-[#504945]"
            >
              <Plus className="w-6 h-6 mb-1" />
              <span className="text-xs font-mono font-bold uppercase">
                + NEW TICKET
              </span>
            </div>

          </div>
        )}
      </div>

      {/* Bottom Footer & MISERY BUTTON */}
      <div className="flex items-center justify-between pt-8 mt-6 border-t border-[#3c3836]">
        <div className="text-[11px] font-mono text-[#665c54]">
          RUNWAY FLIGHT SYSTEM • ALL SYSTEMS NOMINAL
        </div>

        <Link
          href="/diagnostics"
          className="bg-[#a9b665] hover:bg-[#8ec07c] text-[#282828] font-mono font-extrabold text-xs px-4 py-2 border-2 border-[#3c3836] rounded-sm shadow-[2px_2px_0px_#3c3836] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5 uppercase"
        >
          <Flame className="w-4 h-4 text-[#282828]" />
          MISERY BUTTON &rarr;
        </Link>
      </div>

    </div>
  );
}
