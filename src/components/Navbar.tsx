import React, { useState } from 'react';
import { UserProfile } from '../types';
import {
  Sparkles,
  Flame,
  User,
  LogOut,
  LayoutDashboard,
  Mic,
  Award,
  MessageSquareCode,
  History,
  Settings,
  UserCheck,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: UserProfile;
  isLoggedIn: boolean;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  user,
  isLoggedIn,
  onLogout,
}) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'interview', label: 'Interview Coach', icon: Mic },
    { id: 'ielts', label: 'IELTS Coach', icon: Award },
    { id: 'debate', label: 'Debate Coach', icon: MessageSquareCode },
    { id: 'history', label: 'History', icon: History },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => setActiveTab(isLoggedIn ? 'dashboard' : 'landing')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-indigo-400" />
              </div>
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                AI Comm<span className="text-indigo-400">Coach</span>
              </span>
              <span className="text-[10px] text-zinc-400 font-medium tracking-wide uppercase block -mt-1">
                Personal Communication Coach
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          {isLoggedIn && (
            <nav className="hidden md:flex items-center gap-1 bg-zinc-900/80 p-1 rounded-xl border border-zinc-800/80">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-zinc-800 text-white shadow-sm font-semibold'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-400' : ''}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          )}
        </div>

        {/* Right Actions (Streak, Auth / User Profile) */}
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              {/* Daily Streak Badge */}
              <div
                onClick={() => setActiveTab('profile')}
                className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold hover:bg-amber-500/20 transition-colors"
                title={`${user.streakDays} Day Practice Streak!`}
              >
                <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
                <span>{user.streakDays}d Streak</span>
              </div>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 transition-colors"
                >
                  <img
                    src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'}
                    alt={user.name}
                    className="w-7 h-7 rounded-lg object-cover"
                  />
                  <span className="hidden sm:inline text-xs font-medium text-zinc-200">{user.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                </button>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl py-1 z-50 animate-fadeIn">
                    <div className="px-3 py-2 border-b border-zinc-800">
                      <p className="text-xs font-semibold text-zinc-100">{user.name}</p>
                      <p className="text-[10px] text-zinc-400 truncate">{user.email}</p>
                    </div>

                    <button
                      onClick={() => {
                        setActiveTab('profile');
                        setUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-white"
                    >
                      <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
                      <span>My Profile & Stats</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('settings');
                        setUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-white"
                    >
                      <Settings className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Settings & Preferences</span>
                    </button>

                    <div className="border-t border-zinc-800 my-1" />

                    <button
                      onClick={() => {
                        onLogout();
                        setUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:bg-rose-950/30"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('auth')}
                className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-300 hover:text-white transition-colors"
              >
                Log In
              </button>
              <button
                onClick={() => setActiveTab('auth')}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold shadow-md shadow-indigo-950/50 transition-all"
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isLoggedIn && mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-800 bg-zinc-950 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive ? 'bg-indigo-600 text-white font-semibold' : 'text-zinc-400 hover:bg-zinc-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
