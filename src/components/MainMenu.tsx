import React from 'react';
import { AppScreen, GameStatistics } from '../types/game';
import { ALL_CARDS } from '../data/cards';
import { getOwnedCardIds } from '../utils/storage';
import { audio } from '../utils/audio';
import { Swords, Layers, BarChart3, Shield, Sparkles, BookOpen } from 'lucide-react';
import centeredCabinetImg from '../assets/images/fully_branded_arcade_cabinet_1790888815903.jpg';

interface MainMenuProps {
  stats: GameStatistics;
  onNavigate: (screen: AppScreen) => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ stats, onNavigate }) => {
  const ownedCount = getOwnedCardIds().length;
  const totalCards = ALL_CARDS.length;

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-start py-8 md:py-12 w-full">
      {/* Subtle surrounding dark retro grid bg */}
      <div className="absolute inset-0 z-0 bg-slate-950 opacity-90 pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 text-center">
        {/* Title & Arcade Branding */}
        <div className="space-y-3 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tactical Triple Triad Card Fighter</span>
          </div>

          <h1 className="font-arcade text-4xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-300 via-amber-400 to-orange-500 tracking-wider drop-shadow-[0_4px_20px_rgba(245,158,11,0.3)]">
            CAPCOM VS SNK TRIAD
          </h1>

          <p className="text-xs md:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
            Choose your legendary team, control the 3×3 tactical board, and battle iconic fighters from Street Fighter, Fatal Fury, Samurai Shodown, and Garou.
          </p>
        </div>

        {/* -------------------------------------------------------------
            CLASSIC RETRO ARCADE CABINET - CENTERED (PLAY AREA WIDTH)
           ------------------------------------------------------------- */}
        <div className="relative w-full max-w-3xl mx-auto my-6 aspect-[4/5] rounded-3xl overflow-hidden border-4 border-slate-800 shadow-[0_25px_60px_rgba(0,0,0,0.95)] flex flex-col justify-between">
          {/* Backdrop Image of the Arcade Cabinet with screen off & joystick/6 buttons at the bottom */}
          <div 
            className="absolute inset-0 z-0 bg-cover bg-center select-none pointer-events-none" 
            style={{ backgroundImage: `url(${centeredCabinetImg})` }} 
          />
          {/* Subtle dark glass CRT reflection overlay on top 62% of screen area */}
          <div className="absolute top-0 inset-x-0 h-[62%] z-0 bg-slate-950/25 pointer-events-none" />

          {/* Top Marquee spacer to avoid overlapping the physical marquee artwork */}
          <div className="relative z-10 w-full h-24 pointer-events-none" />

          {/* MAIN MENU ACTION BUTTONS (Overlaid directly on top of the black turned-off CRT Screen!) */}
          <div className="relative z-10 px-6 sm:px-10 w-full flex-1 flex flex-col justify-center py-4">
            <div className="text-center mb-4">
              <span className="font-arcade text-xs text-amber-400 tracking-widest bg-slate-950/90 px-4 py-1.5 rounded-full border border-slate-800 shadow-md inline-block">
                ★ SELECT YOUR MODE ★
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto w-full">
              {/* Play Action */}
              <button
                onClick={() => {
                  audio.playCardSelect();
                  onNavigate('SETUP');
                }}
                className="group relative p-4 rounded-xl bg-slate-950/90 border border-amber-500/60 hover:border-amber-400 transition-all hover:scale-105 shadow-[0_4px_15px_rgba(245,158,11,0.25)] text-left cursor-pointer flex flex-col justify-between h-28 sm:h-32 w-[80%] mx-auto -top-[5px] sm:-top-2 left-5"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                  <Swords className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <h2 className="font-arcade text-base sm:text-lg font-bold text-amber-400 tracking-wide group-hover:text-amber-300 leading-none">
                    PLAY BATTLE
                  </h2>
                  <p className="text-[9px] sm:text-[10px] text-slate-400 mt-1 sm:mt-1.5 leading-tight">
                    Start custom hand battles vs CPU.
                  </p>
                </div>
              </button>

              {/* Album Collection Action */}
              <button
                onClick={() => {
                  audio.playCardSelect();
                  onNavigate('COLLECTION');
                }}
                className="group relative p-4 rounded-xl bg-slate-950/90 border border-slate-800 hover:border-sky-400 transition-all hover:scale-105 shadow-md text-left cursor-pointer flex flex-col justify-between h-28 sm:h-32 w-[80%] mx-auto -top-[5px] sm:-top-2 -left-5"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform">
                  <Layers className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <h2 className="font-arcade text-base sm:text-lg font-bold text-slate-100 tracking-wide group-hover:text-sky-300 leading-none">
                      COLLECTION
                    </h2>
                  </div>
                  <p className="text-[9px] sm:text-[10px] text-slate-400 mt-1 sm:mt-1.5 leading-tight">
                    Inspect bios & trade cards ({ownedCount}/{totalCards}).
                  </p>
                </div>
              </button>

              {/* Character Index Action */}
              <button
                onClick={() => {
                  audio.playCardSelect();
                  onNavigate('INDEX');
                }}
                className="group relative p-4 rounded-xl bg-slate-950/90 border border-slate-800 hover:border-emerald-400 transition-all hover:scale-105 shadow-md text-left cursor-pointer flex flex-col justify-between h-28 sm:h-32 w-[80%] mx-auto -top-[11px] sm:-top-2 left-5"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <h2 className="font-arcade text-base sm:text-lg font-bold text-slate-100 tracking-wide group-hover:text-emerald-300 leading-none">
                    FIGHTER DEX
                  </h2>
                  <p className="text-[9px] sm:text-[10px] text-slate-400 mt-1 sm:mt-1.5 leading-tight">
                    Browse 97 retro fighter profiles.
                  </p>
                </div>
              </button>

              {/* Statistics Action */}
              <button
                onClick={() => {
                  audio.playCardSelect();
                  onNavigate('STATS');
                }}
                className="group relative p-4 rounded-xl bg-slate-950/90 border border-slate-800 hover:border-purple-400 transition-all hover:scale-105 shadow-md text-left cursor-pointer flex flex-col justify-between h-28 sm:h-32 w-[80%] mx-auto -top-[11px] sm:-top-2 -left-5"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <h2 className="font-arcade text-base sm:text-lg font-bold text-slate-100 tracking-wide group-hover:text-purple-300 leading-none">
                    STATISTICS
                  </h2>
                  <p className="text-[9px] sm:text-[10px] text-slate-400 mt-1 sm:mt-1.5 leading-tight">
                    Record: {stats.wins}W - {stats.losses}L - {stats.draws}D.
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Bottom Control Panel Area (Ensures we keep the joysticks & 6 buttons fully visible and unobstructed at the bottom of the screen!) */}
          <div className="relative z-10 w-full h-32 md:h-40 flex items-end justify-center pb-5 pointer-events-none select-none">
            <div className="px-4 py-1 rounded bg-slate-950/80 border border-slate-800/80 text-[10px] font-arcade text-amber-500 tracking-widest uppercase shadow-md">
              FREE PLAY • PRESS BUTTON TO START
            </div>
          </div>
        </div>

        {/* Rules & Core Appeal Explainer */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-left max-w-3xl mx-auto space-y-4">
          <h3 className="font-arcade text-xl sm:text-2xl font-bold text-slate-200 tracking-wider flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-400" />
            <span>CLASSIC TRIPLE TRIAD RULES</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-400">
            <div className="space-y-1">
              <div className="font-bold text-slate-200 uppercase tracking-wide">3×3 Grid Combat</div>
              <p>Players alternate placing cards onto empty board spaces. Starting player is decided randomly by coin flip.</p>
            </div>
            <div className="space-y-1">
              <div className="font-bold text-slate-200 uppercase tracking-wide">Four-Sided Values</div>
              <p>Cards have Top, Right, Bottom, and Left values (1–9). Strictly higher adjacent touching numbers capture enemy cards.</p>
            </div>
            <div className="space-y-1">
              <div className="font-bold text-slate-200 uppercase tracking-wide">Ownership Resolution</div>
              <p>When all 9 spaces are filled, the fighter controlling the most cards claims victory and earns a new card reward.</p>
            </div>
          </div>
        </div>

        {/* Mandatory Copyright & Trademark Attribution */}
        <footer className="mt-12 pt-6 border-t border-slate-900 text-[10px] text-slate-500 max-w-2xl mx-auto space-y-1">
          <p>
            Street Fighter, Super Street Fighter, Street Fighter Alpha, and Street Fighter III and related characters, logos, and likenesses are trademarks and copyrights of Capcom Co., Ltd.
          </p>
          <p>
            This is a free, non-commercial fan tribute project created for educational and gameplay demonstration, visually inspired by the Udon Street Fighter comic aesthetic. No endorsement, sponsorship, or affiliation is implied.
          </p>
        </footer>
      </div>
    </div>
  );
};
