import { describe, it, expect } from "vitest";
import {
  perDebtProgress,
  onTimeStreakMonths,
  onTimeMonthsThisYear,
  paidThisYear,
  paidLastYear,
  detectCurrentMilestones,
  interestShortfalls,
} from "../progress";
import type { Debt } from "../types";
import type { Payment } from "../../data/payments";

function debt(over: Partial<Debt> = {}): Debt {
  return {
    accountId: "card-a",
    creditor: "Card A",
    balance: 1000,
    apr: 20,
    minimumPayment: 100,
    debtType: "credit_card",
    ...over,
  };
}

function pay(accountId: string, amount: number, paidOn: string): Payment {
  return { accountId, amount, paidOn };
}

describe("perDebtProgress", () => {
  it("is 0% for a debt with no logged payments", () => {
    const [p] = perDebtProgress([debt()], []);
    expect(p.percentPaid).toBe(0);
  });

  it("computes paid / (paid + balance)", () => {
    // Paid 500 against a debt that now sits at 500 balance -> 50%.
    const [p] = perDebtProgress([debt({ balance: 500 })], [pay("card-a", 500, "2026-01-01")]);
    expect(p.percentPaid).toBe(50);
  });

  it("clamps at 100% and never goes negative", () => {
    const [p] = perDebtProgress([debt({ balance: 0 })], [pay("card-a", 1000, "2026-01-01")]);
    expect(p.percentPaid).toBe(100);
  });

  it("only attributes payments to their own accountId", () => {
    const progress = perDebtProgress(
      [debt({ accountId: "a", balance: 500 }), debt({ accountId: "b", balance: 1000 })],
      [pay("a", 500, "2026-01-01")]
    );
    expect(progress.find((p) => p.accountId === "b")!.percentPaid).toBe(0);
  });
});

describe("onTimeStreakMonths", () => {
  it("is 0 with no minimums on record", () => {
    expect(onTimeStreakMonths([], [])).toBe(0);
  });

  it("counts consecutive months meeting total minimums, stopping at a gap", () => {
    const debts = [debt({ minimumPayment: 100 })];
    const asOf = new Date(2026, 3, 15); // Apr 15 2026 -> checks back from March
    const payments = [
      pay("card-a", 100, "2026-03-05"),
      pay("card-a", 100, "2026-02-05"),
      // January missing -> streak should stop at 2
      pay("card-a", 100, "2025-12-05"),
    ];
    expect(onTimeStreakMonths(debts, payments, asOf)).toBe(2);
  });

  it("a month that pays less than total minimums breaks the streak", () => {
    const debts = [debt({ minimumPayment: 100 })];
    const asOf = new Date(2026, 2, 15); // checks back from Feb
    const payments = [pay("card-a", 100, "2026-02-05"), pay("card-a", 40, "2026-01-05")];
    expect(onTimeStreakMonths(debts, payments, asOf)).toBe(1);
  });
});

describe("paidThisYear / paidLastYear", () => {
  const asOf = new Date(2026, 5, 1);
  it("sums only the current year", () => {
    const payments = [pay("a", 100, "2026-01-01"), pay("a", 50, "2025-12-31")];
    expect(paidThisYear(payments, asOf)).toBe(100);
  });
  it("returns null for last year when there's no history", () => {
    expect(paidLastYear([pay("a", 100, "2026-01-01")], asOf)).toBeNull();
  });
  it("sums last year when present", () => {
    expect(paidLastYear([pay("a", 100, "2025-06-01")], asOf)).toBe(100);
  });
});

describe("onTimeMonthsThisYear", () => {
  it("counts only fully-elapsed months, not the current partial month", () => {
    const debts = [debt({ minimumPayment: 100 })];
    const asOf = new Date(2026, 2, 10); // March 10 -> Jan, Feb are "complete"
    const payments = [pay("card-a", 100, "2026-01-05"), pay("card-a", 100, "2026-02-05")];
    const { met, total } = onTimeMonthsThisYear(debts, payments, asOf);
    expect(total).toBe(2);
    expect(met).toBe(2);
  });
});

describe("detectCurrentMilestones", () => {
  it("flags every threshold at or below the current percent", () => {
    const debts = [debt({ accountId: "a", balance: 250 })]; // paid 750 of 1000 -> 75%
    const payments = [pay("a", 750, "2026-01-01")];
    const found = detectCurrentMilestones(debts, payments);
    const thresholds = found.filter((m) => m.kind === "debt_threshold").map((m) => m.threshold);
    expect(thresholds.sort()).toEqual([25, 50, 75]);
  });

  it("flags no debt thresholds when nothing's been paid", () => {
    const found = detectCurrentMilestones([debt()], []);
    expect(found.filter((m) => m.kind === "debt_threshold")).toHaveLength(0);
  });
});

describe("interestShortfalls", () => {
  it("flags a debt whose minimum is below its own monthly interest", () => {
    // ₱500,000 at 36% APR accrues 500000 * 0.36/12 = ₱15,000/month.
    const d = debt({ accountId: "gcash", balance: 500_000, apr: 36, minimumPayment: 5_000 });
    const [s] = interestShortfalls([d]);
    expect(s.monthlyInterest).toBeCloseTo(15_000, 2);
    expect(s.shortfall).toBeCloseTo(10_000, 2);
  });

  it("does not flag a debt whose minimum covers its interest", () => {
    // Same balance/APR, but a minimum above the ₱15,000 interest.
    const d = debt({ accountId: "gcash", balance: 500_000, apr: 36, minimumPayment: 20_000 });
    expect(interestShortfalls([d])).toHaveLength(0);
  });

  it("is independent per debt — a healthy debt never appears", () => {
    const bad = debt({ accountId: "gcash", balance: 500_000, apr: 36, minimumPayment: 5_000 });
    const fine = debt({ accountId: "maya", balance: 6_000, apr: 3, minimumPayment: 200 });
    const found = interestShortfalls([bad, fine]);
    expect(found.map((s) => s.accountId)).toEqual(["gcash"]);
  });

  it("sorts worst shortfall first", () => {
    const small = debt({ accountId: "a", balance: 10_000, apr: 24, minimumPayment: 150 }); // interest 200, short 50
    const large = debt({ accountId: "b", balance: 500_000, apr: 36, minimumPayment: 5_000 }); // short 10,000
    const found = interestShortfalls([small, large]);
    expect(found.map((s) => s.accountId)).toEqual(["b", "a"]);
  });
});
