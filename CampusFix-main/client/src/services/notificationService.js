import api from './api';

export const getNotifications = () => api.get('/notifications').then((r) => r.data.data);
export const markRead = (id) => api.put(`/notifications/${id}/read`);
export const markAllRead = () => api.put('/notifications/read-all');
