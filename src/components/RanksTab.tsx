import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LeaderboardEntry } from '../types';

interface RanksTabProps {
  leaderboard: LeaderboardEntry[];
  streak: number;
  lastClaimedBonus?: string;
  onClaimBonus: () => void;
  streakHistory: { [key: string]: boolean };
}

export default function RanksTab({ 
  leaderboard, 
  streak, 
  lastClaimedBonus, 
  onClaimBonus,
  streakHistory 
}: RanksTabProps) {
  const [justClaimed, setJustClaimed] = useState(false);
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

  return (
    <div className="flex flex-col gap-6 pb-20">
      
      {/* Title block */}
      <div className="flex flex-col gap-1">
        <h2 className="font-sans text-2xl font-bold text-[#e5e2e1]">Arcade Rank Terminal</h2>
        <p className="text-[#baccb0]/50 font-mono text-xs uppercase tracking-widest">
          Verify your daily streak logs & climb the net grid
        </p>
      </div>

      {/* Streak Tracker Visual Calendar */}
      <section className="bg-[#1c1b1b] border border-[#3c4b35]/20 rounded-xl p-4 space-y-3">
        <div className="flex justify-between items-center">
          <span className="font-mono text-xs text-[#e5e2e1]/70 font-semibold uppercase tracking-wider">
            SYNAPSE ACTIVITY MATRIX
          </span>
          <span className="font-mono text-[10px] text-[#39ff14]/80">
            🔥 CURRENT STREAK: {streak} DAYS
          </span>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {daysOfWeek.map((day) => {
            const isActive = streakHistory[day];
            return (
              <div 
                key={day} 
                className="flex flex-col items-center p-2 bg-[#131313] border border-[#3c4b35]/10 rounded-lg group hover:border-[#39ff14]/20 transition-all duration-150"
              >
                <span className="text-[9px] font-mono font-semibold text-[#baccb0]/50 uppercase">
                  {day}
                </span>
                
                <div className="mt-1.5 flex items-center justify-center">
                  {isActive ? (
                    <motion.span 
                      initial={{ scale: 0.5 }}
                      animate={{ scale: 1 }}
                      className="text-lg text-[#39ff14] select-none"
                    >
                      🔥
                    </motion.span>
                  ) : (
                    <span 
                      className="material-symbols-outlined text-[#e5e2e1]/10 text-base font-variation-settings"
                      style={{ fontVariationSettings: "'FILL' 0" }}
                    >
                      circle
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Interactive Boost Container */}
      <section className="relative overflow-hidden bg-[#201f1f] border border-[#3c4b35]/30 rounded-xl p-5 flex flex-col sm:flex-row items-center gap-4 justify-between shadow-[0_0_20px_rgba(57,255,20,0.05)]">
        
        {/* Glow backdrop decorative */}
        <div className="absolute right-0 top-0 w-32 h-32 bg-[#39ff14]/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="space-y-1 text-center sm:text-left">
          <h4 className="font-sans text-base font-bold text-[#e5e2e1]">
            Daily Energy Reactor
          </h4>
          <p className="text-xs text-[#baccb0]/60 max-w-sm">
            Charge your core cells once every 24 hours to reinforce your streak status against degradation.
          </p>
        </div>

        <div className="flex-shrink-0 w-full sm:w-auto">
          <button
            onClick={handleClaim}
            disabled={isClaimedToday}
            className={`w-full sm:px-5 py-3 rounded font-sans text-xs font-bold uppercase tracking-wider transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 cursor-pointer ${
              isClaimedToday
                ? 'bg-[#131313]/55 border border-[#3c4b35]/20 text-[#e5e2e1]/30 cursor-not-allowed'
                : 'bg-[#39ff14] text-[#053900] hover:brightness-110 shadow-[0_0_15px_rgba(57,255,20,0.2)]'
            }`}
          >
            {isClaimedToday ? (
              <>
                <span className="material-symbols-outlined text-[14px]">lock</span>
                REACTOR SECURED Today
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[16px] animate-bounce">bolt</span>
                CLAIM DAILY BOOST
              </>
            )}
          </button>
        </div>

        {/* Claim animation alert overlay */}
        <AnimatePresence>
          {justClaimed && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0 bg-[#0e0e0e]/95 flex flex-col items-center justify-center rounded-xl border border-[#39ff14]/30"
            >
              <div className="flex flex-col items-center space-y-2 text-center p-4">
                <span className="material-symbols-outlined text-[#39ff14] text-5xl animate-spin">
                  sync
                </span>
                <p className="font-mono text-sm text-[#39ff14] font-bold">
                  SYS_SYNC: REACTOR ENGAGED!
                </p>
                <p className="text-xs text-[#e5e2e1] max-w-xs">
                  Your daily streak has been reinforced. Flame upgraded +1! 🔥
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Leaderboard Section */}
      <section className="space-y-3">
        <h3 className="font-mono text-xs text-[#e5e2e1]/50 uppercase tracking-[0.3em] flex items-center gap-3">
          Grid Standings
          <span className="flex-grow h-[1px] bg-[#3c4b35]/20"></span>
        </h3>

        <div className="bg-[#1c1b1b]/50 border border-[#3c4b35]/15 rounded-xl overflow-hidden divide-y divide-[#3c4b35]/10">
          {leaderboard.map((player) => {
            const isMe = player.username === "You" || player.isCurrentUser;
            let stripeClass = "border-l-2 border-transparent";
            
            if (isMe) stripeClass = "border-l-2 border-[#39ff14] bg-[#39ff14]/5";

            return (
              <div
                key={player.username}
                className={`flex items-center justify-between p-3.5 transition-all text-sm ${stripeClass}`}
              >
                {/* Left Side: Rank and User name */}
                <div className="flex items-center gap-3">
                  <span className={`w-6 text-center font-mono text-xs font-bold ${
                    player.rank === 1 ? 'text-[#ffdb40]' :
                    player.rank === 2 ? 'text-[#e5e2e1]/80' :
                    player.rank === 3 ? 'text-[#ffabf3]' : 'text-[#baccb0]/40'
                  }`}>
                    #{player.rank}
                  </span>

                  {/* Avatar box */}
                  <div className={`w-8 h-8 rounded flex items-center justify-center border ${
                    isMe ? 'border-[#39ff14]/30 bg-[#39ff14]/10 text-[#39ff14]' : 'border-[#3c4b35]/20 bg-[#201f1f] text-[#ffabf3]'
                  }`}>
                    <span className="material-symbols-outlined text-[15px] font-variation-settings" style={{ fontVariationSettings: "'FILL' 1" }}>
                      person
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className={`font-sans font-bold text-xs ${isMe ? 'text-[#39ff14]' : 'text-[#e5e2e1]'}`}>
                      {player.username} {isMe && "(You)"}
                    </span>
                    <span className="text-[10px] font-mono text-[#baccb0]/40 uppercase leading-none mt-0.5">
                      {player.tier}
                    </span>
                  </div>
                </div>

                {/* Right Side: Streak count */}
                <div className="flex items-center gap-1 bg-[#131313] px-2.5 py-1 rounded border border-[#3c4b35]/20">
                  <span className="font-mono text-xs text-[#e5e2e1] font-bold">
                    🔥 {player.streak}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
