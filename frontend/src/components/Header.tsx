'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  Filter, 
  Plus, 
  User, 
  LogOut,
  List 
} from 'lucide-react';
import { apiService, UserProfile } from '../lib/api';

interface HeaderProps {
  viewMode: 'board' | 'table';
  setViewMode: (mode: 'board' | 'table') => void;
  onOpenAddModal: (status?: any) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onExport: () => void;
  onImport: (jsonStr: string) => void;
  totalJobs: number;
}

export function Header({ 
  viewMode, 
  setViewMode, 
  onOpenAddModal, 
  searchQuery, 
  setSearchQuery,
  totalJobs
}: HeaderProps) {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const user = apiService.getCurrentUser();
    setCurrentUser(user);
  }, []);

  const handleAuthAction = () => {
    if (currentUser) {
      apiService.logoutUser();
      setCurrentUser(null);
      window.location.href = '/login';
    } else {
      router.push('/login');
    }
  };

  return (
    <header className="mb-4">
      <div className="flex items-center justify-between py-2 px-1 flex-wrap gap-4">
        
        {/* Left: Runway Title (Typewriter/Slab Serif) & Version Badge */}
        <div className="flex items-center gap-4">
          <Link href="/" className="group">
            <h1 className="text-3xl font-extrabold font-serif text-[#282828] tracking-tight group-hover:text-[#fe8019] transition-colors">
              Runway
            </h1>
          </Link>
          <span className="text-[10px] font-mono font-bold bg-[#ebdbb2] text-[#3c3836] border border-[#3c3836] px-2 py-0.5 rounded">
            v1.0
          </span>
        </div>

        {/* Right: Search Pill & Circular Action Buttons (Matching User Sketch) */}
        <div className="flex items-center gap-2.5">
          
          {/* Dark Pill Search Bar */}
          <div className="bg-[#282828] text-[#ebdbb2] border border-[#3c3836] rounded-full px-3.5 py-1.5 flex items-center gap-2 min-w-[200px] sm:min-w-[220px]">
            <input
              type="text"
              placeholder="search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-xs font-mono text-[#ebdbb2] placeholder:text-[#a89984] w-full"
            />
            <Search className="w-4 h-4 text-[#ebdbb2] shrink-0" />
          </div>

          {/* 1. Toggle View Circular Button */}
          <button
            onClick={() => setViewMode(viewMode === 'board' ? 'table' : 'board')}
            title="Toggle Board/Table View"
            className="w-9 h-9 rounded-full bg-[#282828] hover:bg-[#3c3836] text-[#ebdbb2] border border-[#3c3836] flex items-center justify-center transition-all shadow-sm shrink-0"
          >
            {viewMode === 'board' ? <Filter className="w-4 h-4" /> : <List className="w-4 h-4" />}
          </button>

          {/* 2. Add Entry Circular Button */}
          <button
            onClick={() => onOpenAddModal()}
            title="Add Application Entry"
            className="w-9 h-9 rounded-full bg-[#282828] hover:bg-[#fe8019] hover:text-[#282828] text-[#ebdbb2] border border-[#3c3836] flex items-center justify-center transition-all shadow-sm shrink-0"
          >
            <Plus className="w-5 h-5 font-bold" />
          </button>

          {/* 3. Circular Profile / Log Out Button */}
          <button
            onClick={handleAuthAction}
            title={currentUser ? `Log Out Pilot (${currentUser.email})` : 'Pilot Sign In / Register'}
            className={`w-9 h-9 rounded-full border border-[#3c3836] flex items-center justify-center transition-all shadow-sm shrink-0 ${
              currentUser
                ? 'bg-[#ea696c] hover:bg-[#fb4934] text-[#282828]'
                : 'bg-[#282828] hover:bg-[#458588] text-[#ebdbb2]'
            }`}
          >
            {currentUser ? <LogOut className="w-4 h-4" /> : <User className="w-4 h-4" />}
          </button>

        </div>

      </div>

      {/* Dashed Horizontal Page Separator Line */}
      <div className="dashed-separator mt-2 mb-6" />
    </header>
  );
}
