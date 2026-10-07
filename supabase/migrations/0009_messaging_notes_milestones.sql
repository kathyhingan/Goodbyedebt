-- GoodbyeDebt — coach<->member messaging, private notes, appointments,
-- and milestone tracking (Phase 1.6).
--
-- Powers: MemberDashboard's "From your coach" preview, MemberCoachConnect
-- (member's own coach chat + shared milestones), CoachClientDetail (activity
-- log, private notes, nudge), CoachMessagesSchedule (inbox + schedule).
--
-- Design decisions, spelled out because they're not obvious from the UI alone:
--  * ONE thread per (org, client) — no separate "conversations" table. A
--    coach has exactly one relationship with each client, so the natural
--    key is enough.
--  * coach_notes is a single editable row per (org, client), not a log —
--    matches the mockup (one textarea, not a list of dated entries).
--  * milestones are INSERTED THE FIRST TIME detected client-side (debts.ts/
--    payments crossing a threshold), not backfilled with fabricated history.
--    A user who crossed 50% before this feature shipped gets an achieved_at
--    of "whenever the app first noticed," not the true historical date —
--    documented so nobody mistakes it for exact history.
--  * Appointments are coach-authored only (the coach's calendar, not the
--    client's) — a client "Schedule a call" is a message, not a booking.

-- ---------------------------------------------------------------------------
-- coach_messages — one thread per (org_id, client_user_id)
-- ---------------------------------------------------------------------------
create table if not exists public.coach_messages (
  id              uuid primary key default gen_random_uuid(),
  org_id          uuid not null references public.organizations(id) on delete cascade,
  client_user_id  uuid not null references auth.users(id) on delete cascade,
  sender_user_id  uuid not null references auth.users(id) on delete cascade,
  body            text not null check (char_length(trim(body)) > 0),
  read_at         timestamptz,
  created_at      timestamptz not null default now()
);

create index if not exists coach_messages_thread_idx
  on public.coach_messages (org_id, client_user_id, created_at);

alter table public.coach_messages enable row level security;

-- Either side of the relationship can read the thread: the client themselves,
-- or an active coach of that org who actually coaches this client.
drop policy if exists "coach_messages_select" on public.coach_messages;
create policy "coach_messages_select" on public.coach_messages
  for select using (
    client_user_id = auth.uid()
    or (public.is_active_coach() and public.is_org_member(org_id) and public.is_coach_of(client_user_id))
  );

drop policy if exists "coach_messages_insert" on public.coach_messages;
create policy "coach_messages_insert" on public.coach_messages
  for insert with check (
    sender_user_id = auth.uid()
    and (
      client_user_id = auth.uid()
      or (public.is_active_coach() and public.is_org_member(org_id) and public.is_coach_of(client_user_id))
    )
  );

-- Marking read: either side can set read_at on messages addressed to them
-- (i.e. not their own). Body is never updatable (messages are immutable).
drop policy if exists "coach_messages_update_read" on public.coach_messages;
create policy "coach_messages_update_read" on public.coach_messages
  for update using (
    sender_user_id <> auth.uid()
    and (
      client_user_id = auth.uid()
      or (public.is_active_coach() and public.is_org_member(org_id) and public.is_coach_of(client_user_id))
    )
  )
  with check (true);

-- ---------------------------------------------------------------------------
-- coach_notes — single private note per (org, client). Never visible to the
-- client: no client-side select policy exists at all.
-- ---------------------------------------------------------------------------
create table if not exists public.coach_notes (
  org_id          uuid not null references public.organizations(id) on delete cascade,
  client_user_id  uuid not null references auth.users(id) on delete cascade,
  body            text not null default '',
  updated_at      timestamptz not null default now(),
  primary key (org_id, client_user_id)
);

alter table public.coach_notes enable row level security;

drop policy if exists "coach_notes_all_coach" on public.coach_notes;
create policy "coach_notes_all_coach" on public.coach_notes
  for all using (
    public.is_active_coach() and public.is_org_member(org_id) and public.is_coach_of(client_user_id)
  )
  with check (
    public.is_active_coach() and public.is_org_member(org_id) and public.is_coach_of(client_user_id)
  );

-- ---------------------------------------------------------------------------
-- coach_appointments — the coach's schedule. Coach-authored; client can read
-- their own (so a future "upcoming call" surface on the member side is free).
-- ---------------------------------------------------------------------------
create table if not exists public.coach_appointments (
  id              uuid primary key default gen_random_uuid(),
  org_id          uuid not null references public.organizations(id) on delete cascade,
  client_user_id  uuid not null references auth.users(id) on delete cascade,
  title           text not null,
  scheduled_at    timestamptz not null,
  created_by      uuid not null references auth.users(id),
  created_at      timestamptz not null default now()
);

create index if not exists coach_appointments_org_idx
  on public.coach_appointments (org_id, scheduled_at);

alter table public.coach_appointments enable row level security;

drop policy if exists "coach_appointments_select" on public.coach_appointments;
create policy "coach_appointments_select" on public.coach_appointments
  for select using (
    client_user_id = auth.uid()
    or (public.is_active_coach() and public.is_org_member(org_id) and public.is_coach_of(client_user_id))
  );

drop policy if exists "coach_appointments_insert" on public.coach_appointments;
create policy "coach_appointments_insert" on public.coach_appointments
  for insert with check (
    created_by = auth.uid()
    and public.is_active_coach() and public.is_org_member(org_id) and public.is_coach_of(client_user_id)
  );

drop policy if exists "coach_appointments_delete" on public.coach_appointments;
create policy "coach_appointments_delete" on public.coach_appointments
  for delete using (
    public.is_active_coach() and public.is_org_member(org_id) and public.is_coach_of(client_user_id)
  );

-- ---------------------------------------------------------------------------
-- milestones — detected client-side the first time a threshold is crossed
-- (see note at top of file: achieved_at is "first noticed," not reconstructed
-- history). Visible to the member themselves and to their active coach.
-- ---------------------------------------------------------------------------
create table if not exists public.milestones (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  kind            text not null check (kind in ('debt_threshold', 'streak')),
  account_id      text,            -- set for debt_threshold, null for streak
  threshold       integer not null, -- 25/50/75/100 for debt_threshold; month-count for streak
  achieved_at     timestamptz not null default now(),
  unique (user_id, kind, account_id, threshold)
);

alter table public.milestones enable row level security;

drop policy if exists "milestones_select_own" on public.milestones;
create policy "milestones_select_own" on public.milestones
  for select using (user_id = auth.uid());

drop policy if exists "milestones_select_coach" on public.milestones;
create policy "milestones_select_coach" on public.milestones
  for select using (public.is_active_coach() and public.is_coach_of(user_id));

drop policy if exists "milestones_insert_own" on public.milestones;
create policy "milestones_insert_own" on public.milestones
  for insert with check (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- RPCs
-- ---------------------------------------------------------------------------

-- Roster status: how many of a client's debts are currently past due (a
-- debt's due_date only advances forward when a payment is logged — see
-- src/lib/reminders/dueDates.ts — so a due_date sitting in the past means
-- that many monthly cycles were never advanced, i.e. missed). This replaces
-- get_my_clients with the same columns plus status fields the Overview
-- roster and Analytics both need, so there's one source of truth for "is
-- this client on track."
create or replace function public.get_my_clients(check_org_id uuid)
returns table (
  client_user_id uuid,
  status         text,
  added_at       timestamptz,
  email          text,
  display_name   text,
  total_balance  numeric,
  debt_count     integer,
  missed_count   integer,
  days_until_due integer
)
language sql security definer stable
set search_path = public
as $$
  select
    oc.client_user_id,
    oc.status,
    oc.added_at,
    u.email,
    coalesce(p.display_name, '') as display_name,
    coalesce(d.total_balance, 0) as total_balance,
    coalesce(d.debt_count, 0)::int as debt_count,
    coalesce(d.missed_count, 0)::int as missed_count,
    d.days_until_due
  from public.organization_clients oc
  join auth.users u on u.id = oc.client_user_id
  left join public.profiles p on p.user_id = oc.client_user_id
  left join (
    select
      user_id,
      sum(balance) as total_balance,
      count(*) as debt_count,
      sum(case when due_date < current_date
            then greatest(1, (extract(year from age(current_date, due_date)) * 12
                              + extract(month from age(current_date, due_date)))::int)
            else 0 end) as missed_count,
      min(case when due_date >= current_date then due_date - current_date end) as days_until_due
    from public.debts
    group by user_id
  ) d on d.user_id = oc.client_user_id
  where oc.org_id = check_org_id
    and public.is_org_member(check_org_id)
    and exists (
      select 1 from public.organizations
      where id = check_org_id and status = 'active'
    )
  order by oc.added_at desc;
$$;

-- Portfolio-wide stats for the Analytics tab. "Avg. time to on-track" from
-- the original design mock isn't derivable (no stored "became on track"
-- event), so it's replaced with "active this week" and "avg progress" —
-- both real, both computable from data the app already has.
create or replace function public.get_portfolio_stats(check_org_id uuid)
returns table (
  total_reduced      numeric,
  active_this_week   integer,
  active_total       integer,
  avg_progress       numeric,
  on_track_count     integer,
  due_soon_count     integer,
  at_risk_count      integer
)
language sql security definer stable
set search_path = public
as $$
  with roster as (
    select oc.client_user_id
    from public.organization_clients oc
    where oc.org_id = check_org_id and oc.status = 'active'
      and public.is_org_member(check_org_id)
  ),
  status as (
    select
      r.client_user_id,
      coalesce(sum(case when dd.due_date < current_date then 1 else 0 end), 0) as missed,
      min(case when dd.due_date >= current_date then dd.due_date - current_date end) as days_until_due
    from roster r
    left join public.debts dd on dd.user_id = r.client_user_id
    group by r.client_user_id
  )
  select
    (select coalesce(sum(pay.amount), 0) from public.payments pay
      join roster r on r.client_user_id = pay.user_id
      where pay.paid_on >= (current_date - interval '30 days')) as total_reduced,
    (select count(distinct pay.user_id)::int from public.payments pay
      join roster r on r.client_user_id = pay.user_id
      where pay.paid_on >= (current_date - interval '7 days')) as active_this_week,
    (select count(*)::int from roster) as active_total,
    (select coalesce(avg(pr.percent_paid_off), 0) from public.profiles pr
      join roster r on r.client_user_id = pr.user_id) as avg_progress,
    (select count(*)::int from status where missed = 0 and (days_until_due is null or days_until_due > 7)) as on_track_count,
    (select count(*)::int from status where missed = 0 and days_until_due is not null and days_until_due <= 7) as due_soon_count,
    (select count(*)::int from status where missed > 0) as at_risk_count;
