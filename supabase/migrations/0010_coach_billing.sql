-- GoodbyeDebt — coach billing (Stripe)
-- Tracks which coaching practices have paid, and the founding lifetime cohort.
-- The practice's billing_state gates the coach console's real usage exactly
-- like organizations.status does: a 'trial'/'unpaid' practice can set up but
-- the platform treats payment and approval as two independent gates.
--
-- Additive: new table only, no existing table changes shape.

create table if not exists public.coach_billing (
  org_id         uuid primary key references public.organizations (id) on delete cascade,
  -- 'lifetime' = one-time founding payment; 'monthly'/'annual' = subscription.
  plan           text not null check (plan in ('lifetime', 'monthly', 'annual')),
  billing_state  text not null default 'active' check (billing_state in ('active', 'past_due', 'canceled')),
  -- Stripe identifiers, for support/reconciliation (never used for access).
  stripe_customer_id     text,
  stripe_subscription_id text,
  -- The lifetime cohort: which of the 25 founding seats this payment claimed.
  founding_seat  integer,
  paid_at        timestamptz not null default now(),
  current_period_end timestamptz
);

alter table public.coach_billing enable row level security;

-- Readable by the practice's own members (so the console can show billing
-- state); writable ONLY by the service role (webhook), which bypasses RLS.
create policy "billing_select_member" on public.coach_billing
  for select using (public.is_org_member(org_id));

-- Public count of claimed founding seats, for the sales page's "N of 25
-- claimed" counter — no user data, same pattern as member_count().
create or replace function public.founding_coach_count()
returns integer
language sql
security definer
set search_path = public
as $$
  select count(*)::int from public.coach_billing where plan = 'lifetime' and billing_state = 'active';
$$;

grant execute on function public.founding_coach_count() to anon, authenticated;

-- Payments that arrived before the buyer had a practice (paid logged-out, or
-- the email didn't match one). The webhook records them here rather than
-- dropping a real payment; /admin lists them so Kathy can link each one to
-- its practice manually.
create table if not exists public.coach_billing_pending (
  id             uuid primary key default gen_random_uuid(),
  email          text,
  supabase_user_id uuid,
  plan           text not null check (plan in ('lifetime', 'monthly', 'annual')),
  stripe_customer_id     text,
  stripe_subscription_id text,
  created_at     timestamptz not null default now()
);

alter table public.coach_billing_pending enable row level security;
-- No policies: written by the webhook (service role), read/linked by Kathy
-- via the SQL editor or a future /admin card. Nobody else touches it.

-- Superadmin helper: find a user id by email (lives in auth.users, so a
-- definer function does the join server-side; gated by is_platform_admin).
create or replace function public.admin_find_user_id_by_email(lookup_email text)
returns table (user_id uuid, email text)
language sql
security definer
set search_path = public
as $$
  select au.id, au.email
  from auth.users au
  where lower(au.email) = lower(lookup_email)
    and public.is_platform_admin()
  limit 1;
$$;

grant execute on function public.admin_find_user_id_by_email(text) to authenticated;
