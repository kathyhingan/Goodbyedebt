import { describe, it, expect } from "vitest";
import type { Debt } from "../types";
import { prioritize } from "../strategies";
import { projectPayoff, compareToMinimumsOnly } from "../projection";

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
    const cmp = compareToMinimumsOnly(sample, { name: "avalanche" }, { startDate: START, monthlyExtra: 400 });
    expect(cmp.interestSaved).toBeGreaterThan(0);
    expect(cmp.monthsSaved).toBeGreaterThan(0);
    expect(cmp.baseline.totalInterestPaid).toBeGreaterThan(cmp.plan.totalInterestPaid);
  });
});
