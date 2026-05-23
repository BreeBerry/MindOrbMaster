import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Check, 
  Trophy, 
  LockKeyhole, 
  Coins, 
  Swords, 
  KeyRound, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  HelpCircle,
  Compass
} from 'lucide-react';
import { Boss } from '../types';

interface CampaignProgressProps {
  bosses: Boss[];
  currentBossIndex: number;
  campaignProgress: number; // Highest boss index beaten (0 meaning none beaten, etc.)
  unlockedBosses: string[]; // List of boss IDs where gate toll has been paid
  onSelectBoss: (bossIndex: number) => void;
  onPayToll: (bossIndex: number) => void;
  playerFragments: { [orbId: string]: number };
}

// Map color emoji pellets for drops preview
const FRAGMENT_EMOJIS: { [key: string]: string } = {
  orange: '🟠',
  blue: '🔵',
  green: '🟢',
  silver: '🥈',
  red: '🔴',
  purple: '🟣',
  yellow: '🟡',
  gold: '🧈',
  pink: '🌸',
  white: '❄️',
  black: '⚫',
  teal: '💎'
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

export default function CampaignProgress({
  bosses,
  currentBossIndex,
  campaignProgress,
  unlockedBosses,
  onSelectBoss,
  onPayToll,
  playerFragments
}: CampaignProgressProps) {
  // Carousel active slider index (default to current boss index so they are positioned at their next fight!)
  const [slideIdx, setSlideIdx] = useState<number>(currentBossIndex);
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  
  // Sync slider index when the parent changes the active boss
  useEffect(() => {
    setSlideIdx(currentBossIndex);
  }, [currentBossIndex]);

  useEffect(() => {
    setFailedUrl(null);
  }, [slideIdx]);

  const handlePrev = () => {
    setSlideIdx((prev) => (prev > 0 ? prev - 1 : bosses.length - 1));
  };

  const handleNext = () => {
    setSlideIdx((prev) => (prev < bosses.length - 1 ? prev + 1 : 0));
  };

  const boss = bosses[slideIdx] || bosses[0];
  const isBeaten = campaignProgress > slideIdx;
  const isCampaignUnlocked = slideIdx <= campaignProgress; // can access only if previous beaten
  const isTollRequired = !!boss.requiredFragments;
  const isTollPaid = unlockedBosses.includes(boss.id) || !isTollRequired;
  const isLocked = !isCampaignUnlocked || (!isTollPaid && isCampaignUnlocked);
  const isActivelySelected = currentBossIndex === slideIdx && !isLocked;

  // Check if player has enough shards for toll
  const hasEnoughForToll = () => {
    if (!boss.requiredFragments) return true;
    return Object.entries(boss.requiredFragments).every(([orbId, amt]) => {
      const owned = playerFragments[orbId] || 0;
      return owned >= amt;
    });
  };

  const affordable = hasEnoughForToll();
  const skullsForBoss = Math.min(5, Math.max(1, Math.ceil((slideIdx + 1) / 2)));

  return (
    <div id="campaign-progress-map" className="relative rounded-[28px] bg-zinc-950 p-5 border border-zinc-900 shadow-2xl overflow-hidden select-none">
      
      {/* Background radial gradient glow sync'd with active boss color */}
      <div 
        className="absolute -right-10 -top-10 w-48 h-48 rounded-full blur-[80px] pointer-events-none opacity-20 transition-all duration-700" 
        style={{ backgroundColor: boss.hexTheme }}
      />
      
      {/* --- HUD HEADER --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-zinc-900 pb-4 mb-4">
        <div>
          <span className="text-[9px] font-mono tracking-widest text-amber-500 font-extrabold uppercase flex items-center gap-1.5 leading-none">
            <Compass className="w-3.5 h-3.5" />
            CAMPAIGN TRANSMUTATION PATHWAY
          </span>
          <h2 className="text-base font-black tracking-tight mt-1 text-white uppercase">Decryption Roadmap</h2>
        </div>

        {/* Global Progress pill */}
        <div className="flex items-center gap-2 bg-zinc-905 px-3 py-1.5 border border-zinc-900 rounded-full text-[9px] font-mono font-bold uppercase select-none text-zinc-400">
          <Trophy className="text-yellow-500 w-3.5 h-3.5 fill-current" />
          SYSTEM CLEARANCE: <span className="text-white font-black">{campaignProgress}/10 BOSSES</span>
        </div>
      </div>

      {/* --- SEGMENTED 10-STAGE TIMELINE TRACK & STEPPER --- */}
      <div className="w-full bg-zinc-900/40 border border-zinc-900 rounded-2xl p-3 mb-5">
        <div className="flex items-center justify-between gap-1.5">
          {bosses.map((item, bIdx) => {
            const cleared = campaignProgress > bIdx;
            const accessible = bIdx <= campaignProgress;
            const target = currentBossIndex === bIdx;
            const activeSlide = slideIdx === bIdx;

            return (
              <button
                key={item.id}
                onClick={() => setSlideIdx(bIdx)}
                className="flex-1 flex flex-col items-center justify-center gap-1 group focus:outline-none cursor-pointer"
                title={`Stage 0${bIdx + 1}: ${item.name}`}
              >
                {/* Horizontal progress pipe marker between items */}
                <div className="w-full flex items-center justify-center">
                  <div 
                    className={`h-1.5 w-full rounded-full transition-all duration-300 ${
                      activeSlide 
                        ? 'bg-amber-500 ring-2 ring-amber-500/30 ring-offset-2 ring-offset-zinc-950' 
                        : cleared 
                        ? 'bg-emerald-500' 
                        : accessible 
                        ? 'bg-yellow-600/60' 
                        : 'bg-zinc-800'
                    }`}
                  />
                </div>
                {/* Text indicator */}
                <span className={`text-[8px] font-mono font-black ${
                  activeSlide 
                    ? 'text-amber-400 font-bold' 
                    : cleared 
                    ? 'text-emerald-500' 
                    : 'text-zinc-650 group-hover:text-zinc-400'
                }`}>
                  {bIdx + 1}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* --- HERO SLIDER NAVIGATION FRAME --- */}
      <div className="relative flex items-center justify-between gap-2">
        
        {/* Left Navigator arrow */}
        <button
          onClick={handlePrev}
          className="w-10 h-10 rounded-full bg-zinc-900/60 hover:bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700 flex items-center justify-center transition active:scale-75 shrink-0 cursor-pointer focus:outline-none"
        >
          <ChevronLeft className="w-5 h-5 stroke-[2.5px]" />
        </button>

        {/* --- DYNAMIC CAMPAIGN PORTAL CARD --- */}
        <div className="flex-1 min-w-0 bg-stone-950/70 backdrop-blur-md rounded-3xl border border-zinc-900 p-4.5 shadow-lg relative overflow-hidden transition-all duration-300">
          
          <div className="flex flex-col md:flex-row gap-5 items-stretch">
            
            {/* Animated Boss Figure */}
            <div className="flex flex-col items-center shrink-0">
              <div 
                className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 shadow-2xl"
                style={{ borderColor: boss.hexTheme }}
              >
                {failedUrl !== boss.portraitUrl ? (
                  <img 
                    src={boss.portraitUrl} 
                    alt={boss.name} 
                    onError={() => setFailedUrl(boss.portraitUrl)}
                    className={`w-full h-full object-cover select-none transition duration-500 ${isLocked ? 'grayscale opacity-30 contrast-125' : ''}`}
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div 
                    className={`w-full h-full flex flex-col items-center justify-center text-4xl select-none transition duration-500 ${isLocked ? 'grayscale opacity-30 contrast-125' : ''}`}
                    style={{
                      background: `radial-gradient(circle, ${boss.hexTheme}40 0%, #000000 100%)`
                    }}
                  >
                    {getBossEmoji(boss.id)}
                  </div>
                )}
                
                {/* Visual Status stamp over layer */}
                {isBeaten ? (
                  <div className="absolute inset-0 bg-emerald-950/70 backdrop-blur-[0.5px] flex flex-col items-center justify-center text-emerald-400 select-none">
                    <Check className="w-7 h-7 stroke-[4px] drop-shadow-md" />
                    <span className="text-[7.5px] font-mono font-black uppercase tracking-wider mt-0.5">CLEARED</span>
                  </div>
                ) : isLocked ? (
                  <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-zinc-500 select-none">
                    <LockKeyhole className="w-6 h-6" />
                    <span className="text-[7.5px] font-mono font-black uppercase tracking-wider mt-0.5">LOCKED</span>
                  </div>
                ) : (
                  <div className="absolute bottom-1 inset-x-1 py-0.5 bg-amber-500 text-black text-center font-mono font-extrabold text-[8px] rounded uppercase tracking-wider select-none animate-pulse">
                    CHALLENGER
                  </div>
                )}
              </div>

              <div className="text-[9px] font-mono text-zinc-500 text-center font-bold mt-2 uppercase tracking-wide">
                STAGE 0{slideIdx + 1} DIRECT
              </div>
            </div>

            {/* Boss combat stats and modifiers */}
            <div className="flex-1 min-w-0 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-base font-black text-white uppercase tracking-tight">
                    {boss.name}
                  </h4>
                  <span className="text-[9px] font-mono italic text-zinc-500">"{boss.title}"</span>
                </div>
                
                {/* Skull difficulty indicator */}
                <div className="flex items-center gap-1.5 mt-1 select-none">
                  <span className="text-[9px] text-zinc-450 font-mono">Difficulty:</span>
                  <div className="flex gap-0.5">
                    {Array.from({ length: skullsForBoss }).map((_, i) => (
                      <span key={i} className="text-[9px] text-red-500">💀</span>
                    ))}
                  </div>
                </div>

                <p className="text-[10px] text-zinc-400 italic leading-relaxed mt-2.5 max-w-lg">
                  {boss.description}
                </p>
              </div>

              {/* Secure fragments gate toll, if required */}
              {isTollRequired && !isTollPaid && isCampaignUnlocked && (
                <div className="p-3 bg-rose-950/15 border border-amber-500/20 rounded-xl text-[9.5px]">
                  <div className="text-amber-400 font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1 font-mono">
                    <KeyRound className="w-3.5 h-3.5" /> Barrier Gate Toll Required:
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-zinc-300">
                    {Object.entries(boss.requiredFragments || {}).map(([orbId, val]) => {
                      const owned = playerFragments[orbId] || 0;
                      return (
                        <div key={orbId} className="flex gap-1.5 items-center">
                          <span className="capitalize">{FRAGMENT_EMOJIS[orbId]} {orbId}:</span>
                          <span className={owned >= val ? 'text-emerald-400 font-extrabold' : 'text-rose-400 font-extrabold'}>
                            {owned}/{val}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Combat Loot modifiers display */}
              <div className="space-y-1 select-none pt-1">
                <span className="text-[8px] font-mono font-black text-zinc-500 uppercase tracking-widest block">
                  TRANSMUTATION CO-COEF DROPS:
                </span>
                <div className="flex flex-wrap gap-1 mt-0.5">
                  {boss.lootCommonChan > 0 && (
                    <span className="bg-zinc-900 border border-zinc-850 px-2 py-0.5 rounded-lg text-[9px] font-mono text-zinc-400">Common: {Math.round(boss.lootCommonChan * 100)}%</span>
                  )}
                  {boss.lootUncommonChan > 0 && (
                    <span className="bg-purple-950/50 border border-purple-900/30 text-purple-400 px-2 py-0.5 rounded-lg text-[9px] font-mono">Unc: {Math.round(boss.lootUncommonChan * 100)}%</span>
                  )}
                  {boss.lootRareChan > 0 && (
                    <span className="bg-pink-950/40 border border-pink-900/20 text-pink-400 px-2 py-0.5 rounded-lg text-[9px] font-mono">Rare: {Math.round(boss.lootRareChan * 100)}%</span>
                  )}
                </div>
              </div>

            </div>

          </div>

          {/* Action Trigger Pad */}
          <div className="mt-4 pt-4 border-t border-zinc-900/80 flex items-center justify-end">
            {!isCampaignUnlocked ? (
              <div className="text-[10px] font-mono text-zinc-650 flex items-center gap-1.5 select-none uppercase tracking-widest bg-zinc-900/20 px-4 py-2 border border-zinc-900/60 rounded-xl leading-none">
                <LockKeyhole className="w-3.5 h-3.5 text-zinc-700" /> Complete Stage 0{slideIdx} to Unlock
              </div>
            ) : isTollRequired && !isTollPaid ? (
              <button
                onClick={() => onPayToll(slideIdx)}
                disabled={!affordable}
                className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase transition flex items-center justify-center gap-2 border shadow-lg ${
                  affordable
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-black border-amber-600 hover:brightness-110 cursor-pointer'
                    : 'bg-zinc-900 text-zinc-500 border-zinc-850 cursor-not-allowed'
                }`}
              >
                <Coins className="w-4 h-4 shrink-0 fill-current" /> Pay Gate Toll Entry
              </button>
            ) : (
              <button
                onClick={() => onSelectBoss(slideIdx)}
                className={`py-2.5 px-6 rounded-xl text-xs font-black uppercase transition flex items-center justify-center gap-2 border ${
                  isActivelySelected
                    ? 'bg-amber-500 text-black border-amber-400 select-none shadow shadow-amber-500/25 font-bold cursor-default'
                    : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:bg-zinc-850 hover:border-zinc-700 cursor-pointer'
                }`}
              >
                {isActivelySelected ? (
                  <>⚡ DECRYPTION FOCUS LOCKED</>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current shrink-0" />
                    {isBeaten ? 'Replay Trial' : 'Initialize Duel'}
                  </>
                )}
              </button>
            )}
          </div>

        </div>

        {/* Right Navigator arrow */}
        <button
          onClick={handleNext}
          className="w-10 h-10 rounded-full bg-zinc-900/60 hover:bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700 flex items-center justify-center transition active:scale-75 shrink-0 cursor-pointer focus:outline-none"
        >
          <ChevronRight className="w-5 h-5 stroke-[2.5px]" />
        </button>

      </div>

    </div>
  );
}
