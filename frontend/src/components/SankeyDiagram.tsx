'use client';

import React from 'react';
import { JobApplication, ApplicationStatus } from '../types/job';

interface SankeyDiagramProps {
  jobs: JobApplication[];
}

export function SankeyDiagram({ jobs }: SankeyDiagramProps) {
  const total = jobs.length || 1;

  const counts: Record<ApplicationStatus, number> = {
    taxiing: jobs.filter(j => j.status === 'taxiing').length,
    holding: jobs.filter(j => j.status === 'holding').length,
    radar_contact: jobs.filter(j => j.status === 'radar_contact').length,
    cleared_for_takeoff: jobs.filter(j => j.status === 'cleared_for_takeoff').length,
    airborne: jobs.filter(j => j.status === 'airborne').length,
    return_to_gate: jobs.filter(j => j.status === 'return_to_gate').length,
    holding_pattern: jobs.filter(j => j.status === 'holding_pattern').length,
    grounded: jobs.filter(j => j.status === 'grounded').length,
  };

  // Gruvbox Palette Colors
  const colors = {
    applied: '#458588',          // Blue/Teal
    taxiing: '#83a598',          // Soft Teal
    holding: '#7c6f64',          // Muted Slate
    radar: '#fe8019',            // Gruvbox Orange
    cleared: '#98971a',          // Olive Sage
    airborne: '#8ec07c',         // Green
    rejected: '#ea696c',         // Red
    ghosted: '#fabd2f',          // Amber Yellow
    grounded: '#928374',         // Gray/Taupe
  };

  // SVG Dimension & Coordinate Grid (750x360 for generous text space)
  const svgWidth = 750;
  const svgHeight = 360;

  // X Coordinates for 3 Flow Stages
  const leftX = 40;
  const midX = 340;
  const rightX = 580;

  // Y Coordinates and Heights
  const leftY = 40;
  const leftH = 260;

  const taxiY = 30;
  const taxiH = Math.max(24, (counts.taxiing / total) * 160);
  
  const holdY = 105;
  const holdH = Math.max(24, (counts.holding / total) * 160);

  const radarY = 180;
  const radarH = Math.max(24, (counts.radar_contact / total) * 160);

  const clearedY = 255;
  const clearedH = Math.max(24, (counts.cleared_for_takeoff / total) * 160);

  const airY = 40;
  const airH = Math.max(30, (counts.airborne / total) * 160);

  const rejY = 150;
  const rejH = Math.max(30, (counts.return_to_gate / total) * 160);

  const ghY = 260;
  const ghH = Math.max(30, (counts.holding_pattern / total) * 160);

  // Helper for Smooth Cubic Bezier Curves
  const createPath = (x1: number, y1: number, h1: number, x2: number, y2: number, h2: number) => {
    const c1 = x1 + (x2 - x1) * 0.5;
    const c2 = x1 + (x2 - x1) * 0.5;
    return `
      M ${x1} ${y1}
      C ${c1} ${y1}, ${c2} ${y2}, ${x2} ${y2}
      L ${x2} ${y2 + h2}
      C ${c2} ${y2 + h2}, ${c1} ${y1 + h1}, ${x1} ${y1 + h1}
      Z
    `;
  };

  return (
    <div className="w-full flex items-center justify-center select-none overflow-x-auto">
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="w-full h-auto max-w-full max-h-[380px]"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="grad-applied-cleared" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colors.applied} stopOpacity="0.45" />
            <stop offset="100%" stopColor={colors.cleared} stopOpacity="0.45" />
          </linearGradient>

          <linearGradient id="grad-applied-radar" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colors.applied} stopOpacity="0.45" />
            <stop offset="100%" stopColor={colors.radar} stopOpacity="0.45" />
          </linearGradient>

          <linearGradient id="grad-applied-taxi" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colors.applied} stopOpacity="0.45" />
            <stop offset="100%" stopColor={colors.taxiing} stopOpacity="0.45" />
          </linearGradient>

          <linearGradient id="grad-applied-hold" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colors.applied} stopOpacity="0.45" />
            <stop offset="100%" stopColor={colors.holding} stopOpacity="0.45" />
          </linearGradient>

          <linearGradient id="grad-cleared-air" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colors.cleared} stopOpacity="0.45" />
            <stop offset="100%" stopColor={colors.airborne} stopOpacity="0.45" />
          </linearGradient>

          <linearGradient id="grad-cleared-rej" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colors.cleared} stopOpacity="0.45" />
            <stop offset="100%" stopColor={colors.rejected} stopOpacity="0.45" />
          </linearGradient>

          <linearGradient id="grad-hold-gh" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colors.holding} stopOpacity="0.45" />
            <stop offset="100%" stopColor={colors.ghosted} stopOpacity="0.45" />
          </linearGradient>
        </defs>

        {/* --- FLOW PATHS --- */}
        <path d={createPath(leftX + 22, leftY, leftH * 0.25, midX, taxiY, taxiH)} fill="url(#grad-applied-taxi)" />
        <path d={createPath(leftX + 22, leftY + leftH * 0.25, leftH * 0.25, midX, holdY, holdH)} fill="url(#grad-applied-hold)" />
        <path d={createPath(leftX + 22, leftY + leftH * 0.5, leftH * 0.25, midX, radarY, radarH)} fill="url(#grad-applied-radar)" />
        <path d={createPath(leftX + 22, leftY + leftH * 0.75, leftH * 0.25, midX, clearedY, clearedH)} fill="url(#grad-applied-cleared)" />

        <path d={createPath(midX + 22, clearedY, clearedH * 0.5, rightX, airY, airH)} fill="url(#grad-cleared-air)" />
        <path d={createPath(midX + 22, clearedY + clearedH * 0.5, clearedH * 0.5, rightX, rejY, rejH)} fill="url(#grad-cleared-rej)" />
        <path d={createPath(midX + 22, holdY, holdH, rightX, ghY, ghH)} fill="url(#grad-hold-gh)" />

        {/* --- STAGE 1: APPLIED --- */}
        <g transform={`translate(${leftX}, ${leftY})`}>
          <rect width="22" height={leftH} fill={colors.applied} rx="3" className="stroke-1 stroke-[#3c3836]" />
          <text x="-12" y={leftH / 2} fill="#282828" fontSize="12" fontWeight="bold" fontFamily="monospace" textAnchor="end" dominantBaseline="middle">
            APPLIED ({jobs.length})
          </text>
        </g>

        {/* --- STAGE 2: PROCESS --- */}
        <g transform={`translate(${midX}, ${taxiY})`}>
          <rect width="22" height={taxiH} fill={colors.taxiing} rx="3" className="stroke-1 stroke-[#3c3836]" />
          <text x="30" y={taxiH / 2} fill="#282828" fontSize="11" fontWeight="bold" fontFamily="monospace" dominantBaseline="middle">
            Taxiing (Applied) ({counts.taxiing})
          </text>
        </g>

        <g transform={`translate(${midX}, ${holdY})`}>
          <rect width="22" height={holdH} fill={colors.holding} rx="3" className="stroke-1 stroke-[#3c3836]" />
          <text x="30" y={holdH / 2} fill="#282828" fontSize="11" fontWeight="bold" fontFamily="monospace" dominantBaseline="middle">
            Holding (Waiting) ({counts.holding})
          </text>
        </g>

        <g transform={`translate(${midX}, ${radarY})`}>
          <rect width="22" height={radarH} fill={colors.radar} rx="3" className="stroke-1 stroke-[#3c3836]" />
          <text x="30" y={radarH / 2} fill="#282828" fontSize="11" fontWeight="bold" fontFamily="monospace" dominantBaseline="middle">
            Radar Contact (Viewed) ({counts.radar_contact})
          </text>
        </g>

        <g transform={`translate(${midX}, ${clearedY})`}>
          <rect width="22" height={clearedH} fill={colors.cleared} rx="3" className="stroke-1 stroke-[#3c3836]" />
          <text x="30" y={clearedH / 2} fill="#282828" fontSize="11" fontWeight="bold" fontFamily="monospace" dominantBaseline="middle">
            Cleared for Takeoff ({counts.cleared_for_takeoff})
          </text>
        </g>

        {/* --- STAGE 3: OUTCOME --- */}
        <g transform={`translate(${rightX}, ${airY})`}>
          <rect width="22" height={airH} fill={colors.airborne} rx="3" className="stroke-1 stroke-[#3c3836]" />
          <text x="30" y={airH / 2} fill="#282828" fontSize="11" fontWeight="bold" fontFamily="monospace" dominantBaseline="middle">
            Airborne ✈️ ({counts.airborne})
          </text>
        </g>

        <g transform={`translate(${rightX}, ${rejY})`}>
          <rect width="22" height={rejH} fill={colors.rejected} rx="3" className="stroke-1 stroke-[#3c3836]" />
          <text x="30" y={rejH / 2} fill="#282828" fontSize="11" fontWeight="bold" fontFamily="monospace" dominantBaseline="middle">
            Return to Gate ({counts.return_to_gate})
          </text>
        </g>

        <g transform={`translate(${rightX}, ${ghY})`}>
          <rect width="22" height={ghH} fill={colors.ghosted} rx="3" className="stroke-1 stroke-[#3c3836]" />
          <text x="30" y={ghH / 2} fill="#282828" fontSize="11" fontWeight="bold" fontFamily="monospace" dominantBaseline="middle">
            Holding Pattern 🌀 ({counts.holding_pattern})
          </text>
        </g>
      </svg>
    </div>
  );
}
