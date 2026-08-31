const FlashcardSet = require('../models/FlashcardSet');
const Note = require('../models/Note');

// @desc    Get all flashcard sets for a specific note
// @route   GET /api/v1/flashcards/note/:noteId
// @access  Protected
const getFlashcardsByNote = async (req, res, next) => {
  try {
    const sets = await FlashcardSet.find({
      noteId: req.params.noteId,
      userId: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      count: sets.length,
      flashcardSets: sets,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Save a flashcard set
// @route   POST /api/v1/flashcards
// @access  Protected
const saveFlashcardSet = async (req, res, next) => {
  try {
    const { noteId, subjectId, title, cards, isAiGenerated } = req.body;

    if (!noteId || !subjectId || !title || !cards || !cards.length) {
      return res.status(400).json({
        status: 'fail',
        message: 'noteId, subjectId, title, and cards are required.',
      });
    }

    const set = await FlashcardSet.create({
      userId: req.user._id,
      noteId,
      subjectId,
      title,
      cards,
      isAiGenerated: isAiGenerated !== undefined ? isAiGenerated : true,
    });

    res.status(201).json({
      status: 'success',
      message: 'Flashcard set saved successfully.',
      flashcardSet: set,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a flashcard set
// @route   DELETE /api/v1/flashcards/:id
// @access  Protected
const deleteFlashcardSet = async (req, res, next) => {
  try {
    const set = await FlashcardSet.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!set) {
      return res.status(404).json({ status: 'fail', message: 'Flashcard set not found.' });
    }

    await set.deleteOne();

    res.status(200).json({
      status: 'success',
      message: 'Flashcard set deleted successfully.',
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getFlashcardsByNote, saveFlashcardSet, deleteFlashcardSet };
