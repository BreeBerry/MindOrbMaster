import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Swords,
  Sparkles,
  BookOpen,
  Trophy,
  Settings2,
  Edit2,
  Trash2,
  User,
  Activity,
  ChevronRight,
  ShieldAlert,
  Play,
  Flame,
  Award,
  Smartphone,
  Shield,
  HelpCircle,
  TrendingUp,
  RotateCcw,
  Lock,
  Dice1,
  X
} from 'lucide-react';
import { BOSS_CAMPAIGN, INITIAL_ORBS, getUnlockedOrbs } from '../data';
import MindOrb from './MindOrb';

// Custom Avatar Options with thematic names, emojis, and styling borders
const AVATAR_OPTIONS = [
  { id: 'mage', emoji: '🧙‍♂️', label: 'Grand Alchemist', border: '#eab308', class: 'from-amber-600/20 to-yellow-500/20' },
  { id: 'cyber', emoji: '🤖', label: 'Matrix Hacker', border: '#06b6d4', class: 'from-cyan-600/20 to-blue-500/20' },
  { id: 'beast', emoji: '🐺', label: 'Runic Warden', border: '#10b981', class: 'from-emerald-600/20 to-teal-500/20' },
  { id: 'goth', emoji: '🧛', label: 'Shadow Weaver', border: '#8b5cf6', class: 'from-purple-600/20 to-indigo-500/20' },
  { id: 'knight', emoji: '🛡️', label: 'Iron Decrypter', border: '#64748b', class: 'from-slate-600/20 to-zinc-500/20' }
];

// Mapping to render the orb color bullets in gacha style pouches
const ORB_EMOJIS: { [key: string]: string } = {
  orange: '🟠',
  blue: '🔵',
  green: '🟢',
  silver: '⚪',
  red: '🔴',
  purple: '🟣',
  yellow: '🟡',
  gold: '⚜️',
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

const SplashOrb = ({ color, size = 'md', className = '' }: { color: string; size?: 'sm' | 'md' | 'lg' | 'xl'; className?: string }) => {
  const gradientMap: { [key: string]: string } = {
    red: 'radial-gradient(circle at 35% 35%, #ff9e93 0%, #ef4444 38%, #991b1b 75%, #3b0707 100%)',
    blue: 'radial-gradient(circle at 35% 35%, #a1d4ff 0%, #3b82f6 38%, #1e40af 75%, #0f172a 100%)',
    green: 'radial-gradient(circle at 35% 35%, #a7f3d0 0%, #10b981 38%, #064e3b 75%, #022c22 100%)',
    white: 'radial-gradient(circle at 35% 35%, #ffffff 0%, #f1f5f9 35%, #94a3b8 72%, #1e293b 100%)',
    yellow: 'radial-gradient(circle at 35% 35%, #fef08a 0%, #eab308 38%, #854d0e 75%, #422006 100%)',
    orange: 'radial-gradient(circle at 35% 35%, #fed7aa 0%, #f97316 38%, #9a3412 75%, #3c0f03 100%)',
    teal: 'radial-gradient(circle at 35% 35%, #a7f3f0 0%, #06b6d4 38%, #0891b2 75%, #083344 100%)',
    purple: 'radial-gradient(circle at 35% 35%, #f3e8ff 0%, #8b5cf6 38%, #5b21b6 75%, #2e1065 100%)',
    pink: 'radial-gradient(circle at 35% 35%, #fce7f3 0%, #ec4899 38%, #9d174d 75%, #4c0519 100%)',
    black: 'radial-gradient(circle at 35% 35%, #71717a 0%, #27272a 38%, #09090b 75%, #000000 100%)',
    gold: 'radial-gradient(circle at 30% 30%, #fffbeb 0%, #fde047 30%, #eab308 60%, #854d0e 80%, #3f1a02 100%)',
    silver: 'radial-gradient(circle at 30% 30%, #ffffff 0%, #f4f4f5 30%, #a1a1aa 60%, #52525b 80%, #18181b 100%)'
  };

  const shadowMap: { [key: string]: string } = {
    red: 'rgba(239, 68, 68, 0.45)',
    blue: 'rgba(59, 130, 246, 0.45)',
    green: 'rgba(16, 185, 129, 0.45)',
    white: 'rgba(226, 232, 240, 0.4)',
    yellow: 'rgba(234, 179, 8, 0.45)',
    orange: 'rgba(249, 115, 22, 0.45)',
    teal: 'rgba(6, 182, 212, 0.45)',
    purple: 'rgba(139, 92, 246, 0.45)',
    pink: 'rgba(236, 72, 153, 0.45)',
    black: 'rgba(63, 63, 70, 0.3)',
    gold: 'rgba(234, 179, 8, 0.7)',
    silver: 'rgba(255, 255, 255, 0.55)'
  };

  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8 md:w-9 md:h-9',
    lg: 'w-14 h-14 md:w-16 md:h-16',
    xl: 'w-18 h-18 md:w-20 md:h-20'
  };

  const orbGrad = gradientMap[color] || gradientMap.red;
  const shadowColor = shadowMap[color] || 'rgba(0,0,0,0.5)';

  return (
    <div
      className={`rounded-full relative shrink-0 ${sizeClasses[size]} ${className}`}
      style={{
        background: orbGrad,
        boxShadow: `0 0 18px ${shadowColor}, inset -2px -2px 6px rgba(0,0,0,0.6), inset 2px 2px 4px rgba(255,255,255,0.4)`
      }}
    >
      <div className="absolute inset-0 rounded-full animate-pulse opacity-30 bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none" />
      <div 
        className="rounded-full bg-white/80 absolute pointer-events-none" 
        style={{
          top: '12%',
          left: '12%',
          width: '28%',
          height: '28%',
          filter: 'blur(0.5px)',
          background: 'radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 80%)'
        }}
      />
    </div>
  );
};

