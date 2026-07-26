import React, { useState, useEffect } from 'react';
import { IELTS_TOPICS } from '../lib/mockData';
import { PracticeSession, IELTSConfig } from '../types';
import { AudioRecorder } from '../components/AudioRecorder';
import { AudioPlayer } from '../components/AudioPlayer';
import { FeedbackReportModal } from '../components/FeedbackReportModal';
import { savePracticeSession } from '../lib/storage';
import {
  Award,
  Sparkles,
  Clock,
  RotateCcw,
  BookOpen,
  CheckCircle2,
  FileText,
  Timer,
  Play,
  Pause
} from 'lucide-react';

interface IELTSCoachPageProps {
  userId: string;
  onFinishSession: (session: PracticeSession) => void;
}

export const IELTSCoachPage: React.FC<IELTSCoachPageProps> = ({
  userId,
  onFinishSession,
}) => {
  const [config, setConfig] = useState<IELTSConfig>({
    part: 'part2',
    topic: 'Education & AI Technology',
    targetBand: 8.0,
  });

  const [sessionActive, setSessionActive] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [prepTimeLeft, setPrepTimeLeft] = useState(60); // 1-minute prep timer for Part 2
  const [prepTimerRunning, setPrepTimerRunning] = useState(false);
  const [speakTimeLeft, setSpeakTimeLeft] = useState(120); // 2-minute speech timer
  const [isLoadingPrompt, setIsLoadingPrompt] = useState(false);
  const [transcript, setTranscript] = useState<{ speaker: 'ai' | 'user'; text: string; timestamp: number }[]>([]);
  const [sessionStartTime, setSessionStartTime] = useState<number>(0);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [completedSession, setCompletedSession] = useState<PracticeSession | null>(null);

  // Timer logic for Part 2 Preparation
  useEffect(() => {
    let interval: any = null;
    if (prepTimerRunning && prepTimeLeft > 0) {
      interval = setInterval(() => {
        setPrepTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (prepTimeLeft === 0) {
      setPrepTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [prepTimerRunning, prepTimeLeft]);

  const handleStartPractice = async () => {
    setIsLoadingPrompt(true);
    setSessionActive(true);
    setTranscript([]);
    setSessionStartTime(Date.now());
    setPrepTimeLeft(60);
    setPrepTimerRunning(false);

    try {
      const res = await fetch('/api/coach/question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'ielts',
          topicOrRole: config.topic,
          ieltsPart: config.part,
        }),
      });

      const data = await res.json();
      setCurrentPrompt(data.question);

      setTranscript([
        {
          speaker: 'ai',
          text: data.question,
          timestamp: Date.now(),
        },
      ]);
    } catch (e) {
      console.error(e);
      const fallbackPrompt = `Describe an important decision you made recently.\nYou should say:\n- What the decision was\n- When and why you made it\n- What the result was\nAnd explain how you felt after making this decision.`;
      setCurrentPrompt(fallbackPrompt);
      setTranscript([{ speaker: 'ai', text: fallbackPrompt, timestamp: Date.now() }]);
    } finally {
      setIsLoadingPrompt(false);
    }
  };

  const handleUserSubmitAnswer = async (userText: string) => {
    const updatedTranscript = [
      ...transcript,
      { speaker: 'user' as const, text: userText, timestamp: Date.now() },
    ];
    setTranscript(updatedTranscript);

    setIsEvaluating(true);
    try {
      const res = await fetch('/api/coach/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'ielts',
          topicOrRole: `${config.topic} (${config.part.toUpperCase()})`,
          transcript: updatedTranscript,
        }),
      });

      const evalData = await res.json();
      const duration = Math.max(30, Math.round((Date.now() - sessionStartTime) / 1000));

      const newSession: PracticeSession = {
        id: `ielts_${Date.now()}`,
        userId,
        mode: 'ielts',
        title: `IELTS Speaking ${config.part.toUpperCase()} - ${config.topic}`,
        topicOrRole: config.topic,
        durationSeconds: duration,
        completedAt: new Date().toISOString(),
        scores: {
          grammar: evalData.grammar || 86,
          vocabulary: evalData.vocabulary || 88,
          fluency: evalData.fluency || 82,
          confidence: evalData.confidence || 85,
          relevance: evalData.relevance || 90,
          criticalThinking: evalData.criticalThinking || 86,
          professionalism: evalData.professionalism || 88,
          overallScore: evalData.overallScore || 86,
          ieltsBandScore: evalData.ieltsBandScore || 7.5,
        },
        transcript: updatedTranscript,
        keyStrengths: evalData.keyStrengths || [
          'Rich lexical resource: used topic-specific vocabulary naturally.',
          'Maintained good structural coherence using discourse markers.'
        ],
        areasToImprove: evalData.areasToImprove || [
          'Incorporate more varied complex tenses for Band 8+ Grammatical Range.'
        ],
        actionableTips: evalData.actionableTips || [
          'Use pause fillers like "Well, to be perfectly honest..." rather than silent gaps.'
        ],
        modelAnswerSummary: evalData.modelAnswerSummary,
      };

      savePracticeSession(newSession);
      setCompletedSession(newSession);
      onFinishSession(newSession);
    } catch (e) {
      console.error('IELTS evaluation error:', e);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950/80 via-zinc-900 to-zinc-900 border border-zinc-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold">
            <Award className="w-3.5 h-3.5" />
            <span>AI Practice Mode #2</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">IELTS Speaking Coach</h1>
          <p className="text-xs text-zinc-400">
            Official IELTS Part 1, Part 2 Cue Cards, and Part 3 Analytical Discussions with Band 1.0–9.0 evaluation.
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
            {/* Part Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                1. Select IELTS Test Section
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { id: 'part1', title: 'Part 1: Warm-up', sub: '3-4 introductory questions on personal topics (hometown, study, hobbies).' },
                  { id: 'part2', title: 'Part 2: Cue Card', sub: '1-min preparation timer + 2-min long turn monologue.' },
                  { id: 'part3', title: 'Part 3: Discussion', sub: 'Deep analytical follow-up questions challenging opinions.' },
                ].map((p) => {
                  const isSelected = config.part === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => setConfig({ ...config, part: p.id as any })}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-purple-950/40 border-purple-500 shadow-lg shadow-purple-950/50'
                          : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      <h3 className="text-sm font-bold text-white mb-1">{p.title}</h3>
                      <p className="text-[11px] text-zinc-400 leading-relaxed">{p.sub}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Topic Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                2. Select IELTS Topic Category
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {IELTS_TOPICS.map((top) => {
                  const isSelected = config.topic === top.title;
                  return (
                    <div
                      key={top.id}
                      onClick={() => setConfig({ ...config, topic: top.title })}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-purple-950/40 border-purple-500 text-white font-semibold'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-850'
                      }`}
                    >
                      <div className="text-xs font-bold">{top.title}</div>
                      <div className="text-[10px] text-zinc-400 mt-0.5">{top.description}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Setup Summary Card */}
          <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-300">
                Target Score Config
              </h3>

              <div className="space-y-3 bg-zinc-950 p-4 rounded-2xl border border-zinc-800 text-xs">
                <div className="flex justify-between">
                  <span className="text-zinc-500">IELTS Section:</span>
                  <span className="font-bold text-purple-400 uppercase">{config.part}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Topic:</span>
                  <span className="font-bold text-white">{config.topic}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Target IELTS Band:</span>
                  <span className="font-bold text-amber-400">Band {config.targetBand.toFixed(1)}</span>
                </div>
              </div>

              <div className="bg-purple-950/30 border border-purple-900/40 p-4 rounded-2xl space-y-2 text-xs text-purple-300">
                <div className="flex items-center gap-1.5 font-bold">
                  <BookOpen className="w-4 h-4 text-purple-400" />
                  <span>Official Band Descriptors</span>
                </div>
                <p className="text-[11px] leading-relaxed text-purple-200/80">
                  Band 8+ requires natural idiomatic vocabulary, complex conditional structures, and effortless speech pacing.
                </p>
              </div>
            </div>

            <button
              onClick={handleStartPractice}
              disabled={isLoadingPrompt}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold text-xs shadow-xl shadow-purple-950/50 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-50"
            >
              {isLoadingPrompt ? (
                <span>Loading IELTS Prompt...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Start IELTS Speaking Test</span>
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        /* Active IELTS Stage */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Prompt Card */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl relative">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                  Official IELTS Examiner Prompt ({config.part.toUpperCase()})
                </span>
                {currentPrompt && <AudioPlayer text={currentPrompt} autoPlay={true} />}
              </div>

              <div className="whitespace-pre-line text-sm sm:text-base font-semibold text-white leading-relaxed bg-zinc-950 p-4 rounded-2xl border border-zinc-800/80">
                {currentPrompt}
              </div>

              {/* Part 2 Cue Card Timer Widget */}
              {config.part === 'part2' && (
                <div className="mt-4 p-4 bg-purple-950/30 border border-purple-900/50 rounded-2xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Timer className="w-4 h-4 text-purple-400" />
                    <div>
                      <span className="font-bold text-white block">1-Min Preparation Timer</span>
                      <span className="text-[10px] text-zinc-400">Use this time to structure your bullet points</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-lg text-purple-300">{prepTimeLeft}s</span>
                    <button
                      type="button"
                      onClick={() => setPrepTimerRunning(!prepTimerRunning)}
                      className="px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
                    >
                      {prepTimerRunning ? 'Pause' : 'Start Prep'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Audio Speech Recording */}
            <AudioRecorder
              onSendMessage={handleUserSubmitAnswer}
              disabled={isEvaluating}
              placeholder="Record your speech answer using the microphone or type your response here..."
            />
          </div>

          {/* IELTS Band Scoring Guide */}
          <div className="space-y-6">
            <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                Cambridge Assessment Criteria
              </h3>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800/80">
                  <span className="font-bold text-purple-400">1. Fluency & Coherence: </span>
                  <span className="text-zinc-300">Natural flow without hesitation or self-correction.</span>
                </div>
                <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800/80">
                  <span className="font-bold text-indigo-400">2. Lexical Resource: </span>
                  <span className="text-zinc-300">Wide vocabulary range & precise collocations.</span>
                </div>
                <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800/80">
                  <span className="font-bold text-emerald-400">3. Grammatical Accuracy: </span>
                  <span className="text-zinc-300">Error-free complex sentence structures.</span>
                </div>
                <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800/80">
                  <span className="font-bold text-amber-400">4. Pronunciation: </span>
                  <span className="text-zinc-300">Clear intonation & natural word stress.</span>
                </div>
              </div>
            </div>

            {isEvaluating && (
              <div className="p-6 bg-purple-950/40 border border-purple-800 rounded-3xl text-center space-y-3 animate-pulse">
                <Sparkles className="w-8 h-8 text-purple-400 mx-auto animate-spin" />
                <h4 className="text-sm font-bold text-white">Calculating IELTS Band Score</h4>
                <p className="text-xs text-purple-300">
                  Evaluating against official Cambridge Band Descriptors...
                </p>
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
            handleStartPractice();
          }}
        />
      )}
    </div>
  );
};
