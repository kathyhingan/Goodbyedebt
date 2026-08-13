-- GoodbyeDebt — statement transactions (spending line items)
-- Individual purchases/charges/credits scraped from uploaded statements, used
-- for spending trends and recurring-subscription detection. Owner-scoped RLS.

create table if not exists public.statement_transactions (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users (id) on delete cascade,
  account_id   text not null,
  txn_date     date not null,
  description  text not null default '',
  amount       numeric(14, 2) not null default 0,
  -- 'debit' = charge/spend, 'credit' = payment/refund.
  direction    text not null default 'debit' check (direction in ('debit', 'credit')),
  created_at   timestamptz not null default now(),
  -- Dedup key so re-uploading the same statement doesn't duplicate rows.
  unique (user_id, account_id, txn_date, description, amount, direction)
);

create index if not exists stmt_txn_user_idx on public.statement_transactions (user_id);
create index if not exists stmt_txn_account_idx on public.statement_transactions (user_id, account_id);
create index if not exists stmt_txn_date_idx on public.statement_transactions (user_id, txn_date);

alter table public.statement_transactions enable row level security;

create policy "stmt_txn_select_own" on public.statement_transactions
  for select using (auth.uid() = user_id);
create policy "stmt_txn_insert_own" on public.statement_transactions
  for insert with check (auth.uid() = user_id);
create policy "stmt_txn_update_own" on public.statement_transactions
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "stmt_txn_delete_own" on public.statement_transactions
  for delete using (auth.uid() = user_id);
