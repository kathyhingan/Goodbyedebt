-- GoodbyeDebt — coach/client white-label layer (Phase 1)
-- Adds organizations (a coach's practice), membership, invitations, and the
-- coach<->client link. Fully additive: no existing table changes shape, no
-- existing RLS policy is removed or narrowed — this only ADDS new policies
-- that grant a coach read access to their linked clients' existing rows.
-- Solo B2C users who never touch a coach are completely unaffected.

create table if not exists public.organizations (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  owner_user_id   uuid not null references auth.users (id) on delete cascade,
  brand_color     text,
  logo_url        text,
  created_at      timestamptz not null default now()
);

create table if not exists public.organization_members (
  org_id          uuid not null references public.organizations (id) on delete cascade,
  user_id         uuid not null references auth.users (id) on delete cascade,
  role            text not null default 'owner' check (role in ('owner', 'staff')),
  created_at      timestamptz not null default now(),
  primary key (org_id, user_id)
);

create table if not exists public.organization_clients (
  org_id          uuid not null references public.organizations (id) on delete cascade,
  client_user_id  uuid not null references auth.users (id) on delete cascade,
  status          text not null default 'active' check (status in ('active', 'removed')),
  added_at        timestamptz not null default now(),
  primary key (org_id, client_user_id)
);

create table if not exists public.invitations (
  id              uuid primary key default gen_random_uuid(),
  org_id          uuid not null references public.organizations (id) on delete cascade,
  email           text not null,
  token           uuid not null default gen_random_uuid(),
  status          text not null default 'pending' check (status in ('pending', 'accepted', 'revoked')),
  invited_by      uuid not null references auth.users (id),
  created_at      timestamptz not null default now(),
  accepted_at     timestamptz,
  unique (org_id, email),
  unique (token)
);

create index if not exists org_members_user_idx on public.organization_members (user_id);
create index if not exists org_clients_client_idx on public.organization_clients (client_user_id);
create index if not exists org_clients_org_idx on public.organization_clients (org_id);
create index if not exists invitations_org_idx on public.invitations (org_id);
create index if not exists invitations_token_idx on public.invitations (token);

-- ---------------------------------------------------------------------------
-- Helper functions (security definer so RLS policies can check membership
-- across tables without recursing into RLS-protected tables — the standard
-- Supabase multi-tenant pattern).
-- ---------------------------------------------------------------------------
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

create or replace function public.is_coach_of(check_client_id uuid)
returns boolean
language sql security definer stable
set search_path = public
as $$
  select exists (
    select 1
    from public.organization_clients oc
    join public.organization_members om on om.org_id = oc.org_id
    where oc.client_user_id = check_client_id
      and oc.status = 'active'
      and om.user_id = auth.uid()
  );
$$;

grant execute on function public.is_org_member(uuid) to authenticated;
grant execute on function public.is_coach_of(uuid) to authenticated;

-- Auto-add the creator as 'owner' the instant an organization is created —
-- solves the chicken-and-egg problem of inserting the first membership row
-- under RLS (you can't pass an "is a member" check for an org that didn't
-- exist a moment ago).
create or replace function public.handle_new_organization()
returns trigger
language plpgsql security definer
set search_path = public
as $$
begin
  insert into public.organization_members (org_id, user_id, role)
  values (new.id, new.owner_user_id, 'owner')
  on conflict (org_id, user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_organization_created on public.organizations;
create trigger on_organization_created
  after insert on public.organizations
  for each row execute function public.handle_new_organization();

-- Invite acceptance: runs as the invited user, checks their authenticated
-- email matches the invite, links them to the org, marks the invite used.
-- security definer so it can read/write organization_clients and invitations
-- for an org the caller isn't a member of yet — that's the whole point.
create or replace function public.accept_invitation(invite_token uuid)
returns jsonb
language plpgsql security definer
set search_path = public
as $$
declare
  inv record;
  caller_email text;
begin
  select email into caller_email from auth.users where id = auth.uid();
  if caller_email is null then
    return jsonb_build_object('ok', false, 'error', 'not_authenticated');
  end if;

  select * into inv from public.invitations where token = invite_token and status = 'pending';
  if inv is null then
    return jsonb_build_object('ok', false, 'error', 'invalid_or_used_invite');
  end if;

  if lower(inv.email) <> lower(caller_email) then
    return jsonb_build_object('ok', false, 'error', 'email_mismatch');
  end if;

  insert into public.organization_clients (org_id, client_user_id, status)
  values (inv.org_id, auth.uid(), 'active')
  on conflict (org_id, client_user_id) do update set status = 'active';

  update public.invitations set status = 'accepted', accepted_at = now() where id = inv.id;

  return jsonb_build_object('ok', true, 'org_id', inv.org_id);
end;
$$;

grant execute on function public.accept_invitation(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;
alter table public.organization_clients enable row level security;
alter table public.invitations enable row level security;

-- organizations: any member can see it; only the creator can make the row
-- (owner_user_id must equal the caller); only the owner can update/delete it.
create policy "org_select_member" on public.organizations
  for select using (public.is_org_member(id));
create policy "org_insert_self" on public.organizations
  for insert with check (auth.uid() = owner_user_id);
create policy "org_update_owner" on public.organizations
  for update using (auth.uid() = owner_user_id) with check (auth.uid() = owner_user_id);
create policy "org_delete_owner" on public.organizations
  for delete using (auth.uid() = owner_user_id);

-- organization_members: members can see their org's roster. No direct insert
-- policy — the bootstrap trigger handles org creation; adding staff is a
-- later phase, not Phase 1.
create policy "org_members_select" on public.organization_members
  for select using (public.is_org_member(org_id));

-- organization_clients: the coach (org member) can see and manage their own
-- roster. Clients can see their own link too, so the app can show "you're
-- connected to <coach>" on the client's own side.
create policy "org_clients_select_coach" on public.organization_clients
  for select using (public.is_org_member(org_id) or client_user_id = auth.uid());
create policy "org_clients_update_coach" on public.organization_clients
  for update using (public.is_org_member(org_id)) with check (public.is_org_member(org_id));
-- Deliberately no insert policy: rows are created only via accept_invitation()
-- (security definer), so a coach can never add a client without that exact
-- client having accepted a real invite sent to their own email.

-- invitations: only the coach (org member) can see/create/revoke their own
-- org's invites. No policy lets an anonymous or unrelated user select by
-- token — accept_invitation() reads invitations internally as security
-- definer, so the invitee never needs a direct select grant.
create policy "invitations_select_coach" on public.invitations
  for select using (public.is_org_member(org_id));
create policy "invitations_insert_coach" on public.invitations
  for insert with check (public.is_org_member(org_id) and invited_by = auth.uid());
create policy "invitations_update_coach" on public.invitations
  for update using (public.is_org_member(org_id)) with check (public.is_org_member(org_id));

-- ---------------------------------------------------------------------------
-- Extend existing tables: ADD coach read access only. Every existing policy
-- stays exactly as it was — Postgres RLS policies are OR'd together per
-- command, so a solo user's own access is byte-for-byte unchanged; this only
-- adds a second way IN for a linked coach. No write access for coaches in
-- Phase 1 — read-only by design (see 02-whitelabel-requirements/output/
-- gap-analysis.md for why: a coach silently editing a client's real balances
-- changes the product's trust framing, and read access is all the roster/
-- drill-in view needs).
-- ---------------------------------------------------------------------------
create policy "debts_select_coach" on public.debts
  for select using (public.is_coach_of(user_id));

create policy "payments_select_coach" on public.payments
  for select using (public.is_coach_of(user_id));

create policy "stmt_txn_select_coach" on public.statement_transactions
  for select using (public.is_coach_of(user_id));

create policy "reminders_select_coach" on public.reminder_settings
  for select using (public.is_coach_of(user_id));

create policy "profiles_select_coach" on public.profiles
  for select using (public.is_coach_of(user_id));
