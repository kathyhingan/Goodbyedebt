import { describe, it, expect } from "vitest";
import type { Debt } from "../../engine/types";
import {
  nextDueDate,
  upcomingDueDates,
  dueForReminder,
  statementsNeedingRefresh,
} from "../dueDates";

function debt(accountId: string, dueDate?: string): Debt {
  return { accountId, creditor: accountId, balance: 1000, apr: 20, minimumPayment: 50, debtType: "credit_card", dueDate };
}

describe("nextDueDate", () => {
  it("returns this month's date when still upcoming", () => {
    const next = nextDueDate("2026-01-15", new Date(2026, 7, 10)); // Aug 10
    expect(next.getFullYear()).toBe(2026);
    expect(next.getMonth()).toBe(7); // August
    expect(next.getDate()).toBe(15);
  });

  it("rolls to next month when this month's date has passed", () => {
    const next = nextDueDate("2026-01-05", new Date(2026, 7, 10)); // Aug 10, 5th passed
    expect(next.getMonth()).toBe(8); // September
    expect(next.getDate()).toBe(5);
  });

  it("clamps day-of-month to a shorter month", () => {
    const next = nextDueDate("2026-01-31", new Date(2026, 1, 1)); // Feb 1
    expect(next.getMonth()).toBe(1); // February
    expect(next.getDate()).toBe(28); // clamped
  });

  it("treats today as still due (0 days)", () => {
    const next = nextDueDate("2026-01-10", new Date(2026, 7, 10));
    expect(next.getDate()).toBe(10);
    expect(next.getMonth()).toBe(7);
  });

  it("uses a stored future date directly (e.g. advanced after a payment)", () => {
    const next = nextDueDate("2026-09-14", new Date(2026, 7, 14)); // Aug 14
    expect(next.getMonth()).toBe(8); // September — not rolled back to Aug 14
    expect(next.getDate()).toBe(14);
  });
});

describe("upcomingDueDates", () => {
  it("sorts by soonest and respects the horizon", () => {
    const debts = [debt("a", "2026-01-20"), debt("b", "2026-01-12"), debt("c")];
    const list = upcomingDueDates(debts, new Date(2026, 7, 10), 45);
    expect(list.map((u) => u.accountId)).toEqual(["b", "a"]); // c has no due date
    expect(list[0].daysUntil).toBeLessThanOrEqual(list[1].daysUntil);
  });
});

describe("dueForReminder", () => {
  it("fires exactly on lead days", () => {
    const today = new Date(2026, 7, 10);
    const debts = [debt("five", "2026-01-15"), debt("one", "2026-01-11"), debt("far", "2026-01-25")];
    const fired = dueForReminder(debts, [5, 1], today).map((u) => u.accountId).sort();
    expect(fired).toEqual(["five", "one"]);
  });
});

describe("statementsNeedingRefresh", () => {
  const today = new Date(2026, 7, 10); // Aug 10, 2026

  function withStatement(accountId: string, billingDate: string, lastUpdated?: string, balance = 1000): Debt {
    return { accountId, creditor: accountId, balance, apr: 20, minimumPayment: 50, debtType: "credit_card", billingDate, lastUpdated };
  }

  it("flags a debt whose latest statement closed after its last update", () => {
    // Statement closes on the 3rd; Aug 3 has passed and data is from July.
    const list = statementsNeedingRefresh([withStatement("a", "2026-06-03", "2026-07-15T00:00:00Z")], today);
    expect(list.map((s) => s.accountId)).toEqual(["a"]);
    expect(list[0].statementDate).toBe("2026-08-03");
  });

  it("does not flag a debt already updated since the latest statement", () => {
    const list = statementsNeedingRefresh([withStatement("a", "2026-06-03", "2026-08-05T00:00:00Z")], today);
    expect(list).toEqual([]);
  });

  it("skips fully-paid debts and debts without a billing date", () => {
    const debts = [
      withStatement("paid", "2026-06-03", "2026-01-01T00:00:00Z", 0),
      debt("nobilling", "2026-01-15"),
    ];
    expect(statementsNeedingRefresh(debts, today)).toEqual([]);
  });
});
