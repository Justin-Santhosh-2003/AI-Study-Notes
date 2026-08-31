const express = require('express');
const router = express.Router();
const {
  signup,
  signin,
  logout,
  getProfile,
  checkAdmin,
} = require('../controllers/authController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// Public routes
router.post('/signup', signup);
router.post('/signin', signin);
router.post('/logout', logout);

// Protected routes
router.get('/profile', protect, getProfile);
router.get('/check-admin', protect, authorize('Admin'), checkAdmin);

module.exports = router;
