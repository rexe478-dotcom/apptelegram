import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Question, TelegramUser } from '../types';
import { PixelFireIcon } from './PixelIcons';

interface HomeTabProps {
  questions: Question[];
  user: TelegramUser;
  onVote: (questionId: number, option: 'YES' | 'NO', commentText?: string) => void;
  onResetVote: (questionId: number) => void;
}

function QuestionTimer({ expiresAt }: { expiresAt: string }) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const calculateTime = () => {
      const difference = +new Date(expiresAt) - +new Date();
      if (difference <= 0) {
        setTimeLeft('EXPIRED');
        return;
      }
      const hrs = Math.floor(difference / 3600000);
      const mins = Math.floor((difference % 3600000) / 60000);
      const secs = Math.floor((difference % 60000) / 1000);
      
      if (hrs > 0) {
        setTimeLeft(`${hrs}h ${mins}m`);
      } else {
        setTimeLeft(`${mins}m ${secs}s`);
      }
    };
    
    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  if (timeLeft === 'EXPIRED') {
    return (
      <span className="inline-flex items-center bg-[#ffb4ab]/10 border border-[#ffb4ab]/30 px-2 py-0.5 text-[8px] font-bold text-[#ffb4ab] font-mono tracking-wider rounded-[2px]">
        ⌛ EXPIRED
      </span>
    );
  }

  return (
    <span className="inline-flex items-center bg-[#ffdb40]/10 border border-[#ffdb40]/40 px-2 py-0.5 text-[8px] font-bold text-[#ffdb40] font-mono tracking-wider rounded-[2px] animate-pulse">
      ⌛ {timeLeft}
    </span>
  );
}

function DuelPixelProgressBar({ yesPercentage }: { yesPercentage: number }) {
  const totalBlocks = 20;
  const yesBlocks = Math.round((yesPercentage / 100) * totalBlocks);

  return (
    <div className="h-6 w-full bg-[#131313] border-2 border-black rounded-[4px] p-0.5 flex gap-0.5 shadow-[4px_4px_0px_rgba(0,0,0,1)] relative overflow-hidden">
      {Array.from({ length: totalBlocks }).map((_, idx) => {
        const isYes = idx < yesBlocks;
        return (
          <div
            key={idx}
            className={`flex-1 h-full rounded-[1px] transition-all duration-300 ${
              isYes 
                ? 'bg-[#39ff14] shadow-[0_0_8px_rgba(57,255,20,0.4)]' 
                : 'bg-[#ffabf3] shadow-[0_0_8px_rgba(255,171,243,0.4)]'
            }`}
          />
        );
      })}
    </div>
  );
}

