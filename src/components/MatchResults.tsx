import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Card, GameStatistics, PlayerOwner } from '../types/game';
import { CardView } from './CardView';
import { audio } from '../utils/audio';
import { Trophy, RotateCcw, Home, Sparkles, Award } from 'lucide-react';

interface MatchResultsProps {
  winner: PlayerOwner | 'draw';
  playerControlled: number;
  cpuControlled: number;
  stats: GameStatistics;
  earnedCard: Card | null;
  streakEarnedCard: Card | null;
  wasStreakRewarded: boolean;
  onPlayNextMatch: () => void;
  onGoToMenu: () => void;
  onGoToCollection: () => void;
}

export const MatchResults: React.FC<MatchResultsProps> = ({
  winner,
  playerControlled,
  cpuControlled,
  stats,
  earnedCard,
  streakEarnedCard,
  wasStreakRewarded,
  onPlayNextMatch,
  onGoToMenu,
  onGoToCollection,
}) => {
  useEffect(() => {
    if (winner === 'player') {
      audio.playVictory();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#38bdf8', '#fbbf24', '#f43f5e', '#a855f7'],
      });
    } else if (winner === 'cpu') {
      audio.playDefeat();
    } else {
      audio.playDraw();
    }
  }, [winner]);

  const isWin = winner === 'player';
  const isLoss = winner === 'cpu';
  const isDraw = winner === 'draw';

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 md:py-12">
      {/* Result Banner */}
      <div className="text-center mb-8">
        <div className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-2">
          MATCH FINISHED
        </div>

        <h1
          className={`font-arcade text-6xl md:text-7xl font-extrabold tracking-wider drop-shadow-lg ${
            isWin
              ? 'text-sky-400 animate-pulse'
              : isLoss
              ? 'text-rose-500'
              : 'text-amber-400'
          }`}
        >
          {isWin ? 'VICTORY!' : isLoss ? 'YOU LOSE' : 'DRAW GAME'}
        </h1>

        {/* Board Ownership Breakdown */}
        <div className="mt-3 inline-flex items-center gap-6 px-6 py-2.5 rounded-full bg-slate-900 border border-slate-800 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-sky-400" />
            <span className="text-slate-400">Player Cards:</span>
            <span className="font-arcade text-2xl font-bold text-sky-400">
              {playerControlled}
            </span>
          </div>

          <span className="text-slate-600 font-bold">vs</span>

          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500" />
            <span className="text-slate-400">CPU Cards:</span>
            <span className="font-arcade text-2xl font-bold text-rose-500">
              {cpuControlled}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Rewards Section */}
        <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="font-arcade text-2xl font-bold text-amber-400 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span>MATCH REWARDS & PROGRESSION</span>
            </h2>
            <div className="text-xs text-slate-400 font-mono">
              Streak: {stats.completionStreak}/3 Completed
            </div>
          </div>

          {/* Victory Card Reward */}
          {earnedCard && (
            <div className="p-4 rounded-xl bg-sky-950/30 border border-sky-500/40 flex flex-col md:flex-row items-center gap-5">
              <div className="shrink-0">
                <CardView card={earnedCard} size="md" />
              </div>
              <div className="text-center md:text-left space-y-1">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-full border border-sky-500/20">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>VICTORY REWARD UNLOCKED</span>
                </div>
                <h3 className="font-arcade text-3xl font-bold text-slate-100 tracking-wide">
                  {earnedCard.name}
                </h3>
                <p className="text-xs text-slate-300 italic">"{earnedCard.quote}"</p>
                <div className="text-xs text-slate-400 font-mono pt-1">
                  Added to your collection! (T:{earnedCard.values.top} R:{earnedCard.values.right} B:{earnedCard.values.bottom} L:{earnedCard.values.left})
                </div>
              </div>
            </div>
          )}

          {/* 3-Game Completion Streak Reward */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  3-Match Participation Streak
                </span>
              </div>
              <span className="text-xs font-bold text-amber-400 font-mono">
                {wasStreakRewarded ? '3 / 3 COMPLETED!' : `${stats.completionStreak} / 3 Completed`}
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden p-0.5 border border-slate-700">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-500"
                style={{
                  width: wasStreakRewarded ? '100%' : `${(stats.completionStreak / 3) * 100}%`,
                }}
              />
            </div>
            <p className="text-[11px] text-slate-400">
              Every 3 completed matches awards a guaranteed bonus fighter, regardless of match outcomes.
            </p>

            {/* If bonus streak card awarded this match */}
            {wasStreakRewarded && streakEarnedCard && (
              <div className="mt-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center gap-4">
                <CardView card={streakEarnedCard} size="sm" />
                <div>
                  <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    STREAK BONUS CLAIMED!
                  </div>
                  <div className="font-arcade text-xl text-slate-100 font-bold">
                    {streakEarnedCard.name}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Earned for completing 3 consecutive games. Streak resets to 0/3.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Updated Statistics Card */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
            Career Record
          </div>
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-500 uppercase">Played</div>
              <div className="font-arcade text-2xl font-bold text-slate-100">
                {stats.gamesPlayed}
              </div>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <div className="text-xs text-emerald-500 uppercase">Wins</div>
              <div className="font-arcade text-2xl font-bold text-emerald-400">
                {stats.wins}
              </div>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <div className="text-xs text-rose-500 uppercase">Losses</div>
              <div className="font-arcade text-2xl font-bold text-rose-400">
                {stats.losses}
              </div>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <div className="text-xs text-amber-500 uppercase">Draws</div>
              <div className="font-arcade text-2xl font-bold text-amber-400">
                {stats.draws}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            onClick={onGoToMenu}
            className="w-full sm:w-auto py-3 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold flex items-center justify-center gap-2 border border-slate-700 transition-colors cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Main Menu</span>
          </button>

          <div className="flex w-full sm:w-auto items-center gap-3">
            <button
              onClick={onGoToCollection}
              className="flex-1 sm:flex-initial py-3 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold border border-slate-700 transition-colors cursor-pointer"
            >
              Collection
            </button>

            <button
              onClick={onPlayNextMatch}
              className="flex-1 sm:flex-initial py-3 px-8 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(251,191,36,0.3)] active:scale-98 cursor-pointer"
            >
              <RotateCcw className="w-5 h-5" />
              <span className="font-arcade text-xl tracking-wider uppercase">PLAY NEXT MATCH</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
