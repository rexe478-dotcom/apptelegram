import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Header from './components/Header';
import Navbar, { TabType } from './components/Navbar';
import HomeTab from './components/HomeTab';
import HistoryTab from './components/HistoryTab';
import RanksTab from './components/RanksTab';
import ProfileTab from './components/ProfileTab';

import { INITIAL_DEBATES, DEFAULT_LEADERBOARD, DEFAULT_USER_PROFILE } from './data';
import { Debate, LeaderboardEntry, UserProfile, Comment } from './types';

export default function App() {
  // Tab routing
  const [activeTab, setActiveTab] = useState<TabType>('home');

  // App core persistent states
  const [debates, setDebates] = useState<Debate[]>(() => {
    const cached = localStorage.getItem('streak_debates');
    if (cached) {
      try { return JSON.parse(cached); } catch (e) { console.error(e); }
    }
    return INITIAL_DEBATES;
  });

  const [profile, setProfile] = useState<UserProfile>(() => {
    const cached = localStorage.getItem('streak_user_profile');
    if (cached) {
      try { return JSON.parse(cached); } catch (e) { console.error(e); }
    }
    return DEFAULT_USER_PROFILE;
  });

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() => {
    const cached = localStorage.getItem('streak_leaderboard');
    if (cached) {
      try { return JSON.parse(cached); } catch (e) { console.error(e); }
    }
    return DEFAULT_LEADERBOARD;
  });

  // Reference for pixel particle animation canvas
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Sync state to local storage when modified
  useEffect(() => {
    localStorage.setItem('streak_debates', JSON.stringify(debates));
  }, [debates]);

  useEffect(() => {
    localStorage.setItem('streak_user_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('streak_leaderboard', JSON.stringify(leaderboard));
  }, [leaderboard]);

  // Sync user info into the leaderboard row dynamically
  useEffect(() => {
    setLeaderboard((prev) =>
      prev.map((player) => {
        if (player.isCurrentUser || player.username === "You" || player.username === profile.username) {
          return {
            ...player,
            username: profile.username,
            streak: profile.streak,
            tier: profile.badge
          };
        }
        return player;
      })
    );
  }, [profile.username, profile.streak, profile.badge]);

  // Cyber Background Pixel particle Drawer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvasRef.current) return;
      width = canvasRef.current.width = window.innerWidth;
      height = canvasRef.current.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particles array
    const particles: { x: number; y: number; size: number; speed: number; alpha: number }[] = [];
    const maxParticles = 30;

    for (let i = 0; i < maxParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() > 0.5 ? 2 : 1,
        speed: 0.3 + Math.random() * 0.7,
        alpha: 0.1 + Math.random() * 0.5
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        ctx.fillStyle = '#39ff14';
        ctx.globalAlpha = p.alpha;
        ctx.fillRect(p.x, p.y, p.size, p.size);

        // Move particle upward
        p.y -= p.speed;

        // Reset particle on escaping screen top
        if (p.y < 0) {
          p.y = height;
          p.x = Math.random() * width;
        }
      });

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  // Handle active vote placement and addition of comments
  const handleVote = (debateId: number, option: 'YES' | 'NO', commentText?: string) => {
    // 1. Update matching debate metrics
    setDebates((prevDebates) =>
      prevDebates.map((d) => {
        if (d.id === debateId) {
          const yesOffset = option === 'YES' ? 1 : 0;
          const noOffset = option === 'NO' ? 1 : 0;

          // Assemble a newly cast user comment
          const newComment: Comment = {
            id: `c_user_${Date.now()}`,
            username: profile.username || 'You',
            vote: option,
            text: commentText || (option === 'YES' ? 'Confirmed my vote sequence!' : 'Alternative route preferred.'),
            timestamp: 'Just now',
            avatar: 'person'
          };

          return {
            ...d,
            yesVotes: d.yesVotes + yesOffset,
            noVotes: d.noVotes + noOffset,
            userVoted: option,
            comments: [newComment, ...d.comments]
          };
        }
        return d;
      })
    );

    // 2. Reinforce user streak today automatically if not claimed
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const currentDayName = daysOfWeek[new Date().getDay()];

    setProfile((prev) => {
      const isClaimedToday = prev.lastClaimedBonus === new Date().toDateString();
      const updatedHistory = { ...prev.streakHistory, [currentDayName]: true };
      
      return {
        ...prev,
        votesCount: prev.votesCount + 1,
        streakHistory: updatedHistory,
        // Only bump streak if they voted and also haven't reinforced yet
        streak: !isClaimedToday ? prev.streak : prev.streak
      };
    });
  };

  // Allow resetting vote (Revote option helper)
  const handleResetVote = (debateId: number) => {
    setDebates((prevDebates) =>
      prevDebates.map((d) => {
        if (d.id === debateId && d.userVoted) {
          const originalVote = d.userVoted;
          const userCommentId = d.comments.find(c => c.username === profile.username || c.username === 'You')?.id;

          return {
            ...d,
            yesVotes: Math.max(0, d.yesVotes - (originalVote === 'YES' ? 1 : 0)),
            noVotes: Math.max(0, d.noVotes - (originalVote === 'NO' ? 1 : 0)),
            userVoted: null,
            comments: d.comments.filter(c => c.id !== userCommentId)
          };
        }
        return d;
      })
    );
  };

  // Perform Daily Streak Claim Energy
  const handleClaimBonus = () => {
    const todaysDate = new Date().toDateString();
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const currentDayName = daysOfWeek[new Date().getDay()];

    setProfile((prev) => {
      const nextStreak = prev.streak + 1;
      const updatedHistory = { ...prev.streakHistory, [currentDayName]: true };

      // Update badge levels on milestone numbers
      let nextBadge = prev.badge;
      if (nextStreak >= 15) nextBadge = "VOID Protocol";
      else if (nextStreak >= 10) nextBadge = "Cyber Elite";
      else if (nextStreak >= 8) nextBadge = "Arcade Master";

      return {
        ...prev,
        streak: nextStreak,
        badge: nextBadge,
        lastClaimedBonus: todaysDate,
        streakHistory: updatedHistory
      };
    });
  };

  // Update other dynamic profile settings like badge title
  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...updated }));
  };

  // Complete data reset handler
  const handleResetAllData = () => {
    localStorage.removeItem('streak_debates');
    localStorage.removeItem('streak_user_profile');
    localStorage.removeItem('streak_leaderboard');
    setDebates(INITIAL_DEBATES);
    setProfile(DEFAULT_USER_PROFILE);
    setLeaderboard(DEFAULT_LEADERBOARD);
    setActiveTab('home');
  };

  return (
    <div className="relative min-h-screen bg-[#0e0e0e] text-[#e5e2e1] flex flex-col">
      
      {/* Visual scanning CRT lines backdrop */}
      <div className="fixed inset-0 crt-scanline z-50 opacity-[0.14] pointer-events-none"></div>

      {/* Floating vertical pixel rain canvas backdrop */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-15" />

      {/* Structured top header shell */}
      <Header streak={profile.streak} onProfileClick={() => setActiveTab('profile')} />

      {/* Primary app content wrapper */}
      <main className="flex-1 w-full max-w-lg mx-auto pt-24 pb-28 px-6 z-10 relative overflow-x-hidden">
        
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10, y: 5 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: -10, y: -5 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            {activeTab === 'home' && (
              <HomeTab
                debates={debates}
                username={profile.username}
                onVote={handleVote}
                onResetVote={handleResetVote}
              />
            )}

            {activeTab === 'history' && (
              <HistoryTab debates={debates} />
            )}

            {activeTab === 'ranks' && (
              <RanksTab
                leaderboard={leaderboard}
                streak={profile.streak}
                lastClaimedBonus={profile.lastClaimedBonus}
                onClaimBonus={handleClaimBonus}
                streakHistory={profile.streakHistory}
              />
            )}

            {activeTab === 'profile' && (
              <ProfileTab
                profile={profile}
                debates={debates}
                onUpdateProfile={handleUpdateProfile}
                onResetAllData={handleResetAllData}
              />
            )}
          </motion.div>
        </AnimatePresence>

      </main>

      {/* Bottom styled footer navigational interface */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
