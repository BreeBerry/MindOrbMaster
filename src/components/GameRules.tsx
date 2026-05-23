import { BookOpen, AlertCircle, HelpCircle, Swords, Zap, Key } from 'lucide-react';

interface GameRulesProps {
  onClose?: () => void;
}

export default function GameRules({ onClose }: GameRulesProps) {
  return (
    <div id="game-rules-modal" className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-white shadow-2xl relative max-w-2xl mx-auto">
      {/* Title */}
      <h3 className="text-lg font-bold tracking-tight mb-4 flex items-center gap-2 text-amber-400">
        <BookOpen className="w-5 h-5 text-amber-400" />
        ORBMASTER CODEX MANUAL
      </h3>

      <div className="space-y-4 max-h-[480px] overflow-y-auto pr-2 text-zinc-300 text-sm leading-relaxed custom-scrollbar">
        {/* Module 1: The Core Mastermind Board */}
        <div className="bg-black/40 p-4 border border-zinc-800 rounded-xl">
          <h4 className="font-semibold text-zinc-200 mb-2 flex items-center gap-1.5 uppercase font-mono text-xs">
            <Key className="w-4 h-4 text-cyan-400" />
            1. Unlocking the Secret Passcode
          </h4>
          <p className="text-zinc-400 text-xs">
            The target Boss guards a hidden passcode combination. Compile your 4-orb or 6-orb guesses in the Transmutation Circle to deduce their configuration within 10 turns.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
            <div className="p-2.5 bg-zinc-950/80 rounded-lg border border-zinc-900">
              <div className="font-bold text-[11px] text-red-500 flex items-center gap-1 uppercase">
                🔴 RED PEG (Perfect Placement)
              </div>
              <p className="text-[11px] text-zinc-400 mt-1">
                An element in your guess has both the **correct color** and lies in the **exact correct position** in the passcode.
              </p>
            </div>
            <div className="p-2.5 bg-zinc-950/80 rounded-lg border border-zinc-900">
              <div className="font-bold text-[11px] text-zinc-100 flex items-center gap-1 uppercase">
                ⚪ WHITE PEG (Color Presence)
              </div>
              <p className="text-[11px] text-zinc-400 mt-1">
                An element in your guess is of a **correct color** that is present in the sequence, but lies in the **wrong slot**.
              </p>
            </div>
          </div>
        </div>

        {/* Module 2: Loot Drop Calculations */}
        <div className="bg-black/40 p-4 border border-zinc-800 rounded-xl">
          <h4 className="font-semibold text-zinc-200 mb-2 flex items-center gap-1.5 uppercase font-mono text-xs">
            <Swords className="w-4 h-4 text-red-400" />
            2. Reward Value Math & Multipliers
          </h4>
          <p className="text-zinc-400 text-xs">
             Your fragment reward count is determined by how quickly you crack the solution. It uses the official Mastermind loot formula:
          </p>
          <div className="bg-zinc-950/70 p-2.5 rounded-lg border border-zinc-900 my-2 font-mono text-center text-xs text-yellow-400">
            Fragments = ((50 - (WinningTurn - 2) * 5) * Orb slots) * Active multiplier
          </div>
          <ul className="list-disc pl-5 mt-2 space-y-1 text-xs text-zinc-400">
            <li>For every turn taken after turn 1, you lose score points (turn 1 and the winning turn do not count against you).</li>
            <li>Multipliers: Activating a **Pink Spell** doubles your loot (2x). Activating a **Teal Spell** triples your loot (3x). Activating both pools them together!</li>
            <li>Fragment Rarity classes determine color odds: Common (Orange, Blue, Green, Silver), Uncommon (Red, Purple, Yellow, Gold), and Rare (Pink, White, Black, Teal).</li>
          </ul>
        </div>

        {/* Module 3: Active Spell Charges */}
        <div className="bg-black/40 p-4 border border-zinc-800 rounded-xl">
          <h4 className="font-semibold text-zinc-200 mb-2 flex items-center gap-1.5 uppercase font-mono text-xs">
            <Zap className="w-4 h-4 text-yellow-400" />
            3. Deploying consumable spell charges
          </h4>
          <p className="text-zinc-400 text-xs">
            Combine your mined Fragments in the **Crucible Forge** to scribe spell scrolls. Deploy them from your active inventory during battle:
          </p>
          <div className="grid grid-cols-2 gap-2 mt-2.5 text-[11px] text-zinc-350 font-mono">
            <div className="p-1 px-2 border border-zinc-900 rounded bg-zinc-950/40">
              🍊 Orange/🍇 Purple/⚪ White: Add +1/+2/+3 guess turns.
            </div>
            <div className="p-1 px-2 border border-zinc-900 rounded bg-zinc-950/40">
              🟥 Red: Reveals color of 1 random hidden slot.
            </div>
            <div className="p-1 px-2 border border-zinc-900 rounded bg-zinc-950/40">
              🌌 Black: Reveals whether a chosen spot is correct.
            </div>
            <div className="p-1 px-2 border border-zinc-900 rounded bg-zinc-950/40">
              🟦 Blue (Submerge): Re-scrambles secret code.
            </div>
            <div className="p-1 px-2 border border-zinc-900 rounded bg-zinc-950/40">
              🟡 Yellow: Negates hostile boss passives entirely.
            </div>
            <div className="p-1 px-2 border border-zinc-900 rounded bg-zinc-950/40">
              🟢 Green: Displays 1 color absent from passcode.
            </div>
          </div>
        </div>

        {/* Tactical Guidance */}
        <div className="p-3.5 bg-amber-950/30 border border-amber-500/20 text-amber-400 rounded-xl text-xs flex gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <div>
            <strong>Tactical Guide:</strong> In Boss 8 (Queen Asabeth), Black Hint Orbs are disabled unless you deploy your Yellow active. In Boss 9 (Elkgore), he scrambles his secret passcode mid-battle. In Boss 10 (Mad Martin), correct matches deduct remaining guess turns! Deploy Yellow first to counter all these constraints!
          </div>
        </div>
      </div>

      {onClose && (
        <button
          onClick={onClose}
          className="mt-5 w-full py-2 bg-zinc-800 hover:bg-zinc-750 text-xs font-bold uppercase tracking-wider text-zinc-300 rounded-lg transition"
        >
          Acknowledge & Close Log
        </button>
      )}
    </div>
  );
}
