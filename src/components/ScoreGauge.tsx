import React from 'react';

interface ScoreGaugeProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  score,
  size = 140,
  strokeWidth = 12,
  label = 'Overall Score',
  sublabel,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  let colorClass = 'text-emerald-500';
  let bgGradient = 'from-emerald-500/20 to-emerald-500/5';
  let badgeText = 'Excellent';

  if (score < 65) {
    colorClass = 'text-amber-500';
    bgGradient = 'from-amber-500/20 to-amber-500/5';
    badgeText = 'Needs Work';
  } else if (score < 80) {
    colorClass = 'text-indigo-400';
    bgGradient = 'from-indigo-500/20 to-indigo-500/5';
    badgeText = 'Good';
  } else if (score >= 90) {
    colorClass = 'text-purple-400';
    bgGradient = 'from-purple-500/20 to-purple-500/5';
    badgeText = 'Mastery';
  }

  return (
    <div className="flex flex-col items-center justify-center relative">
      <div className={`relative flex items-center justify-center p-2 rounded-full bg-gradient-to-b ${bgGradient}`}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className="stroke-zinc-800"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className={`${colorClass} transition-all duration-1000 ease-out`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-bold tracking-tight text-zinc-100">{score}</span>
          <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-400">{sublabel || badgeText}</span>
        </div>
      </div>
      {label && <span className="mt-2 text-xs font-medium text-zinc-400">{label}</span>}
    </div>
  );
};
