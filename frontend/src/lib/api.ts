import { JobApplication, ApplicationStatus } from '../types/job';
import { storageService } from './storage';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
}

export const apiService = {
  // Auth Token helpers
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem('runway_auth_token');
    } catch {
      return null;
    }
  },

  setToken(token: string) {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('runway_auth_token', token);
      } catch (e) {
        console.error('Failed to save auth token:', e);
      }
    }
  },

  clearToken() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('runway_auth_token');
        localStorage.removeItem('runway_user');
      } catch (e) {
        console.error('Failed to clear tokens:', e);
      }
    }
  },

  getAuthHeaders(): Record<string, string> {
    const token = this.getToken();
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  },

  getCurrentUser(): UserProfile | null {
    if (typeof window === 'undefined') return null;
    try {
      const str = localStorage.getItem('runway_user');
      if (!str || str === 'undefined' || str === 'null') return null;
      return JSON.parse(str);
    } catch {
      return null;
    }
  },

  // Auth API Endpoints
  async registerUser(email: string, password: string, fullName?: string): Promise<UserProfile> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, full_name: fullName }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to create account');
    }

    const data = await response.json();
    this.setToken(data.access_token);
    if (data.user) {
      localStorage.setItem('runway_user', JSON.stringify(data.user));
    }
    return data.user;
  },

  async loginUser(email: string, password: string): Promise<UserProfile> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.detail || 'Invalid email or password');
    }

    const data = await response.json();
    this.setToken(data.access_token);
    if (data.user) {
      localStorage.setItem('runway_user', JSON.stringify(data.user));
    }
    return data.user;
  },

  logoutUser() {
    this.clearToken();
  },

  // CRUD API Endpoints
  async getJobs(): Promise<JobApplication[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/jobs`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });
      if (!response.ok) throw new Error('API server returned error');
      const data = await response.json();
      
      return data.map((item: any) => ({
        id: item.id,
        company: item.company,
        title: item.title,
        location: item.location || '',
        salary: item.salary || '',
        url: item.url || '',
        appliedDate: item.applied_date,
        status: item.status as ApplicationStatus,
        tags: item.tags_list || (item.tags ? item.tags.split(', ') : []),
        notes: item.notes || '',
        history: item.history || []
      }));
    } catch (error) {
      console.warn('Backend API unreachable, falling back to local storage:', error);
      return storageService.getJobs();
    }
  },

  async addJob(jobData: Partial<JobApplication>): Promise<JobApplication[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/jobs`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          company: jobData.company,
          title: jobData.title,
          location: jobData.location,
          salary: jobData.salary,
          url: jobData.url,
          applied_date: jobData.appliedDate || new Date().toISOString().split('T')[0],
          status: jobData.status || 'taxiing',
          notes: jobData.notes,
          tags_list: jobData.tags || []
        }),
      });
      if (!response.ok) throw new Error('Failed to create job on API');
      return await this.getJobs();
    } catch (error) {
      console.warn('Backend API error, falling back to local storage:', error);
      return storageService.addJob(jobData);
    }
  },

  async updateJob(id: string, updates: Partial<JobApplication>): Promise<JobApplication[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/jobs/${id}`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          company: updates.company,
          title: updates.title,
          location: updates.location,
          salary: updates.salary,
          url: updates.url,
          applied_date: updates.appliedDate,
          status: updates.status,
          notes: updates.notes,
          tags_list: updates.tags
        }),
      });
      if (!response.ok) throw new Error('Failed to update job on API');
      return await this.getJobs();
    } catch (error) {
      console.warn('Backend API error, falling back to local storage:', error);
      return storageService.updateJob(id, updates);
    }
  },

  async deleteJob(id: string): Promise<JobApplication[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/jobs/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });
      if (!response.ok) throw new Error('Failed to delete job on API');
      return await this.getJobs();
    } catch (error) {
      console.warn('Backend API error, falling back to local storage:', error);
      return storageService.deleteJob(id);
    }
  }
};
