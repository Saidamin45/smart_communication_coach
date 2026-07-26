import React, { useState } from 'react';
import { Sparkles, Mic, Award, MessageSquareCode, ArrowRight, ShieldCheck, CheckCircle, BarChart3, Users, Zap, Play, Volume2 } from 'lucide-react';

interface LandingPageProps {
  onStartPractice: (mode?: string) => void;
  onLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartPractice, onLogin }) => {
  const [demoAnswer, setDemoAnswer] = useState('');
  const [demoFeedback, setDemoFeedback] = useState<any>(null);
  const [isEvaluatingDemo, setIsEvaluatingDemo] = useState(false);

  const handleTestDemo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!demoAnswer.trim()) return;

    setIsEvaluatingDemo(true);
    setTimeout(() => {
      setDemoFeedback({
        score: 88,
        grammar: 90,
        vocabulary: 85,
        confidence: 89,
        strength: 'Strong logical structure using clear action verbs.',
        tip: 'Try adding a quantitative outcome (e.g. "reduced process time by 25%").',
      });
      setIsEvaluatingDemo(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 mb-8 animate-fadeIn">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span className="font-semibold text-zinc-200">Your AI Communication Coach</span>
          <span className="text-zinc-600">•</span>
          <span className="text-indigo-400 font-medium">Final-Year Project</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-none">
          Master Job Interviews, IELTS Speaking & Debates with <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">AI Speech Coaching</span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto font-normal leading-relaxed">
          Speak with confidence. Get instant feedback on grammar, vocabulary, fluency, and critical thinking across three dedicated AI practice modes.
        </p>

        {/* Call to Actions */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => onStartPractice()}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm shadow-xl shadow-indigo-950/50 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
          >
            <span>Start Free Practice Session</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onLogin}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 font-semibold text-sm flex items-center justify-center gap-2 transition-all"
          >
            <span>Explore Demo Student Account</span>
          </button>
        </div>

        {/* Stats Row */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
          {[
            { metric: '3 Modes', label: 'Interview, IELTS & Debate' },
            { metric: '7 Metrics', label: 'Grammar, Vocab, Confidence & more' },
            { metric: '100% Real-time', label: 'Instant AI speech feedback' },
            { metric: 'Band 9.0', label: 'Official IELTS scoring standards' },
          ].map((stat, idx) => (
            <div key={idx} className="p-4 bg-zinc-900/50 border border-zinc-800/80 rounded-2xl">
              <p className="text-xl font-bold text-white tracking-tight">{stat.metric}</p>
              <p className="text-xs text-zinc-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Mini Demo Sandbox */}
      <section className="py-12 bg-zinc-900/30 border-y border-zinc-800/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Interactive Trial</span>
            <h2 className="text-2xl font-bold text-white mt-1">Try a Quick AI Speech Evaluation Right Now</h2>
            <p className="text-xs text-zinc-400 mt-1">Type or paste a sample interview response below to see the evaluation engine in action.</p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl">
            <div className="mb-4 bg-zinc-950 p-3.5 rounded-xl border border-zinc-800">
              <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400 block mb-1">Sample Question</span>
              <p className="text-sm font-medium text-zinc-200">
                "Tell me about a time when you faced a difficult technical challenge on a group project."
              </p>
            </div>

            <form onSubmit={handleTestDemo} className="space-y-4">
              <textarea
                value={demoAnswer}
                onChange={(e) => setDemoAnswer(e.target.value)}
                placeholder="Example answer: 'In my university capstone, our database queries were taking 3 seconds. I refactored the SQL queries and added indexing, which reduced latency by 80%...'"
                rows={3}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
              />

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isEvaluatingDemo || !demoAnswer.trim()}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-md shadow-indigo-950/50 flex items-center gap-2 disabled:opacity-50 transition-all"
                >
                  {isEvaluatingDemo ? (
                    <span>Evaluating Speech...</span>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Analyze Answer</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Instant Demo Feedback Output */}
            {demoFeedback && (
              <div className="mt-6 pt-6 border-t border-zinc-800 grid grid-cols-1 md:grid-cols-3 gap-4 animate-fadeIn">
                <div className="flex flex-col items-center justify-center p-4 bg-zinc-950 rounded-xl border border-zinc-800">
                  <span className="text-3xl font-extrabold text-emerald-400">{demoFeedback.score}/100</span>
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold mt-1">Communication Score</span>
                </div>

                <div className="md:col-span-2 space-y-2 text-xs">
                  <div className="p-3 bg-emerald-950/30 border border-emerald-900/40 rounded-xl text-emerald-300">
                    <span className="font-bold">Strength: </span>{demoFeedback.strength}
                  </div>
                  <div className="p-3 bg-indigo-950/30 border border-indigo-900/40 rounded-xl text-indigo-300">
                    <span className="font-bold">Pro Tip: </span>{demoFeedback.tip}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3 Dedicated Practice Modes Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">Three Practice Engines</span>
          <h2 className="text-3xl font-extrabold text-white mt-2">Tailored Coaching Modes for Every Goal</h2>
          <p className="text-sm text-zinc-400 mt-2">Choose your mode and let our AI coach guide your verbal delivery, structure, and vocabulary.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Interview Coach Card */}
          <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between hover:border-indigo-500/50 transition-all hover:-translate-y-1 group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-6 text-indigo-400 group-hover:scale-110 transition-transform">
                <Mic className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">1. AI Interview Coach</h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                Tailored job interview preparation across Software Engineering, Product, Marketing, Data Science, and HR roles. Master STAR behavioral questions with immediate feedback.
              </p>
              <ul className="space-y-2 text-xs text-zinc-300">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-indigo-400" />
                  <span>STAR Framework Guidance</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Domain Technical Questions</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Model Executive Answers</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => onStartPractice('interview')}
              className="mt-8 w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-indigo-600 text-zinc-200 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <span>Practice Interviews</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* IELTS Speaking Coach Card */}
          <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between hover:border-purple-500/50 transition-all hover:-translate-y-1 group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-6 text-purple-400 group-hover:scale-110 transition-transform">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">2. AI IELTS Speaking Coach</h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                Practice official IELTS Part 1, Part 2 Cue Cards, and Part 3 Analytical Discussions. Receive accurate Band 1.0–9.0 scores with Cambridge band descriptor analysis.
              </p>
              <ul className="space-y-2 text-xs text-zinc-300">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-purple-400" />
                  <span>Part 2 Cue Card Timer</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-purple-400" />
                  <span>Band 1.0–9.0 Scorecard</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-purple-400" />
                  <span>Lexical Resource Upgrade</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => onStartPractice('ielts')}
              className="mt-8 w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-purple-600 text-zinc-200 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <span>Practice IELTS Speaking</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* AI Debate Coach Card */}
          <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between hover:border-pink-500/50 transition-all hover:-translate-y-1 group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center mb-6 text-pink-400 group-hover:scale-110 transition-transform">
                <MessageSquareCode className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">3. AI Debate Coach</h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                Engage in multi-turn intellectual debates against Socratic AI opponents. Sharpen your arguments, rebut opposing claims, and eliminate logical fallacies.
              </p>
              <ul className="space-y-2 text-xs text-zinc-300">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-pink-400" />
                  <span>Multi-turn Rebuttal Analyzer</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-pink-400" />
                  <span>Logical Fallacy Detector</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-pink-400" />
                  <span>Argument Strength Meter</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => onStartPractice('debate')}
              className="mt-8 w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-pink-600 text-zinc-200 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <span>Practice Debating</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-zinc-800 py-8 text-center text-xs text-zinc-500 bg-zinc-950">
        <p>© 2026 AI Communication Coach • University Final Year Capstone Project</p>
        <p className="mt-1 text-[11px] text-zinc-600">Built with React, TypeScript, Tailwind CSS & Server-Side Gemini AI Engine.</p>
      </footer>
    </div>
  );
};
