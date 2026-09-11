import api from './api';

export const getUserDashboard = () => api.get('/dashboard/user').then((r) => r.data.data);
export const getStaffDashboard = () => api.get('/dashboard/staff').then((r) => r.data.data);
export const getAdminDashboard = () => api.get('/dashboard/admin').then((r) => r.data.data);
