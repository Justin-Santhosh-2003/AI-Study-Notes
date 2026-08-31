import React from 'react';
import { BookOpen } from 'lucide-react';

export default function FlashcardsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
      <div className="p-4 rounded-2xl bg-violet-500/10 border border-violet-500/20 mb-4 text-violet-400">
        <BookOpen className="w-12 h-12" />
      </div>
      <h1 className="text-3xl font-bold mb-2 gradient-text">AI Flashcards</h1>
      <p className="text-gray-400 max-w-md">
        Flashcard study decks are generated from your notes using AI. Go to a note and click "Generate Flashcards" to create a deck.
      </p>
      <p className="mt-4 text-xs text-blue-300 glass-panel px-4 py-2 rounded-full border border-blue-500/30">
        Full flashcard review UI — Week 4
      </p>
    </div>
  );
}
