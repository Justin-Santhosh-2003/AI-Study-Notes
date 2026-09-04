import React, { useEffect, useState } from 'react';
import { getAllQuizzes, getQuizById } from '../services/quizService';
import { submitQuizAttempt } from '../services/progressService';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  RotateCw,
  Award,
  Sparkles,
  BarChart2,
  Loader2,
  Layers,
  AlertCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function QuizPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { [questionIndex]: selectedOptionIndex }
  const [submitting, setSubmitting] = useState(false);
  const [quizResult, setQuizResult] = useState(null); // { score, totalQuestions, percentage, attemptId }
  const [quizFullData, setQuizFullData] = useState(null); // includes correctIndex & explanations for review

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const res = await getAllQuizzes();
      setQuizzes(res.data.quizzes || []);
    } catch (err) {
      console.error('Failed to load quizzes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const startQuiz = async (quizSummary) => {
    setLoading(true);
    try {
      const res = await getQuizById(quizSummary._id);
      const fullQuiz = res.data.quiz;
      setActiveQuiz(fullQuiz);
      setQuizFullData(fullQuiz);
      setCurrentQuestionIndex(0);
      setUserAnswers({});
      setQuizResult(null);
    } catch (err) {
      alert('Failed to load quiz details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (optionIndex) => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: optionIndex,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < (activeQuiz?.questions?.length || 0) - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    const totalQ = activeQuiz?.questions?.length || 0;
    const answeredCount = Object.keys(userAnswers).length;

    if (answeredCount < totalQ) {
      const proceed = window.confirm(
        `You have answered ${answeredCount} of ${totalQ} questions. Do you want to submit anyway?`
      );
      if (!proceed) return;
    }

    setSubmitting(true);
    try {
      const answersPayload = activeQuiz.questions.map((_, idx) => ({
        questionIndex: idx,
        selectedOption: userAnswers[idx] !== undefined ? userAnswers[idx] : -1,
      }));

      const res = await submitQuizAttempt({
        quizId: activeQuiz._id,
        answers: answersPayload,
      });

      setQuizResult(res.data.result);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit quiz attempt.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setQuizResult(null);
  };

  const handleExitQuiz = () => {
    setActiveQuiz(null);
    setQuizResult(null);
    setQuizFullData(null);
    setUserAnswers({});
    fetchQuizzes();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-purple-400 animate-spin mb-3" />
        <p className="text-gray-400 text-sm">Loading quiz data...</p>
      </div>
    );
  }

  // Active Quiz View (Taking test or reviewing result)
  if (activeQuiz) {
    const questions = activeQuiz.questions || [];
    const currentQ = questions[currentQuestionIndex];
    const totalQuestions = questions.length;
    const answeredCount = Object.keys(userAnswers).length;
    const progressPercent = Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100);

    // Results Screen
    if (quizResult) {
      const isPassed = quizResult.percentage >= 60;
      return (
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Result Card */}
          <div className="glass-panel rounded-2xl p-8 text-center space-y-6">
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto text-3xl font-bold border-2 ${
                isPassed
                  ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                  : 'bg-amber-500/10 border-amber-500 text-amber-400'
              }`}
            >
              <Award className="w-10 h-10" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white">
                {isPassed ? 'Outstanding Job! 🎉' : 'Keep Practicing! 💪'}
              </h2>
              <p className="text-gray-400 text-sm mt-1">Quiz Completed: {activeQuiz.title}</p>
            </div>

            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
              <div className="glass-panel rounded-xl p-4">
                <p className="text-2xl font-bold text-white">{quizResult.score}</p>
                <p className="text-xs text-gray-400">Correct Answers</p>
              </div>
              <div className="glass-panel rounded-xl p-4">
                <p className="text-2xl font-bold text-white">{quizResult.totalQuestions}</p>
                <p className="text-xs text-gray-400">Total Questions</p>
              </div>
              <div className="glass-panel rounded-xl p-4">
                <p
                  className={`text-2xl font-bold ${
                    isPassed ? 'text-emerald-400' : 'text-amber-400'
                  }`}
                >
                  {quizResult.percentage}%
                </p>
                <p className="text-xs text-gray-400">Score</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={handleRestartQuiz}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-btn text-white text-sm font-semibold"
              >
                <RotateCw className="w-4 h-4" /> Retake Quiz
              </button>
              <Link
                to="/progress"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-300 hover:bg-purple-600/30 text-sm font-semibold transition"
              >
                <BarChart2 className="w-4 h-4" /> View Analytics
              </Link>
              <button
                onClick={handleExitQuiz}
                className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 text-sm font-medium transition"
              >
                Back to Quizzes
              </button>
            </div>
          </div>

          {/* Detailed Question Review */}
          <div className="glass-panel rounded-2xl p-6 space-y-6">
            <h3 className="text-lg font-bold text-white border-b border-white/10 pb-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Detailed Question Review
            </h3>

            <div className="space-y-6">
              {quizFullData?.questions?.map((q, qIdx) => {
                const selectedOpt = userAnswers[qIdx];
                const isCorrect = selectedOpt === q.correctIndex;

                return (
                  <div
                    key={qIdx}
                    className={`p-5 rounded-xl border transition ${
                      isCorrect
                        ? 'border-emerald-500/30 bg-emerald-500/5'
                        : 'border-red-500/30 bg-red-500/5'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <p className="font-semibold text-white text-sm">
                        <span className="text-gray-400 mr-2">Q{qIdx + 1}.</span> {q.question}
                      </p>
                      {isCorrect ? (
                        <span className="flex items-center gap-1 text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 flex-shrink-0">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs text-red-400 font-semibold bg-red-500/10 px-2.5 py-1 rounded-full border border-red-500/20 flex-shrink-0">
                          <XCircle className="w-3.5 h-3.5" /> Incorrect
                        </span>
                      )}
                    </div>

                    {/* Options list */}
                    <div className="space-y-2 mt-3">
                      {q.options.map((opt, optIdx) => {
                        const isUserSelected = selectedOpt === optIdx;
                        const isActualCorrect = q.correctIndex === optIdx;

                        let optStyle = 'bg-white/5 border-white/10 text-gray-300';
                        if (isActualCorrect) {
                          optStyle = 'bg-emerald-500/20 border-emerald-500/40 text-emerald-200 font-medium';
                        } else if (isUserSelected && !isCorrect) {
                          optStyle = 'bg-red-500/20 border-red-500/40 text-red-200 line-through';
                        }

                        return (
                          <div
                            key={optIdx}
                            className={`p-3 rounded-lg border text-xs flex items-center justify-between ${optStyle}`}
                          >
                            <span>
                              <strong className="mr-2">{String.fromCharCode(65 + optIdx)}.</strong> {opt}
                            </span>
                            {isActualCorrect && (
                              <span className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider">
                                Correct Answer
                              </span>
                            )}
                            {isUserSelected && !isActualCorrect && (
                              <span className="text-[10px] text-red-300 font-bold uppercase tracking-wider">
                                Your Choice
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation */}
                    {q.explanation && (
                      <div className="mt-3 p-3 rounded-lg bg-white/5 text-xs text-gray-300 flex items-start gap-2 border border-white/5">
                        <Sparkles className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-purple-300">Explanation:</strong> {q.explanation}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    // Question Stepper Test Runner
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header Bar */}
        <div className="glass-panel rounded-xl px-5 py-4 flex items-center justify-between flex-wrap gap-4">
          <div>
            <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">
              Taking Quiz
            </span>
            <h2 className="text-lg font-bold text-white">{activeQuiz.title}</h2>
          </div>

          <button
            onClick={handleExitQuiz}
            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-gray-300 transition"
          >
            Exit Quiz
          </button>
        </div>

        {/* Progress Bar & Question Tracker */}
        <div className="glass-panel rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>
              Question <strong className="text-white">{currentQuestionIndex + 1}</strong> of {totalQuestions}
            </span>
            <span>
              Answered: <strong className="text-purple-400">{answeredCount}</strong> / {totalQuestions}
            </span>
          </div>

          <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Quick Question Pills */}
          <div className="flex flex-wrap gap-2 pt-1">
            {questions.map((_, idx) => {
              const isAnswered = userAnswers[idx] !== undefined;
              const isCurrent = currentQuestionIndex === idx;

              let pillStyle = 'bg-white/5 text-gray-400 border-white/10';
              if (isCurrent) {
                pillStyle = 'bg-purple-600 text-white border-purple-500 font-bold';
              } else if (isAnswered) {
                pillStyle = 'bg-purple-500/20 text-purple-300 border-purple-500/40';
              }

              return (
                <button
                  key={idx}
                  onClick={() => setCurrentQuestionIndex(idx)}
                  className={`w-8 h-8 rounded-lg text-xs border transition ${pillStyle}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* Current Question Card */}
        <div className="glass-panel rounded-2xl p-6 md:p-8 space-y-6 border border-purple-500/20">
          <div>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30 mb-3">
              Question {currentQuestionIndex + 1}
            </span>
            <h3 className="text-lg md:text-xl font-semibold text-white leading-relaxed">
              {currentQ?.question}
            </h3>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentQ?.options?.map((option, optIdx) => {
              const isSelected = userAnswers[currentQuestionIndex] === optIdx;

              return (
                <div
                  key={optIdx}
                  onClick={() => handleSelectOption(optIdx)}
                  className={`p-4 rounded-xl cursor-pointer border transition flex items-center gap-4 ${
                    isSelected
                      ? 'border-purple-500 bg-purple-500/20 shadow-lg shadow-purple-500/10'
                      : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition ${
                      isSelected
                        ? 'bg-purple-600 text-white'
                        : 'bg-white/10 text-gray-400'
                    }`}
                  >
                    {String.fromCharCode(65 + optIdx)}
                  </div>
                  <span className={`text-sm ${isSelected ? 'text-white font-medium' : 'text-gray-300'}`}>
                    {option}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <button
            onClick={handlePrev}
            disabled={currentQuestionIndex === 0}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none text-sm transition"
          >
            <ArrowLeft className="w-4 h-4" /> Previous
          </button>

          <div className="flex items-center gap-3">
            {currentQuestionIndex < totalQuestions - 1 ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-btn text-white text-sm font-semibold"
              >
                Next <ArrowRight className="w-4 h-4" />
              </button>
            ) : null}

            <button
              onClick={handleSubmitQuiz}
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition disabled:opacity-50 shadow-lg shadow-emerald-600/20"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" /> Submit Quiz
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz Catalog Screen
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white flex items-center gap-3">
            <span className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <HelpCircle className="w-6 h-6" />
            </span>
            AI-Powered Quizzes
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Test your knowledge with multiple-choice questions automatically crafted from your study notes.
          </p>
        </div>

        <Link
          to="/notes"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 text-sm transition"
        >
          <Sparkles className="w-4 h-4 text-purple-400" />
          Generate New Quiz from Notes
        </Link>
      </div>

      {quizzes.length === 0 ? (
        <div className="glass-panel rounded-2xl p-12 text-center max-w-xl mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mx-auto">
            <HelpCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white">No Quizzes Available Yet</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Generate your first interactive quiz in seconds! Go to your notes, open any study note, and click <strong>"Generate quiz"</strong>.
          </p>
          <Link
            to="/notes"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-btn text-white text-sm font-semibold mt-2"
          >
            Go to Notes Workspace <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <div
              key={quiz._id}
              className="glass-panel rounded-2xl p-6 flex flex-col justify-between group hover:border-purple-500/40 transition-all duration-300"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  {quiz.subjectId && (
                    <span
                      className="text-xs px-2.5 py-1 rounded-full font-medium border"
                      style={{
                        backgroundColor: `${quiz.subjectId.color || '#a855f7'}15`,
                        borderColor: `${quiz.subjectId.color || '#a855f7'}40`,
                        color: quiz.subjectId.color || '#c084fc',
                      }}
                    >
                      {quiz.subjectId.name}
                    </span>
                  )}
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5" />
                    {quiz.questions?.length || 0} Questions
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition line-clamp-2">
                  {quiz.title}
                </h3>

                {quiz.noteId && (
                  <p className="text-xs text-gray-400 line-clamp-1">
                    Based on note: <span className="text-gray-300">{quiz.noteId.title}</span>
                  </p>
                )}
              </div>

              <div className="pt-6 border-t border-white/5 mt-4">
                <button
                  onClick={() => startQuiz(quiz)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl gradient-btn text-white text-sm font-semibold shadow-md shadow-purple-600/20"
                >
                  Start Quiz <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
