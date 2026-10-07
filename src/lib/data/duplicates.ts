import type { Debt } from "../engine/types";

/**
 * A set of debts that look like the same real account, so the balance isn't
 * counted twice in every total, plan, and projection.
 */
export interface DuplicateGroup {
  key: string;
  label: string;
  accountIds: string[];
}

/**
 * Normalizes a creditor name for comparison: lowercase, collapsed whitespace,
 * punctuation dropped. "BDO Installment Card" and "bdo  installment card"
 * must land on the same key.
 */
function normalizeName(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Finds debts that are probably the same account.
 *
 * Deliberately conservative — same normalized creditor name AND the same APR.
 * Statement uploads derive the account id from the card number
 * (`bdo-1032`), so the same card uploaded twice under two ids produces two
 * rows that look identical here. Requiring the APR to match too keeps two
 * genuinely different products from the same bank (a card at 24% and a loan at
 * 12%) out of the same group. Different names never group, even at the same
 * APR: "Eastwest" and "East West 2" stay separate because the app cannot know
 * whether the suffix means "second card" or "same card, typed differently".
 */
export function findDuplicateGroups(debts: Debt[]): DuplicateGroup[] {
  const by = new Map<string, Debt[]>();
  for (const d of debts) {
    const name = normalizeName(d.creditor || d.accountId);
    if (!name) continue;
    const key = `${name}|${Number(d.apr).toFixed(2)}`;
    const arr = by.get(key);
    if (arr) arr.push(d);
    else by.set(key, [d]);
  }

  return [...by.entries()]
    .filter(([, rows]) => rows.length > 1)
    .map(([key, rows]) => ({
      key,
      label: rows[0].creditor || rows[0].accountId,
      accountIds: rows.map((r) => r.accountId),
    }));
}

export type MergeBalanceMode = "largest" | "sum";

/**
 * The balance the merged debt should carry.
 *
 * "largest" is the default and the right answer for the common case: two
 * monthly statements of one card, where the newer statement already reflects
 * everything the older one did, so summing them double-counts. "sum" exists
 * for the rarer case where the two rows really are separate balances.
 */
export function mergedBalance(rows: Debt[], mode: MergeBalanceMode): number {
  const balances = rows.map((r) => Math.max(0, r.balance));
  if (balances.length === 0) return 0;
  if (mode === "sum") return balances.reduce((a, b) => a + b, 0);
  return Math.max(...balances);
}