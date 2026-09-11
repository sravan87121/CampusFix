import api from './api';

export const getCategories = () => api.get('/categories').then((r) => r.data.data.categories);
export const createCategory = (payload) => api.post('/categories', payload).then((r) => r.data.data.category);
export const updateCategory = (id, payload) => api.put(`/categories/${id}`, payload).then((r) => r.data.data.category);
export const deleteCategory = (id) => api.delete(`/categories/${id}`).then((r) => r.data.data.category);
