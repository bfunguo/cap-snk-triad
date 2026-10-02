import { Card, Difficulty, BoardCell } from '../types/game';
import { calculateCaptures, cloneBoard, getAvailableCells } from './gameRules';

export interface AIMove {
  cardIndex: number;
  card: Card;
  row: number;
  col: number;
}

export function chooseAIMove(
  board: (BoardCell | null)[][],
  cpuHand: Card[],
  playerHand: Card[],
  difficulty: Difficulty
): AIMove | null {
  if (cpuHand.length === 0) return null;
  const availableCells = getAvailableCells(board);
  if (availableCells.length === 0) return null;

  switch (difficulty) {
    case 'Easy':
      return chooseEasyMove(board, cpuHand, availableCells);
    case 'Medium':
      return chooseMediumMove(board, cpuHand, availableCells);
    case 'Hard':
      return chooseHardMove(board, cpuHand, availableCells);
    case 'Expert':
      return chooseExpertMove(board, cpuHand, playerHand, availableCells);
    default:
      return chooseMediumMove(board, cpuHand, availableCells);
  }
}

/**
 * Easy AI: Mostly plays randomly, occasionally spots a simple capture.
 */
function chooseEasyMove(
  board: (BoardCell | null)[][],
  cpuHand: Card[],
  availableCells: { row: number; col: number }[]
): AIMove {
  // 35% chance to attempt a capture
  if (Math.random() < 0.35) {
    for (let cIdx = 0; cIdx < cpuHand.length; cIdx++) {
      const card = cpuHand[cIdx];
      for (const cell of availableCells) {
        const captures = calculateCaptures(board, cell.row, cell.col, card, 'cpu');
        if (captures.length > 0) {
          return { cardIndex: cIdx, card, row: cell.row, col: cell.col };
        }
      }
    }
  }

  // Otherwise random
  const randomCardIdx = Math.floor(Math.random() * cpuHand.length);
  const randomCell = availableCells[Math.floor(Math.random() * availableCells.length)];
  return {
    cardIndex: randomCardIdx,
    card: cpuHand[randomCardIdx],
    row: randomCell.row,
    col: randomCell.col,
  };
}

/**
 * Medium AI: Greedy capture. Maximizes immediate captures.
 */
function chooseMediumMove(
  board: (BoardCell | null)[][],
  cpuHand: Card[],
  availableCells: { row: number; col: number }[]
): AIMove {
  let bestMove: AIMove | null = null;
  let maxCaptures = -1;

  // Shuffle order slightly to avoid repetitive play
  const shuffledCards = cpuHand.map((card, idx) => ({ card, idx })).sort(() => Math.random() - 0.5);
  const shuffledCells = [...availableCells].sort(() => Math.random() - 0.5);

  for (const { card, idx } of shuffledCards) {
    for (const cell of shuffledCells) {
      const captures = calculateCaptures(board, cell.row, cell.col, card, 'cpu');
      if (captures.length > maxCaptures) {
        maxCaptures = captures.length;
        bestMove = { cardIndex: idx, card, row: cell.row, col: cell.col };
      }
    }
  }

  return (
    bestMove || {
      cardIndex: 0,
      card: cpuHand[0],
      row: availableCells[0].row,
      col: availableCells[0].col,
    }
  );
}

/**
 * Hard AI: Immediate captures + defensive evaluation.
 * Evaluates exposed sides to protect low numbers and rewards corner wall protection.
 */
