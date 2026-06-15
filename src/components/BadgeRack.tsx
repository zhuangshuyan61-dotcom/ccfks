/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AchievementBadge } from '../types';
import { playSound } from '../utils/audio';
import { Award, Lock, Sparkles, Check } from 'lucide-react';

interface BadgeRackProps {
  earnedBadgeIds: string[];
}

export default function BadgeRack({ earnedBadgeIds }: BadgeRackProps) {
  // Static badge specifications
  const BADGES_LIST: AchievementBadge[] = [
    {
      id: 'first_game',
      title: '口算初体验',
      description: '完成任意 1 次乘除法口算关卡',
      icon: '🌟',
      color: 'from-amber-400 to-yellow-500 text-amber-950',
    },
    {
      id: 'perfect_10',
      title: '满分小状元',
      description: '在任意一次关卡挑战里拿到 10 分满分',
      icon: '🏆',
      color: 'from-yellow-400 to-amber-600 text-yellow-950',
    },
    {
      id: 'half_victory',
      title: '乘法小达人',
      description: '解锁并完成 Level 5 分平除法关卡',
      icon: '🚀',
      color: 'from-sky-400 to-blue-500 text-sky-950',
    },
    {
      id: 'max_streak_5',
      title: '连对小神童',
      description: '连续答对 5 道题目（算得又快又准）',
      icon: '🔥',
      color: 'from-orange-400 to-red-500 text-orange-950',
    },
    {
      id: 'speed_star',
      title: '闪电飞毛腿',
      description: '平均每道题目的口算速度小于 5 秒钟',
      icon: '⚡',
      color: 'from-purple-400 to-indigo-500 text-purple-950',
    },
    {
      id: 'table_explore',
      title: '九九百事通',
      description: '在“九九口诀探索板”上点击学习了至少 10 个格子',
      icon: '📊',
      color: 'from-teal-400 to-emerald-500 text-teal-950',
    },
    {
      id: 'remedy_master',
      title: '消灭错题王',
      description: '进入错题本，亲自动手消灭改正所有做错过的题目',
      icon: '📝',
      color: 'from-rose-400 to-pink-500 text-white',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Overview stats header */}
      <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6 rounded-4xl text-white shadow-md relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 text-9xl opacity-10 select-none">
          🏆
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] bg-white/20 text-white font-extrabold px-3 py-1 rounded-full uppercase tracking-widest inline-block mb-1">
              荣誉殿堂
            </span>
            <h2 className="text-xl md:text-2xl font-black">
              我的数学大勋章墙 🥇
            </h2>
            <p className="text-xs text-indigo-100 max-w-md">
              每完成一次挑战，纠正做错的题目，或者学完九九口诀，都能解锁独特的成长奖章哦！
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl text-center border border-white/20">
            <span className="text-xs block text-purple-200">已收集勋章</span>
            <span className="text-3xl font-black">{earnedBadgeIds.length} <span className="text-sm font-bold">/ {BADGES_LIST.length}</span></span>
          </div>
        </div>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {BADGES_LIST.map((b) => {
          const isEarned = earnedBadgeIds.includes(b.id);
          
          return (
            <div
              key={b.id}
              className={`p-5 rounded-3xl border-2 transition-all flex flex-col items-center text-center relative overflow-hidden ${
                isEarned
                  ? 'bg-white border-indigo-200 shadow-sm hover:scale-[1.03]'
                  : 'bg-slate-50 border-slate-100 opacity-70'
              }`}
            >
              {isEarned && (
                <div className="absolute top-2 right-2 bg-indigo-50 text-indigo-600 rounded-full p-1 border border-indigo-100 flex items-center justify-center animate-pulse">
                  <Check size={10} className="stroke-[5]" />
                </div>
              )}

              {/* Icon Container */}
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-sm mb-3 ${
                isEarned 
                  ? `bg-gradient-to-br ${b.color} animate-bounce` 
                  : 'bg-slate-200 text-slate-400'
              }`}
              style={{ animationDuration: '3s' }}
              >
                {isEarned ? b.icon : <Lock size={20} className="stroke-[2.5]" />}
              </div>

              {/* Metadata */}
              <h4 className={`font-black text-sm ${isEarned ? 'text-slate-800' : 'text-slate-500'}`}>
                {b.title}
              </h4>
              
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed grow flex items-center justify-center">
                {b.description}
              </p>

              {/* Bottom status text */}
              <div className="mt-4 w-full pt-3 border-t border-dashed border-slate-100">
                {isEarned ? (
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold">
                    ✨ 已解锁
                  </span>
                ) : (
                  <span className="text-[10px] bg-slate-200/60 text-slate-500 px-2   py-0.5 rounded-full font-bold">
                    🔒 待解锁
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
