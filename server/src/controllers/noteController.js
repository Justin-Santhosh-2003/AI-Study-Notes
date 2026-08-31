const Note = require('../models/Note');
const FlashcardSet = require('../models/FlashcardSet');
const Quiz = require('../models/Quiz');

// @desc    Get all notes for the logged-in user (optional ?subjectId= filter)
// @route   GET /api/v1/notes
// @access  Protected
const getAllNotes = async (req, res, next) => {
  try {
    const filter = { userId: req.user._id };
    if (req.query.subjectId) {
      filter.subjectId = req.query.subjectId;
    }

    const notes = await Note.find(filter)
      .populate('subjectId', 'name code color')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      count: notes.length,
      notes,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create a new note
// @route   POST /api/v1/notes
// @access  Protected
const createNote = async (req, res, next) => {
  try {
    const { subjectId, title, content, tags } = req.body;

    if (!subjectId || !title || !content) {
      return res.status(400).json({
        status: 'fail',
        message: 'subjectId, title, and content are required.',
      });
    }

    const note = await Note.create({
      userId: req.user._id,
      subjectId,
      title,
      content,
      tags: tags || [],
    });

    await note.populate('subjectId', 'name code color');

    res.status(201).json({
      status: 'success',
      message: 'Note created successfully.',
      note,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get a single note by ID
// @route   GET /api/v1/notes/:id
// @access  Protected
const getNoteById = async (req, res, next) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      userId: req.user._id,
    }).populate('subjectId', 'name code color');

    if (!note) {
      return res.status(404).json({ status: 'fail', message: 'Note not found.' });
    }

    res.status(200).json({ status: 'success', note });
  } catch (err) {
    next(err);
  }
};

// @desc    Update a note
// @route   PUT /api/v1/notes/:id
// @access  Protected
const updateNote = async (req, res, next) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, userId: req.user._id });

    if (!note) {
      return res.status(404).json({ status: 'fail', message: 'Note not found.' });
    }

    const { title, content, tags, summary } = req.body;

    note.title = title || note.title;
    note.content = content || note.content;
    note.tags = tags !== undefined ? tags : note.tags;
    note.summary = summary !== undefined ? summary : note.summary;

    await note.save();

    res.status(200).json({
      status: 'success',
      message: 'Note updated successfully.',
      note,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a note and cascade delete its flashcards and quizzes
// @route   DELETE /api/v1/notes/:id
// @access  Protected
const deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, userId: req.user._id });

    if (!note) {
      return res.status(404).json({ status: 'fail', message: 'Note not found.' });
    }

    // Cascade delete associated flashcard sets and quizzes
    await FlashcardSet.deleteMany({ noteId: note._id });
    await Quiz.deleteMany({ noteId: note._id });
    await note.deleteOne();

    res.status(200).json({
      status: 'success',
      message: 'Note and all associated flashcards and quizzes deleted successfully.',
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllNotes, createNote, getNoteById, updateNote, deleteNote };
