const express = require('express');
const router = express.Router();
const {
  submitQuizAttempt,
  getProgressStats,
  getQuizHistory,
} = require('../controllers/progressController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/submit-quiz', protect, submitQuizAttempt);
router.get('/stats', protect, getProgressStats);
router.get('/history', protect, getQuizHistory);

module.exports = router;
