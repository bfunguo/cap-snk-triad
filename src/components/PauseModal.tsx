import React from 'react';
import { Volume2, VolumeX, Play, LogOut } from 'lucide-react';
import { audio } from '../utils/audio';

interface PauseModalProps {
  onResume: () => void;
  onQuit: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  onResume,
  onQuit,
  isMuted,
  onToggleMute,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
      <div className="bg-slate-900 border-2 border-slate-700 rounded-2xl p-6 md:p-8 max-w-sm w-full text-center shadow-2xl">
        <h2 className="font-arcade text-4xl font-bold text-amber-400 tracking-wider mb-2">
          GAME PAUSED
        </h2>
        <p className="text-xs text-slate-400 mb-6">
          The match is held in place. Quitting will not record a win, loss, or draw.
        </p>

        <div className="space-y-3">
          <button
            onClick={onResume}
            className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center justify-center gap-2 transition-all shadow-lg active:scale-98"
          >
            <Play className="w-5 h-5 fill-current" />
            <span className="font-arcade text-xl tracking-wider uppercase">RESUME MATCH</span>
          </button>

          <button
            onClick={onToggleMute}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium flex items-center justify-center gap-2 transition-colors border border-slate-700 text-sm"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            <span>{isMuted ? 'Unmute Audio' : 'Mute Master Audio'}</span>
          </button>

          <button
            onClick={onQuit}
            className="w-full py-2.5 px-4 rounded-xl bg-rose-950/50 hover:bg-rose-900/60 text-rose-300 font-medium flex items-center justify-center gap-2 transition-colors border border-rose-800/60 text-sm"
          >
            <LogOut className="w-4 h-4" />
            <span>Quit to Main Menu</span>
          </button>
        </div>
      </div>
    </div>
  );
};
