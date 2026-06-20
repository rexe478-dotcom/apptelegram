import React from 'react';
import { motion } from 'motion/react';
import { Question } from '../types';

interface HistoryTabProps {
  questions: Question[];
}

export default function HistoryTab({ questions }: HistoryTabProps) {
  const completedQuestions = questions.filter((q) => !q.active);

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase();
    } catch (e) {
      return 'SYS_ARCHIVE';
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-24">
      
      {/* Category header */}
      <div className="flex flex-col gap-1">
        <h2 className="font-sans text-xl font-bold tracking-wide text-[#e5e2e1]">DEBATE ARCHIVES</h2>
        <p className="text-[#baccb0]/55 font-mono text-[10px] uppercase tracking-[0.2em]">
          SECTORS CONCLUDED & LOGGED TO NODE HISTORY
        </p>
      </div>

      <div className="space-y-6">
        {completedQuestions.map((q, idx) => {
          const total = q.yes_count + q.no_count;
          const yesPct = total > 0 ? Math.round((q.yes_count / total) * 100) : 50;
          const noPct = 100 - yesPct;
          const winnerOption = yesPct > noPct ? 'YES' : 'NO';
          const winnerPct = Math.max(yesPct, noPct);

          const featuredYes = q.comments.find((c) => c.vote === 'YES')?.text || "Code compilation completed successfully.";
          const featuredNo = q.comments.find((c) => c.vote === 'NO')?.text || "Alternative synapse pathway selected.";

          return (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="pixel-card bg-[#1c1b1b] border-2 border-[#3c4b35] rounded-[4px] p-5 space-y-4 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:border-[#39ff14]/40 hover:shadow-[5px_5px_0px_rgba(0,0,0,1)] transition-all duration-100 group relative"
            >
              {/* CRT Noise texture */}
              <div className="crt-noise-overlay"></div>

              {/* Header meta */}
              <div className="flex justify-between items-center text-[9px] font-mono relative z-10">
                <span className="text-[#39ff14] font-bold uppercase tracking-widest">{q.category}</span>
                <span className="text-[#baccb0]/40 uppercase font-semibold">{formatDate(q.expires_at)}</span>
              </div>

              {/* Title & miniature picture */}
              <div className="flex gap-4 items-center relative z-10">
                <div className="flex-1 space-y-1">
                  <h3 className="font-sans text-base font-bold text-[#e5e2e1] leading-snug group-hover:text-[#39ff14] transition-colors">
                    {q.question}
                  </h3>
                </div>
                {q.image && (
                  <div className="w-14 h-14 rounded-none overflow-hidden bg-[#201f1f] border-2 border-[#3c4b35] flex-shrink-0 shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                    <img
                      src={q.image}
                      alt=""
                      className="w-full h-full object-cover opacity-40 group-hover:opacity-65 transition-opacity duration-300"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}
              </div>

              {/* Winner Announcement bar */}
              <div className="p-3 bg-[#131313] border-2 border-[#3c4b35] rounded-[2px] flex items-center justify-between relative z-10 shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#ffdb40] text-sm font-variation-settings" style={{ fontVariationSettings: "'FILL' 1" }}>
                    military_tech
                  </span>
                  <span className="font-mono text-[10px] text-[#e5e2e1]/70 font-bold uppercase tracking-wider">
                    DECISION: <span className={winnerOption === 'YES' ? 'text-[#39ff14]' : 'text-[#ffabf3]'}>{winnerOption}</span>
                  </span>
                </div>
                <span className="text-[9px] font-mono text-[#ffdb40] font-bold bg-[#ffdb40]/10 px-2 py-0.5 rounded-none border border-[#ffdb40]/30 tracking-wide uppercase">
                  {winnerPct}% MAJORITY
                </span>
              </div>

              {/* Voting Splits summary */}
              <div className="space-y-1.5 relative z-10">
                <div className="flex justify-between text-[9px] font-mono text-[#baccb0]/55 font-bold uppercase tracking-wider">
                  <span>YES ({q.yes_count.toLocaleString()})</span>
                  <span>NO ({q.no_count.toLocaleString()})</span>
                </div>
                <div className="h-2 bg-[#131313] border border-black rounded-none overflow-hidden flex">
                  <div className="h-full bg-[#39ff14]" style={{ width: `${yesPct}%` }}></div>
                  <div className="h-full bg-[#ffabf3]" style={{ width: `${noPct}%` }}></div>
                </div>
              </div>

              {/* Consensus Quotes */}
              <div className="pt-3 border-t border-[#3c4b35]/25 space-y-2 relative z-10">
                <div className="text-[11px] leading-relaxed font-body">
                  <span className="text-[#39ff14] font-mono font-bold mr-1.5 text-[10px] tracking-wide">YES PATH:</span>
                  <span className="text-[#baccb0]/75 italic">"{featuredYes}"</span>
                </div>
                <div className="text-[11px] leading-relaxed font-body">
                  <span className="text-[#ffabf3] font-mono font-bold mr-1.5 text-[10px] tracking-wide">NO PATH:</span>
                  <span className="text-[#baccb0]/75 italic">"{featuredNo}"</span>
                </div>
              </div>

            </motion.div>
          );
        })}

        {completedQuestions.length === 0 && (
          <p className="text-center font-mono text-xs text-[#e5e2e1]/30 py-10">No archived nodes cataloged in this server cluster.</p>
        )}
      </div>

    </div>
  );
}
