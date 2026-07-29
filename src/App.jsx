import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { StatsOverview } from './components/StatsOverview';
import { KanbanBoard } from './components/KanbanBoard';
import { JobTable } from './components/JobTable';
import { JobModal } from './components/JobModal';
import { JobDetailDrawer } from './components/JobDetailDrawer';
import { storageService } from './services/storage';
import { Filter, RotateCcw } from 'lucide-react';
import { STATUS_CONFIG } from './types/job';

export default function App() {
  const [jobs, setJobs] = useState([]);
  const [viewMode, setViewMode] = useState('board'); // 'board' | 'table'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [initialStatusForModal, setInitialStatusForModal] = useState('applied');
  const [selectedDetailJob, setSelectedDetailJob] = useState(null);

  // Toast notification
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    const loadedJobs = storageService.getJobs();
    setJobs(loadedJobs);
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Handlers
  const handleOpenAddModal = (status = 'applied') => {
    setEditingJob(null);
    setInitialStatusForModal(status);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (job) => {
    setEditingJob(job);
    setIsAddModalOpen(true);
  };

  const handleSaveJob = (formData) => {
    if (editingJob) {
      const updated = storageService.updateJob(editingJob.id, formData);
      setJobs(updated);
      showToast(`Updated "${formData.title}" at ${formData.company}`);
      if (selectedDetailJob && selectedDetailJob.id === editingJob.id) {
        setSelectedDetailJob({ ...selectedDetailJob, ...formData });
      }
    } else {
      const updated = storageService.addJob(formData);
      setJobs(updated);
      showToast(`Added application for "${formData.title}" at ${formData.company}`);
    }
    setIsAddModalOpen(false);
    setEditingJob(null);
  };

  const handleUpdateStatus = (id, newStatus) => {
    const updated = storageService.updateJob(id, { status: newStatus });
    setJobs(updated);
    const targetJob = jobs.find(j => j.id === id);
    if (targetJob) {
      showToast(`Moved "${targetJob.title}" to ${STATUS_CONFIG[newStatus]?.label}`);
    }
    if (selectedDetailJob && selectedDetailJob.id === id) {
      setSelectedDetailJob({ ...selectedDetailJob, status: newStatus });
    }
  };

  const handleDeleteJob = (id) => {
    const targetJob = jobs.find(j => j.id === id);
    if (window.confirm(`Are you sure you want to delete the application for "${targetJob?.title || 'this job'}"?`)) {
      const updated = storageService.deleteJob(id);
      setJobs(updated);
      showToast(`Deleted application`);
      if (selectedDetailJob && selectedDetailJob.id === id) {
        setSelectedDetailJob(null);
      }
    }
  };

  const handleExport = () => {
    storageService.exportData();
    showToast('Exported Runway jobs backup file!');
  };

  const handleImport = (jsonStr) => {
    try {
      const imported = storageService.importData(jsonStr);
      setJobs(imported);
      showToast('Successfully imported job applications!');
    } catch (e) {
      alert(e.message);
    }
  };

  // Filtered jobs
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = 
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (job.location && job.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (job.tags && job.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesStatus = selectedStatusFilter === 'all' || job.status === selectedStatusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{ minHeight: '100vh', padding: '24px 20px', maxWidth: '1440px', margin: '0 auto' }}>
      
      {/* Toast Banner */}
      {toastMessage && (
        <div 
          className="animate-fade-in"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            background: 'var(--bg-glass-modal)',
            border: '1px solid var(--accent-indigo)',
            borderRadius: '12px',
            padding: '12px 20px',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 1000,
            fontSize: '0.88rem',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-emerald)' }} />
          {toastMessage}
        </div>
      )}

      {/* Main Header */}
      <Header
        viewMode={viewMode}
        setViewMode={setViewMode}
        onOpenAddModal={handleOpenAddModal}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onExport={handleExport}
        onImport={handleImport}
        totalJobs={jobs.length}
      />

      {/* KPI Stats Overview */}
      <StatsOverview jobs={jobs} />

      {/* Secondary Status Filter Strip */}
      <div 
        className="glass-panel" 
        style={{ 
          padding: '12px 18px', 
          marginBottom: '20px', 
          display: 'flex', 
          alignItems: 'center', 
          justify: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <Filter size={15} color="var(--text-muted)" />
          <span style={{ fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Filter by Status:</span>
          
          <button
            className="btn-secondary"
            onClick={() => setSelectedStatusFilter('all')}
            style={{
              padding: '4px 12px',
              fontSize: '0.78rem',
              borderRadius: '20px',
              background: selectedStatusFilter === 'all' ? 'var(--accent-indigo)' : 'rgba(255, 255, 255, 0.05)',
              color: selectedStatusFilter === 'all' ? '#fff' : 'var(--text-secondary)',
              borderColor: selectedStatusFilter === 'all' ? 'var(--accent-indigo)' : 'var(--border-light)'
            }}
          >
            All ({jobs.length})
          </button>

          {Object.keys(STATUS_CONFIG).map((k) => {
            const count = jobs.filter(j => j.status === k).length;
            const isSelected = selectedStatusFilter === k;
            return (
              <button
                key={k}
                className="btn-secondary"
                onClick={() => setSelectedStatusFilter(k)}
                style={{
                  padding: '4px 12px',
                  fontSize: '0.78rem',
                  borderRadius: '20px',
                  background: isSelected ? STATUS_CONFIG[k].color + '33' : 'rgba(255, 255, 255, 0.05)',
                  color: isSelected ? STATUS_CONFIG[k].color : 'var(--text-secondary)',
                  borderColor: isSelected ? STATUS_CONFIG[k].color : 'var(--border-light)',
                  fontWeight: isSelected ? '700' : '500'
                }}
              >
                {STATUS_CONFIG[k].label} ({count})
              </button>
            );
          })}
        </div>

        {selectedStatusFilter !== 'all' && (
          <button 
            className="btn-icon" 
            onClick={() => setSelectedStatusFilter('all')}
            title="Reset Filters"
            style={{ fontSize: '0.76rem', padding: '4px 10px', gap: '4px' }}
          >
            <RotateCcw size={12} /> Reset Filter
          </button>
        )}
      </div>

      {/* Main Content Body: Kanban Board or Table */}
      {viewMode === 'board' ? (
        <KanbanBoard
          jobs={filteredJobs}
          onOpenDetail={setSelectedDetailJob}
          onOpenAddModal={handleOpenAddModal}
          onUpdateStatus={handleUpdateStatus}
        />
      ) : (
        <JobTable
          jobs={filteredJobs}
          onOpenDetail={setSelectedDetailJob}
          onOpenEditModal={handleOpenEditModal}
          onDeleteJob={handleDeleteJob}
          onUpdateStatus={handleUpdateStatus}
        />
      )}

      {/* Add / Edit Job Modal */}
      <JobModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveJob}
        editingJob={editingJob}
        initialStatus={initialStatusForModal}
      />

      {/* Job Detail Drawer */}
      <JobDetailDrawer
        job={selectedDetailJob}
        onClose={() => setSelectedDetailJob(null)}
        onEdit={handleOpenEditModal}
        onDelete={handleDeleteJob}
        onUpdateStatus={handleUpdateStatus}
      />

    </div>
  );
}
