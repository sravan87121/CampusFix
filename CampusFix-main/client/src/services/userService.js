import api from './api';

export const getUsers = (role) => api.get('/users', { params: role ? { role } : {} }).then((r) => r.data.data.users);
export const changeUserRole = (id, role) => api.put(`/users/${id}/role`, { role }).then((r) => r.data.data.user);
export const toggleUserActive = (id, isActive) => api.put(`/users/${id}/status`, { isActive }).then((r) => r.data.data.user);
