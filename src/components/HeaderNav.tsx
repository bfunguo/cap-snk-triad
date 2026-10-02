import React from 'react';
import { AppScreen } from '../types/game';
import { audio } from '../utils/audio';
import { Volume2, VolumeX, Music, Swords, RotateCcw, Home } from 'lucide-react';

interface HeaderNavProps {
  currentScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
  onOpenReset: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({ currentScreen, onNavigate, onOpenReset }) => {
  const [isMuted, setIsMuted] = React.useState<boolean>(() => audio.getMuted());
  const [isBgmOn, setIsBgmOn] = React.useState<boolean>(() => audio.isBGMPlaying());

  const handleToggleMute = () => {
    const next = audio.toggleMute();
    setIsMuted(next);
  };

  const handleToggleBgm = () => {
    const next = audio.toggleBGM();
    setIsBgmOn(next);
  };

  return (
    <header className="w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element Brand Zone */}
        {/* Zone 1: Home button */}
        <button
          onClick={() => {
            audio.playCardSelect();
            onNavigate('MENU');
          }}
          className="p-2 rounded-lg bg-amber-950 text-amber-400 border border-amber-800 hover:text-amber-200 transition-all cursor-pointer"
        >
          <Home className="w-5 h-5" />
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
        <div className="flex items-center gap-2">
          {/* Reset Button (Moved before Music) */}
          <button
            onClick={() => {
              audio.playCardSelect();
              onOpenReset();
            }}
            className="p-2 rounded-lg bg-rose-950 text-rose-400 border border-rose-800 hover:text-rose-200 transition-all cursor-pointer flex items-center gap-1.5 text-sm font-semibold"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>

          {/* Background Music Toggle (Blue) */}
          <button
            onClick={handleToggleBgm}
            className={`p-2 rounded-lg border transition-all cursor-pointer ${
              isBgmOn
                ? 'bg-blue-900/20 text-blue-400 border-blue-800 shadow-[0_0_10px_rgba(59,130,246,0.3)]'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
            title={isBgmOn ? 'Arcade Synth BGM Playing (Click to Stop)' : 'Start Arcade Synth BGM'}
          >
            <Music className="w-4 h-4" />
          </button>

          {/* Master Sound FX Mute (Green outline) */}
          <button
            onClick={handleToggleMute}
            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-emerald-500 text-emerald-400 transition-colors cursor-pointer"
            title={isMuted ? 'Audio Muted (Click to Unmute)' : 'Audio Active (Click to Mute)'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Quick Play CTA (Yellow) */}
          {currentScreen !== 'MATCH' && currentScreen !== 'SETUP' && (
            <button
              onClick={() => {
                audio.playCardSelect();
                onNavigate('SETUP');
              }}
              className="hidden sm:flex items-center gap-1.5 p-2 rounded-lg bg-amber-950 text-amber-400 border border-amber-800 hover:text-amber-200 transition-all cursor-pointer ml-2 text-sm font-semibold"
            >
              <Swords className="w-4 h-4" />
              <span>Fight</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
