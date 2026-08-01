'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiService } from '../../lib/api';
import { JobApplication } from '../../types/job';
import { SankeyDiagram } from '../../components/SankeyDiagram';

export default function DiagnosticsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Auth Guard: Require pilot authentication before accessing diagnostics
    const currentUser = apiService.getCurrentUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    setIsAuthenticated(true);
    loadJobs();
  }, [router]);

  const loadJobs = async () => {
    const loadedJobs = await apiService.getJobs();
    setJobs(loadedJobs);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen p-5 max-w-7xl mx-auto font-mono flex flex-col items-center justify-center text-[#282828]">
        <div className="text-sm font-bold animate-pulse">
          🔒 REDIRECTING TO PILOT AUTHENTICATION...
        </div>
      </div>
    );
  }

  const totalApplied = jobs.length;
  const totalRadar = jobs.filter(j => j.status === 'radar_contact').length;
  const totalRejected = jobs.filter(j => j.status === 'return_to_gate').length;
  const totalGhosted = jobs.filter(j => j.status === 'holding_pattern').length;

  return (
    <main className="min-h-screen p-5 max-w-7xl mx-auto font-sans">
      
      {/* Top Header Bar */}
      <header className="mb-4">
        <div className="flex items-center justify-between py-2 px-1 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-extrabold font-serif text-[#282828] tracking-tight">
              Runway
            </h1>
            <span className="text-[10px] font-mono font-bold bg-[#ebdbb2] text-[#3c3836] border border-[#3c3836] px-2 py-0.5 rounded">
              v1.0
            </span>
          </div>
        </div>

        {/* Dashed Horizontal Page Separator Line */}
        <div className="dashed-separator mt-2 mb-6" />
      </header>

      {/* Main Container - Framed like [Flight Log] Deck */}
      <div className="relative border-2 border-[#3c3836] rounded-md p-6 bg-[#ebdbb2]/30 min-h-[620px] flex flex-col justify-between">
        
        {/* Corner Bracket Marks Framing */}
        <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#3c3836]" />
        <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#3c3836]" />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#3c3836]" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#3c3836]" />

        <div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Section: [Flight Diagnostic] (Sankey Flow Diagram) */}
            <div className="lg:col-span-2 border-2 border-[#3c3836] rounded-md p-5 bg-[#ebdbb2]/40 relative flex flex-col justify-between min-h-[480px]">
              {/* Corner Bracket Marks */}
              <div className="absolute top-1.5 left-1.5 w-3 h-3 border-t-2 border-l-2 border-[#3c3836]" />
              <div className="absolute top-1.5 right-1.5 w-3 h-3 border-t-2 border-r-2 border-[#3c3836]" />
              <div className="absolute bottom-1.5 left-1.5 w-3 h-3 border-b-2 border-l-2 border-[#3c3836]" />
              <div className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b-2 border-r-2 border-[#3c3836]" />

              <div>
                <h2 className="text-2xl font-mono font-bold text-[#282828] tracking-wider mb-6">
                  [Flight Diagnostic]
                </h2>
                
                {/* Dynamic SVG Sankey Diagram */}
                <SankeyDiagram jobs={jobs} />
              </div>

              <div className="text-[11px] font-mono text-[#665c54] text-center pt-4 border-t border-dashed border-[#3c3836]">
                FLOW DIAGNOSTIC • APPLIED STAGES &rarr; INTERVIEW LOOPS &rarr; FINAL OUTCOMES
              </div>
            </div>

            {/* Right Section: [Flight Summary] */}
            <div className="border-2 border-[#3c3836] rounded-md p-5 bg-[#ebdbb2]/40 relative flex flex-col justify-between min-h-[480px]">
              {/* Corner Bracket Marks */}
              <div className="absolute top-1.5 left-1.5 w-3 h-3 border-t-2 border-l-2 border-[#3c3836]" />
              <div className="absolute top-1.5 right-1.5 w-3 h-3 border-t-2 border-r-2 border-[#3c3836]" />
              <div className="absolute bottom-1.5 left-1.5 w-3 h-3 border-b-2 border-l-2 border-[#3c3836]" />
              <div className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b-2 border-r-2 border-[#3c3836]" />

              <div>
                <h2 className="text-2xl font-mono font-bold text-[#282828] tracking-wider mb-6">
                  [Flight Summary]
                </h2>

                {/* Inner Card Box matching User Mockup */}
                <div className="bg-[#fbf1c7] border border-[#3c3836] rounded-sm p-5 shadow-[3px_3px_0px_#3c3836] space-y-4 font-mono text-xs text-[#282828]">
                  
                  {/* Bullet Points Stats */}
                  <div className="space-y-2.5 font-bold">
                    <div>• Total Flight Filed: <span className="text-[#fe8019]">{totalApplied}</span></div>
                    <div>• Radar Contact (Viewed): <span className="text-[#fe8019]">{totalRadar}</span></div>
                    <div>• Returned to Gate (Rejection): <span className="text-[#ea696c]">{totalRejected}</span></div>
                    <div>• In Holding Pattern (Ghosted): <span className="text-[#fabd2f]">{totalGhosted}</span></div>
                    <div>• Coffee Consumed: <span className="text-[#458588]">&infin; cups</span></div>
                  </div>

                  {/* Dashed Separator */}
                  <div className="border-b-2 border-dashed border-[#3c3836]" />

                  {/* Quote Section */}
                  <div className="italic text-[#fe8019] font-bold leading-relaxed text-xs">
                    "Job hunting is tough, pilot. But every rejection is just an altered flight path!" ✈️
                  </div>

                  {/* Dashed Separator */}
                  <div className="border-b-2 border-dashed border-[#3c3836]" />

                  {/* Tip Section */}
                  <div className="text-[11px] text-[#665c54] font-medium leading-normal">
                    Tip: Keep submitting tickets. The right condition is waiting for clearance!
                  </div>

                </div>
              </div>

              {/* Bottom Note */}
              <div className="text-[11px] font-mono text-[#665c54] text-center pt-4">
                RUNWAY DIAGNOSTICS SYSTEM • METRICS VERIFIED
              </div>

            </div>

          </div>
        </div>

        {/* Bottom Footer matching Main Page Footer */}
        <div className="flex items-center justify-between pt-8 mt-6 border-t border-[#3c3836]">
          <div className="text-[11px] font-mono text-[#665c54]">
            RUNWAY FLIGHT SYSTEM • ALL SYSTEMS NOMINAL
          </div>

          <Link
            href="/"
            className="bg-[#fe8019] hover:bg-[#d65d0e] text-[#282828] font-mono font-extrabold text-xs px-4 py-2 border-2 border-[#3c3836] rounded-sm shadow-[2px_2px_0px_#3c3836] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5 uppercase"
          >
            BACK TO FLIGHT DECK &rarr;
          </Link>
        </div>

      </div>

    </main>
  );
}
