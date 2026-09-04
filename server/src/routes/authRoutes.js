const express = require('express');
const router = express.Router();
const {
  signup,
  signin,
  logout,
  getProfile,
  checkAdmin,
  getPendingTeachers,
  approveTeacher,
  rejectTeacher,
} = require('../controllers/authController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// Public routes
router.post('/signup', signup);
router.post('/signin', signin);
router.post('/logout', logout);

// Protected routes
router.get('/profile', protect, getProfile);
router.get('/check-admin', protect, authorize('Admin'), checkAdmin);

// Admin-only Teacher Approval routes
router.get('/pending-teachers', protect, authorize('Admin'), getPendingTeachers);
router.patch('/approve-teacher/:id', protect, authorize('Admin'), approveTeacher);
router.delete('/reject-teacher/:id', protect, authorize('Admin'), rejectTeacher);

module.exports = router;
