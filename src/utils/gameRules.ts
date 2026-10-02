import { BoardCell, Card, PlayerOwner } from '../types/game';

export interface CaptureResult {
  row: number;
  col: number;
}

/**
 * Checks which adjacent opponent cards will be captured by placing `card` at (row, col) by `owner`.
 * Classic Triple Triad capture rules: strictly higher value on touching side captures.
 */
export function calculateCaptures(
  board: (BoardCell | null)[][],
  row: number,
  col: number,
  card: Card,
  owner: PlayerOwner
): CaptureResult[] {
  const opponent: PlayerOwner = owner === 'player' ? 'cpu' : 'player';
  const captures: CaptureResult[] = [];

  // Top neighbor (r - 1, c) -> placing card's TOP vs neighbor's BOTTOM
  if (row > 0) {
    const topCell = board[row - 1][col];
    if (topCell && topCell.card && topCell.owner === opponent) {
      if (card.values.top > topCell.card.values.bottom) {
        captures.push({ row: row - 1, col });
      }
    }
  }

  // Right neighbor (r, c + 1) -> placing card's RIGHT vs neighbor's LEFT
  if (col < 2) {
    const rightCell = board[row][col + 1];
    if (rightCell && rightCell.card && rightCell.owner === opponent) {
      if (card.values.right > rightCell.card.values.left) {
        captures.push({ row, col: col + 1 });
      }
    }
  }

  // Bottom neighbor (r + 1, c) -> placing card's BOTTOM vs neighbor's TOP
  if (row < 2) {
    const bottomCell = board[row + 1][col];
    if (bottomCell && bottomCell.card && bottomCell.owner === opponent) {
      if (card.values.bottom > bottomCell.card.values.top) {
        captures.push({ row: row + 1, col });
      }
    }
  }

  // Left neighbor (r, c - 1) -> placing card's LEFT vs neighbor's RIGHT
  if (col > 0) {
    const leftCell = board[row][col - 1];
    if (leftCell && leftCell.card && leftCell.owner === opponent) {
      if (card.values.left > leftCell.card.values.right) {
        captures.push({ row, col: col - 1 });
      }
    }
  }

  return captures;
}

/**
 * Creates an empty 3x3 board.
 */
export function createEmptyBoard(): (BoardCell | null)[][] {
  return [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ];
}

/**
 * Returns all empty coordinate slots on the board.
 */
export function getAvailableCells(board: (BoardCell | null)[][]): { row: number; col: number }[] {
  const cells: { row: number; col: number }[] = [];
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      if (!board[r][c] || !board[r][c]?.card) {
        cells.push({ row: r, col: c });
      }
    }
  }
  return cells;
}

/**
 * Counts cards currently owned on the board.
 */
export function countBoardOwnership(board: (BoardCell | null)[][]): { player: number; cpu: number; empty: number } {
  let player = 0;
  let cpu = 0;
  let empty = 0;

  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const cell = board[r][c];
      if (!cell || !cell.card) {
        empty += 1;
      } else if (cell.owner === 'player') {
        player += 1;
      } else if (cell.owner === 'cpu') {
        cpu += 1;
      }
    }
  }

  return { player, cpu, empty };
}

/**
 * Determines winner according to PRD:
 * "The match ends when all 9 spaces are occupied.
 * More cards controlled on the board = win; fewer = loss; equal = draw."
 */
export function evaluateWinner(board: (BoardCell | null)[][]): 'player' | 'cpu' | 'draw' | null {
  const { player, cpu, empty } = countBoardOwnership(board);
  if (empty > 0) return null; // match not finished

  if (player > cpu) return 'player';
  if (cpu > player) return 'cpu';
  return 'draw';
}

/**
 * Deep clones board state for simulation.
 */
export function cloneBoard(board: (BoardCell | null)[][]): (BoardCell | null)[][] {
  return board.map((row) =>
    row.map((cell) =>
      cell
        ? {
            ...cell,
            card: { ...cell.card! },
          }
        : null
    )
  );
}
