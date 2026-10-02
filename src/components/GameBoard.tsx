import React from 'react';
import { BoardCell, Card, PlayerOwner } from '../types/game';
import { CardView } from './CardView';

interface GameBoardProps {
  board: (BoardCell | null)[][];
  onCellClick: (row: number, col: number) => void;
  onCellDrop: (row: number, col: number, cardId: string) => void;
  selectedCard: Card | null;
  isPlayerTurn: boolean;
  disabled: boolean;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  board,
  onCellClick,
  onCellDrop,
  selectedCard,
  isPlayerTurn,
  disabled,
}) => {
  const [dragOverCell, setDragOverCell] = React.useState<{ row: number; col: number } | null>(null);

  const handleDragOver = (e: React.DragEvent, row: number, col: number) => {
    e.preventDefault();
    if (!disabled && isPlayerTurn && (!board[row][col] || !board[row][col]?.card)) {
      setDragOverCell({ row, col });
    }
  };

  const handleDragLeave = () => {
    setDragOverCell(null);
  };

  const handleDrop = (e: React.DragEvent, row: number, col: number) => {
    e.preventDefault();
    setDragOverCell(null);
    if (disabled || !isPlayerTurn) return;
    const cardId = e.dataTransfer.getData('text/plain');
    if (cardId) {
      onCellDrop(row, col, cardId);
    }
  };

  return (
    <div className="relative p-2 md:p-3 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-slate-700/80 shadow-[0_12px_40px_rgba(0,0,0,0.8)] backdrop-blur-md">
      {/* Metallic arcade corner bolts */}
      <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-slate-600 border border-slate-400" />
      <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-slate-600 border border-slate-400" />
      <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-slate-600 border border-slate-400" />
      <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-slate-600 border border-slate-400" />

      {/* 3x3 Grid */}
      <div className="grid grid-cols-3 grid-rows-3 gap-2 md:gap-3 p-1">
        {board.map((rowCells, r) =>
          rowCells.map((cell, c) => {
            const hasCard = cell && cell.card;
            const isTargeted =
              dragOverCell?.row === r && dragOverCell?.col === c;
            const isClickable =
              !disabled && isPlayerTurn && !hasCard && selectedCard !== null;

            return (
              <div
                key={`${r}-${c}`}
                onDragOver={(e) => handleDragOver(e, r, c)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, r, c)}
                onClick={() => {
                  if (isClickable) {
                    onCellClick(r, c);
                  }
                }}
                className={`relative w-28 h-36 md:w-32 md:h-44 rounded-xl border-2 transition-all flex items-center justify-center overflow-hidden ${
                  hasCard
                    ? 'border-transparent'
                    : isTargeted
                    ? 'border-amber-400 bg-amber-500/20 scale-102 shadow-[0_0_20px_rgba(245,158,11,0.5)]'
                    : isClickable
                    ? 'border-amber-400/60 bg-amber-500/10 cursor-pointer hover:border-amber-400 hover:bg-amber-500/20 animate-pulse'
                    : 'border-slate-800 bg-slate-900/60'
                }`}
              >
                {/* Cell Coordinate Watermark */}
                {!hasCard && (
                  <div className="absolute flex flex-col items-center pointer-events-none select-none opacity-30">
                    <span className="font-arcade text-2xl text-slate-500">
                      {String.fromCharCode(65 + r)}
                      {c + 1}
                    </span>
                    {isClickable && (
                      <span className="text-[10px] text-amber-400 font-semibold tracking-wider uppercase mt-1">
                        PLACE
                      </span>
                    )}
                  </div>
                )}

                {/* Occupying Card */}
                {hasCard && (
                  <CardView
                    card={cell.card}
                    owner={cell.owner}
                    justCaptured={cell.justCaptured}
                    size="md"
                    className="w-full h-full"
                  />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
