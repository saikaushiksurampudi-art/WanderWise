import React from 'react';
import { motion } from 'motion/react';
import { Compass, Sparkles, Briefcase, Code2, Heart } from 'lucide-react';

export type TabType = 'planner' | 'explore' | 'bookings' | 'saved' | 'architecture';

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  bookingsCount: number;
  savedPlacesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  bookingsCount,
  savedPlacesCount
}) => {
  const navItem = (
    id: TabType,
    label: string,
    icon: React.ReactNode,
    count?: number
  ) => {
    const isActive = activeTab === id;
    return (
      <button
        id={`nav-tab-${id}`}
        onClick={() => setActiveTab(id)}
        className={`relative flex items-center gap-2 px-2.5 sm:px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${
          isActive ? 'text-white' : 'text-slate-600 hover:text-slate-900'
        }`}
      >
        {isActive && (
          <motion.span
            layoutId="nav-active-pill"
            className="absolute inset-0 rounded-2xl bg-slate-900 shadow-sm"
            transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
          />
        )}
        <span className="relative z-10">{icon}</span>
        <span className="relative z-10 hidden sm:inline">{label}</span>
        {typeof count === 'number' && count > 0 && (
          <span className="relative z-10 w-5 h-5 rounded-full bg-emerald-500 text-white text-[10px] font-extrabold flex items-center justify-center ml-0.5">
            {count}
          </span>
        )}
      </button>
    );
  };

  return (
    <div className="sticky top-3 sm:top-4 z-40 px-3 sm:px-6 lg:px-8">
      <header className="max-w-7xl mx-auto bg-white/90 backdrop-blur-md border border-slate-200 rounded-[1.75rem] sm:rounded-[2rem] shadow-sm">
        <div className="px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-4">

          {/* Logo & Slogan */}
          <div
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group flex-shrink-0"
            onClick={() => setActiveTab('planner')}
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 p-0.5 shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform flex items-center justify-center flex-shrink-0">
              <Compass className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base sm:text-xl tracking-tight text-slate-900 font-display">
                  WanderWise
                </span>
                <span className="hidden sm:inline-flex px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-indigo-50 text-indigo-600 border border-indigo-200">
                  AI
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">Budget-Optimized Travel Concierge</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-0.5 sm:gap-2 overflow-x-auto py-1">
            {navItem('planner', 'AI Planner', <Sparkles className={`w-4 h-4 ${activeTab === 'planner' ? 'text-indigo-300' : 'text-indigo-600'}`} />)}
            {navItem('explore', 'Explore Cities', <Compass className="w-4 h-4" />)}
            {navItem('bookings', 'My Bookings', <Briefcase className="w-4 h-4" />, bookingsCount)}
            <button
              id="nav-tab-saved"
              onClick={() => setActiveTab('saved')}
              className={`relative flex items-center gap-2 px-2.5 sm:px-3 py-2 rounded-2xl text-xs sm:text-sm font-semibold transition-colors ${
                activeTab === 'saved' ? 'text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Saved Places Wishlist"
            >
              {activeTab === 'saved' && (
                <motion.span
                  layoutId="nav-active-pill"
                  className="absolute inset-0 rounded-2xl bg-slate-900 shadow-sm"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                />
              )}
              <Heart className={`relative z-10 w-4 h-4 ${activeTab === 'saved' ? 'text-pink-300' : 'text-pink-500'}`} />
              <span className="relative z-10 hidden sm:inline">Saved</span>
              {savedPlacesCount > 0 && (
                <span className="relative z-10 w-4 h-4 rounded-full bg-pink-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {savedPlacesCount}
                </span>
              )}
            </button>
          </nav>

          {/* User Profile & Architecture Doc Badge */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              id="btn-architecture-docs"
              onClick={() => setActiveTab('architecture')}
              className="hidden lg:flex items-center gap-1.5 px-3.5 py-2 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors"
            >
              <Code2 className="w-3.5 h-3.5 text-indigo-600" />
              <span>Architecture & API</span>
            </button>

            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-bold text-xs text-white shadow-sm">
                KS
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-slate-900">Kaushik S.</p>
                <p className="text-[10px] text-emerald-600 font-semibold">12,450 Travel Pts</p>
              </div>
            </div>
          </div>

        </div>
        </div>
      </header>
    </div>
  );
};
