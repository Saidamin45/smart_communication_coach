import React from 'react';
import { Radar, RadarChart as RechartsRadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { CommunicationMetrics } from '../types';

interface RadarChartProps {
  metrics: CommunicationMetrics;
  height?: number;
}

export const RadarChartComponent: React.FC<RadarChartProps> = ({ metrics, height = 280 }) => {
  const data = [
    { subject: 'Grammar', value: metrics.grammar, fullMark: 100 },
    { subject: 'Vocabulary', value: metrics.vocabulary, fullMark: 100 },
    { subject: 'Fluency', value: metrics.fluency, fullMark: 100 },
    { subject: 'Confidence', value: metrics.confidence, fullMark: 100 },
    { subject: 'Relevance', value: metrics.relevance, fullMark: 100 },
    { subject: 'Critical Think.', value: metrics.criticalThinking, fullMark: 100 },
    { subject: 'Professionalism', value: metrics.professionalism, fullMark: 100 },
  ];

  return (
    <div className="w-full relative" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadarChart cx="50%" cy="50%" outerRadius="72%" data={data}>
          <PolarGrid stroke="#27272a" />
          <PolarAngleAxis dataKey="subject" stroke="#a1a1aa" tick={{ fill: '#a1a1aa', fontSize: 11 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#3f3f46" tick={false} />
          <Radar
            name="Communication Score"
            dataKey="value"
            stroke="#818cf8"
            fill="#6366f1"
            fillOpacity={0.35}
          />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  );
};
