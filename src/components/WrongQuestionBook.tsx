/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { WrongQuestion } from '../types';
import { playSound } from '../utils/audio';
import { ClipboardList, RotateCcw, CheckCircle2, Award, Zap, HelpCircle } from 'lucide-react';
import VisualHelper from './VisualHelper';

interface WrongQuestionBookProps {
  wrongQuestions: WrongQuestion[];
  onCorrectProgress: (updatedList: WrongQuestion[]) => void;
}

export default function WrongQuestionBook({ wrongQuestions, onCorrectProgress }: WrongQuestionBookProps) {
  const [activePracticeQuest, setActivePracticeQuest] = useState<WrongQuestion | null>(null);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [practiceMessage, setPracticeMessage] = useState<{ text: string; success: boolean } | null>(null);

  const startPractice = (q: WrongQuestion) => {
    playSound('click');
    setActivePracticeQuest(q);
    setUserAnswer('');
    setPracticeMessage(null);
  };

  const handlePracticeSubmit = () => {
    if (!activePracticeQuest) return;

    const parsedAns = parseInt(userAnswer.trim(), 10);
    const correct = parsedAns === activePracticeQuest.correctAnswer;

    if (correct) {
      playSound('success');
      setPracticeMessage({ text: '🎉 太棒了！回答正确，错题被消灭啦！', success: true });
      
      // Update the parent's list by removing this wrong question
      setTimeout(() => {
        const revisedList = wrongQuestions.filter(q => q.questionId !== activePracticeQuest.questionId);
        onCorrectProgress(revisedList);
        setActivePracticeQuest(null);
        setPracticeMessage(null);

        // Check if all are cleared to unlock remedy_master badge
        if (revisedList.length === 0) {
          try {
            const badgesStr = localStorage.getItem('math_quiz_badges') || '[]';
            const badges = JSON.parse(badgesStr) as string[];
            if (!badges.includes('remedy_master')) {
              badges.push('remedy_master');
              localStorage.setItem('math_quiz_badges', JSON.stringify(badges));
              playSound('badge');
            }
          } catch (e) {
            console.error(e);
          }
        }
      }, 1500);

    } else {
      playSound('error');
      setPracticeMessage({ text: '❌ 哎呀，再数数图形或者看下口算提示，再试一次吧！', success: false });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title */}
      <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-3">
        <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 text-2xl shadow-sm">
          📂
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-black text-slate-800">
            📝 错题超级本 <span className="text-xs bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-bold ml-1">温故而知新</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            在这里你可以重新做一遍做错的题目。全部消灭干净，可以获得大大的“消灭错题王”勋章哦！
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Side: Wrong questions list */}
        <div className="md:col-span-6 bg-white p-5 rounded-3xl border border-slate-100 shadow-sm min-h-[300px]">
          <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-1.5">
            <ClipboardList size={16} /> 所有错题（共 {wrongQuestions.length} 道）
          </h3>

          {wrongQuestions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-slate-400">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-400 rounded-full flex items-center justify-center mb-4 text-3xl">
                🏆
              </div>
              <p className="font-extrabold text-slate-700 text-sm">你的错题本里空空如也！</p>
              <p className="text-xs text-slate-400 mt-1 max-w-xs px-4">
                你真是个细心的小数家，完成闯关并且没有留下任何错题。继续保持哦！
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {wrongQuestions.map((q) => {
                const isSelected = activePracticeQuest?.questionId === q.questionId;
                return (
                  <div 
                    key={q.questionId} 
                    className={`p-3.5 rounded-2xl border transition-all flex justify-between items-center ${
                      isSelected 
                        ? 'border-rose-400 bg-rose-50/50 ring-2 ring-rose-200' 
                        : 'border-slate-100 bg-slate-50 hover:bg-slate-100/60'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-black text-slate-800">
                          {q.num1} {q.operator === 'x' ? '×' : '÷'} {q.num2} = ?
                        </span>
                        <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-md font-bold">
                          上次答错: {q.wrongUserAnswer || '无'}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">
                        记录时间: {new Date(q.timestamp).toLocaleDateString()}
                      </p>
                    </div>

                    <button
                      id={`practice-btn-${q.questionId}`}
                      onClick={() => startPractice(q)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm flex items-center gap-1 transition-all ${
                        isSelected 
                          ? 'bg-rose-500 text-white hover:bg-rose-600' 
                          : 'bg-white border text-rose-500 hover:bg-rose-50 border-rose-200'
                      }`}
                    >
                      <RotateCcw size={12} /> 重新做这题
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Side: Quick practice workspace */}
        <div className="md:col-span-6">
          {activePracticeQuest ? (
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <div className="text-center py-2">
                <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                  🛠️ 口算演练舱
                </span>
                <p className="text-base font-black text-slate-800 mt-2">
                  消灭它的诀窍就在下面，数一数，写出正确答案吧！
                </p>
              </div>

              {/* Graphic helper with appropriate operator */}
              <VisualHelper 
                num1={activePracticeQuest.num1} 
                num2={activePracticeQuest.num2} 
                operator={activePracticeQuest.operator} 
                theme="cookie"
              />

              {/* Answer input form block */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex gap-2 items-center justify-center">
                  <span className="text-xl font-bold text-slate-700">
                    {activePracticeQuest.num1} {activePracticeQuest.operator === 'x' ? '×' : '÷'} {activePracticeQuest.num2} = 
                  </span>
                  <input
                    id="practice-answer-input"
                    type="number"
                    pattern="[0-9]*"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="输入答案"
                    className="w-24 px-3 py-2 text-center text-lg font-black bg-white rounded-xl border-2 border-slate-300 focus:outline-none focus:border-indigo-500"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handlePracticeSubmit();
                    }}
                  />
                  <button
                    id="submit-practice-btn"
                    onClick={handlePracticeSubmit}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-4 py-2 rounded-xl shadow-sm text-sm"
                  >
                    确定
                  </button>
                </div>

                {/* Kids soft keyboard helper for quick tapping */}
                <div className="grid grid-cols-5 gap-1.5 pt-2 max-w-[260px] mx-auto">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => { playSound('click'); setUserAnswer(prev => prev + num); }}
                      className="bg-white hover:bg-slate-100 border text-slate-700 font-extrabold p-2 rounded-xl text-xs flex justify-center items-center shadow-sm"
                    >
                      {num}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => { playSound('click'); setUserAnswer(''); }}
                    className="col-span-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 font-bold p-2 rounded-xl text-xs flex justify-center items-center shadow-sm"
                  >
                    清除
                  </button>
                </div>

                {practiceMessage && (
                  <div className={`p-2 rounded-xl text-xs text-center font-bold ${
                    practiceMessage.success ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                  }`}>
                    {practiceMessage.text}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-center py-20 flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mb-4">
                <HelpCircle size={32} />
              </div>
              <p className="font-bold text-slate-600">点击左下角重新做题</p>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                当你在任何闯关挑战里答错题目时，错题就会自动飞到这个超级本里哦。点击“重新做这题”来开启写字画板和神奇演示！
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