$$;

grant execute on function public.get_portfolio_stats(uuid) to authenticated;

-- Monthly "debt reduced" (sum of payments) across the whole roster, last 6
-- calendar months oldest-first, for the Analytics bar chart.
create or replace function public.get_portfolio_monthly(check_org_id uuid)
returns table (month_label text, amount numeric)
language sql security definer stable
set search_path = public
as $$
  with months as (
    select date_trunc('month', current_date) - (interval '1 month' * gs) as month_start
    from generate_series(0, 5) as gs
  ),
  roster as (
    select oc.client_user_id
    from public.organization_clients oc
    where oc.org_id = check_org_id and oc.status = 'active'
      and public.is_org_member(check_org_id)
  )
  select
    to_char(m.month_start, 'Mon') as month_label,
    coalesce((
      select sum(pay.amount) from public.payments pay
      join roster r on r.client_user_id = pay.user_id
      where date_trunc('month', pay.paid_on) = m.month_start
    ), 0) as amount
  from months m
  order by m.month_start asc;
$$;

grant execute on function public.get_portfolio_monthly(uuid) to authenticated;

-- Coach inbox: one row per client with last-message preview + unread count,
-- so the Messages tab doesn't do N round trips for N clients.
create or replace function public.get_coach_inbox(check_org_id uuid)
returns table (
  client_user_id uuid,
  display_name   text,
  email          text,
  last_body      text,
  last_at        timestamptz,
  last_from_me   boolean,
  unread_count   integer
)
language sql security definer stable
set search_path = public
as $$
  select
    oc.client_user_id,
    coalesce(p.display_name, '') as display_name,
    u.email,
    lm.body as last_body,
    lm.created_at as last_at,
    (lm.sender_user_id = auth.uid()) as last_from_me,
    (select count(*)::int from public.coach_messages m2
      where m2.org_id = check_org_id and m2.client_user_id = oc.client_user_id
        and m2.sender_user_id = oc.client_user_id and m2.read_at is null) as unread_count
  from public.organization_clients oc
  join auth.users u on u.id = oc.client_user_id
  left join public.profiles p on p.user_id = oc.client_user_id
  left join lateral (
    select body, created_at, sender_user_id
    from public.coach_messages m
    where m.org_id = check_org_id and m.client_user_id = oc.client_user_id
    order by m.created_at desc
    limit 1
  ) lm on true
  where oc.org_id = check_org_id
    and oc.status = 'active'
    and public.is_org_member(check_org_id)
  order by lm.created_at desc nulls last;
