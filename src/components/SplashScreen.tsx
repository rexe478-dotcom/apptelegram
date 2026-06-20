import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { PixelFireIcon } from './PixelIcons';

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 2000; // 2 seconds
    const intervalTime = 50;
    const step = 100 / (duration / intervalTime);

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onFinish, 400); // Small pause at 100%
          return 100;
        }
        return prev + step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onFinish]);

  const totalBlocks = 15;
  const activeBlocks = Math.round((progress / 100) * totalBlocks);

  return (
    <div className="fixed inset-0 bg-[#0e0e0e] z-[999] flex flex-col items-center justify-between py-20 px-8 text-center overflow-hidden select-none">
      {/* Scanline CRT overlay */}
      <div className="absolute inset-0 crt-scanline z-10 opacity-[0.16] pointer-events-none"></div>
      <div className="crt-noise-overlay"></div>

      {/* Top spacing */}
      <div></div>

      {/* Core Branding */}
      <div className="flex flex-col items-center gap-6 relative z-20">
        {/* Animated logo box */}
        <motion.div
          animate={{
            scale: [1, 1.08, 1],
            rotate: [0, -3, 3, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-24 h-24 bg-[#1c1b1b] border-4 border-[#39ff14] rounded-[8px] flex items-center justify-center shadow-[6px_6px_0px_#000000] relative group"
        >
          {/* Flame core */}
          <PixelFireIcon className="w-16 h-16 text-[#ffdb40]" />
          
          {/* Neon glow */}
          <div className="absolute inset-0 bg-[#39ff14]/5 blur-xl rounded-[8px] -z-10 animate-pulse"></div>
        </motion.div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="font-sans text-4xl font-extrabold tracking-[0.25em] text-[#e5e2e1] drop-shadow-[0_0_10px_rgba(57,255,20,0.3)]">
            STREAK
          </h1>
          <p className="font-mono text-xs text-[#39ff14] uppercase tracking-[0.2em] font-bold">
            VOTE. BUILD YOUR STREAK.
          </p>
        </div>
      </div>

      {/* Bottom Loading Progress Section */}
      <div className="w-full max-w-xs space-y-4 relative z-20">
        {/* Progress percent */}
        <div className="flex justify-between items-center font-mono text-[10px] text-[#baccb0]/55 uppercase tracking-widest font-bold">
          <span>SYS_BOOT_SEQUENCE:</span>
          <span className="text-[#39ff14]">{Math.min(100, Math.round(progress))}%</span>
        </div>

        {/* Pixel style progress bar */}
        <div className="h-6 w-full bg-[#131313] border-2 border-black rounded-[4px] p-0.5 flex gap-0.5 shadow-[4px_4px_0px_rgba(0,0,0,1)] relative overflow-hidden">
          {Array.from({ length: totalBlocks }).map((_, idx) => {
            const isActive = idx < activeBlocks;
            return (
              <div
                key={idx}
                className={`flex-1 h-full rounded-[1px] transition-all duration-100 ${
                  isActive
                    ? 'bg-[#39ff14] shadow-[0_0_6px_rgba(57,255,20,0.6)]'
                    : 'bg-[#201f1f]'
                }`}
              />
            );
          })}
        </div>

        {/* Skip button for speed */}
        <button
          onClick={onFinish}
          className="text-[9px] font-mono text-[#baccb0]/40 hover:text-[#39ff14] transition-colors border-b border-transparent hover:border-[#39ff14]/40 font-bold uppercase tracking-widest py-1 cursor-pointer"
        >
          SKIP BOOT ➔
        </button>
      </div>
    </div>
  );
}
