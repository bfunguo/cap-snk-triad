import React, { useState } from 'react';
import { ALL_CARDS, CARD_MAP } from '../data/cards';
import { Card, Series } from '../types/game';
import { CardView } from './CardView';
import { TradeRewardModal } from './TradeRewardModal';
import { getOwnedCardIds, tradeCards } from '../utils/storage';
import { audio } from '../utils/audio';
import { ArrowLeft, Repeat, Search, X, Sparkles, AlertCircle, Info, Plus } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CardCollectionProps {
  onBackToMenu: () => void;
  onRefreshOwned: () => void;
}

export const CardCollection: React.FC<CardCollectionProps> = ({
  onBackToMenu,
  onRefreshOwned,
}) => {
  const [ownedIds, setOwnedIds] = useState<string[]>(() => getOwnedCardIds());
  const [selectedSeries, setSelectedSeries] = useState<string>('all');
  const [showOnlyCollected, setShowOnlyCollected] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [inspectedCard, setInspectedCard] = useState<Card | null>(null);

  // Trade Modal State
  const [isTradeModalOpen, setIsTradeModalOpen] = useState<boolean>(false);
  const [tradeSelection, setTradeSelection] = useState<string[]>([]);
  const [tradeReward, setTradeReward] = useState<Card | null>(null);
  const [tradedCardsPair, setTradedCardsPair] = useState<[Card, Card] | null>(null);
  const [tradeError, setTradeError] = useState<string | null>(null);

  const totalCards = ALL_CARDS.length;
  const ownedCount = ownedIds.length;
  const completionPercentage = Math.round((ownedCount / totalCards) * 100);

  const ownedSet = new Set(ownedIds);

  const filteredCards = ALL_CARDS.filter((card) => {
    if (selectedSeries !== 'all' && card.series !== selectedSeries) return false;
    if (showOnlyCollected && !ownedSet.has(card.id)) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        card.name.toLowerCase().includes(q) ||
        card.fightingStyle.toLowerCase().includes(q) ||
        card.earliestGame.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCardClick = (card: Card) => {
    audio.playCardSelect();
    setInspectedCard(card);
  };

  const handleTradeCardToggle = (cardId: string) => {
    audio.playCardSelect();
    if (tradeSelection.includes(cardId)) {
      setTradeSelection(tradeSelection.filter((id) => id !== cardId));
    } else {
      if (tradeSelection.length < 2) {
        setTradeSelection([...tradeSelection, cardId]);
      }
    }
    setTradeError(null);
  };

  const executeTrade = () => {
    if (tradeSelection.length !== 2) return;
    const card1 = CARD_MAP.get(tradeSelection[0]);
    const card2 = CARD_MAP.get(tradeSelection[1]);
    if (!card1 || !card2) return;

    const res = tradeCards(tradeSelection[0], tradeSelection[1]);
    if (res.success && res.rewardedCard) {
      setTradedCardsPair([card1, card2]);
      setTradeReward(res.rewardedCard);
      // Close the selection modal so the animated TradeRewardModal takes center stage!
      setIsTradeModalOpen(false);
      setTradeSelection([]);

      const updated = getOwnedCardIds();
      setOwnedIds(updated);
      onRefreshOwned();
    } else {
      setTradeError(res.error || 'Failed to complete trade.');
    }
  };

  const closeTradeModal = () => {
    setIsTradeModalOpen(false);
    setTradeSelection([]);
    setTradeError(null);
  };

  const closeTradeRewardModal = () => {
    setTradeReward(null);
    setTradedCardsPair(null);
  };

  const handleTradeAgain = () => {
    setTradeReward(null);
    setTradedCardsPair(null);
    setIsTradeModalOpen(true);
    setTradeSelection([]);
    setTradeError(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:py-10">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-800">
        <div className="flex items-center gap-4">
          <button
            onClick={onBackToMenu}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Main Menu</span>
          </button>
          <div>
            <h1 className="font-arcade text-3xl md:text-4xl font-bold text-amber-400 tracking-wider">
              FIGHTER CARD ARCHIVE
            </h1>
            <p className="text-xs text-slate-400">
              {ownedCount} of {totalCards} Fighters Unlocked ({completionPercentage}%)
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              audio.playCardSelect();
              setIsTradeModalOpen(true);
            }}
            className="py-2.5 px-4 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/40 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-sm"
          >
            <Repeat className="w-4 h-4" />
            <span>Card Exchange (Trade 2 for 1)</span>
          </button>
        </div>
      </div>

      {/* Collection Progress Bar */}
      <div className="mb-6 p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1 flex-1 max-w-md">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300">Roster Completion</span>
            <span className="font-mono text-amber-400 font-bold">{completionPercentage}%</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-500 to-sky-400 transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-400 font-mono">
          <div>Owned: <span className="text-emerald-400 font-bold">{ownedCount}</span></div>
          <div>Unowned: <span className="text-slate-500 font-bold">{totalCards - ownedCount}</span></div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-6">
        {/* Series Filter Tabs (Two lines / Wrap instead of scroll) */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-900 rounded-xl border border-slate-800 text-xs flex-1">
          {[
            { id: 'all', label: 'All Series' },
            { id: 'Super Street Fighter', label: 'Super SF' },
            { id: 'Street Fighter Alpha 3', label: 'Alpha 3' },
            { id: 'Street Fighter III', label: 'SF III' },
            { id: "The King of Fighters '96", label: "KOF '96" },
            { id: "The King of Fighters '97", label: "KOF '97" },
            { id: 'The King of Fighters 2001', label: 'KOF 2001' },
            { id: 'Fatal Fury Special', label: 'Fatal Fury' },
            { id: 'Samurai Shodown', label: 'Samurai Shodown' },
            { id: 'The Last Blade', label: 'Last Blade' },
            { id: 'Garou: Mark of the Wolves', label: 'Mark of the Wolves' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                audio.playCardSelect();
                setSelectedSeries(tab.id);
              }}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                selectedSeries === tab.id
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
          <label className="flex items-center gap-2 px-3 py-1.5 cursor-pointer text-slate-300 hover:text-white">
            <input
              type="checkbox"
              checked={showOnlyCollected}
              onChange={(e) => setShowOnlyCollected(e.target.checked)}
              className="rounded border-slate-700 bg-slate-950 text-amber-400 focus:ring-amber-500"
            />
            <span className="text-xs font-medium">Collected</span>
          </label>
        </div>

        {/* Search Input */}
        <div className="relative w-full lg:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search fighter, style, game..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
        {filteredCards.map((card) => {
          const isOwned = ownedSet.has(card.id);

          if (isOwned) {
            return (
              <div
                key={card.id}
                onClick={() => handleCardClick(card)}
                className="cursor-pointer group flex flex-col items-center"
              >
                <CardView
                  card={card}
                  size="md"
                  className="hover:scale-105 transition-transform"
                />
                <span className="text-[11px] text-slate-300 font-semibold mt-1.5 group-hover:text-amber-400 truncate max-w-full">
                  {card.name}
                </span>
              </div>
            );
          }

          // Unowned Mystery Card
          return (
            <div
              key={card.id}
              className="flex flex-col items-center select-none opacity-40 hover:opacity-60 transition-opacity"
            >
              <div className="w-28 h-36 md:w-32 md:h-44 rounded-lg border-2 border-dashed border-slate-800 bg-slate-950 flex flex-col items-center justify-center p-2 text-center">
                <span className="font-arcade text-3xl font-bold text-slate-700">?</span>
                <span className="text-[8px] text-slate-600 font-mono mt-1 uppercase">Undiscovered</span>
              </div>
              <span className="text-[10px] text-slate-600 mt-1 font-mono">Locked</span>
            </div>
          );
        })}
      </div>

      {/* Card Inspector Modal */}
      {inspectedCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <div className="bg-slate-900 border-2 border-slate-700 rounded-2xl p-6 max-w-md w-full relative shadow-2xl space-y-4">
            <button
              onClick={() => setInspectedCard(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-100 p-1 rounded-lg bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center">
              <CardView card={inspectedCard} size="lg" />
            </div>

            <div className="space-y-3 pt-2">
              <div className="text-center">
                <h2 className="font-arcade text-3xl font-bold text-slate-100">
                  {inspectedCard.name}
                </h2>
                <p className="text-xs text-amber-400 font-semibold">{inspectedCard.title}</p>
                <p className="text-xs text-slate-400 italic mt-1">"{inspectedCard.quote}"</p>
              </div>

              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Origin Game:</span>
                  <span className="text-slate-200 font-medium">{inspectedCard.earliestGame}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Series Category:</span>
                  <span className="text-slate-200 font-medium">{inspectedCard.series}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Fighting Style:</span>
                  <span className="text-slate-200 font-medium">{inspectedCard.fightingStyle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Directional Power:</span>
                  <span className="text-amber-400 font-mono font-bold">
                    ▲ {inspectedCard.values.top} · ▶ {inspectedCard.values.right} · ▼ {inspectedCard.values.bottom} · ◀ {inspectedCard.values.left}
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed">
                {inspectedCard.bio}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Trade Modal */}
      {isTradeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4">
          <div className="bg-slate-900 border-2 border-slate-700 rounded-2xl p-6 max-w-xl w-full relative shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={closeTradeModal}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-100 p-1 rounded-lg bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <Repeat className="w-5 h-5 text-amber-400" />
              <h2 className="font-arcade text-3xl font-bold text-amber-400 tracking-wide">
                CARD EXCHANGE STATION
              </h2>
            </div>

            <p className="text-xs text-slate-400 mb-4">
              Sacrifice 2 duplicate/owned fighters to recruit 1 random fighter you do not currently own.
            </p>

            <div className="space-y-4">
              {/* 2 Sacrifice Slots & Trade Preview */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between gap-2">
                {/* Slot 1 */}
                <div className="flex-1 flex flex-col items-center">
                  {tradeSelection[0] && CARD_MAP.get(tradeSelection[0]) ? (
                    <div
                      className="relative group cursor-pointer"
                      onClick={() => handleTradeCardToggle(tradeSelection[0])}
                    >
                      <CardView card={CARD_MAP.get(tradeSelection[0])} size="sm" />
                      <button className="absolute -top-1.5 -right-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-full p-0.5 shadow cursor-pointer">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-20 h-28 rounded-xl border-2 border-dashed border-slate-700 bg-slate-900/60 flex flex-col items-center justify-center p-2 text-center text-slate-500">
                      <Plus className="w-5 h-5 mb-1 text-slate-500" />
                      <span className="text-[10px] font-mono leading-tight">Fighter 1</span>
                    </div>
                  )}
                  <span className="text-[10px] text-slate-400 mt-1 font-mono truncate max-w-[80px]">
                    {(tradeSelection[0] && CARD_MAP.get(tradeSelection[0])?.name) || 'Slot 1'}
                  </span>
                </div>

                {/* Transfer Icon */}
                <div className="flex flex-col items-center justify-center px-1">
                  <div className="w-8 h-8 rounded-full bg-slate-900 border border-amber-400/40 flex items-center justify-center text-amber-400 shadow">
                    <Repeat className="w-4 h-4" />
                  </div>
                </div>

                {/* Slot 2 */}
                <div className="flex-1 flex flex-col items-center">
                  {tradeSelection[1] && CARD_MAP.get(tradeSelection[1]) ? (
                    <div
                      className="relative group cursor-pointer"
                      onClick={() => handleTradeCardToggle(tradeSelection[1])}
                    >
                      <CardView card={CARD_MAP.get(tradeSelection[1])} size="sm" />
                      <button className="absolute -top-1.5 -right-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-full p-0.5 shadow cursor-pointer">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-20 h-28 rounded-xl border-2 border-dashed border-slate-700 bg-slate-900/60 flex flex-col items-center justify-center p-2 text-center text-slate-500">
                      <Plus className="w-5 h-5 mb-1 text-slate-500" />
                      <span className="text-[10px] font-mono leading-tight">Fighter 2</span>
                    </div>
                  )}
                  <span className="text-[10px] text-slate-400 mt-1 font-mono truncate max-w-[80px]">
                    {(tradeSelection[1] && CARD_MAP.get(tradeSelection[1])?.name) || 'Slot 2'}
                  </span>
                </div>

                {/* Equal / Recruit Arrow */}
                <div className="text-slate-600 font-arcade text-2xl font-bold px-1">➜</div>

                {/* Target Reward Slot */}
                <div className="flex-1 flex flex-col items-center">
                  <div className="w-20 h-28 rounded-xl border-2 border-dashed border-amber-400/60 bg-gradient-to-br from-amber-500/10 via-slate-900/60 to-cyan-500/10 flex flex-col items-center justify-center p-2 text-center shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                    <Sparkles className="w-5 h-5 text-amber-400 mb-1 animate-pulse" />
                    <span className="text-[10px] text-amber-300 font-arcade font-bold leading-tight uppercase">
                      NEW CARD
                    </span>
                  </div>
                  <span className="text-[10px] text-amber-400/80 mt-1 font-mono">Guaranteed</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-300 font-semibold">
                  Select 2 Fighters to Trade:{' '}
                  <span className={tradeSelection.length === 2 ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                    {tradeSelection.length}/2 Selected
                  </span>
                </span>
                {tradeSelection.length > 0 && (
                  <button
                    onClick={() => {
                      audio.playCardSelect();
                      setTradeSelection([]);
                    }}
                    className="text-rose-400 hover:underline text-[11px] cursor-pointer"
                  >
                    Clear Selection
                  </button>
                )}
              </div>

              {tradeError && (
                <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{tradeError}</span>
                </div>
              )}

              {/* Grid of Owned Cards for Trade Selection */}
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 max-h-60 overflow-y-auto p-2 bg-slate-950/50 rounded-xl border border-slate-800">
                {ownedIds.map((cardId) => {
                  const card = CARD_MAP.get(cardId);
                  if (!card) return null;
                  const isSelected = tradeSelection.includes(cardId);

                  return (
                    <div
                      key={card.id}
                      onClick={() => handleTradeCardToggle(card.id)}
                      className={`cursor-pointer flex flex-col items-center p-1 rounded-lg border transition-all ${
                        isSelected
                          ? 'border-amber-400 bg-amber-500/20 scale-105 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                          : 'border-transparent hover:border-slate-700 hover:bg-slate-800/40'
                      }`}
                    >
                      <CardView card={card} size="sm" isSelected={isSelected} />
                      <span className="text-[9px] text-slate-300 font-mono mt-1 truncate max-w-full">
                        {isSelected ? '✓ Selected' : card.name}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="text-[11px] text-slate-500 flex items-center gap-1">
                  <Info className="w-3.5 h-3.5 text-amber-400" />
                  <span>Trade in 2 fighters to unlock 1 guaranteed new fighter.</span>
                </div>

                <button
                  onClick={executeTrade}
                  disabled={tradeSelection.length !== 2}
                  className={`py-2.5 px-6 rounded-xl font-bold flex items-center gap-2 uppercase tracking-wider text-xs transition-all ${
                    tradeSelection.length === 2
                      ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 cursor-pointer shadow-[0_0_18px_rgba(245,158,11,0.4)] animate-pulse'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  }`}
                >
                  <Repeat className="w-4 h-4" />
                  <span>CONFIRM TRADE</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Animated New Card Reveal & Pop-up Modal */}
      {tradeReward && (
        <TradeRewardModal
          rewardCard={tradeReward}
          tradedCards={tradedCardsPair}
          onClose={closeTradeRewardModal}
          onTradeAgain={handleTradeAgain}
          canTradeAgain={ownedIds.length >= 8}
        />
      )}
    </div>
  );
};
