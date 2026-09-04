const express = require('express');
const router = express.Router();
const {
  getAllFlashcardSets,
  getFlashcardsByNote,
  saveFlashcardSet,
  deleteFlashcardSet,
} = require('../controllers/flashcardController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/', protect, getAllFlashcardSets);
router.get('/note/:noteId', protect, getFlashcardsByNote);
router.post('/', protect, saveFlashcardSet);
router.delete('/:id', protect, deleteFlashcardSet);

module.exports = router;
