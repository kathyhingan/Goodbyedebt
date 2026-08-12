-- GoodbyeDebt — initial schema
-- Debts belong to an authenticated user. Row Level Security ensures a user can
-- only ever read or write their own rows (SOW §4.6). Data is encrypted at rest
-- by Supabase/Postgres storage encryption; RLS is the per-user access boundary.

create extension if not exists "pgcrypto";

-- Enum of supported debt types (mirrors src/lib/engine/types.ts DebtType).
do $$
begin
  if not exists (select 1 from pg_type where typname = 'debt_type') then
    create type public.debt_type as enum (
      'credit_card', 'personal_loan', 'auto_loan', 'student_loan', 'bnpl', 'other'
    );
  end if;
end$$;

create table if not exists public.debts (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references auth.users (id) on delete cascade,
  -- User-assigned Account ID / nickname; the CSV re-upload matching key (SOW §4.1).
  account_id       text not null,
  creditor         text not null default '',
  balance          numeric(14, 2) not null default 0 check (balance >= 0),
  apr              numeric(6, 3) not null default 0 check (apr >= 0),
  minimum_payment  numeric(14, 2) not null default 0 check (minimum_payment >= 0),
  due_date         date,
  billing_date     date,
  debt_type        public.debt_type not null default 'other',
  promo_rate       numeric(6, 3) check (promo_rate is null or promo_rate >= 0),
  promo_expiry     date,
  created_at       timestamptz not null default now(),
  last_updated     timestamptz not null default now(),
  -- Account ID is unique per user (not globally) — this powers dedup on re-upload.
  unique (user_id, account_id)
);

create index if not exists debts_user_id_idx on public.debts (user_id);

-- Per-user reminder/notification preferences (SOW §4.3).
create table if not exists public.reminder_settings (
  user_id          uuid primary key references auth.users (id) on delete cascade,
  -- Days-before-due to notify, e.g. {5,1}.
  lead_days        int[] not null default '{5,1}',
  push_enabled     boolean not null default false,
  updated_at       timestamptz not null default now()
);

-- Web Push subscriptions (SOW §7, §10). One device/browser per row.
create table if not exists public.push_subscriptions (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references auth.users (id) on delete cascade,
  endpoint         text not null,
  p256dh           text not null,
  auth             text not null,
  created_at       timestamptz not null default now(),
  unique (user_id, endpoint)
);

-- Keep last_updated fresh on every write.
create or replace function public.touch_last_updated()
returns trigger language plpgsql as $$
begin
  new.last_updated = now();
  return new;
end$$;

drop trigger if exists debts_touch_last_updated on public.debts;
create trigger debts_touch_last_updated
  before update on public.debts
  for each row execute function public.touch_last_updated();

-- ---------------------------------------------------------------------------
-- Row Level Security: every table is owner-scoped.
-- ---------------------------------------------------------------------------
alter table public.debts enable row level security;
alter table public.reminder_settings enable row level security;
alter table public.push_subscriptions enable row level security;

create policy "debts_select_own" on public.debts
  for select using (auth.uid() = user_id);
create policy "debts_insert_own" on public.debts
  for insert with check (auth.uid() = user_id);
create policy "debts_update_own" on public.debts
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "debts_delete_own" on public.debts
  for delete using (auth.uid() = user_id);

create policy "reminders_all_own" on public.reminder_settings
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "push_all_own" on public.push_subscriptions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
