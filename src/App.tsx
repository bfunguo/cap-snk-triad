/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ALL_CARDS } from './data/cards';
import { AppScreen, Card, Difficulty, GameStatistics, HandMode, PlayerOwner } from './types/game';
import { getGameStats, getOwnedCards, recordMatchCompletion } from './utils/storage';
import { HeaderNav } from './components/HeaderNav';
import { MainMenu } from './components/MainMenu';
import { MatchSetup } from './components/MatchSetup';
import { MatchScreen } from './components/MatchScreen';
import { MatchResults } from './components/MatchResults';
import { CardCollection } from './components/CardCollection';
import { CharacterIndex } from './components/CharacterIndex';
import { StatisticsScreen } from './components/StatisticsScreen';
import { ResetConfirmModal } from './components/ResetConfirmModal';
import { audio } from './utils/audio';
import { resetGameToStarterState, unlockAllCards } from './utils/storage';
import confetti from 'canvas-confetti';
import arcadeRoomBgImg from './assets/images/retro_arcade_room_bg_1790889734967.jpg';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('MENU');
  const [stats, setStats] = useState<GameStatistics>(() => getGameStats());
  const [ownedCards, setOwnedCards] = useState<Card[]>(() => getOwnedCards());
  const [showResetModal, setShowResetModal] = useState<boolean>(false);
  const [unlockToast, setUnlockToast] = useState<string | null>(null);

  // Mount BGM check and first-click activation
  useEffect(() => {
    const startAudioOnInteraction = () => {
      if (audio.isBGMPlaying()) {
        audio.startBGM('menu');
      }
      window.removeEventListener('click', startAudioOnInteraction);
      window.removeEventListener('keydown', startAudioOnInteraction);
      window.removeEventListener('touchstart', startAudioOnInteraction);
    };

    window.addEventListener('click', startAudioOnInteraction);
    window.addEventListener('keydown', startAudioOnInteraction);
    window.addEventListener('touchstart', startAudioOnInteraction);

    // Try immediately
    if (audio.isBGMPlaying()) {
      audio.startBGM('menu');
    }

    return () => {
      window.removeEventListener('click', startAudioOnInteraction);
      window.removeEventListener('keydown', startAudioOnInteraction);
      window.removeEventListener('touchstart', startAudioOnInteraction);
    };
  }, []);

  // Ongoing Match Configuration
  const [matchDifficulty, setMatchDifficulty] = useState<Difficulty>('Medium');
  const [matchHandMode, setMatchHandMode] = useState<HandMode>('Random');
  const [matchAllowedFaction, setMatchAllowedFaction] = useState<'Capcom' | 'SNK' | 'Both'>('Both');
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [cpuHand, setCpuHand] = useState<Card[]>([]);

  // Match Outcome
  const [lastWinner, setLastWinner] = useState<PlayerOwner | 'draw'>('player');
  const [lastPlayerCount, setLastPlayerCount] = useState<number>(5);
  const [lastCpuCount, setLastCpuCount] = useState<number>(4);
  const [lastRewardCard, setLastRewardCard] = useState<Card | null>(null);
  const [lastStreakCard, setLastStreakCard] = useState<Card | null>(null);
  const [wasStreakRewarded, setWasStreakRewarded] = useState<boolean>(false);

  // Refresh owned cards when storage updates
  const refreshOwned = () => {
    setOwnedCards(getOwnedCards());
  };

  const refreshStats = () => {
    setStats(getGameStats());
  };

  const handleResetConfirm = () => {
    resetGameToStarterState(5);
    window.location.reload(); // Hard refresh to clear state and reinitialize
  };

  const handleUnlockAll = () => {
    unlockAllCards();
    refreshOwned();
    audio.playVictory();
    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.2 },
        colors: ['#f59e0b', '#fbbf24', '#fef08a', '#d97706', '#ffffff'],
      });
    } catch {
      // Safe fallback
    }
    setUnlockToast('🧀 CHEESE CODE ACTIVATED: All Fighters Unlocked in Deck!');
    setTimeout(() => {
      setUnlockToast(null);
    }, 4000);
  };

  /**
   * Generates CPU hand and Player hand according to PRD constraints:
   * - Random Hand: exactly 5 unique cards randomly from player's entire owned collection.
   * - Build Hand: 5-7 unique cards chosen by player.
   * - CPU: exactly 5 unique cards randomly selected from entire card pool, excluding cards in player's hand.
   * - No card can appear in both hands.
   */
  const startMatch = (
    difficulty: Difficulty,
    handMode: HandMode,
    customHand?: Card[]
  ) => {
    const allowedFaction = matchAllowedFaction;
    setMatchDifficulty(difficulty);
    setMatchHandMode(handMode);

    let finalPlayerHand: Card[] = [];

    if (handMode === 'Random') {
      const currentOwned = getOwnedCards();
      // Filter by selected faction
      const factionOwned = currentOwned.filter(card => {
        const company = card.series.toLowerCase().includes('street fighter') ? 'Capcom' : 'SNK';
        return allowedFaction === 'Both' || company === allowedFaction;
      });

      // Fail-safe: if player doesn't have at least 5 owned cards from this faction, fill with ALL_CARDS of that faction
      let poolToUse = factionOwned;
      if (poolToUse.length < 5) {
        poolToUse = ALL_CARDS.filter(card => {
          const company = card.series.toLowerCase().includes('street fighter') ? 'Capcom' : 'SNK';
          return allowedFaction === 'Both' || company === allowedFaction;
        });
      }

      const shuffledOwned = [...poolToUse].sort(() => Math.random() - 0.5);
      finalPlayerHand = shuffledOwned.slice(0, 5);
    } else if (customHand && customHand.length >= 5 && customHand.length <= 7) {
      finalPlayerHand = [...customHand];
    } else {
      // Fallback
      finalPlayerHand = getOwnedCards().slice(0, 5);
    }

    const playerCardIds = new Set(finalPlayerHand.map((c) => c.id));

    // Computer hand: 5 cards from available card pool, matching selected faction and excluding player's cards
    const availableForCpu = ALL_CARDS.filter((c) => {
      if (playerCardIds.has(c.id)) return false;
      const company = c.series.toLowerCase().includes('street fighter') ? 'Capcom' : 'SNK';
      return allowedFaction === 'Both' || company === allowedFaction;
    });
    const shuffledCpuPool = [...availableForCpu].sort(() => Math.random() - 0.5);
    const finalCpuHand = shuffledCpuPool.slice(0, 5);

    setPlayerHand(finalPlayerHand);
    setCpuHand(finalCpuHand);
    setCurrentScreen('MATCH');

    // Randomly select one of the four legendary Street Fighter II theme tracks before each round
    if (audio.isBGMPlaying()) {
      const battleThemes = ['sf2_guile', 'sf2_ryu', 'sf2_ken', 'sf2_balrog'] as const;
      const selectedTheme = battleThemes[Math.floor(Math.random() * battleThemes.length)];
      audio.startBGM(selectedTheme);
    }
  };

  const handleMatchComplete = (
    winner: PlayerOwner | 'draw',
    playerControlled: number,
    cpuControlled: number
  ) => {
    setLastWinner(winner);
    setLastPlayerCount(playerControlled);
    setLastCpuCount(cpuControlled);

    // Record outcome and calculate progression
    const resultKey = winner === 'player' ? 'win' : winner === 'cpu' ? 'loss' : 'draw';
    const completionData = recordMatchCompletion(resultKey);

    setStats(completionData.updatedStats);
    setLastRewardCard(completionData.earnedCard);
    setLastStreakCard(completionData.streakEarnedCard);
    setWasStreakRewarded(completionData.wasStreakRewarded);

    // Update owned cards if rewards were granted
    refreshOwned();

    setCurrentScreen('RESULTS');

    // Revert back to the Default Menu theme when match ends
    if (audio.isBGMPlaying()) {
      audio.startBGM('menu');
    }
  };

  const handleQuitMatch = () => {
    // Quitting returns to menu without completing match as a win, loss, or draw
    setCurrentScreen('MENU');

    // Revert back to the Default Menu theme when match ends
    if (audio.isBGMPlaying()) {
      audio.startBGM('menu');
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 flex flex-col arcade-grid-bg selection:bg-amber-400 selection:text-slate-950 overflow-x-hidden">
      {/* Immersive Retro Arcade Room Background for non-MENU screens */}
      {currentScreen !== 'MENU' && (
        <>
          <div 
            className="fixed inset-0 z-0 bg-cover bg-center select-none pointer-events-none opacity-65 brightness-[0.7] filter blur-[0.5px]" 
            style={{ backgroundImage: `url(${arcadeRoomBgImg})` }} 
          />
          <div className="fixed inset-0 z-0 pointer-events-none bg-gradient-to-b from-slate-950/15 via-slate-950/50 to-slate-950" />
        </>
      )}

      {/* Toast Notification */}
      {unlockToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-amber-400 text-slate-950 font-arcade text-xs md:text-sm font-bold px-5 py-2.5 rounded-full shadow-[0_0_25px_rgba(245,158,11,0.6)] border-2 border-amber-300 animate-bounce flex items-center gap-2">
          <span>{unlockToast}</span>
        </div>
      )}

      {/* Top Header Navigation */}
      <div className="relative z-10 w-full">
        <HeaderNav
          currentScreen={currentScreen}
          onNavigate={(screen) => setCurrentScreen(screen)}
          onOpenReset={() => setShowResetModal(true)}
          onUnlockAllCards={handleUnlockAll}
        />
      </div>

      {/* Screen Views */}
      <main className="relative z-10 flex-1 w-full">
        {currentScreen === 'MENU' && (
          <MainMenu
            stats={stats}
            onNavigate={(screen) => setCurrentScreen(screen)}
          />
        )}

        {currentScreen === 'SETUP' && (
          <MatchSetup
            ownedCards={ownedCards}
            allowedFaction={matchAllowedFaction}
            onAllowedFactionChange={setMatchAllowedFaction}
            onStartMatch={(diff, mode, customHand) => startMatch(diff, mode, customHand)}
            onBackToMenu={() => setCurrentScreen('MENU')}
          />
        )}

        {currentScreen === 'MATCH' && (
          <MatchScreen
            difficulty={matchDifficulty}
            handMode={matchHandMode}
            initialPlayerCards={playerHand}
            initialCpuCards={cpuHand}
            onMatchComplete={handleMatchComplete}
            onQuitMatch={handleQuitMatch}
          />
        )}

        {currentScreen === 'RESULTS' && (
          <MatchResults
            winner={lastWinner}
            playerControlled={lastPlayerCount}
            cpuControlled={lastCpuCount}
            stats={stats}
            earnedCard={lastRewardCard}
            streakEarnedCard={lastStreakCard}
            wasStreakRewarded={wasStreakRewarded}
            onPlayNextMatch={() => setCurrentScreen('SETUP')}
            onGoToMenu={() => setCurrentScreen('MENU')}
            onGoToCollection={() => setCurrentScreen('COLLECTION')}
          />
        )}

        {currentScreen === 'COLLECTION' && (
          <CardCollection
            key={`collection-${ownedCards.length}`}
            onBackToMenu={() => setCurrentScreen('MENU')}
            onRefreshOwned={refreshOwned}
          />
        )}

        {currentScreen === 'INDEX' && (
          <CharacterIndex
            onBackToMenu={() => setCurrentScreen('MENU')}
            onPlayMatch={() => setCurrentScreen('SETUP')}
          />
        )}

        {currentScreen === 'STATS' && (
          <StatisticsScreen
            stats={stats}
            onBackToMenu={() => setCurrentScreen('MENU')}
            onStatsReset={refreshStats}
            onPlayMatch={() => setCurrentScreen('SETUP')}
          />
        )}
      </main>

      {showResetModal && (
        <ResetConfirmModal
          onConfirm={handleResetConfirm}
          onCancel={() => setShowResetModal(false)}
        />
      )}
    </div>
  );
}
