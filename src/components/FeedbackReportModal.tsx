import React from 'react';
import { PracticeSession } from '../types';
import { ScoreGauge } from './ScoreGauge';
import { RadarChartComponent } from './RadarChart';
import { CheckCircle2, AlertCircle, Lightbulb, Trophy, ArrowRight, Award, RotateCcw, X, FileText, Check } from 'lucide-react';

interface FeedbackReportModalProps {
  session: PracticeSession;
  onClose: () => void;
  onRetake?: () => void;
}

export const FeedbackReportModal: React.FC<FeedbackReportModalProps> = ({ session, onClose, onRetake }) => {
  const { scores, keyStrengths, areasToImprove, actionableTips, modelAnswerSummary, title, mode } = session;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
              <Trophy className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-100">{title}</h2>
              <p className="text-xs text-zinc-400">AI Speech & Communication Evaluation Report</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
          {/* Top Score Summary Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-zinc-950/80 p-6 rounded-2xl border border-zinc-800/80">
            {/* Overall Score Gauge */}
            <div className="flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-zinc-800 pb-4 md:pb-0">
              <ScoreGauge score={scores.overallScore} size={150} label="Overall Score" />
              {mode === 'ielts' && scores.ieltsBandScore && (
                <div className="mt-3 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-sm flex items-center gap-1.5">
                  <Award className="w-4 h-4" />
                  <span>IELTS Band {scores.ieltsBandScore.toFixed(1)}</span>
                </div>
              )}
            </div>

            {/* 7 Communication Dimensions Breakdown */}
            <div className="md:col-span-2 space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Communication Dimensions Scorecard
              </h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                {[
                  { label: 'Grammar', score: scores.grammar, color: 'bg-emerald-500' },
                  { label: 'Vocabulary', score: scores.vocabulary, color: 'bg-indigo-500' },
                  { label: 'Fluency', score: scores.fluency, color: 'bg-blue-500' },
                  { label: 'Confidence', score: scores.confidence, color: 'bg-purple-500' },
                  { label: 'Relevance', score: scores.relevance, color: 'bg-teal-500' },
                  { label: 'Critical Thinking', score: scores.criticalThinking, color: 'bg-amber-500' },
                  { label: 'Professionalism', score: scores.professionalism, color: 'bg-rose-500' },
                ].map((item) => (
                  <div key={item.label} className="flex flex-col gap-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-300 font-medium">{item.label}</span>
                      <span className="text-zinc-100 font-bold">{item.score}/100</span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.color} rounded-full transition-all duration-700`}
                        style={{ width: `${item.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Radar Chart & Key Strengths / Areas to Improve */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Radar Chart */}
            <div className="bg-zinc-950/50 p-5 rounded-2xl border border-zinc-800 flex flex-col items-center justify-center">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                Skills Radar Visualization
              </h3>
              <RadarChartComponent metrics={scores} height={240} />
            </div>

            {/* Strengths & Areas to Improve */}
            <div className="space-y-4">
              {/* Key Strengths */}
              <div className="bg-emerald-950/20 border border-emerald-900/40 p-4 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Key Strengths</span>
                </div>
                <ul className="space-y-1.5 text-xs text-zinc-300">
                  {keyStrengths.map((str, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Areas to Improve */}
              <div className="bg-amber-950/20 border border-amber-900/40 p-4 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>Areas for Growth</span>
                </div>
                <ul className="space-y-1.5 text-xs text-zinc-300">
                  {areasToImprove.map((area, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{area}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Actionable Recommendations */}
          <div className="bg-indigo-950/20 border border-indigo-900/40 p-5 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm">
              <Lightbulb className="w-4 h-4" />
              <span>Actionable AI Recommendations for Next Session</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {actionableTips.map((tip, idx) => (
                <div key={idx} className="p-3 bg-zinc-900/80 rounded-xl border border-zinc-800 text-xs text-zinc-200 flex items-start gap-2">
                  <div className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold text-[10px]">
                    Tip #{idx + 1}
                  </div>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Exemplary Model Answer Summary */}
          {modelAnswerSummary && (
            <div className="bg-zinc-950/70 border border-zinc-800 p-5 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-purple-400 font-semibold text-sm">
                <FileText className="w-4 h-4" />
                <span>Exemplary Model Response Pattern</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-900 p-3.5 rounded-xl border border-zinc-800 italic">
                "{modelAnswerSummary}"
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-800 bg-zinc-950/50">
          {onRetake ? (
            <button
              onClick={onRetake}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Practice</span>
            </button>
          ) : <div />}

          <button
            onClick={onClose}
            className="flex items-center gap-2 px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-950/50 transition-all"
          >
            <span>Close Report</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
