import { INITIAL_JOBS } from '../types/job';

const STORAGE_KEY = 'runway_jobs_v1';

export const storageService = {
  getJobs: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        // Initialize with default demo data
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_JOBS));
        return INITIAL_JOBS;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed to parse jobs from localStorage', e);
      return INITIAL_JOBS;
    }
  },

  saveJobs: (jobs) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
    } catch (e) {
      console.error('Failed to save jobs to localStorage', e);
    }
  },

  addJob: (newJobData) => {
    const jobs = storageService.getJobs();
    const newJob = {
      id: `job-${Date.now()}`,
      appliedDate: newJobData.appliedDate || new Date().toISOString().split('T')[0],
      history: [
        {
          status: newJobData.status || 'applied',
          date: new Date().toISOString().split('T')[0],
          note: 'Job application created.'
        }
      ],
      ...newJobData
    };
    const updated = [newJob, ...jobs];
    storageService.saveJobs(updated);
    return updated;
  },

  updateJob: (id, updatedFields) => {
    const jobs = storageService.getJobs();
    const updated = jobs.map((job) => {
      if (job.id === id) {
        const hasStatusChanged = updatedFields.status && updatedFields.status !== job.status;
        const newHistory = hasStatusChanged
          ? [
              ...(job.history || []),
              {
                status: updatedFields.status,
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

  deleteJob: (id) => {
    const jobs = storageService.getJobs();
    const updated = jobs.filter((job) => job.id !== id);
    storageService.saveJobs(updated);
    return updated;
  },

  exportData: () => {
    const jobs = storageService.getJobs();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(jobs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `runway_jobs_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  },

  importData: (jsonData) => {
    try {
      const parsed = JSON.parse(jsonData);
      if (Array.isArray(parsed)) {
        storageService.saveJobs(parsed);
        return parsed;
      }
      throw new Error("Invalid format: expected array of jobs");
    } catch (err) {
      throw new Error("Failed to parse JSON file: " + err.message);
    }
  }
};
