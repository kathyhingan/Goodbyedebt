import { describe, it, expect } from "vitest";
import type { Debt } from "../types";
import { prioritize } from "../strategies";
import { projectPayoff, compareToMinimumsOnly, accruedBalance, amortizeDebt } from "../projection";

const START = new Date("2026-01-01T00:00:00Z");

function debt(partial: Partial<Debt> & Pick<Debt, "accountId">): Debt {
  return {
    creditor: partial.creditor ?? partial.accountId,
    balance: 1000,
    apr: 20,
    minimumPayment: 50,
    debtType: "credit_card",
    ...partial,
  };
}

const sample: Debt[] = [
  debt({ accountId: "card-a", balance: 5000, apr: 24.99, minimumPayment: 100 }),
  debt({ accountId: "card-b", balance: 2000, apr: 12.5, minimumPayment: 50 }),
  debt({ accountId: "loan-c", balance: 8000, apr: 7.0, minimumPayment: 200 }),
];

describe("prioritize", () => {
  it("avalanche ranks by highest APR first", () => {
    expect(prioritize(sample, { name: "avalanche" })).toEqual(["card-a", "card-b", "loan-c"]);
  });

  it("snowball ranks by lowest balance first", () => {
    expect(prioritize(sample, { name: "snowball" })).toEqual(["card-b", "card-a", "loan-c"]);
  });

  it("hybrid with full interest weight matches avalanche", () => {
    expect(prioritize(sample, { name: "hybrid", interestWeight: 1 })).toEqual(
      prioritize(sample, { name: "avalanche" })
    );
  });

  it("hybrid with zero interest weight matches snowball", () => {
    expect(prioritize(sample, { name: "hybrid", interestWeight: 0 })).toEqual(
      prioritize(sample, { name: "snowball" })
    );
  });

  it("excludes fully paid debts and is stable on ties", () => {
    const debts = [
      debt({ accountId: "z", balance: 0, apr: 30 }),
      debt({ accountId: "b", balance: 100, apr: 15 }),
      debt({ accountId: "a", balance: 100, apr: 15 }),
    ];
    expect(prioritize(debts, { name: "avalanche" })).toEqual(["a", "b"]);
  });
});

describe("projectPayoff", () => {
  it("pays off a single simple debt and accrues some interest", () => {
    const one = [debt({ accountId: "solo", balance: 1200, apr: 12, minimumPayment: 100 })];
    const r = projectPayoff(one, { name: "avalanche" }, { startDate: START });
    expect(r.unpayable).toBe(false);
    expect(r.monthsToDebtFree).toBeGreaterThan(12); // interest stretches it past 12
    expect(r.monthsToDebtFree).toBeLessThan(15);
    expect(r.totalInterestPaid).toBeGreaterThan(0);
  });

  it("extra payments reduce months and interest", () => {
    const base = projectPayoff(sample, { name: "avalanche" }, { startDate: START });
    const withExtra = projectPayoff(sample, { name: "avalanche" }, { startDate: START, monthlyExtra: 300 });
    expect(withExtra.monthsToDebtFree).toBeLessThan(base.monthsToDebtFree);
    expect(withExtra.totalInterestPaid).toBeLessThan(base.totalInterestPaid);
  });

  it("avalanche pays no more interest than snowball", () => {
    const av = projectPayoff(sample, { name: "avalanche" }, { startDate: START, monthlyExtra: 200 });
    const sn = projectPayoff(sample, { name: "snowball" }, { startDate: START, monthlyExtra: 200 });
    expect(av.totalInterestPaid).toBeLessThanOrEqual(sn.totalInterestPaid + 0.01);
  });

  it("flags an unpayable plan when the minimum can't cover interest", () => {
    const stuck = [debt({ accountId: "stuck", balance: 10000, apr: 30, minimumPayment: 10 })];
    const r = projectPayoff(stuck, { name: "avalanche" }, { startDate: START });
    expect(r.unpayable).toBe(true);
  });

  it("honors a promo rate until expiry", () => {
    const promo = [
      debt({ accountId: "promo", balance: 3000, apr: 25, minimumPayment: 100, promoRate: 0, promoExpiry: "2026-07-01" }),
    ];
    const withPromo = projectPayoff(promo, { name: "avalanche" }, { startDate: START });
    const noPromo = projectPayoff(
      [debt({ accountId: "promo", balance: 3000, apr: 25, minimumPayment: 100 })],
      { name: "avalanche" },
      { startDate: START }
    );
    expect(withPromo.totalInterestPaid).toBeLessThan(noPromo.totalInterestPaid);
  });
});

