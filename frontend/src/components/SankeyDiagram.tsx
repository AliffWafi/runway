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

  // Modern clean palette matching the reference image & Gruvbox theme
  const colors = {
    taxiing: '#665c54',          // Dark Gray/Slate
    holding: '#504945',          // Dark Gray
    grounded: '#928374',         // Neutral Gray
    groundedCap: '#1d2021',      // Black Cap
    holdingPattern: '#e5f583',    // Light Lime Yellow
    holdingPatternCap: '#c0d625', // Lime Cap
    radar: '#d65d0e',            // Warm Amber/Brown
    radarCap: '#924405',         // Brown Cap
    cleared: '#8ec07c',          // Mint Green
    clearedCap: '#076678',       // Dark Mint Cap
    airborne: '#83a598',         // Soft Cyan/Blue
    airborneCap: '#458588',      // Teal Cap
    rejected: '#f08080',         // Soft Pink/Red
    rejectedCap: '#9d0006',      // Crimson Cap
    flowGray: '#a89984',
    flowYellow: '#e5f583',
    flowRadar: '#d5c4a1',
    flowRed: '#f08080',
    flowGreen: '#8ec07c',
    flowCyan: '#83a598',
  };

  const svgWidth = 880;
  const svgHeight = 400;

  // Node Positions (matching the 4-stage layout from reference)
  // Stage 1: Taxiing
  const taxX = 70;
  const taxY = 70;
  const taxH = 260;
  const taxW = 24;

  // Stage 2: Holding
  const holdX = 230;
  const holdY = 70;
  const holdH = 260;
  const holdW = 24;

  // Stage 3: Mid Nodes
  const groundX = 370;
  const groundY = 50;
  const groundH = Math.max(26, Math.min(60, (counts.grounded / total) * 160 || 32));
  const groundW = 24;

  const radarX = 420;
  const radarY = 240;
  const radarH = Math.max(26, Math.min(50, (counts.radar_contact / total) * 160 || 30));
  const radarW = 24;

  // Stage 4: Right Outcome Nodes
  const patX = 640;
  const patY = 50;
  const patH = Math.max(30, Math.min(90, (counts.holding_pattern / total) * 160 || 45));
  const patW = 24;

  const clearedX = 640;
  const clearedY = 250;
  const clearedH = Math.max(24, Math.min(50, (counts.cleared_for_takeoff / total) * 160 || 28));
  const clearedW = 24;

  const rejX = 640;
  const rejY = 320;
  const rejH = Math.max(30, Math.min(90, (counts.return_to_gate / total) * 160 || 45));
  const rejW = 24;

  const airX = 810;
  const airY = 160;
  const airH = Math.max(20, Math.min(40, (counts.airborne / total) * 160 || 22));
  const airW = 20;

  // Helper for Smooth Flow Ribbon Paths
  const createFlow = (x1: number, y1: number, h1: number, x2: number, y2: number, h2: number) => {
    const c1 = x1 + (x2 - x1) * 0.45;
    const c2 = x1 + (x2 - x1) * 0.55;
    return `
      M ${x1} ${y1}
      C ${c1} ${y1}, ${c2} ${y2}, ${x2} ${y2}
      L ${x2} ${y2 + h2}
      C ${c2} ${y2 + h2}, ${c1} ${y1 + h1}, ${x1} ${y1 + h1}
      Z
    `;
  };

  return (
    <div className="w-full flex flex-col items-center justify-center select-none overflow-x-auto p-2">
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="w-full h-auto max-w-full max-h-[420px]"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Gradient definitions for smooth flowing bands */}
          <linearGradient id="flow-taxi-hold" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7c6f64" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#504945" stopOpacity="0.85" />
          </linearGradient>

          <linearGradient id="flow-hold-ground" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#665c54" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#928374" stopOpacity="0.75" />
          </linearGradient>

          <linearGradient id="flow-hold-pat" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#d5c4a1" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#e5f583" stopOpacity="0.75" />
          </linearGradient>

          <linearGradient id="flow-hold-radar" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#d5c4a1" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#d65d0e" stopOpacity="0.75" />
          </linearGradient>

          <linearGradient id="flow-hold-rej" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#d5c4a1" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#f08080" stopOpacity="0.75" />
          </linearGradient>

          <linearGradient id="flow-radar-pat" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#d65d0e" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#e5f583" stopOpacity="0.7" />
          </linearGradient>

          <linearGradient id="flow-radar-cleared" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#d65d0e" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#8ec07c" stopOpacity="0.75" />
          </linearGradient>

          <linearGradient id="flow-radar-rej" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#d65d0e" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#f08080" stopOpacity="0.7" />
          </linearGradient>

          <linearGradient id="flow-cleared-air" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8ec07c" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#83a598" stopOpacity="0.8" />
          </linearGradient>

          <linearGradient id="flow-cleared-rej" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8ec07c" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#ea696c" stopOpacity="0.75" />
          </linearGradient>
        </defs>

        {/* --- 1. FLOW RIBBONS --- */}
        {/* Main block flow from Taxiing to Holding */}
        <path d={createFlow(taxX + taxW, taxY, taxH, holdX, holdY, holdH)} fill="url(#flow-taxi-hold)" />

        {/* Branch 1: Holding -> Grounded */}
        <path d={createFlow(holdX + holdW, holdY, holdH * 0.22, groundX, groundY, groundH)} fill="url(#flow-hold-ground)" />

        {/* Branch 2: Holding -> Holding Pattern */}
        <path d={createFlow(holdX + holdW, holdY + holdH * 0.22, holdH * 0.38, patX, patY, patH * 0.75)} fill="url(#flow-hold-pat)" />

        {/* Branch 3: Holding -> Radar Contact */}
        <path d={createFlow(holdX + holdW, holdY + holdH * 0.60, holdH * 0.15, radarX, radarY, radarH)} fill="url(#flow-hold-radar)" />

        {/* Branch 4: Holding -> Return to Gate */}
        <path d={createFlow(holdX + holdW, holdY + holdH * 0.75, holdH * 0.25, rejX, rejY, rejH * 0.75)} fill="url(#flow-hold-rej)" />

        {/* Sub-Branch 1: Radar Contact -> Holding Pattern */}
        <path d={createFlow(radarX + radarW, radarY, radarH * 0.3, patX, patY + patH * 0.75, patH * 0.25)} fill="url(#flow-radar-pat)" />

        {/* Sub-Branch 2: Radar Contact -> Cleared for Takeoff */}
        <path d={createFlow(radarX + radarW, radarY + radarH * 0.3, radarH * 0.4, clearedX, clearedY, clearedH)} fill="url(#flow-radar-cleared)" />

        {/* Sub-Branch 3: Radar Contact -> Return to Gate */}
        <path d={createFlow(radarX + radarW, radarY + radarH * 0.7, radarH * 0.3, rejX, rejY + rejH * 0.75, rejH * 0.25)} fill="url(#flow-radar-rej)" />

        {/* Outcome Sub-Branch 1: Cleared for Takeoff -> Airborne */}
        <path d={createFlow(clearedX + clearedW, clearedY, clearedH * 0.6, airX, airY, airH)} fill="url(#flow-cleared-air)" />

        {/* Outcome Sub-Branch 2: Cleared for Takeoff -> Return to Gate */}
        <path d={createFlow(clearedX + clearedW, clearedY + clearedH * 0.6, clearedH * 0.4, rejX, rejY + 10, 15)} fill="url(#flow-cleared-rej)" />


        {/* --- 2. VERTICAL BAR NODES --- */}
        {/* Stage 1: Taxiing Node */}
        <g transform={`translate(${taxX}, ${taxY})`}>
          <rect width={taxW} height={taxH} fill={colors.taxiing} rx="2" className="stroke-1 stroke-[#3c3836]" />
        </g>
        {/* Taxiing Label */}
        <g transform={`translate(${taxX - 12}, ${taxY + taxH / 2})`}>
          <text textAnchor="end" dominantBaseline="middle" fill="#282828" fontSize="12" fontWeight="bold" fontFamily="monospace">
            Taxiing
          </text>
          <text textAnchor="end" y="16" dominantBaseline="middle" fill="#665c54" fontSize="11" fontWeight="bold" fontFamily="monospace">
            {jobs.length}
          </text>
        </g>

        {/* Stage 2: Holding Node */}
        <g transform={`translate(${holdX}, ${holdY})`}>
          <rect width={holdW} height={holdH} fill={colors.holding} rx="2" className="stroke-1 stroke-[#3c3836]" />
        </g>
        {/* Holding Label Card */}
        <g transform={`translate(${holdX - 54}, ${holdY + holdH / 2 - 14})`}>
          <rect width="64" height="28" fill="#ebdbb2" rx="4" className="stroke border-[#3c3836] stroke-1" />
          <text x="32" y="10" textAnchor="middle" dominantBaseline="middle" fill="#282828" fontSize="10" fontWeight="bold" fontFamily="monospace">
            Holding
          </text>
          <text x="32" y="21" textAnchor="middle" dominantBaseline="middle" fill="#665c54" fontSize="10" fontWeight="bold" fontFamily="monospace">
            {jobs.length}
          </text>
        </g>

        {/* Grounded Node */}
        <g transform={`translate(${groundX}, ${groundY})`}>
          <rect width={groundW} height={groundH} fill={colors.grounded} rx="2" />
          <rect width={groundW} height="8" fill={colors.groundedCap} rx="1" />
        </g>
        {/* Grounded Label Card */}
        <g transform={`translate(${groundX - 68}, ${groundY + 4})`}>
          <rect width="64" height="26" fill="#fbf1c7" rx="3" className="stroke border-[#3c3836] stroke-1" />
          <text x="32" y="9" textAnchor="middle" dominantBaseline="middle" fill="#282828" fontSize="9" fontWeight="bold" fontFamily="monospace">
            Grounded
          </text>
          <text x="32" y="19" textAnchor="middle" dominantBaseline="middle" fill="#665c54" fontSize="9" fontWeight="bold" fontFamily="monospace">
            {counts.grounded}
          </text>
        </g>

        {/* Radar Contact Node */}
        <g transform={`translate(${radarX}, ${radarY})`}>
          <rect width={radarW} height={radarH} fill={colors.radar} rx="2" />
          <rect width={radarW} height="8" fill={colors.radarCap} rx="1" />
        </g>
        {/* Radar Contact Label Card */}
        <g transform={`translate(${radarX - 86}, ${radarY + 4})`}>
          <rect width="80" height="26" fill="#fbf1c7" rx="3" className="stroke border-[#3c3836] stroke-1" />
          <text x="40" y="9" textAnchor="middle" dominantBaseline="middle" fill="#282828" fontSize="9" fontWeight="bold" fontFamily="monospace">
            Radar Contact
          </text>
          <text x="40" y="19" textAnchor="middle" dominantBaseline="middle" fill="#665c54" fontSize="9" fontWeight="bold" fontFamily="monospace">
            {counts.radar_contact}
          </text>
        </g>

        {/* Holding Pattern Node (Ghosted) */}
        <g transform={`translate(${patX}, ${patY})`}>
          <rect width={patW} height={patH} fill={colors.holdingPattern} rx="2" />
          <rect width={patW} height="8" fill={colors.holdingPatternCap} rx="1" />
        </g>
        {/* Holding Pattern Label */}
        <g transform={`translate(${patX + 32}, ${patY + 12})`}>
          <text dominantBaseline="middle" fill="#282828" fontSize="11" fontWeight="bold" fontFamily="monospace">
            Holding Pattern
          </text>
          <text y="14" dominantBaseline="middle" fill="#665c54" fontSize="11" fontWeight="bold" fontFamily="monospace">
            {counts.holding_pattern}
          </text>
        </g>

        {/* Cleared for Takeoff Node */}
        <g transform={`translate(${clearedX}, ${clearedY})`}>
          <rect width={clearedW} height={clearedH} fill={colors.cleared} rx="2" />
          <rect width={clearedW} height="8" fill={colors.clearedCap} rx="1" />
        </g>
        {/* Cleared for Takeoff Label */}
        <g transform={`translate(${clearedX + 32}, ${clearedY + 8})`}>
          <text dominantBaseline="middle" fill="#282828" fontSize="11" fontWeight="bold" fontFamily="monospace">
            Cleared for Takeoff
          </text>
          <text y="14" dominantBaseline="middle" fill="#665c54" fontSize="11" fontWeight="bold" fontFamily="monospace">
            {counts.cleared_for_takeoff}
          </text>
        </g>

        {/* Return to Gate Node (Rejected) */}
        <g transform={`translate(${rejX}, ${rejY})`}>
          <rect width={rejW} height={rejH} fill={colors.rejected} rx="2" />
          <rect width={rejW} height="8" fill={colors.rejectedCap} rx="1" />
        </g>
        {/* Return to Gate Label */}
        <g transform={`translate(${rejX + 32}, ${rejY + 18})`}>
          <text dominantBaseline="middle" fill="#282828" fontSize="11" fontWeight="bold" fontFamily="monospace">
            Return to Gate
          </text>
          <text y="14" dominantBaseline="middle" fill="#665c54" fontSize="11" fontWeight="bold" fontFamily="monospace">
            {counts.return_to_gate}
          </text>
        </g>

        {/* Airborne Node (Job Secured) */}
        <g transform={`translate(${airX}, ${airY})`}>
          <rect width={airW} height={airH} fill={colors.airborne} rx="2" />
          <rect width={airW} height="6" fill={colors.airborneCap} rx="1" />
        </g>
        {/* Airborne Label */}
        <g transform={`translate(${airX + 28}, ${airY + 4})`}>
          <text dominantBaseline="middle" fill="#282828" fontSize="11" fontWeight="bold" fontFamily="monospace">
            Airborne
          </text>
          <text y="14" dominantBaseline="middle" fill="#665c54" fontSize="11" fontWeight="bold" fontFamily="monospace">
            {counts.airborne}
          </text>
        </g>

      </svg>
    </div>
  );
}
