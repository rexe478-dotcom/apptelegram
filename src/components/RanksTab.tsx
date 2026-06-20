import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LeaderboardEntry } from '../types';
import { PixelFireIcon } from './PixelIcons';

interface RanksTabProps {
  leaderboardDaily: LeaderboardEntry[];
  leaderboardAllTime: LeaderboardEntry[];
  streak: number;
  lastClaimedBonus?: string;
  onClaimBonus: () => void;
  streakHistory: { [key: string]: boolean };
}

export default function RanksTab({ 
  leaderboardDaily,
  leaderboardAllTime,
  streak, 
  lastClaimedBonus, 
  onClaimBonus,
  streakHistory 
}: RanksTabProps) {
  const [justClaimed, setJustClaimed] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'daily' | 'alltime'>('daily');
  
  const todaysDate = new Date().toDateString();
  const isClaimedToday = lastClaimedBonus === todaysDate;

  // Render calendar days
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const handleClaim = () => {
    if (isClaimedToday) return;
    setJustClaimed(true);
    onClaimBonus();
    setTimeout(() => {
      setJustClaimed(false);
    }, 3000);
  };

  const activeLeaderboard = activeSubTab === 'daily' ? leaderboardDaily : leaderboardAllTime;

  return (
    <div className="flex flex-col gap-6 pb-24">
      
      {/* Title block */}
      <div className="flex flex-col gap-1">
        <h2 className="font-sans text-xl font-bold tracking-wide text-[#e5e2e1]">RANK TERMINAL</h2>
        <p className="text-[#baccb0]/55 font-mono text-[10px] uppercase tracking-[0.2em]">
          VERIFY STREAK MATRIX & CLIMB THE GRID
        </p>
      </div>

      {/* Streak Tracker Visual Calendar (Pixel styled panel) */}
      <section className="bg-[#1c1b1b] border-2 border-[#3c4b35] rounded-[4px] p-4 space-y-3 shadow-[4px_4px_0px_rgba(0,0,0,1)] relative overflow-hidden">
        <div className="crt-noise-overlay"></div>
        <div className="flex justify-between items-center relative z-10">
          <span className="font-mono text-[10px] text-[#e5e2e1]/75 font-bold uppercase tracking-wider">
            SYNAPSE ACTIVITY MATRIX
          </span>
          <span className="font-mono text-[10px] text-[#39ff14] font-bold uppercase tracking-wider">
            STREAK: {streak} DAYS
          </span>
        </div>

        <div className="grid grid-cols-7 gap-2 relative z-10">
          {daysOfWeek.map((day) => {
            const isActive = streakHistory[day];
            return (
              <div 
                key={day} 
                className={`flex flex-col items-center p-2 bg-[#131313] border-2 rounded-[4px] shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-all duration-100 ${
                  isActive ? 'border-[#39ff14]/50' : 'border-[#3c4b35]/65'
                }`}
              >
                <span className="text-[9px] font-mono font-bold text-[#baccb0]/60 uppercase">
                  {day}
                </span>
                
                <div className="mt-2.5 flex items-center justify-center h-5 w-5">
                  {isActive ? (
                    <PixelFireIcon className="w-5 h-5" />
                  ) : (
                    <span className="w-1.5 h-1.5 bg-[#e5e2e1]/10 rounded-none border border-[#e5e2e1]/20"></span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Interactive Boost Container */}
      <section className="pixel-card bg-[#1c1b1b] border-2 border-[#3c4b35] rounded-[4px] p-5 flex flex-col sm:flex-row items-center gap-4 justify-between shadow-[4px_4px_0px_rgba(0,0,0,1)] relative overflow-hidden">
        
        {/* Glow backdrop decorative */}
        <div className="absolute right-0 top-0 w-32 h-32 bg-[#39ff14]/5 rounded-full blur-3xl pointer-events-none z-0"></div>
        <div className="crt-noise-overlay"></div>

        <div className="space-y-1 text-center sm:text-left relative z-10">
          <h4 className="font-sans text-base font-bold text-[#e5e2e1] uppercase tracking-wide">
            ENERGY REACTOR
          </h4>
          <p className="text-[11px] text-[#baccb0]/70 max-w-sm font-body leading-normal">
            Charge your core cells once every 24 hours to reinforce your streak status against degradation.
          </p>
        </div>

        <div className="flex-shrink-0 w-full sm:w-auto relative z-10">
          <button
            onClick={handleClaim}
            disabled={isClaimedToday}
            className={`w-full sm:px-5 py-3 rounded-[4px] border-2 border-black font-sans text-xs font-bold uppercase tracking-wider transition-all duration-75 flex items-center justify-center gap-2 cursor-pointer ${
              isClaimedToday
                ? 'bg-[#131313] text-[#e5e2e1]/30 border-[#3c4b35] cursor-not-allowed shadow-none'
                : 'bg-[#39ff14] text-black shadow-[4px_4px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-[0px_0px_0px_#000000]'
            }`}
          >
            {isClaimedToday ? (
              <>
                <span className="material-symbols-outlined text-[14px]">lock</span>
                REACTOR SECURED
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[15px] animate-bounce">bolt</span>
                CLAIM ENERGY BOOST
              </>
            )}
          </button>
        </div>

        {/* Claim animation alert overlay */}
        <AnimatePresence>
          {justClaimed && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-0 bg-[#0e0e0e]/95 flex flex-col items-center justify-center rounded-none border-2 border-[#39ff14] z-20"
            >
              <div className="flex flex-col items-center space-y-2 text-center p-4">
                <PixelFireIcon className="w-12 h-12" />
                <p className="font-mono text-sm text-[#39ff14] font-bold tracking-wider">
                  SYS_SYNC: REACTOR ENGAGED!
                </p>
                <p className="text-[11px] text-[#e5e2e1] max-w-xs font-body">
                  Your daily streak has been reinforced. Flame upgraded +1! 🔥
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Leaderboard Section */}
      <section className="space-y-4">
        {/* Header and Toggle Button Group */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
          <h3 className="font-mono text-[10px] text-[#e5e2e1]/45 uppercase tracking-[0.25em] flex items-center gap-3 flex-1">
            Grid Standings
            <span className="flex-grow h-[1px] bg-[#3c4b35]/25"></span>
          </h3>
          
          {/* Daily vs All Time selector (Pixel button group style) */}
          <div className="flex p-0.5 bg-[#131313] border-2 border-[#3c4b35] rounded-[4px] self-start shadow-[2px_2px_0px_rgba(0,0,0,1)]">
            <button
              onClick={() => setActiveSubTab('daily')}
              className={`px-3 py-1 text-[9px] font-mono font-bold uppercase rounded-[2px] cursor-pointer transition-all duration-75 ${
                activeSubTab === 'daily'
                  ? 'bg-[#39ff14] text-black shadow-[1px_1px_0px_rgba(0,0,0,1)]'
                  : 'text-[#e5e2e1]/40 hover:text-[#e5e2e1]/70'
              }`}
            >
              DAILY
            </button>
            <button
              onClick={() => setActiveSubTab('alltime')}
              className={`px-3 py-1 text-[9px] font-mono font-bold uppercase rounded-[2px] cursor-pointer transition-all duration-75 ${
                activeSubTab === 'alltime'
                  ? 'bg-[#39ff14] text-black shadow-[1px_1px_0px_rgba(0,0,0,1)]'
                  : 'text-[#e5e2e1]/40 hover:text-[#e5e2e1]/70'
              }`}
            >
              ALL-TIME
            </button>
          </div>
        </div>

        {/* Board table container */}
        <div className="bg-[#1c1b1b] border-2 border-[#3c4b35] rounded-[4px] overflow-hidden divide-y-2 divide-[#3c4b35] shadow-[4px_4px_0px_rgba(0,0,0,1)] relative">
          <div className="crt-noise-overlay"></div>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSubTab}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15 }}
              className="divide-y-2 divide-[#3c4b35]"
            >
              {activeLeaderboard.map((player) => {
                const isMe = player.username === "You" || player.isCurrentUser;
                let stripeClass = "relative z-10 border-l-4 border-l-transparent";
                
                if (isMe) stripeClass = "relative z-10 border-l-4 border-l-[#39ff14] bg-[#39ff14]/5";

                // Trophies styling
                let trophyColor = "";
                let showTrophy = false;
                if (player.rank === 1) { trophyColor = "text-[#ffdb40]"; showTrophy = true; }
                else if (player.rank === 2) { trophyColor = "text-[#e5e2e1]/80"; showTrophy = true; }
                else if (player.rank === 3) { trophyColor = "text-[#ffabf3]"; showTrophy = true; }

                return (
                  <div
                    key={player.username}
                    className={`flex items-center justify-between p-3.5 transition-all text-sm ${stripeClass}`}
                  >
                    {/* Left Side: Rank and User name */}
                    <div className="flex items-center gap-3">
                      <div className="w-6 flex items-center justify-center">
                        {showTrophy ? (
                          <span className={`material-symbols-outlined text-base ${trophyColor} font-variation-settings`} style={{ fontVariationSettings: "'FILL' 1" }}>
                            emoji_events
                          </span>
                        ) : (
                          <span className="font-mono text-xs font-bold text-[#baccb0]/40">
                            #{player.rank}
                          </span>
                        )}
                      </div>

                      {/* Avatar box */}
                      <div className={`w-8 h-8 rounded-none flex items-center justify-center border-2 ${
                        isMe ? 'border-[#39ff14] bg-[#39ff14]/15 text-[#39ff14]' : 'border-[#3c4b35] bg-[#201f1f] text-[#ffabf3]'
                      }`}>
                        <span className="material-symbols-outlined text-[15px] font-variation-settings" style={{ fontVariationSettings: "'FILL' 1" }}>
                          person
                        </span>
                      </div>

                      <div className="flex flex-col">
                        <span className={`font-sans font-bold text-xs ${isMe ? 'text-[#39ff14]' : 'text-[#e5e2e1]'}`}>
                          {player.username} {isMe && "(You)"}
                        </span>
                        <span className="text-[9px] font-mono text-[#baccb0]/55 uppercase leading-none mt-0.5 font-bold">
                          {player.tier}
                        </span>
                      </div>
                    </div>

                    {/* Right Side: Streak count */}
                    <div className="flex items-center gap-1.5 bg-[#131313] px-2.5 py-1 rounded-[2px] border-2 border-[#3c4b35] shadow-[1px_1px_0px_rgba(0,0,0,1)]">
                      <PixelFireIcon className="w-3.5 h-3.5" />
                      <span className="font-mono text-xs text-[#e5e2e1] font-bold">
                        {player.streak}
                      </span>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

    </div>
  );
}
