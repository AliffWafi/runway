'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '../components/Header';
import { KanbanBoard } from '../components/KanbanBoard';
import { JobTable } from '../components/JobTable';
import { JobModal } from '../components/JobModal';
import { JobDetailDrawer } from '../components/JobDetailDrawer';
import { apiService } from '../lib/api';
import { storageService } from '../lib/storage';
import { JobApplication, STATUS_CONFIG, ApplicationStatus } from '../types/job';

export default function Home() {
  const router = useRouter();
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'board' | 'table'>('board');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobApplication | null>(null);
  const [initialStatusForModal, setInitialStatusForModal] = useState<ApplicationStatus>('taxiing');
  const [selectedDetailJob, setSelectedDetailJob] = useState<JobApplication | null>(null);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    // Auth Guard: Require pilot authentication before accessing Flight Deck
    const currentUser = apiService.getCurrentUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    setIsAuthenticated(true);
    loadJobs();
  }, [router]);

  const loadJobs = async () => {
    setIsLoading(true);
    try {
      const loadedJobs = await apiService.getJobs();
      setJobs(loadedJobs);
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Handlers
  const handleOpenAddModal = (status: ApplicationStatus = 'taxiing') => {
    setEditingJob(null);
    setInitialStatusForModal(status);
    setSelectedDetailJob(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (job: JobApplication) => {
    setEditingJob(job);
    setSelectedDetailJob(null);
    setIsAddModalOpen(true);
  };

  const handleSaveJob = async (formData: Partial<JobApplication>) => {
    if (editingJob) {
      const updated = await apiService.updateJob(editingJob.id, formData);
      setJobs(updated);
      showToast(`Updated record: "${formData.title}" at ${formData.company}`);
    } else {
      const updated = await apiService.addJob(formData);
      setJobs(updated);
      showToast(`Added entry: "${formData.title}" at ${formData.company}`);
    }
    setIsAddModalOpen(false);
    setEditingJob(null);
    setSelectedDetailJob(null);
  };

  const handleUpdateStatus = async (id: string, newStatus: ApplicationStatus) => {
    const updated = await apiService.updateJob(id, { status: newStatus });
    setJobs(updated);
    const targetJob = jobs.find(j => j.id === id);
    if (targetJob) {
      showToast(`Moved "${targetJob.title}" to ${STATUS_CONFIG[newStatus]?.label}`);
    }
    if (selectedDetailJob && selectedDetailJob.id === id) {
      setSelectedDetailJob({ ...selectedDetailJob, status: newStatus });
    }
  };

  const handleDeleteJob = async (id: string) => {
    try {
      const updated = await apiService.deleteJob(id);
      setJobs(updated);
      showToast(`Deleted logbook entry`);
      setSelectedDetailJob(null);
    } catch (e: any) {
      console.error('Delete job error:', e);
    }
  };

  const handleExport = () => {
    storageService.exportData();
    showToast('Exported logbook backup file!');
  };

  const handleImport = async (jsonStr: string) => {
    try {
      const imported = storageService.importData(jsonStr);
      setJobs(imported);
      showToast('Successfully imported logbook entries!');
    } catch (e: any) {
      alert(e.message);
    }
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

  // Filtered jobs by search query
  const filteredJobs = jobs.filter((job) => {
    return (
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (job.location && job.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (job.tags && job.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())))
    );
  });

  return (
    <main className="min-h-screen p-5 max-w-7xl mx-auto font-sans">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 bg-[#1d2021] border border-[#fe8019] rounded p-3 shadow-md z-[1000] text-xs font-mono text-[#ebdbb2] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#b8bb26]" />
          {toastMessage}
        </div>
      )}

      {/* Main Header & Dashed Separator */}
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

      {/* Main View: [Flight Log] Board vs Table */}
      {viewMode === 'board' ? (
        <KanbanBoard
          jobs={filteredJobs}
          isLoading={isLoading}
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

    </main>
  );
}
