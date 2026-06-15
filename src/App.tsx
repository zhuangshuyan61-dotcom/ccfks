/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { LevelConfig, WrongQuestion } from './types';
import QuizCard from './components/QuizCard';
import VisualTable from './components/VisualTable';
import WrongQuestionBook from './components/WrongQuestionBook';
import BadgeRack from './components/BadgeRack';
import MathLessons from './components/MathLessons';
import { playSound, setMuted, getMuted } from './utils/audio';
import { 
  Sparkles, BookOpen, Award, Notebook, History, 
  Volume2, VolumeX, Trophy, Star, Play, Flame, 
  Smile, Compass, GraduationCap, CheckCircle2, RotateCcw, ArrowRight
} from 'lucide-react';

const LEVELS: LevelConfig[] = [
  {
    id: 1,
    name: '🌟 双双对对 (2的乘法)',
    emoji: '👀',
    description: '2 的乘法（学会有魔法的变双倍）',
    operator: 'x',
  },
  {
    id: 2,
    name: '🖐️ 五五成群 (5的乘法)',
    emoji: '⭐',
    description: '5 的乘法（伸出可爱小手来数数）',
    operator: 'x',
  },
  {
    id: 3,
    name: '🔟 十全十美 (10的乘法)',
    emoji: '🎪',
    description: '10 的乘法（在后面加个零就行啦）',
    operator: 'x',
  },
  {
    id: 4,
    name: '🍕 轻松对半 (除以2)',
    emoji: '🍰',
    description: '除以 2（好吃的脆皮比萨平分对半分）',
    operator: '÷',
  },
  {
    id: 5,
    name: '🧁 五人平分 (除以5)',
    emoji: '🍩',
    description: '除以 5（小蛋糕公平地分等五份）',
    operator: '÷',
  },
  {
    id: 6,
    name: '🚀 乘法热气球 (基础乘法)',
    emoji: '🎈',
    description: '1、3 和 4 的乘法（探索乘法的奥秘）',
    operator: 'x',
  },
  {
    id: 7,
    name: '🍬 佩奇糖果屋 (基础除以)',
    emoji: '🍭',
    description: '除以 3 和 4（平均分糖果的小游戏）',
    operator: '÷',
  },
  {
    id: 8,
    name: '🏆 小勇士大探险 (乘除混合)',
    emoji: '🦁',
    description: '乘除混搭混合闯关（赢取闪闪发光的终极奖杯）',
    operator: 'mixed',
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'levels' | 'learn' | 'table' | 'wrong' | 'badges'>('levels');
  const [selectedLevel, setSelectedLevel] = useState<LevelConfig | null>(null);
  
  // Celebration modal trigger
  const [isCelebration, setIsCelebration] = useState<boolean>(false);
  const [quizResult, setQuizResult] = useState<{ score: number; total: number; timeSpent: number; levelId: number } | null>(null);

  // States synchronized with localStorage
  const [wrongQuestions, setWrongQuestions] = useState<WrongQuestion[]>([]);
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);
  const [levelsProgress, setLevelsProgress] = useState<Record<number, number>>({});
  const [globalMuted, setGlobalMuted] = useState<boolean>(false);

  // 1. Load initial localStorage values safely
  useEffect(() => {
    try {
      const wrongStr = localStorage.getItem('math_wrong_books');
      if (wrongStr) setWrongQuestions(JSON.parse(wrongStr));

      const badgeStr = localStorage.getItem('math_quiz_badges');
      if (badgeStr) setEarnedBadges(JSON.parse(badgeStr));

      const progressStr = localStorage.getItem('math_levels_progress');
      if (progressStr) setLevelsProgress(JSON.parse(progressStr));

      setGlobalMuted(getMuted());
    } catch (e) {
      console.error('Failed to load local storage profile', e);
    }
  }, []);

  // Update sound status dynamically
  const handleToggleMute = () => {
    const nextMute = !globalMuted;
    setGlobalMuted(nextMute);
    setMuted(nextMute);
    // Play a test chime if unmuted
    if (!nextMute) {
      setTimeout(() => playSound('click'), 50);
    }
  };

  // 2. Clear wrong questions on mastering them
  const handleWrongProgressUpdate = (updatedList: WrongQuestion[]) => {
    setWrongQuestions(updatedList);
    localStorage.setItem('math_wrong_books', JSON.stringify(updatedList));
  };

  // 3. Register a new custom mistake whenever kids fail inside QuizCard
  const handleAddWrongQuestion = (num1: number, num2: number, operator: 'x' | '÷', wrongUserAns: string) => {
    const key = `wrong-${num1}-${operator}-${num2}-${Date.now()}`;
    const newWrong: WrongQuestion = {
      questionId: key,
      num1,
      num2,
      operator,
      correctAnswer: operator === 'x' ? num1 * num2 : Math.floor(num1 / num2),
      wrongUserAnswer: wrongUserAns,
      timestamp: new Date().toISOString(),
      practiceCount: 0,
    };

    // Avoid duplicating exactly equivalent ongoing questions in wrong book
    const filtered = wrongQuestions.filter(q => !(q.num1 === num1 && q.num2 === num2 && q.operator === operator));
    const merged = [newWrong, ...filtered];
    setWrongQuestions(merged);
    localStorage.setItem('math_wrong_books', JSON.stringify(merged));
  };

  // 4. Trigger quiz completion, highscores progress, badges checkers
  const handleQuizComplete = (score: number, total: number, timeSpent: number) => {
    playSound('victory');

    // Save max score progress
    const updatedProgress = { ...levelsProgress };
    const prevMax = updatedProgress[selectedLevel!.id] || 0;
    if (score > prevMax) {
      updatedProgress[selectedLevel!.id] = score;
      setLevelsProgress(updatedProgress);
      localStorage.setItem('math_levels_progress', JSON.stringify(updatedProgress));
    }

    setQuizResult({ score, total, timeSpent, levelId: selectedLevel!.id });
    setIsCelebration(true);

    // Evaluate badge triggers!
    const newBadges = [...earnedBadges];
    let badgeEarned = false;

    // Badge A: first_game (Completing any quiz)
    if (!newBadges.includes('first_game')) {
      newBadges.push('first_game');
      badgeEarned = true;
    }

    // Badge B: perfect_10 (10/10 master)
    if (score === 10 && !newBadges.includes('perfect_10')) {
      newBadges.push('perfect_10');
      badgeEarned = true;
    }

    // Badge C: half_victory (Completes level 5 with >= 8 score)
    if (selectedLevel!.id >= 5 && score >= 8 && !newBadges.includes('half_victory')) {
      newBadges.push('half_victory');
      badgeEarned = true;
    }

    // Badge D: max_streak_5 (Score >= 8 items)
    if (score >= 8 && !newBadges.includes('max_streak_5')) {
      newBadges.push('max_streak_5');
      badgeEarned = true;
    }

    // Badge E: speed_star (10 questions correct, avg time spent per question <= 5s, total time <= 50s)
    if (timeSpent <= 50 && score >= 8 && !newBadges.includes('speed_star')) {
      newBadges.push('speed_star');
      badgeEarned = true;
    }

    if (badgeEarned) {
      setEarnedBadges(newBadges);
      localStorage.setItem('math_quiz_badges', JSON.stringify(newBadges));
    }
  };

  // Check exploration progress inline to unlock table explore badge dynamically
  useEffect(() => {
    if (activeTab === 'table') {
      try {
        const exploredStr = localStorage.getItem('explored_math_facts') || '[]';
        const explored = JSON.parse(exploredStr) as string[];
        if (explored.length >= 10 && !earnedBadges.includes('table_explore')) {
          const updated = [...earnedBadges, 'table_explore'];
          setEarnedBadges(updated);
          localStorage.setItem('math_quiz_badges', JSON.stringify(updated));
          playSound('badge');
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, [activeTab, earnedBadges]);

  const handleStartLevel = (lvl: LevelConfig) => {
    playSound('click');
    setSelectedLevel(lvl);
    setIsCelebration(false);
  };

  const handleReturnToLevels = () => {
    playSound('click');
    setSelectedLevel(null);
    setIsCelebration(false);
    setActiveTab('levels');
  };

  // Helper calculating star score rendering
  const getProgressStars = (scoreValue?: number) => {
    if (scoreValue === undefined) return 0;
    if (scoreValue === 10) return 3;
    if (scoreValue >= 8) return 2;
    if (scoreValue >= 5) return 1;
    return 0;
  };

  return (
    <div id="app-root-container" className="min-h-screen bg-gradient-to-b from-amber-50 via-sky-50 to-indigo-100 text-slate-800 font-sans pb-16 antialiased">
      
      {/* Playful Floating elements background decor */}
      <div className="absolute top-12 left-10 text-4xl opacity-15 select-none pointer-events-none animate-pulse">🍭</div>
      <div className="absolute top-1/4 right-8 text-4xl opacity-15 select-none pointer-events-none animate-bounce" style={{ animationDuration: '4s' }}>⭐</div>
      <div className="absolute bottom-20 left-16 text-4xl opacity-15 select-none pointer-events-none animate-bounce" style={{ animationDuration: '5s' }}>🍎</div>
      <div className="absolute bottom-40 right-20 text-4xl opacity-15 select-none pointer-events-none animate-pulse">🎈</div>

      {/* Top Friendly Header Nav Bar */}
      <header className="bg-white/80 backdrop-blur-md border-b border-indigo-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={handleReturnToLevels}>
            <div className="w-10 h-10 bg-gradient-to-tr from-amber-400 to-rose-400 rounded-2xl flex items-center justify-center shadow-md border-2 border-white transform hover:rotate-6 transition-all duration-300">
              <span className="text-xl font-bold text-white">🎡</span>
            </div>
            <div>
              <h1 className="text-base md:text-lg font-black tracking-wide bg-gradient-to-r from-indigo-600 via-rose-500 to-amber-500 bg-clip-text text-transparent">
                乘除口算乐园
              </h1>
              <p className="text-[9px] text-slate-500 font-bold block leading-none">
                适合低年级小朋友的数学大冒险
              </p>
            </div>
          </div>

          {/* Nav Links menu cards (Only active if not in an active quiz) */}
          {!selectedLevel && (
            <nav className="hidden md:flex gap-1.5 bg-slate-100 p-1 rounded-2xl border">
              <button
                id="tab-level-menu"
                onClick={() => { playSound('click'); setActiveTab('levels'); }}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                  activeTab === 'levels' ? 'bg-white text-indigo-700 shadow-sm scale-102' : 'text-slate-600 hover:text-indigo-600'
                }`}
              >
                🏞️ 闯关乐园
              </button>
              <button
                id="tab-learn-menu"
                onClick={() => { playSound('click'); setActiveTab('learn'); }}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                  activeTab === 'learn' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-indigo-600'
                }`}
              >
                🏫 奇妙微学堂
              </button>
              <button
                id="tab-table-menu"
                onClick={() => { playSound('click'); setActiveTab('table'); }}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                  activeTab === 'table' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-indigo-600'
                }`}
              >
                📊 九九口诀板
              </button>
              <button
                id="tab-wrong-menu"
                onClick={() => { playSound('click'); setActiveTab('wrong'); }}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all relative ${
                  activeTab === 'wrong' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-indigo-600'
                }`}
              >
                📝 错题本
                {wrongQuestions.length > 0 && (
                  <span className="absolute -top-1 right-0 bg-rose-500 text-white rounded-full text-[9px] w-4 h-4 flex items-center justify-center font-bold scale-100 animate-pulse">
                    {wrongQuestions.length}
                  </span>
                )}
              </button>
              <button
                id="tab-badge-menu"
                onClick={() => { playSound('click'); setActiveTab('badges'); }}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                  activeTab === 'badges' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-indigo-600'
                }`}
              >
                🥇 勋章墙
              </button>
            </nav>
          )}

          {/* Global Mute Toggle Speaker & Baby Profile Status indicator */}
          <div className="flex items-center gap-3">
            <button
              id="global-volume-toggle"
              onClick={handleToggleMute}
              className={`p-2 rounded-2xl transition-all border shadow-sm cursor-pointer ${
                globalMuted 
                  ? 'bg-rose-50 text-rose-500 border-rose-200 hover:bg-rose-100' 
                  : 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100'
              }`}
              title={globalMuted ? '已静音' : '声音正常'}
            >
              {globalMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sticky Footer Menu Bar (Only visible if not inside active quiz) */}
      {!selectedLevel && (
        <nav className="md:hidden fixed bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md p-1.5 rounded-3xl border border-slate-200/80 shadow-lg flex justify-around items-center z-50">
          <button
            onClick={() => { playSound('click'); setActiveTab('levels'); }}
            className={`flex flex-col items-center py-1.5 px-2.5 rounded-2xl grow text-[10px] font-bold ${
              activeTab === 'levels' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500'
            }`}
          >
            <span>🏞️</span>
            <span className="mt-0.5">闯关</span>
          </button>
          <button
            onClick={() => { playSound('click'); setActiveTab('learn'); }}
            className={`flex flex-col items-center py-1.5 px-2.5 rounded-2xl grow text-[10px] font-bold ${
              activeTab === 'learn' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500'
            }`}
          >
            <span>🏫</span>
            <span className="mt-0.5">学堂</span>
          </button>
          <button
            onClick={() => { playSound('click'); setActiveTab('table'); }}
            className={`flex flex-col items-center py-1.5 px-2.5 rounded-2xl grow text-[10px] font-bold ${
              activeTab === 'table' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500'
            }`}
          >
            <span>📊</span>
            <span className="mt-0.5">九九表</span>
          </button>
          <button
            onClick={() => { playSound('click'); setActiveTab('wrong'); }}
            className={`flex flex-col items-center py-1.5 px-2.5 rounded-2xl grow text-[10px] font-bold relative ${
              activeTab === 'wrong' ? 'bg-rose-50 text-rose-700' : 'text-slate-500'
            }`}
          >
            {wrongQuestions.length > 0 && (
              <span className="absolute top-0 right-1 bg-rose-550 bg-rose-600 text-white text-[8px] px-1 rounded-full font-black animate-bounce">
                {wrongQuestions.length}
              </span>
            )}
            <span>📝</span>
            <span className="mt-0.5">错题</span>
          </button>
          <button
            onClick={() => { playSound('click'); setActiveTab('badges'); }}
            className={`flex flex-col items-center py-1.5 px-2.5 rounded-2xl grow text-[10px] font-bold ${
              activeTab === 'badges' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500'
            }`}
          >
            <span>🥇</span>
            <span className="mt-0.5">勋章</span>
          </button>
        </nav>
      )}

      {/* Main Container Workspace */}
      <main className="max-w-5xl mx-auto px-4 mt-6">
        
        {/* Active Session Card Overlay Router */}
        {selectedLevel ? (
          <div>
            {isCelebration && quizResult ? (
              /* Success Celebration Score Board overlay */
              <div id="celebration-panel" className="max-w-xl mx-auto bg-white p-6 md:p-8 rounded-5xl border-4 border-indigo-200 shadow-xl text-center space-y-6 animate-scale-up">
                
                {/* Visual Gold Medallion Crown element */}
                <div className="w-24 h-24 bg-gradient-to-tr from-yellow-300 via-amber-400 to-orange-500 rounded-full flex items-center justify-center text-5xl shadow-lg border-4 border-white mx-auto animate-bounce mt-2">
                  👑
                </div>

                <div className="space-y-1">
                  <h3 className="text-2xl font-black text-slate-800">
                    🎉 挑战完成！你真棒！
                  </h3>
                  <p className="text-xs text-indigo-600 font-bold uppercase tracking-wider">
                    {LEVELS.find(l => l.id === quizResult.levelId)?.name}
                  </p>
                </div>

                {/* Score Indicators and Glowing stars */}
                <div className="bg-slate-50 border-2 border-dashed border-indigo-100 p-5 rounded-3xl space-y-3">
                  {/* Real-time Star grading representation */}
                  <div className="flex justify-center gap-2 text-4xl py-1">
                    {Array.from({ length: 3 }).map((_, index) => {
                      const earnedStars = getProgressStars(quizResult.score);
                      const isGlowing = index < earnedStars;
                      return (
                        <span 
                          key={index} 
                          className={`inline-block transition-transform duration-500 ${
                            isGlowing ? 'text-yellow-400 scale-120 animate-pulse' : 'text-slate-350 opacity-20'
                          }`}
                        >
                          ⭐
                        </span>
                      );
                    })}
                  </div>

                  <p className="text-4xl font-extrabold text-indigo-600 block leading-none">
                    {quizResult.score} <span className="text-xs text-slate-400 font-bold">/ {quizResult.total}分</span>
                  </p>

                  <div className="flex justify-around items-center pt-2 text-xs text-slate-500 border-t border-slate-200">
                    <div>
                      <span className="block text-[10px] text-slate-400 font-bold">共计秒数</span>
                      <span className="font-extrabold text-slate-700">{quizResult.timeSpent} 秒</span>
                    </div>
                    <div className="border-r h-6 border-slate-200"></div>
                    <div>
                      <span className="block text-[10px] text-slate-400 font-bold">平均每题</span>
                      <span className="font-extrabold text-slate-700">{(quizResult.timeSpent / quizResult.total).toFixed(1)} 秒</span>
                    </div>
                  </div>
                </div>

                {/* Accuracy review details */}
                <p className="text-xs text-slate-500 leading-relaxed px-4">
                  {quizResult.score === 10 ? (
                    '🌟 哇！你拿到了大满贯 10 分！简直是神级算术大师，快把大章奖贴到你的勋章墙上去！'
                  ) : quizResult.score >= 8 ? (
                    '🌸 棒极了！优秀的口算成果！离满分只有一步之遥喽，再来练练绝对行！'
                  ) : (
                    '💡 很不错的尝试哦！有的题目粗心了，别气馁，多去“错题本”和“口诀探索板”练习，你会更厉害！'
                  )}
                </p>

                {/* Controllers Action Group */}
                <div className="flex flex-col sm:flex-row gap-3 pt-3">
                  <button
                    id="retry-quiz-btn"
                    onClick={() => handleStartLevel(selectedLevel)}
                    className="flex-1 bg-amber-500 hover:bg-amber-600 hover:scale-[1.01] active:translate-y-0.5 text-white font-extrabold py-3.5 rounded-2xl shadow-md text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw size={16} /> 重新做一遍
                  </button>
                  
                  <button
                    id="leave-quiz-btn"
                    onClick={handleReturnToLevels}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 hover:scale-[1.01] active:translate-y-0.5 text-white font-extrabold py-3.5 rounded-2xl shadow-md text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    返回主乐园 <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            ) : (
              /* Inside active play card */
              <QuizCard
                level={selectedLevel}
                onBack={handleReturnToLevels}
                onComplete={handleQuizComplete}
                onAddWrongQuestion={handleAddWrongQuestion}
              />
            )}
          </div>
        ) : (
          /* Normal Router showing Tab contents */
          <div>
            
            {/* 🏞️ Tab 1: Levels Park View */}
            {activeTab === 'levels' && (
              <div className="space-y-6">
                
                {/* Hero child welcoming banner */}
                <div className="bg-white p-6 rounded-4xl border border-indigo-100 shadow-sm flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
                  <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-50 rounded-full -translate-y-10 translate-x-10 -z-10"></div>
                  
                  {/* Mascot cartoon icon wrapper */}
                  <div className="w-16 h-16 bg-gradient-to-tr from-indigo-100 to-indigo-550/20 text-indigo-600 text-3xl font-bold flex items-center justify-center rounded-3xl shrink-0 shadow-inner">
                    🦁
                  </div>
                  
                  <div className="text-center md:text-left grow space-y-1">
                    <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-wide">
                      哈罗，口算小勇士！今天想挑战什么算术呢？
                    </h2>
                    <p className="text-xs text-slate-500 leading-relaxed max-w-2xl">
                      这里有 8 个精心设计的趣味乘除口算关卡。请根据你的实力，从最简单的第 1 关开始解锁，赢取闪亮的金杯和漂亮的动物勋章吧！
                    </p>
                  </div>

                  {/* Quick stats summarizing completed stars count */}
                  <div className="flex gap-4 items-center shrink-0 border-t md:border-t-0 md:border-l border-indigo-100 pt-4 md:pt-0 md:pl-6 text-center">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">已通关</span>
                      <span className="text-xl font-black text-blue-600">
                        {Object.keys(levelsProgress).length} <span className="text-xs font-semibold text-slate-400">/ 8</span>
                      </span>
                    </div>
                    <div className="w-px h-8 bg-slate-200"></div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">连对纪录</span>
                      <span className="text-xl font-black text-orange-600 flex items-center justify-center gap-0.5">
                        <Flame size={14} className="fill-orange-500 text-orange-500 animate-pulse inline-block" />
                        {earnedBadges.includes('max_streak_5') ? '5+' : '0'} 
                      </span>
                    </div>
                  </div>
                </div>

                {/* Levels layout Cards Grid */}
                <div>
                  <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-1.5 px-1">
                    🗺️ 口算大探险冒险地图
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {LEVELS.map((lvl) => {
                      const highscore = levelsProgress[lvl.id] || 0;
                      const hasPlayed = levelsProgress[lvl.id] !== undefined;
                      const stars = getProgressStars(highscore);

                      // Style variants depending on operations
                      const cardBorderColor = 
                        lvl.operator === 'x' 
                          ? 'border-amber-200 hover:border-amber-400' 
                          : lvl.operator === '÷' 
                          ? 'border-sky-200 hover:border-sky-400' 
                          : 'border-purple-200 hover:border-purple-400';

                      const cardBgPrefix = 
                        lvl.operator === 'x' 
                          ? 'bg-amber-50/20' 
                          : lvl.operator === '÷' 
                          ? 'bg-sky-50/20' 
                          : 'bg-purple-50/20';

                      return (
                        <div
                          key={lvl.id}
                          id={`level-card-${lvl.id}`}
                          onClick={() => handleStartLevel(lvl)}
                          className={`border-2 p-5 rounded-4xl flex flex-col justify-between transition-all duration-300 transform hover:scale-[1.02] cursor-pointer shadow-sm hover:shadow-md bg-white ${cardBorderColor}`}
                        >
                          <div>
                            {/* Card Header */}
                            <div className="flex justify-between items-start mb-3">
                              <span className="text-3xl filter drop-shadow-sm select-none">
                                {lvl.emoji}
                              </span>
                              <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                                lvl.operator === 'x' 
                                  ? 'bg-amber-100 text-amber-800' 
                                  : lvl.operator === '÷' 
                                  ? 'bg-sky-100 text-sky-800' 
                                  : 'bg-purple-100 text-purple-800'
                              }`}>
                                {lvl.operator === 'x' ? '乘法' : lvl.operator === '÷' ? '除法' : '乘除混合'}
                              </span>
                            </div>

                            <h4 className="font-extrabold text-sm text-slate-800 leading-tight">
                              第 {lvl.id} 关：{lvl.name}
                            </h4>
                            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                              {lvl.description}
                            </p>
                          </div>

                          {/* Level achievements states */}
                          <div className={`mt-5 pt-3.5 border-t border-dashed border-slate-100 flex items-center justify-between ${cardBgPrefix} -mx-1 -mb-1 px-2 py-1.5 rounded-2xl`}>
                            {hasPlayed ? (
                              <div className="flex flex-col">
                                <span className="text-[9px] text-slate-400 font-bold block">最高纪录:</span>
                                <span className="text-xs font-black text-slate-700">{highscore}分</span>
                              </div>
                            ) : (
                              <span className="text-[10px] font-bold text-slate-400 block pl-1">未开始挑战</span>
                            )}

                            {/* Stars row rendering */}
                            <div className="flex gap-0.5">
                              {Array.from({ length: 3 }).map((_, sIdx) => {
                                const activeStar = sIdx < stars;
                                return (
                                  <span 
                                    key={sIdx} 
                                    className={`text-sm ${activeStar ? 'text-yellow-400' : 'text-slate-200'}`}
                                  >
                                    ★
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Free Play quick guides for first graders */}
                <div className="bg-indigo-50 border border-indigo-100/60 p-5 rounded-4xl flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">💡</div>
                    <div className="space-y-0.5">
                      <p className="font-extrabold text-slate-800 text-sm">不知道乘除号是什么意思？</p>
                      <p className="text-xs text-slate-500">别害怕！点击顶部菜单进入“奇妙微学堂”或者看“九九探索口诀板”先学一下原理吧！</p>
                    </div>
                  </div>
                  <button
                    onClick={() => { playSound('click'); setActiveTab('learn'); }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-2xl shadow-md shrink-0 transition-all cursor-pointer"
                  >
                    去上学堂课 📖
                  </button>
                </div>
              </div>
            )}

            {/* 🏫 Tab 2: Math Lessons Visual Tutorial View */}
            {activeTab === 'learn' && <MathLessons />}

            {/* 📊 Tab 3: Interactive Multiplication 1-9 Grid View */}
            {activeTab === 'table' && <VisualTable />}

            {/* 📝 Tab 4: Wrong Question book lists tracker */}
            {activeTab === 'wrong' && (
              <WrongQuestionBook 
                wrongQuestions={wrongQuestions} 
                onCorrectProgress={handleWrongProgressUpdate} 
              />
            )}

            {/* 🥇 Tab 5: Achievement Badges view */}
            {activeTab === 'badges' && <BadgeRack earnedBadgeIds={earnedBadges} />}

          </div>
        )}
      </main>
    </div>
  );
}
