-- GoodbyeDebt — platform roles + superadmin + coach approval (Phase 1.5)
-- Separates member / coach / superadmin access and adds the /admin layer:
--   * platform_admins: the superadmin (Kathy), cannot be self-assigned —
--     rows are inserted via SQL editor / service role only.
--   * organizations.status: coach practices start 'pending' and go live only
--     when the superadmin approves them in /admin.
--   * coach features (roster, invites, client read access) only work for
--     APPROVED practices — a pending practice can set up but not invite.
--
-- Additive: no existing table drops a column, no existing policy narrows.
-- Existing member experience is byte-for-byte unchanged.

-- ---------------------------------------------------------------------------
-- platform_admins
-- ---------------------------------------------------------------------------
create table if not exists public.platform_admins (
  user_id     uuid primary key references auth.users (id) on delete cascade,
  created_at  timestamptz not null default now()
);

alter table public.platform_admins enable row level security;
-- No policies on purpose: nobody reads or writes this table through the API.
-- All access goes through the security-definer helpers below, which check
-- membership directly. (A blanket-deny table with definer helpers is the
-- standard way to hold a role grant no client can tamper with.)

-- ---------------------------------------------------------------------------
-- organizations.status — approval lifecycle
-- ---------------------------------------------------------------------------
alter table public.organizations
  add column if not exists status text not null default 'pending'
  check (status in ('pending', 'active', 'suspended'));

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------
create or replace function public.is_platform_admin()
returns boolean
language sql security definer stable
set search_path = public
as $$
  select exists (select 1 from public.platform_admins where user_id = auth.uid());
$$;

-- A coach whose practice is live. Pending/suspended practices are NOT
-- coaches for access purposes — this is the gate the whole feature set
-- reads through.
create or replace function public.is_active_coach()
returns boolean
language sql security definer stable
set search_path = public
as $$
  select exists (
    select 1 from public.organizations o
    join public.organization_members om on om.org_id = o.id
    where om.user_id = auth.uid()
      and o.status = 'active'
  );
$$;

grant execute on function public.is_platform_admin() to authenticated;
grant execute on function public.is_active_coach() to authenticated;

-- ---------------------------------------------------------------------------
-- Rework existing coach policies around the approved-practice gate
-- ---------------------------------------------------------------------------
-- is_org_member previously meant "any membership row". Keep it (invites
-- reference it), but the *feature* policies below now use is_active_coach
-- or an explicit status check so a pending practice can't operate.

create or replace function public.is_org_member(check_org_id uuid)
returns boolean
language sql security definer stable
set search_path = public
as $$
  select exists (
    select 1 from public.organization_members
    where org_id = check_org_id and user_id = auth.uid()
  );
$$;

