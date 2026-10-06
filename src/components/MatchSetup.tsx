import React, { useState } from 'react';
import { Card, Difficulty, HandMode } from '../types/game';
import { CardView } from './CardView';
import { audio } from '../utils/audio';
import { getSavedCustomHandCardIds, saveCustomHandCardIds, getSavedHandMode, saveHandMode } from '../utils/storage';
import { ArrowLeft, Swords, Shuffle, Layers, ShieldCheck, Flame, Zap, Trophy, BookmarkCheck } from 'lucide-react';

interface MatchSetupProps {
  ownedCards: Card[];
  allowedFaction: 'Capcom' | 'SNK' | 'Both';
  onAllowedFactionChange: (faction: 'Capcom' | 'SNK' | 'Both') => void;
  onStartMatch: (
    difficulty: Difficulty,
    handMode: HandMode,
    customHand?: Card[]
  ) => void;
  onBackToMenu: () => void;
}

const CapcomLogo = () => (
  <span className="font-sans italic tracking-tighter font-black text-blue-900 bg-yellow-400 border border-blue-700 px-2 py-0.5 rounded-sm text-[10px] select-none shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
    CAPCOM
  </span>
);

const SnkLogo = () => (
  <span className="font-sans italic tracking-wider font-extrabold text-white bg-gradient-to-r from-blue-700 to-sky-600 px-2.5 py-0.5 rounded-sm text-[10px] select-none shadow-[0_1px_2px_rgba(0,0,0,0.3)] border border-blue-500/30">
    SNK
  </span>
);

const BothLogo = () => (
  <div className="flex items-center gap-1.5">
    <CapcomLogo />
    <span className="text-[10px] font-arcade font-bold text-slate-400">VS</span>
    <SnkLogo />
  </div>
);

