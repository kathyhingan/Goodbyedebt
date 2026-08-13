-- GoodbyeDebt — payments ledger
-- Records every debt payment the user makes, so the Transactions tab can show
-- a full history and running totals. Owner-scoped via RLS, like every table.

create table if not exists public.payments (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users (id) on delete cascade,
  -- The debt this payment was applied to (matches debts.account_id per user).
  -- Kept as plain text (not a FK) so payment history survives if a debt row is
  -- later deleted or renamed.
  account_id   text not null,
  amount       numeric(14, 2) not null check (amount >= 0),
  -- Date the payment was made (not necessarily when it was recorded).
  paid_on      date not null default (now() at time zone 'utc')::date,
  note         text not null default '',
  created_at   timestamptz not null default now()
);

create index if not exists payments_user_id_idx on public.payments (user_id);
create index if not exists payments_account_idx on public.payments (user_id, account_id);

alter table public.payments enable row level security;

create policy "payments_select_own" on public.payments
  for select using (auth.uid() = user_id);
create policy "payments_insert_own" on public.payments
  for insert with check (auth.uid() = user_id);
create policy "payments_update_own" on public.payments
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "payments_delete_own" on public.payments
  for delete using (auth.uid() = user_id);
