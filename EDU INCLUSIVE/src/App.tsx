/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import TutoringBoard from './components/TutoringBoard';
import SubjectMaterials from './components/SubjectMaterials';
import MusicPlayer from './components/MusicPlayer';
import SignLanguageSection from './components/SignLanguageSection';
import GemmaChatbot from './components/GemmaChatbot';
import ParentDashboard from './components/ParentDashboard';
import Quizzes from './components/Quizzes';
import BadgeShelf from './components/BadgeShelf';
import { Badge, Goal, StudentProgress } from './types';
import { INITIAL_BADGES } from './data';
import { BookOpen, Edit3, Music, Eye, MessageCircle, Award, Layout, Sparkles } from 'lucide-react';

const DEFAULT_GOALS: Goal[] = [
  { id: 'goal_1', text: 'Practice Mathematics tracing or quiz', category: 'math', target: 1, current: 0, completed: false },
  { id: 'goal_2', text: 'Fingerspell a spelling word', category: 'sign', target: 2, current: 0, completed: false },
  { id: 'goal_3', text: 'Engage with Gemma AI Tutor on computer hardware', category: 'it', target: 1, current: 0, completed: false }
];

export default function App() {
  const [currentView, setCurrentView] = useState<'student' | 'parent'>('student');
  const [activeTab, setActiveTab] = useState<'lessons' | 'board' | 'songs' | 'sign' | 'chat' | 'badges'>('lessons');

  // Core progression states
  const [xpPoints, setXpPoints] = useState<number>(10);
  const [streakDays, setStreakDays] = useState<number>(3);
  const [studyTime, setStudyTime] = useState<number>(0);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [quizScores, setQuizScores] = useState<Record<string, number>>({});
  const [badges, setBadges] = useState<Badge[]>(INITIAL_BADGES);
  const [goals, setGoals] = useState<Goal[]>(DEFAULT_GOALS);
  const [activityLogs, setActivityLogs] = useState<{ text: string; time: string; xp: number }[]>([]);

  // Modal active quiz state
  const [activeQuizId, setActiveQuizId] = useState<string | null>(null);

  // Initialize and load from local storage
  useEffect(() => {
    try {
      const localXp = localStorage.getItem('edu_xp_points');
      if (localXp) setXpPoints(parseInt(localXp));

      const localStreak = localStorage.getItem('edu_streak');
      if (localStreak) setStreakDays(parseInt(localStreak));

      const localTime = localStorage.getItem('edu_study_time');
      if (localTime) setStudyTime(parseInt(localTime));

      const localLessons = localStorage.getItem('edu_completed_lessons');
      if (localLessons) setCompletedLessons(JSON.parse(localLessons));

      const localScores = localStorage.getItem('edu_quiz_scores');
      if (localScores) setQuizScores(JSON.parse(localScores));

      const localBadges = localStorage.getItem('edu_badges');
      if (localBadges) setBadges(JSON.parse(localBadges));

      const localGoals = localStorage.getItem('edu_parent_goals');
      if (localGoals) setGoals(JSON.parse(localGoals));

      const localLogs = localStorage.getItem('edu_activity_logs');
      if (localLogs) setActivityLogs(JSON.parse(localLogs));
    } catch (err) {
      console.warn('LocalStorage load failed, seeding defaults:', err);
    }
  }, []);

  // Study timer effect (runs in background)
  useEffect(() => {
    const timer = setInterval(() => {
      setStudyTime((prev) => {
        const next = prev + 1;
        localStorage.setItem('edu_study_time', String(next));
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleActivityLog = (text: string, xpEarned: number) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newLog = { text, time, xp: xpEarned };
    
    setActivityLogs((prev) => {
      const nextLogs = [newLog, ...prev.slice(0, 19)];
      localStorage.setItem('edu_activity_logs', JSON.stringify(nextLogs));
      return nextLogs;
    });

    if (xpEarned > 0) {
      setXpPoints((prev) => {
        const nextXp = prev + xpEarned;
        localStorage.setItem('edu_xp_points', String(nextXp));
        return nextXp;
      });
    }

    // Process parent study goals progress
    setGoals((prevGoals) => {
      const updated = prevGoals.map((g) => {
        if (g.completed) return g;

        // Match goal category keywords in activity log text
        const textLower = text.toLowerCase();
        const matchesCategory =
          (g.category === 'math' && textLower.includes('math')) ||
          (g.category === 'science' && textLower.includes('science')) ||
          (g.category === 'english' && textLower.includes('english')) ||
          (g.category === 'it' && textLower.includes('it')) ||
          (g.category === 'sign' && textLower.includes('asl'));

        if (matchesCategory) {
          const nextVal = g.current + 1;
          const isCompleted = nextVal >= g.target;
          if (isCompleted && !g.completed) {
            // Reward bonus points
            setXpPoints((x) => x + 30);
          }
          return { ...g, current: nextVal, completed: isCompleted };
        }
        return g;
      });
      localStorage.setItem('edu_parent_goals', JSON.stringify(updated));
      return updated;
    });
  };

  const handleCompleteLesson = (lessonId: string) => {
    if (completedLessons.includes(lessonId)) return;
    const updated = [...completedLessons, lessonId];
    setCompletedLessons(updated);
    localStorage.setItem('edu_completed_lessons', JSON.stringify(updated));

    // Check if we should unlock corresponding badge
    if (lessonId.includes('math')) {
      unlockBadge('badge_math_wizard');
    } else if (lessonId.includes('science')) {
      unlockBadge('badge_science_star');
    } else if (lessonId.includes('english')) {
      unlockBadge('badge_abc_champion');
    } else if (lessonId.includes('it')) {
      unlockBadge('badge_it_pioneer');
    }
  };

  const handleQuizSubmit = (quizId: string, scorePercentage: number, xpEarned: number) => {
    // Save quiz score
    const updatedScores = { ...quizScores, [quizId]: Math.max(quizScores[quizId] || 0, scorePercentage) };
    setQuizScores(updatedScores);
    localStorage.setItem('edu_quiz_scores', JSON.stringify(updatedScores));

    // Unlock badges based on score
    if (scorePercentage === 100) {
      if (quizId.includes('math')) unlockBadge('badge_math_wizard');
      if (quizId.includes('science')) unlockBadge('badge_science_star');
      if (quizId.includes('sign')) unlockBadge('badge_asl_novice');
      if (quizId.includes('it')) unlockBadge('badge_it_pioneer');
    }
  };

  const unlockBadge = (badgeId: string) => {
    setBadges((prev) => {
      const updated = prev.map((b) => {
        if (b.id === badgeId && !b.unlocked) {
          handleActivityLog(`Unlocked new interactive badge: "${b.name}"! 🎖️`, 50);
          return { ...b, unlocked: true, unlockedAt: new Date().toLocaleDateString() };
        }
        return b;
      });
      localStorage.setItem('edu_badges', JSON.stringify(updated));
      return updated;
    });
  };

  const handleAddParentGoal = (text: string, category: string, target: number) => {
    const newGoal: Goal = {
      id: `goal_${Date.now()}`,
      text,
      category,
      target,
      current: 0,
      completed: false
    };
    const updated = [...goals, newGoal];
    setGoals(updated);
    localStorage.setItem('edu_parent_goals', JSON.stringify(updated));
    handleActivityLog(`Parent assigned a new learning target: "${text}"`, 0);
  };

  const handleDeleteParentGoal = (id: string) => {
    const updated = goals.filter((g) => g.id !== id);
    setGoals(updated);
    localStorage.setItem('edu_parent_goals', JSON.stringify(updated));
  };

  const handleResetProgress = () => {
    localStorage.clear();
    setXpPoints(10);
    setStreakDays(3);
    setStudyTime(0);
    setCompletedLessons([]);
    setQuizScores({});
    setBadges(INITIAL_BADGES);
    setGoals(DEFAULT_GOALS);
    setActivityLogs([]);
    setActiveQuizId(null);
    setActiveTab('lessons');
  };

  const startQuizForCategory = (cat: 'math' | 'science' | 'english' | 'it' | 'sign') => {
    const quizMap = {
      math: 'quiz_pre_math',
      science: 'quiz_primary_science',
      english: 'quiz_pre_math', // fallback
      it: 'quiz_it_basics',
      sign: 'quiz_sign_language'
    };
    setActiveQuizId(quizMap[cat]);
    handleActivityLog(`Opened quiz module for ${cat}`, 2);
  };

  const studentProgressObj: StudentProgress = {
    completedLessons,
    quizScores,
    totalScore: xpPoints,
    studyTime,
    badgeIds: badges.filter((b) => b.unlocked).map((b) => b.id),
    goals
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Universal Sticky Header */}
      <Header
        currentView={currentView}
        onViewChange={(view) => {
          setCurrentView(view);
          handleActivityLog(`Switched viewport mode to ${view === 'parent' ? 'Parent Portal' : 'Student Playground'}`, 2);
        }}
        xpPoints={xpPoints}
        streakDays={streakDays}
      />

      {/* Main Body Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
        
        {/* If Parents Access is enabled, render dashboard */}
        {currentView === 'parent' ? (
          <ParentDashboard
            progress={studentProgressObj}
            onAddGoal={handleAddParentGoal}
            onDeleteGoal={handleDeleteParentGoal}
            onResetProgress={handleResetProgress}
            activityLogs={activityLogs}
          />
        ) : (
          /* ELSE Student Mode Playgrounds */
          <div className="flex flex-col gap-6">
            
            {/* Active Parent Goals Banner (Encouragement widget) */}
            {goals.filter((g) => !g.completed).length > 0 && (
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl p-5 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-float-slow">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl animate-pulse">🚀</span>
                  <div>
                    <h4 className="font-display font-bold text-sm leading-tight">My Parents' Active Goals!</h4>
                    <p className="text-xs text-indigo-100 mt-0.5">Complete goals set by your parent or teacher to gain massive XP boosts!</p>
                  </div>
                </div>

                {/* Scannable checklist of goals */}
                <div className="flex flex-wrap gap-2.5">
                  {goals.filter((g) => !g.completed).slice(0, 2).map((goal) => (
                    <span key={goal.id} className="bg-white/10 border border-white/20 text-xs px-2.5 py-1 rounded-lg flex items-center gap-1.5 font-medium">
                      <span className="h-2 w-2 bg-amber-400 rounded-full animate-ping" />
                      <span>{goal.text}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Student workspace switchable tabs */}
            <div className="flex bg-slate-200/50 p-1.5 rounded-3xl overflow-x-auto gap-1 border border-slate-200 shadow-inner select-none shrink-0">
              <button
                onClick={() => { setActiveTab('lessons'); handleActivityLog('Visited Lessons & Videos section', 1); }}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 shrink-0 flex items-center space-x-1.5 ${
                  activeTab === 'lessons'
                    ? 'bg-white text-indigo-900 shadow-sm font-extrabold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
                }`}
              >
                <BookOpen className="h-4 w-4 text-indigo-600" />
                <span>📚 Subject materials & Videos</span>
              </button>

              <button
                onClick={() => { setActiveTab('board'); handleActivityLog('Visited Tutoring blackboard', 1); }}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 shrink-0 flex items-center space-x-1.5 ${
                  activeTab === 'board'
                    ? 'bg-white text-indigo-900 shadow-sm font-extrabold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
                }`}
              >
                <Edit3 className="h-4 w-4 text-indigo-600" />
                <span>🎨 Tutoring Sketch Board</span>
              </button>

              <button
                onClick={() => { setActiveTab('songs'); handleActivityLog('Visited Tutoring Karaoke player', 1); }}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 shrink-0 flex items-center space-x-1.5 ${
                  activeTab === 'songs'
                    ? 'bg-white text-indigo-900 shadow-sm font-extrabold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
                }`}
              >
                <Music className="h-4 w-4 text-indigo-600" />
                <span>🎶 Tutoring Songs Karaoke</span>
              </button>

              <button
                onClick={() => { setActiveTab('sign'); handleActivityLog('Visited ASL sign translator', 1); }}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 shrink-0 flex items-center space-x-1.5 ${
                  activeTab === 'sign'
                    ? 'bg-white text-indigo-900 shadow-sm font-extrabold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
                }`}
              >
                <Eye className="h-4 w-4 text-indigo-600" />
                <span>🤟 Sign Language & IT Basics</span>
              </button>

              <button
                onClick={() => { setActiveTab('chat'); handleActivityLog('Opened Gemma AI Chatbot room', 1); }}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 shrink-0 flex items-center space-x-1.5 ${
                  activeTab === 'chat'
                    ? 'bg-white text-indigo-900 shadow-sm font-extrabold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
                }`}
              >
                <MessageCircle className="h-4 w-4 text-indigo-600 animate-pulse" />
                <span>🤖 Gemma AI Tutor Chat</span>
              </button>

              <button
                onClick={() => { setActiveTab('badges'); handleActivityLog('Visited Digital sticker shelf', 1); }}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 shrink-0 flex items-center space-x-1.5 ${
                  activeTab === 'badges'
                    ? 'bg-white text-indigo-900 shadow-sm font-extrabold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
                }`}
              >
                <Award className="h-4 w-4 text-indigo-600" />
                <span>🎖️ Sticker Book Shelf</span>
              </button>
            </div>

            {/* Central Playgrounds Panel */}
            <div className="min-h-[460px]">
              {/* Overlay Modal for ACTIVE QUIZZES */}
              {activeQuizId ? (
                <Quizzes
                  activeQuizId={activeQuizId}
                  onCloseQuiz={() => { setActiveQuizId(null); handleActivityLog('Closed quiz playground', 0); }}
                  onQuizSubmit={handleQuizSubmit}
                  onActivityLog={handleActivityLog}
                />
              ) : (
                /* Tab Switchers */
                <>
                  {activeTab === 'lessons' && (
                    <SubjectMaterials
                      completedLessons={completedLessons}
                      onCompleteLesson={handleCompleteLesson}
                      onActivityLog={handleActivityLog}
                      onStartQuiz={(cat) => startQuizForCategory(cat)}
                    />
                  )}

                  {activeTab === 'board' && (
                    <TutoringBoard onActivityLog={handleActivityLog} />
                  )}

                  {activeTab === 'songs' && (
                    <MusicPlayer onActivityLog={handleActivityLog} />
                  )}

                  {activeTab === 'sign' && (
                    <SignLanguageSection onActivityLog={handleActivityLog} />
                  )}

                  {activeTab === 'chat' && (
                    <GemmaChatbot onActivityLog={handleActivityLog} />
                  )}

                  {activeTab === 'badges' && (
                    <BadgeShelf badges={badges} onActivityLog={handleActivityLog} />
                  )}
                </>
              )}
            </div>

          </div>
        )}

      </main>

      {/* Universal Footer */}
      <footer className="bg-white border-t border-stone-200 py-6 mt-12 shrink-0">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-stone-400">
          <p>© 2026 EduInclusive blended learning. All visual structures are designed for pre-primary & primary education.</p>
          <p className="mt-1">Making education accessible with custom sign-language fingerspelling, chiptune songs, and Gemma AI.</p>
        </div>
      </footer>

    </div>
  );
}
