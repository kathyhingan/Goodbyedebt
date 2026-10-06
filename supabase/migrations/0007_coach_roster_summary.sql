-- GoodbyeDebt — coach roster: email + debt summary per client (Phase 1 follow-up)
-- The roster needs each client's actual email (for tracking — display names
-- are often blank) and a quick debt total so a coach can scan their list
-- without opening every client individually.
--
-- Email lives in auth.users, which normal authenticated queries can't read
-- (no grants on that schema by design). The standard, safe way to expose it
-- to a linked coach is a security-definer function that does the join
-- server-side and enforces the membership check itself (this function
-- bypasses RLS entirely, so the permission check has to live IN the
-- function body, not rely on RLS the way a normal table query would).

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
  -- Security gate lives here, not in RLS: a security-definer function reads
  -- past RLS entirely, so this membership check is what stops a coach from
  -- passing someone else's org_id and reading their roster.
  where oc.org_id = check_org_id
    and public.is_org_member(check_org_id)
  order by oc.added_at desc;
$$;

grant execute on function public.get_my_clients(uuid) to authenticated;
