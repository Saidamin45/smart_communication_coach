import React from 'react';
import { UserProfile, PracticeSession } from '../types';
import { RadarChartComponent } from '../components/RadarChart';
import { calculateAggregateMetrics } from '../lib/storage';
import {
  User,
  Flame,
  Trophy,
  Award,
  Clock,
  Target,
  Sparkles,
  TrendingUp,
  CheckCircle2
} from 'lucide-react';

interface ProfilePageProps {
  user: UserProfile;
  sessions: PracticeSession[];
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ user, sessions }) => {
  const aggregate = calculateAggregateMetrics(sessions);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Profile Header */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-zinc-900 via-zinc-900 to-indigo-950/40 border border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
          <img
            src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'}
            alt={user.name}
            className="w-24 h-24 rounded-2xl object-cover border-2 border-indigo-500/50 shadow-xl"
          />

          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
              <Award className="w-3.5 h-3.5" />
              <span>Student Level: Advanced Communicator</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">{user.name}</h1>
            <p className="text-xs text-zinc-400">{user.email}</p>
            <p className="text-xs text-indigo-300 font-medium pt-1">
              Goal: <span className="text-white">{user.targetGoal}</span>
            </p>
          </div>
        </div>

        {/* Streak & Score Badges */}
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 text-center space-y-1">
            <div className="flex items-center justify-center gap-1 text-amber-400">
              <Flame className="w-5 h-5 fill-amber-500 animate-pulse" />
              <span className="text-xl font-black">{user.streakDays} Days</span>
            </div>
            <span className="text-[10px] text-zinc-400 uppercase tracking-wider block font-semibold">
              Daily Streak
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 text-center space-y-1">
            <span className="text-xl font-black text-indigo-400 block">{aggregate.overallScore}/100</span>
            <span className="text-[10px] text-zinc-400 uppercase tracking-wider block font-semibold">
              Overall Score
            </span>
          </div>
        </div>
      </div>

      {/* Skills Radar & Target Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 p-6 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-xl space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
            7-Dimension Skill Mastery
          </h2>
          <RadarChartComponent metrics={aggregate} height={280} />
        </div>

        {/* Targets & Achievements */}
        <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 space-y-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
            Communication Targets
          </h2>

          <div className="space-y-4 text-xs">
            <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-2">
              <div className="flex justify-between font-semibold">
                <span className="text-zinc-400">Target Interview Score</span>
                <span className="text-indigo-400">{user.targetInterviewScore}/100</span>
              </div>
              <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full"
                  style={{ width: `${(aggregate.overallScore / user.targetInterviewScore) * 100}%` }}
                />
              </div>
            </div>

            <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-2">
              <div className="flex justify-between font-semibold">
                <span className="text-zinc-400">Target IELTS Band</span>
                <span className="text-purple-400">Band {user.targetIeltsBand.toFixed(1)}</span>
              </div>
              <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: '88%' }} />
              </div>
            </div>
          </div>

          <div className="p-4 bg-emerald-950/30 border border-emerald-900/50 rounded-2xl space-y-2 text-xs text-emerald-300">
            <div className="flex items-center gap-1.5 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Milestones Unlocked</span>
            </div>
            <ul className="space-y-1 text-[11px] text-emerald-200/80">
              <li>✓ Completed 5+ AI Practice Sessions</li>
              <li>✓ Mastered Behavioral STAR Method</li>
              <li>✓ Achieved Band 7.5+ in Lexical Resource</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