interface StartMenuProps {
  campaignProgress: number;
  currentBossIndex: number;
  playerFragments: { [orbId: string]: number };
  totalWins: number;
  totalLosses: number;
  totalGuesses: number;
  isAndroidFrame: boolean;
  onSetAndroidFrame: (val: boolean) => void;
  onStartCampaign: (bossIdx: number) => void;
  onOpenStore: () => void;
  onOpenRulebook: () => void;
  onResetData: () => void;
  isGameLaunched: boolean;
  onLaunchGame: () => void;
}

export default function StartMenu({
  campaignProgress,
  currentBossIndex,
  playerFragments,
  totalWins,
  totalLosses,
  totalGuesses,
  isAndroidFrame,
  onSetAndroidFrame,
  onStartCampaign,
  onOpenStore,
  onOpenRulebook,
  onResetData,
  isGameLaunched,
  onLaunchGame
}: StartMenuProps) {
  // Load specialized Profile stats
  const [profileName, setProfileName] = useState<string>('Alchemist #408');
  const [profileAvatar, setProfileAvatar] = useState<string>('mage');
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
  const [tempName, setTempName] = useState<string>('');
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  
  // Local settings
  const [showOptionsModal, setShowOptionsModal] = useState<boolean>(false);
  const [showInventoryPopup, setShowInventoryPopup] = useState<boolean>(false);
  const [bgDesign, setBgDesign] = useState<'standard' | 'zany' | 'dark'>('standard');

  useEffect(() => {
    setFailedUrl(null);
  }, [campaignProgress]);
  const [audioSfxEnabled, setAudioSfxEnabled] = useState<boolean>(true);
  const [graphicQuality, setGraphicQuality] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('HIGH');
  const [deviceWrapper, setDeviceWrapper] = useState<'android' | 'apple'>('android');

  const renderOrbIcon = (orbId: string) => {
    const isBar = orbId === 'gold' || orbId === 'silver';
    return (
      <MindOrb orbId={orbId} className={isBar ? "w-8 h-4 inline-block shrink-0" : "w-4 h-4 inline-block shrink-0"} />
    );
  };

  // Load custom player config on mount
  useEffect(() => {
    const savedName = localStorage.getItem('mm_profile_name');
    const savedAvatar = localStorage.getItem('mm_profile_avatar');
    const savedSfx = localStorage.getItem('mm_profile_sfx_on');
    const savedQuality = localStorage.getItem('mm_profile_gfx');
    const savedDevice = localStorage.getItem('mm_device_design');
    const savedBgDesign = localStorage.getItem('mm_bg_design');

    if (savedName) {
      setProfileName(savedName);
      setTempName(savedName);
    } else {
      const randomId = Math.floor(100 + Math.random() * 900);
      setProfileName(`Alchemist #${randomId}`);
      setTempName(`Alchemist #${randomId}`);
    }
    if (savedAvatar) setProfileAvatar(savedAvatar);
    if (savedSfx) setAudioSfxEnabled(savedSfx === 'true');
    if (savedQuality) setGraphicQuality(savedQuality as any);
    if (savedDevice === 'apple' || savedDevice === 'android') {
      setDeviceWrapper(savedDevice);
    }
    if (savedBgDesign === 'standard' || savedBgDesign === 'zany' || savedBgDesign === 'dark') {
      setBgDesign(savedBgDesign);
    }
  }, []);



  const changeBgDesign = (design: 'standard' | 'zany' | 'dark') => {
    setBgDesign(design);
    localStorage.setItem('mm_bg_design', design);
  };

  const saveProfileChange = () => {
    const trimmed = tempName.trim();
    if (trimmed) {
      setProfileName(trimmed);
      localStorage.setItem('mm_profile_name', trimmed);
    }
    setIsEditingProfile(false);
  };

  const handleAvatarSelect = (avatarId: string) => {
    setProfileAvatar(avatarId);
    localStorage.setItem('mm_profile_avatar', avatarId);
  };

  const toggleSfx = () => {
    const newVal = !audioSfxEnabled;
    setAudioSfxEnabled(newVal);
    localStorage.setItem('mm_profile_sfx_on', newVal.toString());
  };

  const cycleQuality = () => {
    const nextQ = graphicQuality === 'LOW' ? 'MEDIUM' : graphicQuality === 'MEDIUM' ? 'HIGH' : 'LOW';
    setGraphicQuality(nextQ);
    localStorage.setItem('mm_profile_gfx', nextQ);
  };

  const changeDeviceSkin = (skin: 'android' | 'apple') => {
    setDeviceWrapper(skin);
    localStorage.setItem('mm_device_design', skin);
    // Propagate to App.tsx simulator setting by using onSetAndroidFrame (we can map it to boolean triggers)
    onSetAndroidFrame(skin === 'android');
  };

  const selectedAvatarObj = AVATAR_OPTIONS.find(a => a.id === profileAvatar) || AVATAR_OPTIONS[0];

  const totalShards = Object.values(playerFragments).reduce((sum, current) => sum + current, 0);
  const totalMatches = totalWins + totalLosses;
  const winRate = totalMatches > 0 ? Math.round((totalWins / totalMatches) * 100) : 0;

  // XP calculation
  const xpValue = totalGuesses * 15 + totalWins * 120;
  const currentLevel = Math.max(1, Math.floor(Math.sqrt(xpValue / 60)) + 1);
  const xpForCurrentLevel = Math.round(Math.pow(currentLevel - 1, 2) * 60);
  const xpForNextLevel = Math.round(Math.pow(currentLevel, 2) * 60);
  const levelProgressPercent = Math.min(
    100,
    Math.round(((xpValue - xpForCurrentLevel) / Math.max(1, xpForNextLevel - xpForCurrentLevel)) * 100)
  );

  // Active boss node in campaign
  const activeBossIndex = Math.min(campaignProgress, 9);
  const activeBossNode = BOSS_CAMPAIGN[activeBossIndex];

  // Threat score rendering
  const skullsCount = Math.min(5, Math.max(1, Math.ceil((activeBossIndex + 1) / 2)));

  return (
    <div className="relative min-h-[690px] w-full flex flex-col justify-between overflow-y-auto no-scrollbar pb-6 bg-[#09090b] text-white selection:bg-amber-500 selection:text-black">
      
      {/* Dynamic Magical Starfield & Nebula Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        <div 
          className="absolute -top-40 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full blur-[110px]"
          style={{ backgroundColor: `${activeBossNode.hexTheme}22` }}
        />
        <div className="absolute top-1/4 left-10 w-24 h-24 rounded-full bg-violet-600/10 blur-[50px]" />
        <div className="absolute bottom-1/4 right-10 w-32 h-32 rounded-full bg-amber-500/5 blur-[70px]" />
        
        {/* Technical abstract micro grids */}
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute inset-0 bg-radial-gradient(circle_at_center, transparent_60%, #09090b_100%)" />
      </div>

      {!isGameLaunched ? (
        /* --- BRANDED GAME LAUNCHER SPLASH (SCREEN A) --- */
        <div className="relative z-10 w-full flex-1 flex flex-col justify-between py-5 px-4 overflow-hidden bg-[#07090d] select-none">
          {/* Background backdrop image covering the start screen area */}
          <div className="absolute inset-0 z-0 pointer-events-none bg-[#07090d]">
            {bgDesign !== 'dark' && (
              <img 
                src={bgDesign === 'zany' ? "https://raw.githubusercontent.com/BreeBerry/MindOrbMaster/main/public/images/title_screen/OrbMaster%20blank%20zany.png" : "https://raw.githubusercontent.com/BreeBerry/MindOrbMaster/main/public/images/title_screen/OrbMaster%20blank.png"} 
                alt="OrbMaster Background" 
                className="absolute inset-0 w-full h-full object-cover opacity-100 transition-opacity duration-300 z-10"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.onerror = null; // Prevent infinite loops
                  e.currentTarget.src = bgDesign === 'zany' 
                    ? "/images/title_screen/OrbMaster blank zany.png" 
                    : "/images/title_screen/OrbMaster blank.png";
                }}
              />
            )}
            {/* Soft dark vignettes and gradient covers to keep interactive overlays extremely legible */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/50 z-20" />
            <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-zinc-950 via-[#07090d]/65 to-transparent z-20" />
          </div>

          {/* Header Row */}
          <div className="w-full flex items-center justify-between select-none border-b border-zinc-850/60 pb-2 mb-3 relative z-10">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-[7.5px] font-mono font-bold tracking-widest text-cyan-500 uppercase">CAMPAIGN DETECTIVE TERMINAL</span>
            </div>
            <span className="text-[7.5px] font-mono font-extrabold text-[#06b6d4] bg-cyan-950/20 border border-cyan-800/35 px-2 py-0.5 rounded uppercase font-mono">
              GOLD & SILVER INITIATED
            </span>
          </div>

          {/* Gothic Dungeon Artwork Section & Title Overlay */}
          <div className="relative flex-1 flex flex-col items-center justify-center my-auto py-1 relative z-10 w-full animate-fade-in">
            <motion.div 
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="flex flex-col items-center w-full px-2"
            >
              {/* Overlay title image with beautiful true transparency */}
              <img 
                src="https://raw.githubusercontent.com/BreeBerry/MindOrbMaster/main/public/images/title_screen/OrbMaster%20title%20trans.png" 
                alt="OrbMaster Title" 
                className="w-full max-w-[340px] md:max-w-[360px] object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.95)] pointer-events-none mb-4"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/images/title_screen/OrbMaster title trans.png";
                }}
              />

              {/* Dynamic subtitle indicator sitting neatly under the title graphic */}
              <p className="text-[8px] md:text-[8.5px] font-mono tracking-[0.28em] text-cyan-400/80 font-black uppercase text-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)] select-none">
                MIND ORB DEDUCTION
              </p>
            </motion.div>
          </div>

          {/* Action Menu Buttons Panel */}
          <div className="w-full space-y-3 mt-2 px-1.5 select-none relative z-20">
            {/* Glowing cyan bezel 'START/CONTINUE CAMPAIGN' button (Press Start analogue in image) */}
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: '0 0 25px rgba(6, 182, 212, 0.75)' }}
              whileTap={{ scale: 0.98 }}
              onClick={onLaunchGame}
              className="w-full py-4 px-6 rounded-xl border-2 border-[#06b6d4] bg-gradient-to-b from-[#0e2c34] to-[#041114] hover:brightness-125 hover:from-[#0f343e] cursor-pointer focus:outline-none transition-all duration-200 select-none flex flex-col items-center justify-center gap-1.5 shadow-[0_0_20px_rgba(6,182,212,0.45)]"
              style={{
                outline: 'none',
              }}
            >
              <div className="text-center font-extrabold uppercase font-mono tracking-[0.2em] text-[#06b6d4] text-[13px] hover:text-[#22d3ee] drop-shadow-[0_0_8px_rgba(6,182,212,0.7)]">
                START/CONTINUE CAMPAIGN
              </div>
              <div className="text-[7.5px] text-[#06b6d4]/60 uppercase tracking-[0.1em] font-sans font-medium">
                {campaignProgress > 0 ? 'CONTINUE YOUR CURRENT CAMPAIGN DECRYPTIONS' : 'START THE RUNIC CODE DECRYPTION CAMPAIGN'}
              </div>
            </motion.button>

            {/* Menu options below - Orb Forge, Rulebook Codex, and Settings */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={onOpenStore}
                className="group flex flex-col items-center justify-center p-2.5 rounded-lg bg-zinc-950/80 border border-zinc-900 hover:border-amber-500/35 hover:bg-zinc-900/60 hover:text-white text-zinc-400 transition cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-500/80 group-hover:text-amber-400 group-hover:scale-110 transition shrink-0" />
                <span className="text-[8px] font-black uppercase font-mono tracking-wider mt-1.5">Mind Orb Forge</span>
              </button>

              <button
                onClick={onOpenRulebook}
                className="group flex flex-col items-center justify-center p-2.5 rounded-lg bg-zinc-950/80 border border-zinc-900 hover:border-violet-500/35 hover:bg-zinc-900/60 hover:text-white text-zinc-400 transition cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-violet-400/80 group-hover:text-violet-450 group-hover:scale-110 transition shrink-0" />
                <span className="text-[8px] font-black uppercase font-mono tracking-wider mt-1.5">OrbMaster Codex</span>
              </button>

              <button
                onClick={() => setShowOptionsModal(true)}
                className="group flex flex-col items-center justify-center p-2.5 rounded-lg bg-zinc-950/80 border border-zinc-900 hover:border-cyan-500/35 hover:bg-zinc-900/60 hover:text-white text-zinc-400 transition cursor-pointer"
              >
                <Settings2 className="w-4 h-4 text-cyan-400/80 group-hover:text-cyan-400 group-hover:scale-110 transition shrink-0" />
                <span className="text-[8px] font-black uppercase font-mono tracking-wider mt-1.5">System Settings</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* --- HANDHELD CAMPAIGN HUB (SCREEN B) --- */
        <div className="relative z-10 w-full flex flex-col flex-1 px-4 pt-3.5 space-y-4">
          
          {/* --- 1. NEW HUD STATUS BAR - NON-SCROLLING & STATIC, EXCLUDING CELLULAR DATA --- */}
          <div 
            onClick={() => setShowInventoryPopup(true)}
            className="w-full flex items-center justify-between bg-zinc-950/85 border border-zinc-900 rounded-2xl p-2.5 shadow-xl select-none overflow-hidden cursor-pointer hover:bg-zinc-900 transition-all duration-150"
            title="Open Alchemist Backpack"
          >
            <div className="flex items-center gap-1.5 min-w-0">
              <Sparkles className="w-4 h-4 text-amber-500 animate-pulse shrink-0" />
              <div className="truncate">
                <span className="text-[8px] font-extrabold font-mono text-zinc-500 uppercase tracking-widest block leading-none">POUCH</span>
                <span className="text-[10px] font-mono font-black text-amber-400 mt-0.5 inline-block">
                  {totalShards} SHARDS
                </span>
              </div>
            </div>

            {/* Flat static horizontal values that never wrap or create scroll bars */}
            <div className="flex items-center gap-1.5 shrink-0 overflow-hidden select-none">
              {Object.entries(playerFragments).slice(0, 4).map(([orbId, amt]) => (
                <div 
                  key={orbId} 
                  className="flex items-center gap-1 bg-zinc-900/90 border border-zinc-805 px-2 py-1 rounded-xl text-[9.5px] font-mono select-none shrink-0"
                  title={`${orbId} elemental balances`}
                >
                  {renderOrbIcon(orbId)}
                  <span className="text-zinc-200 font-bold">{amt}</span>
                </div>
              ))}
            </div>
          </div>

        {/* --- 2. GAME GLADIATOR PROFILE CARD --- */}
        <div className="w-full overflow-hidden rounded-[28px] border border-zinc-900 bg-gradient-to-br from-zinc-950/95 via-zinc-950 to-zinc-900/90 p-4 shadow-2xl relative">
          {/* Subtle logo shine glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-stone-900/30 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-3">
              {/* Profile Avatar Frame With Level */}
              <button 
                onClick={() => {
                  setTempName(profileName);
                  setIsEditingProfile(true);
                }}
                className="relative cursor-pointer group focus:outline-none focus:ring-0 active:scale-95 transition"
              >
                <div 
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${selectedAvatarObj.class} flex items-center justify-center text-3xl border-2 relative z-10 shadow-lg group-hover:brightness-110 transition`}
                  style={{ borderColor: selectedAvatarObj.border }}
                >
                  <span>{selectedAvatarObj.emoji}</span>
                </div>
                {/* Level badge */}
                <div className="absolute -bottom-1.5 -right-1.5 bg-yellow-400 border-2 border-zinc-950 text-black font-mono font-black text-[9px] px-1.5 py-0.5 rounded-full z-20 shadow-md">
                  L{currentLevel}
                </div>
              </button>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-zinc-100 truncate max-w-[130px]">{profileName}</span>
                  <button 
                    onClick={() => {
                      setTempName(profileName);
                      setIsEditingProfile(true);
                    }}
                    className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-amber-400 rounded-lg transition"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                </div>
                {/* Visual Title based on progress */}
                <div className="text-[9px] font-bold font-mono tracking-wide text-amber-500 uppercase flex items-center gap-1 mt-0.5">
                  <Trophy className="w-2.5 h-2.5 fill-current" />
                  {campaignProgress >= 10 ? 'ELITE GRANDMASTER' : `ADEPT ALCHEMIST III`}
                </div>
              </div>
            </div>

            {/* Micro Stats Grid */}
            <div className="text-right">
              <div className="text-[11px] font-mono text-zinc-400">
                ⭐ <span className="font-extrabold text-white">{totalWins}</span> Wins
              </div>
              <div className="text-[8px] font-semibold font-mono text-zinc-500 mt-0.5 uppercase tracking-widest">
                Winrate: <span className="text-emerald-400 font-bold">{winRate}%</span>
              </div>
            </div>
          </div>

          {/* LEVEL XP PROGRESS BAR */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-[9px] font-mono text-zinc-500">
              <span className="font-bold flex items-center gap-1"><Flame className="w-3 h-3 text-amber-500" /> XP progress</span>
              <span className="text-zinc-400 font-medium">{xpValue} / {xpForNextLevel} pts ({levelProgressPercent}%)</span>
            </div>
            <div className="w-full h-2.5 bg-zinc-900 border border-zinc-900/60 rounded-full overflow-hidden p-0.5 relative">
              <motion.div 
                className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 relative"
                initial={{ width: 0 }}
                animate={{ width: `${levelProgressPercent}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              >
                {/* Diagonal moving lines inside progress bar */}
                <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent)] bg-[size:10px_10px] animate-[pulse_2s_infinite]" />
              </motion.div>
            </div>
          </div>
        </div>

        {/* --- 3. DYNAMIC EPIC ACTIVE CHALLENGER CAROUSEL DECK --- */}
        <div className="w-full rounded-[30px] border border-zinc-900 bg-gradient-to-t from-zinc-950 via-zinc-950/95 to-zinc-900/40 p-5 shadow-2xl relative overflow-hidden flex flex-col justify-between">
          
          {/* Animated decorative geometric frames */}
          <div className="absolute top-0 right-0 w-28 h-28 opacity-10 bg-radial-gradient(circle_at_center, rgba(255,255,255,0.1)_0%, transparent_60%) pointer-events-none" />
          
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="text-[8.5px] font-mono uppercase tracking-[0.25em] text-amber-500 font-bold">
                BATTLE RADAR
              </span>
              <h3 className="text-base font-black text-white uppercase tracking-tight mt-0.5">
                ACTIVE NEXUS DUEL
              </h3>
            </div>
            
            {/* Interactive Threat Indicator */}
            <div className="flex items-center gap-1 px-3 py-1 bg-rose-950/30 border border-rose-900/30 rounded-full text-[9px] font-mono text-rose-400 font-bold whitespace-nowrap leading-none select-none">
              <span>Threat:</span>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span 
                    key={i} 
                    className={`text-[8px] leading-none ${i < skullsCount ? 'text-red-500 scale-110 drop-shadow-md' : 'text-zinc-800'}`}
                  >
                    💀
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive RPG Portal Frame */}
          <div className="bg-black/40 border border-zinc-900/80 p-3.5 rounded-2xl flex gap-4 items-center mb-5 hover:bg-black/60 transition duration-300">
            {/* Glowing Boss Portrait */}
            <div className="relative w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 shadow-inner" style={{ borderColor: activeBossNode.hexTheme }}>
              {failedUrl !== activeBossNode.portraitUrl ? (
                <img 
                  src={activeBossNode.portraitUrl} 
                  alt={activeBossNode.name} 
                  onError={() => setFailedUrl(activeBossNode.portraitUrl)}
                  className="w-full h-full object-cover select-none"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div 
                  className="w-full h-full flex flex-col items-center justify-center text-3xl select-none"
                  style={{
                    background: `radial-gradient(circle, ${activeBossNode.hexTheme}40 0%, #000000 100%)`
                  }}
                >
                  {getBossEmoji(activeBossNode.id)}
                </div>
              )}
              <div className="absolute bottom-0 inset-x-0 bg-black/70 text-center py-0.5 text-[7px] font-bold font-mono tracking-tight text-white/90">
                TIER 0{activeBossIndex + 1}
              </div>
            </div>

            {/* Boss info columns */}
            <div className="min-w-0 flex-1">
              <span className="text-[8px] font-mono font-black uppercase text-amber-400 tracking-wider">CHALLENGER TARGET:</span>
              <h4 className="text-sm font-black text-white truncate leading-tight mt-0.5">
                {activeBossNode.name}
              </h4>
              <p className="text-[9px] text-zinc-400 italic truncate mt-0.5">"{activeBossNode.title}"</p>
              
              {/* Secret combo properties tag */}
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[8px] font-mono font-bold text-zinc-500 uppercase">MATRIX CODE:</span>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: activeBossNode.orbsMax }).map((_, i) => (
                    <span 
                      key={i} 
                      className="w-2.5 h-2.5 rounded-full border border-dashed border-zinc-700 bg-zinc-900 animate-pulse flex items-center justify-center text-[7px] text-zinc-500 font-mono"
                    >
                      ?
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Orb Color Materials Unlocked inside this duel */}
          <div className="mb-5 space-y-2 select-none">
            <span className="text-[8px] font-mono tracking-widest text-zinc-500 font-bold block uppercase">
              TRANSMUTATION COLOR POOL ({activeBossNode.allowedColors.filter(colorId => getUnlockedOrbs(campaignProgress).includes(colorId)).length} Colors):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {activeBossNode.allowedColors
                .filter(colorId => getUnlockedOrbs(campaignProgress).includes(colorId))
                .map((orbId) => {
                  const orbObj = INITIAL_ORBS.find(o => o.id === orbId);
                  return (
                    <div 
                      key={orbId} 
                      className="flex items-center gap-1.5 px-2.5 py-1 bg-zinc-900/60 border border-zinc-850 rounded-xl text-[9.5px] font-bold capitalize shadow-sm transition hover:bg-zinc-900"
                    >
                      {renderOrbIcon(orbId)}
                      <span className="text-zinc-350 font-bold">{orbId}</span>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* LAUNCH ENGINE TRIGGERS */}
          <div className="w-full space-y-2.5">
            <button
              onClick={() => onStartCampaign(activeBossIndex)}
              className="group w-full relative py-4 px-6 rounded-2xl bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-purple-500/30 hover:border-purple-400 text-white font-black uppercase text-xs tracking-wider flex items-center justify-between shadow-[0_0_20px_rgba(168,85,247,0.1)] hover:shadow-[0_0_25px_rgba(168,85,247,0.25)] active:scale-[0.98] transition-all duration-300 overflow-hidden cursor-pointer focus:outline-none"
            >
              {/* Pulsing neural energy grid overlay inside the button */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.12)_0%,transparent_70%)] opacity-70 group-hover:opacity-100 transition-opacity pointer-events-none" />
              {/* Shimmer flare line */}
              <div className="absolute top-0 -inset-full w-1/2 h-full bg-purple-500/10 skew-x-12 animate-[pulse_3s_infinite] pointer-events-none" />

              <div className="flex items-center gap-3.5 text-left relative z-10">
                <div className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center group-hover:bg-purple-900/80 group-hover:border-purple-400 transition-colors">
                  <Play className="w-5 h-5 fill-purple-400 text-purple-400 group-hover:scale-110 transition-transform" />
                </div>
                <div>
                  <div className="text-xs font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-white to-purple-300 uppercase flex items-center gap-1.5 font-sans">
                    START MINDBREAKER
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping inline-block" />
                  </div>
                  <div className="text-[8px] font-mono font-bold tracking-widest mt-1 text-zinc-400 uppercase flex items-center gap-1">
                    <span>STATUS: ONLINE</span>
                    <span className="text-zinc-700">|</span>
                    <span>STAGE 0{activeBossIndex + 1} ENCRYPTION LINK</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 relative z-10">
                <span className="text-[9px] font-mono text-purple-400 font-bold tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  DECRYPT
                </span>
                <ChevronRight className="w-5 h-5 text-purple-400 animate-bounce cursor-pointer group-hover:translate-x-1 transition-transform stroke-[2.5]" />
              </div>
            </button>
          </div>

        </div>

        {/* --- 4. TACTICAL SHORTCUT ACTION TILES --- */}
        <div className="grid grid-cols-2 gap-3 pb-2 select-none">
          {/* Orb Forge Store Button */}
          <button
            onClick={onOpenStore}
            className="group py-3.5 px-4 rounded-2xl bg-zinc-950 border border-zinc-900 hover:border-zinc-700 hover:bg-zinc-900/90 active:scale-95 transition-all text-left flex items-center gap-3 cursor-pointer focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 group-hover:border-amber-500/50 transition">
              <Sparkles className="w-4.5 h-4.5 text-amber-400 group-hover:scale-110 transition" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] font-black text-zinc-350 uppercase leading-none group-hover:text-amber-400 transition">Orb Forge</div>
              <span className="text-[8px] font-mono font-bold text-zinc-500 block leading-tight mt-1.5 uppercase">Smith upgrades</span>
            </div>
          </button>

          {/* Rules Codex Button */}
          <button
            onClick={onOpenRulebook}
            className="group py-3.5 px-4 rounded-2xl bg-zinc-950 border border-zinc-900 hover:border-zinc-700 hover:bg-zinc-900/90 active:scale-95 transition-all text-left flex items-center gap-3 cursor-pointer focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 group-hover:border-purple-500/50 transition">
              <BookOpen className="w-4.5 h-4.5 text-purple-400 group-hover:scale-110 transition" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] font-black text-zinc-350 uppercase leading-none group-hover:text-purple-400 transition">OrbMaster Codex</div>
              <span className="text-[8px] font-mono font-bold text-zinc-500 block leading-tight mt-1.5 uppercase">Rule & Strategy</span>
            </div>
          </button>
        </div>

        {/* --- 5. SYSTEM OPTIONS BANNER BUTTONS --- */}
        <div className="flex gap-4 items-center justify-between pt-2.5 border-t border-zinc-900 select-none pb-2">
          <button
            onClick={() => setShowOptionsModal(true)}
            className="flex items-center gap-2 text-[9.5px] font-extrabold uppercase font-mono tracking-wider text-zinc-500 hover:text-white transition cursor-pointer"
          >
            <Settings2 className="w-4 h-4 text-zinc-500 hover:text-emerald-400 transition" />
            Emulation Settings
          </button>

          <div className="text-[8.5px] font-mono text-zinc-500 flex items-center gap-1.5 cursor-default">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            XP POOL: <span className="text-amber-500 font-bold">{xpValue} pts</span>
          </div>
        </div>

      </div>
      )}

      {/* --- MODAL 1: EDIT PROFILE / AVATAR MODAL --- */}
      <AnimatePresence>
        {isEditingProfile && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-zinc-950 border border-zinc-900 max-w-sm w-full rounded-[32px] p-6 shadow-2xl relative"
            >
              <h3 className="text-xs font-black uppercase text-zinc-100 font-mono flex items-center gap-2 border-b border-zinc-900 pb-3 mb-4">
                <User className="w-4 h-4 text-amber-500" />
                EDIT DECRYPTER SIGIL Profile
              </h3>

              <div className="space-y-4">
                {/* Nickname Input */}
                <div>
                  <label className="text-[8.5px] font-mono uppercase tracking-widest text-zinc-500 font-black block mb-2">
                    Enter Gamer Nickname
                  </label>
                  <input
                    type="text"
                    maxLength={16}
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="w-full px-4 py-3 text-xs font-bold rounded-xl bg-zinc-900 border border-zinc-850 hover:border-zinc-700 focus:outline-none focus:border-amber-500 text-white"
                    placeholder="Alchemist Name..."
                  />
                </div>

                {/* Avatar selector */}
                <div>
                  <label className="text-[8.5px] font-mono uppercase tracking-widest text-zinc-500 font-black block mb-2.5">
                    Choose Sigil Element
                  </label>
                  <div className="grid grid-cols-5 gap-2.5">
                    {AVATAR_OPTIONS.map((avatar) => (
                      <button
                        key={avatar.id}
                        onClick={() => handleAvatarSelect(avatar.id)}
                        className={`w-12 h-12 text-2xl rounded-xl flex items-center justify-center border-2 transition active:scale-90 cursor-pointer ${
                          profileAvatar === avatar.id
                            ? 'border-white bg-zinc-900 scale-105'
                            : 'border-transparent bg-zinc-900/40 hover:bg-zinc-900/80'
                        }`}
                        style={{ borderBottomColor: profileAvatar === avatar.id ? '#ffffff' : avatar.border }}
                        title={avatar.label}
                      >
                        {avatar.emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-black/40 border border-zinc-900/60 font-mono text-[9.5px] space-y-2 text-zinc-400">
                  <div className="flex justify-between">
                    <span>Matches Played:</span>
                    <span className="text-white font-bold">{totalMatches}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Decryption Victories:</span>
                    <span className="text-emerald-400 font-bold">{totalWins} ({winRate}%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated XP Points:</span>
                    <span className="text-amber-400 font-bold">{xpValue} pts</span>
                  </div>
                </div>

                {/* Action controls */}
                <div className="flex gap-3 pt-1">
                  <button
                    onClick={() => setIsEditingProfile(false)}
                    className="flex-1 py-2.5 bg-zinc-900 hover:bg-zinc-850 text-zinc-400 text-[10px] font-bold uppercase rounded-xl transition cursor-pointer"
                  >
                    Discard
                  </button>
                  <button
                    onClick={saveProfileChange}
                    className="flex-1 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-400 hover:brightness-110 text-black text-[10px] font-mono font-black uppercase rounded-xl transition shadow shadow-amber-500/10 cursor-pointer"
                  >
                    Save Profile
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- MODAL 2: MATRIX SETTINGS OPTIONS MODAL --- */}
      <AnimatePresence>
        {showOptionsModal && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-zinc-950 border border-zinc-900 max-w-sm w-full rounded-[32px] p-6 shadow-2xl relative"
            >
              <h3 className="text-xs font-black uppercase text-zinc-100 font-mono flex items-center gap-2 border-b border-zinc-900 pb-3 mb-4">
                <Settings2 className="w-4 h-4 text-purple-400" />
                HANDHELD SYSTEM Matrix SETTINGS
              </h3>

              <div className="space-y-4">
                {/* Handheld Emulator Switch */}
                <div className="p-3 bg-zinc-900/50 border border-zinc-900 rounded-2xl flex flex-col gap-2.5">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-[10px] font-black uppercase">Pocket Emulator Bezels</div>
                      <p className="text-[8px] text-zinc-500 mt-0.5">Simulate a high-budget physical gaming console</p>
                    </div>
                    <button
                      onClick={() => onSetAndroidFrame(!isAndroidFrame)}
                      className={`px-3 py-1.5 text-[8.5px] font-black uppercase font-mono rounded-lg transition cursor-pointer ${
                        isAndroidFrame 
                          ? 'bg-amber-500 text-black font-bold' 
                          : 'bg-zinc-950 text-zinc-500 hover:text-zinc-350'
                      }`}
                    >
                      {isAndroidFrame ? 'POCKET ON' : 'POCKET SYSTEM OFF'}
                    </button>
                  </div>
                  
                  {isAndroidFrame && (
                    <div className="pt-2 border-t border-zinc-900/60 flex items-center justify-between">
                      <span className="text-[8px] text-zinc-400 uppercase font-mono font-bold">Simulator Device Skin:</span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => changeDeviceSkin('android')}
                          className={`px-2 py-1 text-[8px] font-mono font-bold rounded ${
                            deviceWrapper === 'android'
                              ? 'bg-zinc-200 text-black font-extrabold'
                              : 'bg-zinc-950 text-zinc-550 border border-zinc-900'
                          }`}
                        >
                          Galaxy (Android)
                        </button>
                        <button
                          onClick={() => changeDeviceSkin('apple')}
                          className={`px-2 py-1 text-[8px] font-mono font-bold rounded ${
                            deviceWrapper === 'apple'
                              ? 'bg-zinc-200 text-black font-extrabold'
                              : 'bg-zinc-950 text-zinc-550 border border-zinc-900'
                          }`}
                        >
                          iPhone (Apple)
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* SFX sound Effects Mock Slider */}
                <div className="p-3 rounded-2xl bg-zinc-900/50 border border-zinc-900 flex justify-between items-center">
                  <div>
                    <div className="text-[10px] font-black uppercase">Audio Transference SFX</div>
                    <p className="text-[8px] text-zinc-500 mt-0.5">Toggle feedback frequencies on orb submit</p>
                  </div>
                  <button
                    onClick={toggleSfx}
                    className={`px-3 py-1.5 text-[8.5px] font-black uppercase font-mono rounded-lg transition cursor-pointer ${
                      audioSfxEnabled 
                        ? 'bg-emerald-500 text-black font-bold' 
                        : 'bg-zinc-950 text-zinc-500'
                    }`}
                  >
                    {audioSfxEnabled ? 'ACTIVE sfx' : 'MUTED'}
                  </button>
                </div>

                {/* Graphics Quality */}
                <div className="p-3 rounded-2xl bg-zinc-900/50 border border-zinc-900 flex justify-between items-center">
                  <div>
                    <div className="text-[10px] font-black uppercase">Visual Matrix speed</div>
                    <p className="text-[8px] text-zinc-500 mt-0.5">Cycle device rendering speed variables</p>
                  </div>
                  <button
                    onClick={cycleQuality}
                    className="px-3 py-1.5 bg-zinc-950 border border-zinc-855 text-purple-400 text-[8.5px] font-black uppercase font-mono rounded-lg hover:border-purple-500/50 transition cursor-pointer"
                  >
                    {graphicQuality} QUALITY
                  </button>
                </div>

                {/* Background Design choice */}
                <div className="p-3 rounded-2xl bg-zinc-900/50 border border-zinc-900">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <div className="text-[10px] font-black uppercase">Title Screen Backdrop</div>
                      <p className="text-[8px] text-zinc-500 mt-0.5">Toggle background image orientations</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    <button
                      onClick={() => changeBgDesign('standard')}
                      className={`py-1 text-[8px] font-mono font-bold rounded cursor-pointer transition ${
                        bgDesign === 'standard'
                          ? 'bg-amber-500 text-black font-extrabold'
                          : 'bg-zinc-950 text-zinc-500 border border-zinc-900 hover:text-zinc-300'
                      }`}
                    >
                      STANDARD
                    </button>
                    <button
                      onClick={() => changeBgDesign('zany')}
                      className={`py-1 text-[8px] font-mono font-bold rounded cursor-pointer transition ${
                        bgDesign === 'zany'
                          ? 'bg-cyan-550 text-white font-extrabold'
                          : 'bg-zinc-950 text-zinc-500 border border-zinc-900 hover:text-zinc-300'
                      }`}
                    >
                      ZANY
                    </button>
                    <button
                      onClick={() => changeBgDesign('dark')}
                      className={`py-1 text-[8px] font-mono font-bold rounded cursor-pointer transition ${
                        bgDesign === 'dark'
                          ? 'bg-purple-500 text-black font-extrabold'
                          : 'bg-zinc-950 text-zinc-500 border border-zinc-900 hover:text-zinc-300'
                      }`}
                    >
                      DARK VOID
                    </button>
                  </div>
                </div>

                {/* Alert for danger zone operations */}
                <div className="pt-2 border-t border-zinc-900 space-y-2">
                  <div className="flex items-center gap-2 text-rose-500 text-[8.5px] font-mono select-none font-black">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>DANGER PROCESS WARNING ZONE:</span>
                  </div>
                  
                  <button
                    onClick={() => {
                      setShowOptionsModal(false);
                      onResetData();
                    }}
                    className="w-full py-2 bg-rose-950/20 hover:bg-rose-950/40 text-rose-455 border border-rose-900/40 text-[9px] font-extrabold uppercase rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer focus:outline-none"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-455" />
                    Wipe Alchemy Saves Permanently
                  </button>
                </div>

                {/* Modal close */}
                <button
                  onClick={() => setShowOptionsModal(false)}
                  className="w-full py-2 bg-zinc-900 hover:bg-zinc-850 text-zinc-300 text-[10px] font-bold uppercase rounded-xl transition cursor-pointer mt-2"
                >
                  Close parameters
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- MODAL 3: POUCH INVENTORY MODAL (SCROLLBAR FREE GRID) --- */}
      <AnimatePresence>
        {showInventoryPopup && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-xs bg-zinc-950 border border-zinc-900 rounded-[24px] p-4 shadow-2xl flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center border-b border-zinc-900 pb-2 mb-3">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase font-mono tracking-wider text-zinc-200">
                      ALCHEMIST BACKPACK
                    </span>
                  </div>
                  <button 
                    onClick={() => setShowInventoryPopup(false)}
                    className="text-zinc-500 hover:text-white text-[10px] font-extrabold font-mono w-5 h-5 rounded-full bg-zinc-900 hover:bg-zinc-800 flex items-center justify-center cursor-pointer transition focus:outline-none"
                    title="Close backpack"
                  >
                    ✕
                  </button>
                </div>

                {/* 3x4 grid for all 12 items, perfectly styled with no scroll bar */}
                <div className="grid grid-cols-2 gap-1.5 py-1">
                  {Object.entries(playerFragments).map(([orbId, amt]) => (
                    <div 
                      key={orbId} 
                      className="bg-zinc-900/40 border border-zinc-900/80 px-2 py-1.5 rounded-xl flex items-center justify-between gap-1 select-none"
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        {renderOrbIcon(orbId)}
                        <span className="text-[9px] font-bold capitalize text-zinc-400 truncate">
                          {orbId}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono font-black text-amber-500 shrink-0">
                        {amt}
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-3.5 p-2 bg-zinc-950 border border-zinc-900/60 rounded-xl text-center select-none">
                  <span className="text-[7.5px] font-mono text-zinc-500 uppercase tracking-widest block font-extrabold leading-none">TOTAL SECURED WEALTH</span>
                  <span className="text-[11.5px] font-mono font-black text-white mt-1 block">
                    {totalShards} FRAGMENTS
                  </span>
                </div>
              </div>

              <button 
                onClick={() => setShowInventoryPopup(false)}
                className="mt-4 w-full py-2 bg-zinc-900 hover:bg-zinc-850 hover:text-white text-zinc-350 text-[10px] font-black uppercase font-mono tracking-wider rounded-xl transition cursor-pointer text-center focus:outline-none"
              >
                Close backpack
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
