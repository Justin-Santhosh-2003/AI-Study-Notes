import api from './api';

export const getAllFlashcardSets = () => api.get('/flashcards');
export const getFlashcardsByNote = (noteId) => api.get(`/flashcards/note/${noteId}`);
export const saveFlashcardSet = (data) => api.post('/flashcards', data);
export const deleteFlashcardSet = (id) => api.delete(`/flashcards/${id}`);
