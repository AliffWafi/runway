'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiService } from '../../lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      if (isRegisterMode) {
        await apiService.registerUser(email, password, fullName);
      } else {
        await apiService.loginUser(email, password);
      }
      router.push('/');
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen p-5 max-w-7xl mx-auto font-sans flex flex-col justify-between">
      
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

      {/* Main Centered Authentication Form Card */}
      <div className="flex-1 flex items-center justify-center my-6">
        <div className="modal-container bg-[#fbf1c7] border-2 border-[#3c3836] rounded-sm max-w-md w-full p-6 shadow-[6px_6px_0px_#3c3836] relative font-mono text-xs text-[#282828]">
          
          {/* Corner Bracket Marks Framing */}
          <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#3c3836]" />
          <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#3c3836]" />
          <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#3c3836]" />
          <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#3c3836]" />

          {/* Mode Selector Tabs: [ SIGN IN ] vs [ REGISTER ] */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <button
              type="button"
              onClick={() => {
                setIsRegisterMode(false);
                setErrorMessage(null);
              }}
              className={`px-4 py-1.5 font-mono font-bold text-xs uppercase border border-[#3c3836] transition-all ${
                !isRegisterMode
                  ? 'bg-[#282828] text-[#ebdbb2] shadow-[2px_2px_0px_#fe8019]'
                  : 'bg-[#ebdbb2] text-[#3c3836] hover:bg-[#d5c4a1]'
              }`}
            >
              [ SIGN IN ]
            </button>

            <button
              type="button"
              onClick={() => {
                setIsRegisterMode(true);
                setErrorMessage(null);
              }}
              className={`px-4 py-1.5 font-mono font-bold text-xs uppercase border border-[#3c3836] transition-all ${
                isRegisterMode
                  ? 'bg-[#282828] text-[#ebdbb2] shadow-[2px_2px_0px_#fe8019]'
                  : 'bg-[#ebdbb2] text-[#3c3836] hover:bg-[#d5c4a1]'
              }`}
            >
              [ REGISTER ]
            </button>
          </div>

          {/* Centered Title */}
          <div className="text-center mb-6">
            <h2 className="text-lg font-bold font-mono text-[#282828] underline underline-offset-4 tracking-wider uppercase">
              {isRegisterMode ? 'CREATE PILOT ACCOUNT' : 'PILOT AUTHENTICATION'}
            </h2>
          </div>

          {/* Error Message Alert */}
          {errorMessage && (
            <div className="mb-4 bg-[#ea696c]/20 border border-[#ea696c] p-2.5 rounded text-center text-[11px] font-bold text-[#9d0006]">
              ⚠️ {errorMessage}
            </div>
          )}

          {/* Authentication Form */}
          <form onSubmit={handleSubmit} className="space-y-4 px-1">
            
            {/* Field: Full Name (Only for Register) */}
            {isRegisterMode && (
              <div className="flex items-center gap-2">
                <div className="bg-[#ebdbb2] border border-[#3c3836] px-2.5 py-1 text-center min-w-[95px] font-bold text-[10px] shadow-[1px_1px_0px_#3c3836] uppercase">
                  PILOT NAME
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. Captain Maverick"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="flex-1 bg-transparent border-b-2 border-[#3c3836] px-1 py-0.5 font-bold text-xs text-[#282828] outline-none focus:border-[#fe8019]"
                />
              </div>
            )}

            {/* Field: Email / Callsign */}
            <div className="flex items-center gap-2">
              <div className="bg-[#ebdbb2] border border-[#3c3836] px-2.5 py-1 text-center min-w-[95px] font-bold text-[10px] shadow-[1px_1px_0px_#3c3836] uppercase">
                EMAIL
              </div>
              <input
                type="email"
                required
                placeholder="pilot@runway.flight"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-transparent border-b-2 border-[#3c3836] px-1 py-0.5 font-mono text-xs text-[#282828] outline-none focus:border-[#fe8019]"
              />
            </div>

            {/* Field: Password */}
            <div className="flex items-center gap-2">
              <div className="bg-[#ebdbb2] border border-[#3c3836] px-2.5 py-1 text-center min-w-[95px] font-bold text-[10px] shadow-[1px_1px_0px_#3c3836] uppercase">
                PASSWORD
              </div>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 bg-transparent border-b-2 border-[#3c3836] px-1 py-0.5 font-mono text-xs text-[#282828] outline-none focus:border-[#fe8019]"
              />
            </div>

            {/* Dashed Horizontal Line Separator */}
            <div className="border-b-2 border-dashed border-[#3c3836] pt-2" />

            {/* Footer Action Buttons */}
            <div className="flex items-center justify-between pt-2">
              <Link
                href="/"
                className="bg-[#ea696c] hover:bg-[#fb4934] text-[#282828] font-mono font-extrabold text-xs px-4 py-1.5 border border-[#3c3836] shadow-[2px_2px_0px_#3c3836] active:translate-x-0.5 active:translate-y-0.5 transition-all uppercase"
              >
                ABORT
              </Link>

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#458588] hover:bg-[#83a598] text-[#fbf1c7] font-mono font-extrabold text-xs px-5 py-1.5 border border-[#3c3836] shadow-[2px_2px_0px_#3c3836] active:translate-x-0.5 active:translate-y-0.5 transition-all uppercase flex items-center gap-2 disabled:opacity-50"
              >
                {isSubmitting
                  ? 'VERIFYING...'
                  : isRegisterMode
                  ? 'CREATE ACCOUNT'
                  : 'AUTHENTICATE'}
              </button>
            </div>

          </form>

        </div>
      </div>

      {/* Page Footer */}
      <footer className="text-center text-[11px] font-mono text-[#665c54] pt-4 border-t border-[#3c3836]">
        RUNWAY FLIGHT AUTHENTICATION SYSTEM • PILOT SECURE ACCESS
      </footer>

    </main>
  );
}
