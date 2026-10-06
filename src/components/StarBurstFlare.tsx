import React, { useEffect, useState } from 'react';

interface StarBurstFlareProps {
  onComplete?: () => void;
}

export const StarBurstFlare: React.FC<StarBurstFlareProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, 1800);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[70] flex items-center justify-center overflow-hidden select-none">
      {/* 1. Ultra-Wide Anamorphic Horizontal Flare Streaks */}
      <div className="absolute w-[140vw] h-1.5 bg-gradient-to-r from-transparent via-sky-300 via-white via-amber-200 to-transparent animate-starburst-streak" />
      <div className="absolute w-[120vw] h-8 bg-gradient-to-r from-transparent via-cyan-400/80 via-white/90 via-amber-400/80 to-transparent blur-md animate-starburst-streak" />
      <div className="absolute w-[90vw] h-20 bg-gradient-to-r from-transparent via-amber-500/30 via-white/50 to-transparent blur-xl animate-starburst-streak" />

      {/* 2. Vertical Diffraction Flare Spikes */}
      <div className="absolute w-1.5 h-[90vh] bg-gradient-to-b from-transparent via-cyan-300 via-white via-sky-200 to-transparent animate-starburst-vspike" />
      <div className="absolute w-6 h-[70vh] bg-gradient-to-b from-transparent via-amber-400/70 via-white/80 to-transparent blur-md animate-starburst-vspike" />

      {/* 3. 8-Point Starburst Diffraction Cross Rays */}
      <div className="absolute w-72 h-72 md:w-96 md:h-96 flex items-center justify-center animate-starburst-rays">
        {/* Diagonal Ray 1 */}
        <div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-amber-300 via-white to-transparent rotate-45 blur-[0.5px]" />
        {/* Diagonal Ray 2 */}
        <div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-amber-300 via-white to-transparent -rotate-45 blur-[0.5px]" />
        {/* Secondary Shimmer Diagonal 1 */}
        <div className="absolute w-3/4 h-2 bg-gradient-to-r from-transparent via-cyan-400/60 via-white to-transparent rotate-30 blur-sm" />
        {/* Secondary Shimmer Diagonal 2 */}
        <div className="absolute w-3/4 h-2 bg-gradient-to-r from-transparent via-cyan-400/60 via-white to-transparent -rotate-30 blur-sm" />
      </div>

      {/* 4. Concentric Chromatic Shockwave Halo Ring */}
      <div className="absolute w-80 h-80 md:w-96 md:h-96 rounded-full border border-sky-400/90 shadow-[0_0_40px_rgba(56,189,248,0.8),inset_0_0_30px_rgba(245,158,11,0.6)] animate-starburst-halo" />
      <div className="absolute w-64 h-64 md:w-80 md:h-80 rounded-full border border-amber-300/80 shadow-[0_0_25px_rgba(250,204,21,0.7)] animate-starburst-halo delay-75" />

      {/* 5. Central High-Intensity Radiant Star Core */}
      <div className="relative flex items-center justify-center">
        {/* Outer Radiant Corona */}
        <div className="absolute w-64 h-64 rounded-full bg-gradient-to-r from-amber-400 via-yellow-200 to-cyan-400 blur-2xl animate-starburst-core opacity-80" />
        {/* Mid Energy Core */}
        <div className="absolute w-36 h-36 rounded-full bg-gradient-to-r from-white via-amber-300 to-sky-300 blur-lg animate-starburst-core" />
        {/* White-Hot Epicenter Point */}
        <div className="absolute w-16 h-16 rounded-full bg-white shadow-[0_0_45px_#ffffff,0_0_80px_#f59e0b] animate-starburst-core" />
      </div>

      {/* 6. Cinematic Lens Ghost Orbs / Aperture Reflections */}
      <div className="absolute w-16 h-16 rounded-full border border-cyan-400/60 bg-cyan-400/20 blur-[1px] animate-lens-ghost-1" />
      <div className="absolute w-24 h-24 rounded-full border border-rose-400/50 bg-rose-400/15 blur-[2px] animate-lens-ghost-1 delay-100" />
      <div className="absolute w-12 h-12 rounded-full border border-amber-300/70 bg-amber-400/25 blur-[1px] animate-lens-ghost-2" />
      <div className="absolute w-20 h-20 rounded-full border border-violet-400/40 bg-violet-400/10 blur-sm animate-lens-ghost-2 delay-100" />
    </div>
  );
};
