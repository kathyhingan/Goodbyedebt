import { describe, it, expect } from "vitest";
import type { Debt } from "../../engine/types";
import { nextDueDate, upcomingDueDates, dueForReminder } from "../dueDates";

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
