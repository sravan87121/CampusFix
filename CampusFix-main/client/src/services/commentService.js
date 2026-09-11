import api from './api';

export const getComments = (ticketId) => api.get(`/tickets/${ticketId}/comments`).then((r) => r.data.data.comments);
export const addComment = (ticketId, message) =>
  api.post(`/tickets/${ticketId}/comments`, { message }).then((r) => r.data.data.comment);
