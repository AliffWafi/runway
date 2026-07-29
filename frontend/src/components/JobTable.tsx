'use client';

import React, { useState } from 'react';
import { JobApplication, STATUS_CONFIG, ApplicationStatus } from '../types/job';
import { Building2, ExternalLink, Trash2, Edit3, ArrowUpDown } from 'lucide-react';

interface JobTableProps {
  jobs: JobApplication[];
  onOpenDetail: (job: JobApplication) => void;
  onOpenEditModal: (job: JobApplication) => void;
  onDeleteJob: (id: string) => void;
  onUpdateStatus: (id: string, newStatus: ApplicationStatus) => void;
}

export function JobTable({ jobs, onOpenDetail, onOpenEditModal, onDeleteJob, onUpdateStatus }: JobTableProps) {
  const [sortField, setSortField] = useState<keyof JobApplication>('appliedDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: keyof JobApplication) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedJobs = [...jobs].sort((a, b) => {
    let valA = a[sortField] || '';
    let valB = b[sortField] || '';

    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="bg-[#3c3836] border border-[#504945] rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse font-sans">
          <thead>
            <tr className="bg-[#1d2021] border-b border-[#504945] text-[#928374] font-mono text-[10px] uppercase tracking-wider">
              <th className="p-3 cursor-pointer hover:text-[#ebdbb2]" onClick={() => handleSort('company')}>
                <div className="flex items-center gap-1">
                  COMPANY <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="p-3 cursor-pointer hover:text-[#ebdbb2]" onClick={() => handleSort('title')}>
                <div className="flex items-center gap-1">
                  POSITION <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="p-3">LOCATION</th>
              <th className="p-3">COMPENSATION</th>
              <th className="p-3 cursor-pointer hover:text-[#ebdbb2]" onClick={() => handleSort('appliedDate')}>
                <div className="flex items-center gap-1">
                  FILED ON <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="p-3 cursor-pointer hover:text-[#ebdbb2]" onClick={() => handleSort('status')}>
                <div className="flex items-center gap-1">
                  STATUS STAGE <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="p-3 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#504945]/60">
            {sortedJobs.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-10 text-center font-mono text-[#928374]">
                  NO MANIFEST ENTRIES FOUND
                </td>
              </tr>
            ) : (
              sortedJobs.map((job) => {
                const config = STATUS_CONFIG[job.status] || STATUS_CONFIG.taxiing;
                return (
                  <tr 
                    key={job.id} 
                    onClick={() => onOpenDetail(job)}
                    className="hover:bg-[#504945]/30 cursor-pointer transition-colors"
                    style={{
                      borderLeft: `3px solid ${config.color}`
                    }}
                  >
                    {/* Company */}
                    <td className="p-3 font-bold text-[#fbf1c7]">
                      {job.company}
                    </td>

                    {/* Role */}
                    <td className="p-3 font-semibold text-[#ebdbb2]">
                      {job.title}
                    </td>

                    {/* Location */}
                    <td className="p-3 text-[#a89984]">
                      {job.location || '—'}
                    </td>

                    {/* Salary */}
                    <td className="p-3 font-mono text-[#a89984]">
                      {job.salary || '—'}
                    </td>

                    {/* Applied Date */}
                    <td className="p-3 font-mono text-[#a89984]">
                      {job.appliedDate}
                    </td>

                    {/* Status Badge Select */}
                    <td className="p-3" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={job.status}
                        onChange={(e) => onUpdateStatus(job.id, e.target.value as ApplicationStatus)}
                        className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#1d2021] border border-[#504945] focus:outline-none cursor-pointer"
                        style={{ color: config.color }}
                      >
                        {Object.keys(STATUS_CONFIG).map((k) => (
                          <option key={k} value={k} className="bg-[#282828] text-[#ebdbb2]">
                            {STATUS_CONFIG[k as ApplicationStatus].label}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="p-3 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        {job.url && (
                          <a 
                            href={job.url} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="p-1 rounded text-[#a89984] hover:text-[#ebdbb2] hover:bg-[#504945]" 
                            title="Visit Listing"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                        <button 
                          onClick={() => onOpenEditModal(job)} 
                          className="p-1 rounded text-[#a89984] hover:text-[#ebdbb2] hover:bg-[#504945]" 
                          title="Edit Entry"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => onDeleteJob(job.id)} 
                          className="p-1 rounded text-[#fb4934] hover:bg-[#fb4934]/20" 
                          title="Delete Entry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
