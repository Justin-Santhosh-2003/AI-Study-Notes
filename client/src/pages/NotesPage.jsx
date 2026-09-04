import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MDEditor from '@uiw/react-md-editor';
import { getAllNotes, createNote, deleteNote } from '../services/noteService';
import { getAllSubjects } from '../services/subjectService';
import { summarizeNote, generateFlashcards, generateQuiz } from '../services/aiService';
import { FileText, Plus, Trash2, X, Loader2, Brain, Sparkles, ArrowRight, Search } from 'lucide-react';

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [aiLoading, setAiLoading] = useState('');
  const [aiResult, setAiResult] = useState(null);
  const [form, setForm] = useState({ subjectId: '', title: '', content: '', tags: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [notesRes, subjectsRes] = await Promise.all([
        getAllNotes(selectedSubject || undefined),
        getAllSubjects(),
      ]);
      setNotes(notesRes.data.notes);
      setSubjects(subjectsRes.data.subjects);
    } catch {
      setError('Failed to load notes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [selectedSubject]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createNote({
        ...form,
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      });
      setShowCreate(false);
      setForm({ subjectId: '', title: '', content: '', tags: '' });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create note.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this note and all its flashcards and quizzes?')) return;
    try {
      await deleteNote(id);
      setNotes((prev) => prev.filter((n) => n._id !== id));
      if (selectedNote?._id === id) setSelectedNote(null);
    } catch {
      alert('Failed to delete note.');
    }
  };

  const handleAI = async (action) => {
    if (!selectedNote) return;
    setAiLoading(action);
    setAiResult(null);
    try {
      let res;
      if (action === 'summarize') res = await summarizeNote(selectedNote._id);
      else if (action === 'flashcards') res = await generateFlashcards(selectedNote._id);
      else if (action === 'quiz') res = await generateQuiz(selectedNote._id);
      setAiResult({ type: action, data: res.data });
    } catch (err) {
      setAiResult({ type: 'error', data: err.response?.data?.message || 'AI generation failed.' });
    } finally {
      setAiLoading('');
    }
  };

  const filteredNotes = notes.filter((n) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    const titleMatch = n.title?.toLowerCase().includes(q);
    const contentMatch = n.content?.toLowerCase().includes(q);
    const tagsMatch = n.tags?.some((t) => t.toLowerCase().includes(q));
    const subjectMatch = n.subjectId?.name?.toLowerCase().includes(q);
    return titleMatch || contentMatch || tagsMatch || subjectMatch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Study Notes</h1>
          <p className="text-gray-400 text-sm mt-0.5">
            {filteredNotes.length} of {notes.length} note{notes.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-3">
          {/* Search Bar */}
          <div className="relative w-48 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notes, tags..."
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-[#0f172a] border border-white/15 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500 transition shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-gray-400 hover:text-white transition"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-[#0f172a] border border-white/15 text-white text-sm focus:outline-none focus:border-blue-500 shadow-sm transition cursor-pointer"
          >
            <option value="" className="bg-[#0f172a] text-white">All Subjects</option>
            {subjects.map((s) => (
              <option key={s._id} value={s._id} className="bg-[#0f172a] text-white">
                {s.name} ({s.code})
              </option>
            ))}
          </select>

          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl gradient-btn text-white text-sm font-semibold shadow-md shadow-blue-500/20"
          >
            <Plus className="w-4 h-4" /> New Note
          </button>
        </div>
      </div>

      {error && <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notes List */}
        <div className="lg:col-span-1 space-y-3">
          {loading ? (
            <div className="flex justify-center py-16"><Loader2 className="w-7 h-7 text-blue-400 animate-spin" /></div>
          ) : filteredNotes.length === 0 ? (
            <div className="text-center py-16 glass-panel rounded-2xl p-6">
              <FileText className="w-10 h-10 text-gray-600 mx-auto mb-3" />
              {searchQuery ? (
                <div>
                  <p className="text-gray-300 text-sm font-medium">No notes match "{searchQuery}"</p>
                  <p className="text-gray-500 text-xs mt-1">Try another keyword or search by tags.</p>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="mt-3 text-xs text-blue-400 hover:text-blue-300 font-semibold"
                  >
                    Clear Search
                  </button>
                </div>
              ) : (
                <p className="text-gray-400 text-sm">No notes yet. Create one to get started.</p>
              )}
            </div>
          ) : (
            filteredNotes.map((note) => (
              <div
                key={note._id}
                onClick={() => { setSelectedNote(note); setAiResult(null); }}
                className={`glass-panel rounded-xl p-4 cursor-pointer group transition-all ${selectedNote?._id === note._id ? 'border-blue-500/50 bg-blue-500/5' : 'hover:bg-white/5'}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-white text-sm truncate">{note.title}</h3>
                    {note.subjectId && (
                      <span className="text-xs text-blue-400">{note.subjectId.name}</span>
                    )}
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {note.tags?.map((tag) => (
                        <span key={tag} className="text-xs px-1.5 py-0.5 rounded bg-white/5 text-gray-400">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(note._id); }}
                    className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition flex-shrink-0 mt-0.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Note Viewer + AI Panel */}
        <div className="lg:col-span-2 space-y-4">
          {selectedNote ? (
            <>
              <div className="glass-panel rounded-xl p-5">
                <h2 className="text-xl font-bold text-white mb-1">{selectedNote.title}</h2>
                <span className="text-xs text-blue-400">{selectedNote.subjectId?.name}</span>
                <div className="mt-4 prose prose-invert max-w-none" data-color-mode="dark">
                  <MDEditor.Markdown source={selectedNote.content} />
                </div>
              </div>

              {/* AI Actions */}
              <div className="glass-panel rounded-xl p-5">
                <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                  <Brain className="w-4 h-4 text-purple-400" /> AI Actions
                </h3>
                <div className="flex flex-wrap gap-2">
                  {['summarize', 'flashcards', 'quiz'].map((action) => (
                    <button
                      key={action}
                      onClick={() => handleAI(action)}
                      disabled={!!aiLoading}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600/20 border border-purple-500/30 text-purple-300 text-sm hover:bg-purple-600/30 disabled:opacity-50 transition capitalize"
                    >
                      {aiLoading === action ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                      {aiLoading === action ? 'Generating...' : `Generate ${action}`}
                    </button>
                  ))}
                </div>

                {/* AI Result Display */}
                {aiResult && (
                  <div className="mt-4 p-4 rounded-lg bg-white/5 border border-white/10">
                    {aiResult.type === 'error' ? (
                      <p className="text-red-400 text-sm">{aiResult.data}</p>
                    ) : aiResult.type === 'summarize' ? (
                      <div className="space-y-3">
                        <p className="text-gray-200 text-sm leading-relaxed">{aiResult.data.summary}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {aiResult.data.keyConcepts?.map((c) => (
                            <span key={c} className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">{c}</span>
                          ))}
                        </div>
                      </div>
                    ) : aiResult.type === 'flashcards' ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-gray-400">{aiResult.data.flashcardSet?.cards?.length} flashcards generated & saved</p>
                          <Link
                            to="/flashcards"
                            className="inline-flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 font-semibold"
                          >
                            Open in Flashcards Player <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                        {aiResult.data.flashcardSet?.cards?.slice(0, 3).map((card, i) => (
                          <div key={i} className="p-2 rounded bg-white/5 text-sm">
                            <p className="text-blue-300 font-medium">{card.front}</p>
                            <p className="text-gray-400 mt-1">{card.back}</p>
                          </div>
                        ))}
                        {(aiResult.data.flashcardSet?.cards?.length || 0) > 3 && (
                          <p className="text-xs text-gray-500">+ {aiResult.data.flashcardSet.cards.length - 3} more saved</p>
                        )}
                      </div>
                    ) : aiResult.type === 'quiz' ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-gray-400">{aiResult.data.quiz?.questions?.length} questions generated & saved</p>
                          <Link
                            to="/quiz"
                            className="inline-flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 font-semibold"
                          >
                            Take Quiz Now <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                        <p className="text-sm text-gray-300 font-medium">{aiResult.data.quiz?.title}</p>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="glass-panel rounded-xl p-10 flex flex-col items-center justify-center text-center h-64">
              <FileText className="w-10 h-10 text-gray-600 mb-3" />
              <p className="text-gray-400">Select a note from the list to view it and use AI features</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Note Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-center z-50 p-4 overflow-y-auto">
          <div className="glass-panel rounded-2xl p-6 w-full max-w-2xl my-8">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-white">Create New Note</h2>
              <button onClick={() => setShowCreate(false)} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <select
                required value={form.subjectId}
                onChange={(e) => setForm({ ...form, subjectId: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#0f172a] border border-white/15 text-white focus:outline-none focus:border-blue-500 transition cursor-pointer"
              >
                <option value="" className="bg-[#0f172a] text-white">Select Subject *</option>
                {subjects.map((s) => (
                  <option key={s._id} value={s._id} className="bg-[#0f172a] text-white">
                    {s.name} ({s.code})
                  </option>
                ))}
              </select>
              <input
                type="text" placeholder="Note Title *" required
                value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
              />
              <input
                type="text" placeholder="Tags (comma separated, e.g. biology, cells)"
                value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
              />
              <div data-color-mode="dark">
                <MDEditor
                  value={form.content}
                  onChange={(val) => setForm({ ...form, content: val || '' })}
                  height={300}
                  preview="edit"
                />
              </div>
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <button type="submit" disabled={saving || !form.content}
                className="w-full py-2.5 rounded-lg gradient-btn text-white font-semibold disabled:opacity-50 transition">
                {saving ? 'Saving...' : 'Save Note'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
