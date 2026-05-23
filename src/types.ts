export type OrbRarity = 'Common' | 'Uncommon' | 'Rare';

export interface OrbInfo {
  id: string; // orange, blue, green, silver, red, purple, yellow, gold, pink, white, black, teal
  name: string;
  color: string;
  hex: string;
  textColor: string;
  rarity: OrbRarity;
  baseRarityWeight: number; // e.g. 0.35, 0.30 etc.
  abilityDescription: string;
}

export interface Boss {
  id: string; // boss_1 to boss_10
  name: string;
  title: string;
  description: string;
  imageTheme: string; // aesthetic background gradient
  orbsMax: number; // boss's orb set size (usually 5 or 6)
  allowedColors: string[]; // the specific list of orb IDs available for this puzzle code
  lootCommonChan: number; // e.g. 1.0 (100%), 0.9 (90%) etc.
  lootUncommonChan: number;
  lootRareChan: number;
  bossSpecialDescription: string;
  dialogueIntro: string;
  dialogueDefeat: string;
  dialogueVictory: string;
  // Gating requirements (Orb fragments required to fight this boss)
  requiredFragments?: { [orbId: string]: number };
  
  // Compatibility fields for BossCard
  shieldMax?: number;
  codeLength?: number;

  // New visual asset fields
  portraitUrl: string;
  stageBgUrl: string;
  fallbackBgUrl?: string;
  hexTheme: string; // e.g., '#eab308' or similar primary color
}

export interface GuessRow {
  id: string;
  guess: string[]; // 4 orb ids
  perfectMatches: number; // black pegs (correct color & position)
  colorMatches: number; // white pegs (correct color, wrong position)
  
  // RPG combat compatibility values
  damageDealt?: number;
  healingDone?: number;
  shieldGain?: number;
  isCrit?: boolean;
  isIgnited?: boolean;
}

export interface BattleState {
  currentBoss: Boss;
  secretCode: string[]; // 4 secret orb IDs
  guesses: GuessRow[];
  currentGuess: (string | null)[]; // exactly 4 slots
  status: 'ACTIVE' | 'VICTORY' | 'DEFEAT';
  turnsRemaining: number;
  maxTurns: number;
  battleLog: string[];
  
  // Activated item enhancements for current match
  activeMultipliers: number; // e.g. 1.0, 1.75, 2.25
  silverLootChanceActive: boolean; // Silver Orb active
  goldLootChanceActive: boolean; // Gold Orb active
  yellowNegatedActive: boolean; // Yellow Orb passive negated boss special
  greenRevealedAbsent: string[]; // list of colors revealed to not be in the match
  burnedIndex?: number; // Red Orb burned index
  hintedIndexes: number[]; // Black Hint indices revealed
  extraGuessOrbsCount: number; // Max 1 extra-guess orb per match
  revealEffectsCount: number; // Max 2 reveal effects per match
  extraGainedNonCountedTurns: number; // Extra turns added by spells that don't increase penalty
}

export interface RewardBreakdown {
  status: 'VICTORY' | 'DEFEAT';
  bossName: string;
  bossTitle: string;
  dialogue: string;
  turnsTaken: number;
  baseAccuracyScore: number;
  multiplier: number;
  totalFragments: number;
  shares: { [orbId: string]: number };
  secretCode: string[];
  bossImageTheme: string;
}

export interface PlayerSaveData {
  fragments: { [orbId: string]: number }; // independent currency pouch for all 12 colors!
  abilitiesCharges: { [orbId: string]: number }; // quantity of charges for orange, blue, etc.
  campaignProgress: number; // highest boss index defeated (0 = none, 1 = Lemons defeated, etc. up to 10)
  activeBossIndex: number; // index of currently selected boss
  // Stats tracker
  totalWins: number;
  totalLosses: number;
  totalGuesses: number;
}