export const MatchSetup: React.FC<MatchSetupProps> = ({
  ownedCards,
  allowedFaction,
  onAllowedFactionChange,
  onStartMatch,
  onBackToMenu,
}) => {
  const [difficulty, setDifficulty] = useState<Difficulty>('Medium');
  const [handMode, setHandMode] = useState<HandMode>(() => getSavedHandMode());
  const [selectedCards, setSelectedCards] = useState<Card[]>(() => {
    const savedIds = getSavedCustomHandCardIds();
    if (savedIds.length > 0) {
      const ownedMap = new Map(ownedCards.map((c) => [c.id, c]));
      return savedIds
        .map((id) => ownedMap.get(id))
        .filter((c): c is Card => {
          if (!c) return false;
          const company = c.series.toLowerCase().includes('street fighter') ? 'Capcom' : 'SNK';
          return allowedFaction === 'Both' || company === allowedFaction;
        })
        .slice(0, 7);
    }
    return [];
  });
  const [filterSeries, setFilterSeries] = useState<string>('all');

  const filteredOwnedCards = ownedCards.filter((card) => {
    const company = card.series.toLowerCase().includes('street fighter') ? 'Capcom' : 'SNK';
    if (allowedFaction !== 'Both' && company !== allowedFaction) return false;
    if (filterSeries === 'all') return true;
    return card.series === filterSeries;
  });

  const handleFactionChange = (faction: 'Capcom' | 'SNK' | 'Both') => {
    audio.playCardSelect();
    onAllowedFactionChange(faction);
    const nextCards = selectedCards.filter((card) => {
      const company = card.series.toLowerCase().includes('street fighter') ? 'Capcom' : 'SNK';
      return faction === 'Both' || company === faction;
    });
    setSelectedCards(nextCards);
    saveCustomHandCardIds(nextCards.map((c) => c.id));
  };

  const handleSelectHandMode = (mode: HandMode) => {
    audio.playCardSelect();
    setHandMode(mode);
    saveHandMode(mode);
    if (mode === 'Build' && selectedCards.length === 0) {
      const savedIds = getSavedCustomHandCardIds();
      if (savedIds.length > 0) {
        const ownedMap = new Map(ownedCards.map((c) => [c.id, c]));
        const restored = savedIds
          .map((id) => ownedMap.get(id))
          .filter((c): c is Card => {
            if (!c) return false;
            const company = c.series.toLowerCase().includes('street fighter') ? 'Capcom' : 'SNK';
            return allowedFaction === 'Both' || company === allowedFaction;
          })
          .slice(0, 7);
        if (restored.length > 0) {
          setSelectedCards(restored);
        }
      }
    }
  };

  const toggleCardSelection = (card: Card) => {
    audio.playCardSelect();
    const isAlreadySelected = selectedCards.some((c) => c.id === card.id);
    let nextCards: Card[];
    if (isAlreadySelected) {
      nextCards = selectedCards.filter((c) => c.id !== card.id);
    } else {
      if (selectedCards.length < 7) {
        nextCards = [...selectedCards, card];
      } else {
        return;
      }
    }
    setSelectedCards(nextCards);
    saveCustomHandCardIds(nextCards.map((c) => c.id));
  };

  const handleClearSelected = () => {
    setSelectedCards([]);
    saveCustomHandCardIds([]);
  };

  const handleStart = () => {
    audio.playCoinToss();
    saveHandMode(handMode);
    if (handMode === 'Random') {
      onStartMatch(difficulty, 'Random');
    } else {
      saveCustomHandCardIds(selectedCards.map((c) => c.id));
      onStartMatch(difficulty, 'Build', selectedCards);
    }
  };

  const isStartDisabled =
    handMode === 'Build' && (selectedCards.length < 5 || selectedCards.length > 7);

  const difficultyOptions: { id: Difficulty; title: string; desc: string; icon: React.ReactNode; color: string }[] = [
    {
      id: 'Easy',
      title: 'Easy',
      desc: 'Novice sparring partner. Casual moves with occasional captures.',
      icon: <Zap className="w-5 h-5" />,
      color: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/20',
    },
    {
      id: 'Medium',
      title: 'Medium',
      desc: 'Arcade contender. Actively seeks immediate captures.',
      icon: <Flame className="w-5 h-5" />,
      color: 'text-amber-400 border-amber-500/40 bg-amber-950/20',
    },
    {
      id: 'Hard',
      title: 'Hard',
      desc: 'Tournament veteran. Strategic edge placement & defense.',
      icon: <ShieldCheck className="w-5 h-5" />,
      color: 'text-orange-400 border-orange-500/40 bg-orange-950/20',
    },
    {
      id: 'Expert',
      title: 'Expert',
      desc: 'Grand Master. Lookahead counter-attack simulation.',
      icon: <Trophy className="w-5 h-5" />,
      color: 'text-rose-400 border-rose-500/40 bg-rose-950/20',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-10">
      {/* Top Bar with Back Button */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800">
        <button
          onClick={onBackToMenu}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Main Menu</span>
        </button>
        <h1 className="font-arcade text-3xl md:text-4xl font-bold text-amber-400 tracking-wider">
          MATCH CONFIGURATION
        </h1>
        <div className="w-20" />
      </div>

      <div className="space-y-8">
        {/* Section 1: Choose Difficulty */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
            1. Select CPU Difficulty
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {difficultyOptions.map((opt) => {
              const active = difficulty === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => {
                    audio.playCardSelect();
                    setDifficulty(opt.id);
                  }}
                  className={`p-3.5 rounded-xl border-2 text-left transition-all relative w-[80%] mx-auto ${
                    active
                      ? `${opt.color} ring-2 ring-amber-400 shadow-lg scale-[1.02]`
                      : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-arcade text-xl font-bold tracking-wide uppercase">
                      {opt.title}
                    </span>
                    <span className={active ? opt.color.split(' ')[0] : 'text-slate-500'}>
                      {opt.icon}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">
                    {opt.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: Choose Allowed Factions */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
            2. Select Allowed Character Factions
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => handleFactionChange('Both')}
              className={`p-4 rounded-xl border-2 text-left flex flex-col justify-between h-28 transition-all cursor-pointer ${
                allowedFaction === 'Both'
                  ? 'border-amber-400 bg-amber-500/10 ring-2 ring-amber-400/50 shadow-lg scale-[1.02]'
                  : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-arcade text-base font-bold tracking-wide">BOTH FACTIONS</span>
                <BothLogo />
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                All fighters from Capcom and SNK rosters are fully permitted to participate in combat.
              </p>
            </button>

            <button
              onClick={() => handleFactionChange('Capcom')}
              className={`p-4 rounded-xl border-2 text-left flex flex-col justify-between h-28 transition-all cursor-pointer ${
                allowedFaction === 'Capcom'
                  ? 'border-yellow-400 bg-yellow-500/10 ring-2 ring-yellow-400/50 shadow-lg scale-[1.02]'
                  : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-arcade text-base font-bold tracking-wide text-yellow-400">CAPCOM ONLY</span>
                <CapcomLogo />
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Combat matches are strictly limited to Capcom universe characters (e.g., Street Fighter roster).
              </p>
            </button>

            <button
              onClick={() => handleFactionChange('SNK')}
              className={`p-4 rounded-xl border-2 text-left flex flex-col justify-between h-28 transition-all cursor-pointer ${
                allowedFaction === 'SNK'
                  ? 'border-blue-400 bg-blue-500/10 ring-2 ring-blue-400/50 shadow-lg scale-[1.02]'
                  : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-arcade text-base font-bold tracking-wide text-sky-400">SNK ONLY</span>
                <SnkLogo />
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Combat matches are strictly limited to SNK universe characters (e.g., KOF, Samurai Shodown).
              </p>
            </button>
          </div>
        </div>

        {/* Section 3: Choose Hand Type */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
            3. Choose Hand Formation
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => handleSelectHandMode('Random')}
              className={`p-4 rounded-xl border-2 text-left flex items-start gap-4 transition-all cursor-pointer ${
                handMode === 'Random'
                  ? 'border-amber-400 bg-amber-500/10 ring-2 ring-amber-400/50 shadow-lg'
                  : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
              }`}
            >
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shrink-0">
                <Shuffle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-arcade text-2xl font-bold text-slate-100 tracking-wide">
                  RANDOM HAND
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Generates 5 unique cards randomly drawn from your collection of {ownedCards.length} owned fighters.
                </p>
              </div>
            </button>

            <button
              onClick={() => handleSelectHandMode('Build')}
              className={`p-4 rounded-xl border-2 text-left flex items-start gap-4 transition-all cursor-pointer ${
                handMode === 'Build'
                  ? 'border-amber-400 bg-amber-500/10 ring-2 ring-amber-400/50 shadow-lg'
                  : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
              }`}
            >
              <div className="w-10 h-10 rounded-lg bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-400 shrink-0">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-arcade text-2xl font-bold text-slate-100 tracking-wide">
                    BUILD HAND (5–7 CARDS)
                  </h3>
                  {selectedCards.length >= 5 && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/40 font-mono">
                      <BookmarkCheck className="w-3 h-3" />
                      Saved
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Handpick 5 to 7 specific fighters from your collection. Your custom team is automatically remembered for next matches!
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Section 4: If Build Hand is active, show card picker */}
        {handMode === 'Build' && (
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <span>Select 5 to 7 Unique Owned Cards</span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/40 font-mono">
                    ✓ Hand Auto-Saved
                  </span>
                </div>
                <div className="font-arcade text-xl tracking-wide text-amber-400">
                  SELECTED: {selectedCards.length} / 7{' '}
                  <span className="text-xs text-slate-400 font-sans">
                    ({selectedCards.length < 5 ? `Need ${5 - selectedCards.length} more` : 'Legal hand'})
                  </span>
                </div>
              </div>

              {/* Series Filter Tabs */}
              <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-950 rounded-lg border border-slate-800 text-xs justify-center">
                {[
                  { key: 'all', label: 'All' },
                  { key: 'Super Street Fighter', label: 'SSF' },
                  { key: 'Street Fighter Alpha 3', label: 'Alpha 3' },
                  { key: 'Street Fighter III', label: 'SF III' },
                  { key: "The King of Fighters '96", label: "KOF '96" },
                  { key: "The King of Fighters '97", label: "KOF '97" },
                  { key: 'The King of Fighters 2001', label: 'KOF 2001' },
                  { key: 'Fatal Fury Special', label: 'Fatal Fury' },
                  { key: 'Samurai Shodown', label: 'Samurai Shodown' },
                  { key: 'The Last Blade', label: 'Last Blade' },
                  { key: 'Garou: Mark of the Wolves', label: 'Mark of the Wolves' },
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setFilterSeries(key)}
                    className={`px-2.5 py-1 rounded font-medium whitespace-nowrap transition-colors ${
                      filterSeries === key
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Cards Bar */}
            {selectedCards.length > 0 && (
              <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/80">
                <div className="text-[11px] text-slate-400 mb-1.5 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span>Current Hand Preview:</span>
                    <span className="text-[10px] text-emerald-400 font-mono">(Saved for next match)</span>
                  </div>
                  <button
                    onClick={handleClearSelected}
                    className="text-rose-400 hover:underline text-[10px] cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {selectedCards.map((card) => (
                    <div
                      key={card.id}
                      onClick={() => toggleCardSelection(card)}
                      className="cursor-pointer shrink-0"
                      title="Click to remove"
                    >
                      <CardView card={card} size="sm" isSelected={true} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Grid of Owned Cards to Pick From */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 max-h-96 overflow-y-auto pr-1">
              {filteredOwnedCards.map((card) => {
                const isSelected = selectedCards.some((c) => c.id === card.id);
                return (
                  <div
                    key={card.id}
                    onClick={() => toggleCardSelection(card)}
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <CardView
                      card={card}
                      size="sm"
                      isSelected={isSelected}
                      className={isSelected ? 'scale-105' : 'opacity-85 hover:opacity-100'}
                    />
                    <span className="text-[10px] text-slate-400 mt-1 font-mono truncate max-w-full">
                      {isSelected ? '✓ Selected' : '+ Select'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Start Button */}
        <div className="pt-4 flex justify-end">
          <button
            onClick={handleStart}
            disabled={isStartDisabled}
            className={`py-3.5 px-8 rounded-xl font-bold flex items-center gap-3 transition-all text-slate-950 ${
              isStartDisabled
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                : 'bg-amber-400 hover:bg-amber-300 shadow-[0_0_25px_rgba(251,191,36,0.4)] active:scale-98 cursor-pointer'
            }`}
          >
            <Swords className="w-6 h-6" />
            <span className="font-arcade text-2xl tracking-wider uppercase">START BATTLE</span>
          </button>
        </div>
      </div>
    </div>
  );
};
