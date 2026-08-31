import api from './api';

export const submitQuizAttempt = (data) => api.post('/progress/submit-quiz', data);
export const getProgressStats = () => api.get('/progress/stats');
