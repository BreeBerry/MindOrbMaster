import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Shield, Flame, EyeOff, Skull, Zap } from 'lucide-react';
import { Boss } from '../types';

interface BossCardProps {
  boss: Boss;
  currentHp: number;
  currentShield: number;
  maxHp: number;
  status: 'ACTIVE' | 'VICTORY' | 'DEFEAT';
  turnsRemaining: number;
  maxTurns: number;
  dialogue: string;
  activeEffects: {
    igniteTurns: number;
    igniteDamage: number;
    bossBlindTurns: number;
    fragileTurns: number;
    fragileMultiplier: number;
  };
}

export default function BossCard({
  boss,
  currentHp,
  currentShield,
  maxHp,
  status,
  turnsRemaining,
  maxTurns,
  dialogue,
  activeEffects
}: BossCardProps) {
  const [imgSrc, setImgSrc] = useState<string>('');
  const [bgSrc, setBgSrc] = useState<string>('');

  useEffect(() => {
    setImgSrc(boss.portraitUrl);
    setBgSrc(boss.stageBgUrl);
  }, [boss.id, boss.portraitUrl, boss.stageBgUrl]);

  const handleImgError = () => {
    setImgSrc('');
  };

  const handleBgError = () => {
    if (bgSrc === boss.stageBgUrl) {
      if (boss.fallbackBgUrl) {
        setBgSrc(boss.fallbackBgUrl);
      } else {
        setBgSrc(boss.portraitUrl);
      }
    } else if (bgSrc === boss.fallbackBgUrl) {
      setBgSrc(boss.portraitUrl);
    } else {
      setBgSrc('');
    }
  };

  // Styling based on theme
  const getThemeStyles = (theme: string) => {
    switch (theme) {
      case 'volcanic':
        return {
          bg: 'from-orange-950 via-red-950 to-stone-950',
          border: 'border-red-500/40 shadow shadow-red-500/20',
          glow: 'bg-red-500/20',
          accent: 'text-red-400',
          badge: 'bg-red-950 text-red-300 border-red-500/40',
          avatarGradient: 'from-orange-600 via-rose-700 to-red-800'
        };
      case 'jungle':
        return {
          bg: 'from-emerald-950 via-teal-950 to-stone-900 border-emerald-500/40 shadow shadow-emerald-500/20',
          border: 'border-emerald-500/40',
          glow: 'bg-emerald-500/20',
          accent: 'text-emerald-400',
          badge: 'bg-emerald-950 text-emerald-300 border-emerald-500/40',
          avatarGradient: 'from-emerald-600 via-teal-700 to-green-800'
        };
      case 'archive':
        return {
          bg: 'from-yellow-950 via-amber-950 to-slate-900 border-amber-500/40 shadow shadow-amber-500/20',
          border: 'border-amber-500/40',
          glow: 'bg-amber-500/20',
          accent: 'text-amber-400',
          badge: 'bg-amber-950 text-amber-300 border-amber-500/40',
          avatarGradient: 'from-amber-600 via-yellow-700 to-sky-700'
        };
      case 'nebula':
        return {
          bg: 'from-purple-950 via-indigo-950 to-slate-950 border-purple-500/40 shadow shadow-purple-500/20',
          border: 'border-purple-500/40',
          glow: 'bg-purple-500/20',
          accent: 'text-purple-400',
          badge: 'bg-purple-950 text-purple-300 border-purple-500/40',
          avatarGradient: 'from-purple-600 via-indigo-700 to-pink-800'
        };
      case 'celestial':
        return {
          bg: 'from-stone-950 via-fuchsia-950 to-sky-950 border-fuchsia-500/40 shadow shadow-fuchsia-500/20',
          border: 'border-fuchsia-500/40',
          glow: 'bg-fuchsia-500/20',
          accent: 'text-fuchsia-400',
          badge: 'bg-fuchsia-950 text-fuchsia-300 border-fuchsia-500/40',
          avatarGradient: 'from-cyan-600 via-fuchsia-700 to-violet-900'
        };
      default:
        return {
          bg: 'from-zinc-900 to-zinc-950 border-zinc-800 shadow',
          border: 'border-zinc-800',
          glow: 'bg-zinc-800/10',
          accent: 'text-zinc-400',
          badge: 'bg-zinc-900 text-zinc-300 border-zinc-800',
          avatarGradient: 'from-zinc-500 to-zinc-700'
        };
    }
  };

  const theme = getThemeStyles(boss.imageTheme);
  const hpPercent = Math.max(0, Math.min(100, (currentHp / maxHp) * 100));
  const shieldPercent = boss.shieldMax ? Math.max(0, Math.min(100, (currentShield / boss.shieldMax) * 100)) : 0;

  return (
    <div 
      id="boss-panel-container" 
      className="relative rounded-2xl bg-zinc-950 p-6 border text-white overflow-hidden shadow-2xl transition-all duration-500 group"
      style={{ 
        borderColor: `${boss.hexTheme}50`, 
        boxShadow: `0 15px 35px -12px ${boss.hexTheme}25, inset 0 1px 0 rgba(255,255,255,0.1)` 
      }}
    >
      {/* Dynamic Battle Stage Background Image */}
      {bgSrc ? (
        <img
          src={bgSrc}
          alt={`${boss.name} Battle Arena Background`}
          onError={handleBgError}
          className="absolute inset-0 w-full h-full object-cover opacity-60 pointer-events-none transition-transform duration-10000 ease-out scale-100 group-hover:scale-105 filter brightness-75 contrast-110"
          referrerPolicy="no-referrer"
        />
      ) : null}

      {/* Atmospheric Vignette Gradients */}
      <div 
        className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent pointer-events-none" 
        style={{ background: `linear-gradient(to top, #09090b 45%, rgba(9,9,11,0.45) 75%, rgba(9,9,11,0.1) 100%)` }}
      />
      <div 
        className="absolute -right-12 -top-12 w-48 h-48 rounded-full blur-3xl pointer-events-none animate-pulse" 
        style={{ backgroundColor: `${boss.hexTheme}20`, animationDuration: '6s' }}
      />

      {/* Dynamic HexTheme Energy Pulse Grid */}
      <motion.div
        className="absolute inset-0 pointer-events-none opacity-20 mix-blend-screen"
        style={{
          background: `radial-gradient(80% 80% at 50% 50%, ${boss.hexTheme}25 0%, transparent 100%)`,
        }}
        animate={{
          opacity: [0.15, 0.35, 0.15],
          scale: [0.98, 1.02, 0.98],
        }}
        transition={{
          duration: 4.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Cosmic Shimmer Beam */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none mix-blend-color-dodge rounded-2xl">
        <motion.div
          className="absolute top-0 bottom-0 w-1/4 filter blur-xl opacity-30"
          style={{
            background: `linear-gradient(90deg, transparent, ${boss.hexTheme}, transparent)`,
            transform: 'skewX(-25deg) scaleY(1.5)',
          }}
          animate={{
            left: ['-50%', '150%'],
          }}
          transition={{
            duration: 3.8,
            repeat: Infinity,
            ease: 'easeInOut',
            repeatDelay: 1.5,
          }}
        />
      </div>

      {/* Glowing Neon Border Pulse */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none border border-double"
        style={{ borderColor: `${boss.hexTheme}30` }}
        animate={{
          opacity: [0.4, 0.8, 0.4],
          boxShadow: [
            `inset 0 0 10px ${boss.hexTheme}10, 0 0 10px ${boss.hexTheme}05`,
            `inset 0 0 18px ${boss.hexTheme}30, 0 0 18px ${boss.hexTheme}15`,
            `inset 0 0 10px ${boss.hexTheme}10, 0 0 10px ${boss.hexTheme}05`,
          ],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Campaign Boss Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 relative z-10">
        <div>
          <span 
            className="text-xs font-mono tracking-widest uppercase font-semibold flex items-center gap-1.5"
            style={{ color: boss.hexTheme }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: boss.hexTheme }} />
            Active Duel Atmosphere
          </span>
          <h2 className="text-2xl font-extrabold tracking-tight mt-1 flex items-center gap-2">
            <span>{boss.name}</span>
            <span className="text-sm px-2 py-0.5 rounded bg-zinc-900/90 border border-zinc-800 text-zinc-400 font-normal">
              Stage 0{boss.id.split('_')[1]}
            </span>
          </h2>
          <p className="text-xs text-zinc-400 italic mt-0.5">{boss.title}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Max Turns remaining badge */}
          <span className="px-3 py-1 bg-zinc-900/95 backdrop-blur border border-zinc-800 rounded-full text-xs font-mono font-medium flex items-center gap-1.5 shadow">
            <Zap className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500/10" />
            TURNS REMAINING: {turnsRemaining}/{maxTurns}
          </span>
          <span 
            className="px-3 py-1 border rounded-full text-xs font-mono font-medium uppercase bg-zinc-900/95 backdrop-blur"
            style={{ borderColor: `${boss.hexTheme}40`, color: boss.hexTheme }}
          >
            Code Length: {boss.orbsMax}
          </span>
        </div>
      </div>

      {/* Grid: Boss Info & Avatar & Speech bubble */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 relative z-10">
        {/* Boss Visual Avatar Frame */}
        <div className="md:col-span-4 flex flex-col items-center justify-center relative">
          <motion.div
            animate={{
              y: status === 'ACTIVE' ? [0, -6, 0] : 0,
              scale: status === 'DEFEAT' ? 0.9 : 1
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="relative w-36 h-36 rounded-full p-1 shadow-2xl flex items-center justify-center border-2"
            style={{ 
              borderColor: `${boss.hexTheme}40`,
              background: `linear-gradient(to top right, ${boss.hexTheme}30, rgba(255,255,255,0.05), ${boss.hexTheme}50)`,
              boxShadow: `0 8px 32px 0 rgba(0, 0, 0, 0.4), 0 0 15px ${boss.hexTheme}30`
            }}
          >
            {/* Dark inner face */}
            <div className="w-full h-full bg-zinc-950 rounded-full flex flex-col items-center justify-center text-center overflow-hidden relative border border-white/5 shadow-inner">
              {status === 'DEFEAT' ? (
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-10">
                  <Skull className="w-16 h-16 text-red-500 animate-pulse animate-duration-1000" />
                  <span className="text-[10px] font-mono tracking-widest text-red-400 font-bold mt-1">SLAIN</span>
                </div>
              ) : null}
              
              {/* Dynamic Portrait Image with fallback */}
              {imgSrc ? (
                <img
                  src={imgSrc}
                  alt={boss.name}
                  onError={handleImgError}
                  className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105 ${status === 'DEFEAT' ? 'grayscale opacity-40' : ''}`}
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div 
                  className="absolute inset-0 flex flex-col items-center justify-center p-3 select-none"
                  style={{
                    background: `radial-gradient(circle, ${boss.hexTheme}40 0%, #09090b 100%)`,
                  }}
                >
                  <span 
                    className="text-5xl mb-1.5 filter drop-shadow-[0_0_15px_rgba(251,191,36,0.6)] animate-bounce select-none"
                    style={{
                      animationDuration: '3s',
                      textShadow: `0 0 20px ${boss.hexTheme}`,
                    }}
                  >
                    {boss.id === 'boss_1' ? '🍋' : 
                     boss.id === 'boss_2' ? '🧱' : 
                     boss.id === 'boss_3' ? '⚙️' : 
                     boss.id === 'boss_4' ? '🐝' : 
                     boss.id === 'boss_5' ? '🃏' : 
                     boss.id === 'boss_6' ? '🌺' : 
                     boss.id === 'boss_7' ? '🛡️' : 
                     boss.id === 'boss_8' ? '🕷️' : 
                     boss.id === 'boss_9' ? '❄️' : '🧠'}
                  </span>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-300">
                    {boss.name}
                  </span>
                </div>
              )}
              
              {/* Card visual mask ring to make the character blend nicely */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 mix-blend-multiply" />
            </div>

            {/* Glowing Ring representing elemental fields */}
            <div 
              className="absolute -inner inset-0 rounded-full border border-dashed animate-spin" 
              style={{ 
                animationDuration: '30s',
                borderColor: `${boss.hexTheme}30`
              }} 
            />
          </motion.div>

          {/* Active Buffs / Debuffs visually represented around boss */}
          <div className="flex gap-2.5 mt-3 justify-center min-h-[24px]">
            {activeEffects.igniteTurns > 0 && (
              <span className="px-2 py-0.5 bg-red-950/90 border border-red-500/40 text-red-400 text-[10px] rounded flex items-center gap-1 font-mono uppercase" title="Deals burning damage per guess">
                <Flame className="w-3.5 h-3.5 animate-bounce" />
                Burn ({activeEffects.igniteTurns}T)
              </span>
            )}
            {activeEffects.bossBlindTurns > 0 && (
              <span className="px-2 py-0.5 bg-yellow-950/90 border border-yellow-500/40 text-yellow-500 text-[10px] rounded flex items-center gap-1 font-mono uppercase" title="Reduces boss's attack damage">
                <EyeOff className="w-3.5 h-3.5" />
                Blind ({activeEffects.bossBlindTurns}T)
              </span>
            )}
            {activeEffects.fragileTurns > 0 && (
              <span className="px-2 py-0.5 bg-blue-950/90 border border-blue-500/40 text-cyan-400 text-[10px] rounded flex items-center gap-1 font-mono uppercase" title="Boss takes extra damage from all guesses">
                <Shield className="w-3.5 h-3.5 text-cyan-400" />
                Fragile (+{(activeEffects.fragileMultiplier - 1) * 100}%)
              </span>
            )}
          </div>
        </div>

        {/* Boss Dialogue & HP Shield bars */}
        <div className="md:col-span-8 flex flex-col justify-between">
          {/* Interactive Dialogue Speech bubble */}
          <div className="relative bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 text-zinc-300 text-sm italic mb-4 shadow-inner">
            <div className="absolute left-6 -bottom-2.5 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-zinc-800" />
            <div className="absolute left-[25px] -bottom-2 w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-t-[7px] border-t-zinc-900" />
            <p className="line-clamp-3">"{dialogue}"</p>
          </div>

          {/* Health and Shield Bars */}
          <div className="space-y-3.5 bg-zinc-900/60 p-4 border border-zinc-900 rounded-xl">
            {/* Health Bar */}
            <div>
              <div className="flex justify-between text-xs font-mono font-semibold mb-1 text-zinc-300">
                <span className="flex items-center gap-1">
                  ❤️ THE BOSS VITALITY
                </span>
                <span>
                  {currentHp} / {maxHp} HP ({Math.round(hpPercent)}%)
                </span>
              </div>
              <div id="boss-hp-bar" className="w-full h-3.5 bg-stone-950 rounded-full overflow-hidden border border-zinc-800/80 p-0.5">
                <motion.div
                  className="h-full bg-gradient-to-r from-rose-600 via-red-500 to-orange-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${hpPercent}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </div>
            </div>

            {/* Shield Bar (if boss has shield capabilities) */}
            {boss.shieldMax && (
              <div>
                <div className="flex justify-between text-xs font-mono font-semibold mb-1 text-cyan-400">
                  <span className="flex items-center gap-1">
                    🛡️ COSMIC EMITTING SHIELD
                  </span>
                  <span>
                    {currentShield} / {boss.shieldMax} ({Math.round(shieldPercent)}%)
                  </span>
                </div>
                <div id="boss-shield-bar" className="w-full h-2.5 bg-stone-950 rounded-full overflow-hidden border border-cyan-950 p-0.5">
                  <motion.div
                    className="h-full bg-gradient-to-r from-sky-500 to-cyan-400 rounded-full animate-pulse"
                    initial={{ width: 0 }}
                    animate={{ width: `${shieldPercent}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  />
                </div>
              </div>
            )}

            {/* Boss Passive Spell Details */}
            <div className="text-[11px] bg-black/40 border border-zinc-900 p-2 rounded-lg leading-relaxed text-zinc-450 flex items-start gap-2">
              <span className="text-amber-500 text-sm">⚜️</span>
              <div>
                <strong className="text-zinc-200 uppercase">Special Ability: </strong>
                {boss.bossSpecialDescription}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
