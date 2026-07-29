import React, { useRef } from 'react';
import { 
  Briefcase, 
  Plus, 
  LayoutGrid, 
  List, 
  Download, 
  Upload, 
  Search,
  Sparkles
} from 'lucide-react';

export function Header({ 
  viewMode, 
  setViewMode, 
  onOpenAddModal, 
  searchQuery, 
  setSearchQuery,
  onExport,
  onImport,
  totalJobs
}) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onImport(event.target.result);
      };
      reader.readAsText(file);
    }
  };

  return (
    <header className="glass-panel" style={{ padding: '16px 24px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* Brand & Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div 
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #6366f1, #a855f7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(99, 102, 241, 0.4)'
            }}
          >
            <Briefcase size={22} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.4rem', fontWeight: '800', background: 'linear-gradient(90deg, #ffffff, #cbd5e1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Runway
              </h1>
              <span className="badge" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', border: '1px solid rgba(99, 102, 241, 0.3)', fontSize: '0.7rem' }}>
                <Sparkles size={10} /> Phase 1
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Track & elevate your job application pipeline
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div style={{ flex: '1', maxWidth: '360px', position: 'relative' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search by company, role, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '38px', background: 'rgba(15, 23, 42, 0.8)', height: '40px' }}
          />
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          
          {/* View Mode Toggle */}
          <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid var(--border-light)', borderRadius: '10px', padding: '3px', display: 'flex', gap: '4px' }}>
            <button
              className={`btn-icon ${viewMode === 'board' ? 'active' : ''}`}
              onClick={() => setViewMode('board')}
              title="Kanban Board View"
              style={{
                background: viewMode === 'board' ? 'var(--accent-indigo)' : 'transparent',
                color: viewMode === 'board' ? '#fff' : 'var(--text-secondary)',
                padding: '6px 12px',
                borderRadius: '7px',
                fontSize: '0.82rem',
                gap: '6px'
              }}
            >
              <LayoutGrid size={16} /> Board
            </button>
            <button
              className={`btn-icon ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
              title="Table List View"
              style={{
                background: viewMode === 'table' ? 'var(--accent-indigo)' : 'transparent',
                color: viewMode === 'table' ? '#fff' : 'var(--text-secondary)',
                padding: '6px 12px',
                borderRadius: '7px',
                fontSize: '0.82rem',
                gap: '6px'
              }}
            >
              <List size={16} /> Table
            </button>
          </div>

          {/* Backup / Export / Import */}
          <button className="btn-secondary" onClick={onExport} title="Export JSON backup">
            <Download size={15} /> Export
          </button>

          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept=".json" 
            style={{ display: 'none' }} 
          />
          <button className="btn-secondary" onClick={() => fileInputRef.current?.click()} title="Import JSON backup">
            <Upload size={15} /> Import
          </button>

          {/* Primary Add Job Button */}
          <button className="btn-primary" onClick={() => onOpenAddModal()}>
            <Plus size={18} /> Add Application
          </button>

        </div>

      </div>
    </header>
  );
}
