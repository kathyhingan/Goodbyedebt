-- GoodbyeDebt — public member count for the Roadmap progress bar.
-- Returns ONLY the total number of signed-up accounts (no user data), via a
-- security-definer function so the public/anon client can read the count
-- without any access to the auth.users table itself.

create or replace function public.member_count()
returns integer
language sql
security definer
set search_path = public
as $$
  select count(*)::int from auth.users;
$$;

grant execute on function public.member_count() to anon, authenticated;
