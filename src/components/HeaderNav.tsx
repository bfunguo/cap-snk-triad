import React, { useState, useEffect } from 'react';
import { AppScreen } from '../types/game';
import { audio, BGMTrackMeta } from '../utils/audio';
import { Volume2, VolumeX, Music, RotateCcw, Home, SkipForward } from 'lucide-react';

export const CheeseIcon: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M2.5 13.5L18.5 4C20.5 5.5 22 8.5 22 12V18.5C22 19.3 21.3 20 20.5 20H3.5C2.7 20 2 19.3 2 18.5V14.5C2 14 2.2 13.6 2.5 13.5Z" />
    <path d="M2 14.5H22" />
    <circle cx="7" cy="17.5" r="1" fill="currentColor" />
    <circle cx="13" cy="17" r="1.5" fill="currentColor" />
    <circle cx="18.5" cy="16.5" r="1" fill="currentColor" />
    <circle cx="11.5" cy="9.5" r="1.2" fill="currentColor" />
    <circle cx="16.5" cy="8" r="0.8" fill="currentColor" />
  </svg>
);

interface HeaderNavProps {
  currentScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
  onOpenReset: () => void;
  onUnlockAllCards?: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  currentScreen,
  onNavigate,
  onOpenReset,
  onUnlockAllCards,
}) => {
  const [isMuted, setIsMuted] = React.useState<boolean>(() => audio.getMuted());
  const [isBgmOn, setIsBgmOn] = React.useState<boolean>(() => audio.isBGMPlaying());
  const [currentTrack, setCurrentTrack] = useState<BGMTrackMeta>(() => audio.getCurrentTrack());

  useEffect(() => {
    const unsubscribe = audio.onTrackChange((track) => {
      setCurrentTrack(track);
      setIsBgmOn(audio.isBGMPlaying());
    });
    return unsubscribe;
  }, []);

  const handleToggleMute = () => {
    const next = audio.toggleMute();
    setIsMuted(next);
  };

  const handleToggleBgm = () => {
    const next = audio.toggleBGM();
    setIsBgmOn(next);
  };

  const handleNextTrack = () => {
    audio.playCardSelect();
    const next = audio.nextTrack();
    setCurrentTrack(next);
    setIsBgmOn(true);
  };

  return (
    <header className="w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element Brand Zone */}
        {/* Zone 1: Home button (30% smaller) */}
        <button
          onClick={() => {
            audio.playCardSelect();
            onNavigate('MENU');
          }}
          className="p-1.5 rounded-md bg-amber-950 text-amber-400 border border-amber-800 hover:text-amber-200 transition-all cursor-pointer flex items-center justify-center"
          title="Return to Main Menu (Home)"
          aria-label="Home"
        >
          <Home className="w-3.5 h-3.5" />
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="flex items-center gap-2 sm:gap-6 text-sm font-semibold">
          <button
            onClick={() => {
              audio.playCardSelect();
              onNavigate('SETUP');
            }}
            className={`transition-colors py-1 ${
              currentScreen === 'SETUP' || currentScreen === 'MATCH'
                ? 'text-amber-400 border-b-2 border-amber-400'
                : 'text-slate-400 hover:text-slate-100'
            }`}
          >
            Play
          </button>

          <button
            onClick={() => {
              audio.playCardSelect();
              onNavigate('COLLECTION');
            }}
            className={`transition-colors py-1 ${
              currentScreen === 'COLLECTION'
                ? 'text-amber-400 border-b-2 border-amber-400'
                : 'text-slate-400 hover:text-slate-100'
            }`}
          >
            Deck
          </button>

          <button
            onClick={() => {
              audio.playCardSelect();
              onNavigate('INDEX');
            }}
            className={`transition-colors py-1 ${
              currentScreen === 'INDEX'
                ? 'text-amber-400 border-b-2 border-amber-400'
                : 'text-slate-400 hover:text-slate-100'
            }`}
          >
            Index
          </button>

          <button
            onClick={() => {
              audio.playCardSelect();
              onNavigate('STATS');
            }}
            className={`transition-colors py-1 ${
              currentScreen === 'STATS'
                ? 'text-amber-400 border-b-2 border-amber-400'
                : 'text-slate-400 hover:text-slate-100'
            }`}
          >
            Stats
          </button>
        </nav>

        {/* Zone 3: Primary Actions & Audio Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Reset Button (30% smaller) */}
          <button
            onClick={() => {
              audio.playCardSelect();
              onOpenReset();
            }}
            className="px-2 py-1 rounded-md bg-rose-950 text-rose-400 border border-rose-800 hover:text-rose-200 transition-all cursor-pointer flex items-center gap-1 text-xs font-semibold"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>

          {/* Background Music Controls (Toggle & Skip Next) */}
          <div className="flex items-center gap-1">
            <button
              onClick={handleToggleBgm}
              className={`p-1.5 rounded-md border transition-all cursor-pointer ${
                isBgmOn
                  ? 'bg-blue-900/20 text-blue-400 border-blue-800 shadow-[0_0_8px_rgba(59,130,246,0.3)]'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
              title={
                isBgmOn
                  ? `Now Playing: ${currentTrack?.title} (${currentTrack?.game}) • Click to Stop`
                  : 'Start Arcade Synth BGM'
              }
              aria-label={isBgmOn ? `Music playing: ${currentTrack?.title}` : 'Play music'}
            >
              <Music className="w-3.5 h-3.5" />
            </button>

            {isBgmOn && (
              <button
                onClick={handleNextTrack}
                className="p-1.5 rounded-md bg-blue-950/60 text-blue-300 border border-blue-800/80 hover:bg-blue-900/80 hover:text-blue-100 transition-all cursor-pointer shadow-sm animate-in fade-in"
                title={`Next Track in Rotation (${audio.getRemainingInRotationCount()} left in cycle before repeating)`}
                aria-label="Skip to next song in rotation"
              >
                <SkipForward className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Master Sound FX Mute (30% smaller) */}
          <button
            onClick={handleToggleMute}
            className="p-1.5 rounded-md bg-slate-900 hover:bg-slate-800 border border-emerald-500 text-emerald-400 transition-colors cursor-pointer"
            title={isMuted ? 'Audio Muted (Click to Unmute)' : 'Audio Active (Click to Mute)'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
          </button>

          {/* Cheese Unlock Button (30% smaller) */}
          <button
            onClick={() => {
              audio.playCardSelect();
              onUnlockAllCards?.();
            }}
            className="p-1.5 rounded-md bg-amber-950 text-amber-400 border border-amber-800 hover:text-amber-200 hover:bg-amber-900/60 transition-all cursor-pointer flex items-center justify-center shadow-sm"
            title="Cheese Code: Unlock all characters in deck & available for play!"
            aria-label="Unlock all characters in deck"
          >
            <CheeseIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
