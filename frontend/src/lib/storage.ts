import { JobApplication, INITIAL_JOBS, ApplicationStatus } from '../types/job';

const STORAGE_KEY = 'runway_jobs_v2';

export const storageService = {
  getJobs: (): JobApplication[] => {
    if (typeof window === 'undefined') return INITIAL_JOBS;
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_JOBS));
        return INITIAL_JOBS;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed to parse jobs from localStorage', e);
      return INITIAL_JOBS;
    }
  },

  saveJobs: (jobs: JobApplication[]): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
    } catch (e) {
      console.error('Failed to save jobs to localStorage', e);
    }
  },

  addJob: (newJobData: Partial<JobApplication>): JobApplication[] => {
    const jobs = storageService.getJobs();
    const newJob: JobApplication = {
      id: `job-${Date.now()}`,
      company: newJobData.company || 'Unknown Company',
      title: newJobData.title || 'Job Application',
      location: newJobData.location || '',
      salary: newJobData.salary || '',
      url: newJobData.url || '',
      appliedDate: newJobData.appliedDate || new Date().toISOString().split('T')[0],
      status: (newJobData.status as ApplicationStatus) || 'taxiing',
      tags: newJobData.tags || [],
      notes: newJobData.notes || '',
      history: [
        {
          status: (newJobData.status as ApplicationStatus) || 'taxiing',
          date: new Date().toISOString().split('T')[0],
          note: 'Job application created.'
        }
      ]
    };
    const updated = [newJob, ...jobs];
    storageService.saveJobs(updated);
    return updated;
  },

  updateJob: (id: string, updatedFields: Partial<JobApplication>): JobApplication[] => {
    const jobs = storageService.getJobs();
    const updated = jobs.map((job) => {
      if (job.id === id) {
        const hasStatusChanged = updatedFields.status && updatedFields.status !== job.status;
        const newHistory = hasStatusChanged
          ? [
              ...(job.history || []),
              {
                status: updatedFields.status as ApplicationStatus,
                date: new Date().toISOString().split('T')[0],
                note: `Status changed to ${updatedFields.status}`
              }
            ]
          : job.history;

        return {
          ...job,
          ...updatedFields,
          history: newHistory
        };
      }
      return job;
    });
    storageService.saveJobs(updated);
    return updated;
  },

  deleteJob: (id: string): JobApplication[] => {
    const jobs = storageService.getJobs();
    const updated = jobs.filter((job) => job.id !== id);
    storageService.saveJobs(updated);
    return updated;
  },

  exportData: (): void => {
    if (typeof window === 'undefined') return;
    const jobs = storageService.getJobs();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(jobs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `runway_jobs_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  },

  importData: (jsonData: string): JobApplication[] => {
    try {
      const parsed = JSON.parse(jsonData);
      if (Array.isArray(parsed)) {
        storageService.saveJobs(parsed);
        return parsed;
      }
      throw new Error("Invalid format: expected array of jobs");
    } catch (err: any) {
      throw new Error("Failed to parse JSON file: " + err.message);
    }
  }
};
