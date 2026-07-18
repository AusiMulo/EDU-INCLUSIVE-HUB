/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Award, Lock, Sparkles, AlertCircle, Heart } from 'lucide-react';
import { Badge } from '../types';

interface BadgeShelfProps {
  badges: Badge[];
  onActivityLog: (activity: string, xpEarned: number) => void;
}

export default function BadgeShelf({ badges, onActivityLog }: BadgeShelfProps) {
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(badges[0]);

  // Synthesize a beautiful harp/fairy chime for badge clicks
  const playHarpChime = (isUnlocked: boolean) => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      if (isUnlocked) {
        // High fairy harp sweep (C5 -> E5 -> G5 -> C6)
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, idx) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * 0.08);

          gain.gain.setValueAtTime(0.08, audioCtx.currentTime + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);

          osc.connect(gain);
          gain.connect(audioCtx.destination);

          osc.start(audioCtx.currentTime + idx * 0.08);
          osc.stop(audioCtx.currentTime + 0.5);
        });
      } else {
        // Low double-dud knock (A1 -> G1)
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(150, audioCtx.currentTime);

        gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + 0.15);
      }
    } catch (err) {
      console.warn('Web Audio Context not available:', err);
    }
  };

  const handleBadgeClick = (badge: Badge) => {
    setSelectedBadge(badge);
    playHarpChime(badge.unlocked);
    if (badge.unlocked) {
      onActivityLog(`Interacted with unlocked reward badge: "${badge.name}"`, 2);
    }
  };

  const unlockedCount = badges.filter((b) => b.unlocked).length;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm" id="section_badges_shelf">
      <div className="flex justify-between items-center pb-4 border-b border-slate-150 mb-6">
        <div className="flex items-center space-x-2">
          <span className="p-1.5 bg-amber-50 text-amber-500 rounded-lg animate-float">
            <Award className="h-5 w-5 fill-amber-100" />
          </span>
          <div>
            <h4 className="font-display font-bold text-slate-800 text-sm leading-none">
              My Digital Sticker Book
            </h4>
            <span className="text-[10px] text-slate-400 font-medium">Earn trophies by solving quizzes and lessons!</span>
          </div>
        </div>

        <span className="text-xs font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1.5 rounded-full">
          Unlocked {unlockedCount} / {badges.length} Stickers
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Stickers Grid Shelf (7 cols) */}
        <div className="md:col-span-7 bg-slate-50 rounded-2xl p-4 border border-slate-150">
          <div className="grid grid-cols-3 gap-3">
            {badges.map((badge) => {
              const isSelected = selectedBadge?.id === badge.id;
              return (
                <button
                  key={badge.id}
                  onClick={() => handleBadgeClick(badge)}
                  className={`relative p-3.5 rounded-2xl border transition-all flex flex-col items-center justify-center text-center cursor-pointer ${
                    badge.unlocked
                      ? isSelected
                        ? 'bg-white border-amber-400 shadow-sm transform scale-105'
                        : 'bg-white border-slate-200 hover:bg-slate-100/40 hover:scale-102'
                      : isSelected
                      ? 'bg-slate-100 border-slate-350 opacity-60'
                      : 'bg-slate-100 border-slate-200 opacity-40 hover:opacity-50'
                  }`}
                >
                  {/* Badge Emoji icon */}
                  <span className={`text-4xl block mb-2 transition-transform ${badge.unlocked ? 'hover:rotate-12' : 'grayscale'}`}>
                    {badge.icon}
                  </span>

                  <p className="font-display font-bold text-xs text-slate-700 truncate w-full">
                    {badge.name}
                  </p>

                  {/* Lock Indicator overlays */}
                  {!badge.unlocked && (
                    <span className="absolute top-2 right-2 bg-slate-200/80 text-slate-600 p-0.5 rounded-full">
                      <Lock className="h-3 w-3" />
                    </span>
                  )}
                  {badge.unlocked && (
                    <span className="absolute top-2 right-2 text-amber-500 animate-pulse text-xs">
                      ⭐
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Sticker Inspect (5 cols) */}
        <div className="md:col-span-5 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col justify-between min-h-[220px]">
          {selectedBadge ? (
            <>
              <div>
                <div className="flex items-center space-x-2 pb-2.5 border-b border-amber-200 mb-3">
                  <span className="text-4xl">{selectedBadge.icon}</span>
                  <div>
                    <h5 className="font-display font-bold text-amber-950 text-sm leading-none">
                      {selectedBadge.name}
                    </h5>
                    <span className="text-[9px] font-mono font-bold uppercase text-amber-600">
                      {selectedBadge.category} trophy
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {selectedBadge.description}
                </p>
              </div>

              {selectedBadge.unlocked ? (
                <div className="bg-white/80 p-2.5 rounded-xl border border-amber-200 flex items-center justify-between text-[11px] text-amber-900 font-bold">
                  <div className="flex items-center space-x-1">
                    <Sparkles className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
                    <span>Unlocked Badge!</span>
                  </div>
                  <span className="text-[9px] font-mono font-normal">Ready to show off!</span>
                </div>
              ) : (
                <div className="bg-slate-100 p-2.5 rounded-xl border border-slate-200 flex items-center space-x-1.5 text-[10px] text-slate-500 leading-normal">
                  <AlertCircle className="h-4 w-4 text-slate-400 shrink-0" />
                  <span>
                    To unlock this badge, complete more subject lessons or solve quizzes with 100% scores!
                  </span>
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-xs text-slate-400">
              <Award className="h-8 w-8 text-slate-300 mb-1" />
              <p>Click any digital sticker on the shelf to inspect its achievements!</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
