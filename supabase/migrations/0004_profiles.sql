-- GoodbyeDebt — "Debt Slayers" social layer: profiles + community leaderboard
-- Additive to the core engine. Privacy-first: the base table is owner-only, and
-- the public leaderboard is exposed through a function that returns ONLY safe
-- columns — never a user's actual debt amounts.

create table if not exists public.profiles (
  user_id             uuid primary key references auth.users (id) on delete cascade,
  display_name        text not null default '',
  country             text not null default '',            -- ISO alpha-2
  photo_url           text,                                -- small data URL or link
  story               text not null default '',
  journey_start_date  date not null default (now() at time zone 'utc')::date,
  -- Snapshot at journey start — never recalculated after the fact.
  original_total_debt numeric(14, 2) not null default 0,
  -- Synced from the live debt engine so the leaderboard reflects progress.
  current_total_debt  numeric(14, 2) not null default 0,
  percent_paid_off    numeric(6, 3) not null default 0,
  -- Explicit opt-in — nothing is public until the user turns this on.
  is_public           boolean not null default false,
  -- User's OWN external payment handles; the app never processes funds.
  support_links       jsonb not null default '[]'::jsonb,
  updated_at          timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Owner-only access to the raw row (which includes debt amounts).
drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_insert_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = user_id);
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = user_id);
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Public leaderboard window: returns ONLY non-sensitive columns for opted-in
-- users. Runs as definer so it can read across users, but the SELECT list here
-- is the hard boundary — debt amounts are never returned.
create or replace function public.get_leaderboard()
returns table (
  id                 uuid,
  display_name       text,
  country            text,
  photo_url          text,
  story              text,
  percent_paid_off   numeric,
  journey_start_date date,
  support_links      jsonb
)
language sql
security definer
set search_path = public
as $$
  select
    user_id, display_name, country, photo_url, story,
    percent_paid_off, journey_start_date, support_links
  from public.profiles
  where is_public = true
  order by percent_paid_off desc, updated_at desc
  limit 500;
$$;

grant execute on function public.get_leaderboard() to anon, authenticated;
