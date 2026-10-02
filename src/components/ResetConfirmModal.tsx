import React from 'react';
import { audio } from '../utils/audio';

interface ResetConfirmModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export const ResetConfirmModal: React.FC<ResetConfirmModalProps> = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border-2 border-rose-600 rounded-2xl p-6 max-w-sm w-full relative shadow-2xl space-y-4">
        <h2 className="font-arcade text-2xl font-bold text-rose-500 tracking-wide">
          WARNING: RESET GAME
        </h2>
        <p className="text-sm text-slate-300">
          Are you sure you want to clear all game progression and stats? This action cannot be undone.
        </p>
        <div className="flex gap-3 pt-2">
          <button
            onClick={() => {
              audio.playCardSelect();
              onCancel();
            }}
            className="flex-1 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm uppercase transition-all"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              audio.playCoinToss();
              onConfirm();
            }}
            className="flex-1 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm uppercase transition-all"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};
