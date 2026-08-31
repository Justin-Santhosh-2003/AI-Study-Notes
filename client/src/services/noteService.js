import api from './api';

export const getAllNotes = (subjectId) =>
  api.get('/notes', { params: subjectId ? { subjectId } : {} });
export const createNote = (data) => api.post('/notes', data);
export const getNoteById = (id) => api.get(`/notes/${id}`);
export const updateNote = (id, data) => api.put(`/notes/${id}`, data);
export const deleteNote = (id) => api.delete(`/notes/${id}`);
