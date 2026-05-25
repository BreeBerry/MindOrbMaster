import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Swords, 
  Sparkles, 
  BookOpen, 
  RotateCcw, 
  HelpCircle, 
  AlertCircle, 
  Trophy, 
  Dices,
  CirclePlay,
  RotateCw,
  Eye,
  KeyRound,
  Trash2,
  Backpack,
  Flame,
  Heart,
  Skull,
  Shield,
  Coins,
  ChevronRight,
  ShieldCheck,
  CheckCircle,
  TrendingUp,
  Info
} from 'lucide-react';

import { INITIAL_ORBS, BOSS_CAMPAIGN, getUnlockedOrbs } from './data';
import { PlayerSaveData, BattleState, GuessRow, OrbInfo, RewardBreakdown } from './types';
import BossCard from './components/BossCard';
import OrbUpgrades from './components/OrbUpgrades';
import CampaignProgress from './components/CampaignProgress';
import HistoricalGuesses from './components/HistoricalGuesses';
import GameRules from './components/GameRules';
import RewardModal from './components/RewardModal';
import StartMenu from './components/StartMenu';
import MindOrb from './components/MindOrb';

export default function App() {
  const [showStartMenu, setShowStartMenu] = useState<boolean>(true);
  const [isGameLaunched, setIsGameLaunched] = useState<boolean>(false);

  // --- Game Persistence State ---
  const [playerFragments, setPlayerFragments] = useState<{ [orbId: string]: number }>({
    orange: 150, blue: 120, green: 200, silver: 80,
    red: 80, purple: 50, yellow: 220, gold: 40,
    pink: 30, white: 45, black: 60, teal: 15
  });

  const [abilitiesCharges, setAbilitiesCharges] = useState<{ [orbId: string]: number }>({
    orange: 2, blue: 1, green: 1, silver: 0,
    red: 1, purple: 0, yellow: 1, gold: 0,
    pink: 0, white: 0, black: 0, teal: 0
  });

  const [campaignProgress, setCampaignProgress] = useState<number>(0);
  const [currentBossIndex, setCurrentBossIndex] = useState<number>(0);
  const [unlockedBosses, setUnlockedBosses] = useState<string[]>(['boss_1', 'boss_2', 'boss_3', 'boss_4', 'boss_5']);

  const [maxUnlockedOrbLength, setMaxUnlockedOrbLength] = useState<number>(4);
  const [chosenOrbSetSize, setChosenOrbSetSize] = useState<number>(4);

  const [totalWins, setTotalWins] = useState<number>(0);
  const [totalLosses, setTotalLosses] = useState<number>(0);
  const [totalGuesses, setTotalGuesses] = useState<number>(0);

  const [activeTab, setActiveTab] = useState<'battle' | 'forge' | 'codex' | 'stats'>('battle');
  const [battle, setBattle] = useState<BattleState | null>(null);
  const [selectedSpellId, setSelectedSpellId] = useState<string>('orange');
  const [isStashModalOpen, setIsStashModalOpen] = useState<boolean>(false);

  const renderOrbIconInBattle = (orbId: string) => {
    const isBar = orbId === 'gold' || orbId === 'silver';
    return (
      <MindOrb orbId={orbId} className={isBar ? "w-8 h-4" : "w-5 h-5"} />
    );
  };

  const [showRulesOverlay, setShowRulesOverlay] = useState<boolean>(false);
  const [activeAlert, setActiveAlert] = useState<{ message: string; type: 'success' | 'damage' | 'heal' | 'system' } | null>(null);
  const [endGameModal, setEndGameModal] = useState<RewardBreakdown | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Cross-Platform Handheld Simulator Setup (Supporting Android & Apple skins for mobile devices)
  const [isAndroidFrame, setIsAndroidFrame] = useState<boolean>(true);
  const [deviceSkin, setDeviceSkin] = useState<'android' | 'apple'>('android');
  const [phoneTime, setPhoneTime] = useState<string>('12:48 PM');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      const strMinutes = minutes < 10 ? '0' + minutes : minutes;
      setPhoneTime(`${hours}:${strMinutes} ${ampm}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const [hintTargetSlot, setHintTargetSlot] = useState<number | null>(null);

  // --- Load Game from Local Storage ---
  useEffect(() => {
    try {
      const savedFragments = localStorage.getItem('mm_pouch_fragments');
      const savedCharges = localStorage.getItem('mm_pouch_charges');
      const savedProgress = localStorage.getItem('mm_pouch_progress');
      const savedUnlocks = localStorage.getItem('mm_pouch_unlocks');
      
      const statsWins = localStorage.getItem('mm_pouch_wins');
      const statsLosses = localStorage.getItem('mm_pouch_losses');
      const statsGuesses = localStorage.getItem('mm_pouch_guesses');
      const savedMaxOrbLength = localStorage.getItem('mm_max_unlocked_orb_length');
      const savedChosenOrbSize = localStorage.getItem('mm_chosen_orb_set_size');

      if (savedFragments) setPlayerFragments(JSON.parse(savedFragments));
      if (savedCharges) setAbilitiesCharges(JSON.parse(savedCharges));
      if (savedProgress) setCampaignProgress(parseInt(savedProgress));
      if (savedUnlocks) setUnlockedBosses(JSON.parse(savedUnlocks));

      if (statsWins) setTotalWins(parseInt(statsWins));
      if (statsLosses) setTotalLosses(parseInt(statsLosses));
      if (statsGuesses) setTotalGuesses(parseInt(statsGuesses));

      if (savedMaxOrbLength) setMaxUnlockedOrbLength(parseInt(savedMaxOrbLength));
      if (savedChosenOrbSize) setChosenOrbSetSize(parseInt(savedChosenOrbSize));

      const savedDevice = localStorage.getItem('mm_device_design');
      if (savedDevice === 'apple' || savedDevice === 'android') {
        setDeviceSkin(savedDevice);
      }

    } catch (e) {
      console.error('Error reading localStorage save pouch files:', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // --- Save Game to Local Storage ---
  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem('mm_pouch_fragments', JSON.stringify(playerFragments));
    localStorage.setItem('mm_pouch_charges', JSON.stringify(abilitiesCharges));
    localStorage.setItem('mm_pouch_progress', campaignProgress.toString());
    localStorage.setItem('mm_pouch_unlocks', JSON.stringify(unlockedBosses));
    
    localStorage.setItem('mm_pouch_wins', totalWins.toString());
    localStorage.setItem('mm_pouch_losses', totalLosses.toString());
    localStorage.setItem('mm_pouch_guesses', totalGuesses.toString());

    localStorage.setItem('mm_max_unlocked_orb_length', maxUnlockedOrbLength.toString());
    localStorage.setItem('mm_chosen_orb_set_size', chosenOrbSetSize.toString());
  }, [playerFragments, abilitiesCharges, campaignProgress, unlockedBosses, totalWins, totalLosses, totalGuesses, maxUnlockedOrbLength, chosenOrbSetSize, isLoaded]);

  const triggerAlert = (message: string, type: 'success' | 'damage' | 'heal' | 'system') => {
    setActiveAlert({ message, type });
    setTimeout(() => setActiveAlert(null), 3000);
  };

  const payTollFee = (bossIndex: number) => {
    const boss = BOSS_CAMPAIGN[bossIndex];
    if (!boss || !boss.requiredFragments) return;

    if (bossIndex > campaignProgress) {
      triggerAlert('Defeat previous challenges first!', 'system');
      return;
    }

    if (unlockedBosses.includes(boss.id)) {
      triggerAlert('Gate toll already paid!', 'system');
      return;
    }

    const canAfford = Object.entries(boss.requiredFragments).every(([orbId, val]) => {
      const owned = playerFragments[orbId] || 0;
      return owned >= val;
    });

    if (!canAfford) {
      triggerAlert('Insufficient fragments in your alchemy pouch!', 'system');
      return;
    }

    const updatedFragments = { ...playerFragments };
    Object.entries(boss.requiredFragments).forEach(([orbId, val]) => {
      updatedFragments[orbId] = Math.max(0, updatedFragments[orbId] - val);
    });

    setPlayerFragments(updatedFragments);
    const updatedUnlocks = [...unlockedBosses, boss.id];
    setUnlockedBosses(updatedUnlocks);
    triggerAlert(`Successfully unlocked gate toll for ${boss.name}!`, 'success');
  };

  const startNewBattle = (bossIdx: number) => {
    const boss = BOSS_CAMPAIGN[bossIdx];
    if (!boss) return;

    const isLocked = bossIdx > campaignProgress || (boss.requiredFragments && !unlockedBosses.includes(boss.id));
    if (isLocked) {
      triggerAlert('Unlock this boss node first!', 'system');
      return;
    }

    const codeLength = chosenOrbSetSize;
    const availableColors = boss.allowedColors.filter(colorId => getUnlockedOrbs(campaignProgress).includes(colorId));
    const secret: string[] = [];
    for (let i = 0; i < codeLength; i++) {
      const randIdx = Math.floor(Math.random() * availableColors.length);
      secret.push(availableColors[randIdx]);
    }

    const logs: string[] = [];
    logs.push(`⚔️ MATCH BEGUN: Duel vs ${boss.name} (${boss.title})`);
    logs.push(`🔍 Level requires a ${codeLength}-color sequence.`);
    logs.push(`🔮 Allowed colors: ${availableColors.join(', ').toUpperCase()}`);

    if (boss.id === 'boss_8') {
      logs.push(`⚠️ WARNING: Asabeth's Web disables standard Black Hint Orbs!`);
    } else if (boss.id === 'boss_9') {
      logs.push(`⚠️ WARNING: Elkgore's blizzard scrambles the passcode once!`);
    } else if (boss.id === 'boss_10') {
      logs.push(`⚠️ WARNING: Martin steals turns whenever you find correct positions!`);
    }

    setBattle({
      currentBoss: boss,
      secretCode: secret,
      guesses: [],
      currentGuess: Array(codeLength).fill(null),
      status: 'ACTIVE',
      turnsRemaining: 10,
      maxTurns: 10,
      battleLog: logs,
      activeMultipliers: 1,
      silverLootChanceActive: false,
      goldLootChanceActive: false,
      yellowNegatedActive: false,
      greenRevealedAbsent: [],
      hintedIndexes: [],
      extraGuessOrbsCount: 0,
      revealEffectsCount: 0,
      extraGainedNonCountedTurns: 0
    });

    triggerAlert(`Began fight with ${boss.name}!`, 'system');
  };

  const buyAbilityCharge = (orbId: string, cost: number) => {
    const owned = playerFragments[orbId] || 0;
    if (owned < cost) {
      triggerAlert(`Insufficient ${orbId.toUpperCase()} fragments!`, 'system');
      return;
    }

    setPlayerFragments(prev => ({
      ...prev,
      [orbId]: Math.max(0, owned - cost)
    }));

    setAbilitiesCharges(prev => ({
      ...prev,
      [orbId]: (prev[orbId] || 0) + 1
    }));

    triggerAlert(`Successfully forged +1 ${orbId.toUpperCase()} Spell Charge!`, 'success');
  };

  const buyOrbSetUpgrade = (nextSize: number, cost: { [orbId: string]: number }) => {
    // Check campaign unlock eligibility first
    if (nextSize === 5 && campaignProgress < 5) {
      triggerAlert('Requires defeating Boss 5 (Natty D) first!', 'system');
      return;
    }
    if (nextSize === 6 && campaignProgress < 7) {
      triggerAlert('Requires defeating Boss 7 (Sir Louie) first!', 'system');
      return;
    }

    // Check afford
    const updatedPouch = { ...playerFragments };
    for (const [orbId, amt] of Object.entries(cost)) {
      const owned = updatedPouch[orbId] || 0;
      if (owned < amt) {
        triggerAlert(`Insufficient ${orbId.toUpperCase()} fragments to complete the upgrade!`, 'system');
        return;
      }
      updatedPouch[orbId] = owned - amt;
    }

    // Deduct fragments, change level
    setPlayerFragments(updatedPouch);
    setMaxUnlockedOrbLength(nextSize);
    setChosenOrbSetSize(nextSize); // automatically select the newly unlocked size!
    triggerAlert(`SUCCESS! Grand Altar upgraded to standard ${nextSize}-Orb guessing capacity!`, 'success');
  };

  const deploySpellAbility = (orbId: string) => {
    if (!battle || battle.status !== 'ACTIVE') return;

    const ownedCharges = abilitiesCharges[orbId] || 0;
    if (ownedCharges <= 0) {
      triggerAlert(`No charges of ${orbId.toUpperCase()} left!`, 'system');
      return;
    }

    if (battle.currentBoss.id === 'boss_8' && orbId === 'black' && !battle.yellowNegatedActive) {
      triggerAlert(`Asabeth's Shadow Net disables Hints! Use a Yellow Spell first.`, 'damage');
      return;
    }

    // Gameplay limits checking
    // 1. Extra-guess limit check (Orange, Purple, White)
    if (orbId === 'orange' || orbId === 'purple' || orbId === 'white') {
      if (battle.extraGuessOrbsCount >= 1) {
        triggerAlert(`Max 1 extra-guess spell allowed per battle!`, 'system');
        return;
      }
    }

    // 2. Reveal limits check (Green, Red, Black)
    if (orbId === 'green' || orbId === 'red' || orbId === 'black') {
      if (battle.revealEffectsCount >= 2) {
        triggerAlert(`Max 2 reveal effects allowed per battle!`, 'system');
        return;
      }
    }

    // 3. Multiplier limits check (Pink, Teal)
    if (orbId === 'pink' || orbId === 'teal') {
      if (battle.activeMultipliers > 1) {
        triggerAlert(`Loot multipliers do not stack!`, 'system');
        return;
      }
    }

    setAbilitiesCharges(prev => ({
      ...prev,
      [orbId]: Math.max(0, ownedCharges - 1)
    }));

    const updatedBattle = { ...battle };
    const logs = [...battle.battleLog];

    switch (orbId) {
      case 'orange':
        updatedBattle.turnsRemaining += 1;
        updatedBattle.maxTurns += 1;
        updatedBattle.extraGuessOrbsCount += 1;
        updatedBattle.extraGainedNonCountedTurns += 1;
        logs.push(`🍊 Deployed Orange Spell: Extended slot matrix by +1 turn!`);
        triggerAlert(`+1 Guess Turn granted!`, 'heal');
        break;

      case 'purple':
        updatedBattle.turnsRemaining += 2;
        updatedBattle.maxTurns += 2;
        updatedBattle.extraGuessOrbsCount += 1;
        updatedBattle.extraGainedNonCountedTurns += 2;
        logs.push(`🍇 Deployed Purple Spell: Extended slot matrix by +2 turns!`);
        triggerAlert(`+2 Guess Turns granted!`, 'heal');
        break;

      case 'white':
        updatedBattle.turnsRemaining += 3;
        updatedBattle.maxTurns += 3;
        updatedBattle.extraGuessOrbsCount += 1;
        updatedBattle.extraGainedNonCountedTurns += 3;
        logs.push(`⚪ Deployed White Spell: Extended slot matrix by +3 turns!`);
        triggerAlert(`+3 Guess Turns granted!`, 'heal');
        break;

      case 'green':
        {
          updatedBattle.revealEffectsCount += 1;
          const impossibleColors = battle.currentBoss.allowedColors
            .filter(colorId => getUnlockedOrbs(campaignProgress).includes(colorId))
            .filter(c => !battle.secretCode.includes(c) && !battle.greenRevealedAbsent.includes(c));
          if (impossibleColors.length > 0) {
            const chosen = impossibleColors[Math.floor(Math.random() * impossibleColors.length)];
            updatedBattle.greenRevealedAbsent = [...battle.greenRevealedAbsent, chosen];
            logs.push(`🟢 Deployed Green Reveal: Element [${chosen.toUpperCase()}] is ABSENT.`);
            triggerAlert(`Absent: [${chosen.toUpperCase()}]!`, 'success');
          } else {
            logs.push(`🟢 Deployed Green Reveal: All allowed colors are present!`);
            triggerAlert(`No absent elements!`, 'system');
          }
        }
        break;

      case 'blue':
        if (battle.guesses.length >= 5) {
          triggerAlert(`Blue Submerge only works during the first 5 turns!`, 'system');
          setAbilitiesCharges(prev => ({ ...prev, [orbId]: (prev[orbId] || 0) + 1 }));
          return;
        } else {
          const reScrambled: string[] = [];
          const unlockedAllowed = battle.currentBoss.allowedColors.filter(colorId => getUnlockedOrbs(campaignProgress).includes(colorId));
          for (let i = 0; i < battle.secretCode.length; i++) {
            const randIdx = Math.floor(Math.random() * unlockedAllowed.length);
            reScrambled.push(unlockedAllowed[randIdx]);
          }
          updatedBattle.secretCode = reScrambled;
          logs.push(`🟦 Deployed Blue Submerge: secret combination re-scrambled!`);
          triggerAlert(`Secret Passcode scrambled!`, 'system');
        }
        break;

      case 'red':
        {
          updatedBattle.revealEffectsCount += 1;
          const unrevealedIndexes: number[] = [];
          for (let i = 0; i < battle.secretCode.length; i++) {
            if (!battle.hintedIndexes.includes(i)) {
              unrevealedIndexes.push(i);
            }
          }
          if (unrevealedIndexes.length > 0) {
            const luckyIdx = unrevealedIndexes[Math.floor(Math.random() * unrevealedIndexes.length)];
            updatedBattle.hintedIndexes = [...battle.hintedIndexes, luckyIdx];
            const matchingColor = battle.secretCode[luckyIdx];
            logs.push(`🟥 Deployed Red Burn Option: Slot 0${luckyIdx + 1} is [${matchingColor.toUpperCase()}].`);
            triggerAlert(`Slot 0${luckyIdx + 1} holds [${matchingColor.toUpperCase()}]!`, 'success');
          } else {
            logs.push(`🟥 Deployed Red Burn Option: All slots scanned!`);
          }
        }
        break;

      case 'yellow':
        updatedBattle.yellowNegatedActive = true;
        logs.push(`🟡 Deployed Yellow Core: Boss passive penalties neutralized for this match!`);
        triggerAlert(`Boss special muted!`, 'success');
        break;

      case 'pink':
        updatedBattle.activeMultipliers = 1.75;
        logs.push(`💗 Deployed Pink Multiplier: Reward multiplier set to 1.75x!`);
        triggerAlert(`1.75x Pink Multiplier active!`, 'success');
        break;

      case 'teal':
        updatedBattle.activeMultipliers = 2.25;
        logs.push(`💎 Deployed Teal Multiplier: Reward multiplier set to 2.25x!`);
        triggerAlert(`2.25x Teal Multiplier active!`, 'success');
        break;

      case 'silver':
        updatedBattle.silverLootChanceActive = true;
        logs.push(`🪙 Deployed Silver Dust: +15% Uncommon loot drop odds!`);
        triggerAlert(`Uncommon odds boosted by +15%!`, 'success');
        break;

      case 'gold':
        updatedBattle.goldLootChanceActive = true;
        logs.push(`🏆 Deployed Gold Essence: +20% Rare loot drop odds!`);
        triggerAlert(`Rare odds boosted by +20%!`, 'success');
        break;

      case 'black':
        updatedBattle.revealEffectsCount += 1;
        setHintTargetSlot(0);
        logs.push(`🌌 Deployed Black Hint: Select slot index to reveal...`);
        break;

      default:
        break;
    }

    setBattle({
      ...updatedBattle,
      battleLog: logs
    });
  };

  const confirmBlackHintTarget = (slotIndex: number) => {
    if (!battle || hintTargetSlot === null) return;

    const logs = [...battle.battleLog];
    const targetColor = battle.secretCode[slotIndex];

    logs.push(`🌌 Black Hint scanning Slot 0${slotIndex + 1}: Revealed [${targetColor.toUpperCase()}]!`);
    
    const updatedHinted = [...battle.hintedIndexes];
    if (!updatedHinted.includes(slotIndex)) {
      updatedHinted.push(slotIndex);
    }

    setBattle({
      ...battle,
      hintedIndexes: updatedHinted,
      battleLog: logs
    });

    setHintTargetSlot(null);
    triggerAlert(`Slot 0${slotIndex + 1} holds [${targetColor.toUpperCase()}]!`, 'success');
  };

  const submitGuessRow = () => {
    if (!battle || battle.status !== 'ACTIVE') return;

    if (battle.currentGuess.some(element => element === null)) {
      triggerAlert('Fill out all of your empty guess slots first!', 'system');
      return;
    }

    const currentGuessStr = battle.currentGuess as string[];
    const { secretCode, currentBoss } = battle;
    const size = secretCode.length;

    let perfect = 0;
    let colorOnly = 0;

    const codeChecked = Array(size).fill(false);
    const guessChecked = Array(size).fill(false);

    for (let i = 0; i < size; i++) {
      if (currentGuessStr[i] === secretCode[i]) {
        perfect++;
        codeChecked[i] = true;
        guessChecked[i] = true;
      }
    }

    for (let i = 0; i < size; i++) {
      if (!guessChecked[i]) {
        for (let j = 0; j < size; j++) {
          if (!codeChecked[j] && currentGuessStr[i] === secretCode[j]) {
            colorOnly++;
            codeChecked[j] = true;
            break;
          }
        }
      }
    }

    const logs = [...battle.battleLog];
    const turnsTaken = battle.guesses.length + 1;
    const remainingBeforeAdjustment = battle.turnsRemaining - 1;
    let finalRemainingTurns = remainingBeforeAdjustment;

    logs.push(`📝 TURN #${turnsTaken} GUESS: [${currentGuessStr.join('・').toUpperCase()}]`);

    if (currentBoss.id === 'boss_9' && turnsTaken === 2 && !battle.yellowNegatedActive) {
      const reScrambled: string[] = [];
      const unlockedAllowed = currentBoss.allowedColors.filter(colorId => getUnlockedOrbs(campaignProgress).includes(colorId));
      for (let i = 0; i < size; i++) {
        const randIdx = Math.floor(Math.random() * unlockedAllowed.length);
        reScrambled.push(unlockedAllowed[randIdx]);
      }
      battle.secretCode = reScrambled;
      logs.push(`❄️ ELKGORE BLIZZARD: Blizzard scrambles secret matrix combination mid-battle!`);
      triggerAlert(`Code re-scrambled!`, 'damage');
    }

    let stolenTurnsCount = 0;
    if (currentBoss.id === 'boss_10' && !battle.yellowNegatedActive) {
      const correctCluesCount = perfect + colorOnly;
      if (correctCluesCount > 0) {
        stolenTurnsCount = 1;
        finalRemainingTurns = Math.max(0, finalRemainingTurns - stolenTurnsCount);
        logs.push(`👑 MARTIN STEAL: Martin steals -1 turn because you solved ${correctCluesCount} clues!`);
        triggerAlert(`-1 Turn stolen by Martin!`, 'damage');
      }
    }

    let stateOutcome: 'ACTIVE' | 'VICTORY' | 'DEFEAT' = 'ACTIVE';

    if (perfect === size) {
      stateOutcome = 'VICTORY';
    } else if (finalRemainingTurns <= 0) {
      stateOutcome = 'DEFEAT';
    }

    const record: GuessRow = {
      id: Math.random().toString(),
      guess: currentGuessStr,
      perfectMatches: perfect,
      colorMatches: colorOnly
    };

    const updatedGuessesList = [...battle.guesses, record];
    const payoutBalances: { [orbId: string]: number } = {};

    if (stateOutcome === 'VICTORY') {
      const nonCountedTurns = 2 + battle.extraGainedNonCountedTurns;
      const penalizingTurnsCount = Math.max(0, turnsTaken - nonCountedTurns);
      const pointsLeft = Math.max(5, 50 - penalizingTurnsCount * 5);
      const basePointsResult = pointsLeft * size;

      let finalLootMultiplier = battle.activeMultipliers;
      let lateGameBonusPercent = 0;
      let bonusFragments = 0;
      if (['boss_7', 'boss_8', 'boss_9', 'boss_10'].includes(currentBoss.id)) {
        lateGameBonusPercent = Math.floor(Math.random() * 11) + 15; // 15% to 25% bonus
      }

      let totalRewardPayout = basePointsResult * finalLootMultiplier;
      if (lateGameBonusPercent > 0) {
        bonusFragments = Math.floor(totalRewardPayout * (lateGameBonusPercent / 100));
        totalRewardPayout += bonusFragments;
      }

      logs.push(`🏆 VICTORY! Cracked the combination code in ${turnsTaken} turns!`);
      if (lateGameBonusPercent > 0) {
        logs.push(`📊 SCORE: Base [${pointsLeft}] × Slots [${size}] × Multiplier [${battle.activeMultipliers}x] = ${basePointsResult * finalLootMultiplier} fragments.`);
        logs.push(`✨ late-game economy boost: Gained +${lateGameBonusPercent}% bonus fragments (+${bonusFragments} fragments)!`);
        logs.push(`🎁 Total Reward Payout: ${totalRewardPayout} fragments.`);
      } else {
        logs.push(`📊 SCORE: Base [${pointsLeft}] × Slots [${size}] × Multiplier [${battle.activeMultipliers}x] = ${totalRewardPayout} fragments!`);
      }

      let commonChance = currentBoss.lootCommonChan;
      let uncommonChance = currentBoss.lootUncommonChan;
      let rareChance = currentBoss.lootRareChan;

      if (battle.silverLootChanceActive) {
        commonChance = Math.max(0, commonChance - 0.15);
        uncommonChance += 0.15;
        logs.push(`✨ Silver active: Uncommon drop rate boosted (+15%).`);
      }
      if (battle.goldLootChanceActive) {
        uncommonChance = Math.max(0, uncommonChance - 0.20);
        rareChance += 0.20;
        logs.push(`✨ Gold active: Rare drop rate boosted (+20%).`);
      }

      const selectedFragmentColors: string[] = [];
      let attempts = 0;

      while (selectedFragmentColors.length < 4 && attempts < 40) {
        attempts++;
        const rollValue = Math.random();
        let rolledTier: 'Common' | 'Uncommon' | 'Rare' = 'Common';

        if (rollValue < commonChance) {
          rolledTier = 'Common';
        } else if (rollValue < commonChance + uncommonChance) {
          rolledTier = 'Uncommon';
        } else {
          rolledTier = 'Rare';
        }

        let targetOrbId = 'orange';
        if (rolledTier === 'Common') {
          const innerRoll = Math.random() * 100;
          if (innerRoll < 35) targetOrbId = 'orange';
          else if (innerRoll < 65) targetOrbId = 'blue';
          else if (innerRoll < 90) targetOrbId = 'green';
          else targetOrbId = 'silver';
        } else if (rolledTier === 'Uncommon') {
          const innerRoll = Math.random() * 100;
          if (innerRoll < 35) targetOrbId = 'red';
          else if (innerRoll < 55) targetOrbId = 'purple';
          else if (innerRoll < 90) targetOrbId = 'yellow';
          else targetOrbId = 'gold';
        } else {
          const innerRoll = Math.random() * 100;
          if (innerRoll < 10) targetOrbId = 'pink';
          else if (innerRoll < 40) targetOrbId = 'white';
          else if (innerRoll < 90) targetOrbId = 'black';
          else targetOrbId = 'teal';
        }

        if (currentBoss.allowedColors.includes(targetOrbId) && !selectedFragmentColors.includes(targetOrbId)) {
          selectedFragmentColors.push(targetOrbId);
        }
      }

      if (selectedFragmentColors.length < 4) {
        currentBoss.allowedColors.forEach(c => {
          if (selectedFragmentColors.length < 4 && !selectedFragmentColors.includes(c)) {
            selectedFragmentColors.push(c);
          }
        });
      }

      const shareAmount = Math.max(1, Math.round(totalRewardPayout / selectedFragmentColors.length));
      const updatedPouch = { ...playerFragments };

      selectedFragmentColors.forEach(colorId => {
        updatedPouch[colorId] = (updatedPouch[colorId] || 0) + shareAmount;
        payoutBalances[colorId] = shareAmount;
      });

      setPlayerFragments(updatedPouch);
      setTotalWins(prev => prev + 1);

      if (currentBossIndex === campaignProgress && campaignProgress < 10) {
        setCampaignProgress(prev => prev + 1);
      }

      setEndGameModal({
        status: 'VICTORY',
        bossName: currentBoss.name,
        bossTitle: currentBoss.title,
        dialogue: currentBoss.dialogueDefeat,
        turnsTaken,
        baseAccuracyScore: basePointsResult,
        multiplier: battle.activeMultipliers,
        totalFragments: totalRewardPayout,
        shares: payoutBalances,
        secretCode: secretCode,
        bossImageTheme: currentBoss.imageTheme
      });

      triggerAlert(`VICTORY! Defeated ${currentBoss.name}! Mined fragments!`, 'success');
    } else if (stateOutcome === 'DEFEAT') {
      logs.push(`💀 DEFEATED! You failed to decipher the matrix within turn limits.`);
      setTotalLosses(prev => prev + 1);
      setEndGameModal({
        status: 'DEFEAT',
        bossName: currentBoss.name,
        bossTitle: currentBoss.title,
        dialogue: currentBoss.dialogueVictory,
        turnsTaken,
        baseAccuracyScore: 0,
        multiplier: battle.activeMultipliers,
        totalFragments: 0,
        shares: {},
        secretCode: secretCode,
        bossImageTheme: currentBoss.imageTheme
      });
      triggerAlert(`Encounter Failed! Try again.`, 'damage');
    } else {
      logs.push(`🟢 Turn result: [${perfect} Perfect, ${colorOnly} Color present].`);
    }

    setTotalGuesses(prev => prev + 1);

    setBattle({
      ...battle,
      guesses: updatedGuessesList,
      currentGuess: Array(size).fill(null),
      turnsRemaining: finalRemainingTurns,
      status: stateOutcome,
      battleLog: logs
    });
  };

  const placeOrbInCircle = (slotIdx: number, orbId: string) => {
    if (!battle || battle.status !== 'ACTIVE') return;
    const upd = [...battle.currentGuess];
    upd[slotIdx] = orbId;
    setBattle({ ...battle, currentGuess: upd });
  };

  const removeOrbFromCircle = (slotIdx: number) => {
    if (!battle || battle.status !== 'ACTIVE') return;
    const upd = [...battle.currentGuess];
    upd[slotIdx] = null;
    setBattle({ ...battle, currentGuess: upd });
  };

  const resetEntireCoreGame = () => {
    if (window.confirm('Are you absolutely sure you want to forfeit campaign progress, achievements, and fragments? This cannot be undone.')) {
      localStorage.clear();
      setPlayerFragments({
        orange: 100, blue: 100, green: 100, silver: 50,
        red: 50, purple: 50, yellow: 150, gold: 20,
        pink: 15, white: 15, black: 15, teal: 5
      });
      setAbilitiesCharges({
        orange: 1, blue: 1, green: 1, silver: 0,
        red: 0, purple: 0, yellow: 0, gold: 0,
        pink: 0, white: 0, black: 0, teal: 0
      });
      setCampaignProgress(0);
      setCurrentBossIndex(0);
      setUnlockedBosses(['boss_1', 'boss_2', 'boss_3', 'boss_4', 'boss_5']);
      setMaxUnlockedOrbLength(4);
      setChosenOrbSetSize(4);
      setTotalWins(0);
      setTotalLosses(0);
      setTotalGuesses(0);
      setBattle(null);
      setActiveTab('battle');
      triggerAlert('Save profile cleared. Campaign restarted.', 'system');
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center text-white p-6">
        <Sparkles className="w-10 h-10 text-amber-500 animate-spin mb-4" />
        <div className="font-mono text-[10px] uppercase tracking-widest text-zinc-400">Loading Alchemy Registers...</div>
      </div>
    );
  }

  function handlePaletteClick(orbId: string) {
    if (!battle || battle.status !== 'ACTIVE') return;
    const emptyIdx = battle.currentGuess.findIndex(slot => slot === null);
    if (emptyIdx !== -1) {
      placeOrbInCircle(emptyIdx, orbId);
    }
  }

  function fillGuessSlotsRandomly() {
    if (!battle || battle.status !== 'ACTIVE') return;
    const size = battle.currentGuess.length;
    const upd = [...battle.currentGuess];
    const pool = battle.currentBoss.allowedColors.filter(colorId => getUnlockedOrbs(campaignProgress).includes(colorId));

    for (let i = 0; i < size; i++) {
      if (upd[i] === null) {
        const rand = pool[Math.floor(Math.random() * pool.length)];
        upd[i] = rand;
      }
    }
    setBattle({ ...battle, currentGuess: upd });
  }

  const renderMainContent = () => {
    if (showStartMenu) {
      return (
        <StartMenu
          campaignProgress={campaignProgress}
          currentBossIndex={currentBossIndex}
          playerFragments={playerFragments}
          totalWins={totalWins}
          totalLosses={totalLosses}
          totalGuesses={totalGuesses}
          isAndroidFrame={isAndroidFrame}
          onSetAndroidFrame={setIsAndroidFrame}
          isGameLaunched={isGameLaunched}
          onLaunchGame={() => setIsGameLaunched(true)}
          onStartCampaign={(bossIdx) => {
            setShowStartMenu(false);
            setActiveTab('battle');
            startNewBattle(bossIdx);
          }}
          onOpenStore={() => {
            setIsGameLaunched(true);
            setShowStartMenu(false);
            setActiveTab('forge');
          }}
          onOpenRulebook={() => {
            setIsGameLaunched(true);
            setShowStartMenu(false);
            setActiveTab('codex');
          }}
          onResetData={() => {
            const confirmed = window.confirm('Are you absolutely sure you want to forfeit campaign progress, achievements, and fragments? This cannot be undone.');
            if (confirmed) {
              localStorage.clear();
              setPlayerFragments({
                orange: 100, blue: 100, green: 100, silver: 50,
                red: 50, purple: 50, yellow: 150, gold: 20,
                pink: 15, white: 15, black: 15, teal: 5
              });
              setAbilitiesCharges({
                orange: 1, blue: 1, green: 1, silver: 0,
                red: 0, purple: 0, yellow: 0, gold: 0,
                pink: 0, white: 0, black: 0, teal: 0
              });
              setCampaignProgress(0);
              setCurrentBossIndex(0);
              setUnlockedBosses(['boss_1', 'boss_2', 'boss_3', 'boss_4', 'boss_5']);
              setTotalWins(0);
              setTotalLosses(0);
              setTotalGuesses(0);
              setBattle(null);
              setIsGameLaunched(false);
              triggerAlert('Save profile cleared. Campaign restarted.', 'system');
            }
          }}
        />
      );
    }

    return (
      <div className="text-white font-sans selection:bg-amber-500 selection:text-black relative min-h-full">
        {/* Ambient background for active campaign/gameplay screen */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <img 
            src="https://raw.githubusercontent.com/BreeBerry/MindOrbMaster/main/public/images/title_screen/OrbMaster%20blank%20zany.png" 
            alt="Campaign Background"
            className="w-full h-full object-cover opacity-15 md:opacity-20 object-center"
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/images/title_screen/OrbMaster blank zany.png";
            }}
          />
          {/* Subtle dark visual overlays to keep other components highly legible */}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-zinc-950/70" />
        </div>
        
        {/* Top Banner Status HUD */}
        <header className="sticky top-0 z-40 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-900 shadow">
          <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center gap-4">
            
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="w-8.5 h-8.5 rounded-xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 flex items-center justify-center shadow shadow-amber-500/20 border border-white/5 shrink-0">
                <Swords className="w-4.5 h-4.5 text-black font-black" />
              </div>
              <div>
                <h1 className="text-xs font-black uppercase font-mono tracking-tight leading-none">MINDMASTER</h1>
                <span className="text-[8px] text-amber-400 font-bold tracking-widest block mt-0.5 uppercase">Boss Campaign v1.6</span>
              </div>
            </div>

            {/* Wallet HUD list */}
            <div className="flex items-center gap-2.5">
              
              {/* Quick overview showing common balances */}
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-lg text-[10px] font-mono select-none">
                <span className="text-zinc-500">Pouch:</span>
                <span className="text-yellow-400 font-bold">
                  {(Object.values(playerFragments) as number[]).reduce((a, b) => a + b, 0)} Shards
                </span>
              </div>

              <button
                onClick={() => setShowStartMenu(true)}
                className="px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-350 hover:text-white rounded-lg border border-zinc-850 shadow transition flex items-center gap-1.5 text-[9.5px] font-bold uppercase cursor-pointer"
                title="Return to Main Menu"
              >
                🏠 <span className="text-amber-400 font-extrabold">Home Menu</span>
              </button>

              <button
                onClick={() => setShowRulesOverlay(true)}
                className="p-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded-lg border border-zinc-800 shadow transition cursor-pointer"
                title="Open Manual & Codex"
              >
                <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              </button>
            </div>
          </div>
        </header>

        {/* Main Grid Frame */}
        <main className="relative z-10 max-w-7xl mx-auto px-4 mt-4 pb-12">
          
          {/* Playful Comic Tabs Navigation */}
          <div className="flex border-b border-zinc-900 gap-1 mb-4 overflow-x-auto min-w-full pb-0.5">
            <button
              onClick={() => {
                setBattle(null);
                setActiveTab('battle');
              }}
              className={`px-3 py-1.5 rounded-t-lg text-[10px] font-bold uppercase tracking-wider transition flex items-center gap-1.5 cursor-pointer shrink-0 ${
                activeTab === 'battle'
                  ? 'bg-zinc-900 text-white border-t border-r border-l border-zinc-800 shadow shadow-amber-400/5'
                  : 'text-zinc-550 hover:text-zinc-300'
              }`}
            >
              <Swords className="w-3.5 h-3.5 shrink-0" /> Battle Arena
            </button>
            <button
              onClick={() => setActiveTab('forge')}
              className={`px-3 py-1.5 rounded-t-lg text-[10px] font-bold uppercase tracking-wider transition flex items-center gap-1.5 cursor-pointer shrink-0 ${
                activeTab === 'forge'
                  ? 'bg-zinc-900 text-white border-t border-r border-l border-zinc-800 shadow'
                  : 'text-zinc-550 hover:text-zinc-300'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 shrink-0" /> Orb Forge
            </button>
            <button
              onClick={() => setActiveTab('codex')}
              className={`px-3 py-1.5 rounded-t-lg text-[10px] font-bold uppercase tracking-wider transition flex items-center gap-1.5 cursor-pointer shrink-0 ${
                activeTab === 'codex'
                  ? 'bg-zinc-900 text-white border-t border-r border-l border-zinc-800 shadow'
                  : 'text-zinc-550 hover:text-zinc-300'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 shrink-0" /> OrbMaster Codex
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`px-3 py-1.5 rounded-t-lg text-[10px] font-bold uppercase tracking-wider transition flex items-center gap-1.5 cursor-pointer shrink-0 ${
                activeTab === 'stats'
                  ? 'bg-zinc-900 text-white border-t border-r border-l border-zinc-800 shadow'
                  : 'text-zinc-550 hover:text-zinc-300'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 shrink-0" /> Profile Stats
            </button>
          </div>

          {/* Dynamic Display components */}
          <div className="space-y-4">
            {activeTab === 'battle' && (
              <>
                {/* Campaign Nodes List Component */}
                <CampaignProgress
                  bosses={BOSS_CAMPAIGN}
                  currentBossIndex={currentBossIndex}
                  campaignProgress={campaignProgress}
                  unlockedBosses={unlockedBosses}
                  onSelectBoss={(idx) => {
                    setCurrentBossIndex(idx);
                    startNewBattle(idx);
                  }}
                  onPayToll={payTollFee}
                  playerFragments={playerFragments}
                />

                {/* Battle Arena display */}
                {!battle ? (
                  <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 py-10 text-center flex flex-col items-center justify-center relative">
                    <div className="absolute inset-0 bg-radial-gradient(circle_at_center, rgba(234,179,8,0.02)_0%, transparent_70%) pointer-events-none" />
                    <Swords className="w-10 h-10 text-zinc-800 mb-3 animate-bounce" />
                    <h3 className="text-xs font-bold text-zinc-300 uppercase font-mono">Initialize Campaign Duel</h3>
                    <p className="text-zinc-500 text-[10px] mt-1 max-w-xs">
                      Select unlocked stage nodes above to pay tolls or engage the passcode decryption matrix.
                    </p>
                    {/* Match Orb Set Adjuster */}
                    <div className="mt-4 mb-1 flex flex-col items-center gap-1.5 bg-zinc-900/10 border border-zinc-900 rounded-xl p-3 w-full max-w-xs select-none">
                      <span className="text-[9px] font-mono uppercase tracking-wider text-zinc-400">Match Passcode Size</span>
                      <div className="flex items-center gap-2 mt-1">
                        {[4, 5, 6].map((size) => {
                          const isUnlocked = size <= maxUnlockedOrbLength;
                          const isSelected = chosenOrbSetSize === size;
                          return (
                            <button
                              key={size}
                              disabled={!isUnlocked}
                              onClick={() => isUnlocked && setChosenOrbSetSize(size)}
                              className={`w-12 h-9 rounded-lg font-mono font-extrabold text-xs flex items-center justify-center transition border ${
                                isSelected
                                  ? 'bg-amber-500 text-black border-amber-400 shadow shadow-amber-500/20 cursor-pointer'
                                  : isUnlocked
                                  ? 'bg-zinc-900 text-zinc-300 border-zinc-850 hover:bg-zinc-800 cursor-pointer'
                                  : 'bg-zinc-950/60 text-zinc-650 border-zinc-950 cursor-not-allowed'
                              }`}
                              title={isUnlocked ? `Set match code size to ${size}` : `Upgrade Orb Set to ${size} at the Forge`}
                            >
                              {size}
                              {!isUnlocked && <span className="text-[8px] ml-0.5">🔒</span>}
                            </button>
                          );
                        })}
                      </div>
                      <p className="text-[8px] text-zinc-500 mt-1 uppercase tracking-tight text-center">
                        {maxUnlockedOrbLength === 4 
                          ? 'Unlock sizes 5 & 6 under Forge!' 
                          : `Adjust setup values for deep strategizing`}
                      </p>
                    </div>

                    <button
                      onClick={() => startNewBattle(currentBossIndex)}
                      className="mt-4 px-5 py-2 bg-gradient-to-r from-amber-500 to-yellow-400 hover:brightness-110 text-black text-[10px] font-black uppercase rounded-lg tracking-wider transition flex items-center gap-1.5 shadow"
                    >
                      <CirclePlay className="w-3.5 h-3.5 fill-current shrink-0" /> Challenge Active Target
                    </button>
                  </div>
                ) : (
                  <div className="w-full">
                    
                    {/* MOBILE DEDICATED VISUAL FLOW (Optimized layout, bottom sheet trigger, and floating backpack) */}
                    <div className="flex md:hidden flex-col gap-4">
                      {/* Atmospheric Showcase Boss Card */}
                      <BossCard
                        boss={battle.currentBoss}
                        currentHp={battle.turnsRemaining}
                        currentShield={0}
                        maxHp={battle.maxTurns}
                        status={battle.status}
                        turnsRemaining={battle.turnsRemaining}
                        maxTurns={battle.maxTurns}
                        dialogue={
                          battle.status === 'VICTORY'
                            ? battle.currentBoss.dialogueDefeat
                            : battle.status === 'DEFEAT'
                            ? battle.currentBoss.dialogueVictory
                            : battle.currentBoss.dialogueIntro
                        }
                        activeEffects={{
                          igniteTurns: 0,
                          igniteDamage: 0,
                          bossBlindTurns: 0,
                          fragileTurns: 0,
                          fragileMultiplier: 1
                        }}
                      />

                      {/* Code Matrix Slot Board */}
                      <div className="bg-zinc-950 rounded-2xl border border-zinc-900 p-4 shadow-xl relative overflow-hidden">
                        {/* Stone Wall Background Textured Overlay sourced from Raw GitHub URL */}
                        <img 
                          src="https://raw.githubusercontent.com/BreeBerry/MindOrbMaster/main/public/images/stone%20wall.png"
                          alt="Stone Wall Background Texture"
                          className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            // Fallback to beautiful high-res Unsplash dark stone wall if file is empty/not pushed yet
                            e.currentTarget.src = "https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&q=80&w=800";
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/80 via-zinc-950/50 to-zinc-950/90 pointer-events-none" />
                        <div className="absolute right-0 top-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none relative z-10" />
                        
                        <div className="flex justify-between items-center mb-3 pb-1.5 border-b border-zinc-900 relative z-10">
                          <div>
                            <span className="text-[8px] uppercase tracking-wider text-amber-500 font-bold font-mono">CODE MATRIX</span>
                            <h4 className="text-[10px] uppercase font-extrabold text-zinc-350 mt-0.5">TAP TO RESET ELEMENT</h4>
                          </div>
                          <span className="text-[9px] text-zinc-500 font-mono uppercase">
                            {battle.status === 'ACTIVE' ? 'COMBAT' : 'FINISHED'}
                          </span>
                        </div>

                        {/* Slots */}
                        <div className="flex flex-wrap items-center justify-center gap-2 py-3 relative z-10">
                          {battle.currentGuess.map((slot, sIdx) => {
                            const matchingOrb = slot ? INITIAL_ORBS.find(o => o.id === slot) : null;
                            
                            return (
                              <button
                                key={sIdx}
                                onClick={() => slot && removeOrbFromCircle(sIdx)}
                                className={`w-11 h-11 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer relative ${
                                  matchingOrb
                                    ? 'border-white/50 hover:brightness-110 active:scale-95'
                                    : 'border-zinc-800 border-dashed bg-zinc-900/40 hover:border-zinc-500 hover:bg-zinc-900/80'
                                }`}
                              >
                                {matchingOrb ? (
                                  <MindOrb orbId={matchingOrb.id} className="w-8.5 h-8.5" />
                                ) : (
                                  <span className="text-zinc-650 text-[10px] font-mono font-bold">0{sIdx + 1}</span>
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {/* Palette elements */}
                        {battle.status === 'ACTIVE' ? (
                          <div className="space-y-3 pt-2 relative z-10">
                            <div className="text-center">
                              <span className="text-[8.5px] text-zinc-500 uppercase tracking-widest font-mono">Tap color to fill slots:</span>
                            </div>
                            <div className="grid grid-cols-3 gap-1.5 bg-zinc-900/10 p-2 border border-zinc-900/60 rounded-xl">
                              {battle.currentBoss.allowedColors
                                .filter(colorId => getUnlockedOrbs(campaignProgress).includes(colorId))
                                .map((colorId) => {
                                  const orb = INITIAL_ORBS.find(o => o.id === colorId);
                                  if (!orb) return null;
                                  
                                  return (
                                    <button
                                      key={colorId}
                                      onClick={() => handlePaletteClick(colorId)}
                                      className="py-2 bg-zinc-950 border border-zinc-900 hover:border-zinc-850 text-[10px] font-bold rounded-lg flex flex-col items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer text-zinc-350 shadow"
                                    >
                                      <MindOrb orbId={orb.id} className="w-4 h-4" />
                                      <span className="capitalize text-[8.5px] font-mono">{colorId}</span>
                                    </button>
                                  );
                                })}
                            </div>

                            {/* Mobile Controls buttons */}
                            <div className="flex gap-2 justify-between pt-2">
                              <button
                                onClick={() => setBattle({ ...battle, currentGuess: Array(battle.secretCode.length).fill(null) })}
                                className="flex-1 py-2.5 bg-zinc-900 border border-zinc-850 text-[9.5px] font-bold uppercase rounded-xl hover:bg-zinc-850 hover:text-white transition flex items-center justify-center gap-1 cursor-pointer"
                              >
                                <RotateCcw className="w-3 h-3 text-red-400" /> Clear
                              </button>
                              <button
                                onClick={fillGuessSlotsRandomly}
                                className="flex-1 py-2.5 bg-zinc-900 border border-zinc-850 text-[9.5px] font-bold uppercase rounded-xl hover:bg-zinc-850 hover:text-white transition flex items-center justify-center gap-1 cursor-pointer"
                              >
                                <Dices className="w-3 h-3 text-cyan-400" /> Auto
                              </button>
                              <button
                                onClick={submitGuessRow}
                                className="flex-1.5 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-400 hover:brightness-110 text-black text-[10px] font-mono font-black uppercase rounded-xl tracking-wider transition active:scale-95 cursor-pointer shadow shadow-amber-500/10 flex items-center justify-center gap-1"
                              >
                                Submit combination
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-4 bg-black/40 border border-zinc-900 rounded-xl relative z-10">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-350">
                              Duel finished
                            </h4>
                            <p className="text-[10px] text-zinc-500 mt-0.5">
                              {battle.status === 'VICTORY' ? '🏆 Passcode is cracked!' : '💀 Battle outcome failed.'}
                            </p>
                            <button
                              onClick={() => startNewBattle(currentBossIndex)}
                              className="mt-3 px-4 py-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-[9.5px] font-bold uppercase rounded-xl transition cursor-pointer"
                            >
                              <RotateCw className="w-3 h-3 inline mr-1" /> Restart Node Duel
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Mobile floating backpack action card */}
                      {battle.status === 'ACTIVE' && (
                        <button
                          onClick={() => setIsStashModalOpen(true)}
                          className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-purple-950/80 to-zinc-950/95 border-2 border-purple-500/35 hover:border-purple-400 rounded-2xl shadow-[0_0_15px_rgba(168,85,247,0.15)] active:scale-[0.98] transition cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-purple-900/60 border border-purple-500/40 flex items-center justify-center animate-pulse">
                              <Backpack className="w-4 h-4 text-purple-300" />
                            </div>
                            <div className="text-left">
                              <span className="text-[9px] font-mono text-purple-400 font-extrabold uppercase tracking-wide block leading-none">
                                Alchemist Spellbook
                              </span>
                              <span className="text-[11px] font-black uppercase tracking-wide text-zinc-100 mt-0.5 block">
                                Open Grid Stash
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <div className="px-2 py-0.5 bg-purple-900/50 border border-purple-500/30 text-purple-300 text-[9px] font-mono font-bold rounded-lg">
                              {Object.values(abilitiesCharges).reduce<number>((sum, val) => sum + (val as number), 0)} Charges
                            </div>
                            <ChevronRight className="w-4 h-4 text-purple-450" />
                          </div>
                        </button>
                      )}

                      {/* Historical Logs List */}
                      <HistoricalGuesses
                        guesses={battle.guesses}
                        codeLength={battle.secretCode.length}
                        availableOrbs={INITIAL_ORBS}
                        shroudedTurnsActive={false}
                      />
                    </div>

                    {/* DESKTOP MAJESTIC VISUAL FLOW (Expansive widescreen arena layout with full focus on duel atmospheres) */}
                    <div className="hidden md:flex flex-col gap-5 w-full">
                      {/* Full-width High-Showcase Boss Duel Backdrop */}
                      <BossCard
                        boss={battle.currentBoss}
                        currentHp={battle.turnsRemaining}
                        currentShield={0}
                        maxHp={battle.maxTurns}
                        status={battle.status}
                        turnsRemaining={battle.turnsRemaining}
                        maxTurns={battle.maxTurns}
                        dialogue={
                          battle.status === 'VICTORY'
                            ? battle.currentBoss.dialogueDefeat
                            : battle.status === 'DEFEAT'
                            ? battle.currentBoss.dialogueVictory
                            : battle.currentBoss.dialogueIntro
                        }
                        activeEffects={{
                          igniteTurns: 0,
                          igniteDamage: 0,
                          bossBlindTurns: 0,
                          fragileTurns: 0,
                          fragileMultiplier: 1
                        }}
                      />

                      {/* Code Matrix grid container - centering the code puzzle layout */}
                      <div className="bg-zinc-950 rounded-2xl border border-zinc-900 p-5 shadow-xl relative overflow-hidden">
                        {/* Stone Wall Background Textured Overlay sourced from Raw GitHub URL */}
                        <img 
                          src="https://raw.githubusercontent.com/BreeBerry/MindOrbMaster/main/public/images/stone%20wall.png"
                          alt="Stone Wall Background Texture"
                          className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            // Fallback to beautiful high-res Unsplash dark stone wall if file is empty/not pushed yet
                            e.currentTarget.src = "https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&q=80&w=800";
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/80 via-zinc-950/50 to-zinc-950/90 pointer-events-none" />
                        <div className="absolute right-0 top-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl pointer-events-none relative z-10" />
                        
                        {/* Title bar */}
                        <div className="flex justify-between items-center mb-4 pb-2 border-b border-zinc-900 relative z-10">
                          <div>
                            <span className="text-[9px] uppercase tracking-widest text-amber-500 font-bold font-mono">CODE MATRIX DECRYPTOR</span>
                            <h4 className="text-xs uppercase font-extrabold text-zinc-350 mt-0.5">Submit Formula Combination</h4>
                          </div>
                          <span className="text-[10px] text-zinc-500 font-mono tracking-wider uppercase">
                            {battle.status === 'ACTIVE' ? 'DUEL ENGAGED' : 'SYSTEM OFFLINE'}
                          </span>
                        </div>

                        {/* Slots */}
                        <div className="flex flex-wrap items-center justify-center gap-3 py-6 relative z-10">
                          {battle.currentGuess.map((slot, sIdx) => {
                            const matchingOrb = slot ? INITIAL_ORBS.find(o => o.id === slot) : null;
                            
                            return (
                              <button
                                key={sIdx}
                                onClick={() => slot && removeOrbFromCircle(sIdx)}
                                className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer relative ${
                                  matchingOrb
                                    ? 'border-white/50 hover:brightness-110 active:scale-95'
                                    : 'border-zinc-800 border-dashed bg-zinc-900/40 hover:border-zinc-500 hover:bg-zinc-900/80'
                                }`}
                              >
                                {matchingOrb ? (
                                  <MindOrb orbId={matchingOrb.id} className="w-9.5 h-9.5" />
                                ) : (
                                  <span className="text-zinc-650 text-xs font-mono font-bold">0{sIdx + 1}</span>
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {/* Palette Selections */}
                        {battle.status === 'ACTIVE' ? (
                          <div className="space-y-4 pt-1 max-w-2xl mx-auto relative z-10">
                            <div className="text-center">
                              <span className="text-[9px] text-zinc-550 uppercase tracking-widest font-mono">Select elements to load into circles:</span>
                            </div>
                            <div className="flex flex-wrap items-center justify-center gap-2 bg-stone-900/15 p-3 border border-zinc-900/85 rounded-xl">
                              {battle.currentBoss.allowedColors
                                .filter(colorId => getUnlockedOrbs(campaignProgress).includes(colorId))
                                .map((colorId) => {
                                  const orb = INITIAL_ORBS.find(o => o.id === colorId);
                                  if (!orb) return null;
                                  
                                  return (
                                    <button
                                      key={colorId}
                                      onClick={() => handlePaletteClick(colorId)}
                                      className="px-3 py-1.5 bg-zinc-950 border border-zinc-850 hover:border-zinc-700 text-xs font-bold rounded-lg flex items-center gap-2 transition active:scale-95 cursor-pointer text-zinc-300 shadow-sm"
                                    >
                                      <MindOrb orbId={orb.id} className="w-3.5 h-3.5" />
                                      <span className="capitalize text-[10px]">{colorId}</span>
                                    </button>
                                  );
                                })}
                            </div>

                            {/* Controls bar + Spell Stash Launcher button */}
                            <div className="flex gap-2.5 justify-between items-center pt-2">
                              {/* Left: Spellbook launcher */}
                              <button
                                onClick={() => setIsStashModalOpen(true)}
                                className="px-4 py-2 bg-gradient-to-r from-purple-950 to-zinc-950 border border-purple-500/40 text-[10px] text-purple-300 font-extrabold uppercase rounded-lg hover:border-purple-400 hover:text-white transition flex items-center gap-2 cursor-pointer shadow-md select-none"
                              >
                                <Backpack className="w-4 h-4 text-purple-400 animate-pulse" />
                                <span>Alchemist Spell Stash</span>
                                <span className="bg-purple-900/60 text-purple-300 text-[9px] px-1.5 py-0.2 rounded-full font-mono border border-purple-500/30">
                                  {Object.values(abilitiesCharges).reduce<number>((sum, val) => sum + (val as number), 0)} Charges
                                </span>
                              </button>

                              {/* Right: Submit & clear controls */}
                              <div className="flex gap-2.5">
                                <button
                                  onClick={() => setBattle({ ...battle, currentGuess: Array(battle.secretCode.length).fill(null) })}
                                  className="px-3.5 py-2 bg-zinc-900 border border-zinc-800 text-[10px] font-bold uppercase rounded-lg hover:bg-zinc-850 hover:text-white transition flex items-center gap-1.5 cursor-pointer"
                                >
                                  <RotateCcw className="w-3.5 h-3.5 animate-spin-slow" /> Clear
                                </button>
                                <button
                                  onClick={fillGuessSlotsRandomly}
                                  className="px-3.5 py-2 bg-zinc-900 border border-zinc-800 text-[10px] font-bold uppercase rounded-lg hover:bg-zinc-850 hover:text-white transition flex items-center gap-1.5 cursor-pointer"
                                >
                                  <Dices className="w-3.5 h-3.5" /> Auto Fill
                                </button>
                                <button
                                  onClick={submitGuessRow}
                                  className="px-5 py-2 bg-gradient-to-r from-amber-500 to-yellow-400 hover:brightness-110 text-black text-[10.5px] font-mono font-black uppercase rounded-lg tracking-wider transition active:scale-95 cursor-pointer shadow shadow-amber-500/10 flex items-center gap-1.5"
                                >
                                  Submit combination
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-5 bg-black/40 border border-zinc-900 rounded-xl relative z-10">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-350">
                              Duel complete
                            </h4>
                            <p className="text-[10px] text-zinc-500 mt-1">
                              {battle.status === 'VICTORY' ? '🏆 Passcode is successfully cracked!' : '💀 Decryption node connection broken.'}
                            </p>
                            <button
                              onClick={() => startNewBattle(currentBossIndex)}
                              className="mt-4 px-5 py-2 bg-zinc-900 border border-zinc-850 hover:bg-zinc-800 text-[10px] font-bold uppercase rounded-lg transition cursor-pointer"
                            >
                              <RotateCw className="w-3.5 h-3.5 inline mr-1" /> Restart Node Duel
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Widescreen feedback history */}
                      <HistoricalGuesses
                        guesses={battle.guesses}
                        codeLength={battle.secretCode.length}
                        availableOrbs={INITIAL_ORBS}
                        shroudedTurnsActive={false}
                      />
                    </div>

                    {/* CONTEXTUAL INTUITIVE POPUP MODAL FOR ALCHEMIST GRID STASH */}
                    {isStashModalOpen && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div 
                          className="absolute inset-0 bg-black/85 backdrop-blur-md cursor-pointer" 
                          onClick={() => setIsStashModalOpen(false)}
                        />
                        
                        <div 
                          className="bg-zinc-950 border-2 border-purple-500/40 rounded-2xl p-5 max-w-md w-full relative z-10 shadow-[0_0_50px_rgba(168,85,247,0.35)] text-white animate-[zoomIn_0.15s_ease-out]"
                          style={{ borderColor: battle ? `${battle.currentBoss.hexTheme}50` : '' }}
                        >
                          <div className="flex justify-between items-center border-b border-zinc-900 pb-2.5 mb-4">
                            <div>
                              <span className="text-[8px] font-mono tracking-widest text-purple-400 font-bold uppercase block leading-none">
                                Alchemist Grid Stash
                              </span>
                              <h4 className="text-xs font-extrabold uppercase mt-1 flex items-center gap-1.5 text-zinc-100">
                                <span>Select & Casting Pad</span>
                                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping inline-block" />
                              </h4>
                            </div>
                            <button 
                              onClick={() => setIsStashModalOpen(false)}
                              className="w-8 h-8 flex items-center justify-center bg-zinc-900 hover:bg-zinc-800 rounded-lg text-xs font-mono font-bold transition cursor-pointer text-zinc-400 hover:text-white"
                            >
                              ✕
                            </button>
                          </div>

                          {/* 4x3 Spell Matrix grid */}
                          <div className="grid grid-cols-4 gap-2 py-1">
                            {INITIAL_ORBS.map((orb) => {
                              const chargesOwned = abilitiesCharges[orb.id] || 0;
                              const isSelected = selectedSpellId === orb.id;
                              
                              return (
                                <button
                                  key={orb.id}
                                  onClick={() => setSelectedSpellId(orb.id)}
                                  className={`p-2 rounded-xl border flex flex-col items-center justify-between gap-1 transition-all relative cursor-pointer group select-none ${
                                    isSelected
                                      ? 'bg-purple-900/20 border-purple-405 shadow-[0_0_12px_rgba(168,85,247,0.3)] scale-[1.04]'
                                      : chargesOwned > 0
                                      ? 'bg-zinc-900 border-zinc-800 hover:border-zinc-750'
                                      : 'bg-zinc-950/25 border-zinc-950 opacity-40 hover:opacity-60'
                                  }`}
                                >
                                  {/* Count badge */}
                                  <span className={`absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full text-[8px] font-black font-mono border ${
                                    chargesOwned > 0
                                      ? 'bg-purple-900 border-purple-505 text-purple-305'
                                      : 'bg-zinc-950 border-zinc-900 text-zinc-650'
                                  }`}>
                                    {chargesOwned}
                                  </span>
                                  
                                  <div className="py-2.5">
                                    {renderOrbIconInBattle(orb.id)}
                                  </div>
                                  <span className="text-[7.5px] font-mono leading-none font-bold uppercase tracking-wider text-zinc-450 truncate w-full text-center">
                                    {orb.id}
                                  </span>
                                </button>
                              );
                            })}
                          </div>

                          {/* Ability Details & Casting Button */}
                          {(() => {
                            const selectedOrb = INITIAL_ORBS.find(o => o.id === selectedSpellId);
                            if (!selectedOrb) return null;
                            const chargesOwned = abilitiesCharges[selectedOrb.id] || 0;
                            return (
                              <div className="mt-4 bg-zinc-900/35 border border-zinc-900 rounded-xl p-3 flex flex-col gap-2 transition-all">
                                <div className="flex justify-between items-center gap-1.5">
                                  <div className="flex items-center gap-1.5 truncate">
                                    <span className="text-[7.5px] font-extrabold font-mono text-purple-400 uppercase shrink-0">SELECTED:</span>
                                    <span className="text-[10px] font-black uppercase text-zinc-100 truncate">{selectedOrb.id}</span>
                                  </div>
                                  <span className="text-[8px] font-mono text-zinc-400 shrink-0">Charges: {chargesOwned}</span>
                                </div>
                                <p className="text-[9.5px] text-zinc-350 leading-normal font-sans">
                                  {selectedOrb.abilityDescription}
                                </p>
                                <button
                                  onClick={() => {
                                    deploySpellAbility(selectedOrb.id);
                                    if (chargesOwned <= 1) {
                                      // Can keep open or let player cast further
                                    }
                                  }}
                                  disabled={chargesOwned <= 0 || !battle || battle.status !== 'ACTIVE'}
                                  className={`w-full py-2.5 rounded-xl text-[10px] font-black uppercase font-mono tracking-wider transition-all cursor-pointer ${
                                    chargesOwned > 0 && battle && battle.status === 'ACTIVE'
                                      ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:brightness-110 active:scale-[0.98]'
                                      : 'bg-zinc-900 text-zinc-600 border border-zinc-900 cursor-not-allowed'
                                  }`}
                                >
                                  {chargesOwned > 0 ? 'Cast Spell Ability' : 'No Charges'}
                                </button>
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    )}

                  </div>
                )}
              </>
            )}

            {activeTab === 'forge' && (
              <OrbUpgrades
                orbs={INITIAL_ORBS}
                playerFragments={playerFragments}
                abilitiesCharges={abilitiesCharges}
                onBuyAbility={buyAbilityCharge}
                campaignProgress={campaignProgress}
                maxUnlockedOrbLength={maxUnlockedOrbLength}
                onBuyOrbSetUpgrade={buyOrbSetUpgrade}
              />
            )}

            {activeTab === 'codex' && (
              <div className="max-w-xl mx-auto">
                <GameRules />
              </div>
            )}

            {activeTab === 'stats' && (
              <div className="max-w-2xl mx-auto bg-zinc-950 border border-zinc-900 rounded-2xl p-5 text-white shadow-xl">
                <div className="border-b border-zinc-900 pb-3 mb-4">
                  <span className="text-[9px] font-mono tracking-widest text-amber-400 font-bold uppercase flex items-center gap-1">
                    <Trophy className="w-3.5 h-3.5" /> Core Profile Logs
                  </span>
                  <h2 className="text-base font-bold tracking-tight mt-0.5">Player Statistics Summary</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center mb-6">
                  <div className="bg-zinc-900/60 border border-zinc-850 p-3 rounded-lg">
                    <div className="text-[8.5px] font-mono text-zinc-500 uppercase">Matches Won</div>
                    <div className="text-xl font-extrabold font-mono text-emerald-400 mt-0.5">{totalWins}</div>
                  </div>
                  <div className="bg-zinc-900/60 border border-zinc-850 p-3 rounded-lg">
                    <div className="text-[8.5px] font-mono text-zinc-500 uppercase">Defeats</div>
                    <div className="text-xl font-extrabold font-mono text-red-500 mt-0.5">{totalLosses}</div>
                  </div>
                  <div className="bg-zinc-900/60 border border-zinc-850 p-3 rounded-lg">
                    <div className="text-[8.5px] font-mono text-zinc-400 uppercase">Guesses Sent</div>
                    <div className="text-xl font-extrabold font-mono text-amber-500 mt-0.5">{totalGuesses}</div>
                  </div>
                </div>

                {/* Achievements banner */}
                <div className="bg-black/20 border border-zinc-900 p-3.5 rounded-xl mb-4 flex items-start gap-2.5">
                  <span className="text-base shrink-0 select-none">🏆</span>
                  <div>
                    <h4 className="text-[10px] font-bold uppercase font-mono text-zinc-150">Highest rank: Decryption Prodigy</h4>
                    <p className="text-[10px] text-zinc-500 mt-0.5 leading-tight">
                      You have passed Stage 0{campaignProgress} of the mindmaster campaign hierarchy node tree.
                    </p>
                  </div>
                </div>

                {/* Clear data button */}
                <div className="pt-4 border-t border-zinc-900 flex justify-end">
                  <button
                    onClick={resetEntireCoreGame}
                    className="px-3.5 py-1.5 bg-red-950/20 hover:bg-red-955/40 text-red-400 border border-red-900/40 text-[9.5px] font-bold uppercase rounded-lg transition flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Reset Profile Data
                  </button>
                </div>
              </div>
            )}
          </div>

        </main>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-stone-950 text-white font-sans antialiased selection:bg-amber-500 selection:text-black flex flex-col justify-start">
      
      {/* Emulation Enforcing Control Header Banner */}
      <div className="bg-zinc-900 border-b border-zinc-850 py-2 px-4 shadow flex flex-col sm:flex-row justify-between items-center gap-2 text-xs font-semibold shrink-0">
        <span className="flex items-center gap-2 text-zinc-400 text-[10px] uppercase tracking-wider font-mono">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
          Universal Mobile Handheld System Emulator
        </span>
        <div className="flex items-center gap-3">
          {isAndroidFrame && (
            <div className="flex bg-zinc-950 p-0.5 rounded-lg border border-zinc-900 select-none">
              <button
                onClick={() => { setDeviceSkin('android'); localStorage.setItem('mm_device_design', 'android'); }}
                className={`px-2 py-0.5 text-[9px] font-mono rounded font-bold uppercase transition ${
                  deviceSkin === 'android'
                    ? 'bg-amber-500 text-black'
                    : 'text-zinc-550 hover:text-zinc-200'
                }`}
              >
                Galaxy
              </button>
              <button
                onClick={() => { setDeviceSkin('apple'); localStorage.setItem('mm_device_design', 'apple'); }}
                className={`px-2 py-0.5 text-[9px] font-mono rounded font-bold uppercase transition ${
                  deviceSkin === 'apple'
                    ? 'bg-amber-500 text-black'
                    : 'text-zinc-550 hover:text-zinc-200'
                }`}
              >
                iPhone
              </button>
            </div>
          )}
          <button
            onClick={() => setIsAndroidFrame(!isAndroidFrame)}
            className="px-3 py-1 bg-zinc-800 hover:bg-zinc-750 border border-zinc-700 hover:border-zinc-500 rounded-lg text-[10px] uppercase font-mono font-bold text-amber-400 flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
          >
            📱 {isAndroidFrame ? 'Desktop Wide Mode' : 'Pocket Phone Frame'}
          </button>
        </div>
      </div>

      {isAndroidFrame ? (
        <div className="flex-1 flex justify-center items-center py-6 px-4 bg-zinc-950 bg-[radial-gradient(circle_at_top,rgba(245,158,11,0.03),transparent)]">
          {/* Handheld Device Case */}
          <div className={`relative w-full max-w-[460px] bg-stone-950 border-[9px] ${
            deviceSkin === 'apple' ? 'border-zinc-805 rounded-[52px]' : 'border-zinc-900 rounded-[44px]'
          } shadow-[0_30px_70px_-20px_rgba(0,0,0,0.95),_0_0_40px_rgba(245,158,11,0.04)] overflow-hidden flex flex-col h-[780px] max-h-[85vh]`}>
            {/* Gloss Outer Glass Frame Overlay */}
            <div className={`absolute inset-0 border border-white/5 ${
              deviceSkin === 'apple' ? 'rounded-[42px]' : 'rounded-[34px]'
            } pointer-events-none z-50`} />
            
            {deviceSkin === 'apple' ? (
              /* Apple iPhone pill Notch - Dynamic Island style */
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-50 border border-zinc-800/10 flex items-center justify-between px-3 select-none">
                <div className="w-1.5 h-1.5 bg-zinc-900 rounded-full shrink-0" />
                <div className="text-[7.5px] font-mono tracking-widest text-amber-400 font-extrabold animate-pulse uppercase scale-90">SECURE LINK</div>
                <div className="w-2.5 h-1.5 bg-blue-950 rounded-full shrink-0 border border-blue-900/30" />
              </div>
            ) : (
              /* Android Galaxy camera hole punch notch */
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-black rounded-full border border-zinc-800/75 z-50 flex items-center justify-center select-none">
                <div className="w-1 h-1 bg-blue-900/60 rounded-full" />
              </div>
            )}

            {/* Custom OS Device Status Bar */}
            {deviceSkin === 'apple' ? (
              /* iOS Style Status Bar */
              <div className="h-8 bg-zinc-950/90 px-6 flex justify-between items-end pb-1 text-[9.5px] font-black font-sans tracking-wide text-zinc-300 select-none border-b border-zinc-900/5 shrink-0 relative z-40">
                <span className="font-bold">{phoneTime.split(' ')[0]}</span>
                <div className="flex items-center gap-1.5 select-none relative pb-0.5">
                  <span className="text-[8px] font-mono font-bold tracking-tight text-emerald-400">5G</span>
                  {/* Wi-Fi simulation arcs */}
                  <div className="flex items-end gap-0.5 h-2">
                    <div className="w-0.5 h-1 bg-zinc-400 rounded-sm" />
                    <div className="w-0.5 h-1.5 bg-zinc-400 rounded-sm" />
                    <div className="w-0.5 h-2 bg-zinc-400 rounded-sm" />
                    <div className="w-0.5 h-2.5 bg-emerald-400 rounded-sm" />
                  </div>
                  {/* iOS Battery symbol */}
                  <div className="w-5.5 h-3 border border-zinc-500 rounded bg-zinc-950 flex items-center p-0.5 relative">
                    <div className="h-full bg-emerald-500 rounded-xs w-[80%]" />
                    <span className="absolute left-1/2 -translate-x-1/2 text-[6.5px] font-mono font-black scale-90 text-white leading-none">80%</span>
                    <div className="absolute -right-0.5 w-0.5 h-1 bg-zinc-500 rounded-r-xs" />
                  </div>
                </div>
              </div>
            ) : (
              /* Android Style Status Bar */
              <div className="h-7 bg-zinc-950/90 px-5.5 flex justify-between items-center text-[10px] font-bold font-mono tracking-wide text-zinc-400 select-none border-b border-zinc-900/10 shrink-0 relative z-40">
                <span>{phoneTime}</span>
                <div className="flex items-center gap-2 select-none">
                  <span className="text-[8px] text-zinc-500 tracking-normal font-sans font-bold">5G LTE</span>
                  <div className="flex items-end gap-0.5 h-2.5">
                    <div className="w-0.5 h-1 bg-zinc-500 rounded-full" />
                    <div className="w-0.5 h-1.5 bg-zinc-500 rounded-full" />
                    <div className="w-0.5 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  </div>
                  <div className="flex items-center gap-1 border border-emerald-500/40 rounded px-1 py-0.5 text-[8.5px] text-[#10b981] font-black h-5 bg-emerald-950/20">
                    <span>87%</span>
                    <div className="w-1.5 h-2 bg-emerald-500 rounded-xs" />
                  </div>
                </div>
              </div>
            )}

            {/* Scrollable Viewport Frame */}
            <div className={`flex-1 overflow-y-auto overflow-x-hidden bg-stone-950 select-none flex flex-col relative ${
              deviceSkin === 'apple' ? 'rounded-t-[34px]' : 'rounded-t-[14px]'
            }`}>
              {renderMainContent()}
            </div>

            {/* Soft Navigation OS Indicators Bar */}
            {deviceSkin === 'apple' ? (
              /* Apple iOS Swipe pill line home-indicator */
              <div className="h-9 bg-zinc-950 select-none border-t border-zinc-900/30 flex items-center justify-center shrink-0 z-40 relative">
                {/* Simulated Swipe Handle */}
                <button
                  onClick={() => {
                    if (battle) {
                      setBattle(null);
                    } else if (showStartMenu && isGameLaunched) {
                      setIsGameLaunched(false);
                    } else {
                      setShowStartMenu(true);
                    }
                  }}
                  className="w-32 h-1 bg-zinc-700/80 rounded-full hover:bg-zinc-550 transition cursor-pointer"
                  title="iOS Home Swipe-Line"
                />
                
                {/* Small instructions */}
                <span className="absolute bottom-1.5 text-[6.5px] font-mono text-zinc-650 tracking-widest font-black uppercase pointer-events-none scale-90">
                  Tap line to retreat / return home
                </span>
              </div>
            ) : (
              /* Android Soft nav keys */
              <div className="h-10 bg-black/95 select-none border-t border-zinc-900/80 flex justify-around items-center shrink-0 z-40">
                <button
                  onClick={() => {
                    if (battle) {
                      setBattle(null);
                    } else if (showStartMenu && isGameLaunched) {
                      setIsGameLaunched(false);
                    } else {
                      setShowStartMenu(true);
                    }
                  }}
                  className="w-12 h-10 flex items-center justify-center opacity-60 hover:opacity-100 transition active:scale-75 cursor-pointer"
                  title="Android Back"
                >
                  <span className="text-zinc-500 text-xs">◀</span>
                </button>
                <button
                  onClick={() => {
                    setBattle(null);
                    if (showStartMenu && isGameLaunched) {
                      setIsGameLaunched(false);
                    } else {
                      setShowStartMenu(true);
                    }
                  }}
                  className="w-12 h-10 flex items-center justify-center opacity-60 hover:opacity-100 transition active:scale-75 cursor-pointer"
                  title="Android Home"
                >
                  <span className="text-zinc-450 text-sm">●</span>
                </button>
                <button
                  onClick={() => {
                    setShowStartMenu(false);
                    setActiveTab('stats');
                  }}
                  className="w-12 h-10 flex items-center justify-center opacity-60 hover:opacity-100 transition active:scale-75 cursor-pointer"
                  title="Android Apps/Stats"
                >
                  <span className="text-zinc-500 text-xs">■</span>
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 max-w-7xl mx-auto w-full px-4">
          {renderMainContent()}
        </div>
      )}

      {/* Floating active game notifications portal */}
      <AnimatePresence>
        {activeAlert && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-14 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
          >
            <div className={`px-4 py-2 rounded-full border text-xs font-mono font-bold shadow-2xl flex items-center gap-2 uppercase tracking-wide ${
              activeAlert.type === 'success'
                ? 'bg-emerald-950 text-emerald-400 border-emerald-500/40 shadow-emerald-500/10'
                : activeAlert.type === 'damage'
                ? 'bg-red-950 text-red-400 border-red-500/40 shadow-red-500/10'
                : 'bg-zinc-900 text-zinc-250 border-zinc-850 shadow'
            }`}>
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {activeAlert.message}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Manual black hint targeted modal overlay portal */}
      {hintTargetSlot !== null && battle && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-850 max-w-sm rounded-[24px] p-6 text-center shadow-2xl">
            <Eye className="w-10 h-10 text-amber-400 mx-auto mb-3 animate-pulse" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-155 mb-1 font-mono">Target Obsidian Hint</h3>
            <p className="text-xs text-zinc-400 mb-5">
              Deducted 1 Hint Charge. Choose which slot of the secret combination code you want to instantly reveal:
            </p>
            <div className="flex justify-center gap-3 mb-5">
              {Array(battle.currentBoss.orbsMax).fill(null).map((_, index) => (
                <button
                  key={index}
                  onClick={() => confirmBlackHintTarget(index)}
                  className="w-12 h-12 bg-zinc-950 border border-zinc-808 hover:border-amber-500 text-sm font-bold rounded-xl hover:text-amber-400 cursor-pointer transition active:scale-90"
                >
                  0{index + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => setHintTargetSlot(null)}
              className="px-5 py-2 bg-zinc-800 hover:bg-zinc-750 text-xs font-bold rounded-lg text-zinc-450 hover:text-zinc-200 transition cursor-pointer"
            >
              Cancel Reveal
            </button>
          </div>
        </div>
      )}

      {/* Embedded Rulebook overlay dialog portal */}
      <AnimatePresence>
        {showRulesOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-zinc-950 border border-zinc-900 rounded-[24px] p-6 text-left max-w-xl w-full max-h-[80vh] overflow-y-auto relative shadow-2xl space-y-4"
            >
              <button 
                onClick={() => setShowRulesOverlay(false)}
                className="absolute top-4 right-4 text-zinc-550 hover:text-white text-lg font-bold cursor-pointer transition"
              >
                ✕
              </button>
              <GameRules />
              <div className="text-center pt-2">
                <button
                  onClick={() => setShowRulesOverlay(false)}
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-400 hover:brightness-110 text-black text-xs font-bold uppercase rounded-lg transition shrink-0 cursor-pointer"
                >
                  Close OrbMaster Codex
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rewards post-game modal with spring animations portal */}
      <AnimatePresence>
        {endGameModal && (
          <RewardModal
            reward={endGameModal}
            onClose={() => setEndGameModal(null)}
            onRetry={() => {
              setEndGameModal(null);
              startNewBattle(currentBossIndex);
            }}
            onGoToForge={() => {
              setEndGameModal(null);
              setActiveTab('forge');
            }}
            onNextStage={() => {
              setEndGameModal(null);
              const nextIdx = Math.min(9, currentBossIndex + 1);
              setCurrentBossIndex(nextIdx);
              startNewBattle(nextIdx);
            }}
            hasNextStage={currentBossIndex < 9}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
