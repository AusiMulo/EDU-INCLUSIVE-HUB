/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string; // Lucide icon name or emoji
  category: 'math' | 'science' | 'english' | 'it' | 'sign' | 'general';
  unlocked: boolean;
  unlockedAt?: string;
  color: string; // Tailwind bg/text class pairs
}

export interface Goal {
  id: string;
  text: string;
  category: string;
  target: number;
  current: number;
  completed: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  category: 'math' | 'science' | 'english' | 'it' | 'sign';
  questions: QuizQuestion[];
  points: number;
}

export interface Song {
  id: string;
  title: string;
  description: string;
  emoji: string;
  lyrics: { time: number; text: string }[];
  tempo: number; // BPM
  notes: number[]; // MIDI or relative pitch values for sound synthesis
}

export interface Video {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
  description: string;
  subject: 'math' | 'science' | 'english' | 'it' | 'sign';
  videoUrl: string; // Fake or real youtube embeds
}

export interface Lesson {
  id: string;
  title: string;
  category: 'math' | 'science' | 'english' | 'it' | 'sign';
  content: string;
  signHelper?: string; // Textual sign language description
  signSteps?: string[]; // Steps to execute the sign
  illustrationType?: 'math_grid' | 'solar_system' | 'grammar_tree' | 'computer_hardware' | 'asl_chart';
}

export interface ChatMessage {
  id: string;
  sender: 'student' | 'gemini';
  text: string;
  timestamp: string;
  itLessonStep?: number;
  signLanguageDescription?: string;
}

export interface StudentProgress {
  completedLessons: string[]; // Lesson IDs
  quizScores: Record<string, number>; // quizId -> best score %
  totalScore: number; // accumulated XP
  studyTime: number; // total seconds spent on platform
  badgeIds: string[]; // unlocked badges
  goals: Goal[]; // parent assigned goals
}

export interface BoardSticker {
  id: string;
  type: 'emoji' | 'shape';
  value: string;
  x: number;
  y: number;
  size: number;
}
