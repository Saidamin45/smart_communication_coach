import { PracticeSession, UserProfile, UserSettings, DailyPracticeTrack } from '../types';
import { DEFAULT_USER, DEFAULT_SETTINGS, INITIAL_SESSIONS, MOCK_DAILY_TRACKS } from './mockData';

const STORAGE_KEYS = {
  USER: 'ai_comm_coach_user_v1',
  SESSIONS: 'ai_comm_coach_sessions_v1',
  SETTINGS: 'ai_comm_coach_settings_v1',
  DAILY_TRACKS: 'ai_comm_coach_daily_v1',
};

export function getUserProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse user profile from local storage', e);
  }
  return DEFAULT_USER;
}

export function saveUserProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save user profile', e);
  }
}

export function getPracticeSessions(): PracticeSession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse practice sessions', e);
  }
  return INITIAL_SESSIONS;
}

export function savePracticeSession(session: PracticeSession): PracticeSession[] {
  const current = getPracticeSessions();
  const updated = [session, ...current.filter(s => s.id !== session.id)];
  try {
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save practice session', e);
  }

  // Also update daily tracks & user streak
  updateDailyTrack(session.durationSeconds, session.scores.overallScore);
  return updated;
}

export function getUserSettings(): UserSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse settings', e);
  }
  return DEFAULT_SETTINGS;
}

export function saveUserSettings(settings: UserSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings', e);
  }
}

export function getDailyTracks(): DailyPracticeTrack[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DAILY_TRACKS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse daily tracks', e);
  }
  return MOCK_DAILY_TRACKS;
}

export function updateDailyTrack(durationSec: number, score: number): void {
  const today = new Date().toISOString().split('T')[0];
  const tracks = getDailyTracks();
  const existingIndex = tracks.findIndex(t => t.date === today);

  const durationMin = Math.max(1, Math.round(durationSec / 60));

  if (existingIndex >= 0) {
    const existing = tracks[existingIndex];
    const newCount = existing.sessionsCompleted + 1;
    const newAvg = Math.round((existing.averageScore * existing.sessionsCompleted + score) / newCount);
    tracks[existingIndex] = {
      date: today,
      minutesPracticed: existing.minutesPracticed + durationMin,
      sessionsCompleted: newCount,
      averageScore: newAvg,
    };
  } else {
    tracks.push({
      date: today,
      minutesPracticed: durationMin,
      sessionsCompleted: 1,
      averageScore: score,
    });
  }

  try {
    localStorage.setItem(STORAGE_KEYS.DAILY_TRACKS, JSON.stringify(tracks));
  } catch (e) {
    console.error('Failed to update daily track', e);
  }

  // Update streak in user profile if last active was yesterday or today
  const user = getUserProfile();
  const lastDate = user.lastActiveDate;
  if (lastDate !== today) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    let newStreak = user.streakDays;
    if (lastDate === yesterday) {
      newStreak += 1;
    } else {
      newStreak = 1; // streak reset
    }
    saveUserProfile({
      ...user,
      streakDays: newStreak,
      lastActiveDate: today,
    });
  }
}

export function getStoredSessions(): PracticeSession[] {
  return getPracticeSessions();
}

export function getStoredUser(): UserProfile {
  return getUserProfile();
}

export function saveStoredUser(user: UserProfile): void {
  saveUserProfile(user);
}

export function calculateAggregateMetrics(sessions: PracticeSession[]) {
  if (sessions.length === 0) {
    return {
      grammar: 80,
      vocabulary: 80,
      fluency: 80,
      confidence: 80,
      relevance: 80,
      criticalThinking: 80,
      professionalism: 80,
      overallScore: 80,
      totalSessions: 0,
      totalMinutes: 0,
    };
  }

  const sum = sessions.reduce(
    (acc, s) => ({
      grammar: acc.grammar + s.scores.grammar,
      vocabulary: acc.vocabulary + s.scores.vocabulary,
      fluency: acc.fluency + s.scores.fluency,
      confidence: acc.confidence + s.scores.confidence,
      relevance: acc.relevance + s.scores.relevance,
      criticalThinking: acc.criticalThinking + s.scores.criticalThinking,
      professionalism: acc.professionalism + s.scores.professionalism,
      overallScore: acc.overallScore + s.scores.overallScore,
      totalSec: acc.totalSec + s.durationSeconds,
    }),
    {
      grammar: 0,
      vocabulary: 0,
      fluency: 0,
      confidence: 0,
      relevance: 0,
      criticalThinking: 0,
      professionalism: 0,
      overallScore: 0,
      totalSec: 0,
    }
  );

  const n = sessions.length;
  return {
    grammar: Math.round(sum.grammar / n),
    vocabulary: Math.round(sum.vocabulary / n),
    fluency: Math.round(sum.fluency / n),
    confidence: Math.round(sum.confidence / n),
    relevance: Math.round(sum.relevance / n),
    criticalThinking: Math.round(sum.criticalThinking / n),
    professionalism: Math.round(sum.professionalism / n),
    overallScore: Math.round(sum.overallScore / n),
    totalSessions: n,
    totalMinutes: Math.round(sum.totalSec / 60),
  };
}