export default function HomeTab({ questions, user, onVote, onResetVote }: HomeTabProps) {
  const activeQuestions = questions.filter((q) => q.active);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Find index of first active question that the user hasn't voted on yet (otherwise show first)
  useEffect(() => {
    const firstUnvoted = activeQuestions.findIndex(q => !q.userVoted);
    if (firstUnvoted !== -1) {
      setCurrentIndex(firstUnvoted);
    } else {
      setCurrentIndex(0);
    }
  }, [questions]);

  const activeQuestion = activeQuestions[currentIndex];

  const [pendingVote, setPendingVote] = useState<'YES' | 'NO' | null>(null);
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [votedChoice, setVotedChoice] = useState<'YES' | 'NO' | null>(null);

  // If there are no active questions, render the Retro Empty State Screen
  if (!activeQuestion) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        {/* Pixel Character Waiting - Retro SVG */}
        <div className="mb-6 relative">
          <svg 
            width="80" 
            height="80" 
            viewBox="0 0 16 16" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="text-[#39ff14] mx-auto filter drop-shadow-[0_0_6px_rgba(57,255,20,0.4)]"
            style={{ imageRendering: 'pixelated' }}
          >
            {/* Retro 8-bit character */}
            <path d="M5 1h6v1H5V1zm-1 1h8v1H4V2zm-1 1h10v3H3V3zm0 3h2v1H3V6zm8 0h2v1h-2V6zm-8 1h12v5H3V7zm2 5h2v3H5v-3zm4 0h2v3H9v-3z" fill="currentColor" />
            {/* Eyes */}
            <path d="M6 4h1v1H6V4zm3 0h1v1H9V4z" fill="#000000" />
            <path d="M5 8h6v1H5V8zm1 1h4v1H6V9z" fill="#ffabf3" />
          </svg>
          {/* Animated glow */}
          <div className="absolute inset-0 bg-[#39ff14]/5 blur-xl -z-10 rounded-full animate-pulse"></div>
        </div>

        <h3 className="font-sans text-xl font-extrabold tracking-wider text-[#e5e2e1] uppercase">
          NEW VOTE COMING SOON
        </h3>
        <p className="mt-2 text-[#baccb0]/60 font-mono text-xs max-w-xs leading-relaxed uppercase">
          The admin core has concluded all sector polls. Stand by for the next block injection.
        </p>

        {/* Action card */}
        <div className="mt-8 p-4 bg-[#1c1b1b] border-2 border-dashed border-[#3c4b35] rounded-[4px] max-w-xs w-full shadow-[3px_3px_0px_#000000]">
          <span className="font-mono text-[9px] text-[#ffdb40] font-bold block mb-1">STREAK SAFE</span>
          <span className="text-[10px] text-[#baccb0]/70 font-body block leading-snug">
            Your current 🔥 {user.streak} day streak will remain preserved until a new poll is broadcast.
          </span>
        </div>
      </div>
    );
  }

  const totalVotes = activeQuestion.yes_count + activeQuestion.no_count;
  const yesPercentage = totalVotes > 0 ? Math.round((activeQuestion.yes_count / totalVotes) * 100) : 50;
  const noPercentage = 100 - yesPercentage;

  const handleVoteSelect = (option: 'YES' | 'NO') => {
    if (activeQuestion.userVoted) return; // Already voted
    setPendingVote(option);
  };

  const handleRegisterVote = () => {
    if (!pendingVote) return;
    setIsSubmitting(true);
    
    // Simulate slight lag for neural registration feel
    setTimeout(() => {
      onVote(activeQuestion.id, pendingVote, commentText.trim() || undefined);
      setVotedChoice(pendingVote);
      setPendingVote(null);
      setCommentText('');
      setIsSubmitting(false);
      setShowCelebration(true); // Trigger Phase 4 Celebration Modal
    }, 800);
  };

  const handleNextQuestion = () => {
    if (currentIndex < activeQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0); // wrap
    }
  };

  const yesVoted = activeQuestion.userVoted === 'YES';
  const yesPending = pendingVote === 'YES';
  const noVoted = activeQuestion.userVoted === 'NO';
  const noPending = pendingVote === 'NO';
  const isVotedAny = !!activeQuestion.userVoted;

  // Active styles for push animation
  let yesBtnClasses = "w-full py-6 flex flex-col items-center gap-2 rounded-[4px] border-2 border-black font-sans font-bold text-lg select-none transition-all duration-75 text-black relative ";
  if (yesVoted) {
    yesBtnClasses += "bg-[#39ff14] border-[#39ff14] translate-x-[4px] translate-y-[4px] shadow-none opacity-100";
  } else if (yesPending) {
    yesBtnClasses += "bg-[#39ff14] translate-x-[2px] translate-y-[2px] shadow-[2px_2px_0px_#000000]";
  } else if (isVotedAny) {
    yesBtnClasses += "bg-[#1c1b1b] border-[#3c4b35] text-[#e5e2e1]/20 shadow-none opacity-30 cursor-not-allowed";
  } else {
    yesBtnClasses += "bg-[#39ff14] shadow-[4px_4px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-[0px_0px_0px_#000000] cursor-pointer";
  }

  let noBtnClasses = "w-full py-6 flex flex-col items-center gap-2 rounded-[4px] border-2 border-black font-sans font-bold text-lg select-none transition-all duration-75 text-black relative ";
  if (noVoted) {
    noBtnClasses += "bg-[#ffabf3] border-[#ffabf3] translate-x-[4px] translate-y-[4px] shadow-none opacity-100";
  } else if (noPending) {
    noBtnClasses += "bg-[#ffabf3] translate-x-[2px] translate-y-[2px] shadow-[2px_2px_0px_#000000]";
  } else if (isVotedAny) {
    noBtnClasses += "bg-[#1c1b1b] border-[#3c4b35] text-[#e5e2e1]/20 shadow-none opacity-30 cursor-not-allowed";
  } else {
    noBtnClasses += "bg-[#ffabf3] shadow-[4px_4px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-[0px_0px_0px_#000000] cursor-pointer";
  }

  return (
    <div className="flex flex-col gap-6 pb-10 relative">
      
      {/* Debates Sector Switcher / Carousel Header */}
      {activeQuestions.length > 1 && (
        <div className="flex justify-between items-center gap-4 bg-[#131313] border-2 border-[#3c4b35] p-2 rounded-[4px] shadow-[3px_3px_0px_rgba(0,0,0,1)] relative z-10">
          <span className="font-mono text-[9px] text-[#baccb0]/55 font-bold uppercase tracking-widest pl-2">
            ACTIVE: SECTOR {currentIndex + 1}/{activeQuestions.length}
          </span>
          <button
            onClick={handleNextQuestion}
            className="px-3 py-1 bg-[#1c1b1b] border border-[#39ff14]/40 text-[#39ff14] font-mono text-[9px] font-bold rounded-[2px] cursor-pointer shadow-[1px_1px_0px_#000000] active:translate-y-[0.5px] uppercase"
          >
            NEXT SECTOR ➔
          </button>
        </div>
      )}

      {/* Meta indicators row */}
      <div className="flex justify-between items-center z-10">
        {/* Live Badge */}
        <div className="inline-flex items-center gap-2 bg-[#ffb4ab]/10 border border-[#ffb4ab]/30 px-3 py-1 rounded-none text-[10px] font-bold text-[#ffb4ab] tracking-[0.2em] uppercase">
          <span className="w-1.5 h-1.5 bg-[#ffb4ab] rounded-none animate-pulse shadow-[0_0_8px_#ffb4ab]"></span>
          LIVE SECTOR
        </div>

        {/* Timer countdown badge */}
        <QuestionTimer expiresAt={activeQuestion.expires_at} />
      </div>

      {/* Primary voting card */}
      <section className="space-y-4 relative">
        <div className="space-y-1">
          <span className="font-mono text-[11px] text-[#39ff14] uppercase tracking-widest font-bold block">
            ID: {String(activeQuestion.id).padStart(2, '0')} // {activeQuestion.category}
          </span>
          
          <div className="flex justify-between items-start gap-4">
            <h2 className="text-headline-lg-mobile sm:text-headline-lg text-[#e5e2e1] flex-grow leading-tight">
              {activeQuestion.question}
            </h2>
            {/* Floating Card Streak counter */}
            <div className="flex items-center gap-1.5 bg-[#131313] px-2.5 py-1 rounded-[4px] border-2 border-[#39ff14] shadow-[2px_2px_0px_#000000] flex-shrink-0 animate-pulse">
              <PixelFireIcon className="w-4 h-4" />
              <span className="font-mono text-[10px] text-[#39ff14] font-extrabold uppercase">
                {user.streak}D
              </span>
            </div>
          </div>
        </div>

        {/* Large pixel card inside card wrapper */}
        <div className="w-full h-52 bg-[#201f1f] border-2 border-[#3c4b35] rounded-[4px] relative overflow-hidden group shadow-[4px_4px_0px_rgba(0,0,0,1)]">
          <div className="crt-noise-overlay"></div>
          {activeQuestion.image && (
            <img
              className="w-full h-full object-cover opacity-50 group-hover:opacity-65 transition-opacity duration-700"
              referrerPolicy="no-referrer"
              src={activeQuestion.image}
              alt=""
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-[#0e0e0e]/20 to-transparent"></div>
          
          {/* Neon scan grids overlay */}
          <div className="absolute inset-0 grid-overlay opacity-5 pointer-events-none"></div>
        </div>
      </section>

      {/* YES and NO Actions */}
      <section className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          
          {/* YES Button */}
          <button
            onClick={() => handleVoteSelect('YES')}
            disabled={isVotedAny}
            className={yesBtnClasses}
          >
            <span className="text-2xl">✅</span>
            <span className="tracking-widest uppercase">YES</span>
            {yesVoted && (
              <span className="absolute top-1.5 right-1.5 text-[8px] font-mono font-bold text-[#053900] bg-black/10 px-1 py-0.5 rounded-none border border-black/20">
                VOTED
              </span>
            )}
          </button>

          {/* NO Button */}
          <button
            onClick={() => handleVoteSelect('NO')}
            disabled={isVotedAny}
            className={noBtnClasses}
          >
            <span className="text-2xl">❌</span>
            <span className="tracking-widest uppercase">NO</span>
            {noVoted && (
              <span className="absolute top-1.5 right-1.5 text-[8px] font-mono font-bold text-[#5b005b] bg-black/10 px-1 py-0.5 rounded-none border border-black/20">
                VOTED
              </span>
            )}
          </button>
        </div>

        {/* Comments Input (Sliding visual) */}
        <AnimatePresence>
          {pendingVote && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-[#131313] border-2 border-[#3c4b35] rounded-[4px] p-4 mt-2 space-y-3 shadow-[4px_4px_0px_rgba(0,0,0,1)] relative overflow-hidden">
                <div className="crt-noise-overlay"></div>
                
                <div className="flex justify-between items-center text-[10px] font-mono text-[#e5e2e1]/70 relative z-10">
                  <span>LEDGER REGISTRATION:</span>
                  <span className={`font-bold ${pendingVote === 'YES' ? 'text-[#39ff14]' : 'text-[#ffabf3]'}`}>
                    {pendingVote}
                  </span>
                </div>
                
                <input
                  type="text"
                  maxLength={100}
                  placeholder={`Broadcast comment... (optional)`}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="w-full bg-[#1c1b1b] border-2 border-[#3c4b35] rounded-[4px] p-2 text-xs text-[#e5e2e1] placeholder-[#e5e2e1]/30 focus:outline-none focus:border-[#39ff14] font-body relative z-10"
                />
                
                <div className="flex gap-3 relative z-10">
                  <button
                    onClick={() => setPendingVote(null)}
                    className="px-4 py-2 bg-[#201f1f] border-2 border-black rounded-[4px] text-xs font-mono font-bold text-[#e5e2e1]/70 cursor-pointer shadow-[3px_3px_0px_#000000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_#000000] active:translate-x-[3px] active:translate-y-[3px] active:shadow-[0px_0px_0px_#000000] transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRegisterVote}
                    disabled={isSubmitting}
                    className="flex-grow py-2 bg-[#39ff14] text-black border-2 border-black rounded-[4px] text-xs font-sans font-bold cursor-pointer shadow-[3px_3px_0px_#000000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_#000000] active:translate-x-[3px] active:translate-y-[3px] active:shadow-[0px_0px_0px_#000000] transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
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

      {/* Live percentage block layout */}
      <section className="space-y-3">
        <div className="flex justify-between items-center text-[10px] font-mono tracking-wide">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-none bg-[#39ff14]"></span>
            <span className="text-[#39ff14] font-bold">{yesPercentage}% AGREE</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[#ffabf3] font-bold">{noPercentage}% DISAGREE</span>
            <span className="w-2 h-2 rounded-none bg-[#ffabf3]"></span>
          </div>
        </div>

        {/* Block representation bar */}
        <DuelPixelProgressBar yesPercentage={yesPercentage} />

        <div className="flex items-center justify-between text-center font-mono text-[9px] text-[#baccb0]/40 tracking-wider">
          <span>NET LEDGER DATA</span>
          <span>{totalVotes.toLocaleString()} VOTES REGISTERED</span>
          {activeQuestion.userVoted ? (
            <button
              onClick={() => onResetVote(activeQuestion.id)}
              className="text-[#ffabf3] hover:text-[#fe00fe] transition-colors font-bold border-b border-[#ffabf3]/30 cursor-pointer uppercase"
            >
              REVOTE ↺
            </button>
          ) : (
            <span>LOCKED SECURELY</span>
          )}
        </div>
      </section>

      {/* Activity comments feed */}
      <section className="space-y-3">
        <h3 className="font-mono text-[10px] text-[#e5e2e1]/45 uppercase tracking-[0.25em] flex items-center gap-3">
          Activity Logs
          <span className="flex-grow h-[1px] bg-[#3c4b35]/25"></span>
        </h3>

        <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
          <AnimatePresence initial={false}>
            {activeQuestion.comments.map((comment) => {
              const bYes = comment.vote === 'YES';
              return (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`flex gap-3 items-center p-3 bg-[#1c1b1b] border-2 border-l-[6px] rounded-[4px] relative overflow-hidden shadow-[2px_2px_0px_rgba(0,0,0,1)] ${
                    bYes ? 'border-[#3c4b35] border-l-[#39ff14]' : 'border-[#3c4b35] border-l-[#ffabf3]'
                  }`}
                >
                  <div className="w-8 h-8 rounded-none bg-[#131313] border-2 border-[#3c4b35] flex-shrink-0 flex items-center justify-center">
                    <span className={`material-symbols-outlined text-[15px] ${
                      bYes ? 'text-[#39ff14]' : 'text-[#ffabf3]'
                    }`}>
                      person
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-[#e5e2e1] font-sans truncate">
                        {comment.username}
                      </span>
                      <span className="text-[8px] font-mono text-[#baccb0]/35">
                        {comment.timestamp}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#baccb0]/80 leading-normal mt-0.5 font-body">
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
          
          {activeQuestion.comments.length === 0 && (
            <p className="text-center font-mono text-xs text-[#e5e2e1]/30 py-4">No data streams received yet for this debate.</p>
          )}
        </div>
      </section>

      {/* Phase 4 Vote Submitted / Celebration State overlay modal */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#0e0e0e]/95 backdrop-blur-xs flex items-center justify-center p-6 z-[999] text-center select-none"
          >
            {/* scanline CRT overlay */}
            <div className="absolute inset-0 crt-scanline z-10 opacity-[0.16] pointer-events-none"></div>
            <div className="crt-noise-overlay"></div>

            {/* Glowing background circles */}
            <div className="absolute w-64 h-64 bg-[#39ff14]/10 rounded-full blur-3xl -z-10 animate-pulse"></div>

            <motion.div
              initial={{ scale: 0.9, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 15 }}
              transition={{ type: 'spring', damping: 20 }}
              className="pixel-card bg-[#1c1b1b] border-2 border-[#39ff14] p-8 max-w-sm w-full space-y-6 shadow-[8px_8px_0px_#000000] relative overflow-hidden"
            >
              <div className="crt-noise-overlay"></div>

              {/* Sparkles checkmark */}
              <div className="flex justify-center">
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ duration: 1, repeat: 1 }}
                  className="w-16 h-16 rounded-none bg-[#39ff14]/15 border-2 border-[#39ff14] text-[#39ff14] flex items-center justify-center"
                >
                  <span className="material-symbols-outlined text-4xl">emoji_events</span>
                </motion.div>
              </div>

              {/* Vote result details */}
              <div className="space-y-2">
                <h3 className="font-sans text-2xl font-extrabold text-[#e5e2e1] uppercase tracking-wider">
                  VOTE REGISTERED!
                </h3>
                
                {/* Streak progression block */}
                <div className="inline-flex items-center gap-2 bg-[#39ff14]/15 border border-[#39ff14]/40 px-4 py-2 rounded-none">
                  <PixelFireIcon className="w-5 h-5 text-[#ffdb40]" />
                  <span className="font-mono text-sm text-[#39ff14] font-extrabold tracking-widest uppercase">
                    +1 STREAK ENERGY!
                  </span>
                </div>
              </div>

              {/* Splits inside celebration screen */}
              <div className="p-4 bg-[#131313] border border-[#3c4b35] rounded-[2px] space-y-2">
                <div className="flex justify-between items-center text-[10px] font-mono font-bold text-[#baccb0]/55 uppercase tracking-wide">
                  <span>AGREEMENT GRID:</span>
                  <span className="text-[#39ff14] font-extrabold">
                    {votedChoice === 'YES' ? yesPercentage : noPercentage}% WITH YOU
                  </span>
                </div>
                <div className="h-2 bg-[#1c1b1b] border border-black overflow-hidden flex">
                  <div className="h-full bg-[#39ff14]" style={{ width: `${yesPercentage}%` }}></div>
                  <div className="h-full bg-[#ffabf3]" style={{ width: `${noPercentage}%` }}></div>
                </div>
              </div>

              <p className="text-[11px] text-[#baccb0]/70 font-body leading-normal uppercase">
                Streak reinforced successfully. Current record: <span className="text-[#ffdb40] font-bold font-mono">🔥 {user.streak} DAYS</span>. Keep it burning daily!
              </p>

              {/* Continue button */}
              <button
                onClick={() => setShowCelebration(false)}
                className="w-full py-3 bg-[#39ff14] text-black border-2 border-black rounded-[4px] font-sans text-xs font-bold uppercase tracking-wider cursor-pointer shadow-[4px_4px_0px_#000000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#000000] transition-all"
              >
                CONTINUE TO DISCUSSIONS ➔
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
