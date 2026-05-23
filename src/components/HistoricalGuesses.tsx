import React from 'react';
import { motion } from 'motion/react';
import { Target, Skull, Shield, Heart, Zap, Flame } from 'lucide-react';
import { GuessRow, OrbInfo } from '../types';
import MindOrb from './MindOrb';

interface HistoricalGuessesProps {
  guesses: GuessRow[];
  codeLength: number;
  availableOrbs: OrbInfo[];
  shroudedTurnsActive: boolean; // boss passive that obscures feedbacks
}

export default function HistoricalGuesses({
  guesses,
  codeLength,
  availableOrbs,
  shroudedTurnsActive
}: HistoricalGuessesProps) {
  // Translate orb ID to hex color
  const getOrbHex = (id: string) => {
    const orb = availableOrbs.find((o) => o.id === id);
    return orb ? orb.hex : '#1e293b';
  };

  const getOrbName = (id: string) => {
    const orb = availableOrbs.find((o) => o.id === id);
    return orb ? orb.name : 'Unknown';
  };

  return (
    <div id="mastermind-board-board" className="bg-zinc-950/60 rounded-2xl border border-zinc-800/80 p-5 text-white flex-1 flex flex-col justify-between shadow-2xl relative">
      <div className="absolute left-6 top-6 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* Header section with instructions on feedback meanings */}
      <div className="flex justify-between items-center pb-3 border-b border-zinc-800 mb-4">
        <h3 className="text-zinc-200 font-bold text-sm tracking-tight flex items-center gap-1.5 uppercase font-mono">
          <Target className="w-4 h-4 text-cyan-400" />
          Mastermind Historical Board
        </h3>
        <div className="flex gap-4 text-[10px] font-mono text-zinc-400">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-sm border border-black/30" /> Perfect Match
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-white shadow-sm border border-black/30" /> Color Match
          </span>
        </div>
      </div>

      {/* Guesses Container / Slots */}
      <div className="flex-1 space-y-3 max-h-[460px] overflow-y-auto pr-2 custom-scrollbar min-h-[180px]">
        {guesses.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center h-full text-zinc-500">
            <Target className="w-12 h-12 text-zinc-700 animate-pulse mb-3" />
            <div className="text-sm font-semibold select-none">No active guesses registered.</div>
            <p className="text-xs text-zinc-600 mt-1 max-w-[280px]">
              Equip and place orbs above, then click 'Transmute Guess' to deal damage and decode the combination!
            </p>
          </div>
        ) : (
          guesses.map((row, index) => {
            // Build key feedback slots up to codeLength
            const perfectPegs = Array(row.perfectMatches).fill('perfect');
            const colorPegs = Array(row.colorMatches).fill('color');
            const emptyPegs = Array(Math.max(0, codeLength - row.perfectMatches - row.colorMatches)).fill('empty');
            const feedbackList = [...perfectPegs, ...colorPegs, ...emptyPegs];

            return (
              <motion.div
                key={row.id}
                id={`historical-guess-row-${index}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="grid grid-cols-12 gap-3 items-center bg-zinc-900/40 p-3 border border-zinc-900 rounded-xl hover:bg-zinc-900/80 transition"
              >
                {/* Round indicator */}
                <div className="col-span-1 text-center">
                  <div className="text-[10px] font-mono text-zinc-500 uppercase">ROUND</div>
                  <div className="text-sm font-bold font-mono text-zinc-300">0{index + 1}</div>
                </div>

                {/* Bullets (Placed Orbs) */}
                <div className="col-span-5 flex justify-center items-center gap-2">
                  {row.guess.map((orbId, idx) => {
                    const colorHex = getOrbHex(orbId);
                    const label = getOrbName(orbId);
                    return (
                      <MindOrb 
                        key={idx} 
                        orbId={orbId} 
                        className="w-8 h-8 shadow-inner" 
                        style={{ boxShadow: `0 0 10px ${colorHex}30` }}
                      />
                    );
                  })}
                </div>

                {/* Feedback Key Holes */}
                <div className="col-span-2 flex flex-col justify-center items-center">
                  <div className="text-[9px] font-mono text-zinc-500 uppercase mb-1 leading-none">KEY PEGS</div>
                  {shroudedTurnsActive && (index + 1) % 3 === 0 ? (
                    <div className="px-1.5 py-0.5 bg-purple-950/80 border border-purple-500/30 text-purple-400 text-[9px] font-mono uppercase rounded rounded-sm glitch-animation animate-pulse text-center">
                      🕵️ SHROUDED
                    </div>
                  ) : (
                    <div id={`feedback-pegs-row-${index}`} className="grid grid-cols-2 gap-1 bg-black/40 p-1.5 border border-zinc-800/60 rounded-lg">
                      {feedbackList.map((type, fIdx) => (
                        <div
                          key={fIdx}
                          className={`w-2.5 h-2.5 rounded-full transition-colors border ${
                            type === 'perfect'
                              ? 'bg-red-500 border-red-400 shadow-sm shadow-red-500/40'
                              : type === 'color'
                              ? 'bg-white border-zinc-300 shadow-sm shadow-white/40'
                              : 'bg-zinc-800/80 border-zinc-950'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* RPG Combat Combat Calculation Logs */}
                <div className="col-span-4 pl-2 border-l border-zinc-800/80 text-xs">
                  <div className="space-y-1 font-mono text-[11px]">
                    {/* Damage dealt indicators */}
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400">Total Dmg:</span>
                      <span className="font-bold text-red-500 flex items-center gap-0.5">
                        <Zap className="w-3 h-3" />
                        {row.damageDealt}
                        {row.isCrit && (
                          <span className="text-[8px] bg-red-950 text-red-400 font-extrabold px-1 rounded animate-bounce">
                            CRIT!
                          </span>
                        )}
                      </span>
                    </div>

                    {/* Shields / Healing gains indicators */}
                    {(row.healingDone > 0 || row.shieldGain > 0) && (
                      <div className="flex justify-between items-center gap-1.5">
                        <span className="text-zinc-400">Defense:</span>
                        <div className="flex items-center gap-1">
                          {row.healingDone > 0 && (
                            <span className="text-emerald-400 flex items-center font-bold text-[10px]">
                              <Heart className="w-2.5 h-2.5 fill-current" />+{row.healingDone}
                            </span>
                          )}
                          {row.shieldGain > 0 && (
                            <span className="text-cyan-400 flex items-center font-bold text-[10px]">
                              <Shield className="w-2.5 h-2.5 fill-current" />+{row.shieldGain}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Environmental extra effects */}
                    {row.isIgnited && (
                      <div className="flex justify-between items-center text-orange-400 text-[10px]">
                        <span>Debuff:</span>
                        <span className="flex items-center gap-0.5">
                          <Flame className="w-2.5 h-2.5" /> Ignited Boss!
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
