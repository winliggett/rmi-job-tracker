import Constants from 'expo-constants';

const API_BASE_URL = __DEV__ 
  ? 'https://9de8504a-3c55-430f-80bd-4a63a7b7b1f4-00-18yoc18o2rny0.kirk.replit.dev'
  : 'https://your-production-url.com';

export const BASE_URL = API_BASE_URL;

export async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Request failed');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

export async function login(username, password, remember = true) {
  return apiRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password, remember }),
  });
}

export async function getJobs(token, filters = {}) {
  const params = new URLSearchParams(filters);
  return apiRequest(`/api/jobs?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function getJob(token, jobId) {
  return apiRequest(`/api/jobs/${jobId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function createJob(token, jobData) {
  return apiRequest('/api/jobs', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(jobData),
  });
}

export async function updateJobStatus(token, jobId, status) {
  return apiRequest(`/api/jobs/${jobId}/status`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ status }),
  });
}

export async function updateJob(token, jobId, jobData) {
  return apiRequest(`/api/jobs/${jobId}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(jobData),
  });
}

export async function addNote(token, jobId, text, options = {}) {
  return apiRequest(`/api/jobs/${jobId}/notes`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ text, ...options }),
  });
}

export async function getSettings(token) {
  return apiRequest('/api/settings', {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function updateSetting(token, key, value) {
  return apiRequest('/api/settings', {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ key, value }),
  });
}

export async function testSMS(token, phone) {
  return apiRequest('/api/settings/test-sms', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ phone }),
  });
}

export async function getDashboardStats(token) {
  return apiRequest('/api/dashboard/stats', {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function assignTrades(token, jobId, trades) {
  return apiRequest(`/api/jobs/${jobId}/trades`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ trades }),
  });
}

export async function toggleTask(token, taskId) {
  return apiRequest(`/api/tasks/${taskId}/toggle`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function getJobDetails(token, jobId) {
  return apiRequest(`/api/jobs/${jobId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function getTeamMembers(token) {
  return apiRequest('/api/users', {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export default {
  BASE_URL: API_BASE_URL,
  login,
  getJobs,
  getJob,
  getJobDetails,
  createJob,
  updateJob,
  updateJobStatus,
  addNote,
  getSettings,
  updateSetting,
  testSMS,
  getDashboardStats,
  assignTrades,
  toggleTask,
  getTeamMembers,
};
