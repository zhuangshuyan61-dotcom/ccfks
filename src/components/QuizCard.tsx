/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Question, LevelConfig } from '../types';
import { playSound } from '../utils/audio';
import VisualHelper from './VisualHelper';
import { Volume2, VolumeX, ArrowLeft, ArrowRight, Check, X, HelpCircle, Sparkles, Flame } from 'lucide-react';

interface QuizCardProps {
  level: LevelConfig;
  onBack: () => void;
  onComplete: (score: number, total: number, timeSpent: number) => void;
  onAddWrongQuestion: (num1: number, num2: number, operator: 'x' | '÷', wrongAns: string) => void;
}

export default function QuizCard({ level, onBack, onComplete, onAddWrongQuestion }: QuizCardProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [userVal, setUserVal] = useState<string>('');
  const [quizState, setQuizState] = useState<'answering' | 'reviewed'>('answering');
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);
  const [timeSpent, setTimeSpent] = useState<number>(0);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState<boolean>(true);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Encouraging speech phrases for kids
  const successPhrases = ['太棒了！', '你真聪明！', '答对啦！加油', '无懈可击！', '超级厉害！', '第一名就是你！'];
  const [currentPraise, setCurrentPraise] = useState<string>('');

  // 1. Generate Questions on load
  useEffect(() => {
    const generated: Question[] = [];
    const count = 10; // 10 questions per quiz

    for (let i = 0; i < count; i++) {
      let num1 = 1;
      let num2 = 1;
      let operator: 'x' | '÷' = 'x';
      let answer = 1;

      // Handle custom level criteria
      if (level.id === 1) {
        // level 1: 乘以 2
        num1 = Math.floor(Math.random() * 9) + 1; // 1-9
        num2 = 2;
        operator = 'x';
        answer = num1 * num2;
      } else if (level.id === 2) {
        // level 2: 乘以 5
        num1 = Math.floor(Math.random() * 9) + 1;
        num2 = 5;
        operator = 'x';
        answer = num1 * num2;
      } else if (level.id === 3) {
        // level 3: 乘以 10
        num1 = Math.floor(Math.random() * 9) + 1;
        num2 = 10;
        operator = 'x';
        answer = num1 * num2;
      } else if (level.id === 4) {
        // level 4: 除以 2
        const quotient = Math.floor(Math.random() * 9) + 1; // 1-9
        num2 = 2;
        num1 = quotient * num2;
        operator = '÷';
        answer = quotient;
      } else if (level.id === 5) {
        // level 5: 除以 5
        const quotient = Math.floor(Math.random() * 9) + 1;
        num2 = 5;
        num1 = quotient * num2;
        operator = '÷';
        answer = quotient;
      } else if (level.id === 6) {
        // level 6: 1, 3, 4 乘法 (random multiplier)
        const secondary = [1, 3, 4];
        num2 = secondary[Math.floor(Math.random() * secondary.length)];
        num1 = Math.floor(Math.random() * 9) + 1;
        operator = 'x';
        answer = num1 * num2;
      } else if (level.id === 7) {
        // level 7: 除以 3, 4
        const divisors = [3, 4];
        const quotient = Math.floor(Math.random() * 9) + 1;
        num2 = divisors[Math.floor(Math.random() * divisors.length)];
        num1 = quotient * num2;
        operator = '÷';
        answer = quotient;
      } else {
        // level 8: 混合狂关 (combination of everything above)
        const isDiv = Math.random() > 0.5;
        if (isDiv) {
          const quotients = [1, 2, 3, 4, 5, 6, 7, 8, 9];
          const divisors = [2, 3, 4, 5];
          num2 = divisors[Math.floor(Math.random() * divisors.length)];
          const quotient = quotients[Math.floor(Math.random() * quotients.length)];
          num1 = quotient * num2;
          operator = '÷';
          answer = quotient;
        } else {
          num1 = Math.floor(Math.random() * 9) + 1;
          const multipliers = [2, 3, 4, 5, 10];
          num2 = multipliers[Math.floor(Math.random() * multipliers.length)];
          operator = 'x';
          answer = num1 * num2;
        }
      }

      generated.push({
        id: `q-${i}-${Date.now()}-${Math.random()}`,
        num1,
        num2,
        operator,
        answer,
      });
    }

    setQuestions(generated);
    setCurrentIdx(0);
    setUserVal('');
    setQuizState('answering');
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setTimeSpent(0);

    // Speak introductory title details
    speakText(`第 ${level.id} 关, ${level.name}, 口算挑战开始啦！`);
  }, [level]);

  // 2. Start Active Timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeSpent((prev) => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const currentQuestion = questions[currentIdx];

  // Synthesis Voice reader
  const speakText = (text: string) => {
    if (!isSpeechEnabled) return;
    try {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        // Cancel first
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'zh-CN';
        utterance.rate = 1.1; // slightly faster and energetic
        window.speechSynthesis.speak(utterance);
      }
    } catch (e) {
      console.warn('Speech synthesis failed', e);
    }
  };

  const handleSpeakCurrentQuestion = () => {
    if (!currentQuestion) return;
    playSound('click');
    const wordOp = currentQuestion.operator === 'x' ? '乘以' : '除以';
    speakText(`${currentQuestion.num1} ${wordOp} ${currentQuestion.num2} 等于多少？`);
  };

  // Trigger speak when current index changes
  useEffect(() => {
    if (currentQuestion && quizState === 'answering') {
      const wordOp = currentQuestion.operator === 'x' ? '乘以' : '除以';
      speakText(`${currentQuestion.num1} ${wordOp} ${currentQuestion.num2}`);
    }
  }, [currentIdx, questions, quizState]);

  // Form Submission
  const handleAnswerSubmit = () => {
    if (quizState !== 'answering') return;
    if (userVal.trim() === '') return;

    const parsed = parseInt(userVal.trim(), 10);
    const correct = parsed === currentQuestion.answer;

    // Mutate state of current question inside array
    const updated = [...questions];
    updated[currentIdx].userAnswer = userVal;
    updated[currentIdx].isCorrect = correct;
    setQuestions(updated);

    if (correct) {
      playSound('success');
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);
      setScore((prev) => prev + 1);
      
      const praise = successPhrases[Math.floor(Math.random() * successPhrases.length)];
      setCurrentPraise(praise);
      speakText(`${praise}! 答案是 ${currentQuestion.answer}`);

      // Auto advance to next question after brief celebration delay if correct
      setQuizState('reviewed');
      setTimeout(() => {
        advanceNextQuestion(newStreak, score + 1);
      }, 1200);

    } else {
      playSound('error');
      setStreak(0);
      speakText(`哎呀，答错啦，答案其实是 ${currentQuestion.answer}`);
      
      // File wrong question details in the local error book immediately!
      onAddWrongQuestion(
        currentQuestion.num1,
        currentQuestion.num2,
        currentQuestion.operator,
        userVal
      );

      // Check for quick answers feedback
      setQuizState('reviewed');
    }
  };

  const advanceNextQuestion = (activeStreak = streak, activeScore = score) => {
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx((prev) => prev + 1);
      setUserVal('');
      setQuizState('answering');
    } else {
      // Quiz completed! Halt timer
      if (timerRef.current) clearInterval(timerRef.current);
      onComplete(activeScore, questions.length, timeSpent);
    }
  };

  const handleKeypadPress = (val: string) => {
    playSound('click');
    if (quizState !== 'answering') return;
    
    if (val === 'delete') {
      setUserVal((prev) => prev.slice(0, -1));
    } else if (val === 'clear') {
      setUserVal('');
    } else {
      // Avoid excessive numerals
      if (userVal.length < 4) {
        setUserVal((prev) => prev + val);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 px-1">
      {/* Header Panel */}
      <div className="flex items-center justify-between bg-white px-5 py-4 rounded-3xl border border-slate-100 shadow-sm">
        <button
          id="quiz-back-btn"
          onClick={() => {
            playSound('click');
            onBack();
          }}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-bold bg-slate-100 hover:bg-slate-200/60 px-3 py-1.5 rounded-xl transition-all"
        >
          <ArrowLeft size={14} /> 退出闯关
        </button>

        <div className="text-center">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">正在闯关：</span>
          <span className="text-sm font-black text-slate-800">{level.name}</span>
        </div>

        {/* Speak Toggle & Visual info */}
        <div className="flex items-center gap-2">
          <button
            id="quiz-voice-btn"
            onClick={() => {
              playSound('click');
              setIsSpeechEnabled(!isSpeechEnabled);
            }}
            className={`p-2 rounded-xl transition-all ${
              isSpeechEnabled ? 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
            }`}
            title={isSpeechEnabled ? '开启声音朗读' : '已静音朗读'}
          >
            {isSpeechEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
          
          <div className="bg-amber-50 border border-amber-200 px-3 py-1 rounded-xl text-amber-800 text-xs font-bold flex items-center gap-1">
            ⏱️ {timeSpent} 秒
          </div>
        </div>
      </div>

      {/* Progress Dots Indicators */}
      <div className="flex justify-between gap-1 bg-slate-100 p-2 rounded-2xl">
        {questions.map((q, index) => {
          const isCurrent = index === currentIdx;
          const isPassed = index < currentIdx;
          const isCorrect = q.isCorrect;

          let bgClass = 'bg-white shadow-inner scale-90 border border-slate-200';
          let icon = null;

          if (isCurrent) {
            bgClass = 'bg-gradient-to-br from-indigo-400 to-indigo-600 text-white scale-110 ring-4 ring-indigo-100 font-black';
          } else if (isPassed) {
            bgClass = isCorrect 
              ? 'bg-gradient-to-br from-emerald-400 to-emerald-500 text-white' 
              : 'bg-gradient-to-br from-rose-400 to-rose-500 text-white';
            icon = isCorrect ? <Check size={12} className="stroke-[3]" /> : <X size={12} className="stroke-[3]" />;
          }

          return (
            <div
              key={q.id}
              className={`flex-1 h-8 rounded-xl flex items-center justify-center transition-all duration-300 text-xs text-center font-extrabold ${bgClass}`}
            >
              {icon ? icon : index + 1}
            </div>
          );
        })}
      </div>

      {/* Main split dashboard view */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Active Equation and keypad console */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-6 md:p-8 rounded-5xl border-2 border-slate-100 shadow-sm relative overflow-hidden flex flex-col items-center justify-center">
            
            {/* Float streak count badge */}
            {streak > 1 && (
              <div className="absolute top-4 right-4 bg-orange-100 border border-orange-200 text-orange-700 font-extrabold px-3 py-1 rounded-full text-xs flex items-center gap-1 animate-bounce">
                <Flame size={14} className="text-orange-500 fill-orange-500" />
                连对 {streak} 题!
              </div>
            )}

            {/* Read text aloud help button */}
            <button
              id="speak-question-mid-btn"
              onClick={handleSpeakCurrentQuestion}
              className="absolute top-4 left-4 text-xs font-bold text-indigo-500 hover:text-indigo-600 bg-indigo-50 hover:bg-slate-100 px-3 py-1 rounded-full flex items-center gap-1 transition-all"
            >
              🔊 读题给听
            </button>

            {/* Problem text */}
            <div className="py-8 text-center">
              <span className="text-[11px] md:text-xs text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full font-bold uppercase tracking-wider block mb-3 max-w-max mx-auto">
                请口算这道题：
              </span>
              <p className="text-4xl md:text-6xl font-black text-slate-800 tracking-wide select-none">
                {currentQuestion?.num1} {currentQuestion?.operator === 'x' ? '×' : '÷'} {currentQuestion?.num2} = 
                <span className="inline-block ml-3 bg-amber-50 border-b-4 border-amber-400 text-rose-500 px-5 py-1 rounded-2xl min-w-[70px] text-center shadow-inner min-h-[50px] align-middle">
                  {userVal || ' ? '}
                </span>
              </p>
            </div>

            {/* Verification State Overlay */}
            {quizState === 'reviewed' && (
              <div className="w-full text-center py-4 border-t border-dashed mt-2">
                {currentQuestion.isCorrect ? (
                  <div className="space-y-1 animate-fade-in">
                    <p className="text-xl md:text-2xl font-black text-emerald-600 flex items-center justify-center gap-1.5">
                      🎉 {currentPraise}
                    </p>
                    <p className="text-xs text-slate-500">正在进入下一题，请准备...</p>
                  </div>
                ) : (
                  <div className="space-y-3 animate-fade-in">
                    <p className="text-lg md:text-xl font-black text-rose-600 flex items-center justify-center gap-1">
                      ❌ 粗心啦！正确答案是 <span className="text-2xl underline ml-1 font-extrabold text-slate-800">{currentQuestion.answer}</span>
                    </p>
                    <button
                      id="next-error-btn"
                      onClick={() => advanceNextQuestion()}
                      className="bg-indigo-500 hover:bg-indigo-600 text-white font-extrabold px-6 py-2.5 rounded-2xl shadow-md text-sm transition-all"
                    >
                      明白啦，下一题 <ArrowRight className="inline-block" size={14} />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Touch-Friendly keypads */}
          <div className="bg-white p-5 rounded-4xl border border-slate-100 shadow-sm space-y-4">
            <h4 className="text-center text-xs font-bold text-slate-400">👇 请用甜气小键盘输入答案：</h4>
            
            <div className="grid grid-cols-3 gap-2.5 max-w-sm mx-auto">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  id={`keypad-${num}`}
                  onClick={() => handleKeypadPress(num.toString())}
                  disabled={quizState === 'reviewed'}
                  className="bg-slate-50 hover:bg-slate-100 text-slate-800 hover:scale-[1.03] active:scale-95 text-2xl font-black p-4 rounded-2xl border-2 border-slate-200/50 shadow-sm transition-all disabled:opacity-50"
                >
                  {num}
                </button>
              ))}

              <button
                id="keypad-clear"
                onClick={() => handleKeypadPress('clear')}
                disabled={quizState === 'reviewed'}
                className="bg-rose-550/10 hover:bg-rose-50 text-rose-600 text-sm font-extrabold p-4 rounded-2xl border border-rose-200 shadow-sm transition-all flex items-center justify-center"
              >
                清除
              </button>

              <button
                id="keypad-0"
                onClick={() => handleKeypadPress('0')}
                disabled={quizState === 'reviewed'}
                className="bg-slate-50 hover:bg-slate-100 text-slate-800 text-2xl font-black p-4 rounded-2xl border-2 border-slate-200/50 shadow-sm transition-all"
              >
                0
              </button>

              <button
                id="keypad-delete"
                onClick={() => handleKeypadPress('delete')}
                disabled={quizState === 'reviewed'}
                className="bg-amber-50 hover:bg-amber-100 text-amber-700 text-sm font-extrabold p-4 rounded-2xl border border-amber-200 shadow-sm transition-all flex items-center justify-center"
              >
                退格
              </button>
            </div>

            {/* OK Submit Button */}
            <div className="max-w-sm mx-auto">
              <button
                id="submit-answer-btn"
                onClick={handleAnswerSubmit}
                disabled={quizState === 'reviewed' || userVal.trim() === ''}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white disabled:bg-slate-200 font-extrabold text-lg py-4 rounded-2xl shadow-md cursor-pointer disabled:cursor-not-allowed transform hover:scale-[1.01] active:translate-y-0.5 transition-all"
              >
                确定答案
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Graphic Help Demonstration helper inside Quiz */}
        <div className="lg:col-span-5">
          {quizState === 'reviewed' && currentQuestion && !currentQuestion.isCorrect ? (
            <div className="bg-rose-50/50 border-2 border-rose-200 p-1.5 rounded-3xl animate-pulse">
              <div className="bg-white p-4 rounded-2xl shadow-sm">
                <p className="text-xs text-rose-500 font-bold mb-3 flex items-center gap-1.5">
                  🛡️ 别气馁！数一数这些美味的糖果，就知道为什么啦：
                </p>
                <VisualHelper 
                  num1={currentQuestion.num1}
                  num2={currentQuestion.num2}
                  operator={currentQuestion.operator}
                  theme="candy"
                />
              </div>
            </div>
          ) : (
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm text-center py-16 flex flex-col items-center justify-center">
              <div className="w-14 h-14 bg-amber-50 text-amber-500 text-2xl rounded-full flex items-center justify-center mb-3">
                💡
              </div>
              <h4 className="font-bold text-slate-700 text-sm">小贴士：</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
                如果你如果不小心算错的话，这里会立刻变出苹果和气球分一盘哦！<br/>
                你可以背诵九九口诀，或者按左边的“读题给听”听一听念法。
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
