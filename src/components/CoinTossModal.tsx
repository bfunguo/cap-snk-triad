import React, { useEffect, useState } from 'react';
import { PlayerOwner } from '../types/game';
import { audio } from '../utils/audio';

interface CoinTossModalProps {
  firstPlayer: PlayerOwner;
  onComplete: () => void;
}

export const CoinTossModal: React.FC<CoinTossModalProps> = ({ firstPlayer, onComplete }) => {
  const [stage, setStage] = useState<'flipping' | 'revealed'>('flipping');

  useEffect(() => {
    audio.playCoinToss();

    const flipTimer = setTimeout(() => {
      setStage('revealed');
      audio.playTurnChange();
    }, 1200);

    const finishTimer = setTimeout(() => {
      onComplete();
    }, 2400);

    return () => {
      clearTimeout(flipTimer);
      clearTimeout(finishTimer);
    };
  }, [firstPlayer, onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md">
      <div className="p-8 rounded-2xl bg-slate-900 border-2 border-amber-500/50 text-center max-w-sm w-full mx-4 shadow-[0_0_50px_rgba(245,158,11,0.3)]">
        <div className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-4">
          MATCH INITIATION
        </div>

        {stage === 'flipping' ? (
          <div className="flex flex-col items-center py-6">
            <div className="w-20 h-20 rounded-full border-4 border-amber-400 border-t-transparent animate-spin flex items-center justify-center bg-amber-500/10 shadow-[0_0_20px_rgba(245,158,11,0.5)]">
              <span className="font-arcade text-3xl text-amber-400 font-bold">VS</span>
            </div>
            <div className="mt-4 font-arcade text-2xl text-amber-400 tracking-wider animate-pulse">
              DETERMINING FIRST ATTACKER...
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center py-4 animate-card-place">
            <div
              className={`w-20 h-20 rounded-full border-4 flex items-center justify-center shadow-2xl mb-4 ${
                firstPlayer === 'player'
                  ? 'border-sky-400 bg-sky-950/80 text-sky-400 shadow-[0_0_30px_rgba(14,165,233,0.5)]'
                  : 'border-rose-500 bg-rose-950/80 text-rose-500 shadow-[0_0_30px_rgba(225,29,72,0.5)]'
              }`}
            >
              <span className="font-arcade text-4xl font-extrabold">
                {firstPlayer === 'player' ? 'P1' : 'CPU'}
              </span>
            </div>
            <h2
              className={`font-arcade text-4xl font-bold tracking-wider ${
                firstPlayer === 'player' ? 'text-sky-400' : 'text-rose-500'
              }`}
            >
              {firstPlayer === 'player' ? 'PLAYER 1 GOES FIRST!' : 'CPU GOES FIRST!'}
            </h2>
            <p className="text-xs text-slate-400 mt-1 font-mono">Get ready to place your cards</p>
          </div>
        )}
      </div>
    </div>
  );
};
