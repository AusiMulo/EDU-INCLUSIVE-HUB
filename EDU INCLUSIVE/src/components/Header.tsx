/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BookOpen, Award, Users, Flame, Sparkles } from 'lucide-react';

interface HeaderProps {
  currentView: 'student' | 'parent';
  onViewChange: (view: 'student' | 'parent') => void;
  xpPoints: number;
  streakDays: number;
}

export default function Header({
  currentView,
  onViewChange,
  xpPoints,
  streakDays
}: HeaderProps) {
  return (
    <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-slate-200 shrink-0 sticky top-0 z-40">
      {/* Logo Brand */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-xs">
          <BookOpen className="h-5.5 w-5.5" id="header_logo_icon" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight text-slate-800 leading-none">
            EduInclusive <span className="text-indigo-600 font-semibold text-xs uppercase tracking-wider">Hub</span>
          </h1>
          <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
            Inclusive Blended Learning Hub
          </span>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="hidden md:flex items-center gap-3">
        {/* Streak */}
        <div className="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100">
          <Flame className="h-4 w-4 text-amber-500 fill-amber-500 animate-pulse" />
          <span className="text-xs font-semibold text-amber-800">
            {streakDays} Day Streak!
          </span>
        </div>

        {/* XP Points */}
        <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
          <Award className="h-4 w-4 text-emerald-500" />
          <span className="text-xs font-semibold text-emerald-700">
            {xpPoints} XP Points
          </span>
        </div>

        {/* Inclusivity indicator */}
        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full text-xs font-medium text-slate-600">
          <Sparkles className="h-3.5 w-3.5 text-indigo-500 animate-pulse" />
          <span>ASL & IT Mode</span>
        </div>
      </div>

      {/* User Mode Toggles */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onViewChange('student')}
          id="btn_mode_student"
          className={`px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 ${
            currentView === 'student'
              ? 'bg-indigo-600 text-white shadow-sm scale-102'
              : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <span>🎈</span>
          <span>Student Playground</span>
        </button>

        <button
          onClick={() => onViewChange('parent')}
          id="btn_mode_parent"
          className={`px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 ${
            currentView === 'parent'
              ? 'bg-indigo-900 text-white shadow-sm scale-102'
              : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users className="h-3.5 w-3.5 text-indigo-400" />
          <span>Parent Portal</span>
        </button>
      </div>
    </header>
  );
}
