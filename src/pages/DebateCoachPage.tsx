import React, { useState } from 'react';
import { DEBATE_TOPICS } from '../lib/mockData';
import { PracticeSession, DebateConfig } from '../types';
import { AudioRecorder } from '../components/AudioRecorder';
import { AudioPlayer } from '../components/AudioPlayer';
import { FeedbackReportModal } from '../components/FeedbackReportModal';
import { savePracticeSession } from '../lib/storage';
import {
  MessageSquareCode,
  Sparkles,
  Shield,
  RotateCcw,
  Zap,
  Swords,
  AlertTriangle,
  Send,
  Trophy,
  CheckCircle2
} from 'lucide-react';

interface DebateCoachPageProps {
  userId: string;
  onFinishSession: (session: PracticeSession) => void;
}

export const DebateCoachPage: React.FC<DebateCoachPageProps> = ({
  userId,
  onFinishSession,
}) => {
  const [config, setConfig] = useState<DebateConfig>({
    topic: 'Generative AI in University Curricula',
    side: 'pro',
    aiPersona: 'socratic_examiner',
    numTurns: 3,
  });

  const [sessionActive, setSessionActive] = useState(false);
  const [messages, setMessages] = useState<{ speaker: 'ai' | 'user'; text: string; timestamp: number }[]>([]);
  const [currentTurnScore, setCurrentTurnScore] = useState<number | null>(null);
  const [fallacyAlert, setFallacyAlert] = useState<string | null>(null);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<number>(0);
  const [isEvaluatingFinal, setIsEvaluatingFinal] = useState(false);
  const [completedSession, setCompletedSession] = useState<PracticeSession | null>(null);

  const handleStartDebate = async () => {
    setSessionActive(true);
    setMessages([]);
    setCurrentTurnScore(null);
    setFallacyAlert(null);
    setSessionStartTime(Date.now());
    setIsAiThinking(true);

    try {
      const res = await fetch('/api/coach/question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'debate',
          topicOrRole: config.topic,
          debateSide: config.side,
          debatePersona: config.aiPersona,
        }),
      });

      const data = await res.json();
      setMessages([
        {
          speaker: 'ai',
          text: data.question,
          timestamp: Date.now(),
        },
      ]);
    } catch (e) {
      console.error(e);
      const fallback = `Opening Argument: Opposing your position on "${config.topic}", we argue that this policy creates unmanageable financial and administrative overhead. How do you defend your stance?`;
      setMessages([{ speaker: 'ai', text: fallback, timestamp: Date.now() }]);
    } finally {
      setIsAiThinking(false);
    }
  };

  const handleUserRebuttal = async (userText: string) => {
    const updatedMessages = [
      ...messages,
      { speaker: 'user' as const, text: userText, timestamp: Date.now() },
    ];
    setMessages(updatedMessages);

    setIsAiThinking(true);
    try {
      const res = await fetch('/api/coach/debate-turn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: config.topic,
          side: config.side,
          userMessage: userText,
          history: updatedMessages,
        }),
      });

      const data = await res.json();
      setCurrentTurnScore(data.turnScore || 85);
      setFallacyAlert(data.fallacyDetected !== 'None' ? data.fallacyDetected : null);

      setMessages([
        ...updatedMessages,
        { speaker: 'ai', text: data.rebuttal, timestamp: Date.now() },
      ]);
    } catch (e) {
      console.error('Debate turn error:', e);
    } finally {
      setIsAiThinking(false);
    }
  };

  const handleFinishDebate = async () => {
    setIsEvaluatingFinal(true);
    try {
      const res = await fetch('/api/coach/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'debate',
          topicOrRole: config.topic,
          transcript: messages,
        }),
      });

      const evalData = await res.json();
      const duration = Math.max(30, Math.round((Date.now() - sessionStartTime) / 1000));

      const newSession: PracticeSession = {
        id: `debate_${Date.now()}`,
        userId,
        mode: 'debate',
        title: `Debate - ${config.topic}`,
        topicOrRole: `${config.side.toUpperCase()} Side - ${config.topic}`,
        durationSeconds: duration,
        completedAt: new Date().toISOString(),
        scores: {
          grammar: evalData.grammar || 88,
          vocabulary: evalData.vocabulary || 89,
          fluency: evalData.fluency || 85,
          confidence: evalData.confidence || 90,
          relevance: evalData.relevance || 93,
          criticalThinking: evalData.criticalThinking || 92,
          professionalism: evalData.professionalism || 91,
          overallScore: evalData.overallScore || 90,
        },
        transcript: messages,
        keyStrengths: evalData.keyStrengths || ['Powerful analogies and structured logic.'],
        areasToImprove: evalData.areasToImprove || ['Anticipate long-term systemic consequences.'],
        actionableTips: evalData.actionableTips || ['Deconstruct opponent premise before asserting rebuttal.'],
        modelAnswerSummary: evalData.modelAnswerSummary,
      };

      savePracticeSession(newSession);
      setCompletedSession(newSession);
      onFinishSession(newSession);
    } catch (e) {
      console.error('Final debate evaluation error:', e);
    } finally {
      setIsEvaluatingFinal(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-pink-950/80 via-zinc-900 to-zinc-900 border border-zinc-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-semibold">
            <MessageSquareCode className="w-3.5 h-3.5" />
            <span>AI Practice Mode #3</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">AI Debate Coach</h1>
          <p className="text-xs text-zinc-400">
            Multi-turn intellectual debate simulator with Socratic opponents, fallacy detection, and argument strength scoring.
          </p>
        </div>

        {sessionActive && (
          <button
            onClick={() => setSessionActive(false)}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold flex items-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Change Settings</span>
          </button>
        )}
      </div>

      {!sessionActive ? (
        /* Setup Form */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Topic Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                1. Choose Motion / Topic
              </label>
              <div className="space-y-2.5">
                {DEBATE_TOPICS.map((top) => {
                  const isSelected = config.topic === top.title;
                  return (
                    <div
                      key={top.id}
                      onClick={() => setConfig({ ...config, topic: top.title })}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-pink-950/40 border-pink-500 shadow-lg shadow-pink-950/50'
                          : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      <h3 className="text-sm font-bold text-white mb-1">{top.title}</h3>
                      <p className="text-xs text-zinc-400 leading-relaxed">{top.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Position & AI Persona */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
              {/* Position */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                  2. Select Your Stance
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setConfig({ ...config, side: 'pro' })}
                    className={`p-3.5 rounded-xl border text-xs font-bold transition-all ${
                      config.side === 'pro'
                        ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-950/50'
                        : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:bg-zinc-800'
                    }`}
                  >
                    PRO (For Stance)
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfig({ ...config, side: 'con' })}
                    className={`p-3.5 rounded-xl border text-xs font-bold transition-all ${
                      config.side === 'con'
                        ? 'bg-rose-600 text-white border-rose-500 shadow-md shadow-rose-950/50'
                        : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:bg-zinc-800'
                    }`}
                  >
                    CON (Against Stance)
                  </button>
                </div>
              </div>

              {/* AI Persona */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                  3. AI Opponent Persona
                </label>
                <div className="space-y-2">
                  {[
                    { id: 'socratic_examiner', name: 'Socratic Examiner', sub: 'Challenges premises with deep probing questions' },
                    { id: 'tough_adversary', name: 'Tough Adversary', sub: 'Aggressive counter-arguments & fast rebuttals' },
                    { id: 'supportive_mentor', name: 'Constructive Mentor', sub: 'Balanced debate with helpful logic cues' },
                  ].map((persona) => (
                    <div
                      key={persona.id}
                      onClick={() => setConfig({ ...config, aiPersona: persona.id as any })}
                      className={`p-3 rounded-xl border cursor-pointer text-xs transition-colors ${
                        config.aiPersona === persona.id
                          ? 'bg-pink-600 text-white border-pink-500 font-semibold'
                          : 'bg-zinc-950 text-zinc-300 border-zinc-800 hover:bg-zinc-800'
                      }`}
                    >
                      <div>{persona.name}</div>
                      <div className={`text-[10px] ${config.aiPersona === persona.id ? 'text-pink-200' : 'text-zinc-500'}`}>
                        {persona.sub}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Setup Summary Card */}
          <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-300">
                Debate Setup Summary
              </h3>

              <div className="space-y-3 bg-zinc-950 p-4 rounded-2xl border border-zinc-800 text-xs">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Motion:</span>
                  <span className="font-bold text-white truncate max-w-[150px]">{config.topic}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Your Position:</span>
                  <span className={`font-bold uppercase ${config.side === 'pro' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {config.side}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Opponent Style:</span>
                  <span className="font-bold text-pink-400 capitalize">{config.aiPersona.replace('_', ' ')}</span>
                </div>
              </div>

              <div className="bg-pink-950/30 border border-pink-900/40 p-4 rounded-2xl space-y-2 text-xs text-pink-300">
                <div className="flex items-center gap-1.5 font-bold">
                  <Swords className="w-4 h-4 text-pink-400" />
                  <span>Debate Rule of Thumb</span>
                </div>
                <p className="text-[11px] leading-relaxed text-pink-200/80">
                  Always acknowledge your opponent's strongest argument before exposing its logical flaw.
                </p>
              </div>
            </div>

            <button
              onClick={handleStartDebate}
              disabled={isAiThinking}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-semibold text-xs shadow-xl shadow-pink-950/50 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-50"
            >
              {isAiThinking ? (
                <span>Initiating Debate Opponent...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Enter Debate Arena</span>
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        /* Active Debate Arena */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Debate Thread */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl text-xs space-y-1.5 leading-relaxed ${
                    m.speaker === 'ai'
                      ? 'bg-zinc-950 border border-zinc-800 text-zinc-200'
                      : 'bg-pink-950/40 border border-pink-900/50 text-white ml-8'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    <span>{m.speaker === 'ai' ? 'AI Debate Opponent' : 'Your Rebuttal'}</span>
                    {m.speaker === 'ai' && <AudioPlayer text={m.text} />}
                  </div>
                  <p className="text-xs font-medium">{m.text}</p>
                </div>
              ))}

              {isAiThinking && (
                <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 text-xs text-pink-400 flex items-center gap-2 animate-pulse">
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>AI Opponent is formulating counter-rebuttal...</span>
                </div>
              )}
            </div>

            {/* Rebuttal Voice/Text Input */}
            <AudioRecorder
              onSendMessage={handleUserRebuttal}
              disabled={isAiThinking || isEvaluatingFinal}
              placeholder="Speak your rebuttal or type your counter-argument here..."
            />

            <div className="flex justify-end">
              <button
                onClick={handleFinishDebate}
                disabled={isEvaluatingFinal || messages.length < 2}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-semibold text-xs shadow-lg flex items-center gap-2 disabled:opacity-50"
              >
                <Trophy className="w-4 h-4" />
                <span>Conclude Debate & View Final Score</span>
              </button>
            </div>
          </div>

          {/* Turn Analytics Panel */}
          <div className="space-y-6">
            <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                Turn Quality Analytics
              </h3>

              {currentTurnScore !== null ? (
                <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 text-center space-y-1">
                  <span className="text-3xl font-extrabold text-emerald-400">{currentTurnScore}/100</span>
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider block font-semibold">
                    Last Rebuttal Strength
                  </span>
                </div>
              ) : (
                <p className="text-xs text-zinc-500 italic">Submit your first rebuttal to see turn quality rating.</p>
              )}

              {fallacyAlert && (
                <div className="p-3 bg-amber-950/40 border border-amber-800 rounded-xl text-xs text-amber-300 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Potential Fallacy Alert</span>
                    <span className="text-[11px] leading-tight text-amber-200">{fallacyAlert}</span>
                  </div>
                </div>
              )}
            </div>

            {isEvaluatingFinal && (
              <div className="p-6 bg-pink-950/40 border border-pink-800 rounded-3xl text-center space-y-3 animate-pulse">
                <Sparkles className="w-8 h-8 text-pink-400 mx-auto animate-spin" />
                <h4 className="text-sm font-bold text-white">Generating Final Debate Report</h4>
                <p className="text-xs text-pink-300">Evaluating critical thinking, logical coherence, and rebuttal power...</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Completed Session Modal */}
      {completedSession && (
        <FeedbackReportModal
          session={completedSession}
          onClose={() => setCompletedSession(null)}
          onRetake={() => {
            setCompletedSession(null);
            handleStartDebate();
          }}
        />
      )}
    </div>
  );
};
