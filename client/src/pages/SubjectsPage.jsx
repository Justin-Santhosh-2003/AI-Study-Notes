import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getAllSubjects,
  createSubject,
  deleteSubject,
} from '../services/subjectService';
import { FolderOpen, Plus, Trash2, X, Loader2 } from 'lucide-react';

const COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

export default function SubjectsPage() {
  const { role } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', code: '', description: '', color: '#3b82f6' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const canManage = role === 'Teacher' || role === 'Admin';

  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const res = await getAllSubjects();
      setSubjects(res.data.subjects);
    } catch {
      setError('Failed to load subjects.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSubjects(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createSubject(form);
      setShowModal(false);
      setForm({ name: '', code: '', description: '', color: '#3b82f6' });
      fetchSubjects();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create subject.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this subject?')) return;
    try {
      await deleteSubject(id);
      setSubjects((prev) => prev.filter((s) => s._id !== id));
    } catch {
      alert('Failed to delete subject.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Subjects</h1>
          <p className="text-gray-400 text-sm mt-0.5">{subjects.length} subject{subjects.length !== 1 ? 's' : ''} available</p>
        </div>
        {canManage && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg gradient-btn text-white text-sm font-medium"
          >
            <Plus className="w-4 h-4" /> Add Subject
          </button>
        )}
      </div>

      {error && <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>}

      {/* Subject Grid */}
      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 text-blue-400 animate-spin" /></div>
      ) : subjects.length === 0 ? (
        <div className="text-center py-16">
          <FolderOpen className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No subjects yet.{canManage ? ' Create one to get started.' : ''}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map((subject) => (
            <div key={subject._id} className="glass-panel rounded-xl p-5 group relative">
              <div className="flex items-start justify-between mb-3">
                <div className="w-3 h-3 rounded-full mt-1 flex-shrink-0" style={{ backgroundColor: subject.color }} />
                {canManage && (
                  <button
                    onClick={() => handleDelete(subject._id)}
                    className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <h3 className="font-semibold text-white text-lg leading-tight">{subject.name}</h3>
              <span className="inline-block mt-1 text-xs font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">
                {subject.code}
              </span>
              {subject.description && (
                <p className="text-gray-400 text-sm mt-2 line-clamp-2">{subject.description}</p>
              )}
              <p className="text-xs text-gray-500 mt-3">By {subject.createdBy?.name}</p>
            </div>
          ))}
        </div>
      )}

      {/* Create Subject Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-panel rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-white">Create Subject</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <input
                type="text" placeholder="Subject Name *" required
                value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
              />
              <input
                type="text" placeholder="Subject Code * (e.g. CS101)" required
                value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
              />
              <textarea
                placeholder="Description (optional)"
                value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={2}
                className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition resize-none"
              />
              <div>
                <p className="text-sm text-gray-400 mb-2">Color</p>
                <div className="flex gap-2 flex-wrap">
                  {COLORS.map((c) => (
                    <button key={c} type="button" onClick={() => setForm({ ...form, color: c })}
                      className="w-7 h-7 rounded-full border-2 transition"
                      style={{ backgroundColor: c, borderColor: form.color === c ? '#fff' : 'transparent' }}
                    />
                  ))}
                </div>
              </div>
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <button type="submit" disabled={saving}
                className="w-full py-2.5 rounded-lg gradient-btn text-white font-semibold disabled:opacity-50 transition">
                {saving ? 'Creating...' : 'Create Subject'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
