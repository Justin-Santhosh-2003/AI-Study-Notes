const express = require('express');
const router = express.Router();
const { summarizeNote, generateFlashcards, generateQuiz } = require('../controllers/aiController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/summarize', protect, summarizeNote);
router.post('/generate-flashcards', protect, generateFlashcards);
router.post('/generate-quiz', protect, generateQuiz);

module.exports = router;
