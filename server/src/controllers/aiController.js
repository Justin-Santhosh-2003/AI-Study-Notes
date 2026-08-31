const Note = require('../models/Note');
const FlashcardSet = require('../models/FlashcardSet');
const Quiz = require('../models/Quiz');
const geminiService = require('../services/geminiService');

// @desc    Generate an AI summary for a note and save it
// @route   POST /api/v1/ai/summarize
// @access  Protected
const summarizeNote = async (req, res, next) => {
  try {
    const { noteId } = req.body;

    if (!noteId) {
      return res.status(400).json({ status: 'fail', message: 'noteId is required.' });
    }

    const note = await Note.findOne({ _id: noteId, userId: req.user._id });
    if (!note) {
      return res.status(404).json({ status: 'fail', message: 'Note not found.' });
    }

    const result = await geminiService.generateSummary(note.content);

    // Save summary back to the note
    note.summary = result.summary;
    await note.save();

    res.status(200).json({
      status: 'success',
      message: 'Summary generated successfully.',
      summary: result.summary,
      keyConcepts: result.keyConcepts,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Generate AI flashcards for a note and save the set
// @route   POST /api/v1/ai/generate-flashcards
// @access  Protected
const generateFlashcards = async (req, res, next) => {
  try {
    const { noteId } = req.body;

    if (!noteId) {
      return res.status(400).json({ status: 'fail', message: 'noteId is required.' });
    }

    const note = await Note.findOne({ _id: noteId, userId: req.user._id });
    if (!note) {
      return res.status(404).json({ status: 'fail', message: 'Note not found.' });
    }

    const result = await geminiService.generateFlashcards(note.content, note.title);

    const flashcardSet = await FlashcardSet.create({
      userId: req.user._id,
      noteId: note._id,
      subjectId: note.subjectId,
      title: result.title,
      cards: result.cards,
      isAiGenerated: true,
    });

    res.status(201).json({
      status: 'success',
      message: 'Flashcards generated and saved successfully.',
      flashcardSet,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Generate an AI quiz for a note and save it
// @route   POST /api/v1/ai/generate-quiz
// @access  Protected
const generateQuiz = async (req, res, next) => {
  try {
    const { noteId } = req.body;

    if (!noteId) {
      return res.status(400).json({ status: 'fail', message: 'noteId is required.' });
    }

    const note = await Note.findOne({ _id: noteId, userId: req.user._id });
    if (!note) {
      return res.status(404).json({ status: 'fail', message: 'Note not found.' });
    }

    const result = await geminiService.generateQuiz(note.content, note.title);

    const quiz = await Quiz.create({
      userId: req.user._id,
      noteId: note._id,
      subjectId: note.subjectId,
      title: result.title,
      questions: result.questions,
      isAiGenerated: true,
    });

    res.status(201).json({
      status: 'success',
      message: 'Quiz generated and saved successfully.',
      quiz,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { summarizeNote, generateFlashcards, generateQuiz };
