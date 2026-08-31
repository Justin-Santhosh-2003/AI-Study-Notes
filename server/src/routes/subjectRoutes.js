const express = require('express');
const router = express.Router();
const {
  getAllSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
} = require('../controllers/subjectController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.get('/', protect, getAllSubjects);
router.post('/', protect, authorize('Teacher', 'Admin'), createSubject);
router.put('/:id', protect, authorize('Teacher', 'Admin'), updateSubject);
router.delete('/:id', protect, authorize('Teacher', 'Admin'), deleteSubject);

module.exports = router;
