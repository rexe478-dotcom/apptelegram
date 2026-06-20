import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Debate, Comment } from '../types';

interface HomeTabProps {
  debates: Debate[];
  username: string;
  onVote: (debateId: number, option: 'YES' | 'NO', commentText?: string) => void;
  onResetVote: (debateId: number) => void;
}

export default function HomeTab({ debates, username, onVote, onResetVote }: HomeTabProps) {
  const liveDebates = debates.filter((d) => d.status === 'live');
  const [selectedDebateIndex, setSelectedDebateIndex] = useState(0);
  const activeDebate = liveDebates[selectedDebateIndex] || liveDebates[0];

  const [pendingVote, setPendingVote] = useState<'YES' | 'NO' | null>(null);
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!activeDebate) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <span className="material-symbols-outlined text-[#39ff14] text-5xl mb-4 animate-pulse">
          error
        </span>
        <p className="text-[#e5e2e1]/60 font-mono">No live debates active in the sector.</p>
      </div>
    );
  }

  const totalVotes = activeDebate.yesVotes + activeDebate.noVotes;
  const yesPercentage = totalVotes > 0 ? Math.round((activeDebate.yesVotes / totalVotes) * 100) : 50;
  const noPercentage = 100 - yesPercentage;

  const handleVoteSelect = (option: 'YES' | 'NO') => {
    if (activeDebate.userVoted) return; // Already voted
    setPendingVote(option);
  };

  const handleRegisterVote = () => {
    if (!pendingVote) return;
    setIsSubmitting(true);
    
    // Simulate slight lag for neural registration feel
    setTimeout(() => {
      onVote(activeDebate.id, pendingVote, commentText.trim() || undefined);
      setPendingVote(null);
      setCommentText('');
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <div className="flex flex-col gap-8 pb-10">
      
      {/* Debates Sector Switcher */}
      {liveDebates.length > 1 && (
        <div className="flex gap-2 p-1 bg-[#131313] border border-[#3c4b35]/20 rounded-lg">
          {liveDebates.map((d, index) => (
            <button
              key={d.id}
              onClick={() => {
                setSelectedDebateIndex(index);
                setPendingVote(null);
                setCommentText('');
              }}
              className={`flex-1 py-2 text-xs font-mono rounded transition-all char-spacing-wide font-bold uppercase ${
                selectedDebateIndex === index
                  ? 'bg-[#1c1b1b] text-[#39ff14] border border-[#39ff14]/30'
                  : 'text-[#e5e2e1]/40 hover:text-[#e5e2e1]/80 hover:bg-[#1c1b1b]/50'
              }`}
            >
              Debate {String(index + 1).padStart(2, '0')}
            </button>
          ))}
        </div>
      )}

      {/* Live Badge */}
      <div className="flex justify-start">
        <div className="inline-flex items-center gap-2 bg-[#ffb4ab]/10 border border-[#ffb4ab]/20 px-3 py-1 rounded-sm text-[10px] font-bold text-[#ffb4ab] tracking-[0.2em] uppercase">
          <span className="w-1.5 h-1.5 bg-[#ffb4ab] rounded-full animate-pulse shadow-[0_0_8px_#ffb4ab]"></span>
          Live Debate
        </div>
      </div>

      {/* Topic Details Section */}
      <section className="space-y-4">
        <div className="space-y-2">
          <span className="font-mono text-[11px] text-[#39ff14] uppercase tracking-widest opacity-80 block">
            {String(activeDebate.id).padStart(2, '0')} / {activeDebate.category}
          </span>
          <h2 className="font-sans text-3xl font-bold text-[#e5e2e1] leading-[1.1] tracking-tight">
            {activeDebate.question}
          </h2>
        </div>

        {/* Dynamic Canvas Image */}
        <div className="w-full h-56 bg-[#201f1f] border border-[#3c4b35]/20 rounded-xl relative overflow-hidden group">
          <img
            className="w-full h-full object-cover opacity-60 group-hover:opacity-90 transition-opacity duration-700"
            referrerPolicy="no-referrer"
            src={activeDebate.image}
            alt={activeDebate.question}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-transparent to-transparent"></div>
        </div>
      </section>

      {/* Vote Action Box */}
      <section className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          
          {/* YES Button */}
          <button
            onClick={() => handleVoteSelect('YES')}
            disabled={!!activeDebate.userVoted}
            className={`group relative bg-[#1c1b1b] rounded-xl py-6 flex flex-col items-center gap-3 active-scale transition-all overflow-hidden border ${
              activeDebate.userVoted === 'YES'
                ? 'border-[#39ff14] ring-2 ring-[#39ff14]/20 shadow-[0_0_15px_rgba(57,255,20,0.25)]'
                : pendingVote === 'YES'
                ? 'border-[#39ff14]/70 ring-1 ring-[#39ff14]/20 shadow-[0_0_10px_rgba(57,255,20,0.15)] bg-[#39ff14]/5'
                : 'border-[#39ff14]/20 hover:border-[#39ff14]/55 hover:shadow-[0_0_12px_rgba(57,255,20,0.1)]'
            }`}
          >
            <div className="absolute inset-0 bg-[#39ff14]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <span className={`text-3xl filter transition-all ${
              activeDebate.userVoted === 'YES' || pendingVote === 'YES' ? 'grayscale-0' : 'grayscale group-hover:grayscale-0'
            }`}>
              ✅
            </span>
            <span className="font-sans text-lg font-bold tracking-widest text-[#39ff14]/90">YES</span>
            {activeDebate.userVoted === 'YES' && (
              <span className="absolute top-2 right-2 text-[9px] font-mono font-bold text-[#39ff14] bg-[#39ff14]/10 px-1.5 py-0.5 rounded border border-[#39ff14]/20">
                ACTIVE
              </span>
            )}
          </button>

          {/* NO Button */}
          <button
            onClick={() => handleVoteSelect('NO')}
            disabled={!!activeDebate.userVoted}
            className={`group relative bg-[#1c1b1b] rounded-xl py-6 flex flex-col items-center gap-3 active-scale transition-all overflow-hidden border ${
              activeDebate.userVoted === 'NO'
                ? 'border-[#ffabf3] ring-2 ring-[#ffabf3]/20 shadow-[0_0_15px_rgba(254,0,254,0.25)]'
                : pendingVote === 'NO'
                ? 'border-[#ffabf3]/70 ring-1 ring-[#ffabf3]/20 shadow-[0_0_10px_rgba(254,0,254,0.15)] bg-[#ffabf3]/5'
                : 'border-[#ffabf3]/20 hover:border-[#ffabf3]/55 hover:shadow-[0_0_12px_rgba(254,0,254,0.1)]'
            }`}
          >
            <div className="absolute inset-0 bg-[#ffabf3]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <span className={`text-3xl filter transition-all ${
              activeDebate.userVoted === 'NO' || pendingVote === 'NO' ? 'grayscale-0' : 'grayscale group-hover:grayscale-0'
            }`}>
              ❌
            </span>
            <span className="font-sans text-lg font-bold tracking-widest text-[#ffabf3]/90">NO</span>
            {activeDebate.userVoted === 'NO' && (
              <span className="absolute top-2 right-2 text-[9px] font-mono font-bold text-[#ffabf3] bg-[#ffabf3]/10 px-1.5 py-0.5 rounded border border-[#ffabf3]/20">
                ACTIVE
              </span>
            )}
          </button>
        </div>

        {/* Pending Vote Form */}
        <AnimatePresence>
          {pendingVote && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-[#131313] border border-[#3c4b35]/40 rounded-xl p-4 mt-2 space-y-3 shadow-inner">
                <div className="flex justify-between items-center text-xs font-mono text-[#e5e2e1]/70">
                  <span>REGISTRATION LEDGER TYPE:</span>
                  <span className={`font-bold ${pendingVote === 'YES' ? 'text-[#39ff14]' : 'text-[#ffabf3]'}`}>
                    {pendingVote}
                  </span>
                </div>
                
                <input
                  type="text"
                  maxLength={100}
                  placeholder={`Optional: Comment why you voted ${pendingVote}...`}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="w-full bg-[#1c1b1b] border border-[#3c4b35]/20 rounded p-2 text-sm text-[#e5e2e1] placeholder-[#e5e2e1]/30 focus:outline-none focus:border-[#39ff14] focus:ring-1 focus:ring-[#39ff14]/30 font-body"
                />
                
                <div className="flex gap-2">
                  <button
                    onClick={() => setPendingVote(null)}
                    className="px-3 bg-[#1c1b1b] hover:bg-[#201f1f] text-xs font-mono font-bold border border-white/10 rounded cursor-pointer text-[#e5e2e1]/60"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRegisterVote}
                    disabled={isSubmitting}
                    className="flex-grow py-2 bg-[#39ff14] text-[#053900] font-sans font-bold rounded text-sm hover:brightness-110 active:scale-95 transition-all shadow-[0_0_15px_rgba(57,255,20,0.3)] cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-[#053900] border-t-transparent rounded-full animate-spin"></span>
                        SYNCHRONIZING...
                      </>
                    ) : (
                      'REGISTER VOTE'
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Refined Stats Display */}
      <section className="space-y-4">
        <div className="flex justify-between items-center text-[12px] font-mono tracking-tighter">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#39ff14]"></span>
            <span className="text-[#39ff14] font-bold">{yesPercentage}% AGREE</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#ffabf3] font-bold">{noPercentage}% DISAGREE</span>
            <span className="w-2 h-2 rounded-full bg-[#ffabf3]"></span>
          </div>
        </div>

        {/* Minimal Progress Bar with Neon Shadows */}
        <div className="h-2 w-full bg-[#353534]/30 rounded-full overflow-hidden flex border border-[#3c4b35]/15">
          <motion.div
            initial={{ width: '50%' }}
            animate={{ width: `${yesPercentage}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full bg-[#39ff14] shadow-[0_0_10px_rgba(57,255,20,0.5)]"
          />
          <motion.div
            initial={{ width: '50%' }}
            animate={{ width: `${noPercentage}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full bg-[#ffabf3] shadow-[0_0_10px_rgba(254,0,254,0.5)]"
          />
        </div>

        <div className="flex items-center justify-between text-center font-mono text-[10px] text-[#baccb0]/40 tracking-[0.15em]">
          <span>NET LEDGER DATA</span>
          <span>{totalVotes.toLocaleString()} VOTES REGISTERED</span>
          {activeDebate.userVoted ? (
            <button
              onClick={() => onResetVote(activeDebate.id)}
              className="text-[#ffabf3] hover:text-[#fe00fe] transition-colors font-bold underline leading-none uppercase tracking-[0.1em] cursor-pointer"
            >
              REVOTE ↺
            </button>
          ) : (
            <span>LOCKED SECURELY</span>
          )}
        </div>
      </section>

      {/* Minimal Activity Feed */}
      <section className="space-y-4">
        <h3 className="font-mono text-xs text-[#e5e2e1]/50 uppercase tracking-[0.3em] flex items-center gap-3">
          Activity
          <span className="flex-grow h-[1px] bg-[#3c4b35]/20"></span>
        </h3>

        <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
          <AnimatePresence initial={false}>
            {activeDebate.comments.map((comment) => {
              const bYes = comment.vote === 'YES';
              return (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, x: bYes ? -15 : 15, y: -5 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={`flex gap-3 items-center p-3 bg-[#1c1b1b]/50 border-l rounded-r-lg ${
                    bYes ? 'border-[#39ff14]/50' : 'border-[#ffabf3]/50'
                  }`}
                >
                  {/* Cyber avatar box */}
                  <div className="w-8 h-8 rounded bg-[#353534] border border-[#3c4b35]/30 flex-shrink-0 flex items-center justify-center">
                    <span className={`material-symbols-outlined text-[15px] ${
                      bYes ? 'text-[#39ff14]' : 'text-[#ffabf3]'
                    }`}>
                      person
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-[#e5e2e1] font-sans truncate">
                        {comment.username}
                      </span>
                      <span className="text-[9px] font-mono text-[#baccb0]/40">
                        {comment.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-[#baccb0] leading-relaxed mt-0.5 font-body">
                      voted{' '}
                      <span className={`font-bold ${bYes ? 'text-[#39ff14]' : 'text-[#ffabf3]'}`}>
                        {comment.vote}
                      </span>{' '}
                      — "{comment.text}"
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          
          {activeDebate.comments.length === 0 && (
            <p className="text-center font-mono text-xs text-[#e5e2e1]/30 py-4">No data streams received yet for this debate.</p>
          )}
        </div>
      </section>

    </div>
  );
}
