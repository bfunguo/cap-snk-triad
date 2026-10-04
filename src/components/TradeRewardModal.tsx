import React, { useState, useEffect } from 'react';
import { Card } from '../types/game';
import { CardView } from './CardView';
import { audio } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Sparkles, X, Repeat, Check, Zap, Trophy, Shield } from 'lucide-react';

interface TradeRewardModalProps {
  rewardCard: Card;
  tradedCards: [Card, Card] | null;
  onClose: () => void;
  onTradeAgain?: () => void;
  canTradeAgain?: boolean;
}

type AnimationPhase = 'FUSION' | 'REVEAL' | 'PRESENTATION';

export const TradeRewardModal: React.FC<TradeRewardModalProps> = ({
  rewardCard,
  tradedCards,
  onClose,
  onTradeAgain,
  canTradeAgain = false,
}) => {
  const [phase, setPhase] = useState<AnimationPhase>('FUSION');

  useEffect(() => {
    // Play initial fusion audio
    audio.playCardFusion();

    // Timer for Phase 1 (Fusion) -> Phase 2 (3D Card Reveal)
    const t1 = setTimeout(() => {
      setPhase('REVEAL');
      audio.playCardReveal();
      audio.playVictory();

      // First confetti wave
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.55 },
        colors: ['#f59e0b', '#38bdf8', '#ec4899', '#10b981', '#ffffff'],
      });
    }, 1100);

    // Timer for Phase 2 (Reveal) -> Phase 3 (Interactive Presentation Modal)
    const t2 = setTimeout(() => {
      setPhase('PRESENTATION');
      // Extra celebratory burst
      confetti({
        particleCount: 50,
        spread: 90,
        origin: { y: 0.45 },
        colors: ['#facc15', '#f59e0b', '#38bdf8'],
      });
    }, 2400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const skipAnimation = () => {
    audio.playCardSelect();
    setPhase('PRESENTATION');
  };

  const totalPower =
    rewardCard.values.top +
    rewardCard.values.right +
    rewardCard.values.bottom +
    rewardCard.values.left;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-lg p-4 overflow-hidden select-none">
      {/* Background Animated Sunburst Rays during Reveal */}
      {(phase === 'REVEAL' || phase === 'PRESENTATION') && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-25 overflow-hidden">
          <div className="w-[800px] h-[800px] animate-sunburst bg-[radial-gradient(circle,rgba(245,158,11,0.4)_0%,transparent_70%)]" />
        </div>
      )}

      {/* PHASE 1: FUSION ANIMATION */}
      {phase === 'FUSION' && tradedCards && (
        <div className="relative flex flex-col items-center justify-center w-full max-w-xl text-center">
          <div className="mb-8 flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs tracking-widest uppercase animate-pulse">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>EXCHANGING FIGHTERS...</span>
          </div>

          <div className="relative w-full h-80 flex items-center justify-center">
            {/* Energy Core in Center */}
            <div className="absolute w-24 h-24 rounded-full bg-gradient-to-r from-amber-400 via-rose-500 to-cyan-400 blur-xl animate-energy-orb" />

            {/* Left Traded Card */}
            <div className="absolute left-1/4 -translate-x-1/2 animate-fusion-left flex flex-col items-center">
              <CardView card={tradedCards[0]} size="md" />
              <span className="text-[10px] text-slate-400 font-mono mt-2">Sacrificed</span>
            </div>

            {/* Right Traded Card */}
            <div className="absolute right-1/4 translate-x-1/2 animate-fusion-right flex flex-col items-center">
              <CardView card={tradedCards[1]} size="md" />
              <span className="text-[10px] text-slate-400 font-mono mt-2">Sacrificed</span>
            </div>
          </div>

          <button
            onClick={skipAnimation}
            className="mt-6 text-xs text-slate-400 hover:text-slate-200 underline font-mono tracking-wider cursor-pointer"
          >
            Skip Animation ⏩
          </button>
        </div>
      )}

      {/* PHASE 2: 3D REVEAL ANIMATION */}
      {phase === 'REVEAL' && (
        <div className="relative flex flex-col items-center justify-center w-full max-w-xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/20 border border-amber-400 text-amber-300 font-arcade text-lg tracking-wider animate-bounce">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span>NEW FIGHTER AWAKENED!</span>
          </div>

          {/* 3D Flipping Card Container */}
          <div className="relative flex items-center justify-center py-6 animate-card-3d-reveal">
            <div className="absolute -inset-4 bg-gradient-to-r from-amber-400 via-yellow-200 to-cyan-400 rounded-3xl blur-2xl opacity-60 animate-pulse" />
            <CardView card={rewardCard} size="lg" className="relative z-10 shadow-2xl" />
          </div>

          <button
            onClick={skipAnimation}
            className="mt-4 text-xs text-slate-400 hover:text-slate-200 underline font-mono tracking-wider cursor-pointer"
          >
            Skip to Details ⏩
          </button>
        </div>
      )}

      {/* PHASE 3: PRESENTATION POP-UP MODAL */}
      {phase === 'PRESENTATION' && (
        <div className="relative bg-slate-900 border-2 border-amber-400/80 rounded-2xl p-6 md:p-8 max-w-lg w-full shadow-[0_0_50px_rgba(245,158,11,0.25)] animate-modal-pop max-h-[92vh] overflow-y-auto">
          {/* Close X Button */}
          <button
            onClick={() => {
              audio.playCardSelect();
              onClose();
            }}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-100 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Celebration Header Badge */}
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 text-xs font-bold uppercase tracking-widest mb-3">
              <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" />
              <span>NEW FIGHTER RECRUITED!</span>
            </div>

            <h2 className="font-arcade text-4xl md:text-5xl font-extrabold text-amber-400 tracking-wide drop-shadow-[0_2px_10px_rgba(245,158,11,0.5)]">
              {rewardCard.name}
            </h2>

            <p className="text-xs md:text-sm text-cyan-300 font-semibold tracking-wider uppercase mt-0.5">
              {rewardCard.title}
            </p>
          </div>

          {/* Card Showcase with Holographic Shine */}
          <div className="flex justify-center my-5 relative">
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-amber-500 via-rose-500 to-cyan-500 rounded-2xl blur-lg opacity-40 group-hover:opacity-70 transition duration-500" />
              <div className="relative overflow-hidden rounded-xl">
                <CardView card={rewardCard} size="lg" className="shadow-2xl" />
                {/* Shimmer light sweep */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer-sweep w-full h-full" />
              </div>
            </div>
          </div>

          {/* Stats & Fighter Specs */}
          <div className="space-y-3.5 bg-slate-950/80 p-4 rounded-xl border border-slate-800 mb-5">
            {/* Top Stat Row: Series & Debut */}
            <div className="flex items-center justify-between text-xs border-b border-slate-800/80 pb-2">
              <span className="text-slate-400">Series:</span>
              <span className="font-semibold text-slate-200">{rewardCard.series}</span>
            </div>

            <div className="flex items-center justify-between text-xs border-b border-slate-800/80 pb-2">
              <span className="text-slate-400">Debut Game:</span>
              <span className="text-slate-300">{rewardCard.earliestGame}</span>
            </div>

            <div className="flex items-center justify-between text-xs border-b border-slate-800/80 pb-2">
              <span className="text-slate-400">Fighting Style:</span>
              <span className="text-slate-300 font-mono text-[11px] truncate max-w-[200px]">
                {rewardCard.fightingStyle}
              </span>
            </div>

            {/* Combat Power Values Grid */}
            <div className="pt-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400 flex items-center gap-1 font-semibold uppercase tracking-wider">
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                  <span>Card Values</span>
                </span>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-arcade text-base font-bold border border-amber-500/40">
                  TOTAL PWR {totalPower}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-slate-900 p-1.5 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-amber-400 font-bold">TOP ▲</div>
                  <div className="font-arcade text-xl text-slate-100 font-bold">
                    {rewardCard.values.top}
                  </div>
                </div>
                <div className="bg-slate-900 p-1.5 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-cyan-400 font-bold">RIGHT ▶</div>
                  <div className="font-arcade text-xl text-slate-100 font-bold">
                    {rewardCard.values.right}
                  </div>
                </div>
                <div className="bg-slate-900 p-1.5 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-amber-400 font-bold">BOTTOM ▼</div>
                  <div className="font-arcade text-xl text-slate-100 font-bold">
                    {rewardCard.values.bottom}
                  </div>
                </div>
                <div className="bg-slate-900 p-1.5 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-cyan-400 font-bold">LEFT ◀</div>
                  <div className="font-arcade text-xl text-slate-100 font-bold">
                    {rewardCard.values.left}
                  </div>
                </div>
              </div>
            </div>

            {/* Fighter Quote */}
            {rewardCard.quote && (
              <p className="text-xs text-slate-400 italic text-center pt-1 border-t border-slate-800/80">
                "{rewardCard.quote}"
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => {
                audio.playCardSelect();
                onClose();
              }}
              className="w-full py-3 px-6 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-arcade text-2xl font-bold tracking-wider uppercase cursor-pointer transition-all shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:shadow-[0_0_28px_rgba(245,158,11,0.6)] flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5 text-slate-950 stroke-[3]" />
              <span>COLLECT & RETURN TO DECK</span>
            </button>

            {canTradeAgain && onTradeAgain && (
              <button
                onClick={() => {
                  audio.playCardSelect();
                  onTradeAgain();
                }}
                className="w-full sm:w-auto py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs uppercase tracking-wider cursor-pointer transition-all flex items-center justify-center gap-1.5 whitespace-nowrap"
              >
                <Repeat className="w-4 h-4 text-amber-400" />
                <span>TRADE AGAIN</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
