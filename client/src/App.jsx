import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, NavLink, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import SubjectsPage from './pages/SubjectsPage';
import NotesPage from './pages/NotesPage';
import FlashcardsPage from './pages/FlashcardsPage';
import QuizPage from './pages/QuizPage';
import ProgressPage from './pages/ProgressPage';
import {
  BookOpen,
  FolderOpen,
  FileText,
  Layers,
  HelpCircle,
  BarChart2,
  LogOut,
  Menu,
  X,
  User as UserIcon,
  Sparkles,
} from 'lucide-react';

const navLinks = [
  { to: '/', label: 'Dashboard', icon: BarChart2, exact: true },
  { to: '/subjects', label: 'Subjects', icon: FolderOpen },
  { to: '/notes', label: 'Study Notes', icon: FileText },
  { to: '/flashcards', label: 'Flashcards', icon: Layers },
  { to: '/quiz', label: 'Quizzes', icon: HelpCircle },
  { to: '/progress', label: 'Progress & Stats', icon: BookOpen },
];

function Sidebar({ mobileOpen, setMobileOpen }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleNavClick = () => {
    if (setMobileOpen) setMobileOpen(false);
  };

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  const roleColors = {
    Admin: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    Teacher: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    Student: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  };

  return (
    <aside
      className={`fixed md:sticky top-0 left-0 z-50 h-screen w-64 glass-panel border-r border-white/10 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}
    >
      {/* Top Header / Branding */}
      <div>
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <Link to="/" onClick={handleNavClick} className="flex items-center gap-2.5 group">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-base text-white block leading-tight tracking-tight">
                AI Study Notes
              </span>
              <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                Smart Workspace
              </span>
            </div>
          </Link>

          {/* Mobile Close Button */}
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Section */}
        <div className="px-3 py-6 space-y-1">
          <p className="px-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Navigation
          </p>

          {navLinks.map(({ to, label, icon: Icon, exact }) => {
            const isActive = exact ? location.pathname === to : location.pathname.startsWith(to);

            return (
              <NavLink
                key={to}
                to={to}
                end={exact}
                onClick={handleNavClick}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-blue-600/15 text-blue-400 border-l-4 border-blue-500 shadow-sm shadow-blue-500/10 font-semibold'
                    : 'text-gray-400 hover:text-white hover:bg-white/5 border-l-4 border-transparent'
                }`}
              >
                <Icon
                  className={`w-4 h-4 transition ${
                    isActive ? 'text-blue-400' : 'text-gray-400 group-hover:text-white'
                  }`}
                />
                <span>{label}</span>
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* User Profile & Logout Bottom Bar */}
      <div className="p-4 border-t border-white/10 bg-black/20">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-md flex-shrink-0">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-white truncate leading-tight">{user?.name}</p>
            <span
              className={`inline-block text-[10px] px-2 py-0.5 rounded-full font-medium border mt-0.5 ${
                roleColors[user?.role] || 'bg-gray-500/10 text-gray-400 border-gray-500/20'
              }`}
            >
              {user?.role}
            </span>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 border border-white/5 transition"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0b0f17] text-gray-100 flex items-center justify-center p-4">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f17] text-gray-100 flex flex-col md:flex-row">
      {/* Mobile Header Bar */}
      <div className="md:hidden sticky top-0 z-40 glass-panel border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-sm text-white">
          <div className="p-1.5 rounded-lg bg-gradient-to-tr from-blue-600 to-purple-600 text-white">
            <Sparkles className="w-4 h-4" />
          </div>
          <span>AI Study Notes</span>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Backdrop for mobile drawer */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden transition-opacity"
        />
      )}

      {/* Left Vertical Sidebar */}
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 md:p-8 max-w-7xl w-full mx-auto overflow-x-hidden">
        <Routes>
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/subjects" element={<ProtectedRoute><SubjectsPage /></ProtectedRoute>} />
          <Route path="/notes" element={<ProtectedRoute><NotesPage /></ProtectedRoute>} />
          <Route path="/flashcards" element={<ProtectedRoute><FlashcardsPage /></ProtectedRoute>} />
          <Route path="/quiz" element={<ProtectedRoute><QuizPage /></ProtectedRoute>} />
          <Route path="/progress" element={<ProtectedRoute><ProgressPage /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}
