import React, { useState } from 'react';
import { Card, PlayerOwner } from '../types/game';
import { CardSvgArtwork } from './CardSvgArtwork';

interface CardViewProps {
  card?: Card | null;
  owner?: PlayerOwner | null;
  isSelected?: boolean;
  isPlayable?: boolean;
  isFaceDown?: boolean;
  justCaptured?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  onDragStart?: (e: React.DragEvent) => void;
  showDetails?: boolean;
  className?: string;
}

export const CardView: React.FC<CardViewProps> = ({
  card,
  owner,
  isSelected = false,
  isPlayable = false,
  isFaceDown = false,
  justCaptured = false,
  size = 'md',
  onClick,
  onDragStart,
  showDetails = false,
  className = '',
}) => {
  const [imageError, setImageError] = useState<boolean>(false);

  // If face down (e.g. CPU hand cards)
  if (isFaceDown) {
    return (
      <div
        className={`relative rounded-xl border-2 border-slate-700 bg-gradient-to-br from-slate-900 via-rose-950/70 to-slate-950 shadow-md select-none flex flex-col items-center justify-center p-2 overflow-hidden ${
          size === 'sm' ? 'w-20 h-28' : size === 'lg' ? 'w-60 h-80' : 'w-28 h-36 md:w-32 md:h-44'
        } ${className}`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(225,29,72,0.2)_0%,transparent_70%)]" />
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-rose-500/50 flex items-center justify-center bg-slate-950/90 shadow-inner">
          <span className="font-arcade text-lg md:text-xl font-bold text-rose-500 tracking-wider">SF</span>
        </div>
        <div className="mt-2 text-[10px] md:text-xs font-arcade font-bold tracking-widest text-slate-300 uppercase">
          TRIAD
        </div>
        <div className="absolute bottom-1.5 text-[8px] text-slate-500 font-mono tracking-wider">CPU CARD</div>
      </div>
    );
  }

  if (!card) {
    return (
      <div
        className={`rounded-xl border-2 border-dashed border-slate-800 bg-slate-900/30 flex items-center justify-center ${
          size === 'sm' ? 'w-20 h-28' : size === 'lg' ? 'w-60 h-80' : 'w-28 h-36 md:w-32 md:h-44'
        } ${className}`}
      />
    );
  }

  // Border & Glow styling based on ownership
  const ownerClasses =
    owner === 'player'
      ? 'border-sky-500 shadow-[0_0_16px_rgba(14,165,233,0.4)]'
      : owner === 'cpu'
      ? 'border-rose-600 shadow-[0_0_16px_rgba(225,29,72,0.4)]'
      : 'border-slate-700 hover:border-slate-500 shadow-md';

  const selectedClasses = isSelected
    ? 'ring-4 ring-amber-400 -translate-y-2 shadow-[0_0_25px_rgba(251,191,36,0.6)] scale-105 z-20'
    : '';

  const playableClasses = isPlayable
    ? 'cursor-pointer hover:border-amber-400 hover:shadow-lg transition-transform hover:-translate-y-1'
    : '';

  const sizeDimensions =
    size === 'sm'
      ? 'w-20 h-28'
      : size === 'lg'
      ? 'w-60 h-80'
      : 'w-28 h-36 md:w-32 md:h-44';

  const badgeTextSize =
    size === 'sm'
      ? 'text-[11px] px-1 py-0.5 min-w-[18px]'
      : size === 'lg'
      ? 'text-lg px-2.5 py-1 min-w-[32px]'
      : 'text-xs md:text-sm px-1.5 md:px-2 py-0.5 md:py-1 min-w-[22px] md:min-w-[26px]';

  return (
    <div
      onClick={onClick}
      draggable={isPlayable && !!onDragStart}
      onDragStart={onDragStart}
      className={`group relative rounded-xl border-2 transition-all duration-200 select-none flex flex-col justify-between overflow-hidden bg-slate-950 ${sizeDimensions} ${ownerClasses} ${selectedClasses} ${playableClasses} ${
        justCaptured ? 'animate-capture-flash ring-4 ring-amber-400' : ''
      } ${className}`}
    >
      {/* --- TOP EDGE POWER STAT --- */}
      <div
        className={`absolute top-0 left-1/2 -translate-x-1/2 z-30 rounded-b-md bg-slate-950/95 border-b-2 border-x border-amber-400/90 shadow-md font-arcade font-extrabold text-amber-300 text-center leading-none flex items-center justify-center ${badgeTextSize}`}
      >
        {card.values.top}
      </div>

      {/* --- BOTTOM EDGE POWER STAT --- */}
      <div
        className={`absolute bottom-0 left-1/2 -translate-x-1/2 z-30 rounded-t-md bg-slate-950/95 border-t-2 border-x border-amber-400/90 shadow-md font-arcade font-extrabold text-amber-300 text-center leading-none flex items-center justify-center ${badgeTextSize}`}
      >
        {card.values.bottom}
      </div>

      {/* --- LEFT EDGE POWER STAT --- */}
      <div
        className={`absolute left-0 top-1/2 -translate-y-1/2 z-30 rounded-r-md bg-slate-950/95 border-r-2 border-y border-cyan-400/90 shadow-md font-arcade font-extrabold text-cyan-300 text-center leading-none flex items-center justify-center ${badgeTextSize}`}
      >
        {card.values.left}
      </div>

      {/* --- RIGHT EDGE POWER STAT --- */}
      <div
        className={`absolute right-0 top-1/2 -translate-y-1/2 z-30 rounded-l-md bg-slate-950/95 border-l-2 border-y border-cyan-400/90 shadow-md font-arcade font-extrabold text-cyan-300 text-center leading-none flex items-center justify-center ${badgeTextSize}`}
      >
        {card.values.right}
      </div>

      {/* --- FULL CHARACTER ARTWORK (UDON STREET FIGHTER COMIC INSPIRED) --- */}
      <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden">
        {card.imageUrl && !imageError ? (
          <img
            src={card.imageUrl}
            alt={card.name}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center filter contrast-105"
          />
        ) : (
          <div className="w-full h-full">
            <CardSvgArtwork card={card} size={size} />
          </div>
        )}

        {/* Subtle comic vignette and owner tint */}
        <div
          className={`absolute inset-0 pointer-events-none transition-opacity ${
            owner === 'player'
              ? 'bg-gradient-to-t from-sky-950/30 via-transparent to-transparent'
              : owner === 'cpu'
              ? 'bg-gradient-to-t from-rose-950/30 via-transparent to-transparent'
              : 'bg-gradient-to-t from-black/25 via-transparent to-transparent'
          }`}
        />
      </div>

      {/* Inspector Details (only when showDetails is passed in modal) */}
      {showDetails && (
        <div className="relative z-20 p-3 bg-slate-900/95 border-t border-slate-800 text-left">
          <p className="text-xs text-slate-300 italic mb-1">"{card.quote}"</p>
          <div className="text-[11px] text-slate-400 space-y-0.5">
            <div><span className="text-slate-500">Earliest Game:</span> {card.earliestGame}</div>
            <div><span className="text-slate-500">Fighting Style:</span> {card.fightingStyle}</div>
          </div>
        </div>
      )}
    </div>
  );
};
