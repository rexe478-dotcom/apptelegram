-- ═══════════════════════════════════════════════════════════════════
-- Streak Mini App — Supabase Database Schema
-- Run this SQL in your Supabase Dashboard > SQL Editor
-- ═══════════════════════════════════════════════════════════════════

-- 1. Users table — stores Telegram user profiles and streak data
create table if not exists users (
  telegram_id    text primary key,
  username       text not null default 'Guest',
  streak         integer not null default 0,
  total_votes    integer not null default 0,
  badge          text not null default 'Rookie Pixel',
  last_claimed_bonus text,
  streak_history jsonb not null default '{}'::jsonb,
  updated_at     timestamptz not null default now()
);

-- 2. Enable Row Level Security (recommended for production)
alter table users enable row level security;

-- 3. RLS Policy: Allow anyone with the anon key to SELECT, INSERT, and UPDATE
--    (The Telegram Mini App runs client-side with the public anon key)
create policy "Allow public read"    on users for select using (true);
create policy "Allow public insert"  on users for insert with check (true);
create policy "Allow public update"  on users for update using (true);

-- Note: For a production app, you should validate the telegram_id against
-- the Telegram initData signature on a server before trusting it.
-- For now, open access is fine for a personal/demo bot.
