import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Settings, Volume2, Shield, Bell, Key, Trash2, Check, Sparkles } from 'lucide-react';

interface SettingsPageProps {
  user: UserProfile;
  onUpdateUser: (user: UserProfile) => void;
  onResetData: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  user,
  onUpdateUser,
  onResetData,
}) => {
  const [targetGoal, setTargetGoal] = useState(user.targetGoal);
  const [targetScore, setTargetScore] = useState(user.targetInterviewScore);
  const [targetIelts, setTargetIelts] = useState(user.targetIeltsBand);
  const [autoPlayAudio, setAutoPlayAudio] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...user,
      targetGoal,
      targetInterviewScore: targetScore,
      targetIeltsBand: targetIelts,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-950 border border-zinc-800 flex items-center gap-4 shadow-xl">
        <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
          <Settings className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-white">Platform Preferences & Settings</h1>
          <p className="text-xs text-zinc-400">
            Configure target scores, AI audio voice preferences, and account defaults.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Targets Section */}
        <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
            Target Objectives & Scores
          </h2>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-zinc-400 mb-1 font-medium">Primary Goal Statement</label>
              <input
                type="text"
                value={targetGoal}
                onChange={(e) => setTargetGoal(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-zinc-400 mb-1 font-medium">Target Interview Score (0-100)</label>
                <input
                  type="number"
                  min="50"
                  max="100"
                  value={targetScore}
                  onChange={(e) => setTargetScore(Number(e.target.value))}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-medium">Target IELTS Band (5.0 - 9.0)</label>
                <input
                  type="number"
                  step="0.5"
                  min="5.0"
                  max="9.0"
                  value={targetIelts}
                  onChange={(e) => setTargetIelts(Number(e.target.value))}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Voice Speech Settings */}
        <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
            AI Speech & Audio Preferences
          </h2>

          <div className="flex items-center justify-between p-4 bg-zinc-950 rounded-2xl border border-zinc-800 text-xs">
            <div className="flex items-center gap-3">
              <Volume2 className="w-5 h-5 text-indigo-400" />
              <div>
                <span className="font-bold text-white block">Autoplay AI Question Audio</span>
                <span className="text-zinc-400 text-[11px]">Automatically speak interviewer prompts using Text-to-Speech</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={autoPlayAudio}
              onChange={(e) => setAutoPlayAudio(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 bg-zinc-900 border-zinc-700"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onResetData}
            className="px-4 py-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/40 text-rose-300 border border-rose-800/50 text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Reset Demo Data</span>
          </button>

          <button
            type="submit"
            className="px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-950/50 flex items-center gap-2 transition-all"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Save Preferences</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
