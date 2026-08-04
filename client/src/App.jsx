import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { BookOpen, FolderOpen, FileText, Layers, HelpCircle, BarChart2, UserCheck } from 'lucide-react';

function PlaceholderView({ title, description, icon: Icon }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
      <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 mb-4 text-blue-400">
        {Icon && <Icon className="w-12 h-12" />}
      </div>
      <h1 className="text-3xl font-bold mb-2 gradient-text">{title}</h1>
      <p className="text-gray-400 max-w-md mb-6">{description}</p>
      <div className="px-4 py-2 rounded-full glass-panel text-xs text-blue-300 border border-blue-500/30">
        Module Initialized • Ready for Feature Implementation
      </div>
    </div>
  );
}

function Navbar() {
  return (
    <nav className="glass-panel sticky top-0 z-50 px-6 py-4 border-b border-white/10">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <span className="p-2 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30">
            <BookOpen className="w-5 h-5" />
          </span>
          <span className="gradient-text">AI Study Notes</span>
        </Link>
        
        <div className="flex items-center gap-6 text-sm font-medium text-gray-300">
          <Link to="/" className="hover:text-blue-400 transition-colors">Dashboard</Link>
          <Link to="/subjects" className="hover:text-blue-400 transition-colors">Subjects</Link>
          <Link to="/notes" className="hover:text-blue-400 transition-colors">Notes</Link>
          <Link to="/flashcards" className="hover:text-blue-400 transition-colors">Flashcards</Link>
          <Link to="/quiz" className="hover:text-blue-400 transition-colors">Quiz</Link>
          <Link to="/progress" className="hover:text-blue-400 transition-colors">Progress</Link>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/login" className="px-4 py-2 text-sm rounded-lg glass-panel hover:bg-white/10 transition-colors">
            Login
          </Link>
          <Link to="/register" className="px-4 py-2 text-sm rounded-lg gradient-btn text-white font-medium">
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#0b0f17] text-gray-100 flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto p-6">
          <Routes>
            <Route path="/" element={<PlaceholderView title="Dashboard" description="Overview of your subjects, recent study notes, and quick AI actions." icon={BookOpen} />} />
            <Route path="/subjects" element={<PlaceholderView title="Subjects Management" description="Manage your academic subjects and course modules." icon={FolderOpen} />} />
            <Route path="/notes" element={<PlaceholderView title="Study Notes Workspace" description="Create and edit notes with Markdown support and AI summarization." icon={FileText} />} />
            <Route path="/flashcards" element={<PlaceholderView title="AI Flashcards" description="Review AI-generated flashcard decks with 3D flip card interactions." icon={Layers} />} />
            <Route path="/quiz" element={<PlaceholderView title="AI Quizzes" description="Test your knowledge with AI-generated multiple-choice quizzes." icon={HelpCircle} />} />
            <Route path="/progress" element={<PlaceholderView title="Learning Progress" description="Track your quiz scores, completion statistics, and subject mastery." icon={BarChart2} />} />
            <Route path="/login" element={<PlaceholderView title="User Login" description="Sign in with single JWT token authentication." icon={UserCheck} />} />
            <Route path="/register" element={<PlaceholderView title="User Registration" description="Register an account as a Student or Teacher." icon={UserCheck} />} />
          </Routes>
        </main>
        <footer className="py-6 border-t border-white/5 text-center text-xs text-gray-500">
          AI-Powered Study Notes Management System • MCA 1-Month Project Baseline
        </footer>
      </div>
    </Router>
  );
}
