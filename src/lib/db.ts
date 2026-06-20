import { supabase, isSupabaseConfigured } from './supabase';
import type { TelegramUser } from '../types';

// ─── Database Row Types ───────────────────────────────────────────
export interface UserRow {
  telegram_id: string;
  username: string;
  streak: number;
  total_votes: number;
  badge: string;
  last_claimed_bonus: string | null;
  streak_history: Record<string, boolean>;
  updated_at: string;
}

// ─── Fetch user from Supabase ─────────────────────────────────────
export async function fetchUser(telegramId: string): Promise<UserRow | null> {
  if (!isSupabaseConfigured || !supabase) return null;

  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('telegram_id', telegramId)
      .single();

    if (error && error.code === 'PGRST116') {
      // Row not found — user doesn't exist yet
      return null;
    }
    if (error) {
      console.error('[DB] Error fetching user:', error.message);
      return null;
    }
    return data as UserRow;
  } catch (err) {
    console.error('[DB] fetchUser exception:', err);
    return null;
  }
}

// ─── Upsert (insert or update) user in Supabase ──────────────────
export async function upsertUser(user: TelegramUser): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;

  try {
    const row: UserRow = {
      telegram_id: user.telegram_id,
      username: user.username,
      streak: user.streak,
      total_votes: user.total_votes,
      badge: user.badge,
      last_claimed_bonus: user.lastClaimedBonus || null,
      streak_history: user.streakHistory,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('users')
      .upsert(row, { onConflict: 'telegram_id' });

    if (error) {
      console.error('[DB] Error upserting user:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[DB] upsertUser exception:', err);
    return false;
  }
}

// ─── Convert a DB row back into TelegramUser app type ─────────────
export function rowToUser(row: UserRow): Partial<TelegramUser> {
  return {
    telegram_id: row.telegram_id,
    username: row.username,
    streak: row.streak,
    total_votes: row.total_votes,
    badge: row.badge,
    lastClaimedBonus: row.last_claimed_bonus || undefined,
    streakHistory: row.streak_history || {},
  };
}
