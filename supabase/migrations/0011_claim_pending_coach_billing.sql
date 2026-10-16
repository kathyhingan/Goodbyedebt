-- GoodbyeDebt — claim a pending coach payment onto a newly created practice
--
-- The real gap this closes: a coach can pay BEFORE they have a GoodbyeDebt
-- account at all (Stripe Checkout never requires a login). At that moment
-- the webhook's findOrgForBuyer() has no organization to match the payment
-- to, so it lands in coach_billing_pending instead of being dropped. Nothing
-- previously re-checked that table when the coach later signed up and
-- created their practice -- the payment sat orphaned until Kathy manually
-- linked it via the SQL editor for every single coach. The post-checkout
-- banner already promises "your purchase is linked to your practice
-- automatically" -- this migration is what makes that promise true.
--
-- Security-definer, callable by any authenticated user, but scoped hard:
-- it only reads/writes the CALLER's own email and only claims onto an org
-- the caller actually owns. A user can never claim someone else's payment
-- by guessing an org id.

create or replace function public.claim_pending_coach_billing(org uuid)
returns jsonb
language plpgsql security definer
set search_path = public
as $$
declare
  caller_email text;
  owns boolean;
  pending record;
  claimed_count int := 0;
  claimed_plans text[] := '{}';
  next_seat int;
begin
  select email into caller_email from auth.users where id = auth.uid();
  if caller_email is null then
    return jsonb_build_object('ok', false, 'error', 'not_authenticated');
  end if;

  -- Only the org's own owner can claim onto it -- never an arbitrary org id.
  select exists (
    select 1 from public.organizations where id = org and owner_user_id = auth.uid()
  ) into owns;
  if not owns then
    return jsonb_build_object('ok', false, 'error', 'not_your_practice');
  end if;

  -- A coach could in principle have paid more than once before signing up
  -- (retried a failed card, or genuinely bought two plans) -- claim every
  -- matching pending row, oldest first, same founding-seat counting the
  -- webhook itself uses so a late claim can't push the lifetime cohort
  -- past 25 even though it's arriving out of order.
  for pending in
    select * from public.coach_billing_pending
    where lower(email) = lower(caller_email) or supabase_user_id = auth.uid()
    order by created_at asc
  loop
    if pending.plan = 'lifetime' then
      select count(*)::int into next_seat from public.coach_billing
        where plan = 'lifetime' and billing_state = 'active';
      if next_seat >= 25 then
        -- Cohort filled while this payment sat pending -- leave it for Kathy
        -- to resolve by hand (refund or a manual seat exception) rather than
        -- silently overselling the 25-seat promise.
        continue;
      end if;
      next_seat := next_seat + 1;
    else
      next_seat := null;
    end if;

    insert into public.coach_billing (
      org_id, plan, billing_state, stripe_customer_id, stripe_subscription_id,
      founding_seat, paid_at
    ) values (
      org, pending.plan, 'active', pending.stripe_customer_id, pending.stripe_subscription_id,
      next_seat, pending.created_at
    )
    on conflict (org_id) do update set
      plan = excluded.plan,
      billing_state = 'active',
      stripe_customer_id = coalesce(excluded.stripe_customer_id, public.coach_billing.stripe_customer_id),
      stripe_subscription_id = coalesce(excluded.stripe_subscription_id, public.coach_billing.stripe_subscription_id),
      founding_seat = coalesce(public.coach_billing.founding_seat, excluded.founding_seat);

    delete from public.coach_billing_pending where id = pending.id;
    claimed_count := claimed_count + 1;
    claimed_plans := array_append(claimed_plans, pending.plan);
  end loop;

  return jsonb_build_object('ok', true, 'claimed', claimed_count, 'plans', to_jsonb(claimed_plans));
end;
$$;

grant execute on function public.claim_pending_coach_billing(uuid) to authenticated;
