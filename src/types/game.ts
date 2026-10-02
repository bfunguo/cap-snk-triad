export type Series =
  | 'Super Street Fighter'
  | 'Street Fighter Alpha 3'
  | 'Street Fighter III'
  | "The King of Fighters '96"
  | "The King of Fighters '97"
  | 'The King of Fighters 2001'
  | 'Fatal Fury Special'
  | 'Samurai Shodown'
  | 'The Last Blade'
  | 'Garou: Mark of the Wolves';

export interface DirectionalValues {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface Card {
  id: string;
  name: string;
  title: string;
  series: Series;
  earliestGame: string;
  releaseYear: number;
  country: string;
  originalGameDebut: string;
  values: DirectionalValues;
  bio: string;
  quote: string;
  signatureColor: string; // e.g. hex or tailwind class
  accentColor: string;
  fightingStyle: string;
  avatarSymbol: string; // distinct visual motif
  imageUrl?: string;
}

export type PlayerOwner = 'player' | 'cpu';

export interface BoardCell {
  row: number;
  col: number;
  card: Card | null;
  owner: PlayerOwner | null;
  justCaptured?: boolean;
}

export type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Expert';
export type HandMode = 'Random' | 'Build';

export interface GameStatistics {
  gamesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
  completionStreak: number; // 0, 1, 2 (at 3 awards bonus and resets to 0)
}

export type AppScreen = 'MENU' | 'SETUP' | 'MATCH' | 'RESULTS' | 'COLLECTION' | 'STATS' | 'INDEX';

export interface MatchResult {
  winner: PlayerOwner | 'draw';
  playerControlled: number;
  cpuControlled: number;
  earnedCard: Card | null;
  streakEarnedCard: Card | null;
  completionProgress: number; // 1, 2, 3
  wasStreakRewarded: boolean;
}
