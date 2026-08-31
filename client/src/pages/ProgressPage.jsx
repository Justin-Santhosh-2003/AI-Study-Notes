import React, { useEffect, useState } from 'react';
import { getProgressStats } from '../services/progressService';
import { BarChart2, FileText, FolderOpen, HelpCircle, TrendingUp, Loader2 } from 'lucide-react';

export default function ProgressPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProgressStats()
      .then((res) => setStats(res.data.stats))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-blue-400 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Learning Progress</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: FileText, label: 'Total Notes', value: stats?.totalNotes ?? 0, color: 'bg-blue-600' },
          { icon: FolderOpen, label: 'Subjects Studied', value: stats?.subjectsStudied ?? 0, color: 'bg-indigo-600' },
          { icon: HelpCircle, label: 'Quizzes Taken', value: stats?.totalQuizzesTaken ?? 0, color: 'bg-violet-600' },
          { icon: TrendingUp, label: 'Average Score', value: stats ? `${stats.avgPercentage}%` : '0%', color: 'bg-purple-600' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="glass-panel rounded-xl p-5 flex items-center gap-4">
            <div className={`p-3 rounded-xl ${color}`}><Icon className="w-6 h-6 text-white" /></div>
            <div>
              <p className="text-2xl font-bold text-white">{value}</p>
              <p className="text-sm text-gray-400">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-panel rounded-xl p-6 text-center">
        <BarChart2 className="w-10 h-10 text-gray-600 mx-auto mb-3" />
        <p className="text-gray-400 text-sm">Detailed progress charts and quiz attempt history — Week 4</p>
      </div>
    </div>
  );
}
