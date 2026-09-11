import api from './api';

export const createTicket = (formData) =>
  api.post('/tickets', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data.data.ticket);

export const getMyTickets = (params) => api.get('/tickets/my', { params }).then((r) => r.data.data);
export const getAssignedTickets = (params) => api.get('/tickets/assigned', { params }).then((r) => r.data.data);
export const getAllTickets = (params) => api.get('/tickets', { params }).then((r) => r.data.data);
export const getTicket = (id) => api.get(`/tickets/${id}`).then((r) => r.data.data.ticket);
export const cancelTicket = (id) => api.delete(`/tickets/${id}`).then((r) => r.data.data.ticket);
export const assignTicket = (id, staffId) => api.put(`/tickets/${id}/assign`, { staffId }).then((r) => r.data.data.ticket);
export const changeStatus = (id, status) => api.put(`/tickets/${id}/status`, { status }).then((r) => r.data.data.ticket);
export const changePriority = (id, priority) => api.put(`/tickets/${id}/priority`, { priority }).then((r) => r.data.data.ticket);
export const resolveTicket = (id, formData) =>
  api.put(`/tickets/${id}/resolve`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data.data.ticket);
