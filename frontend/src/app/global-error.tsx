'use client';

import React from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="bg-[#fbf1c7] min-h-screen p-5 font-mono flex flex-col items-center justify-center text-[#282828]">
        <div className="border-2 border-[#3c3836] bg-[#ebdbb2] rounded p-6 text-center shadow-[4px_4px_0px_#3c3836] max-w-md">
          <h2 className="text-lg font-bold text-[#ea696c] mb-2 uppercase">
            🚨 CRITICAL SYSTEM EXCEPTION
          </h2>
          <p className="text-xs text-[#665c54] mb-4">
            {error.message || 'System error encountered.'}
          </p>
          <button
            onClick={() => reset()}
            className="bg-[#fe8019] text-[#282828] text-xs font-extrabold px-4 py-2 rounded border border-[#3c3836] shadow-[2px_2px_0px_#3c3836]"
          >
            RESTART FLIGHT CONTROL &rarr;
          </button>
        </div>
      </body>
    </html>
  );
}
