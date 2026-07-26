import React, { useState } from 'react';
import { Sparkles, ArrowRight, UserCheck, Lock, Mail, User, Shield } from 'lucide-react';
import { DEFAULT_USER } from '../lib/mockData';

interface AuthPageProps {
  onLoginSuccess: (user: any) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('alex.chen@university.edu');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('Alex Chen');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess({
      ...DEFAULT_USER,
      name: name || DEFAULT_USER.name,
      email: email || DEFAULT_USER.email,
    });
  };

  const handleDemoLogin = () => {
    onLoginSuccess(DEFAULT_USER);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-zinc-950">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 p-0.5 mx-auto mb-3 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-zinc-950 rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-indigo-400" />
            </div>
          </div>
          <h1 className="text-2xl font-extrabold text-white">
            {isRegister ? 'Create Your Student Account' : 'Welcome Back'}
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            {isRegister
              ? 'Start tracking your AI communication scores today'
              : 'Sign in to access your practice sessions & progress'}
          </p>
        </div>

        {/* Quick Demo Access Button */}
        <button
          onClick={handleDemoLogin}
          className="w-full mb-6 p-3 rounded-xl bg-indigo-950/40 border border-indigo-800/50 hover:bg-indigo-900/40 text-indigo-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all group"
        >
          <UserCheck className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
          <span>Quick Login as Demo Student (Alex Chen)</span>
        </button>

        <div className="relative flex py-2 items-center mb-6">
          <div className="flex-grow border-t border-zinc-800" />
          <span className="flex-shrink mx-3 text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">Or Sign In With Email</span>
          <div className="flex-grow border-t border-zinc-800" />
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Chen"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@university.edu"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-950/50 flex items-center justify-center gap-2 transition-all mt-2"
          >
            <span>{isRegister ? 'Create Account' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Toggle Login/Register */}
        <div className="mt-6 text-center text-xs text-zinc-400">
          {isRegister ? 'Already have an account?' : "Don't have an account yet?"}{' '}
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-indigo-400 hover:underline font-semibold"
          >
            {isRegister ? 'Sign In' : 'Register'}
          </button>
        </div>
      </div>
    </div>
  );
};
