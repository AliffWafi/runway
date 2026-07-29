'use client';

import React from 'react';
import { JobApplication } from '../types/job';
import { Plane, Compass, Award, AlertCircle } from 'lucide-react';

interface StatsOverviewProps {
  jobs: JobApplication[];
}

export function StatsOverview({ jobs }: StatsOverviewProps) {
  const total = jobs.length;
  const taxiing = jobs.filter(j => j.status === 'taxiing').length;
  const holding = jobs.filter(j => j.status === 'holding').length;
  const cleared = jobs.filter(j => j.status === 'cleared_for_takeoff').length;
  const airborne = jobs.filter(j => j.status === 'airborne').length;
  const ghosted = jobs.filter(j => j.status === 'holding_pattern').length;

  const cards = [
    {
      title: 'TOTAL MANIFEST',
      value: total,
      subtext: `${taxiing} TAXIING, ${holding} HOLDING`,
      icon: Plane,
      color: 'text-[#83a598]', // Gruvbox Blue
    },
    {
      title: 'CLEARED FOR TAKEOFF',
      value: cleared,
      subtext: 'INTERVIEWS & ASSESSMENTS',
      icon: Compass,
      color: 'text-[#fabd2f]', // Gruvbox Yellow
    },
    {
      title: 'AIRBORNE (SECURED)',
      value: airborne,
      subtext: airborne > 0 ? 'OFFER EXTENDED' : 'READY FOR FLIGHT',
      icon: Award,
      color: 'text-[#b8bb26]', // Gruvbox Green
    },
    {
      title: 'HOLDING PATTERN',
      value: ghosted,
      subtext: 'GHOSTED (>30 DAYS)',
      icon: AlertCircle,
      color: 'text-[#d3869b]', // Gruvbox Purple
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
      {cards.map((card, idx) => {
        const IconComponent = card.icon;
        return (
          <div 
            key={idx} 
            className="bg-[#3c3836] border border-[#504945] rounded-md p-3.5"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-mono font-bold tracking-wider text-[#a89984] uppercase">
                {card.title}
              </span>
              <IconComponent className={`w-3.5 h-3.5 ${card.color}`} />
            </div>
            
            <div className={`text-xl font-bold font-mono ${card.color} mb-0.5`}>
              {card.value}
            </div>
            
            <div className="text-[10px] font-mono text-[#928374] uppercase">
              {card.subtext}
            </div>
          </div>
        );
      })}
    </div>
  );
}
