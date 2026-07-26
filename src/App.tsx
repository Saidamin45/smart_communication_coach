import React, { useState, useEffect } from 'react';
import { UserProfile, PracticeSession } from './types';
import { DEFAULT_USER, INITIAL_SESSIONS } from './lib/mockData';
import { getStoredSessions, savePracticeSession, getStoredUser, saveStoredUser } from './lib/storage';
import { Navbar } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { InterviewCoachPage } from './pages/InterviewCoachPage';
import { IELTSCoachPage } from './pages/IELTSCoachPage';
import { DebateCoachPage } from './pages/DebateCoachPage';
import { HistoryPage } from './pages/HistoryPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [user, setUser] = useState<UserProfile>(DEFAULT_USER);
  const [sessions, setSessions] = useState<PracticeSession[]>([]);

  // Load persistent user & session data on mount
  useEffect(() => {
    const loadedSessions = getStoredSessions();
    setSessions(loadedSessions);

    const loadedUser = getStoredUser();
    setUser(loadedUser);
  }, []);

  const handleLoginSuccess = (loggedInUser: UserProfile) => {
    setUser(loggedInUser);
    setIsLoggedIn(true);
    saveStoredUser(loggedInUser);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveTab('landing');
  };

  const handleFinishSession = (newSession: PracticeSession) => {
    setSessions((prev) => [newSession, ...prev]);
  };

  const handleResetDemoData = () => {
    localStorage.clear();
    setSessions(INITIAL_SESSIONS);
    setUser(DEFAULT_USER);
    alert('Demo data reset successfully.');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
      />

      {/* Main Page Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'landing' && (
          <LandingPage
            onStartPractice={(mode) => {
              if (!isLoggedIn) {
                setIsLoggedIn(true); // Auto-login as demo student for seamless experience
              }
              setActiveTab(mode || 'dashboard');
            }}
            onLogin={() => {
              setIsLoggedIn(true);
              setActiveTab('dashboard');
            }}
          />
        )}

        {activeTab === 'auth' && (
          <AuthPage onLoginSuccess={handleLoginSuccess} />
        )}

        {activeTab === 'dashboard' && isLoggedIn && (
          <DashboardPage
            user={user}
            sessions={sessions}
            onStartMode={(mode) => setActiveTab(mode)}
            onViewHistory={() => setActiveTab('history')}
          />
        )}

        {activeTab === 'interview' && isLoggedIn && (
          <InterviewCoachPage
            userId={user.id}
            onFinishSession={handleFinishSession}
          />
        )}

        {activeTab === 'ielts' && isLoggedIn && (
          <IELTSCoachPage
            userId={user.id}
            onFinishSession={handleFinishSession}
          />
        )}

        {activeTab === 'debate' && isLoggedIn && (
          <DebateCoachPage
            userId={user.id}
            onFinishSession={handleFinishSession}
          />
        )}

        {activeTab === 'history' && isLoggedIn && (
          <HistoryPage sessions={sessions} />
        )}

        {activeTab === 'profile' && isLoggedIn && (
          <ProfilePage user={user} sessions={sessions} />
        )}

        {activeTab === 'settings' && isLoggedIn && (
          <SettingsPage
            user={user}
            onUpdateUser={(updated) => {
              setUser(updated);
              saveStoredUser(updated);
            }}
            onResetData={handleResetDemoData}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/80 py-6 text-center text-xs text-zinc-500 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 AI Communication Coach • University Capstone Final-Year Project</p>
          <p className="text-[11px] text-zinc-600">
            Powered by Server-Side Gemini 2.5 Flash Engine & Recharts Analytics
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