-- get_my_clients: now takes practice status into account (pending practices
-- see their own roster but it's empty of functionality anyway; this keeps
-- the RPC honest for a suspended practice too — no rows).
create or replace function public.get_my_clients(check_org_id uuid)
returns table (
  client_user_id uuid,
  status         text,
  added_at       timestamptz,
  email          text,
  display_name   text,
  total_balance  numeric,
  debt_count     integer
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
    coalesce(d.debt_count, 0)::int as debt_count
  from public.organization_clients oc
  join auth.users u on u.id = oc.client_user_id
  left join public.profiles p on p.user_id = oc.client_user_id
  left join (
    select user_id, sum(balance) as total_balance, count(*) as debt_count
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

-- ---------------------------------------------------------------------------
-- Superadmin data functions (emails live in auth.users — definer functions
-- do the join server-side, gated by is_platform_admin inside the body).
-- ---------------------------------------------------------------------------
create or replace function public.admin_list_coaches()
returns table (
  org_id        uuid,
  name          text,
  status        text,
  owner_email   text,
  owner_name    text,
  client_count  integer,
  pending_invites integer,
  created_at    timestamptz
)
language sql security definer stable
set search_path = public
as $$
  select
    o.id,
    o.name,
    o.status,
    u.email,
    coalesce(p.display_name, '') as owner_name,
    (select count(*)::int from public.organization_clients oc
      where oc.org_id = o.id and oc.status = 'active') as client_count,
    (select count(*)::int from public.invitations i
      where i.org_id = o.id and i.status = 'pending') as pending_invites,
    o.created_at
  from public.organizations o
  join auth.users u on u.id = o.owner_user_id
  left join public.profiles p on p.user_id = o.owner_user_id
  where public.is_platform_admin()
  order by o.created_at desc;
$$;

create or replace function public.admin_list_members()
returns table (
  user_id      uuid,
  email        text,
  display_name text,
  is_coach     boolean,
  is_admin     boolean,
  debt_count   integer,
  total_balance numeric,
  signup_at    timestamptz
)
language sql security definer stable
set search_path = public
as $$
  select
    au.id,
    au.email,
    coalesce(p.display_name, '') as display_name,
    exists (
      select 1 from public.organization_members om
      where om.user_id = au.id
    ) as is_coach,
    exists (
      select 1 from public.platform_admins pa
      where pa.user_id = au.id
    ) as is_admin,
    coalesce(d.debt_count, 0)::int as debt_count,
    coalesce(d.total_balance, 0) as total_balance,
    au.created_at as signup_at
  from auth.users au
  left join public.profiles p on p.user_id = au.id
  left join (
    select user_id, count(*) as debt_count, sum(balance) as total_balance
    from public.debts group by user_id
  ) d on d.user_id = au.id
  where public.is_platform_admin()
  order by au.created_at desc
  limit 1000;
$$;

create or replace function public.admin_platform_stats()
returns table (
  total_members   integer,
  total_coaches   integer,
  active_coaches  integer,
  pending_coaches integer,
  total_clients   integer,
  total_debts     integer,
  total_debt_value numeric
)
language sql security definer stable
set search_path = public
as $$
  select
    (select count(*)::int from auth.users) as total_members,
    (select count(*)::int from public.organizations) as total_coaches,
    (select count(*)::int from public.organizations where status = 'active') as active_coaches,
    (select count(*)::int from public.organizations where status = 'pending') as pending_coaches,
    (select count(*)::int from public.organization_clients where status = 'active') as total_clients,
    (select count(*)::int from public.debts) as total_debts,
    (select coalesce(sum(balance), 0) from public.debts) as total_debt_value;
$$;

-- Approve / suspend / re-activate a practice. Superadmin only, enforced
-- inside the body (definer bypasses RLS, so the check must live here).
create or replace function public.admin_set_org_status(org uuid, new_status text)
returns jsonb
language plpgsql security definer
set search_path = public
as $$
begin
  if not public.is_platform_admin() then
    return jsonb_build_object('ok', false, 'error', 'not_platform_admin');
  end if;
  if new_status not in ('pending', 'active', 'suspended') then
    return jsonb_build_object('ok', false, 'error', 'invalid_status');
  end if;
  update public.organizations set status = new_status where id = org;
  if not found then
    return jsonb_build_object('ok', false, 'error', 'org_not_found');
  end if;
  return jsonb_build_object('ok', true);
end;
$$;

grant execute on function public.admin_list_coaches() to authenticated;
grant execute on function public.admin_list_members() to authenticated;
grant execute on function public.admin_platform_stats() to authenticated;
grant execute on function public.admin_set_org_status(uuid, text) to authenticated;

-- ---------------------------------------------------------------------------
-- Policy updates: coach feature policies now respect approval status
-- ---------------------------------------------------------------------------
-- Coach read access to a client's debts: only for an ACTIVE practice.
drop policy if exists "debts_select_coach" on public.debts;
create policy "debts_select_coach" on public.debts
  for select using (public.is_active_coach() and public.is_coach_of(user_id));

drop policy if exists "payments_select_coach" on public.payments;
create policy "payments_select_coach" on public.payments
  for select using (public.is_active_coach() and public.is_coach_of(user_id));

drop policy if exists "stmt_txn_select_coach" on public.statement_transactions;
create policy "stmt_txn_select_coach" on public.statement_transactions
  for select using (public.is_active_coach() and public.is_coach_of(user_id));

drop policy if exists "reminders_select_coach" on public.reminder_settings;
create policy "reminders_select_coach" on public.reminder_settings
  for select using (public.is_active_coach() and public.is_coach_of(user_id));

drop policy if exists "profiles_select_coach" on public.profiles;
create policy "profiles_select_coach" on public.profiles
  for select using (public.is_active_coach() and public.is_coach_of(user_id));

-- Invitations: only an ACTIVE practice can create invites (a pending coach
-- can't onboard clients until approved).
drop policy if exists "invitations_insert_coach" on public.invitations;
create policy "invitations_insert_coach" on public.invitations
  for insert with check (
    public.is_org_member(org_id) and invited_by = auth.uid()
    and exists (select 1 from public.organizations where id = org_id and status = 'active')
  );

-- Roster read/update stays member-scoped (a pending practice can still see
-- its own empty roster), but writes to organization_clients are already
-- locked to accept_invitation() only — no change needed there.

-- ---------------------------------------------------------------------------
-- IMPORTANT: the superadmin's own row is inserted by hand (Kathy runs this
-- in the SQL editor), replacing <YOUR_USER_ID> with her auth.users id:
--   insert into public.platform_admins (user_id)
--   select id from auth.users where email = 'kathyhingan@gmail.com';
-- ---------------------------------------------------------------------------
