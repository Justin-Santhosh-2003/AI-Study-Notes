const Quiz = require('../models/Quiz');

// @desc    Get all quizzes for a specific note
// @route   GET /api/v1/quizzes/note/:noteId
// @access  Protected
const getQuizzesByNote = async (req, res, next) => {
  try {
    const quizzes = await Quiz.find({
      noteId: req.params.noteId,
      userId: req.user._id,
    }).select('-questions.correctIndex').sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      count: quizzes.length,
      quizzes,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Save a quiz
// @route   POST /api/v1/quizzes
// @access  Protected
const saveQuiz = async (req, res, next) => {
  try {
    const { noteId, subjectId, title, questions, isAiGenerated } = req.body;

    if (!noteId || !subjectId || !title || !questions || !questions.length) {
      return res.status(400).json({
        status: 'fail',
        message: 'noteId, subjectId, title, and questions are required.',
      });
    }

    const quiz = await Quiz.create({
      userId: req.user._id,
      noteId,
      subjectId,
      title,
      questions,
      isAiGenerated: isAiGenerated !== undefined ? isAiGenerated : true,
    });

    res.status(201).json({
      status: 'success',
      message: 'Quiz saved successfully.',
      quiz,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get a single quiz by ID (includes correct answers for grading)
// @route   GET /api/v1/quizzes/:id
// @access  Protected
const getQuizById = async (req, res, next) => {
  try {
    const quiz = await Quiz.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!quiz) {
      return res.status(404).json({ status: 'fail', message: 'Quiz not found.' });
    }

    res.status(200).json({ status: 'success', quiz });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all quizzes for the current user
// @route   GET /api/v1/quizzes
// @access  Protected
const getAllQuizzes = async (req, res, next) => {
  try {
    const quizzes = await Quiz.find({ userId: req.user._id })
      .populate('subjectId', 'name code color')
      .populate('noteId', 'title')
      .select('-questions.correctIndex')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      count: quizzes.length,
      quizzes,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllQuizzes, getQuizzesByNote, saveQuiz, getQuizById };
