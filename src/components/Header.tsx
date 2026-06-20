import React from 'react';
import { motion } from 'motion/react';
import { PixelFireIcon } from './PixelIcons';

interface HeaderProps {
  streak: number;
  onProfileClick: () => void;
  onNotificationsClick: () => void;
  unreadCount: number;
}

export default function Header({ streak, onProfileClick, onNotificationsClick, unreadCount }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 h-20 bg-[#0e0e0e]/85 backdrop-blur-md border-b-2 border-[#39ff14] max-w-lg mx-auto left-1/2 -translate-x-1/2 rounded-b-sm">
      <div className="flex items-center gap-3">
        {/* Animated Pixel Fire Icon */}
        <motion.div
          animate={{
            scale: [1, 1.12, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="flex items-center justify-center text-[#ffdb40]"
        >
          <PixelFireIcon className="w-8 h-8" />
        </motion.div>
        
        <h1 className="font-sans text-xl font-bold tracking-[0.15em] text-[#e5e2e1] select-none">
          STREAK
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Notifications Bell */}
        <button
          onClick={onNotificationsClick}
          className="relative bg-[#1c1b1b] p-2 border-2 border-[#3c4b35] rounded-[4px] cursor-pointer text-[#e5e2e1]/60 hover:text-[#39ff14] hover:border-[#39ff14] transition-all flex items-center justify-center shadow-[2px_2px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#000000]"
        >
          <span className="material-symbols-outlined text-base">notifications</span>
          {unreadCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-[#ffabf3] text-black border border-black font-mono font-bold text-[8px] h-4 min-w-[16px] px-1 flex items-center justify-center rounded-none shadow-[1px_1px_0px_#000000]">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Streak Count Badge Link to Profile (Retro mechanical button) */}
        <button
          onClick={onProfileClick}
          className="bg-[#1c1b1b] px-3 py-1.5 border-2 border-[#39ff14] rounded-[4px] cursor-pointer font-mono text-xs text-[#39ff14] font-bold shadow-[3px_3px_0px_#000000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_#000000] active:translate-x-[3px] active:translate-y-[3px] active:shadow-[0px_0px_0px_#000000] transition-all flex items-center gap-1.5 uppercase tracking-wide"
        >
          <span>SCORE:</span>
          <span className="animate-pulse">{streak}</span>
        </button>
      </div>
    </header>
  );
}

