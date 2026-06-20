export interface Comment {
  id: string;
  username: string;
  vote: 'YES' | 'NO';
  text: string;
  timestamp: string;
  avatar: string;
}

export interface Question {
  id: number;
  question: string;
  active: boolean;
  yes_count: number;
  no_count: number;
  expires_at: string; // ISO string or timestamp
  category: string;
  image?: string;
  userVoted?: 'YES' | 'NO' | null;
  comments: Comment[];
}

export interface Vote {
  user_id: string;
  question_id: number;
  choice: 'YES' | 'NO';
  comment?: string;
}

export interface TelegramUser {
  telegram_id: string;
  username: string;
  streak: number;
  total_votes: number;
  badge: string;
  lastClaimedBonus?: string;
  streakHistory: { [key: string]: boolean };
}

export interface LeaderboardEntry {
  username: string;
  streak: number;
  rank: number;
  tier: string;
  avatar: string;
  isCurrentUser?: boolean;
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  timestamp: string;
  unread: boolean;
  type: 'info' | 'alert' | 'streak';
}

