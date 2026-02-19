-- Badge first-seen tracking per Habbo user (for "new" badges and recency order).
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New query).

create table if not exists public.habbo_user_badges (
  hotel_id text not null,
  habbo_user_id text not null,
  badge_code text not null,
  first_seen_at timestamptz not null default now(),
  first_seen_position int not null default 0,
  last_seen_at timestamptz not null default now(),
  primary key (hotel_id, habbo_user_id, badge_code)
);

create index if not exists idx_habbo_user_badges_lookup
  on public.habbo_user_badges (hotel_id, habbo_user_id, first_seen_at desc, first_seen_position asc);

comment on table public.habbo_user_badges is 'Tracks when we first/last saw each badge per Habbo user for "new" badge UI and recency ordering.';
