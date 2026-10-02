import { ALL_CARDS, CARD_MAP } from '../data/cards';
import { Card, GameStatistics, HandMode } from '../types/game';

const STORAGE_KEYS = {
  OWNED_CARDS: 'sf_triad_owned_card_ids',
  STATS: 'sf_triad_stats',
  SAVED_CUSTOM_HAND: 'sf_triad_saved_custom_hand_ids',
  SAVED_HAND_MODE: 'sf_triad_saved_hand_mode',
};

const INITIAL_STARTER_CARD_COUNT = 14;

/**
 * Loads the player's previously chosen hand formation mode ('Random' | 'Build').
 */
export function getSavedHandMode(): HandMode {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SAVED_HAND_MODE);
    if (raw === 'Build' || raw === 'Random') {
      return raw;
    }
  } catch (err) {
    console.warn('Error reading saved hand mode from localStorage', err);
  }
  return 'Random';
}

/**
 * Saves the player's chosen hand formation mode ('Random' | 'Build').
 */
export function saveHandMode(mode: HandMode): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SAVED_HAND_MODE, mode);
  } catch (err) {
    console.warn('Error saving hand mode to localStorage', err);
  }
}

/**
 * Loads the player's previously saved custom hand card IDs.
 */
export function getSavedCustomHandCardIds(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SAVED_CUSTOM_HAND);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.filter((id): id is string => typeof id === 'string');
      }
    }
  } catch (err) {
    console.warn('Error reading saved custom hand from localStorage', err);
  }
  return [];
}

/**
 * Saves the player's custom hand card IDs for future matches.
 */
export function saveCustomHandCardIds(ids: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SAVED_CUSTOM_HAND, JSON.stringify(ids));
  } catch (err) {
    console.warn('Error saving custom hand to localStorage', err);
  }
}

/**
 * Initializes or loads the player's owned card IDs.
 * Ensures the player has at least 12 randomly selected unique starter cards.
 */
export function getOwnedCardIds(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.OWNED_CARDS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length >= 5) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Error reading owned cards from localStorage', err);
  }

  // Initialize with 14 unique random starter cards
  const shuffled = [...ALL_CARDS].sort(() => Math.random() - 0.5);
  const starter = shuffled.slice(0, INITIAL_STARTER_CARD_COUNT).map((c) => c.id);
  saveOwnedCardIds(starter);
  return starter;
}

export function saveOwnedCardIds(ids: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.OWNED_CARDS, JSON.stringify(ids));
  } catch (err) {
    console.warn('Error saving owned cards to localStorage', err);
  }
}

export function getOwnedCards(): Card[] {
  const ids = getOwnedCardIds();
  return ids
    .map((id) => CARD_MAP.get(id))
    .filter((c): c is Card => c !== undefined);
}

export function getUnownedCards(): Card[] {
  const ownedIds = new Set(getOwnedCardIds());
  return ALL_CARDS.filter((c) => !ownedIds.has(c.id));
}

export function awardRandomUnownedCard(): Card | null {
  const unowned = getUnownedCards();
  if (unowned.length === 0) return null; // All collected!
  
  const picked = unowned[Math.floor(Math.random() * unowned.length)];
  const ownedIds = getOwnedCardIds();
  if (!ownedIds.includes(picked.id)) {
    ownedIds.push(picked.id);
    saveOwnedCardIds(ownedIds);
  }
  return picked;
}

/**
 * Trade 2 owned cards for 1 unowned card.
 */
export function tradeCards(cardId1: string, cardId2: string): { success: boolean; rewardedCard: Card | null; error?: string } {
  const unowned = getUnownedCards();
  if (unowned.length === 0) {
    return { success: false, rewardedCard: null, error: 'You have already collected all 38 cards!' };
  }

  const owned = getOwnedCardIds();
  if (!owned.includes(cardId1) || !owned.includes(cardId2) || cardId1 === cardId2) {
    return { success: false, rewardedCard: null, error: 'Invalid cards selected for trade.' };
  }

  // PRD constraint: a match must have enough distinct cards available. Keep at least 7 cards.
  if (owned.length <= 7) {
    return { success: false, rewardedCard: null, error: 'You need at least 8 cards in your collection to trade.' };
  }

  const reward = unowned[Math.floor(Math.random() * unowned.length)];
  const newOwned = owned.filter((id) => id !== cardId1 && id !== cardId2);
  newOwned.push(reward.id);
  saveOwnedCardIds(newOwned);

  return { success: true, rewardedCard: reward };
}

export function getGameStats(): GameStatistics {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STATS);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        gamesPlayed: Number(parsed.gamesPlayed) || 0,
        wins: Number(parsed.wins) || 0,
        losses: Number(parsed.losses) || 0,
        draws: Number(parsed.draws) || 0,
        completionStreak: Number(parsed.completionStreak) || 0,
      };
    }
  } catch (err) {
    console.warn('Error reading stats', err);
  }

  return {
    gamesPlayed: 0,
    wins: 0,
    losses: 0,
    draws: 0,
    completionStreak: 0,
  };
}

export function saveGameStats(stats: GameStatistics): void {
  try {
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
  } catch (err) {
    console.warn('Error saving stats', err);
  }
}

/**
 * Records the outcome of a match and returns reward info.
 */
export function recordMatchCompletion(result: 'win' | 'loss' | 'draw'): {
  updatedStats: GameStatistics;
  earnedCard: Card | null;
  streakEarnedCard: Card | null;
  wasStreakRewarded: boolean;
} {
  const stats = getGameStats();
  stats.gamesPlayed += 1;
  if (result === 'win') stats.wins += 1;
  else if (result === 'loss') stats.losses += 1;
  else stats.draws += 1;

  // PRD: "One new card is awarded after every victory."
  let earnedCard: Card | null = null;
  if (result === 'win') {
    earnedCard = awardRandomUnownedCard();
  }

  // PRD: "A reward is awarded after completing 3 games in a row, regardless of results."
  stats.completionStreak += 1;
  let streakEarnedCard: Card | null = null;
  let wasStreakRewarded = false;

  if (stats.completionStreak >= 3) {
    wasStreakRewarded = true;
    stats.completionStreak = 0; // reset streak
    streakEarnedCard = awardRandomUnownedCard();
  }

  saveGameStats(stats);

  return {
    updatedStats: stats,
    earnedCard,
    streakEarnedCard,
    wasStreakRewarded,
  };
}

export function resetGameStats(): void {
  saveGameStats({
    gamesPlayed: 0,
    wins: 0,
    losses: 0,
    draws: 0,
    completionStreak: 0,
  });
}

/**
 * Resets stats and cards to a starter state.
 */
export function resetGameToStarterState(starterCount: number): void {
  resetGameStats();
  
  const shuffled = [...ALL_CARDS].sort(() => Math.random() - 0.5);
  const starter = shuffled.slice(0, starterCount).map((c) => c.id);
  saveOwnedCardIds(starter);
  
  localStorage.removeItem(STORAGE_KEYS.SAVED_CUSTOM_HAND);
  localStorage.removeItem(STORAGE_KEYS.SAVED_HAND_MODE);
}

/**
 * Unlocks all characters in the user's collection/deck, making them available for play.
 */
export function unlockAllCards(): void {
  const allIds = ALL_CARDS.map((c) => c.id);
  saveOwnedCardIds(allIds);
}

