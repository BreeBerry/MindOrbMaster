import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Trophy,
  RotateCw,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Skull,
  Coins,
  Compass,
  AlertCircle,
  HelpCircle,
  Lightbulb,
  Zap,
  ChevronRight
} from 'lucide-react';
import { RewardBreakdown, OrbInfo } from '../types';
import { INITIAL_ORBS, BOSS_CAMPAIGN } from '../data';
import MindOrb from './MindOrb';

interface RewardModalProps {
  reward: RewardBreakdown | null;
  onClose: () => void;
  onRetry: () => void;
  onGoToForge: () => void;
  onNextStage: () => void;
  hasNextStage: boolean;
}

export default function RewardModal({
  reward,
  onClose,
  onRetry,
  onGoToForge,
  onNextStage,
  hasNextStage
}: RewardModalProps) {
  if (!reward) return null;

  const isWin = reward.status === 'VICTORY';
  const secretCodeColors = reward.secretCode.map(id => INITIAL_ORBS.find(o => o.id === id) || INITIAL_ORBS[0]);
  const matchingBoss = BOSS_CAMPAIGN.find(b => b.name === reward.bossName) || BOSS_CAMPAIGN[0];

  const [imgSrc, setImgSrc] = useState<string>('');
  const [bgSrc, setBgSrc] = useState<string>('');

  useEffect(() => {
    if (matchingBoss) {
      setImgSrc(matchingBoss.portraitUrl);
      setBgSrc(matchingBoss.stageBgUrl);
    }
  }, [matchingBoss]);

  const handleImgError = () => {
    setImgSrc('');
  };

  const handleBgError = () => {
    if (matchingBoss) {
      if (bgSrc === matchingBoss.stageBgUrl) {
        if (matchingBoss.fallbackBgUrl) {
          setBgSrc(matchingBoss.fallbackBgUrl);
        } else {
          setBgSrc(matchingBoss.portraitUrl);
        }
      } else if (bgSrc === matchingBoss.fallbackBgUrl) {
        setBgSrc(matchingBoss.portraitUrl);
      } else {
        setBgSrc('');
      }
    }
  };

  const getBossEmoji = (bossId: string) => {
    switch (bossId) {
      case 'boss_1': return '🍋';
      case 'boss_2': return '🧱';
      case 'boss_3': return '⚙️';
      case 'boss_4': return '🐝';
      case 'boss_5': return '🃏';
      case 'boss_6': return '🌺';
      case 'boss_7': return '🛡️';
      case 'boss_8': return '🕷️';
      case 'boss_9': return '❄️';
      default: return '🧠';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 30 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className={`w-full max-w-md ${
          isWin
            ? 'bg-zinc-950 border-2 shadow-[0_0_50px_rgba(16,185,129,0.25)]'
            : 'bg-zinc-950 border-2 shadow-[0_0_50px_rgba(239,68,68,0.25)]'
        } rounded-[28px] overflow-hidden my-4`}
        style={{ borderColor: isWin ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.4)' }}
      >
        {/* Top Header Splash with Boss stage Background and Portrait */}
        <div className="text-center relative overflow-hidden py-8 px-6 bg-zinc-950">
          {/* Real Battle Stage backdrop faded inside header */}
          {bgSrc ? (
            <img
              src={bgSrc}
              alt={matchingBoss.name}
              onError={handleBgError}
              className="absolute inset-0 w-full h-full object-cover opacity-25 filter blur-[1px] brightness-50"
              referrerPolicy="no-referrer"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/60 via-zinc-950/90 to-zinc-950" />

          {/* Glowing character display inside crown ring */}
          <div className="flex justify-center items-center gap-4 relative z-10 mb-2">
            {/* Boss Portrait Thumbnail */}
            <div 
              className={`w-14 h-14 rounded-full overflow-hidden border-2 shadow-lg flex-shrink-0 relative ${
                isWin ? 'grayscale opacity-75' : 'animate-bounce'
              }`}
              style={{ borderColor: isWin ? '#10b981' : '#f43f5e', animationDuration: '4s' }}
            >
              {imgSrc ? (
                <img
                  src={imgSrc}
                  alt={matchingBoss.name}
                  onError={handleImgError}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div 
                  className="w-full h-full flex items-center justify-center text-2xl font-bold font-mono"
                  style={{
                    background: `radial-gradient(circle, ${matchingBoss.hexTheme}40 0%, #000000 100%)`
                  }}
                >
                  {getBossEmoji(matchingBoss.id)}
                </div>
              )}
              {isWin && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Skull className="w-5 h-5 text-red-500" />
                </div>
              )}
            </div>

            {/* Victory/Defeat Emblem Badge */}
            <motion.div
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.15, type: 'spring' }}
              className={`w-14 h-14 rounded-full flex items-center justify-center border flex-shrink-0 ${
                isWin
                  ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                  : 'bg-rose-950/90 border-rose-500/40 text-rose-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]'
              }`}
            >
              {isWin ? <Trophy className="w-6 h-6 animate-pulse" /> : <Skull className="w-6 h-6 animate-pulse" />}
            </motion.div>
          </div>

          <div className="relative z-10 mt-3">
            <h2 className={`text-xl font-black uppercase tracking-wider font-mono ${isWin ? 'text-emerald-400' : 'text-rose-500'}`}>
              {isWin ? 'Defeated and Looted!' : 'Combat Failed'}
            </h2>
            <p className="text-zinc-400 text-xs mt-1">
              vs <span className="font-bold text-white">{reward.bossName}</span> ({reward.bossTitle})
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="px-6 pb-6 space-y-5.5">
          {/* Dialogue Quote Bubble */}
          <div className="bg-zinc-900/60 border border-zinc-850 rounded-2xl p-4 relative">
            <span className="absolute -top-2.5 left-5 px-2 bg-zinc-950 text-[9px] font-mono font-bold uppercase text-zinc-500">
              Dialogue Log
            </span>
            <p className="text-xs text-zinc-300 italic text-center">
              "{reward.dialogue}"
            </p>
          </div>

          {/* Victory View: Stats and shard payouts breakdown */}
          {isWin ? (
            <div className="space-y-4">
              {/* Point math table */}
              <div className="bg-black/30 border border-zinc-900 rounded-2xl p-4.5 space-y-2.5 font-mono text-[11px]">
                <div className="flex justify-between items-center text-zinc-450">
                  <span className="flex items-center gap-1">⏱️ Turns Logged</span>
                  <span className="text-zinc-300 font-bold">{reward.turnsTaken} Turns</span>
                </div>
                <div className="flex justify-between items-center text-zinc-450">
                  <span className="flex items-center gap-1">🎯 Base Match Multiplier</span>
                  <span className="text-zinc-300 font-bold">{reward.baseAccuracyScore} Shards</span>
                </div>
                <div className="flex justify-between items-center text-zinc-450">
                  <span className="flex items-center gap-1">🔮 Active Spell Boosters</span>
                  <span className="text-amber-400 font-bold">{reward.multiplier}x multiplier</span>
                </div>
                <div className="border-t border-zinc-900 pt-2.5 flex justify-between items-center text-sm">
                  <span className="text-zinc-200 font-bold uppercase">Total Bounty</span>
                  <span className="text-emerald-400 font-black flex items-center gap-1">
                    <Coins className="w-4 h-4 text-amber-500 animate-spin" style={{ animationDuration: '4s' }} />
                    {reward.totalFragments} Shards
                  </span>
                </div>
              </div>

              {/* Shard breakdown list */}
              <div>
                <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase font-bold block mb-2 text-center">
                  Mined Shard Breakdown
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(reward.shares).map(([orbId, count]) => {
                    const orb = INITIAL_ORBS.find(o => o.id === orbId);
                    if (!orb) return null;
                    return (
                      <div
                        key={orbId}
                        className="bg-zinc-900/40 border border-zinc-850 p-3 rounded-xl flex items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-2">
                          <MindOrb orbId={orb.id} className="w-5 h-5" />
                          <span className="text-[11px] capitalize text-zinc-300 font-medium truncate">
                            {orb.id}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-emerald-400 shrink-0">+{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* Defeat View: Reveal Combination and Tactical Upgrade support */
            <div className="space-y-4">
              {/* Code Reveal */}
              <div className="bg-rose-950/10 border border-rose-900/30 rounded-2xl p-4 text-center">
                <span className="text-[10px] font-mono tracking-wide text-rose-400/80 font-bold uppercase block mb-3">
                  Secret Combination Code Revealed:
                </span>
                <div className="flex justify-center gap-2.5">
                  {secretCodeColors.map((orb, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-1.5 shrink-0">
                      <MindOrb orbId={orb.id} className="w-10 h-10 shadow-lg" />
                      <span className="text-[9px] capitalize text-zinc-500 font-bold font-mono">
                        {orb.id}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tactical spell hints */}
              <div className="bg-zinc-905 border border-zinc-900 rounded-2xl p-4.5 space-y-3">
                <div className="flex items-center gap-1.5 text-zinc-200">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold uppercase tracking-wide">Tactical Hint Recommendations</span>
                </div>
                <div className="space-y-2 text-[11px] text-zinc-400 leading-relaxed font-sans">
                  {reward.bossName === 'Lemons' || reward.bossName === 'Templefrist' ? (
                    <p>
                      💡 Use the <span className="font-bold text-green-400">Green Orb (Revealer)</span> in the battle arena to instantly filter out colors that are completely absent from the passcode!
                    </p>
                  ) : reward.bossName === 'Mad Martin' ? (
                    <p>
                      ⚠️ <strong className="text-orange-400">CRITICAL PASSTIME:</strong> Martin automatically steals surviving turns! You <strong>MUST</strong> craft and cast the <span className="font-bold text-yellow-400">Yellow Spell (Negater)</span> to shut down his theft penalty!
                    </p>
                  ) : (
                    <>
                      <p>
                        ⚡ Failing to finish within limits? Charge and deploy the <span className="font-bold text-orange-400">Orange</span> or <span className="font-bold text-purple-400">Purple Spell</span> to gain up to +2 crucial extra guesses.
                      </p>
                      <p className="mt-1">
                        ⚡ Stumped by positions? Cast <span className="font-bold text-red-400">Red Orb (Burn)</span> to reveal an exact spot, or use <span className="font-bold text-violet-400">Black Orb (Location Hint)</span>.
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Action button triggers inside bottom menu */}
          <div className="pt-2 flex flex-col gap-2">
            {isWin && hasNextStage && (
              <button
                onClick={onNextStage}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-400 hover:brightness-110 active:scale-98 text-black text-xs font-black uppercase rounded-xl font-mono tracking-wider transition shadow flex items-center justify-center gap-2 cursor-pointer"
              >
                Assemble Next Node <ArrowRight className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={onRetry}
              className={`w-full py-2.5 ${
                isWin
                  ? 'bg-zinc-900 hover:bg-zinc-850 hover:text-white border border-zinc-800'
                  : 'bg-gradient-to-r from-rose-600 to-red-500 hover:brightness-110 active:scale-98 text-white text-xs font-black'
              } text-xs font-bold uppercase rounded-xl transition flex items-center justify-center gap-2 cursor-pointer`}
            >
              <RotateCw className="w-4 h-4" />
              {isWin ? 'Re-Challenge Encounter' : 'Re-engage Combat Simulation'}
            </button>

            <button
              onClick={onGoToForge}
              className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-805 text-zinc-300 hover:text-white text-xs font-bold uppercase rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              Orb Forge Upgrades
            </button>

            <button
              onClick={onClose}
              className="w-full py-2 hover:bg-zinc-950 text-zinc-500 hover:text-zinc-400 text-[10px] font-mono uppercase rounded transition text-center"
            >
              Return to Node Tree
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
