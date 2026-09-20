import React, { useState } from 'react';
import { Terminal, Sparkles, User, LogOut, Plus, ChevronDown, CheckCircle, Zap } from 'lucide-react';
import { UserAccount, CodingProfile } from '../types/index';

interface NavbarProps {
  user: UserAccount | null;
  profiles: CodingProfile[];
  activeTab: 'dashboard' | 'coach' | 'problems' | 'animator';
  setActiveTab: (tab: 'dashboard' | 'coach' | 'problems' | 'animator') => void;
  onOpenAuth: () => void;
  onOpenOnboarding: () => void;
  onLogout: () => void;
  onSyncProfiles?: () => void;
  isAnalyzing: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  profiles,
  activeTab,
  setActiveTab,
  onOpenAuth,
  onOpenOnboarding,
  onLogout,
  onSyncProfiles,
  isAnalyzing,
}) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const successfulProfiles = profiles.filter(p => p.fetchStatus !== 'error');
  const totalSolved = successfulProfiles.reduce((acc, p) => acc + (p.problemsSolved || 0), 0);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2.5 text-left transition-opacity hover:opacity-90"
            id="brand-logo-btn"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-zinc-900 to-zinc-700 text-white shadow-sm ring-1 ring-zinc-900/10">
              <Terminal className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold tracking-tight text-zinc-900 text-lg">CodeTrack</span>
                <span className="rounded-md bg-emerald-100 px-1.5 py-0.5 font-semibold text-emerald-800 text-xs tracking-wide">
                  AI
                </span>
              </div>
              <p className="text-zinc-500 text-xs hidden sm:block">Live Profile Analyzer & Algorithm Coach</p>
            </div>
          </button>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              id="nav-tab-dashboard"
              onClick={() => setActiveTab('dashboard')}
              className={`rounded-lg px-3.5 py-2 font-medium text-sm transition-colors ${
                activeTab === 'dashboard'
                  ? 'bg-zinc-100 text-zinc-900 font-semibold'
                  : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
              }`}
            >
              Dashboard
            </button>
            <button
              id="nav-tab-coach"
              onClick={() => setActiveTab('coach')}
              className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 font-medium text-sm transition-colors ${
                activeTab === 'coach'
                  ? 'bg-zinc-100 text-zinc-900 font-semibold'
                  : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
              }`}
            >
              <Sparkles className="h-4 w-4 text-emerald-600" />
              AI Coach & Roadmap
            </button>
            <button
              id="nav-tab-problems"
              onClick={() => setActiveTab('problems')}
              className={`rounded-lg px-3.5 py-2 font-medium text-sm transition-colors ${
                activeTab === 'problems'
                  ? 'bg-zinc-100 text-zinc-900 font-semibold'
                  : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
              }`}
            >
              Problems & Solutions
            </button>
            <button
              id="nav-tab-animator"
              onClick={() => setActiveTab('animator')}
              className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 font-medium text-sm transition-colors ${
                activeTab === 'animator'
                  ? 'bg-emerald-50 text-emerald-900 font-semibold ring-1 ring-emerald-200'
                  : 'text-emerald-700 hover:bg-emerald-50/60'
              }`}
            >
              <Zap className="h-4 w-4 text-emerald-600 animate-pulse" />
              Algorithm Animator
            </button>
          </nav>
        </div>

        {/* Right Action Area */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Sync & Reanalyze Button if profiles exist */}
          {profiles.length > 0 && onSyncProfiles && (
            <button
              id="btn-nav-sync"
              onClick={onSyncProfiles}
              disabled={isAnalyzing}
              className="flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50/70 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-emerald-900 shadow-2xs hover:bg-emerald-100/70 transition-colors disabled:opacity-50"
              title="Refresh live profile stats and re-calculate AI analysis"
            >
              <Zap className={`h-3.5 w-3.5 text-emerald-600 ${isAnalyzing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{isAnalyzing ? 'Syncing...' : 'Sync & Reanalyze'}</span>
            </button>
          )}

          {/* Connect Profile Button */}
          <button
            id="btn-connect-profiles"
            onClick={onOpenOnboarding}
            className="flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-zinc-800 shadow-2xs hover:bg-zinc-50 transition-colors"
          >
            <Plus className="h-3.5 w-3.5 text-emerald-600" />
            <span className="hidden sm:inline">Connect Profile</span>
            <span className="sm:hidden">Add</span>
          </button>

          {/* User Account / Login State */}
          {user ? (
            <div className="relative">
              <button
                id="btn-user-menu"
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white p-1.5 pr-2.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
              >
                <img
                  src={user.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(user.email)}`}
                  alt={user.name}
                  className="h-7 w-7 rounded-lg object-cover ring-1 ring-zinc-200"
                />
                <span className="max-w-[100px] truncate font-semibold text-zinc-900">{user.name}</span>
                <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
              </button>

              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-zinc-200 bg-white p-2 shadow-xl z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-2 border-b border-zinc-100">
                    <p className="text-xs font-bold text-zinc-900 truncate">{user.name}</p>
                    <p className="text-[11px] text-zinc-400 truncate">{user.email}</p>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        onOpenOnboarding();
                        setShowUserDropdown(false);
                      }}
                      className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-zinc-700 hover:bg-zinc-50 text-left"
                    >
                      <Plus className="h-3.5 w-3.5 text-zinc-400" />
                      <span>Manage Platform Profiles</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('coach');
                        setShowUserDropdown(false);
                      }}
                      className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-zinc-700 hover:bg-zinc-50 text-left"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                      <span>AI Coaching Plan</span>
                    </button>
                  </div>

                  <div className="pt-1 border-t border-zinc-100">
                    <button
                      id="btn-logout"
                      onClick={() => {
                        onLogout();
                        setShowUserDropdown(false);
                      }}
                      className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 text-left font-medium"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              id="btn-nav-login"
              onClick={onOpenAuth}
              className="flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-zinc-800 transition-colors"
            >
              <User className="h-3.5 w-3.5" />
              <span>Sign In / Register</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
