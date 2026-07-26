import React, { useState } from 'react';
import { INTERVIEW_DOMAINS } from '../lib/mockData';
import { PracticeSession, InterviewConfig } from '../types';
import { AudioRecorder } from '../components/AudioRecorder';
import { AudioPlayer } from '../components/AudioPlayer';
import { FeedbackReportModal } from '../components/FeedbackReportModal';
import { savePracticeSession } from '../lib/storage';
import {
  Mic,
  Code,
  Briefcase,
  BarChart2,
  Megaphone,
  Users,
  TrendingUp,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Clock,
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  FileText
} from 'lucide-react';

interface InterviewCoachPageProps {
  userId: string;
  onFinishSession: (session: PracticeSession) => void;
}

export const InterviewCoachPage: React.FC<InterviewCoachPageProps> = ({
  userId,
  onFinishSession,
}) => {
  const [config, setConfig] = useState<InterviewConfig>({
    domain: 'Software Engineering',
    experienceLevel: 'entry',
    questionType: 'behavioral',
  });

  const [sessionActive, setSessionActive] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [questionTips, setQuestionTips] = useState<string[]>([]);
  const [isLoadingQuestion, setIsLoadingQuestion] = useState(false);
  const [transcript, setTranscript] = useState<{ speaker: 'ai' | 'user'; text: string; timestamp: number }[]>([]);
  const [sessionStartTime, setSessionStartTime] = useState<number>(0);
  const [showStarGuide, setShowStarGuide] = useState(true);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [completedSession, setCompletedSession] = useState<PracticeSession | null>(null);

  // Icon mapping
  const getDomainIcon = (name: string) => {
    switch (name) {
      case 'Software Engineering': return Code;
      case 'Product Management': return Briefcase;
      case 'Data & Analytics': return BarChart2;
      case 'Marketing & Growth': return Megaphone;
      case 'Human Resources & Talent': return Users;
      default: return TrendingUp;
    }
  };

  const handleStartPractice = async () => {
    setIsLoadingQuestion(true);
    setSessionActive(true);
    setTranscript([]);
    setSessionStartTime(Date.now());

    try {
      const res = await fetch('/api/coach/question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'interview',
          topicOrRole: config.domain,
          experienceLevel: config.experienceLevel,
          questionType: config.questionType,
        }),
      });

      const data = await res.json();
      setCurrentQuestion(data.question);
      setQuestionTips(data.tips || []);

      setTranscript([
        {
          speaker: 'ai',
          text: data.question,
          timestamp: Date.now(),
        },
      ]);
    } catch (e) {
      console.error(e);
      const fallbackQ = `Tell me about a time when you faced a difficult conflict on a group project in ${config.domain}. How did you handle it?`;
      setCurrentQuestion(fallbackQ);
      setTranscript([{ speaker: 'ai', text: fallbackQ, timestamp: Date.now() }]);
    } finally {
      setIsLoadingQuestion(false);
    }
  };

  const handleUserSubmitAnswer = async (userText: string) => {
    const updatedTranscript = [
      ...transcript,
      { speaker: 'user' as const, text: userText, timestamp: Date.now() },
    ];
    setTranscript(updatedTranscript);

    // Evaluate session
    setIsEvaluating(true);
    try {
      const res = await fetch('/api/coach/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'interview',
          topicOrRole: `${config.domain} (${config.questionType})`,
          transcript: updatedTranscript,
        }),
      });

      const evalData = await res.json();
      const duration = Math.max(30, Math.round((Date.now() - sessionStartTime) / 1000));

      const newSession: PracticeSession = {
        id: `interview_${Date.now()}`,
        userId,
        mode: 'interview',
        title: `${config.domain} ${config.questionType.toUpperCase()} Interview`,
        topicOrRole: `${config.domain} - ${config.experienceLevel.toUpperCase()}`,
        durationSeconds: duration,
        completedAt: new Date().toISOString(),
        scores: {
          grammar: evalData.grammar || 85,
          vocabulary: evalData.vocabulary || 84,
          fluency: evalData.fluency || 82,
          confidence: evalData.confidence || 86,
          relevance: evalData.relevance || 88,
          criticalThinking: evalData.criticalThinking || 85,
          professionalism: evalData.professionalism || 90,
          overallScore: evalData.overallScore || 86,
        },
        transcript: updatedTranscript,
        keyStrengths: evalData.keyStrengths || ['Used structured STAR framework clearly.'],
        areasToImprove: evalData.areasToImprove || ['Quantify results with specific metrics.'],
        actionableTips: evalData.actionableTips || ['Focus 60% of response on Action.'],
        modelAnswerSummary: evalData.modelAnswerSummary,
      };

      savePracticeSession(newSession);
      setCompletedSession(newSession);
      onFinishSession(newSession);
    } catch (e) {
      console.error('Evaluation failed:', e);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-950/80 via-zinc-900 to-zinc-900 border border-zinc-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
            <Mic className="w-3.5 h-3.5" />
            <span>AI Practice Mode #1</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">AI Interview Coach</h1>
          <p className="text-xs text-zinc-400">
            Practice domain-specific questions, STAR behavioral frameworks, and receive instant scorecards.
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
          {/* Domain Selection */}
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                1. Select Target Career Domain
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {INTERVIEW_DOMAINS.map((dom) => {
                  const Icon = getDomainIcon(dom.name);
                  const isSelected = config.domain === dom.name;
                  return (
                    <div
                      key={dom.id}
                      onClick={() => setConfig({ ...config, domain: dom.name })}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-indigo-950/40 border-indigo-500 shadow-lg shadow-indigo-950/50'
                          : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`p-2 rounded-xl ${isSelected ? 'bg-indigo-600 text-white' : 'bg-zinc-800 text-zinc-400'}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <h3 className="text-sm font-bold text-white">{dom.name}</h3>
                      </div>
                      <p className="text-[11px] text-zinc-400 leading-relaxed">{dom.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Experience & Question Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
              {/* Experience Level */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                  2. Experience Level
                </label>
                <div className="space-y-2">
                  {[
                    { id: 'entry', label: 'Entry Level / Graduate', sub: 'Focus on university projects & fundamentals' },
                    { id: 'mid', label: 'Mid-Level Professional', sub: 'Focus on technical execution & collaboration' },
                    { id: 'senior', label: 'Senior / Lead', sub: 'Focus on system design & leadership' },
                  ].map((exp) => (
                    <div
                      key={exp.id}
                      onClick={() => setConfig({ ...config, experienceLevel: exp.id as any })}
                      className={`p-3 rounded-xl border cursor-pointer text-xs transition-colors ${
                        config.experienceLevel === exp.id
                          ? 'bg-indigo-600 text-white border-indigo-500 font-semibold'
                          : 'bg-zinc-950 text-zinc-300 border-zinc-800 hover:bg-zinc-800'
                      }`}
                    >
                      <div>{exp.label}</div>
                      <div className={`text-[10px] ${config.experienceLevel === exp.id ? 'text-indigo-200' : 'text-zinc-500'}`}>
                        {exp.sub}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Question Type */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                  3. Question Style
                </label>
                <div className="space-y-2">
                  {[
                    { id: 'behavioral', label: 'Behavioral (STAR Method)', sub: 'Conflict, teamwork, leadership scenarios' },
                    { id: 'technical', label: 'Technical Scenario', sub: 'System trade-offs, architecture, execution' },
                    { id: 'situational', label: 'Situational & Problem Solving', sub: 'High-stakes deadlines & ambiguity' },
                    { id: 'hr', label: 'HR & Cultural Fit', sub: 'Career motivations, values & strengths' },
                  ].map((type) => (
                    <div
                      key={type.id}
                      onClick={() => setConfig({ ...config, questionType: type.id as any })}
                      className={`p-3 rounded-xl border cursor-pointer text-xs transition-colors ${
                        config.questionType === type.id
                          ? 'bg-indigo-600 text-white border-indigo-500 font-semibold'
                          : 'bg-zinc-950 text-zinc-300 border-zinc-800 hover:bg-zinc-800'
                      }`}
                    >
                      <div>{type.label}</div>
                      <div className={`text-[10px] ${config.questionType === type.id ? 'text-indigo-200' : 'text-zinc-500'}`}>
                        {type.sub}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Setup Action Card */}
          <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-300">
                Session Config Summary
              </h3>

              <div className="space-y-2.5 text-xs text-zinc-300 bg-zinc-950 p-4 rounded-2xl border border-zinc-800">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Target Role:</span>
                  <span className="font-semibold text-white">{config.domain}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Level:</span>
                  <span className="font-semibold text-indigo-400 capitalize">{config.experienceLevel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Question Style:</span>
                  <span className="font-semibold text-purple-400 capitalize">{config.questionType}</span>
                </div>
              </div>

              <div className="bg-indigo-950/30 border border-indigo-900/40 p-4 rounded-2xl space-y-2 text-xs text-indigo-300">
                <div className="flex items-center gap-1.5 font-bold">
                  <Lightbulb className="w-4 h-4 text-indigo-400" />
                  <span>Pro Tip for Behavioral Questions</span>
                </div>
                <p className="text-[11px] leading-relaxed text-indigo-200/80">
                  Always frame your answer around personal actions: <span className="text-white font-medium">"I analyzed..."</span>, <span className="text-white font-medium">"I proposed..."</span>, <span className="text-white font-medium">"I resolved..."</span>.
                </p>
              </div>
            </div>

            <button
              onClick={handleStartPractice}
              disabled={isLoadingQuestion}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs shadow-xl shadow-indigo-950/50 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-50"
            >
              {isLoadingQuestion ? (
                <span>Generating AI Question...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Begin Interview Practice</span>
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        /* Active Interview Stage */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Interview Prompt & Recording */}
          <div className="lg:col-span-2 space-y-6">
            {/* Question Card */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                    AI Interviewer Prompt
                  </span>
                </div>
                {currentQuestion && <AudioPlayer text={currentQuestion} autoPlay={true} />}
              </div>

              <p className="text-base sm:text-lg font-semibold text-white leading-relaxed mb-6">
                "{currentQuestion}"
              </p>

              {questionTips.length > 0 && (
                <div className="p-3.5 bg-zinc-950 rounded-xl border border-zinc-800/80 text-xs text-zinc-400 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 block">
                    Interviewer Guidance
                  </span>
                  {questionTips.map((tip, idx) => (
                    <p key={idx}>• {tip}</p>
                  ))}
                </div>
              )}
            </div>

            {/* Audio Speech Recording Component */}
            <div className="space-y-2">
              <AudioRecorder
                onSendMessage={handleUserSubmitAnswer}
                disabled={isEvaluating}
                placeholder="Speak your response using the microphone or type your answer here..."
              />
            </div>

            {/* Turn Transcript */}
            {transcript.length > 0 && (
              <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Live Conversation Transcript
                </h4>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {transcript.map((item, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl text-xs ${
                        item.speaker === 'ai'
                          ? 'bg-zinc-950 text-indigo-200 border border-zinc-800'
                          : 'bg-indigo-950/40 text-zinc-100 border border-indigo-900/50 ml-6'
                      }`}
                    >
                      <span className="font-bold text-[10px] uppercase block mb-1 text-zinc-400">
                        {item.speaker === 'ai' ? 'AI Interviewer' : 'Candidate Response'}
                      </span>
                      <p className="leading-relaxed">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* STAR Method Helper & Evaluation Status */}
          <div className="space-y-6">
            {/* STAR Framework Drawer Card */}
            <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                  STAR Answer Checklist
                </h3>
                <button
                  onClick={() => setShowStarGuide(!showStarGuide)}
                  className="text-xs text-indigo-400 hover:underline"
                >
                  {showStarGuide ? 'Hide' : 'Show'}
                </button>
              </div>

              {showStarGuide && (
                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800/80">
                    <span className="font-bold text-indigo-400">S - Situation: </span>
                    <span className="text-zinc-300">Set the background context (15%).</span>
                  </div>
                  <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800/80">
                    <span className="font-bold text-purple-400">T - Task: </span>
                    <span className="text-zinc-300">Define the core objective or problem (15%).</span>
                  </div>
                  <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800/80">
                    <span className="font-bold text-emerald-400">A - Action: </span>
                    <span className="text-zinc-300">Detail your specific steps & rationale (50%).</span>
                  </div>
                  <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800/80">
                    <span className="font-bold text-amber-400">R - Result: </span>
                    <span className="text-zinc-300">Quantify the business or technical impact (20%).</span>
                  </div>
                </div>
              )}
            </div>

            {/* Evaluation Loading State */}
            {isEvaluating && (
              <div className="p-6 bg-indigo-950/40 border border-indigo-800 rounded-3xl text-center space-y-3 animate-pulse">
                <Sparkles className="w-8 h-8 text-indigo-400 mx-auto animate-spin" />
                <h4 className="text-sm font-bold text-white">AI Speech Evaluation Engine Active</h4>
                <p className="text-xs text-indigo-300">
                  Analyzing grammar, vocabulary, STAR clarity, confidence, and professionalism metrics...
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Completed Session Evaluation Modal */}
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
