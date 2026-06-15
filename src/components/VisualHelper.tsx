/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Apple, Star, Circle, Moon, Trophy } from 'lucide-react';

export type ItemThemeType = 'apple' | 'star' | 'cookie' | 'candy' | 'chick';

interface VisualHelperProps {
  num1: number;
  num2: number;
  operator: 'x' | '÷';
  theme?: ItemThemeType;
}

export default function VisualHelper({ num1, num2, operator, theme = 'apple' }: VisualHelperProps) {
  const [activeTab, setActiveTab] = useState<'visual' | 'equation'>('visual');

  // Multi-theme renderer for items
  const renderItem = (index: number) => {
    switch (theme) {
      case 'apple':
        return (
          <span key={index} className="inline-flex items-center justify-center w-8 h-8 md:w-10 md:h-10 text-2xl animate-bounce" style={{ animationDelay: `${index * 50}ms` }} role="img" aria-label="apple">
            🍎
          </span>
        );
      case 'star':
        return (
          <span key={index} className="inline-flex items-center justify-center w-8 h-8 md:w-10 md:h-10 text-2xl animate-pulse" style={{ animationDelay: `${index * 50}ms` }} role="img" aria-label="star">
            ⭐
          </span>
        );
      case 'cookie':
        return (
          <span key={index} className="inline-flex items-center justify-center w-8 h-8 md:w-10 md:h-10 text-2xl" role="img" aria-label="cookie">
            🍪
          </span>
        );
      case 'candy':
        return (
          <span key={index} className="inline-flex items-center justify-center w-8 h-8 md:w-10 md:h-10 text-2xl" role="img" aria-label="candy">
            🍭
          </span>
        );
      case 'chick':
        return (
          <span key={index} className="inline-flex items-center justify-center w-8 h-8 md:w-10 md:h-10 text-2xl" role="img" aria-label="chick">
            🐣
          </span>
        );
      default:
        return (
          <span key={index} className="inline-flex items-center justify-center w-8 h-8 md:w-10 md:h-10 text-2xl" role="img" aria-label="dot">
            🔴
          </span>
        );
    }
  };

  const getThemeChineseName = () => {
    switch (theme) {
      case 'apple': return '红苹果';
      case 'star': return '闪亮星';
      case 'cookie': return '甜小饼';
      case 'candy': return '棒棒糖';
      case 'chick': return '萌小鸡';
    }
  };

  // Multiplication Helper: num1 rows/groups of num2 items
  const renderMultiplicationHelper = () => {
    const groups = [];
    for (let i = 0; i < num1; i++) {
      const itemsInGroup = [];
      for (let j = 0; j < num2; j++) {
        itemsInGroup.push(renderItem(i * num2 + j));
      }
      groups.push(itemsInGroup);
    }

    const additionList = Array(num1).fill(num2);
    const additionExpr = additionList.join(' + ');
    const total = num1 * num2;

    return (
      <div className="space-y-4">
        <p className="text-sm font-medium text-amber-800 text-center mb-1">
          💡 <span className="bg-amber-100 px-2 py-0.5 rounded-full">{num1} &times; {num2}</span> 表示有 <span className="font-bold text-amber-600 underline">{num1} 堆</span> 物品，每堆有 <span className="font-bold text-amber-600 underline">{num2} 个</span>：
        </p>

        {/* Display Container cards for each group */}
        <div className="flex flex-wrap justify-center gap-4 py-2">
          {groups.map((groupItems, groupIndex) => (
            <div 
              key={groupIndex} 
              className="relative p-3 bg-white border-2 border-amber-300 rounded-2xl shadow-sm text-center flex flex-col items-center justify-center min-w-[100px] max-w-[150px]"
            >
              <div className="absolute -top-3 -left-2 bg-amber-400 text-amber-950 font-bold text-xs px-2 py-0.5 rounded-full shadow-sm">
                第 {groupIndex + 1} 盘
              </div>
              <div className="grid grid-cols-3 gap-1 mt-1 justify-items-center">
                {groupItems}
              </div>
              <p className="text-xs text-amber-700 font-bold mt-2">有 {num2} 个</p>
            </div>
          ))}
        </div>

        {/* Repeated Addition Helper Card */}
        <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200">
          <p className="text-sm text-center text-amber-950 font-bold">
            算一算加法：
          </p>
          <p className="text-lg md:text-xl font-bold text-center text-amber-600 tracking-wide mt-1">
            {additionExpr} = <span className="text-rose-500 font-bold underline text-2xl">{total}</span>
          </p>
          <p className="text-xs text-center text-slate-500 mt-1">
            小朋有，数一数，所有的盘子里一共也是 <span className="font-bold text-slate-700">{total}</span> 个哟！
          </p>
        </div>
      </div>
    );
  };

  // Division Helper: num1 items divided equally in num2 groups
  const renderDivisionHelper = () => {
    const totalItemsCount = num1;
    const dividerGroupsCount = num2;
    const itemsPerGroupCount = Math.floor(totalItemsCount / dividerGroupsCount);
    const remainder = totalItemsCount % dividerGroupsCount;

    // Build lists
    const totalItems = [];
    for (let i = 0; i < totalItemsCount; i++) {
      totalItems.push(renderItem(i));
    }

    const sharedGroups = [];
    for (let i = 0; i < dividerGroupsCount; i++) {
      const itemsInThisGroup = [];
      for (let j = 0; j < itemsPerGroupCount; j++) {
        itemsInThisGroup.push(renderItem(300 + i * itemsPerGroupCount + j));
      }
      sharedGroups.push(itemsInThisGroup);
    }

    return (
      <div className="space-y-4">
        <p className="text-sm font-medium text-sky-800 text-center mb-1">
          💡 <span className="bg-sky-100 px-2 py-0.5 rounded-full">{num1} &divide; {num2}</span> 表示把 <span className="font-bold text-sky-600 underline">{num1} 个</span> 总物品，平均分给 <span className="font-bold text-sky-600 underline">{num2} 位</span> 小朋友：
        </p>

        {/* Total items representation */}
        <div className="bg-sky-50 p-3 rounded-2xl border border-sky-100 text-center">
          <p className="text-xs font-bold text-sky-700 mb-2">🎁 我们准备了正好 {totalItemsCount} 个 {getThemeChineseName()}：</p>
          <div className="flex flex-wrap justify-center gap-1 opacity-90 max-w-[320px] mx-auto">
            {totalItems}
          </div>
        </div>

        <p className="text-center font-bold text-sky-700 text-xs">👇 开始平分（每个人分一分）：</p>

        {/* Recipients containers */}
        <div className="flex flex-wrap justify-center gap-3">
          {sharedGroups.map((groupItems, groupIndex) => (
            <div 
              key={groupIndex} 
              className="p-3 bg-white border-2 border-sky-300 rounded-2xl shadow-sm text-center flex flex-col items-center justify-center min-w-[90px] max-w-[130px]"
            >
              <div className="w-10 h-10 bg-sky-100 text-2xl flex items-center justify-center rounded-full mb-1">
                🧑‍🤝‍🧑
              </div>
              <p className="text-xs text-sky-900 font-bold mb-1">第 {groupIndex + 1} 人</p>
              <div className="flex flex-wrap gap-0.5 justify-center mt-1 border-t border-dashed border-sky-200 pt-1.5 w-full">
                {groupItems}
              </div>
              <p className="text-xs font-bold text-sky-600 mt-1">分得 {itemsPerGroupCount} 个</p>
            </div>
          ))}
        </div>

        {/* Explanation Card */}
        <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-200">
          <p className="text-sm text-center text-emerald-950 font-bold">
            口算大揭秘：
          </p>
          <p className="text-sm text-center text-emerald-800 mt-1 leading-relaxed">
            把 <span className="font-bold text-rose-500 text-base">{totalItemsCount}</span> 个分给 <span className="font-bold text-sky-600 text-sm">{dividerGroupsCount}</span> 个人，每个人恰好分到 <span className="font-bold text-emerald-600 text-lg underline">{itemsPerGroupCount}</span> 个！
          </p>
          {remainder > 0 && (
            <p className="text-xs text-center text-amber-600 font-medium">
              （还剩下了 {remainder} 个哦）
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div id="visual-helper-container" className="bg-gradient-to-br from-amber-50/40 to-sky-50/40 border border-slate-100 rounded-3xl p-4 shadow-sm md:p-6">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
          🎈 奇妙图形小帮手
        </h4>
        <div className="flex bg-slate-200/60 p-0.5 rounded-lg text-xs">
          <button
            id="helper-tab-visual"
            onClick={() => setActiveTab('visual')}
            className={`px-3 py-1 rounded-md font-bold transition-all ${
              activeTab === 'visual' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            看图数数
          </button>
          <button
            id="helper-tab-equation"
            onClick={() => setActiveTab('equation')}
            className={`px-3 py-1 rounded-md font-bold transition-all ${
              activeTab === 'equation' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            算式口诀
          </button>
        </div>
      </div>

      {activeTab === 'visual' ? (
        operator === 'x' ? renderMultiplicationHelper() : renderDivisionHelper()
      ) : (
        <div className="py-6 text-center space-y-4">
          <div className="inline-block bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-sm">
            <p className="text-3xl md:text-4xl font-black text-slate-800 tracking-wide">
              {num1} {operator === 'x' ? '×' : '÷'} {num2} = ?
            </p>
          </div>
          
          <div className="max-w-md mx-auto space-y-2 mt-4 text-left p-4 bg-white/80 rounded-2xl border border-slate-100">
            <h5 className="font-bold text-slate-700 text-sm">🧠 口诀与小记忆：</h5>
            {operator === 'x' ? (
              <p className="text-xs text-slate-600 leading-relaxed">
                在九九乘法表里有用哦！可以背诵：
                <span className="font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded ml-1">
                  {num1 <= num2 ? `${num1} ${num2}` : `${num2} ${num1}`}的口诀
                </span>。<br/>
                比如：如果是 <span className="font-bold">2和5</span>，口诀就是“二五一十”，所以答案就是 10！
              </p>
            ) : (
              <p className="text-xs text-slate-600 leading-relaxed">
                想一想乘法逆运算：<br/>
                寻找 <span className="font-bold text-sky-600">？&times; {num2} = {num1}</span> 的那个数？<br/>
                比如：求 <span className="font-bold text-rose-600">6 &divide; 2 = ？</span> 我们就想“几 乘以 2 等于 6 ”。因为“有三二得六”，所以得 3！
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
