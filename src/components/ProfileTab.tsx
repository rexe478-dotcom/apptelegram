import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TelegramUser, Question } from '../types';
import { PixelShieldIcon } from './PixelIcons';

interface ProfileTabProps {
  user: TelegramUser;
  questions: Question[];
  onUpdateUser: (updated: Partial<TelegramUser>) => void;
  onUpdateQuestions: (updated: Question[]) => void;
  onResetAllData: () => void;
}

export default function ProfileTab({ 
  user, 
  questions, 
  onUpdateUser, 
  onUpdateQuestions, 
  onResetAllData 
}: ProfileTabProps) {
  const isAdmin = user.username === '@Temmythegreat' || user.username === 'Temmythegreat' || user.username === 'You';
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(user.username);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Admin New Question Form state
  const [newQText, setNewQText] = useState('');
  const [newQCategory, setNewQCategory] = useState('General');
  const [newQExpiresMinutes, setNewQExpiresMinutes] = useState('120');

  // Badges list
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
    onUpdateUser({ username: cleanName });
    setIsEditingName(false);
  };

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQText.trim()) return;

    const newQuestion: Question = {
      id: Date.now(),
      category: newQCategory,
      question: newQText.trim(),
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
      active: true,
      yes_count: 0,
      no_count: 0,
      expires_at: new Date(Date.now() + parseInt(newQExpiresMinutes) * 60000).toISOString(),
      comments: []
    };

    onUpdateQuestions([newQuestion, ...questions]);
    setNewQText('');
    alert("New Question Injected to Grid!");
  };

  const toggleQuestionActive = (id: number) => {
    const updated = questions.map(q => {
      if (q.id === id) {
        return { ...q, active: !q.active };
      }
      return q;
    });
    onUpdateQuestions(updated);
  };

  const deleteQuestion = (id: number) => {
    if (confirm("Delete this question stream permanently?")) {
      onUpdateQuestions(questions.filter(q => q.id !== id));
    }
  };

  const userVotedQuestions = questions.filter(q => !!q.userVoted);

  return (
    <div className="flex flex-col gap-6 pb-24">
      
      {/* Profile summary screen */}
      <div className="flex flex-col gap-1">
        <h2 className="font-sans text-xl font-bold tracking-wide text-[#e5e2e1]">USER SYNAPSE</h2>
        <p className="text-[#baccb0]/55 font-mono text-[10px] uppercase tracking-[0.2em]">
          CONFIGURE NODE SETTINGS & SYNC USER DATA
        </p>
      </div>

      {/* Profile Card */}
      <section className="pixel-card bg-[#1c1b1b] border-2 border-[#3c4b35] rounded-[4px] p-5 space-y-4 shadow-[4px_4px_0px_rgba(0,0,0,1)] relative overflow-hidden">
        <div className="crt-noise-overlay"></div>
        <div className="flex gap-4 items-center relative z-10">
          
          {/* Neon avatar container */}
          <div className="w-16 h-16 rounded-none bg-[#201f1f] border-2 border-[#39ff14] flex flex-shrink-0 items-center justify-center relative shadow-[3px_3px_0px_#000000]">
            <span className="material-symbols-outlined text-[32px] text-[#39ff14]">
              cognition
            </span>
            <div className="absolute -bottom-2 -right-2 bg-[#39ff14] text-black font-mono font-bold text-[9px] px-1.5 rounded-none border-2 border-black shadow-[1px_1px_0px_rgba(0,0,0,1)]">
              🔥{user.streak}
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
                    className="bg-[#131313] border-2 border-[#39ff14]/50 rounded-none px-2 py-0.5 text-xs font-mono text-[#e5e2e1] max-w-[140px] focus:outline-none focus:border-[#39ff14]"
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
                    {user.username}
                  </h3>
                  <button 
                    onClick={() => {
                      setNewName(user.username);
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
            <p className="font-mono text-xs text-[#ffdb40] uppercase font-bold flex items-center gap-1.5">
              <PixelShieldIcon className="w-3.5 h-3.5 text-[#ffdb40]" />
              {user.badge}
            </p>
          </div>
        </div>

        {/* Change custom title badge matrix */}
        <div className="pt-3 border-t border-[#3c4b35]/25 space-y-2 relative z-10">
          <label className="font-mono text-[9px] text-[#baccb0]/45 uppercase tracking-[0.18em] block font-bold">
            SELECT INJECTED BADGE ACCENT:
          </label>
          <div className="flex flex-wrap gap-2.5 pt-1">
            {availableBadges.map((badge) => {
              const matches = user.badge === badge;
              return (
                <button
                  key={badge}
                  onClick={() => onUpdateUser({ badge })}
                  className={`text-[9px] font-mono px-2 py-1 uppercase rounded-none border-2 font-bold cursor-pointer transition-all duration-75 ${
                    matches
                      ? 'bg-[#ffe16d] text-black border-[#ffdb40] shadow-[2px_2px_0px_#000000] translate-x-[1px] translate-y-[1px]'
                      : 'bg-[#131313] text-[#e5e2e1]/40 border-[#3c4b35] shadow-[2px_2px_0px_#000000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#000000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none'
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
        <div className="bg-[#1c1b1b] border-2 border-[#3c4b35] p-4 rounded-[4px] space-y-1 shadow-[4px_4px_0px_rgba(0,0,0,1)] relative overflow-hidden">
          <div className="crt-noise-overlay"></div>
          <span className="font-mono text-[9px] text-[#baccb0]/55 uppercase tracking-wider block font-bold relative z-10">
            VOTES CAST
          </span>
          <p className="text-2xl font-mono text-[#39ff14] font-bold relative z-10">
            {user.total_votes}
          </p>
          <span className="text-[8px] font-mono text-[#baccb0]/35 block mt-1 relative z-10 uppercase">
            VERIFIED SYNCED NODES
          </span>
        </div>

        <div className="bg-[#1c1b1b] border-2 border-[#3c4b35] p-4 rounded-[4px] space-y-1 shadow-[4px_4px_0px_rgba(0,0,0,1)] relative overflow-hidden">
          <div className="crt-noise-overlay"></div>
          <span className="font-mono text-[9px] text-[#baccb0]/55 uppercase tracking-wider block font-bold relative z-10">
            STREAK DENSITY
          </span>
          <p className="text-2xl font-mono text-[#ffabf3] font-bold relative z-10">
            {user.streak} Days
          </p>
          <span className="text-[8px] font-mono text-[#baccb0]/35 block mt-1 relative z-10 uppercase">
            DEGRADATION RATIO: 0%
          </span>
        </div>
      </section>

      {/* Admin Panel Collapsible Visual */}
      {isAdmin && (
        <section className="bg-[#1c1b1b] border-2 border-[#ffabf3]/40 rounded-[4px] overflow-hidden shadow-[4px_4px_0px_rgba(0,0,0,1)] relative">
          <div className="crt-noise-overlay"></div>
        <button
          onClick={() => setIsAdminOpen(!isAdminOpen)}
          className="w-full p-4 flex justify-between items-center text-left cursor-pointer border-b border-[#3c4b35]/25 relative z-10"
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ffabf3] text-base animate-pulse">settings_input_composite</span>
            <span className="font-sans text-xs font-bold text-[#e5e2e1] uppercase tracking-wider">
              ADMIN CONTROL DECK
            </span>
          </div>
          <span className="material-symbols-outlined text-xs text-[#baccb0]/60">
            {isAdminOpen ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
          </span>
        </button>

        <AnimatePresence>
          {isAdminOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden relative z-10"
            >
              <div className="p-4 space-y-4 bg-[#131313]/60 border-t border-[#3c4b35]/20">
                
                {/* Form to inject questions */}
                <form onSubmit={handleAddQuestion} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="font-mono text-[9px] text-[#ffabf3] font-bold uppercase tracking-wider">
                      INJECT NEW QUESTION STREAM:
                    </label>
                  </div>

                  <input
                    type="text"
                    required
                    placeholder="Enter question text..."
                    value={newQText}
                    onChange={(e) => setNewQText(e.target.value)}
                    className="w-full bg-[#1c1b1b] border-2 border-[#3c4b35] rounded-[4px] p-2 text-xs text-[#e5e2e1] placeholder-[#e5e2e1]/30 focus:outline-none focus:border-[#ffabf3] font-body"
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <span className="font-mono text-[8px] text-[#baccb0]/55 uppercase block">Category:</span>
                      <select
                        value={newQCategory}
                        onChange={(e) => setNewQCategory(e.target.value)}
                        className="w-full bg-[#1c1b1b] border-2 border-[#3c4b35] rounded-[4px] p-1.5 text-xs text-[#e5e2e1] focus:outline-none focus:border-[#ffabf3]"
                      >
                        <option value="Education">Education</option>
                        <option value="Technology & AI">Technology & AI</option>
                        <option value="Gaming & Esports">Gaming & Esports</option>
                        <option value="Space Colonies">Space Colonies</option>
                        <option value="General">General</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <span className="font-mono text-[8px] text-[#baccb0]/55 uppercase block">Expires in:</span>
                      <select
                        value={newQExpiresMinutes}
                        onChange={(e) => setNewQExpiresMinutes(e.target.value)}
                        className="w-full bg-[#1c1b1b] border-2 border-[#3c4b35] rounded-[4px] p-1.5 text-xs text-[#e5e2e1] focus:outline-none focus:border-[#ffabf3]"
                      >
                        <option value="1">1 min (Test)</option>
                        <option value="5">5 mins</option>
                        <option value="60">1 hour</option>
                        <option value="120">2 hours</option>
                        <option value="1440">24 hours</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-[#ffabf3] text-black border-2 border-black rounded-[4px] text-xs font-sans font-bold cursor-pointer shadow-[3px_3px_0px_#000000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                  >
                    INJECT QUESTION
                  </button>
                </form>

                {/* List of current questions with toggles */}
                <div className="space-y-2 pt-2 border-t border-[#3c4b35]/25">
                  <span className="font-mono text-[9px] text-[#baccb0]/55 font-bold uppercase tracking-wider block">
                    ACTIVE SECTORS STREAM:
                  </span>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {questions.map((q) => (
                      <div 
                        key={q.id}
                        className="p-2 bg-[#1c1b1b] border border-[#3c4b35] flex items-center justify-between text-[11px] gap-2 rounded-[2px]"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-[#e5e2e1] font-bold truncate leading-tight">{q.question}</p>
                          <span className="text-[8px] font-mono text-[#baccb0]/50 uppercase">
                            ID: {q.id} | {q.category}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {/* Active switch */}
                          <button
                            onClick={() => toggleQuestionActive(q.id)}
                            className={`px-1.5 py-0.5 text-[8px] font-mono font-bold rounded-[2px] border cursor-pointer ${
                              q.active 
                                ? 'bg-[#39ff14]/15 border-[#39ff14] text-[#39ff14]' 
                                : 'bg-[#ffb4ab]/15 border-[#ffb4ab] text-[#ffb4ab]'
                            }`}
                          >
                            {q.active ? 'ACTIVE' : 'INACTIVE'}
                          </button>
                          
                          {/* Delete */}
                          <button
                            onClick={() => deleteQuestion(q.id)}
                            className="text-[#ffb4ab] hover:text-red-400 material-symbols-outlined text-[14px] cursor-pointer"
                          >
                            delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
      )}

      {/* User Personal Vote Streams */}
      <section className="space-y-3">
        <h3 className="font-mono text-[10px] text-[#e5e2e1]/45 uppercase tracking-[0.25em] flex items-center gap-3">
          PERSONAL VOTING STREAMS
          <span className="flex-grow h-[1px] bg-[#3c4b35]/25"></span>
        </h3>

        <div className="space-y-3">
          {userVotedQuestions.map((q) => (
            <div 
              key={q.id} 
              className="p-3 bg-[#1c1b1b] border-2 border-[#3c4b35] rounded-[4px] space-y-2 shadow-[2px_2px_0px_rgba(0,0,0,1)] relative overflow-hidden"
            >
              <div className="crt-noise-overlay"></div>
              <div className="flex justify-between items-center text-[9px] font-mono relative z-10">
                <span className="text-[#39ff14]/80 font-bold uppercase tracking-wider">{q.category}</span>
                <span className={`font-bold uppercase tracking-wide ${q.userVoted === 'YES' ? 'text-[#39ff14]' : 'text-[#ffabf3]'}`}>
                  VOTED: {q.userVoted}
                </span>
              </div>
              <h4 className="font-sans text-xs font-bold text-[#e5e2e1] relative z-10">
                {q.question}
              </h4>
              <p className="text-[11px] text-[#baccb0]/70 italic font-body relative z-10 leading-normal">
                "{q.comments.find(c => c.username === user.username || c.username === 'You')?.text || 'No comment recorded with this vote sequence.'}"
              </p>
            </div>
          ))}

          {userVotedQuestions.length === 0 && (
            <p className="text-center font-mono text-xs text-[#e5e2e1]/30 py-6 border-2 border-dashed border-[#3c4b35]/35 rounded-[4px] bg-[#1c1b1b]/50">
              No voting entries recorded. Switch to the [Home] terminal to begin.
            </p>
          )}
        </div>
      </section>

      {/* Reset options */}
      {isAdmin && (
        <section className="pt-4 border-t border-[#3c4b35]/25">
          <button
            onClick={() => {
              if (confirm("Resetting database will clear temporary voting register streams. Proceed?")) {
                onResetAllData();
              }
            }}
            className="w-full py-3 bg-[#ffb4ab]/10 hover:bg-[#ffb4ab]/20 text-[#ffb4ab] border-2 border-[#ffb4ab] rounded-[4px] font-mono text-xs font-bold uppercase cursor-pointer shadow-[4px_4px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-[0px_0px_0px_#000000] transition-all"
          >
            RESET APPNODE DATACACHE ↺
          </button>
        </section>
      )}

    </div>
  );
}
