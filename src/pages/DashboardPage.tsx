import React, { useState } from 'react';
import { UserProfile, PracticeSession } from '../types';
import { ScoreGauge } from '../components/ScoreGauge';
import { RadarChartComponent } from '../components/RadarChart';
import { FeedbackReportModal } from '../components/FeedbackReportModal';
import { calculateAggregateMetrics } from '../lib/storage';
import {
  Sparkles,
  Mic,
  Award,
  MessageSquareCode,
  Flame,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  Play,
  Calendar,
  ChevronRight
} from 'lucide-react';

interface DashboardPageProps {
  user: UserProfile;
  sessions: PracticeSession[];
  onStartMode: (mode: string) => void;
  onViewHistory: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  user,
  sessions,
  onStartMode,
  onViewHistory,
}) => {
  const [selectedSessionForModal, setSelectedSessionForModal] = useState<PracticeSession | null>(null);

  const aggregate = calculateAggregateMetrics(sessions);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Welcome Banner */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-950/60 via-zinc-900 to-zinc-900 border border-zinc-800 overflow-hidden shadow-2xl">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-indigo-500/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Personal AI Communication Coach</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {user.name}! 👋
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-xl">
              Target Goal: <span className="text-zinc-200 font-medium">{user.targetGoal}</span>
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Daily Streak Card */}
            <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <Flame className="w-6 h-6 fill-amber-500 animate-pulse" />
              </div>
              <div>
                <span className="text-xl font-black text-white">{user.streakDays} Days</span>
                <span className="text-[10px] text-zinc-400 uppercase tracking-wider block font-semibold">Daily Practice Streak</span>
              </div>
            </div>

            {/* Total Sessions Card */}
            <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xl font-black text-white">{aggregate.totalSessions}</span>
                <span className="text-[10px] text-zinc-400 uppercase tracking-wider block font-semibold">Completed Sessions</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Score Overview & Skills Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Overall Score Gauge */}
        <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 flex flex-col items-center justify-between shadow-xl">
          <div className="w-full flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Communication Performance
            </h2>
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              +5% this week
            </span>
          </div>

          <ScoreGauge score={aggregate.overallScore} size={170} label="Overall Communication Rating" />

          <div className="w-full mt-6 grid grid-cols-2 gap-2 pt-4 border-t border-zinc-800 text-center text-xs">
            <div className="p-2 bg-zinc-950 rounded-xl border border-zinc-800/80">
              <span className="text-zinc-400 text-[10px] uppercase block font-medium">Practice Time</span>
              <span className="text-sm font-bold text-white">{aggregate.totalMinutes} mins</span>
            </div>
            <div className="p-2 bg-zinc-950 rounded-xl border border-zinc-800/80">
              <span className="text-zinc-400 text-[10px] uppercase block font-medium">Target Score</span>
              <span className="text-sm font-bold text-indigo-400">{user.targetInterviewScore || 85}/100</span>
            </div>
          </div>
        </div>

        {/* 7 Dimensions Radar Chart */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                7 Dimensions Skill Breakdown
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">Aggregate evaluation across all completed practice sessions</p>
            </div>
          </div>

          <RadarChartComponent metrics={aggregate} height={260} />
        </div>
      </div>

      {/* Quick Launch Practice Modes */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-300">
            Select Practice Mode
          </h2>
          <span className="text-xs text-zinc-500">Pick a mode to begin AI voice coaching</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Interview Launcher */}
          <div
            onClick={() => onStartMode('interview')}
            className="group cursor-pointer p-6 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-indigo-500/60 transition-all hover:-translate-y-1 shadow-lg relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 group-hover:scale-110 transition-transform">
                <Mic className="w-6 h-6" />
              </div>
              <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-[10px] font-bold uppercase tracking-wider">
                Job Ready
              </span>
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors">
              AI Interview Coach
            </h3>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
              Software, Product, HR & STAR behavioral question practice with instant score analysis.
            </p>
            <div className="mt-6 flex items-center justify-between text-xs text-indigo-400 font-semibold">
              <span>Start Session</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* IELTS Launcher */}
          <div
            onClick={() => onStartMode('ielts')}
            className="group cursor-pointer p-6 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-purple-500/60 transition-all hover:-translate-y-1 shadow-lg relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 group-hover:scale-110 transition-transform">
                <Award className="w-6 h-6" />
              </div>
              <span className="px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-300 text-[10px] font-bold uppercase tracking-wider">
                Band 1-9
              </span>
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-purple-400 transition-colors">
              IELTS Speaking Coach
            </h3>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
              Official IELTS Part 1, Part 2 Cue Cards, and Part 3 discussions with band score breakdown.
            </p>
            <div className="mt-6 flex items-center justify-between text-xs text-purple-400 font-semibold">
              <span>Start Session</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Debate Launcher */}
          <div
            onClick={() => onStartMode('debate')}
            className="group cursor-pointer p-6 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-pink-500/60 transition-all hover:-translate-y-1 shadow-lg relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400 group-hover:scale-110 transition-transform">
                <MessageSquareCode className="w-6 h-6" />
              </div>
              <span className="px-2.5 py-1 rounded-full bg-pink-500/10 text-pink-300 text-[10px] font-bold uppercase tracking-wider">
                Multi-Turn
              </span>
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-pink-400 transition-colors">
              AI Debate Coach
            </h3>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
              Challenge Socratic AI opponents, strengthen argument logic, and eliminate fallacies.
            </p>
            <div className="mt-6 flex items-center justify-between text-xs text-pink-400 font-semibold">
              <span>Start Session</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Practice History */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-300">
            Recent Practice Sessions
          </h2>
          <button
            onClick={onViewHistory}
            className="text-xs text-indigo-400 hover:underline flex items-center gap-1 font-semibold"
          >
            <span>View All History</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {sessions.slice(0, 3).map((session) => (
            <div
              key={session.id}
              onClick={() => setSelectedSessionForModal(session)}
              className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 transition-all flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`p-3 rounded-xl ${
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

                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-indigo-400 transition-colors">
                    {session.title}
                  </h4>
                  <p className="text-[11px] text-zinc-400 flex items-center gap-2 mt-0.5">
                    <span>{session.topicOrRole}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {Math.round(session.durationSeconds / 60)} mins
                    </span>
                    <span>•</span>
                    <span>{new Date(session.completedAt).toLocaleDateString()}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-base font-extrabold text-white block">
                    {session.scores.overallScore}/100
                  </span>
                  <span className="text-[10px] text-emerald-400 font-semibold uppercase">
                    Score
                  </span>
                </div>

                <div className="p-2 rounded-xl bg-zinc-800 text-zinc-400 group-hover:text-white group-hover:bg-zinc-700 transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Session Feedback Modal */}
      {selectedSessionForModal && (
        <FeedbackReportModal
          session={selectedSessionForModal}
          onClose={() => setSelectedSessionForModal(null)}
        />
      )}
    </div>
  );
};
