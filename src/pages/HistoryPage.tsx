import React, { useState } from 'react';
import { PracticeSession, SessionMode } from '../types';
import { FeedbackReportModal } from '../components/FeedbackReportModal';
import {
  History as HistoryIcon,
  Search,
  Filter,
  Mic,
  Award,
  MessageSquareCode,
  Clock,
  Calendar,
  ChevronRight,
  FileText,
  Trash2
} from 'lucide-react';

interface HistoryPageProps {
  sessions: PracticeSession[];
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ sessions }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMode, setSelectedMode] = useState<SessionMode | 'all'>('all');
  const [selectedSessionModal, setSelectedSessionModal] = useState<PracticeSession | null>(null);

  const filteredSessions = sessions.filter((s) => {
    const matchesMode = selectedMode === 'all' || s.mode === selectedMode;
    const matchesSearch =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.topicOrRole.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesMode && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-950 border border-zinc-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
            <HistoryIcon className="w-3.5 h-3.5" />
            <span>Practice Records</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">Session History & Transcripts</h1>
          <p className="text-xs text-zinc-400">
            Review past practice recordings, AI scores, strengths, and speech transcripts.
          </p>
        </div>

        <div className="px-4 py-2 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs font-bold text-zinc-300">
          Total Completed: <span className="text-indigo-400">{sessions.length} Sessions</span>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-zinc-900 p-4 rounded-2xl border border-zinc-800">
        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search role, topic or title..."
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>

        {/* Mode Filter Tabs */}
        <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800 w-full sm:w-auto">
          {[
            { id: 'all', label: 'All Modes' },
            { id: 'interview', label: 'Interview' },
            { id: 'ielts', label: 'IELTS' },
            { id: 'debate', label: 'Debate' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedMode(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedMode === tab.id
                  ? 'bg-indigo-600 text-white font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Session Logs List */}
      <div className="space-y-4">
        {filteredSessions.length === 0 ? (
          <div className="p-12 text-center bg-zinc-900/50 border border-zinc-800 rounded-3xl space-y-3">
            <HistoryIcon className="w-10 h-10 text-zinc-600 mx-auto" />
            <h3 className="text-sm font-bold text-zinc-300">No matching practice sessions found</h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              Start practicing in Interview, IELTS, or Debate mode to populate your history log.
            </p>
          </div>
        ) : (
          filteredSessions.map((session) => (
            <div
              key={session.id}
              onClick={() => setSelectedSessionModal(session)}
              className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer group shadow-lg"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`p-3 rounded-2xl mt-1 ${
                    session.mode === 'interview'
                      ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                      : session.mode === 'ielts'
                      ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                      : 'bg-pink-500/10 text-pink-400 border border-pink-500/20'
                  }`}
                >
                  {session.mode === 'interview' && <Mic className="w-5 h-5" />}
                  {session.mode === 'ielts' && <Award className="w-5 h-5" />}
                  {session.mode === 'debate' && <MessageSquareCode className="w-5 h-5" />}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">
                      {session.title}
                    </h3>
                    <span className="px-2 py-0.5 rounded bg-zinc-800 text-[10px] text-zinc-400 uppercase font-mono font-semibold">
                      {session.mode}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-400">{session.topicOrRole}</p>

                  <div className="flex items-center gap-3 text-[11px] text-zinc-500 pt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {Math.round(session.durationSeconds / 60)} mins
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(session.completedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Scores */}
              <div className="flex items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-zinc-800">
                {session.mode === 'ielts' && session.scores.ieltsBandScore && (
                  <div className="text-right">
                    <span className="text-xs font-bold text-amber-400 block">
                      Band {session.scores.ieltsBandScore.toFixed(1)}
                    </span>
                    <span className="text-[10px] text-zinc-500 uppercase font-semibold">IELTS</span>
                  </div>
                )}

                <div className="text-right">
                  <span className="text-lg font-black text-white block">
                    {session.scores.overallScore}/100
                  </span>
                  <span className="text-[10px] text-emerald-400 uppercase font-semibold">Score</span>
                </div>

                <div className="p-2 rounded-xl bg-zinc-800 text-zinc-400 group-hover:text-white group-hover:bg-zinc-700 transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Session Detail Modal */}
      {selectedSessionModal && (
        <FeedbackReportModal
          session={selectedSessionModal}
          onClose={() => setSelectedSessionModal(null)}
        />
      )}
    </div>
  );
};
