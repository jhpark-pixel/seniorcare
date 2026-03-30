import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('admin');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const authApi = {
  login: (username: string, password: string) =>
    api.post('/auth/login', { username, password }),
  me: () => api.get('/auth/me'),
  changePassword: (currentPassword: string, newPassword: string) =>
    api.put('/auth/password', { currentPassword, newPassword }),
};

// Residents
export const residentsApi = {
  list: (params?: any) => api.get('/residents', { params }),
  get: (id: string) => api.get(`/residents/${id}`),
  create: (data: any) => api.post('/residents', data),
  update: (id: string, data: any) => api.put(`/residents/${id}`, data),
  addDisease: (id: string, data: any) => api.post(`/residents/${id}/diseases`, data),
  removeDisease: (id: string, diseaseId: string) => api.delete(`/residents/${id}/diseases/${diseaseId}`),
  addMedication: (id: string, data: any) => api.post(`/residents/${id}/medications`, data),
  updateMedication: (id: string, medId: string, data: any) => api.put(`/residents/${id}/medications/${medId}`, data),
  stats: () => api.get('/residents/stats/summary'),
};

// Health Records
export const healthRecordsApi = {
  list: (residentId: string, days?: number) =>
    api.get(`/health-records/resident/${residentId}`, { params: { days } }),
  create: (data: any) => api.post('/health-records', data),
  update: (id: string, data: any) => api.put(`/health-records/${id}`, data),
  delete: (id: string) => api.delete(`/health-records/${id}`),
  summary: () => api.get('/health-records/summary/all'),
};

// Fall Events
export const fallEventsApi = {
  list: (params?: any) => api.get('/fall-events', { params }),
  unhandledCount: () => api.get('/fall-events/unhandled/count'),
  markRead: (id: string) => api.put(`/fall-events/${id}/read`),
  markAllRead: () => api.put('/fall-events/read/all'),
  addResponse: (id: string, data: any) => api.post(`/fall-events/${id}/responses`, data),
  updateStatus: (id: string, status: string) => api.put(`/fall-events/${id}/status`, { status }),
};

// IoT Devices
export const iotDevicesApi = {
  list: () => api.get('/iot-devices'),
  create: (data: any) => api.post('/iot-devices', data),
  update: (id: string, data: any) => api.put(`/iot-devices/${id}`, data),
  delete: (id: string) => api.delete(`/iot-devices/${id}`),
};

// Programs
export const programsApi = {
  list: (params?: any) => api.get('/programs', { params }),
  get: (id: string) => api.get(`/programs/${id}`),
  create: (data: any) => api.post('/programs', data),
  update: (id: string, data: any) => api.put(`/programs/${id}`, data),
  enroll: (id: string, residentId: string) => api.post(`/programs/${id}/enroll`, { residentId }),
  cancelEnroll: (id: string, enrollmentId: string) => api.delete(`/programs/${id}/enroll/${enrollmentId}`),
  attendance: (id: string, data: any) => api.post(`/programs/${id}/attendance`, data),
  recommend: (residentId: string) => api.get(`/programs/recommend/${residentId}`),
};

// Guides
export const guidesApi = {
  generate: (residentId: string, type: string) =>
    api.post(`/guides/generate/${residentId}`, { type }),
  list: (residentId: string) => api.get(`/guides/resident/${residentId}`),
  delete: (id: string) => api.delete(`/guides/${id}`),
};

// Dashboard
export const dashboardApi = {
  stats: () => api.get('/dashboard/stats'),
  healthAlerts: () => api.get('/dashboard/health-alerts'),
  recentFalls: () => api.get('/dashboard/recent-falls'),
  monthlyStats: () => api.get('/dashboard/monthly-stats'),
  programStats: () => api.get('/dashboard/program-stats'),
  deviceStatus: () => api.get('/dashboard/device-status'),
};

// Reports
export const reportsApi = {
  healthReport: (residentId: string) =>
    api.get(`/reports/health/${residentId}`, { responseType: 'blob' }),
  facilityReport: () =>
    api.get('/reports/facility', { responseType: 'blob' }),
};

// Daily Tasks
export const dailyTasksApi = {
  list: (date?: string) => api.get('/daily-tasks', { params: { date } }),
  create: (data: any) => api.post('/daily-tasks', data),
  complete: (id: string) => api.patch(`/daily-tasks/${id}/complete`),
  reopen: (id: string) => api.patch(`/daily-tasks/${id}/reopen`),
  delete: (id: string) => api.delete(`/daily-tasks/${id}`),
};

// Management
export const managementApi = {
  getStats: () => api.get('/management/stats'),
};

export default api;
