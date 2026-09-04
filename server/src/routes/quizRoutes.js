const express = require('express');
const router = express.Router();
const {
  getAllQuizzes,
  getQuizzesByNote,
  saveQuiz,
  getQuizById,
} = require('../controllers/quizController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/', protect, getAllQuizzes);
router.get('/note/:noteId', protect, getQuizzesByNote);
router.post('/', protect, saveQuiz);
router.get('/:id', protect, getQuizById);

module.exports = router;
