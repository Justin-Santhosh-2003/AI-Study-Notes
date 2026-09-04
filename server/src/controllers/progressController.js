const QuizAttempt = require('../models/QuizAttempt');
const Quiz = require('../models/Quiz');
const Note = require('../models/Note');

// @desc    Submit a quiz attempt and store the result
// @route   POST /api/v1/progress/submit-quiz
// @access  Protected
const submitQuizAttempt = async (req, res, next) => {
  try {
    const { quizId, answers } = req.body;

    if (!quizId || !answers || !Array.isArray(answers)) {
      return res.status(400).json({
        status: 'fail',
        message: 'quizId and answers array are required.',
      });
    }

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ status: 'fail', message: 'Quiz not found.' });
    }

    // Grade answers server-side
    let score = 0;
    const gradedAnswers = answers.map((answer) => {
      const question = quiz.questions[answer.questionIndex];
      const isCorrect = question && answer.selectedOption === question.correctIndex;
      if (isCorrect) score++;
      return {
        questionIndex: answer.questionIndex,
        selectedOption: answer.selectedOption,
        isCorrect,
      };
    });

    const totalQuestions = quiz.questions.length;
    const percentage = Math.round((score / totalQuestions) * 100);

    const attempt = await QuizAttempt.create({
      userId: req.user._id,
      quizId,
      score,
      totalQuestions,
      percentage,
      answers: gradedAnswers,
    });

    res.status(201).json({
      status: 'success',
      message: 'Quiz attempt submitted successfully.',
      result: {
        score,
        totalQuestions,
        percentage,
        attemptId: attempt._id,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get learning progress statistics for the logged-in user
// @route   GET /api/v1/progress/stats
// @access  Protected
const getProgressStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const totalNotes = await Note.countDocuments({ userId });

    const attempts = await QuizAttempt.find({ userId });
    const totalQuizzesTaken = attempts.length;
    const avgPercentage =
      totalQuizzesTaken > 0
        ? Math.round(
            attempts.reduce((sum, a) => sum + a.percentage, 0) / totalQuizzesTaken
          )
        : 0;

    // Find unique subjects studied via notes
    const userNotes = await Note.find({ userId }).select('subjectId');
    const subjectsStudied = [...new Set(userNotes.map((n) => n.subjectId.toString()))].length;

    res.status(200).json({
      status: 'success',
      stats: {
        totalNotes,
        totalQuizzesTaken,
        avgPercentage,
        subjectsStudied,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get quiz attempt history for the logged-in user
// @route   GET /api/v1/progress/history
// @access  Protected
const getQuizHistory = async (req, res, next) => {
  try {
    const attempts = await QuizAttempt.find({ userId: req.user._id })
      .populate({
        path: 'quizId',
        select: 'title subjectId',
        populate: { path: 'subjectId', select: 'name code color' },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      count: attempts.length,
      attempts,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { submitQuizAttempt, getProgressStats, getQuizHistory };
