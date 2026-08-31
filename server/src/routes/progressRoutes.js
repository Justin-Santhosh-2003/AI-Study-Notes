const express = require('express');
const router = express.Router();
const {
  submitQuizAttempt,
  getProgressStats,
} = require('../controllers/progressController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/submit-quiz', protect, submitQuizAttempt);
router.get('/stats', protect, getProgressStats);

module.exports = router;
