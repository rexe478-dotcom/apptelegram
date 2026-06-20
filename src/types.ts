export interface Comment {
  id: string;
  username: string;
  vote: 'YES' | 'NO';
  text: string;
  timestamp: string;
  avatar: string;
}

export interface Debate {
  id: number;
  category: string;
  question: string;
  image: string;
  status: 'live' | 'completed';
  yesVotes: number;
  noVotes: number;
  userVoted?: 'YES' | 'NO' | null;
  date: string;
  comments: Comment[];
}

export interface LeaderboardEntry {
  username: string;
  streak: number;
  rank: number;
  tier: string;
  avatar: string;
  isCurrentUser?: boolean;
}

export interface UserProfile {
  username: string;
  streak: number;
  lastClaimedBonus?: string; // Date string
  badge: string; // Title like 'Cyber Rebel'
  avatarColor: string; // hex or class
  votesCount: number;
  streakHistory: { [key: string]: boolean }; // e.g. {'Monday': true}
}
