'use client';

import React, { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App Router Error Caught:', error);
  }, [error]);

  return (
    <main className="min-h-screen p-5 max-w-xl mx-auto font-mono flex flex-col items-center justify-center text-[#282828]">
      <div className="bg-[#fbf1c7] border-2 border-[#3c3836] rounded p-6 text-center shadow-[4px_4px_0px_#3c3836]">
        <h2 className="text-lg font-bold text-[#ea696c] mb-2 uppercase">
          ⚠️ FLIGHT SYSTEM ANOMALY DETECTED
        </h2>
        <p className="text-xs text-[#665c54] mb-4">
          {error.message || 'An unexpected error occurred in the pilot dashboard.'}
        </p>
        <button
          onClick={() => reset()}
          className="bg-[#458588] text-[#fbf1c7] text-xs font-bold px-4 py-2 rounded border border-[#3c3836] shadow-[2px_2px_0px_#3c3836] hover:bg-[#83a598] transition-all uppercase"
        >
          RETRY SYSTEM RECOVERY &rarr;
        </button>
      </div>
    </main>
  );
}