$$;

grant execute on function public.get_coach_inbox(uuid) to authenticated;

-- Marks every client-authored message in a thread as read (called when the
-- coach opens that client's thread).
create or replace function public.mark_thread_read(check_org_id uuid, client uuid)
returns void
language plpgsql security definer
set search_path = public
as $$
begin
  if not (public.is_active_coach() and public.is_org_member(check_org_id) and public.is_coach_of(client)) then
    return;
  end if;
  update public.coach_messages
  set read_at = now()
  where org_id = check_org_id and client_user_id = client
    and sender_user_id = client and read_at is null;
end;
$$;

grant execute on function public.mark_thread_read(uuid, uuid) to authenticated;

-- Records a milestone the first time it's detected (client-side best-effort
-- call after debts/payments load). on conflict do nothing means a threshold
-- already crossed keeps its original (first-noticed) achieved_at forever.
create or replace function public.record_milestone(p_kind text, p_account_id text, p_threshold integer)
returns void
language sql security definer
set search_path = public
as $$
  insert into public.milestones (user_id, kind, account_id, threshold)
  values (auth.uid(), p_kind, p_account_id, p_threshold)
  on conflict (user_id, kind, account_id, threshold) do nothing;
$$;

grant execute on function public.record_milestone(text, text, integer) to authenticated;

-- A member's own milestones, newest first (used by MemberDashboard and
-- MemberCoachConnect's "shared milestones" list).
create or replace function public.get_my_milestones(p_limit integer default 10)
returns table (kind text, account_id text, threshold integer, achieved_at timestamptz)
language sql security definer stable
set search_path = public
as $$
  select kind, account_id, threshold, achieved_at
  from public.milestones
  where user_id = auth.uid()
  order by achieved_at desc
  limit p_limit;
$$;

grant execute on function public.get_my_milestones(integer) to authenticated;
