import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signup } from '../services/authService';
import { BookOpen, User, Mail, Lock, UserCheck } from 'lucide-react';

export default function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'Student' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [teacherRegistered, setTeacherRegistered] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) {
      return setError('Password must be at least 6 characters.');
    }
    setLoading(true);
    try {
      const res = await signup(form);
      if (res.data.pendingApproval) {
        setTeacherRegistered(true);
      } else {
        login(res.data.user, res.data.token);
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Logo & Heading */}
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-blue-400 mb-3 shadow-inner">
            <BookOpen className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">AI Study Notes</h1>
          <p className="text-gray-400 text-sm mt-1">Create your study account</p>
        </div>

        {/* Card */}
        <div className="glass-panel rounded-2xl p-8">
          {teacherRegistered ? (
            <div className="text-center py-4 space-y-4">
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 w-fit mx-auto">
                <UserCheck className="w-8 h-8" />
              </div>
              <h2 className="text-lg font-bold text-white">Teacher Registration Submitted</h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                Your account request has been sent for review. Teacher accounts require <strong>Administrator approval</strong> before login is permitted.
              </p>
              <div className="pt-2">
                <Link
                  to="/login"
                  className="inline-block px-5 py-2.5 rounded-xl gradient-btn text-white text-sm font-semibold"
                >
                  Return to Sign In
                </Link>
              </div>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Justin Santhosh"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 6 characters"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Role</label>
              <div className="relative">
                <UserCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#0f172a] border border-white/15 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition appearance-none"
                >
                  <option value="Student" className="bg-[#0f172a] text-white">Student</option>
                  <option value="Teacher" className="bg-[#0f172a] text-white">Teacher</option>
                </select>
              </div>

              {form.role === 'Teacher' && (
                <p className="mt-2 text-xs text-amber-300/90 bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-lg">
                  Note: Teacher registrations require Administrator approval before sign-in.
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg gradient-btn text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Creating account...' : form.role === 'Teacher' ? 'Submit Teacher Registration' : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium transition">
              Sign in
            </Link>
          </p>
        </>
      )}
    </div>
  </div>
</div>
  );
}
