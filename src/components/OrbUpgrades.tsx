import { motion } from 'motion/react';
import { Sparkles, Backpack, Compass, CheckCircle2, Lock, Plus, ShoppingBag } from 'lucide-react';
import { OrbInfo } from '../types';
import MindOrb from './MindOrb';

interface OrbUpgradesProps {
  orbs: OrbInfo[];
  playerFragments: { [orbId: string]: number };
  abilitiesCharges: { [orbId: string]: number };
  onBuyAbility: (orbId: string, cost: number) => void;
  campaignProgress: number; // to show locking based on game progress
  maxUnlockedOrbLength: number;
  onBuyOrbSetUpgrade: (nextSize: number, cost: { [orbId: string]: number }) => void;
}

export default function OrbUpgrades({
  orbs,
  playerFragments,
  abilitiesCharges,
  onBuyAbility,
  campaignProgress,
  maxUnlockedOrbLength,
  onBuyOrbSetUpgrade
}: OrbUpgradesProps) {

  // Costs and details for the Orb Set size upgrade
  const upgradeCost5 = { orange: 150, blue: 150, green: 150, red: 100, yellow: 100 };
  const upgradeCost6 = { silver: 150, purple: 150, gold: 100, white: 100, black: 50 };

  const canAfford5 = Object.entries(upgradeCost5).every(([orb, cost]) => (playerFragments[orb] || 0) >= cost);
  const canAfford6 = Object.entries(upgradeCost6).every(([orb, cost]) => (playerFragments[orb] || 0) >= cost);

  const isLevel5Locked = campaignProgress < 5;
  const isLevel6Locked = campaignProgress < 7;

  // Lock helper based on campaignProgress (measured by beaten bosses count):
  const getOrbLockStatus = (id: string): { isLocked: boolean; criteria: string } => {
    switch (id) {
      case 'pink':
        return { isLocked: campaignProgress < 6, criteria: 'Defeat Boss 6 (Pretty Pea)' };
      case 'white':
        return { isLocked: campaignProgress < 7, criteria: 'Defeat Boss 7 (Sir Louie)' };
      case 'black':
        return { isLocked: campaignProgress < 8, criteria: 'Defeat Boss 8 (Queen Asabeth)' };
      case 'teal':
        return { isLocked: campaignProgress < 9, criteria: 'Defeat Boss 9 (Elkgore)' };
      default:
        return { isLocked: false, criteria: '' };
    }
  };

  // Costs mapping from the OneNote specification sheet:
  const getAbilityCost = (id: string): { cost: number; description: string; name: string } => {
    switch (id) {
      case 'orange':
        return { cost: 60, name: '+1 Extra Guess', description: 'Add +1 extra guess turn to your active battle without lowering your score payout.' };
      case 'blue':
        return { cost: 50, name: 'Submerge (Scramble)', description: 'Scrambles the boss\'s secret answer key into a different order. (First 5 turns only).' };
      case 'green':
        return { cost: 50, name: 'Reveal Absent Element', description: 'Reveals 1 color that is guaranteed to NOT be present in this match.' };
      case 'silver':
        return { cost: 50, name: '+15% Uncommon Loot', description: 'Injects a +15% higher drop rate of Uncommon fragments into this match\'s victory loot pool.' };
      case 'red':
        return { cost: 90, name: 'Burn Scan', description: 'Discovers and prints the exact color and slot index of 1 random unrevealed spot.' };
      case 'purple':
        return { cost: 100, name: '+2 Extra Guesses', description: 'Add +2 extra guess turns to your active battle without lowering your score payout.' };
      case 'yellow':
        return { cost: 70, name: 'Disable Boss Penalty', description: 'Mutes the hostile passive or turn-stealing constraints of any active Boss for this fight.' };
      case 'gold':
        return { cost: 60, name: '+20% Rare Loot', description: 'Injects a +20% higher drop rate of Rare fragments into this match\'s victory loot pool.' };
      case 'pink':
        return { cost: 180, name: '1.75x (Pink) Multiplier', description: 'Multiplies your earned fragment amounts across all colors by +75% when you win this battle.' };
      case 'white':
        return { cost: 150, name: '+3 Extra Guesses', description: 'Add +3 extra guess turns to your active battle without lowering your score payout.' };
      case 'black':
        return { cost: 130, name: 'Obsidian Hint Orb', description: 'Gives you 1 precise location index hint for the hidden combination.' };
      case 'teal':
        return { cost: 300, name: '2.25x (Teal) Multiplier', description: 'Multiplies your earned fragment amounts across all colors by +125% when you win this battle.' };
      default:
        return { cost: 100, name: 'Unknown Spell', description: 'An ancient magic spell charge.' };
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 2-Column top overview: Wallet representation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Wallet Frame (8 cols) */}
        <div id="alchemy-pouch-frame" className="lg:col-span-12 rounded-2xl bg-zinc-950 border border-zinc-900 p-6 relative overflow-hidden text-white shadow-xl">
          <div className="absolute right-0 top-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="mb-4">
            <span className="text-[10px] font-mono tracking-widest text-amber-400 font-bold uppercase flex items-center gap-1.5 leading-none">
              <Backpack className="w-3.5 h-3.5" />
              MINER'S ALCHEMY POUCH
            </span>
            <h2 className="text-lg font-extrabold tracking-tight mt-1">Multi-Color Fragment Balances</h2>
            <p className="text-xs text-zinc-400 mt-1">
              Winning matches rewards different color fragments based on Boss loot drop weights. Collect fragments to craft powerful spells!
            </p>
          </div>

          {/* Grid of the 12 Balances */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 pt-2">
            {orbs.map((orb) => {
              const count = playerFragments[orb.id] || 0;
              const charges = abilitiesCharges[orb.id] || 0;
              const lockStatus = getOrbLockStatus(orb.id);
              
              return (
                <div
                  key={orb.id}
                  className={`border rounded-xl p-3 flex flex-col justify-between transition shadow-inner relative overflow-hidden ${
                    lockStatus.isLocked
                      ? 'bg-zinc-950/80 border-dashed border-zinc-900 text-zinc-600'
                      : 'bg-black/30 border-zinc-900 hover:border-zinc-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {/* Tiny glowing sphere */}
                    <MindOrb 
                      orbId={orb.id} 
                      className={`w-5 h-5 ${lockStatus.isLocked ? 'grayscale opacity-25' : ''}`} 
                    />
                    <span className={`text-xs font-bold font-mono capitalize select-none ${
                      lockStatus.isLocked ? 'text-zinc-650' : 'text-zinc-350'
                    }`}>
                      {orb.id}
                    </span>
                  </div>

                  <div className="mt-3 flex items-baseline justify-between relative z-10">
                    {lockStatus.isLocked ? (
                      <div className="w-full text-center py-1">
                        <span className="text-[7.5px] font-mono uppercase tracking-wider text-amber-500 font-bold block">
                          Locked
                        </span>
                        <span className="text-[7px] text-zinc-500 block leading-none mt-0.5 truncate">
                          {lockStatus.criteria}
                        </span>
                      </div>
                    ) : (
                      <>
                        <div>
                          <div className="text-[9px] font-mono text-zinc-500 uppercase leading-none font-semibold">Fragments</div>
                          <div className="text-base font-extrabold font-mono text-yellow-400/90 mt-0.5">{count}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-[9px] font-mono text-zinc-500 uppercase leading-none font-semibold">Stored</div>
                          <div className="text-[11px] font-bold font-mono text-emerald-400 mt-0.5">x{charges}</div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Altar Core Upgrade: Increase Max Guess Orb Capacity (4 -> 6) */}
      <div id="altar-upgrade-frame" className="rounded-2xl bg-gradient-to-br from-zinc-950 to-zinc-900 border border-zinc-900 p-6 relative overflow-hidden text-white shadow-xl">
        <div className="absolute right-0 top-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-zinc-900 mb-6Shared">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-purple-400 font-bold uppercase flex items-center gap-1.5 leading-none">
              <Sparkles className="w-3.5 h-3.5" />
              GRAND TRANSMUTATION ALTAR CORE
            </span>
            <h2 className="text-lg font-extrabold tracking-tight mt-1">Orb Guess Set Capacity</h2>
            <p className="text-xs text-zinc-400 mt-1">
              Upgrade your core Transmutation Circle to forge larger decryption guess chains (up to 6 slots). Larger codes allow deeper strategy and larger boards.
            </p>
          </div>
          
          <div className="bg-zinc-900 px-3 py-1.5 border border-zinc-850 rounded-full text-[10px] font-mono text-zinc-300 flex items-center gap-1.5 self-start md:self-auto select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
            MAX GUESS SLOTS: <span className="font-extrabold text-purple-400">{maxUnlockedOrbLength} / 6</span>
          </div>
        </div>

        {maxUnlockedOrbLength === 4 && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-8 space-y-2">
              <h3 className="font-bold text-sm text-zinc-200">Upgrade to 5-Orb Assembly Mat</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Expands your maximum guess sequence size from 4 to 5. Once purchased, you'll gain a size-slider before every duel to adjust your target passphrase formula.
              </p>
              {isLevel5Locked ? (
                <div className="flex items-center gap-1.5 text-xs text-amber-500 bg-amber-950/20 p-2 border border-amber-900/30 rounded-lg max-w-sm mt-3">
                  <Lock className="w-3.5 h-3.5 shrink-0" />
                  <span>Locked: Requires defeating **Boss 5 (Natty D)**.</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/20 p-2 border border-emerald-900/30 rounded-lg max-w-sm mt-3">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Available: Purchase to unlock 5-orb battles!</span>
                </div>
              )}
            </div>
            
            <div className="md:col-span-4 bg-black/40 border border-zinc-900 p-4 rounded-xl flex flex-col justify-between items-stretch gap-4">
              <div className="space-y-2">
                <span className="text-[9px] font-mono uppercase tracking-wider text-zinc-500 block">Required Fragments:</span>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(upgradeCost5).map(([orbId, cost]) => {
                    const owned = playerFragments[orbId] || 0;
                    const hasEnough = owned >= cost;
                    return (
                      <div key={orbId} className="flex items-center justify-between text-[11px] font-mono bg-zinc-900/40 px-2 py-1 rounded border border-zinc-900">
                        <span className="capitalize text-zinc-400">{orbId}:</span>
                        <span className={hasEnough ? 'text-emerald-400 font-bold' : 'text-red-400'}>
                          {owned}/{cost}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <button
                disabled={isLevel5Locked || !canAfford5}
                onClick={() => onBuyOrbSetUpgrade(5, upgradeCost5)}
                className={`w-full py-2 rounded-lg text-xs font-black uppercase tracking-wider transition active:scale-95 flex items-center justify-center gap-1.5 ${
                  !isLevel5Locked && canAfford5
                    ? 'bg-purple-600 text-white hover:bg-purple-500 cursor-pointer shadow-md shadow-purple-600/10'
                    : 'bg-zinc-900 text-zinc-500 border border-zinc-850 cursor-not-allowed'
                }`}
              >
                <Plus className="w-4 h-4" /> Scribe 5-Orb Upgrade
              </button>
            </div>
          </div>
        )}

        {maxUnlockedOrbLength === 5 && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-8 space-y-2">
              <h3 className="font-bold text-sm text-zinc-200">Upgrade to 6-Orb Assembly Mat</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Expands your maximum guess sequence size from 5 to 6. This unlocks the true maximum layout, allowing deeper logic decryption matches and maximum drop weights!
              </p>
              {isLevel6Locked ? (
                <div className="flex items-center gap-1.5 text-xs text-amber-500 bg-amber-950/20 p-2 border border-amber-900/30 rounded-lg max-w-sm mt-3">
                  <Lock className="w-3.5 h-3.5 shrink-0" />
                  <span>Locked: Requires defeating **Boss 7 (Sir Louie)**.</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/20 p-2 border border-emerald-900/30 rounded-lg max-w-sm mt-3">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Available: Spend premium shards to reach the maximum level!</span>
                </div>
              )}
            </div>
            
            <div className="md:col-span-4 bg-black/40 border border-zinc-900 p-4 rounded-xl flex flex-col justify-between items-stretch gap-4">
              <div className="space-y-2">
                <span className="text-[9px] font-mono uppercase tracking-wider text-zinc-500 block">Required Fragments:</span>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(upgradeCost6).map(([orbId, cost]) => {
                    const owned = playerFragments[orbId] || 0;
                    const hasEnough = owned >= cost;
                    return (
                      <div key={orbId} className="flex items-center justify-between text-[11px] font-mono bg-zinc-900/40 px-2 py-1 rounded border border-zinc-900">
                        <span className="capitalize text-zinc-400">{orbId}:</span>
                        <span className={hasEnough ? 'text-emerald-400 font-bold' : 'text-red-400'}>
                          {owned}/{cost}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <button
                disabled={isLevel6Locked || !canAfford6}
                onClick={() => onBuyOrbSetUpgrade(6, upgradeCost6)}
                className={`w-full py-2 rounded-lg text-xs font-black uppercase tracking-wider transition active:scale-95 flex items-center justify-center gap-1.5 ${
                  !isLevel6Locked && canAfford6
                    ? 'bg-purple-600 text-white hover:bg-purple-500 cursor-pointer shadow-md shadow-purple-600/10'
                    : 'bg-zinc-900 text-zinc-500 border border-zinc-850 cursor-not-allowed'
                }`}
              >
                <Plus className="w-4 h-4" /> Scribe 6-Orb Upgrade
              </button>
            </div>
          </div>
        )}

        {maxUnlockedOrbLength >= 6 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-purple-950/10 border border-purple-900/30 p-4 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-950 border border-purple-900 text-purple-400 flex items-center justify-center font-bold font-mono animate-pulse">
                MAX
              </div>
              <div>
                <h3 className="font-bold text-sm text-purple-200">Ultimate Altar Mat Achieved!</h3>
                <p className="text-[11px] text-zinc-400 leading-relaxed mt-0.5">
                  Your transmutation circle is fully prepared! You can now freely select code matrices between 4, 5, and 6 slots for any challenge.
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-1 text-[10px] font-mono font-black text-purple-400 uppercase bg-purple-950/30 border border-purple-900/40 px-3 py-1.5 rounded-lg select-none">
              <CheckCircle2 className="w-4 h-4 text-purple-450 fill-current" /> ALL SLOTS UNLOCKED
            </div>
          </div>
        )}
      </div>

      {/* Crucible Store: Spend fragments to forge/charge abilities */}
      <div id="forge-store-frame" className="rounded-2xl bg-zinc-950 border border-zinc-900 p-6 relative overflow-hidden text-white shadow-xl">
        <div className="absolute right-0 bottom-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="pb-4 border-b border-zinc-900 mb-6">
          <span className="text-[10px] font-mono tracking-widest text-amber-400 font-bold uppercase flex items-center gap-1.5 leading-none">
            <Compass className="w-3.5 h-3.5" />
            CRUCIBLE KILN & ORB FORGE
          </span>
          <h2 className="text-xl font-bold tracking-tight mt-1">Scribe & Forge Active Spell Charges</h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Deduct fragments of a matching color from your pouch to scribe a spell. Equipped charges can be deployed at any time from your Stash during active boss matches!
          </p>
        </div>

        {/* 12 Spell Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {orbs.map((orb) => {
            const spell = getAbilityCost(orb.id);
            const ownedFragments = playerFragments[orb.id] || 0;
            const lockStatus = getOrbLockStatus(orb.id);
            const canAfford = ownedFragments >= spell.cost && !lockStatus.isLocked;
            const chargesCount = abilitiesCharges[orb.id] || 0;

            return (
              <div
                key={orb.id}
                id={`spell-card-${orb.id}`}
                className={`border rounded-xl p-4 flex flex-col justify-between transition duration-200 hover:shadow-lg relative overflow-hidden ${
                  lockStatus.isLocked
                    ? 'bg-zinc-950/60 border-zinc-950 opacity-50'
                    : 'bg-zinc-900/40 border-zinc-900 hover:border-zinc-800'
                }`}
              >
                {/* Visual lock overlay */}
                {lockStatus.isLocked && (
                  <div className="absolute inset-0 bg-black/40 z-10 flex flex-col items-center justify-center p-4 text-center backdrop-blur-[1px]">
                    <Lock className="w-6 h-6 text-amber-500 mb-2 animate-bounce" style={{ animationDuration: '3s' }} />
                    <span className="text-xs font-mono font-black uppercase text-amber-500 tracking-wider">
                      Orb Locked
                    </span>
                    <span className="text-[10px] text-zinc-400 mt-1 font-sans font-medium">
                      Requires: {lockStatus.criteria}
                    </span>
                  </div>
                )}

                <div>
                  {/* Sphere avatar, Name, Stored tally badge */}
                  <div className="flex justify-between items-start gap-2 mb-2 pb-2 border-b border-zinc-950">
                    <div className="flex items-center gap-2">
                      <MindOrb orbId={orb.id} className="w-7 h-7" />
                      <div>
                        <h3 className="font-bold text-xs text-zinc-150 capitalize leading-none mb-1">
                          {orb.id} Ability Scribe
                        </h3>
                        <span className="text-[10px] font-bold text-yellow-400 font-mono tracking-wide">
                          {spell.name}
                        </span>
                      </div>
                    </div>

                    <span className="px-1.5 py-0.5 bg-emerald-950 border border-emerald-900 text-emerald-400 rounded text-[10px] font-mono font-bold uppercase self-start">
                      STASH: x{chargesCount}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-zinc-400 text-[11px] leading-relaxed mb-4 min-h-[36px]">
                    {spell.description}
                  </p>
                </div>

                {/* Purchase buttons */}
                <div className="pt-3 border-t border-zinc-950 mt-auto flex items-center justify-between gap-4">
                  <div className="font-mono">
                    <div className="text-[9px] text-zinc-500 uppercase leading-none font-semibold">Forge Cost</div>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className={`text-sm font-bold ${canAfford ? 'text-amber-400 font-extrabold' : 'text-red-400'}`}>
                        {spell.cost}
                      </span>
                      <span className="text-[10px] text-zinc-500 capitalize">{orb.id} frg</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onBuyAbility(orb.id, spell.cost)}
                    disabled={!canAfford}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition flex items-center gap-1 active:scale-95 ${
                      canAfford
                        ? 'bg-amber-500 text-black hover:brightness-110 cursor-pointer shadow shadow-amber-500/10'
                        : 'bg-zinc-900 text-zinc-500 border border-zinc-850 cursor-not-allowed'
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5 text-current shrink-0" /> Forge Spell
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
