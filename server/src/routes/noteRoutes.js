const express = require('express');
const router = express.Router();
const {
  getAllNotes,
  createNote,
  getNoteById,
  updateNote,
  deleteNote,
} = require('../controllers/noteController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/', protect, getAllNotes);
router.post('/', protect, createNote);
router.get('/:id', protect, getNoteById);
router.put('/:id', protect, updateNote);
router.delete('/:id', protect, deleteNote);

module.exports = router;
