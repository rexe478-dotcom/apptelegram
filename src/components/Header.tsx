import React from 'react';
import { motion } from 'motion/react';

interface HeaderProps {
  streak: number;
  onProfileClick: () => void;
}

export default function Header({ streak, onProfileClick }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 h-20 bg-[#0e0e0e]/80 backdrop-blur-xl border-b border-[#3c4b35]/30">
      <div className="flex items-center gap-3">
        {/* Animated Fire Icon */}
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            textShadow: [
              "0 0 10px rgba(57, 255, 20, 0.5)",
              "0 0 25px rgba(57, 255, 20, 0.9)",
              "0 0 10px rgba(57, 255, 20, 0.5)"
            ]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="flex items-center justify-center"
        >
          <span 
            className="material-symbols-outlined text-[#39ff14] text-3xl font-variation-settings"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            local_fire_department
          </span>
        </motion.div>
        
        <h1 className="font-sans text-2xl font-bold tracking-tight text-[#e5e2e1] select-none">
          STREAK
        </h1>
      </div>

      {/* Streak Count Badge Link to Profile */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onProfileClick}
        className="bg-[#1c1b1b] px-4 py-1.5 border border-[#39ff14]/40 rounded-full flex items-center gap-2 transition-all duration-75 cursor-pointer shadow-[0_0_15px_rgba(57,255,20,0.1)] hover:border-[#39ff14]"
      >
        <span className="font-mono text-sm text-[#39ff14] font-bold flex items-center gap-1 leading-none">
          🔥 {streak}
        </span>
      </motion.button>
    </header>
  );
}
