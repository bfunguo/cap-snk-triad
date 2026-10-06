import React, { useState } from 'react';
import { GameStatistics } from '../types/game';
import { getOwnedCardIds, resetGameStats } from '../utils/storage';
import { ALL_CARDS } from '../data/cards';
import { audio } from '../utils/audio';
import { ArrowLeft, Trophy, Flame, RotateCcw, Award, CheckCircle2, Swords } from 'lucide-react';

interface StatisticsScreenProps {
  stats: GameStatistics;
  onBackToMenu: () => void;
  onStatsReset: () => void;
  onPlayMatch: () => void;
}

export const StatisticsScreen: React.FC<StatisticsScreenProps> = ({
  stats,
  onBackToMenu,
  onStatsReset,
  onPlayMatch,
}) => {
  const [showConfirmReset, setShowConfirmReset] = useState<boolean>(false);

  const ownedIds = getOwnedCardIds();
  const totalCards = ALL_CARDS.length;
  const winRate =
    stats.gamesPlayed > 0 ? Math.round((stats.wins / stats.gamesPlayed) * 100) : 0;

  const handleReset = () => {
    audio.playCardSelect();
    resetGameStats();
    setShowConfirmReset(false);
    onStatsReset();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-6 mb-8 border-b border-slate-800">
        <button
          onClick={onBackToMenu}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Main Menu</span>
        </button>
        <h1 className="font-arcade text-3xl md:text-4xl font-bold text-amber-400 tracking-wider">
          ARCADE BATTLE STATS
        </h1>
        <div className="w-20" />
      </div>

      <div className="space-y-8">
        {/* Main Stats Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-center shadow-lg">
            <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">
              Matches Played
            </div>
            <div className="font-arcade text-5xl font-extrabold text-slate-100">
              {stats.gamesPlayed}
            </div>
            <div className="text-[11px] text-slate-400 mt-1 font-mono">Total battles</div>
          </div>

          <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 text-center shadow-lg">
            <div className="text-xs uppercase tracking-wider text-emerald-400 font-semibold mb-1">
              Victories
            </div>
            <div className="font-arcade text-5xl font-extrabold text-emerald-400">
              {stats.wins}
            </div>
            <div className="text-[11px] text-emerald-500/80 mt-1 font-mono">
              {winRate}% Win Rate
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-500/30 text-center shadow-lg">
            <div className="text-xs uppercase tracking-wider text-rose-400 font-semibold mb-1">
              Defeats
            </div>
            <div className="font-arcade text-5xl font-extrabold text-rose-400">
              {stats.losses}
            </div>
            <div className="text-[11px] text-rose-500/80 mt-1 font-mono">
              {stats.gamesPlayed > 0 ? Math.round((stats.losses / stats.gamesPlayed) * 100) : 0}% Defeat Rate
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-center shadow-lg">
            <div className="text-xs uppercase tracking-wider text-amber-400 font-semibold mb-1">
              Draws
            </div>
            <div className="font-arcade text-5xl font-extrabold text-amber-400">
              {stats.draws}
            </div>
            <div className="text-[11px] text-amber-500/80 mt-1 font-mono">
              Stalemates
            </div>
          </div>
        </div>

        {/* Progression & Milestones */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card Collection Completion */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                <h3 className="font-arcade text-2xl font-bold text-slate-100">
                  CARD COLLECTION
                </h3>
              </div>
              <span className="text-xs text-amber-400 font-bold font-mono">
                {ownedIds.length} / {totalCards} Cards
              </span>
            </div>

            <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 to-sky-400"
                style={{ width: `${(ownedIds.length / totalCards) * 100}%` }}
              />
            </div>

            <p className="text-xs text-slate-400">
              Win matches or complete 3-game streaks to unlock the entire 38-fighter roster across Super SF, Alpha 3, and SF III.
            </p>
          </div>

          {/* 3-Game Reward Progress */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                <h3 className="font-arcade text-2xl font-bold text-slate-100">
                  3-MATCH BONUS STREAK
                </h3>
              </div>
              <span className="text-xs text-amber-400 font-bold font-mono">
                {stats.completionStreak} / 3 Complete
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map((step) => {
                const isFinished = stats.completionStreak >= step;
                return (
                  <div
                    key={step}
                    className={`py-3 px-2 rounded-xl border text-center transition-all ${
                      isFinished
                        ? 'border-amber-400 bg-amber-500/20 text-amber-400 font-bold'
                        : 'border-slate-800 bg-slate-950 text-slate-500'
                    }`}
                  >
                    <div className="text-[10px] uppercase font-mono">Game {step}</div>
                    <div className="font-arcade text-xl">
                      {isFinished ? 'DONE ✓' : 'READY'}
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="text-xs text-slate-400">
              Completing 3 consecutive games instantly grants a bonus card reward, regardless of outcome.
            </p>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-800">
          <div>
            {!showConfirmReset ? (
              <button
                onClick={() => setShowConfirmReset(true)}
                className="text-xs text-slate-500 hover:text-rose-400 transition-colors"
              >
                Reset Career Statistics
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs text-rose-400 font-semibold">Confirm Reset?</span>
                <button
                  onClick={handleReset}
                  className="px-2.5 py-1 rounded bg-rose-600 text-white text-xs font-bold hover:bg-rose-500"
                >
                  Yes, Reset
                </button>
                <button
                  onClick={() => setShowConfirmReset(false)}
                  className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 text-xs hover:bg-slate-700"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          <button
            onClick={onPlayMatch}
            className="py-3 px-8 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold flex items-center gap-2 cursor-pointer shadow-lg active:scale-98"
          >
            <Swords className="w-5 h-5" />
            <span className="font-arcade text-xl tracking-wider uppercase">FIGHT A MATCH</span>
          </button>
        </div>
      </div>
    </div>
  );
};
