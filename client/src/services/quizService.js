import api from './api';

export const getAllQuizzes = () => api.get('/quizzes');
export const getQuizzesByNote = (noteId) => api.get(`/quizzes/note/${noteId}`);
export const getQuizById = (id) => api.get(`/quizzes/${id}`);
export const saveQuiz = (data) => api.post('/quizzes', data);
