/**
 * AI Communication Coach - Data Models & Types
 */

export type SessionMode = 'interview' | 'ielts' | 'debate';

export type UserRole = 'student' | 'job_seeker' | 'professional' | 'other';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  targetGoal: string;
  avatarUrl?: string;
  createdAt: string;
  streakDays: number;
  lastActiveDate: string;
  targetIELTSBand?: number;
  targetInterviewScore?: number;
}

export interface CommunicationMetrics {
  grammar: number;         // 0 - 100
  vocabulary: number;      // 0 - 100
  fluency: number;         // 0 - 100
  confidence: number;      // 0 - 100
  relevance: number;       // 0 - 100
  criticalThinking: number; // 0 - 100
  professionalism: number; // 0 - 100
  overallScore: number;    // 0 - 100
  ieltsBandScore?: number; // 1.0 - 9.0 (for IELTS mode)
}

export interface FeedbackItem {
  category: 'strength' | 'improvement' | 'grammar_fix' | 'vocabulary_upgrade';
  title: string;
  description: string;
  originalText?: string;
  suggestedText?: string;
}

export interface PracticeSession {
  id: string;
  userId: string;
  mode: SessionMode;
  title: string;           // e.g. "Software Engineer Interview", "IELTS Part 2 Cue Card", "AI in Education Debate"
  topicOrRole: string;     // e.g. "Frontend Engineer", "Environment & Technology", "Pro: Remote Work"
  durationSeconds: number;
  completedAt: string;
  scores: CommunicationMetrics;
  transcript: {
    speaker: 'ai' | 'user';
    text: string;
    timestamp: number;
    audioUrl?: string;
  }[];
  keyStrengths: string[];
  areasToImprove: string[];
  actionableTips: string[];
  modelAnswerSummary?: string;
  ieltsPartDetails?: {
    part1Score?: number;
    part2Score?: number;
    part3Score?: number;
  };
}

export interface DailyPracticeTrack {
  date: string; // YYYY-MM-DD
  minutesPracticed: number;
  sessionsCompleted: number;
  averageScore: number;
}

export interface InterviewConfig {
  domain: string;
  experienceLevel: 'entry' | 'mid' | 'senior';
  questionType: 'behavioral' | 'technical' | 'situational' | 'hr';
  companyStyle?: string;
}

export interface IELTSConfig {
  part: 'part1' | 'part2' | 'part3' | 'full';
  topic: string;
  targetBand: number;
}

export interface DebateConfig {
  topic: string;
  side: 'pro' | 'con';
  aiPersona: 'supportive_mentor' | 'tough_adversary' | 'socratic_examiner';
  numTurns: number;
}

export interface UserSettings {
  darkMode: boolean;
  aiVoiceEnabled: boolean;
  voiceGender: 'female' | 'male';
  speechRate: number; // 0.8 - 1.2
  autoRecordAudio: boolean;
  showTimer: boolean;
  preferredLanguage: string;
}
