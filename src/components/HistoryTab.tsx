import React from 'react';
import { motion } from 'motion/react';
import { Debate } from '../types';

interface HistoryTabProps {
  debates: Debate[];
}

export default function HistoryTab({ debates }: HistoryTabProps) {
  const completedDebates = debates.filter((d) => d.status === 'completed');

  return (
    <div className="flex flex-col gap-6 pb-20">
      
      {/* Category header */}
      <div className="flex flex-col gap-1">
        <h2 className="font-sans text-2xl font-bold text-[#e5e2e1]">Debate Archives</h2>
        <p className="text-[#baccb0]/50 font-mono text-xs uppercase tracking-widest">
          Sectors concluded & logged to node history
        </p>
      </div>

      <div className="space-y-6">
        {completedDebates.map((debate, idx) => {
          const total = debate.yesVotes + debate.noVotes;
          const yesPct = total > 0 ? Math.round((debate.yesVotes / total) * 100) : 50;
          const noPct = 100 - yesPct;
          const winnerOption = yesPct > noPct ? 'YES' : 'NO';
          const winnerPct = Math.max(yesPct, noPct);

          const featuredYes = debate.comments.find((c) => c.vote === 'YES')?.text || "Code compilation completed successfully.";
          const featuredNo = debate.comments.find((c) => c.vote === 'NO')?.text || "Alternative synapse pathway selected.";

          return (
            <motion.div
              key={debate.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-[#1c1b1b]/80 border border-[#3c4b35]/20 rounded-xl p-5 space-y-4 hover:border-[#39ff14]/30 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.3)] group"
            >
              {/* Header meta */}
              <div className="flex justify-between items-center text-[10px] font-mono">
                <span className="text-[#39ff14] uppercase tracking-wider">{debate.category}</span>
                <span className="text-[#baccb0]/40 uppercase">{debate.date || 'SYS_ARCHIVE'}</span>
              </div>

              {/* Title & miniature picture */}
              <div className="flex gap-4 items-center">
                <div className="flex-1 space-y-1">
                  <h3 className="font-sans text-lg font-bold text-[#e5e2e1] leading-snug group-hover:text-[#39ff14]/90 transition-colors">
                    {debate.question}
                  </h3>
                </div>
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-[#201f1f] border border-white/5 flex-shrink-0">
                  <img
                    src={debate.image}
                    alt=""
                    className="w-full h-full object-cover opacity-50 group-hover:opacity-80 transition-opacity duration-300"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              {/* Winner Announcement bar */}
              <div className="p-3 bg-[#131313] border border-[#3c4b35]/10 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#ffdb40] text-sm font-variation-settings" style={{ fontVariationSettings: "'FILL' 1" }}>
                    military_tech
                  </span>
                  <span className="font-mono text-xs text-[#e5e2e1]/70 font-semibold">
                    DECISION: <span className={winnerOption === 'YES' ? 'text-[#39ff14] font-bold' : 'text-[#ffabf3] font-bold'}>{winnerOption}</span>
                  </span>
                </div>
                <span className="text-xs font-mono text-[#ffdb40] font-bold bg-[#ffdb40]/10 px-2 py-0.5 rounded border border-[#ffdb40]/20">
                  {winnerPct}% MAJORITY
                </span>
              </div>

              {/* Voting Splits summary */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-mono text-[#baccb0]/50">
                  <span>YES ({debate.yesVotes.toLocaleString()})</span>
                  <span>NO ({debate.noVotes.toLocaleString()})</span>
                </div>
                <div className="h-1 bg-[#131313] rounded-full overflow-hidden flex">
                  <div className="h-full bg-[#39ff14]" style={{ width: `${yesPct}%` }}></div>
                  <div className="h-full bg-[#ffabf3]" style={{ width: `${noPct}%` }}></div>
                </div>
              </div>

              {/* Consensus Quotes */}
              <div className="pt-2 border-t border-[#3c4b35]/15 space-y-2">
                <div className="text-[11px] leading-relaxed">
                  <span className="text-[#39ff14] font-mono font-bold mr-1">YES OPINION:</span>
                  <span className="text-[#baccb0]/70 italic">"{featuredYes}"</span>
                </div>
                <div className="text-[11px] leading-relaxed">
                  <span className="text-[#ffabf3] font-mono font-bold mr-1">NO OPINION:</span>
                  <span className="text-[#baccb0]/70 italic">"{featuredNo}"</span>
                </div>
              </div>

            </motion.div>
          );
        })}

        {completedDebates.length === 0 && (
          <p className="text-center font-mono text-[#e5e2e1]/30 py-10">No archived nodes cataloged in this server cluster.</p>
        )}
      </div>

    </div>
  );
}
