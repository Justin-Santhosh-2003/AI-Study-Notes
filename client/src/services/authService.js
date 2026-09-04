import api from './api';

export const signup = (data) => api.post('/auth/signup', data);
export const signin = (data) => api.post('/auth/signin', data);
export const logout = () => api.post('/auth/logout');
export const getProfile = () => api.get('/auth/profile');
export const getPendingTeachers = () => api.get('/auth/pending-teachers');
export const approveTeacher = (id) => api.patch(`/auth/approve-teacher/${id}`);
export const rejectTeacher = (id) => api.delete(`/auth/reject-teacher/${id}`);

