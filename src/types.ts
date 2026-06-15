/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Question {
  id: string;
  num1: number;
  num2: number;
  operator: 'x' | '÷';
  answer: number;
  userAnswer?: string;
  isCorrect?: boolean;
}

export interface LevelConfig {
  id: number;
  name: string;
  icon?: string;
  description: string;
  emoji: string;
  operator: 'x' | '÷' | 'mixed';
  multiplierRange?: [number, number];
  factorRange?: [number, number]; // for division
  minNum?: number;
  maxNum?: number;
  fixedNums?: number[]; // e.g., only 2, 5, 10
  allowedEquations?: { num1: number; num2: number; op: 'x' | '÷' }[]; 
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  icon: string; // Lucide icon name or emoji
  color: string; // Tailwind color class
  earnedAt?: string; // ISO date string if earned
}

export interface QuizHistory {
  id: string;
  levelId: number;
  levelName: string;
  score: number; // e.g., 8 out of 10
  total: number;
  timeSpent: number; // in seconds
  date: string;
}

export interface WrongQuestion {
  questionId: string;
  num1: number;
  num2: number;
  operator: 'x' | '÷';
  correctAnswer: number;
  wrongUserAnswer: string;
  timestamp: string;
  practiceCount: number; // how many times practiced after
}
