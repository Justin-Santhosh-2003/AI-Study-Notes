import React from 'react';
import { HelpCircle } from 'lucide-react';

export default function QuizPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
      <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 mb-4 text-purple-400">
        <HelpCircle className="w-12 h-12" />
      </div>
      <h1 className="text-3xl font-bold mb-2 gradient-text">AI Quizzes</h1>
      <p className="text-gray-400 max-w-md">
        Quizzes are generated from your notes using AI. Go to a note and click "Generate Quiz" to create one.
      </p>
      <p className="mt-4 text-xs text-blue-300 glass-panel px-4 py-2 rounded-full border border-blue-500/30">
        Full quiz player UI — Week 4
      </p>
    </div>
  );
}