function chooseHardMove(
  board: (BoardCell | null)[][],
  cpuHand: Card[],
  availableCells: { row: number; col: number }[]
): AIMove {
  let bestMove: AIMove | null = null;
  let highestScore = -999;

  for (let cIdx = 0; cIdx < cpuHand.length; cIdx++) {
    const card = cpuHand[cIdx];
    for (const cell of availableCells) {
      const { row, col } = cell;
      const captures = calculateCaptures(board, row, col, card, 'cpu');
      let score = captures.length * 4.0;

      // Defensive side evaluations:
      // Top side
      if (row === 0) {
        score += 1.0; // wall protection
      } else {
        const topCell = board[row - 1][col];
        if (!topCell) {
          // exposed to empty cell
          if (card.values.top <= 4) score -= 1.5;
          else if (card.values.top >= 7) score += 0.8;
        }
      }

      // Bottom side
      if (row === 2) {
        score += 1.0;
      } else {
        const btmCell = board[row + 1][col];
        if (!btmCell) {
          if (card.values.bottom <= 4) score -= 1.5;
          else if (card.values.bottom >= 7) score += 0.8;
        }
      }

      // Left side
      if (col === 0) {
        score += 1.0;
      } else {
        const leftCell = board[row][col - 1];
        if (!leftCell) {
          if (card.values.left <= 4) score -= 1.5;
          else if (card.values.left >= 7) score += 0.8;
        }
      }

      // Right side
      if (col === 2) {
        score += 1.0;
      } else {
        const rightCell = board[row][col + 1];
        if (!rightCell) {
          if (card.values.right <= 4) score -= 1.5;
          else if (card.values.right >= 7) score += 0.8;
        }
      }

      // Corner anchor bonus
      if ((row === 0 || row === 2) && (col === 0 || col === 2)) {
        score += 0.75;
      }

      if (score > highestScore) {
        highestScore = score;
        bestMove = { cardIndex: cIdx, card, row, col };
      }
    }
  }

  return (
    bestMove || {
      cardIndex: 0,
      card: cpuHand[0],
      row: availableCells[0].row,
      col: availableCells[0].col,
    }
  );
}

/**
 * Expert AI: 2-ply Lookahead (Minimax).
 * Simulates CPU move, then simulates all player responses to minimize player's maximum counter-capture.
 */
function chooseExpertMove(
  board: (BoardCell | null)[][],
  cpuHand: Card[],
  playerHand: Card[],
  availableCells: { row: number; col: number }[]
): AIMove {
  let bestMove: AIMove | null = null;
  let bestValue = -9999;

  for (let cIdx = 0; cIdx < cpuHand.length; cIdx++) {
    const card = cpuHand[cIdx];
    for (const cell of availableCells) {
      const { row, col } = cell;

      // 1. Simulate CPU placement
      const simBoard = cloneBoard(board);
      const captures = calculateCaptures(simBoard, row, col, card, 'cpu');
      simBoard[row][col] = { row, col, card, owner: 'cpu' };
      for (const cap of captures) {
        if (simBoard[cap.row][cap.col]) {
          simBoard[cap.row][cap.col]!.owner = 'cpu';
        }
      }

      // Immediate gain
      const immediateGain = captures.length * 5;

      // 2. Evaluate player counter-potential
      const remainingCells = getAvailableCells(simBoard);
      let maxPlayerCounter = 0;

      if (remainingCells.length > 0 && playerHand.length > 0) {
        for (const pCard of playerHand) {
          for (const pCell of remainingCells) {
            const pCaptures = calculateCaptures(simBoard, pCell.row, pCell.col, pCard, 'player');
            if (pCaptures.length > maxPlayerCounter) {
              maxPlayerCounter = pCaptures.length;
            }
          }
        }
      }

      // Corner and wall defensive weighting
      let positionalBonus = 0;
      if (row === 0 && card.values.top >= 6) positionalBonus += 0.5;
      if (row === 2 && card.values.bottom >= 6) positionalBonus += 0.5;
      if (col === 0 && card.values.left >= 6) positionalBonus += 0.5;
      if (col === 2 && card.values.right >= 6) positionalBonus += 0.5;
      if ((row === 0 || row === 2) && (col === 0 || col === 2)) positionalBonus += 1.0;

      // Score for this move
      const moveScore = immediateGain - maxPlayerCounter * 4.5 + positionalBonus;

      if (moveScore > bestValue) {
        bestValue = moveScore;
        bestMove = { cardIndex: cIdx, card, row, col };
      }
    }
  }

  return (
    bestMove || {
      cardIndex: 0,
      card: cpuHand[0],
      row: availableCells[0].row,
      col: availableCells[0].col,
    }
  );
}
