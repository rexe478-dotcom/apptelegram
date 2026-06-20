import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Header from './components/Header';
import Navbar, { TabType } from './components/Navbar';
import HomeTab from './components/HomeTab';
import HistoryTab from './components/HistoryTab';
import RanksTab from './components/RanksTab';
import ProfileTab from './components/ProfileTab';
import SplashScreen from './components/SplashScreen';
import NotificationsPanel from './components/NotificationsPanel';

import { INITIAL_QUESTIONS, DEFAULT_LEADERBOARD_DAILY, DEFAULT_LEADERBOARD_ALLTIME, DEFAULT_USER, INITIAL_NOTIFICATIONS } from './data';
import { Question, LeaderboardEntry, TelegramUser, Comment, AppNotification } from './types';
import { isSupabaseConfigured } from './lib/supabase';
import { fetchUser, upsertUser, rowToUser } from './lib/db';

export default function App() {
  // Navigation tabs routing
  const [activeTab, setActiveTab] = useState<TabType>('home');

  // Splash Screen Visibility State
  const [showSplash, setShowSplash] = useState<boolean>(true);

  // Notifications Modal/Slide Panel visibility State
  const [showNotifications, setShowNotifications] = useState<boolean>(false);

  // App core persistent states
  const [questions, setQuestions] = useState<Question[]>(() => {
    const cached = localStorage.getItem('streak_questions');
    if (cached) {
      try { return JSON.parse(cached); } catch (e) { console.error(e); }
    }
    return INITIAL_QUESTIONS;
  });

  const [user, setUser] = useState<TelegramUser>(() => {
    const cached = localStorage.getItem('streak_user');
    if (cached) {
      try { return JSON.parse(cached); } catch (e) { console.error(e); }
    }
    return DEFAULT_USER;
  });

  const [leaderboardDaily, setLeaderboardDaily] = useState<LeaderboardEntry[]>(() => {
    const cached = localStorage.getItem('streak_leaderboard_daily');
    if (cached) {
      try { return JSON.parse(cached); } catch (e) { console.error(e); }
    }
    return DEFAULT_LEADERBOARD_DAILY;
  });

  const [leaderboardAllTime, setLeaderboardAllTime] = useState<LeaderboardEntry[]>(() => {
    const cached = localStorage.getItem('streak_leaderboard_alltime');
    if (cached) {
      try { return JSON.parse(cached); } catch (e) { console.error(e); }
    }
    return DEFAULT_LEADERBOARD_ALLTIME;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const cached = localStorage.getItem('streak_notifications');
    if (cached) {
      try { return JSON.parse(cached); } catch (e) { console.error(e); }
    }
    return INITIAL_NOTIFICATIONS;
  });

  // Reference for pixel particle animation canvas
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Sync state to local storage when modified
  useEffect(() => {
    localStorage.setItem('streak_questions', JSON.stringify(questions));
  }, [questions]);

  useEffect(() => {
    localStorage.setItem('streak_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('streak_leaderboard_daily', JSON.stringify(leaderboardDaily));
  }, [leaderboardDaily]);

  useEffect(() => {
    localStorage.setItem('streak_leaderboard_alltime', JSON.stringify(leaderboardAllTime));
  }, [leaderboardAllTime]);

  useEffect(() => {
    localStorage.setItem('streak_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Telegram WebApp Integration & Shell simulation
  useEffect(() => {
    const webapp = (window as any).Telegram?.WebApp;
    if (webapp) {
      try {
        webapp.ready();
        webapp.expand();
        // If Telegram user exists, inject details and sync with Supabase
        const tgUser = webapp.initDataUnsafe?.user;
        if (tgUser) {
          const tgId = String(tgUser.id);
          const tgName = tgUser.username ? `@${tgUser.username}` : `${tgUser.first_name} ${tgUser.last_name || ''}`.trim();

          setUser((prev) => ({
            ...prev,
            telegram_id: tgId,
            username: tgName
          }));

          // Load cloud profile from Supabase (if configured)
          if (isSupabaseConfigured) {
            fetchUser(tgId).then((row) => {
              if (row) {
                // Merge cloud data into local state (cloud wins for persistent fields)
                setUser((prev) => ({ ...prev, ...rowToUser(row) }));
                console.log('[DB] User profile loaded from Supabase');
              } else {
                // First-time user — push local state to cloud
                upsertUser({ telegram_id: tgId, username: tgName, streak: 0, total_votes: 0, badge: 'Rookie Pixel', streakHistory: {} });
                console.log('[DB] New user created in Supabase');
              }
            });
          }
        }
      } catch (e) {
        console.error("Failed to initialize Telegram WebApp SDK:", e);
      }
    }
  }, []);

  // Sync user info into both leaderboards dynamically
  useEffect(() => {
    const updateLeaderboard = (prev: LeaderboardEntry[]) =>
      prev.map((player) => {
        if (player.isCurrentUser || player.username === "You" || player.username === user.username) {
          return {
            ...player,
            username: user.username,
            streak: user.streak,
            tier: user.badge
          };
        }
        return player;
      });

    setLeaderboardDaily(updateLeaderboard);
    setLeaderboardAllTime(updateLeaderboard);
  }, [user.username, user.streak, user.badge]);

  // ─── Debounced Supabase sync: push user changes to cloud ────────
  useEffect(() => {
    if (!isSupabaseConfigured || !user.telegram_id) return;

    const timer = setTimeout(() => {
      upsertUser(user).then((ok) => {
        if (ok) console.log('[DB] User synced to Supabase');
      });
    }, 1500); // 1.5s debounce to batch rapid state changes

    return () => clearTimeout(timer);
  }, [user]);

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
  const handleVote = (questionId: number, option: 'YES' | 'NO', commentText?: string) => {
    // 1. Update matching question metrics
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) => {
        if (q.id === questionId) {
          const yesOffset = option === 'YES' ? 1 : 0;
          const noOffset = option === 'NO' ? 1 : 0;

          // Assemble a newly cast user comment
          const newComment: Comment = {
            id: `c_user_${Date.now()}`,
            username: user.username || 'You',
            vote: option,
            text: commentText || (option === 'YES' ? 'Confirmed my vote sequence!' : 'Alternative route preferred.'),
            timestamp: 'Just now',
            avatar: 'person'
          };

          return {
            ...q,
            yes_count: q.yes_count + yesOffset,
            no_count: q.no_count + noOffset,
            userVoted: option,
            comments: [newComment, ...q.comments]
          };
        }
        return q;
      })
    );

    // 2. Reinforce user streak today automatically if not claimed
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const currentDayName = daysOfWeek[new Date().getDay()];

    setUser((prev) => {
      const isClaimedToday = prev.lastClaimedBonus === new Date().toDateString();
      const updatedHistory = { ...prev.streakHistory, [currentDayName]: true };
      
      return {
        ...prev,
        total_votes: prev.total_votes + 1,
        streakHistory: updatedHistory,
        // Only bump streak if they voted and also haven't reinforced yet
        streak: !isClaimedToday ? prev.streak + 1 : prev.streak,
        lastClaimedBonus: new Date().toDateString()
      };
    });

    // Add a custom notification about streak reinforced
    const newNotif: AppNotification = {
      id: `n_streak_${Date.now()}`,
      title: "Streak Preserved!",
      body: `You voted on question #${questionId} and advanced your streak! 🔥`,
      timestamp: "Just now",
      unread: true,
      type: "streak"
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Allow resetting vote (Revote option helper)
  const handleResetVote = (questionId: number) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) => {
        if (q.id === questionId && q.userVoted) {
          const originalVote = q.userVoted;
          const userCommentId = q.comments.find(c => c.username === user.username || c.username === 'You')?.id;

          return {
            ...q,
            yes_count: Math.max(0, q.yes_count - (originalVote === 'YES' ? 1 : 0)),
            no_count: Math.max(0, q.no_count - (originalVote === 'NO' ? 1 : 0)),
            userVoted: null,
            comments: q.comments.filter(c => c.id !== userCommentId)
          };
        }
        return q;
      })
    );

    setUser((prev) => ({
      ...prev,
      total_votes: Math.max(0, prev.total_votes - 1)
    }));
  };

  // Perform Daily Streak Claim Energy
  const handleClaimBonus = () => {
    const todaysDate = new Date().toDateString();
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const currentDayName = daysOfWeek[new Date().getDay()];

    setUser((prev) => {
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

    const newNotif: AppNotification = {
      id: `n_claim_${Date.now()}`,
      title: "Energy Reactor Engaged",
      body: "Streak status has been secured successfully via claim cell. +1 Flame!",
      timestamp: "Just now",
      unread: true,
      type: "info"
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Update other dynamic profile settings like badge title
  const handleUpdateUser = (updated: Partial<TelegramUser>) => {
    setUser((prev) => ({ ...prev, ...updated }));
  };

  // Admin Question toggle/update handler
  const handleUpdateQuestions = (updated: Question[]) => {
    setQuestions(updated);
  };

  // Complete data reset handler
  const handleResetAllData = () => {
    localStorage.removeItem('streak_questions');
    localStorage.removeItem('streak_user');
    localStorage.removeItem('streak_leaderboard_daily');
    localStorage.removeItem('streak_leaderboard_alltime');
    localStorage.removeItem('streak_notifications');
    setQuestions(INITIAL_QUESTIONS);
    setUser(DEFAULT_USER);
    setLeaderboardDaily(DEFAULT_LEADERBOARD_DAILY);
    setLeaderboardAllTime(DEFAULT_LEADERBOARD_ALLTIME);
    setNotifications(INITIAL_NOTIFICATIONS);
    setActiveTab('home');
  };

  // Notifications toggle helpers
  const handleMarkNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, unread: false }))
    );
  };

  const unreadNotificationsCount = notifications.filter((n) => n.unread).length;

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <div className="relative min-h-screen bg-[#0e0e0e] text-[#e5e2e1] flex flex-col">
      
      {/* Visual scanning CRT lines backdrop */}
      <div className="fixed inset-0 crt-scanline z-50 opacity-[0.14] pointer-events-none"></div>

      {/* Floating vertical pixel rain canvas backdrop */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-15" />

      {/* Structured top header shell */}
      <Header 
        streak={user.streak} 
        onProfileClick={() => setActiveTab('profile')} 
        onNotificationsClick={() => setShowNotifications(true)}
        unreadCount={unreadNotificationsCount}
      />

      {/* Sliding Notifications modal overlay */}
      <AnimatePresence>
        {showNotifications && (
          <NotificationsPanel
            isOpen={showNotifications}
            onClose={() => setShowNotifications(false)}
            notifications={notifications}
            onMarkRead={handleMarkNotificationRead}
            onMarkAllRead={handleMarkAllNotificationsRead}
          />
        )}
      </AnimatePresence>

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
                questions={questions}
                user={user}
                onVote={handleVote}
                onResetVote={handleResetVote}
              />
            )}

            {activeTab === 'history' && (
              <HistoryTab questions={questions} />
            )}

            {activeTab === 'ranks' && (
              <RanksTab
                leaderboardDaily={leaderboardDaily}
                leaderboardAllTime={leaderboardAllTime}
                streak={user.streak}
                lastClaimedBonus={user.lastClaimedBonus}
                onClaimBonus={handleClaimBonus}
                streakHistory={user.streakHistory}
              />
            )}

            {activeTab === 'profile' && (
              <ProfileTab
                user={user}
                questions={questions}
                onUpdateUser={handleUpdateUser}
                onUpdateQuestions={handleUpdateQuestions}
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
