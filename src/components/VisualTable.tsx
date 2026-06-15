/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import VisualHelper, { ItemThemeType } from './VisualHelper';
import { playSound } from '../utils/audio';
import { Sparkles, HelpCircle } from 'lucide-react';

interface VisualTableProps {
  onBack?: () => void;
}

export default function VisualTable({ onBack }: VisualTableProps) {
  const [selectedCell, setSelectedCell] = useState<{ num1: number; num2: number } | null>({ num1: 2, num2: 3 });
  const [itemTheme, setItemTheme] = useState<ItemThemeType>('apple');

  const handleCellClick = (num1: number, num2: number) => {
    playSound('click');
    setSelectedCell({ num1, num2 });
    
    // Save table fact exploration to local progress tracking
    try {
      const exploredStr = localStorage.getItem('explored_math_facts') || '[]';
      const explored = JSON.parse(exploredStr) as string[];
      const factKey = `${num1}x${num2}`;
      if (!explored.includes(factKey)) {
        explored.push(factKey);
        localStorage.setItem('explored_math_facts', JSON.stringify(explored));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getExplorationCount = () => {
    try {
      const exploredStr = localStorage.getItem('explored_math_facts') || '[]';
      return (JSON.parse(exploredStr) as string[]).length;
    } catch {
      return 0;
    }
  };

  // Generate color based on multiplier value
  const getCellBgColor = (num1: number, num2: number, isSelected: boolean) => {
    if (isSelected) {
      return 'bg-gradient-to-br from-rose-400 to-rose-500 text-white ring-4 ring-rose-200 border-rose-500 scale-105 z-10 shadow-md';
    }
    const sum = num1 + num2;
    if (sum % 4 === 0) return 'bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-200';
    if (sum % 4 === 1) return 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200';
    if (sum % 4 === 2) return 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200';
    return 'bg-sky-50 hover:bg-sky-100 text-sky-700 border-sky-200';
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto px-1">
      {/* Table Title and Theme selection */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-slate-800 flex items-center gap-2">
            📊 九九乘法口诀探索板 <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold">交互式学习</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            点击彩色的格子，就能看到对应的图形是怎样变出来的哦！快来点一点吧。
          </p>
        </div>

        {/* Theme select bar */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-600 shrink-0">换个水果：</span>
          <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-full md:w-auto">
            {(['apple', 'star', 'cookie', 'candy', 'chick'] as ItemThemeType[]).map((t) => {
              const emoji = t === 'apple' ? '🍎' : t === 'star' ? '⭐' : t === 'cookie' ? '🍪' : t === 'candy' ? '🍭' : '🐣';
              return (
                <button
                  key={t}
                  onClick={() => { playSound('click'); setItemTheme(t); }}
                  className={`px-2.5 py-1 text-base rounded-lg transition-all ${
                    itemTheme === t ? 'bg-white shadow-sm scale-110' : 'hover:bg-slate-200/50'
                  }`}
                  title={t}
                >
                  {emoji}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Layout containing grid on left, VisualHelp explanation on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Multiplication Grid Board */}
        <div className="lg:col-span-7 bg-white p-4 md:p-6 rounded-3xl border border-slate-100 shadow-sm overflow-x-auto">
          <div className="min-w-[420px]">
            {/* Headers indices */}
            <div className="grid grid-cols-10 gap-1 text-center mb-1">
              <div className="h-9 flex items-center justify-center font-black text-slate-400 text-sm bg-slate-50 rounded-xl">×</div>
              {Array.from({ length: 9 }, (_, i) => (
                <div key={i} className="h-9 flex items-center justify-center font-black text-slate-600 text-xs bg-slate-100/50 rounded-xl">
                  {i + 1}
                </div>
              ))}
            </div>

            {/* Table Core values */}
            <div className="space-y-1">
              {Array.from({ length: 9 }, (_, rowIdx) => {
                const y = rowIdx + 1;
                return (
                  <div key={rowIdx} className="grid grid-cols-10 gap-1">
                    {/* Row header index */}
                    <div className="h-9 flex items-center justify-center font-black text-slate-600 text-xs bg-slate-100/50 rounded-xl">
                      {y}
                    </div>

                    {/* Nine columns */}
                    {Array.from({ length: 9 }, (_, colIdx) => {
                      const x = colIdx + 1;
                      const isSelected = selectedCell !== null && selectedCell.num1 === y && selectedCell.num2 === x;
                      const product = x * y;

                      // Display option
                      return (
                        <button
                          key={colIdx}
                          id={`table-cell-${y}-${x}`}
                          onClick={() => handleCellClick(y, x)}
                          className={`h-9 flex flex-col items-center justify-center border text-xs font-extrabold rounded-xl transition-all cursor-pointer ${getCellBgColor(y, x, isSelected)}`}
                        >
                          <span className="text-[10px] opacity-60 leading-none">{y}&times;{x}</span>
                          <span className="text-[11px] font-black leading-none mt-0.5">{product}</span>
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>

            {/* Achievement tracker */}
            <div className="border-t border-dashed border-slate-200 mt-5 pt-4 flex justify-between items-center text-xs text-slate-500">
              <span className="flex items-center gap-1">
                ⭐ 乘法勋章进度：已点亮探索了 <span className="font-extrabold text-indigo-600">{getExplorationCount()}</span> / 81 个乘法格子
              </span>
              {getExplorationCount() >= 10 && (
                <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full font-bold flex items-center gap-1 animate-pulse">
                  <Sparkles size={12} className="text-emerald-500" /> 已获得“乘法探索者”奖
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Selected cell Visual helper display */}
        <div className="lg:col-span-5 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
          {selectedCell ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b pb-2 mb-2">
                <span className="text-xs font-bold text-rose-500 bg-rose-50 px-2.5 py-1 rounded-full">
                  🔍 正在观察这题
                </span>
                <span className="text-xs text-slate-400">
                  乘积是 {selectedCell.num1 * selectedCell.num2}
                </span>
              </div>
              <VisualHelper 
                num1={selectedCell.num1} 
                num2={selectedCell.num2} 
                operator="x" 
                theme={itemTheme} 
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-3">
                <HelpCircle size={32} />
              </div>
              <p className="font-bold text-slate-600">点击左侧彩格</p>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                随便点击乘法表里的一个小算式，奇妙的水果分盘图就会在这里展现给小朋友哦！
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