describe("compareToMinimumsOnly", () => {
  it("shows positive interest and time saved for a funded plan", () => {
    // Local fixture, not the shared `sample` — sample's card-a (5000 @
    // 24.99%, minimum 100) carries ~104.125/month interest, i.e. its own
    // minimum already doesn't cover it; compareToMinimumsOnly's baseline
    // forces rollover off, so there's nothing to rescue it and the
    // minimums-only run never converges. That's a real, separate case
    // (covered below), not what "a funded plan" should mean here — this
    // fixture keeps every minimum comfortably above its own interest so
    // the comparison is actually well-defined.
    const funded: Debt[] = [
      debt({ accountId: "card-a", balance: 5000, apr: 24.99, minimumPayment: 150 }),
      debt({ accountId: "card-b", balance: 2000, apr: 12.5, minimumPayment: 50 }),
      debt({ accountId: "loan-c", balance: 8000, apr: 7.0, minimumPayment: 200 }),
    ];
    const cmp = compareToMinimumsOnly(funded, { name: "avalanche" }, { startDate: START, monthlyExtra: 400 });
    expect(cmp.baseline.unpayable).toBe(false);
    expect(cmp.interestSaved).toBeGreaterThan(0);
    expect(cmp.monthsSaved).toBeGreaterThan(0);
    expect(cmp.baseline.totalInterestPaid).toBeGreaterThan(cmp.plan.totalInterestPaid);
  });

  it("reports 0, not an astronomical diff, when the minimums-only baseline can't amortize", () => {
    // A debt whose own minimum doesn't cover its own interest: 500,000 at 36%
    // APR accrues 15,000/month; a 5,000 minimum falls short by 10,000/month,
    // so the minimums-only (no extra, no rollover) baseline run never
    // converges and would otherwise compound for the full 1200-month cap.
    // Even with enough extra to make the actual PLAN payable, the baseline
    // comparison must not leak that blown-up number into interestSaved.
    const extreme = [debt({ accountId: "gcash", balance: 500_000, apr: 36, minimumPayment: 5_000 })];
    const cmp = compareToMinimumsOnly(extreme, { name: "avalanche" }, { startDate: START, monthlyExtra: 10_000 });
    expect(cmp.baseline.unpayable).toBe(true);
    expect(cmp.interestSaved).toBe(0);
    expect(cmp.monthsSaved).toBe(0);
    expect(Number.isFinite(cmp.interestSaved)).toBe(true);
  });
});

describe("accruedBalance", () => {
  it("leaves the balance unchanged with no lastUpdated timestamp", () => {
    const d = debt({ accountId: "x", balance: 1000, apr: 24, lastUpdated: undefined });
    expect(accruedBalance(d, new Date("2026-06-01T00:00:00Z"))).toBe(1000);
  });

  it("leaves the balance unchanged within the same billing month", () => {
    const d = debt({ accountId: "x", balance: 1000, apr: 24, lastUpdated: "2026-01-05T00:00:00Z" });
    expect(accruedBalance(d, new Date("2026-01-20T00:00:00Z"))).toBe(1000);
  });

  it("compounds one month of interest at APR/12 after a full month elapses", () => {
    const d = debt({ accountId: "x", balance: 1000, apr: 24, lastUpdated: "2026-01-05T00:00:00Z" });
    // 24%/12 = 2% monthly.
    expect(accruedBalance(d, new Date("2026-02-05T00:00:00Z"))).toBeCloseTo(1020, 2);
  });

  it("compounds multiple elapsed months", () => {
    const d = debt({ accountId: "x", balance: 1000, apr: 24, lastUpdated: "2026-01-05T00:00:00Z" });
    const threeMonths = accruedBalance(d, new Date("2026-04-05T00:00:00Z"));
    expect(threeMonths).toBeCloseTo(1000 * 1.02 ** 3, 2);
  });

  it("never accrues on a zero or negative balance", () => {
    const d = debt({ accountId: "x", balance: 0, apr: 24, lastUpdated: "2026-01-05T00:00:00Z" });
    expect(accruedBalance(d, new Date("2026-06-01T00:00:00Z"))).toBe(0);
  });
});

describe("amortizeDebt", () => {
  it("reaches zero balance and matches total interest across the plan", () => {
    const d = debt({ accountId: "card-a", balance: 1000, apr: 24, minimumPayment: 100 });
    const schedule = amortizeDebt(d, START);
    expect(schedule.unpayable).toBe(false);
    expect(schedule.rows.length).toBeGreaterThan(0);
    expect(schedule.rows.at(-1)!.endingBalance).toBe(0);
    const sumInterest = schedule.rows.reduce((s, r) => s + r.interest, 0);
    expect(sumInterest).toBeCloseTo(schedule.totalInterest, 1);
  });

  it("each row's ending balance feeds the next row's starting balance", () => {
    const d = debt({ accountId: "card-a", balance: 1000, apr: 24, minimumPayment: 100 });
    const schedule = amortizeDebt(d, START);
    for (let i = 1; i < schedule.rows.length; i++) {
      expect(schedule.rows[i].startingBalance).toBeCloseTo(schedule.rows[i - 1].endingBalance, 2);
    }
  });

  it("flags unpayable when the minimum doesn't cover monthly interest", () => {
    const d = debt({ accountId: "stuck", balance: 5000, apr: 36, minimumPayment: 50 });
    const schedule = amortizeDebt(d, START);
    expect(schedule.unpayable).toBe(true);
  });

  it("starts from today's accrued balance, not the stale stored one", () => {
    const d = debt({
      accountId: "card-a",
      balance: 1000,
      apr: 24,
      minimumPayment: 100,
      lastUpdated: "2026-01-05T00:00:00Z",
    });
    const asOf = new Date("2026-02-05T00:00:00Z");
    const schedule = amortizeDebt(d, asOf);
    expect(schedule.rows[0].startingBalance).toBeCloseTo(1020, 2);
  });
});
