/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Lock, Unlock, Eye, Sparkles, CheckCircle2, Award, Calendar, PlusCircle, Trash2 } from 'lucide-react';
import { StudentProgress, Goal } from '../types';

interface ParentDashboardProps {
  progress: StudentProgress;
  onAddGoal: (text: string, category: string, target: number) => void;
  onDeleteGoal: (id: string) => void;
  onResetProgress: () => void;
  activityLogs: { text: string; time: string; xp: number }[];
}

export default function ParentDashboard({
  progress,
  onAddGoal,
  onDeleteGoal,
  onResetProgress,
  activityLogs
}: ParentDashboardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinCode, setPinCode] = useState('');
  const [pinError, setPinError] = useState('');

  // Custom goals planner state
  const [newGoalText, setNewGoalText] = useState('');
  const [newGoalCat, setNewGoalCat] = useState('math');
  const [newGoalTarget, setNewGoalTarget] = useState(1);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinCode === '1234') {
      setIsAuthenticated(true);
      setPinError('');
    } else {
      setPinError('Incorrect Parent Pin! Hint: Type "1234" to enter!');
    }
  };

  // Convert progress state into structured Recharts chart data
  const chartData = [
    {
      subject: 'Mathematics',
      'Quiz Score (%)': progress.quizScores['quiz_pre_math'] || 0,
      'Completed Lessons': progress.completedLessons.filter((l) => l.includes('math')).length * 50
    },
    {
      subject: 'Science',
      'Quiz Score (%)': progress.quizScores['quiz_primary_science'] || 0,
      'Completed Lessons': progress.completedLessons.filter((l) => l.includes('science')).length * 50
    },
    {
      subject: 'English Spelling',
      'Quiz Score (%)': progress.quizScores['quiz_english'] || 0,
      'Completed Lessons': progress.completedLessons.filter((l) => l.includes('english')).length * 50
    },
    {
      subject: 'IT Technology',
      'Quiz Score (%)': progress.quizScores['quiz_it_basics'] || 0,
      'Completed Lessons': progress.completedLessons.filter((l) => l.includes('it')).length * 50
    },
    {
      subject: 'Sign Language',
      'Quiz Score (%)': progress.quizScores['quiz_sign_language'] || 0,
      'Completed Lessons': progress.completedLessons.filter((l) => l.includes('sign')).length * 50
    }
  ];

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalText.trim()) return;
    onAddGoal(newGoalText, newGoalCat, newGoalTarget);
    setNewGoalText('');
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-3xl border border-slate-200 p-8 shadow-sm text-center" id="section_parent_lock">
        <div className="mx-auto h-16 w-16 bg-purple-50 rounded-full flex items-center justify-center text-purple-600 mb-4 animate-float">
          <Lock className="h-7 w-7" />
        </div>
        <h3 className="font-display font-bold text-lg text-slate-800">Parent & Teacher Gatekeeper</h3>
        <p className="text-xs text-slate-500 mt-1.5 mb-6">
          Please enter the Parental Access PIN to review metrics, progress charts, and assign goals.
        </p>

        <form onSubmit={handlePinSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1 text-left">
            <label className="text-xs font-semibold text-slate-600">Enter Parental PIN:</label>
            <input
              type="password"
              maxLength={4}
              placeholder="••••"
              value={pinCode}
              onChange={(e) => setPinCode(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-center text-lg font-mono font-bold tracking-widest focus:outline-hidden focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {pinError && <p className="text-[11px] text-red-500 font-bold">{pinError}</p>}

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm py-3 rounded-xl transition-all shadow-xs cursor-pointer"
          >
            Unlock Dashboard
          </button>
        </form>

        <div className="mt-6 border-t border-slate-150 pt-4 text-[10px] text-slate-400">
          🔑 Default developer access PIN: <span className="font-mono font-bold text-purple-600">1234</span>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8" id="section_parent_dashboard">
      
      {/* Competency Chart Panel (7 cols) */}
      <div className="xl:col-span-8 flex flex-col gap-6">
        
        {/* Top metrics summary cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs text-center">
            <span className="text-2xl block mb-1">⏰</span>
            <span className="text-[10px] font-mono text-slate-400 block uppercase">Study Time</span>
            <span className="font-display font-bold text-lg text-slate-800">
              {Math.ceil(progress.studyTime / 60)} Mins
            </span>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs text-center">
            <span className="text-2xl block mb-1">🌟</span>
            <span className="text-[10px] font-mono text-slate-400 block uppercase">Total XP</span>
            <span className="font-display font-bold text-lg text-purple-700">
              {progress.totalScore} XP
            </span>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs text-center">
            <span className="text-2xl block mb-1">🎖️</span>
            <span className="text-[10px] font-mono text-slate-400 block uppercase">Badges</span>
            <span className="font-display font-bold text-lg text-slate-800">
              {progress.badgeIds.length} / 6
            </span>
          </div>
        </div>

        {/* Competency Chart */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div className="flex items-center space-x-2">
              <span className="p-1.5 bg-purple-50 text-purple-700 rounded-lg">
                <Award className="h-4 w-4" />
              </span>
              <h4 className="font-display font-bold text-sm text-slate-800">
                Child Subject Competency Radar
              </h4>
            </div>
            <span className="text-[10px] text-slate-400 italic">Auto-calculated</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="subject" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Bar dataKey="Quiz Score (%)" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Completed Lessons" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activity Logs history */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-100 mb-3">
            <Calendar className="h-4 w-4 text-slate-500" />
            <h4 className="font-display font-bold text-sm text-slate-800">Recent Learning Activities Log</h4>
          </div>

          <div className="flex flex-col gap-2 max-h-[180px] overflow-y-auto">
            {activityLogs.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-2">No learning logs recorded yet. Learning triggers activity logs!</p>
            ) : (
              activityLogs.map((log, index) => (
                <div key={index} className="flex justify-between items-center text-xs py-1.5 border-b border-slate-100 last:border-0">
                  <div className="flex items-center space-x-2 min-w-0">
                    <span className="text-slate-400">🕒 {log.time}</span>
                    <span className="truncate text-slate-700 font-medium">{log.text}</span>
                  </div>
                  <span className="font-mono text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full shrink-0">
                    +{log.xp} XP
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Parental Goal Assignor (5 cols) */}
      <div className="xl:col-span-4 flex flex-col gap-6">
        
        {/* Custom Goal Form Planner */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-100 mb-4">
            <PlusCircle className="h-4.5 w-4.5 text-purple-600" />
            <h4 className="font-display font-bold text-sm text-slate-800">Assign Child Study Targets</h4>
          </div>

          <form onSubmit={handleCreateGoal} className="flex flex-col gap-3">
            <div className="flex flex-col gap-1 text-left">
              <label className="text-[11px] font-bold text-slate-600">Goal Text / Task:</label>
              <input
                type="text"
                required
                value={newGoalText}
                onChange={(e) => setNewGoalText(e.target.value)}
                placeholder="E.g., Learn ASL Letter A or Complete Quiz"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:ring-1 focus:ring-purple-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1 text-left">
                <label className="text-[11px] font-bold text-slate-600">Category:</label>
                <select
                  value={newGoalCat}
                  onChange={(e) => setNewGoalCat(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-hidden"
                >
                  <option value="math">Mathematics</option>
                  <option value="science">Science</option>
                  <option value="english">English Spelling</option>
                  <option value="it">IT Basics</option>
                  <option value="sign">Sign Language</option>
                </select>
              </div>

              <div className="flex flex-col gap-1 text-left">
                <label className="text-[11px] font-bold text-slate-600">Required Count:</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={newGoalTarget}
                  onChange={(e) => setNewGoalTarget(parseInt(e.target.value) || 1)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-hidden"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs py-2.5 rounded-xl transition-all shadow-xs cursor-pointer"
            >
              🚀 Pin Goal onto Child Screen
            </button>
          </form>
        </div>

        {/* Assigned Targets list */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs flex-1">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <h4 className="font-display font-bold text-sm text-slate-800">Current Assigned Targets</h4>
            <span className="text-[10px] font-mono text-purple-600 font-bold">
              {progress.goals.filter((g) => g.completed).length} / {progress.goals.length} Done
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {progress.goals.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-4 text-center">No assigned study goals. Create one above to motivate your child!</p>
            ) : (
              progress.goals.map((goal) => (
                <div
                  key={goal.id}
                  className={`p-3 rounded-2xl border text-xs flex justify-between items-center transition-all ${
                    goal.completed
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="min-w-0 flex-1 pr-2">
                    <p className={`font-semibold ${goal.completed ? 'line-through opacity-60' : ''}`}>
                      {goal.text}
                    </p>
                    <p className="text-[10px] text-slate-400 uppercase mt-0.5 font-mono">
                      {goal.category} • {goal.current} / {goal.target}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    {goal.completed ? (
                      <span className="text-emerald-600 font-bold text-xs">⭐ Completed</span>
                    ) : (
                      <span className="text-slate-400 font-bold text-xs">{Math.min(100, Math.floor((goal.current / goal.target) * 100))}%</span>
                    )}
                    <button
                      onClick={() => onDeleteGoal(goal.id)}
                      className="text-slate-400 hover:text-red-500 p-1 cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Reset progression button */}
          <button
            onClick={() => {
              if (window.confirm('Are you absolutely sure you want to erase progress, quiz scores, and reset the platform?')) {
                onResetProgress();
                setIsAuthenticated(false);
              }
            }}
            className="w-full mt-6 py-2 border border-red-200 hover:bg-red-50 text-red-600 text-[10px] rounded-xl font-bold transition-all cursor-pointer"
          >
            ⚠️ Reset All Student Records
          </button>
        </div>

      </div>

    </div>
  );
}
