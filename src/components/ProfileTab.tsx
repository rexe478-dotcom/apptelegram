import React, { useState } from 'react';
import { motion } from 'motion/react';
import { UserProfile, Debate } from '../types';

interface ProfileTabProps {
  profile: UserProfile;
  debates: Debate[];
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onResetAllData: () => void;
}

export default function ProfileTab({ profile, debates, onUpdateProfile, onResetAllData }: ProfileTabProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(profile.username);
  
  // Badges lists
  const availableBadges = [
    "Arcade Master",
    "Cyber Rebel",
    "Grid Runner",
    "VOID Protocol",
    "Bitwise Legend"
  ];

  const handleSaveName = () => {
    let cleanName = newName.trim();
    if (!cleanName) return;
    if (!cleanName.startsWith('@')) {
      cleanName = '@' + cleanName;
    }
    onUpdateProfile({ username: cleanName });
    setIsEditingName(false);
  };

  // Find user voted debates
  const userVotedDebates = debates.filter(d => !!d.userVoted);

  return (
    <div className="flex flex-col gap-6 pb-20">
      
      {/* Profile summary screen */}
      <div className="flex flex-col gap-1">
        <h2 className="font-sans text-2xl font-bold text-[#e5e2e1]">User Synapse</h2>
        <p className="text-[#baccb0]/50 font-mono text-xs uppercase tracking-widest">
          Configure node settings & synchronize user records
        </p>
      </div>

      {/* Profile Card */}
      <section className="bg-[#1c1b1b] border border-[#3c4b35]/20 rounded-xl p-5 space-y-4">
        <div className="flex gap-4 items-center">
          
          {/* Neon avatar container */}
          <div className="w-16 h-16 rounded-xl bg-[#201f1f] border border-[#39ff14]/30 flex flex-shrink-0 items-center justify-center relative shadow-[0_0_15px_rgba(57,255,20,0.1)]">
            <span className="material-symbols-outlined text-[32px] text-[#39ff14]">
              cognition
            </span>
            <div className="absolute -bottom-1.5 -right-1.5 bg-[#39ff14] text-[#053900] font-mono font-bold text-[9px] px-1.5 rounded-full border border-[#0e0e0e] shadow">
              🔥{profile.streak}
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center gap-2">
              {isEditingName ? (
                <div className="flex gap-2 w-full">
                  <input
                    type="text"
                    maxLength={15}
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="bg-[#131313] border border-[#39ff14]/40 rounded px-2 py-0.5 text-xs font-mono text-[#e5e2e1] max-w-[150px]"
                  />
                  <button 
                    onClick={handleSaveName}
                    className="text-[#39ff14] material-symbols-outlined text-sm font-bold cursor-pointer"
                  >
                    done
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h3 className="font-sans text-base font-bold text-[#e5e2e1] truncate">
                    {profile.username}
                  </h3>
                  <button 
                    onClick={() => {
                      setNewName(profile.username);
                      setIsEditingName(true);
                    }}
                    className="text-[#baccb0]/40 hover:text-[#39ff14] material-symbols-outlined text-sm cursor-pointer"
                  >
                    edit
                  </button>
                </div>
              )}
            </div>

            {/* Custom user badge */}
            <p className="font-mono text-xs text-[#ffdb40]/90 uppercase font-bold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-xs">shield</span>
              {profile.badge}
            </p>
          </div>
        </div>

        {/* Change custom title badge matrix */}
        <div className="pt-3 border-t border-[#3c4b35]/15 space-y-2">
          <label className="font-mono text-[10px] text-[#baccb0]/40 uppercase tracking-widest block font-semibold">
            SELECT INJECTED BADGE ACCENT:
          </label>
          <div className="flex flex-wrap gap-1.5">
            {availableBadges.map((badge) => {
              const matches = profile.badge === badge;
              return (
                <button
                  key={badge}
                  onClick={() => onUpdateProfile({ badge })}
                  className={`text-[9px] font-mono px-2 py-1 uppercase rounded border font-semibold cursor-pointer ${
                    matches
                      ? 'bg-[#ffe16d]/10 text-[#ffe16d] border-[#ffe16d]/30'
                      : 'bg-[#131313] text-[#e5e2e1]/40 border-white/5 hover:text-[#e5e2e1]/60'
                  }`}
                >
                  {badge}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Cyber Statistics Grid */}
      <section className="grid grid-cols-2 gap-4">
        <div className="bg-[#1c1b1b]/50 border border-[#3c4b35]/15 p-4 rounded-xl space-y-1">
          <span className="font-mono text-[10px] text-[#baccb0]/40 uppercase tracking-wider block">
            LEDGER VOTES CAST
          </span>
          <p className="text-2xl font-mono text-[#39ff14] font-bold">
            {profile.votesCount + userVotedDebates.length}
          </p>
          <span className="text-[9px] font-mono text-[#baccb0]/30 block mt-1">
            VERIFIED SYNCED NODES
          </span>
        </div>

        <div className="bg-[#1c1b1b]/50 border border-[#3c4b35]/15 p-4 rounded-xl space-y-1">
          <span className="font-mono text-[10px] text-[#baccb0]/40 uppercase tracking-wider block">
            STREAK DENSITY
          </span>
          <p className="text-2xl font-mono text-[#ffabf3] font-bold">
            {profile.streak} Days
          </p>
          <span className="text-[9px] font-mono text-[#baccb0]/30 block mt-1">
            ACTIVE CORROSION RATIO: 0%
          </span>
        </div>
      </section>

      {/* User Personal Debate Registrations */}
      <section className="space-y-3">
        <h3 className="font-mono text-xs text-[#e5e2e1]/50 uppercase tracking-[0.3em] flex items-center gap-3">
          PERSONAL VOTING STREAMS
          <span className="flex-grow h-[1px] bg-[#3c4b35]/20"></span>
        </h3>

        <div className="space-y-3">
          {userVotedDebates.map((d) => (
            <div 
              key={d.id} 
              className="p-3 bg-[#131313] border border-[#3c4b35]/20 rounded-xl space-y-2"
            >
              <div className="flex justify-between items-center text-[10px] font-mono">
                <span className="text-[#39ff14]/80">{d.category}</span>
                <span className={`font-bold ${d.userVoted === 'YES' ? 'text-[#39ff14]' : 'text-[#ffabf3]'}`}>
                  {d.userVoted}
                </span>
              </div>
              <h4 className="font-sans text-xs font-bold text-[#e5e2e1]">
                {d.question}
              </h4>
              <p className="text-[11px] text-[#baccb0]/60 italic font-body">
                "{d.comments.find(c => c.username === profile.username || c.username === 'You')?.text || 'No comment recorded with this vote sequence.'}"
              </p>
            </div>
          ))}

          {userVotedDebates.length === 0 && (
            <p className="text-center font-mono text-xs text-[#e5e2e1]/30 py-6 border border-dashed border-[#3c4b35]/15 rounded-xl">
              No voting entries recorded. Switch to the [Home] terminal to begin.
            </p>
          )}
        </div>
      </section>

      {/* Reset options */}
      <section className="pt-4 border-t border-[#3c4b35]/15">
        <button
          onClick={() => {
            if (confirm("Resetting database will clear temporary voting register streams. Proceed?")) {
              onResetAllData();
            }
          }}
          className="w-full py-3 bg-[#ffb4ab]/5 hover:bg-[#ffb4ab]/10 text-[#ffb4ab] border border-[#ffb4ab]/20 hover:border-[#ffb4ab]/40 rounded font-mono text-xs font-bold uppercase transition-all duration-150 cursor-pointer"
        >
          RESET APPNODE DATACACHE ↺
        </button>
      </section>

    </div>
  );
}
