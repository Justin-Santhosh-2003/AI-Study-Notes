import React, { useEffect, useState, useCallback } from 'react';
import { getAllFlashcardSets, deleteFlashcardSet } from '../services/flashcardService';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Shuffle,
  Trash2,
  CheckCircle2,
  Sparkles,
  Layers,
  ArrowRight,
  Loader2,
  HelpCircle,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FlashcardsPage() {
  const [sets, setSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSet, setSelectedSet] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [cards, setCards] = useState([]);
  const [knownCards, setKnownCards] = useState(new Set());
  const [isCompleted, setIsCompleted] = useState(false);

  const fetchSets = async () => {
    setLoading(true);
    try {
      const res = await getAllFlashcardSets();
      const loadedSets = res.data.flashcardSets || [];
      setSets(loadedSets);
      if (loadedSets.length > 0 && !selectedSet) {
        selectDeck(loadedSets[0]);
      }
    } catch (err) {
      console.error('Failed to load flashcard sets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSets();
  }, []);

  const selectDeck = (deck) => {
    setSelectedSet(deck);
    setCards([...(deck.cards || [])]);
    setCurrentIndex(0);
    setIsFlipped(false);
    setKnownCards(new Set());
    setIsCompleted(false);
  };

  const handleFlip = () => {
    setIsFlipped((prev) => !prev);
  };

  const handleNext = useCallback(() => {
    if (currentIndex < cards.length - 1) {
      setIsFlipped(false);
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsCompleted(true);
    }
  }, [currentIndex, cards.length]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setIsCompleted(false);
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  const handleShuffle = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsCompleted(false);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsCompleted(false);
    setKnownCards(new Set());
  };

  const toggleKnown = (index) => {
    setKnownCards((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const handleDeleteSet = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this flashcard deck?')) return;
    try {
      await deleteFlashcardSet(id);
      const remaining = sets.filter((s) => s._id !== id);
      setSets(remaining);
      if (selectedSet?._id === id) {
        if (remaining.length > 0) {
          selectDeck(remaining[0]);
        } else {
          setSelectedSet(null);
          setCards([]);
        }
      }
    } catch {
      alert('Failed to delete flashcard deck.');
    }
  };

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedSet || cards.length === 0) return;
      if (e.code === 'Space') {
        e.preventDefault();
        handleFlip();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedSet, cards, handleNext, handlePrev]);

  const currentCard = cards[currentIndex];
  const progressPercent = cards.length > 0 ? Math.round(((currentIndex + 1) / cards.length) * 100) : 0;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-violet-400 animate-spin mb-3" />
        <p className="text-gray-400 text-sm">Loading your study decks...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white flex items-center gap-3">
            <span className="p-2 rounded-xl bg-violet-500/20 text-violet-400 border border-violet-500/30">
              <BookOpen className="w-6 h-6" />
            </span>
            Interactive Flashcards
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Master your concepts with active recall and 3D card flips.
          </p>
        </div>

        <Link
          to="/notes"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 text-sm transition"
        >
          <Sparkles className="w-4 h-4 text-violet-400" />
          Generate New Decks from Notes
        </Link>
      </div>

      {sets.length === 0 ? (
        <div className="glass-panel rounded-2xl p-12 text-center max-w-xl mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center mx-auto">
            <Layers className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white">No Flashcard Decks Yet</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Flashcards are generated automatically from your study notes using Google Gemini AI. Go to any study note and click <strong>"Generate flashcards"</strong>.
          </p>
          <Link
            to="/notes"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-btn text-white text-sm font-semibold mt-2"
          >
            Go to Notes Workspace <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Deck List Sidebar */}
          <div className="lg:col-span-1 space-y-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Decks ({sets.length})
              </h3>
            </div>

            <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-1">
              {sets.map((deck) => {
                const isSelected = selectedSet?._id === deck._id;
                return (
                  <div
                    key={deck._id}
                    onClick={() => selectDeck(deck)}
                    className={`glass-panel rounded-xl p-3.5 cursor-pointer transition group border ${
                      isSelected
                        ? 'border-violet-500/60 bg-violet-500/10'
                        : 'border-white/5 hover:border-white/20 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-white text-sm truncate">{deck.title}</p>
                        {deck.subjectId && (
                          <span
                            className="inline-block text-xs px-2 py-0.5 rounded-full mt-1.5 font-medium border"
                            style={{
                              backgroundColor: `${deck.subjectId.color || '#8b5cf6'}15`,
                              borderColor: `${deck.subjectId.color || '#8b5cf6'}40`,
                              color: deck.subjectId.color || '#a78bfa',
                            }}
                          >
                            {deck.subjectId.name}
                          </span>
                        )}
                        <p className="text-xs text-gray-400 mt-2 flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-gray-500" />
                          {deck.cards?.length || 0} cards
                        </p>
                      </div>

                      <button
                        onClick={(e) => handleDeleteSet(deck._id, e)}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition flex-shrink-0"
                        title="Delete Deck"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Study Area */}
          <div className="lg:col-span-3 space-y-4">
            {selectedSet && cards.length > 0 ? (
              <>
                {/* Deck Bar */}
                <div className="glass-panel rounded-xl px-5 py-3 flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <h2 className="text-lg font-bold text-white">{selectedSet.title}</h2>
                    <p className="text-xs text-gray-400">
                      Card {currentIndex + 1} of {cards.length} • {knownCards.size} marked as mastered
                    </p>
                  </div>

                  {/* Progress Indicator */}
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-white/10 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-violet-500 to-pink-500 h-full transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    <span className="text-xs text-violet-400 font-semibold">{progressPercent}%</span>
                  </div>
                </div>

                {isCompleted ? (
                  /* Completion Screen */
                  <div className="glass-panel rounded-2xl p-12 text-center space-y-6 animate-fade-in">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 mx-auto">
                      <div className="w-full h-full bg-[#0b0f17] rounded-full flex items-center justify-center text-emerald-400">
                        <CheckCircle2 className="w-10 h-10" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">Deck Completed! 🎉</h3>
                      <p className="text-gray-300 max-w-md mx-auto text-sm">
                        You reviewed all <strong>{cards.length}</strong> cards in this deck. You mastered{' '}
                        <strong className="text-emerald-400">{knownCards.size}</strong> cards.
                      </p>
                    </div>

                    <div className="flex items-center justify-center gap-3 pt-2">
                      <button
                        onClick={handleRestart}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-btn text-white font-medium text-sm"
                      >
                        <RotateCw className="w-4 h-4" /> Review Again
                      </button>
                      <button
                        onClick={handleShuffle}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-200 hover:text-white hover:bg-white/10 text-sm font-medium transition"
                      >
                        <Shuffle className="w-4 h-4" /> Shuffle & Restart
                      </button>
                    </div>
                  </div>
                ) : (
                  /* 3D Flip Card Container */
                  <div className="space-y-4">
                    <div
                      onClick={handleFlip}
                      className="perspective-1000 w-full min-h-[340px] md:min-h-[400px] cursor-pointer select-none group"
                    >
                      <div
                        className={`relative w-full h-full rounded-2xl transition-transform duration-500 transform-style-3d shadow-2xl ${
                          isFlipped ? 'rotate-y-180' : ''
                        }`}
                        style={{ minHeight: '380px' }}
                      >
                        {/* Front Side */}
                        <div className="absolute inset-0 w-full h-full rounded-2xl p-8 flex flex-col justify-between glass-panel border border-violet-500/20 bg-gradient-to-br from-[#121826]/90 via-[#182035]/80 to-[#121826]/90 backface-hidden">
                          <div className="flex items-center justify-between">
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                              <HelpCircle className="w-3.5 h-3.5" /> QUESTION
                            </span>
                            <span className="text-xs text-gray-500">Click card or press Space to flip</span>
                          </div>

                          <div className="my-auto py-6 text-center">
                            <p className="text-xl md:text-2xl font-semibold text-white leading-relaxed">
                              {currentCard?.front}
                            </p>
                          </div>

                          <div className="flex items-center justify-between text-xs text-gray-400 border-t border-white/5 pt-4">
                            <span>Card {currentIndex + 1} of {cards.length}</span>
                            <span className="flex items-center gap-1 text-violet-400 group-hover:translate-x-0.5 transition">
                              Flip for answer <RotateCw className="w-3 h-3" />
                            </span>
                          </div>
                        </div>

                        {/* Back Side */}
                        <div className="absolute inset-0 w-full h-full rounded-2xl p-8 flex flex-col justify-between glass-panel border border-emerald-500/30 bg-gradient-to-br from-[#0c1a1f]/90 via-[#11292e]/80 to-[#0c1a1f]/90 rotate-y-180 backface-hidden">
                          <div className="flex items-center justify-between">
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              <CheckCircle2 className="w-3.5 h-3.5" /> ANSWER
                            </span>
                            <span className="text-xs text-gray-500">Click to flip back</span>
                          </div>

                          <div className="my-auto py-6 text-center">
                            <p className="text-lg md:text-xl text-emerald-100 leading-relaxed font-normal">
                              {currentCard?.back}
                            </p>
                          </div>

                          <div className="flex items-center justify-between text-xs text-gray-400 border-t border-white/5 pt-4">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleKnown(currentIndex);
                              }}
                              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition ${
                                knownCards.has(currentIndex)
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                  : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'
                              }`}
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              {knownCards.has(currentIndex) ? 'Mastered ✓' : 'Mark as Mastered'}
                            </button>
                            <span className="text-emerald-400 flex items-center gap-1">
                              Flip back <RotateCw className="w-3 h-3" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Navigation Controls */}
                    <div className="glass-panel rounded-xl p-4 flex items-center justify-between flex-wrap gap-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handlePrev}
                          disabled={currentIndex === 0}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition text-sm font-medium"
                        >
                          <ChevronLeft className="w-4 h-4" /> Previous
                        </button>
                        <button
                          onClick={handleFlip}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-500/20 border border-violet-500/30 text-violet-300 hover:bg-violet-500/30 transition text-sm font-medium"
                        >
                          <RotateCw className="w-4 h-4" /> Flip
                        </button>
                        <button
                          onClick={handleNext}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl gradient-btn text-white text-sm font-medium"
                        >
                          Next <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleShuffle}
                          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition text-sm"
                          title="Shuffle Cards"
                        >
                          <Shuffle className="w-4 h-4" /> Shuffle
                        </button>
                        <button
                          onClick={handleRestart}
                          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition text-sm"
                          title="Restart Deck"
                        >
                          <RotateCw className="w-4 h-4" /> Reset
                        </button>
                      </div>
                    </div>

                    {/* Keyboard Shortcuts Hint */}
                    <p className="text-center text-xs text-gray-500">
                      Keyboard shortcuts: <kbd className="px-1.5 py-0.5 bg-white/5 rounded border border-white/10 text-gray-300">Space</kbd> Flip card • <kbd className="px-1.5 py-0.5 bg-white/5 rounded border border-white/10 text-gray-300">←</kbd> Previous • <kbd className="px-1.5 py-0.5 bg-white/5 rounded border border-white/10 text-gray-300">→</kbd> Next
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="glass-panel rounded-2xl p-12 text-center text-gray-400">
                <BookOpen className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                <p>Select a flashcard deck from the left sidebar to start studying.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
