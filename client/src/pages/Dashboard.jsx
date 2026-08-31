import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProgressStats } from '../services/progressService';
import { BookOpen, FileText, Brain, BarChart2, FolderOpen, HelpCircle } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="glass-panel rounded-xl p-5 flex items-center gap-4">
    <div className={`p-3 rounded-xl ${color}`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div>
      <p className="text-2xl font-bold text-white">{value ?? '—'}</p>
      <p className="text-sm text-gray-400">{label}</p>
    </div>
  </div>
);

const QuickLink = ({ to, icon: Icon, label, description, color }) => (
  <Link to={to} className="glass-panel rounded-xl p-5 hover:bg-white/10 transition-all group">
    <div className={`p-2.5 rounded-lg w-fit ${color} mb-3`}>
      <Icon className="w-5 h-5 text-white" />
    </div>
    <h3 className="font-semibold text-white group-hover:text-blue-300 transition">{label}</h3>
    <p className="text-xs text-gray-400 mt-1">{description}</p>
  </Link>
);

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getProgressStats()
      .then((res) => setStats(res.data.stats))
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">
          Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]}</span> 👋
        </h1>
        <p className="text-gray-400 mt-1">
          Role: <span className="text-blue-400 font-medium">{user?.role}</span>
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={FileText} label="Total Notes" value={stats?.totalNotes} color="bg-blue-600" />
        <StatCard icon={FolderOpen} label="Subjects Studied" value={stats?.subjectsStudied} color="bg-indigo-600" />
        <StatCard icon={HelpCircle} label="Quizzes Taken" value={stats?.totalQuizzesTaken} color="bg-violet-600" />
        <StatCard icon={BarChart2} label="Avg. Score" value={stats ? `${stats.avgPercentage}%` : null} color="bg-purple-600" />
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="text-lg font-semibold text-gray-200 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <QuickLink to="/subjects" icon={FolderOpen} label="Subjects" description="Browse or manage subjects" color="bg-blue-600" />
          <QuickLink to="/notes" icon={FileText} label="Study Notes" description="Create and manage notes" color="bg-indigo-600" />
          <QuickLink to="/flashcards" icon={BookOpen} label="Flashcards" description="Review AI flashcard decks" color="bg-violet-600" />
          <QuickLink to="/quiz" icon={HelpCircle} label="Quizzes" description="Test your knowledge" color="bg-purple-600" />
          <QuickLink to="/progress" icon={BarChart2} label="Progress" description="Track your performance" color="bg-fuchsia-600" />
          <QuickLink to="/notes" icon={Brain} label="AI Generate" description="Generate summaries & quizzes" color="bg-pink-600" />
        </div>
      </div>
    </div>
  );
}
