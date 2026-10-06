import React, { useState, useEffect, useRef } from 'react';
import { BoardCell, Card, Difficulty, HandMode, PlayerOwner } from '../types/game';
import { CardView } from './CardView';
import { GameBoard } from './GameBoard';
import { PauseModal } from './PauseModal';
import { CoinTossModal } from './CoinTossModal';
import { calculateCaptures, countBoardOwnership, createEmptyBoard, evaluateWinner } from '../utils/gameRules';
import { chooseAIMove } from '../utils/ai';
import { audio } from '../utils/audio';
import { Pause, Volume2, VolumeX, Shield, User, Bot } from 'lucide-react';

interface MatchScreenProps {
  difficulty: Difficulty;
  handMode: HandMode;
  initialPlayerCards: Card[];
  initialCpuCards: Card[];
  onMatchComplete: (winner: PlayerOwner | 'draw', playerControlled: number, cpuControlled: number) => void;
  onQuitMatch: () => void;
}

export const MatchScreen: React.FC<MatchScreenProps> = ({
  difficulty,
  handMode,
  initialPlayerCards,
  initialCpuCards,
  onMatchComplete,
  onQuitMatch,
}) => {
  // Board 3x3
  const [board, setBoard] = useState<(BoardCell | null)[][]>(createEmptyBoard());

  // Hands
  const [playerHand, setPlayerHand] = useState<Card[]>([...initialPlayerCards]);
  const [cpuHand, setCpuHand] = useState<Card[]>([...initialCpuCards]);

  // Turn management
  const [showCoinToss, setShowCoinToss] = useState<boolean>(true);
  const [firstPlayer, setFirstPlayer] = useState<PlayerOwner>(() => (Math.random() < 0.5 ? 'player' : 'cpu'));
  const [currentTurn, setCurrentTurn] = useState<PlayerOwner>('player');
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);

  // Interaction
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(() => audio.getMuted());

  // Reference for ongoing match resolution
  const matchEndingRef = useRef<boolean>(false);

  // Coin toss initialization
  const handleCoinTossComplete = () => {
    setShowCoinToss(false);
    setCurrentTurn(firstPlayer);
    audio.playTurnChange();
  };

  const toggleMute = () => {
    const next = audio.toggleMute();
    setIsMuted(next);
  };

  const selectedCard = playerHand.find((c) => c.id === selectedCardId) || null;

  // Board ownership score
  const ownership = countBoardOwnership(board);

  // Check for CPU Turn Execution
  useEffect(() => {
    if (showCoinToss || isPaused || matchEndingRef.current) return;

    if (currentTurn === 'cpu' && cpuHand.length > 0) {
      setIsAiThinking(true);
      const timer = setTimeout(() => {
        executeCpuMove();
      }, 750);

      return () => clearTimeout(timer);
    }
  }, [currentTurn, showCoinToss, isPaused, cpuHand, board]);

  // Execute CPU Move
  const executeCpuMove = () => {
    if (matchEndingRef.current) return;

    const move = chooseAIMove(board, cpuHand, playerHand, difficulty);
    if (!move) {
      setIsAiThinking(false);
      return;
    }

    const { card, row, col, cardIndex } = move;

    // 1. Calculate captures
    const captures = calculateCaptures(board, row, col, card, 'cpu');

    // 2. Play audio
    audio.playCardPlace();
    if (captures.length > 0) {
      setTimeout(() => audio.playCapture(), 120);
    }

    // 3. Update board
    const newBoard = board.map((r) => r.map((c) => (c ? { ...c, justCaptured: false } : null)));
    newBoard[row][col] = {
      row,
      col,
      card,
      owner: 'cpu',
      justCaptured: false,
    };

    // Apply captures
    for (const cap of captures) {
      if (newBoard[cap.row][cap.col]) {
        newBoard[cap.row][cap.col]!.owner = 'cpu';
        newBoard[cap.row][cap.col]!.justCaptured = true;
      }
    }

    // 4. Remove card from CPU hand
    const nextCpuHand = [...cpuHand];
    nextCpuHand.splice(cardIndex, 1);
    setCpuHand(nextCpuHand);
    setBoard(newBoard);
    setIsAiThinking(false);

    // 5. Check match conclusion
    checkMatchCompletion(newBoard);
  };

  // Execute Player Move
  const executePlayerMove = (row: number, col: number, cardToPlace: Card) => {
    if (board[row][col]?.card || currentTurn !== 'player' || isAiThinking || matchEndingRef.current) {
      return;
    }

    // 1. Calculate captures
    const captures = calculateCaptures(board, row, col, cardToPlace, 'player');

    // 2. Play audio
    audio.playCardPlace();
    if (captures.length > 0) {
      setTimeout(() => audio.playCapture(), 120);
    }

    // 3. Update board
    const newBoard = board.map((r) => r.map((c) => (c ? { ...c, justCaptured: false } : null)));
    newBoard[row][col] = {
      row,
      col,
      card: cardToPlace,
      owner: 'player',
      justCaptured: false,
    };

    for (const cap of captures) {
      if (newBoard[cap.row][cap.col]) {
        newBoard[cap.row][cap.col]!.owner = 'player';
        newBoard[cap.row][cap.col]!.justCaptured = true;
      }
    }

    // 4. Remove card from player hand
    setPlayerHand(playerHand.filter((c) => c.id !== cardToPlace.id));
    setSelectedCardId(null);
    setBoard(newBoard);

    // 5. Check match conclusion
    checkMatchCompletion(newBoard);
  };

  const handleCellClick = (row: number, col: number) => {
    if (selectedCard) {
      executePlayerMove(row, col, selectedCard);
    }
  };

  const handleCellDrop = (row: number, col: number, cardId: string) => {
    const droppedCard = playerHand.find((c) => c.id === cardId);
    if (droppedCard) {
      executePlayerMove(row, col, droppedCard);
    }
  };

  const checkMatchCompletion = (currentBoard: (BoardCell | null)[][]) => {
    const winner = evaluateWinner(currentBoard);
    if (winner !== null) {
      matchEndingRef.current = true;
      const { player, cpu } = countBoardOwnership(currentBoard);
      setTimeout(() => {
        onMatchComplete(winner, player, cpu);
      }, 1000);
    } else {
      // Alternate turn
      setCurrentTurn((prev) => (prev === 'player' ? 'cpu' : 'player'));
      audio.playTurnChange();
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full select-none">
      {/* Content wrapper */}
      <div className="relative z-10 min-h-[calc(100vh-4rem)] flex flex-col justify-between py-2 md:py-4 px-2 md:px-6 max-w-5xl mx-auto">
      {/* Coin Toss Modal at Start */}
      {showCoinToss && (
        <CoinTossModal firstPlayer={firstPlayer} onComplete={handleCoinTossComplete} />
      )}

      {/* Pause Modal */}
      {isPaused && (
        <PauseModal
          onResume={() => setIsPaused(false)}
          onQuit={onQuitMatch}
          isMuted={isMuted}
          onToggleMute={toggleMute}
        />
      )}

      {/* TOP HUD: Match Header */}
      <div className="w-full flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
        {/* Left: CPU Status & Ownership count */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-rose-950/80 border border-rose-500/50 flex items-center justify-center text-rose-400">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">CPU OPPONENT</span>
              <span className="text-[10px] text-slate-400 px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">
                {difficulty}
              </span>
            </div>
            <div className="font-arcade text-lg text-slate-300">
              BOARD: <span className="text-rose-400 font-bold">{ownership.cpu}</span> CARDS
            </div>
          </div>
        </div>

        {/* Center: Turn State Banner */}
        <div className="text-center px-4">
          <div
            className={`font-arcade text-2xl md:text-3xl font-bold tracking-wider px-4 py-1 rounded-full border transition-all ${
              currentTurn === 'player'
                ? 'text-sky-400 border-sky-500/50 bg-sky-950/40 shadow-[0_0_20px_rgba(14,165,233,0.3)] animate-pulse'
                : 'text-rose-400 border-rose-500/50 bg-rose-950/40 shadow-[0_0_20px_rgba(225,29,72,0.3)]'
            }`}
          >
            {isAiThinking
              ? 'CPU IS THINKING...'
              : currentTurn === 'player'
              ? 'YOUR TURN'
              : 'CPU TURN'}
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-0.5">
            {handMode === 'Build' ? 'Custom Hand' : 'Random Hand'} · {9 - ownership.empty}/9 Placed
          </div>
        </div>

        {/* Right: Controls & Player Score */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-bold text-sky-400 uppercase tracking-wider">YOU (P1)</div>
            <div className="font-arcade text-lg text-slate-300">
              BOARD: <span className="text-sky-400 font-bold">{ownership.player}</span> CARDS
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={toggleMute}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>
            <button
              onClick={() => setIsPaused(true)}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors"
              title="Pause Game"
            >
              <Pause className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* CPU HAND (TOP) */}
      <div className="w-full flex flex-col items-center mb-2">
        <div className="text-[10px] uppercase font-mono tracking-widest text-slate-500 mb-1 flex items-center gap-1">
          <span>OPPONENT HAND</span>
          <span>·</span>
          <span>{cpuHand.length} REMAINING</span>
        </div>
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto max-w-full pb-1 w-full px-4 scrollbar-thin">
          {cpuHand.map((card, idx) => (
            <CardView
              key={`cpu-${card.id}-${idx}`}
              isFaceDown={true}
              size="sm"
              className="opacity-80"
            />
          ))}
          {cpuHand.length === 0 && (
            <div className="text-xs text-slate-600 italic py-2">No cards remaining</div>
          )}
        </div>
      </div>

      {/* CENTER ARENA: 3x3 BOARD */}
      <div className="flex-1 flex items-center justify-center my-2">
        <GameBoard
          board={board}
          onCellClick={handleCellClick}
          onCellDrop={handleCellDrop}
          selectedCard={selectedCard}
          isPlayerTurn={currentTurn === 'player'}
          disabled={isAiThinking || showCoinToss || isPaused}
        />
      </div>

      {/* PLAYER HAND (BOTTOM) */}
      <div className="w-full flex flex-col items-center mt-2">
        <div className="text-[11px] uppercase font-semibold tracking-wider text-slate-400 mb-1 flex items-center gap-2">
          <User className="w-3.5 h-3.5 text-sky-400" />
          <span>YOUR HAND ({playerHand.length} CARDS)</span>
          <span className="text-[10px] text-slate-500 font-normal">
            — Click card to select, then click empty cell (or drag & drop)
          </span>
        </div>

        <div className="flex items-center justify-start sm:justify-center gap-2 md:gap-3 overflow-x-auto max-w-full p-2 w-full px-4 scrollbar-thin">
          {playerHand.map((card) => {
            const isSelected = selectedCardId === card.id;
            return (
              <div key={card.id} className="shrink-0">
                <CardView
                  card={card}
                  owner="player"
                  isSelected={isSelected}
                  isPlayable={currentTurn === 'player' && !isAiThinking}
                  size="md"
                  onClick={() => {
                    if (currentTurn === 'player' && !isAiThinking) {
                      audio.playCardSelect();
                      setSelectedCardId(isSelected ? null : card.id);
                    }
                  }}
                  onDragStart={(e) => {
                    if (currentTurn === 'player' && !isAiThinking) {
                      audio.playCardSelect();
                      setSelectedCardId(card.id);
                      e.dataTransfer.setData('text/plain', card.id);
                    }
                  }}
                />
              </div>
            );
          })}
          {playerHand.length === 0 && (
            <div className="text-xs text-slate-500 italic py-4">All cards placed</div>
          )}
        </div>
      </div>
    </div>
  </div>
  );
};
