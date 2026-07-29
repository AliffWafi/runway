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
    cleared_for_takeoff: jobs.filter(j => j.status === 'cleared_for_takeoff').length,
    airborne: jobs.filter(j => j.status === 'airborne').length,
    return_to_gate: jobs.filter(j => j.status === 'return_to_gate').length,
    holding_pattern: jobs.filter(j => j.status === 'holding_pattern').length,
  };

  // Gruvbox Palette Colors
  const colors = {
    applied: '#458588',          // Blue/Teal
    taxiing: '#83a598',          // Soft Teal
    holding: '#7c6f64',          // Muted Slate
    cleared: '#98971a',          // Olive Sage
    airborne: '#8ec07c',         // Green
    rejected: '#ea696c',         // Red
    ghosted: '#fabd2f',          // Amber Yellow
  };

  // SVG Dimension & Coordinate Grid (700x320 for generous text space)
  const svgWidth = 700;
  const svgHeight = 320;
  const nodeWidth = 22;

  // X Coordinates for 3 Flow Stages
  const leftX = 40;
  const midX = 320;
  const rightX = 540;

  // Y Coordinates and Heights
  const leftY = 40;
  const leftH = 230;

  const taxiY = 40;
  const taxiH = Math.max(28, (counts.taxiing / total) * 180);
  
  const holdY = 130;
  const holdH = Math.max(28, (counts.holding / total) * 180);

  const clearedY = 220;
  const clearedH = Math.max(28, (counts.cleared_for_takeoff / total) * 180);

  const airY = 40;
  const airH = Math.max(32, (counts.airborne / total) * 180);

  const rejY = 135;
  const rejH = Math.max(32, (counts.return_to_gate / total) * 180);

  const ghY = 230;
  const ghH = Math.max(32, (counts.holding_pattern / total) * 180);

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
        className="w-full h-auto max-w-full max-h-[360px]"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="grad-applied-cleared" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colors.applied} stopOpacity="0.45" />
            <stop offset="100%" stopColor={colors.cleared} stopOpacity="0.45" />
          </linearGradient>

          <linearGradient id="grad-applied-holding" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colors.applied} stopOpacity="0.45" />
            <stop offset="100%" stopColor={colors.holding} stopOpacity="0.45" />
          </linearGradient>

          <linearGradient id="grad-applied-taxiing" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colors.applied} stopOpacity="0.45" />
            <stop offset="100%" stopColor={colors.taxiing} stopOpacity="0.45" />
          </linearGradient>

          <linearGradient id="grad-cleared-airborne" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colors.cleared} stopOpacity="0.45" />
            <stop offset="100%" stopColor={colors.airborne} stopOpacity="0.45" />
          </linearGradient>

          <linearGradient id="grad-holding-rejected" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colors.holding} stopOpacity="0.45" />
            <stop offset="100%" stopColor={colors.rejected} stopOpacity="0.45" />
          </linearGradient>

          <linearGradient id="grad-taxiing-ghosted" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colors.taxiing} stopOpacity="0.45" />
            <stop offset="100%" stopColor={colors.ghosted} stopOpacity="0.45" />
          </linearGradient>
        </defs>

        {/* --- BEZIER FLOW PATHS --- */}
        {/* Left -> Mid */}
        <path
          d={createPath(leftX + nodeWidth, leftY, leftH * 0.35, midX, clearedY, clearedH)}
          fill="url(#grad-applied-cleared)"
          className="transition-all hover:opacity-80"
        />
        <path
          d={createPath(leftX + nodeWidth, leftY + leftH * 0.35, leftH * 0.35, midX, holdY, holdH)}
          fill="url(#grad-applied-holding)"
          className="transition-all hover:opacity-80"
        />
        <path
          d={createPath(leftX + nodeWidth, leftY + leftH * 0.7, leftH * 0.3, midX, taxiY, taxiH)}
          fill="url(#grad-applied-taxiing)"
          className="transition-all hover:opacity-80"
        />

        {/* Mid -> Right */}
        <path
          d={createPath(midX + nodeWidth, clearedY, clearedH, rightX, airY, airH)}
          fill="url(#grad-cleared-airborne)"
          className="transition-all hover:opacity-80"
        />
        <path
          d={createPath(midX + nodeWidth, holdY, holdH, rightX, rejY, rejH)}
          fill="url(#grad-holding-rejected)"
          className="transition-all hover:opacity-80"
        />
        <path
          d={createPath(midX + nodeWidth, taxiY, taxiH, rightX, ghY, ghH)}
          fill="url(#grad-taxiing-ghosted)"
          className="transition-all hover:opacity-80"
        />

        {/* --- NODE BARS & LABELS --- */}

        {/* Left: Total Applied */}
        <rect
          x={leftX}
          y={leftY}
          width={nodeWidth}
          height={leftH}
          fill={colors.applied}
          rx={2}
          stroke="#3c3836"
          strokeWidth={1.5}
        />
        <text
          x={leftX - 8}
          y={leftY + leftH / 2}
          textAnchor="end"
          dominantBaseline="middle"
          className="fill-[#282828] font-mono text-[10px] font-bold uppercase"
        >
          FILED ({jobs.length})
        </text>

        {/* Mid 1: Taxiing */}
        <rect
          x={midX}
          y={taxiY}
          width={nodeWidth}
          height={taxiH}
          fill={colors.taxiing}
          rx={2}
          stroke="#3c3836"
          strokeWidth={1.5}
        />

        {/* Mid 2: Holding */}
        <rect
          x={midX}
          y={holdY}
          width={nodeWidth}
          height={holdH}
          fill={colors.holding}
          rx={2}
          stroke="#3c3836"
          strokeWidth={1.5}
        />

        {/* Mid 3: Cleared */}
        <rect
          x={midX}
          y={clearedY}
          width={nodeWidth}
          height={clearedH}
          fill={colors.cleared}
          rx={2}
          stroke="#3c3836"
          strokeWidth={1.5}
        />

        {/* Right 1: Airborne */}
        <rect
          x={rightX}
          y={airY}
          width={nodeWidth}
          height={airH}
          fill={colors.airborne}
          rx={2}
          stroke="#3c3836"
          strokeWidth={1.5}
        />
        <text
          x={rightX + nodeWidth + 8}
          y={airY + airH / 2}
          dominantBaseline="middle"
          className="fill-[#282828] font-mono text-[10px] font-bold uppercase"
        >
          AIRBORNE ({counts.airborne})
        </text>

        {/* Right 2: Return to Gate (Rejected) */}
        <rect
          x={rightX}
          y={rejY}
          width={nodeWidth}
          height={rejH}
          fill={colors.rejected}
          rx={2}
          stroke="#3c3836"
          strokeWidth={1.5}
        />
        <text
          x={rightX + nodeWidth + 8}
          y={rejY + rejH / 2}
          dominantBaseline="middle"
          className="fill-[#282828] font-mono text-[10px] font-bold uppercase"
        >
          REJECTED ({counts.return_to_gate})
        </text>

        {/* Right 3: Holding Pattern (Ghosted) */}
        <rect
          x={rightX}
          y={ghY}
          width={nodeWidth}
          height={ghH}
          fill={colors.ghosted}
          rx={2}
          stroke="#3c3836"
          strokeWidth={1.5}
        />
        <text
          x={rightX + nodeWidth + 8}
          y={ghY + ghH / 2}
          dominantBaseline="middle"
          className="fill-[#282828] font-mono text-[10px] font-bold uppercase"
        >
          GHOSTED ({counts.holding_pattern})
        </text>
      </svg>
    </div>
  );
}
