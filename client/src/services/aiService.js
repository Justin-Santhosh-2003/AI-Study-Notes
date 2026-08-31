import api from './api';

export const summarizeNote = (noteId) => api.post('/ai/summarize', { noteId });
export const generateFlashcards = (noteId) => api.post('/ai/generate-flashcards', { noteId });
export const generateQuiz = (noteId) => api.post('/ai/generate-quiz', { noteId });
