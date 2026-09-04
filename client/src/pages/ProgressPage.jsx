import React, { useEffect, useState } from 'react';
import { getProgressStats, getQuizHistory } from '../services/progressService';
import {
  BarChart2,
  FileText,
  FolderOpen,
  HelpCircle,
  TrendingUp,
  Award,
  Clock,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Loader2,
  Layers,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProgressPage() {
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProgressData = async () => {
    setLoading(true);
    try {
      const [statsRes, historyRes] = await Promise.all([
        getProgressStats(),
        getQuizHistory(),
      ]);
      setStats(statsRes.data.stats || null);
      setHistory(historyRes.data.attempts || []);
    } catch (err) {
      console.error('Failed to load progress analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgressData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-blue-400 animate-spin mb-3" />
        <p className="text-gray-400 text-sm">Aggregating your learning analytics...</p>
      </div>
    );
  }

  const avgScore = stats?.avgPercentage ?? 0;
  const totalQuizzes = stats?.totalQuizzesTaken ?? 0;
  const passedQuizzes = history.filter((a) => a.percentage >= 60).length;
  const passRate = totalQuizzes > 0 ? Math.round((passedQuizzes / totalQuizzes) * 100) : 0;

  // Grade classification
  let performanceTier = 'Getting Started';
  let tierColor = 'text-blue-400 border-blue-500/30 bg-blue-500/10';
  if (totalQuizzes > 0) {
    if (avgScore >= 85) {
      performanceTier = 'Master Learner 🏆';
      tierColor = 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    } else if (avgScore >= 70) {
      performanceTier = 'Proficient 🚀';
      tierColor = 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10';
    } else {
      performanceTier = 'Developing 💡';
      tierColor = 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white flex items-center gap-3">
            <span className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <BarChart2 className="w-6 h-6" />
            </span>
            Learning Progress & Analytics
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Track quiz attempts, subject coverage, and knowledge retention over time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/quiz"
            className="flex items-center gap-2 px-4 py-2 rounded-xl gradient-btn text-white text-sm font-semibold shadow-md shadow-blue-500/20"
          >
            <HelpCircle className="w-4 h-4" /> Take a Quiz
          </Link>
          <Link
            to="/flashcards"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 text-sm font-medium transition"
          >
            <BookOpen className="w-4 h-4 text-violet-400" /> Study Flashcards
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            icon: FileText,
            label: 'Total Notes',
            value: stats?.totalNotes ?? 0,
            sub: 'Notes written',
            color: 'from-blue-600 to-cyan-600',
          },
          {
            icon: FolderOpen,
            label: 'Subjects Studied',
            value: stats?.subjectsStudied ?? 0,
            sub: 'Active subjects',
            color: 'from-indigo-600 to-blue-600',
          },
          {
            icon: HelpCircle,
            label: 'Quizzes Taken',
            value: totalQuizzes,
            sub: `${passedQuizzes} passed`,
            color: 'from-violet-600 to-purple-600',
          },
          {
            icon: TrendingUp,
            label: 'Average Score',
            value: `${avgScore}%`,
            sub: `${passRate}% pass rate`,
            color: 'from-purple-600 to-pink-600',
          },
        ].map(({ icon: Icon, label, value, sub, color }) => (
          <div key={label} className="glass-panel rounded-2xl p-5 relative overflow-hidden group">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {label}
              </span>
              <div className={`p-2.5 rounded-xl bg-gradient-to-tr ${color} text-white shadow-md`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-white">{value}</p>
            <p className="text-xs text-gray-400 mt-1">{sub}</p>
          </div>
        ))}
      </div>

      {/* Performance Summary Banner */}
      <div className="glass-panel rounded-2xl p-6 border border-white/10 bg-gradient-to-r from-blue-950/40 via-purple-950/30 to-indigo-950/40 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-yellow-400">
            <Award className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white">Proficiency Rating</h3>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${tierColor}`}>
                {performanceTier}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1 max-w-lg">
              {totalQuizzes > 0
                ? `You've answered ${history.reduce((sum, h) => sum + h.score, 0)} questions correctly out of ${history.reduce((sum, h) => sum + h.totalQuestions, 0)} total attempted.`
                : 'Take your first AI-generated quiz to establish your baseline learning rating.'}
            </p>
          </div>
        </div>

        {totalQuizzes > 0 && (
          <div className="w-full md:w-64 space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>Overall Accuracy</span>
              <span className="text-white font-bold">{avgScore}%</span>
            </div>
            <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden p-0.5">
              <div
                className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${avgScore}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Quiz Attempt History Table */}
      <div className="glass-panel rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-400" /> Recent Quiz Attempts
          </h2>
          <span className="text-xs text-gray-400">{history.length} attempts recorded</span>
        </div>

        {history.length === 0 ? (
          <div className="p-10 text-center text-gray-400 space-y-3">
            <HelpCircle className="w-10 h-10 text-gray-600 mx-auto" />
            <p className="text-sm">No quiz attempts yet.</p>
            <Link
              to="/quiz"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl gradient-btn text-white text-xs font-semibold"
            >
              Take your first quiz <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase text-gray-400">
                  <th className="py-3 px-4">Quiz Title</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Date Completed</th>
                  <th className="py-3 px-4">Score</th>
                  <th className="py-3 px-4">Percentage</th>
                  <th className="py-3 px-4 text-right">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {history.map((attempt) => {
                  const isPassed = attempt.percentage >= 60;
                  const dateFormatted = attempt.createdAt
                    ? new Date(attempt.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : 'Recent';

                  return (
                    <tr key={attempt._id} className="hover:bg-white/5 transition">
                      <td className="py-3.5 px-4 font-medium text-white">
                        {attempt.quizId?.title || 'Quiz Attempt'}
                      </td>
                      <td className="py-3.5 px-4">
                        {attempt.quizId?.subjectId ? (
                          <span
                            className="text-xs px-2.5 py-0.5 rounded-full font-medium border"
                            style={{
                              backgroundColor: `${attempt.quizId.subjectId.color || '#3b82f6'}15`,
                              borderColor: `${attempt.quizId.subjectId.color || '#3b82f6'}30`,
                              color: attempt.quizId.subjectId.color || '#60a5fa',
                            }}
                          >
                            {attempt.quizId.subjectId.name}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-500">—</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-gray-400 flex items-center gap-1.5 mt-2">
                        <Calendar className="w-3.5 h-3.5 text-gray-500" />
                        {dateFormatted}
                      </td>
                      <td className="py-3.5 px-4 text-gray-300">
                        {attempt.score} / {attempt.totalQuestions}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-white">{attempt.percentage}%</span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {isPassed ? (
                          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                            <CheckCircle2 className="w-3 h-3" /> Passed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium">
                            <AlertTriangle className="w-3 h-3" /> Retake
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
