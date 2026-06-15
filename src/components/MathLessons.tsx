/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { playSound } from '../utils/audio';
import { BookOpen, Sparkles, HelpCircle, ArrowRight, ArrowLeft } from 'lucide-react';

export default function MathLessons() {
  const [activeLesson, setActiveLesson] = useState<number>(0);
  const [multFactor, setMultFactor] = useState<number>(3);
  const [divTotal, setDivTotal] = useState<number>(8);

  const lessons = [
    {
      id: 0,
      title: '🍎 什么是“乘法”呀？',
      subtitle: '加法的超级化身！',
      emoji: '🎒',
    },
    {
      id: 1,
      title: '🍭 什么是“除法”呀？',
      subtitle: '排排坐、分果果！',
      emoji: '🍩',
    },
    {
      id: 2,
      title: '🤝 乘除法原来是一家人！',
      subtitle: '神奇的逆运算天梯',
      emoji: '💫',
    },
  ];

  const handleNextLesson = () => {
    playSound('click');
    if (activeLesson < lessons.length - 1) {
      setActiveLesson(activeLesson + 1);
    }
  };

  const handlePrevLesson = () => {
    playSound('click');
    if (activeLesson > 0) {
      setActiveLesson(activeLesson - 1);
    }
  };

  // Render Lesson 1 content
  const renderLessonMultiplication = () => {
    const dotsArray = Array(multFactor).fill(2);
    return (
      <div className="space-y-4 animate-fade-in text-left">
        <h4 className="font-extrabold text-slate-800 text-base md:text-lg flex items-center gap-1.5 border-b pb-2">
          🐣 乘法的大秘密：其实它就是“加法”偷懒哦！
        </h4>
        <p className="text-xs text-slate-600 leading-relaxed">
          小朋友，想象一下：如果兔妈妈让你摘松果，摘了 <span className="font-bold text-rose-500">3 堆</span>，每一堆都有 <span className="font-bold text-indigo-600">2 个</span>。
          我们想知道一共有几个，你可以用加法：
        </p>

        {/* Dynamic Display controls */}
        <div className="flex items-center gap-2 bg-rose-50 border border-rose-100 p-3 rounded-2xl">
          <span className="text-xs font-bold text-slate-600">调整堆数（1-5）：</span>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                onClick={() => { playSound('click'); setMultFactor(num); }}
                className={`w-8 h-8 rounded-full font-black text-xs transition-all ${
                  multFactor === num ? 'bg-rose-500 text-white shadow-sm scale-110' : 'bg-white border hover:bg-slate-50 text-slate-700'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Grid visualization */}
        <div className="flex flex-wrap justify-center gap-3 py-2">
          {Array.from({ length: multFactor }, (_, idx) => (
            <div key={idx} className="bg-white border-2 border-dashed border-rose-300 p-3 rounded-2xl text-center min-w-[70px] shadow-sm transform hover:scale-105 transition-all">
              <p className="text-xs text-rose-400 font-bold mb-1">第 {idx + 1} 堆</p>
              <div className="flex gap-1 justify-center">
                <span className="text-xl">🍓</span>
                <span className="text-xl">🍓</span>
              </div>
              <p className="text-[10px] text-slate-500 font-bold mt-1">有 2 个</p>
            </div>
          ))}
        </div>

        {/* Math equation side by side Comparison */}
        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm space-y-2.5">
          <div>
            <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-bold">加法算式：</span>
            <p className="text-sm font-bold text-slate-700 mt-1 leading-none">
              {Array(multFactor).fill(2).join(' + ')} = <span className="text-indigo-600 text-base">{multFactor * 2}</span>
            </p>
          </div>

          <div className="border-t border-dashed pt-2.5">
            <span className="text-[10px] bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-bold">乘法超级战衣：</span>
            <p className="text-xl font-black text-rose-600 mt-1 leading-none">
              2 &times; {multFactor} = <span className="text-2xl font-black underline text-indigo-600">{multFactor * 2}</span>
            </p>
            <p className="text-xs text-slate-400 mt-1">
              读作：二乘以{multFactor}等于{multFactor * 2}。看！加法要写那么长一串，而乘法只需要短短一个算式，太方便了吧！
            </p>
          </div>
        </div>
      </div>
    );
  };

  // Render Lesson 2 content
  const renderLessonDivision = () => {
    const dividerCount = 2; // Fixed split by 2 for simpleness
    const answer = Math.floor(divTotal / dividerCount);

    return (
      <div className="space-y-4 animate-fade-in text-left">
        <h4 className="font-extrabold text-slate-800 text-base md:text-lg flex items-center gap-1.5 border-b pb-2">
          🐻 除法的大秘密：大伙平分，排排坐，分果果！
        </h4>
        <p className="text-xs text-slate-600 leading-relaxed">
          除法（记号是 <span className="font-black text-sky-500">“&divide;”</span>）在我们的生活里特别多哦。比如老师抱来了很多糖果，想
          <span className="font-bold text-indigo-600 underline">公平地平分给 2 个小朋友</span>。每个人怎么分到一样多的呢？
        </p>

        {/* Dynamic Display controls */}
        <div className="flex items-center gap-2 bg-sky-50 border border-sky-100 p-3 rounded-2xl">
          <span className="text-xs font-bold text-slate-600">总共几粒糖（2, 4, 6, 8, 10）：</span>
          <div className="flex gap-1.5">
            {[2, 4, 6, 8, 10].map((num) => (
              <button
                key={num}
                onClick={() => { playSound('click'); setDivTotal(num); }}
                className={`w-8 h-8 rounded-full font-black text-xs transition-all ${
                  divTotal === num ? 'bg-sky-500 text-white shadow-sm scale-110' : 'bg-white border hover:bg-slate-50 text-slate-700'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* Total candy basket display */}
        <div className="text-center bg-slate-50/50 p-3 rounded-2xl border border-dashed border-slate-200">
          <p className="text-xs font-extrabold text-slate-500 mb-1">🎁 桌子底下的盒子里正好有 {divTotal} 粒糖果：</p>
          <div className="flex justify-center gap-1 text-xl animate-pulse">
            {Array.from({ length: divTotal }, (_, i) => '🍬').join(' ')}
          </div>
        </div>

        {/* Split boxes representation */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white border-2 border-sky-200 p-3.5 rounded-2xl text-center shadow-sm">
            <p className="text-xl mb-1">👦</p>
            <p className="text-xs font-bold text-sky-900">小明分到的：</p>
            <div className="flex justify-center gap-1 my-2 text-xl">
              {Array.from({ length: answer }, (_, i) => renderToyEmoji(i))}
            </div>
            <p className="text-xs text-sky-600 font-extrabold">{answer} 粒</p>
          </div>

          <div className="bg-white border-2 border-sky-200 p-3.5 rounded-2xl text-center shadow-sm">
            <p className="text-xl mb-1">👧</p>
            <p className="text-xs font-bold text-sky-900">小红分到的：</p>
            <div className="flex justify-center gap-1 my-2 text-xl">
              {Array.from({ length: answer }, (_, i) => renderToyEmoji(i + 1))}
            </div>
            <p className="text-xs text-sky-600 font-extrabold">{answer} 粒</p>
          </div>
        </div>

        {/* Explanation Card */}
        <div className="bg-sky-50/50 p-4 border border-sky-200 rounded-3xl">
          <span className="text-[10px] bg-sky-200 text-sky-900 px-2 py-0.5 rounded-full font-bold">除法算式大写：</span>
          <p className="text-xl font-black text-sky-600 mt-1.5">
            {divTotal} &divide; 2 = <span className="text-2xl font-black underline text-indigo-600">{answer}</span>
          </p>
          <p className="text-xs text-slate-500 mt-1">
            读作：{divTotal} 除以 2 等于 {answer}。表示我们把 {divTotal} 个大苹果平均分作 2 份，每份的大小正是 {answer} 个。这下大家吃的一摸一样多，再也不用抢啦！
          </p>
        </div>
      </div>
    );
  };

  const renderToyEmoji = (idx: number) => {
    const list = ['🍬', '🍭', '🍩', '🍪', '🍫'];
    return list[idx % list.length];
  };

  // Render Lesson 3 content
  const renderLessonRelationship = () => {
    return (
      <div className="space-y-4 animate-fade-in text-left">
        <h4 className="font-extrabold text-slate-800 text-base md:text-lg flex items-center gap-1.5 border-b pb-2">
          🤝 乘除逆天梯：它们是一对神奇的“反义词”！
        </h4>
        <p className="text-xs text-slate-600 leading-relaxed">
          小朋友，你一定知道“大”的反义词是“小”，“上”的反义词是“下”，那在数学的超能力世界里：
          <span className="font-bold text-rose-500 ml-1">“乘法的反义词，就是除法”</span> 哦！
        </p>

        {/* Interactive correlation display cards */}
        <div className="bg-lavender-50 bg-gradient-to-br from-indigo-550/10 to-purple-550/10 border-2 border-indigo-200 p-5 rounded-3xl relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center items-center">
            {/* Multiplication fact */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-indigo-100">
              <span className="block text-[10px] text-rose-500 font-extrabold">乘法拼拼看 🧱</span>
              <p className="text-2xl font-black text-indigo-600 mt-1">3 &times; 4 = 12</p>
              <p className="text-xs text-slate-500 mt-1.5">
                表示“3 个 4 叠在一起可以堆出 12个星星”。
              </p>
            </div>

            {/* Division Fact */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-indigo-100">
              <span className="block text-[10px] text-sky-500 font-extrabold">除法拆拆看 🪚</span>
              <p className="text-2xl font-black text-indigo-600 mt-1">12 &divide; 3 = 4</p>
              <p className="text-xs text-slate-500 mt-1.5">
                表示“如果把 12个星星切分回 3 个抽屉，每个抽屉还是 4 个”。
              </p>
            </div>
          </div>

          <div className="text-center font-bold text-xs text-slate-500 mt-4">
            🔄 <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">想做除法真简单</span> 只需要倒着想乘法口诀！
            比如：算 <span className="font-black text-slate-700 underline">20 &divide; 5 = ？</span>
            我们只需要想：几乘以 5 等于 20 呢？背诵口诀“四五二十”，所以商就是 4！
          </div>
        </div>

        {/* Summary encouraging alert */}
        <div className="bg-emerald-50 p-4 rounded-3xl border border-emerald-200">
          <p className="text-xs text-emerald-800 leading-relaxed font-bold">
            💡 一句话学习法：<br/>
            只要你能背出基础的乘法口诀，你就一定也拥有做对所有除法的超能神医术哦！让我们点击底部的“关卡练习”，去挑战数学乐园吧！
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title */}
      <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-500 text-2xl shadow-sm">
            📚
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-black text-slate-800">
              🏫 奇妙数学微学堂 <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold ml-1">动画交互式原理</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              不急着做题！在这里听老师讲故事，动手拨拨数字，很快就学会啦。
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Side relative links navigation tabs list */}
        <div className="md:col-span-4 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm space-y-2">
          <p className="text-[10px] text-slate-400 font-extrabold px-1 uppercase tracking-wider mb-2">学堂目录：</p>
          {lessons.map((les) => {
            const isSelected = activeLesson === les.id;
            return (
              <button
                key={les.id}
                id={`lesson-tab-${les.id}`}
                onClick={() => { playSound('click'); setActiveLesson(les.id); }}
                className={`w-full p-3.5 rounded-2xl text-left border transition-all flex items-center gap-3 cursor-pointer ${
                  isSelected 
                    ? 'border-indigo-400 bg-indigo-550/10 scale-[1.01] shadow-sm font-black text-indigo-950' 
                    : 'border-slate-50 bg-slate-50 hover:bg-slate-100/75 text-slate-600'
                }`}
              >
                <div className="text-2xl shrink-0">{les.emoji}</div>
                <div>
                  <h4 className="text-xs font-black leading-tight">{les.title}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">{les.subtitle}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right active content frame rendering */}
        <div className="md:col-span-8 bg-white p-5 md:p-6 rounded-4xl border border-slate-100 shadow-sm min-h-[380px] flex flex-col justify-between">
          <div className="grow mb-6">
            {activeLesson === 0 && renderLessonMultiplication()}
            {activeLesson === 1 && renderLessonDivision()}
            {activeLesson === 2 && renderLessonRelationship()}
          </div>

          {/* Quick navigation bottom controllers */}
          <div className="border-t border-dashed border-slate-200 pt-4 flex justify-between items-center text-xs">
            <button
              id="lesson-prev-btn"
              onClick={handlePrevLesson}
              disabled={activeLesson === 0}
              className="flex items-center gap-1 font-bold text-slate-500 hover:text-slate-800 disabled:opacity-40"
            >
              <ArrowLeft size={14} /> 上一课
            </button>
            
            <p className="text-slate-400">
              第 <span className="font-extrabold text-slate-600">{activeLesson + 1}</span> / {lessons.length} 课
            </p>

            <button
              id="lesson-next-btn"
              onClick={handleNextLesson}
              disabled={activeLesson === lessons.length - 1}
              className="flex items-center gap-1 font-bold text-indigo-600 hover:text-indigo-800 disabled:opacity-40"
            >
              下一课 <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
