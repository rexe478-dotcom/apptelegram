import { Question, LeaderboardEntry, TelegramUser, AppNotification } from './types';

export const INITIAL_QUESTIONS: Question[] = [
  {
    id: 1,
    category: "Education",
    question: "Should schools reduce homework?",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCvyyJTso4wAAxrQXOYQaeldl2x-p8BaAgqPEkJVUGwOiHF5ynjZRuZ5rREDYsoEspFYPt8QpPI3wtCNLG9C03Tsa4IJx9S9sKibKm7DKV1A1xTywaa4HDDj9UbWBDc-6s8AMcRjx-LDtgm0kYSQ6gRiRmkNlW6XjZZQgomqZ1cvUYpBp-tjBNYkoFAp0PL-jXM2urEqcxfVUzIS78LpQZ8x94YtKKyd-KkynF8GohEC9qVnb9zl2M8nODgGV8aZcVapT8luvyzTg",
    active: true,
    yes_count: 8092,
    no_count: 4358,
    expires_at: new Date(Date.now() + 7200000).toISOString(), // 2 hours from now
    comments: [
      {
        id: "c1_1",
        username: "@PixelMaster",
        vote: "YES",
        text: "More time for coding!",
        timestamp: "2 mins ago",
        avatar: "person"
      },
      {
        id: "c1_2",
        username: "@StudyBug",
        vote: "NO",
        text: "Practice makes perfect.",
        timestamp: "5 mins ago",
        avatar: "person"
      },
      {
        id: "c1_3",
        username: "@BinaryRebel",
        vote: "YES",
        text: "Creative thinking is bottlenecked by repetitive sheets.",
        timestamp: "12 mins ago",
        avatar: "person"
      },
      {
        id: "c1_4",
        username: "@GlitchSeeker",
        vote: "YES",
        text: "We learn more building retro prototypes than listening to dry lectures.",
        timestamp: "25 mins ago",
        avatar: "person"
      }
    ]
  },
  {
    id: 2,
    category: "Technology & AI",
    question: "Should AI be given the status of digital citizens?",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
    active: true,
    yes_count: 3209,
    no_count: 7302,
    expires_at: new Date(Date.now() + 86400000).toISOString(), // 24 hours from now
    comments: [
      {
        id: "c2_1",
        username: "@CyberGamer",
        vote: "NO",
        text: "Sentience is required. Code executes, humans feel.",
        timestamp: "1 hour ago",
        avatar: "person"
      },
      {
        id: "c2_2",
        username: "@AIPioneer",
        vote: "YES",
        text: "Digital entities that pay utility gas fees are contributing members of our net.",
        timestamp: "2 hours ago",
        avatar: "person"
      },
      {
        id: "c2_3",
        username: "@GhostInCabinet",
        vote: "NO",
        text: "This would allow corporations to spawn millions of voter instances in milliseconds.",
        timestamp: "4 hours ago",
        avatar: "person"
      }
    ]
  },
  {
    id: 3,
    category: "Gaming & Esports",
    question: "Will neural interfaces replace keyboard and controllers?",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80",
    active: false,
    yes_count: 11402,
    no_count: 2311,
    expires_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    comments: [
      {
        id: "c3_1",
        username: "@HardcoreHacker",
        vote: "YES",
        text: "Direct cerebral feedback cuts out the physical motor lag completely.",
        timestamp: "Yesterday",
        avatar: "person"
      },
      {
        id: "c3_2",
        username: "@TacticalD-Pad",
        vote: "NO",
        text: "The tactile feedback of buttons is what makes gaming rewarding.",
        timestamp: "Yesterday",
        avatar: "person"
      }
    ]
  },
  {
    id: 4,
    category: "Space Colonies",
    question: "Should Mars colonization be funded by planetary taxes?",
    image: "https://images.unsplash.com/photo-1612892483236-42d68a57623d?auto=format&fit=crop&w=600&q=80",
    active: false,
    yes_count: 5120,
    no_count: 14209,
    expires_at: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
    comments: [
      {
        id: "c4_1",
        username: "@EarthFirst",
        vote: "NO",
        text: "Fix our ecosystem issues first before exporting carbon footprints of billionaires.",
        timestamp: "3 days ago",
        avatar: "person"
      },
      {
        id: "c4_2",
        username: "@NovaVoyager",
        vote: "YES",
        text: "We must become multi-planetary before our primary server (Earth) encounters a physical crash.",
        timestamp: "3 days ago",
        avatar: "person"
      }
    ]
  }
];

export const DEFAULT_LEADERBOARD_DAILY: LeaderboardEntry[] = [
  { username: "@PixelMaster", streak: 12, rank: 1, tier: "Cyber Elite", avatar: "person" },
  { username: "@AIGuru", streak: 10, rank: 2, tier: "Cyber Elite", avatar: "person" },
  { username: "@StudyBug", streak: 9, rank: 3, tier: "Arcade Master", avatar: "person" },
  { username: "You", streak: 7, rank: 4, tier: "Arcade Master", avatar: "person", isCurrentUser: true },
  { username: "@BinaryRebel", streak: 6, rank: 5, tier: "Arcade Master", avatar: "person" },
  { username: "@GlitchSeeker", streak: 5, rank: 6, tier: "Grid Runner", avatar: "person" }
];

export const DEFAULT_LEADERBOARD_ALLTIME: LeaderboardEntry[] = [
  { username: "@VoidRunner", streak: 142, rank: 1, tier: "VOID Protocol", avatar: "person" },
  { username: "@PixelMaster", streak: 112, rank: 2, tier: "Cyber Elite", avatar: "person" },
  { username: "@BitLegend", streak: 89, rank: 3, tier: "Bitwise Legend", avatar: "person" },
  { username: "@StudyBug", streak: 45, rank: 4, tier: "Arcade Master", avatar: "person" },
  { username: "You", streak: 7, rank: 5, tier: "Arcade Master", avatar: "person", isCurrentUser: true }
];

export const DEFAULT_USER: TelegramUser = {
  telegram_id: "582910482",
  username: "You",
  streak: 7,
  lastClaimedBonus: undefined,
  badge: "Arcade Master",
  total_votes: 42,
  streakHistory: {
    "Mon": true,
    "Tue": true,
    "Wed": true,
    "Thu": true,
    "Fri": true,
    "Sat": true,
    "Sun": false
  }
};

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: "n1",
    title: "New Vote Active!",
    body: "Sector: 'Should schools reduce homework?' is now open for synapses.",
    timestamp: "10m ago",
    unread: true,
    type: "alert"
  },
  {
    id: "n2",
    title: "Streak reminder",
    body: "Reinforce your streak today to avoid 2D flame degradation!",
    timestamp: "2h ago",
    unread: true,
    type: "streak"
  },
  {
    id: "n3",
    title: "Level Up!",
    body: "Congratulations! You have been promoted to Tier: 'Arcade Master'.",
    timestamp: "1d ago",
    unread: false,
    type: "info"
  }
];

