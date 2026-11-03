import { describe, it, expect } from "vitest";
import {
  DEFAULT_SPLIT,
  parseAmount,
  parsePercent,
  percentTotal,
  profitFirstSplit,
  splitIsComplete,
} from "../profitFirst";

const buckets = DEFAULT_SPLIT.map((b) => ({ key: b.key, label: b.label, percent: b.percent }));
const byKey = (r: ReturnType<typeof profitFirstSplit>) =>
  Object.fromEntries(r.lines.map((l) => [l.key, l.amount]));

describe("default split", () => {
  it("is the locked 10 / 5 / 30 / 55 split, in order", () => {
    expect(DEFAULT_SPLIT.map((b) => b.percent)).toEqual([10, 5, 30, 55]);
    expect(DEFAULT_SPLIT.map((b) => b.label)).toEqual(["Tax", "Profit", "Owner's Pay", "OpEx"]);
    expect(percentTotal(DEFAULT_SPLIT)).toBe(100);
    expect(splitIsComplete(DEFAULT_SPLIT)).toBe(true);
  });

  it("labels the 5 percent bucket Profit, never DOT", () => {
    expect(DEFAULT_SPLIT.some((b) => /DOT/i.test(b.label))).toBe(false);
    expect(DEFAULT_SPLIT.find((b) => b.percent === 5)?.label).toBe("Profit");
  });
});

describe("profitFirstSplit", () => {
  it("splits a round income into round buckets and allocates all of it", () => {
    const r = profitFirstSplit(10000, buckets);
    expect(byKey(r)).toEqual({ tax: 1000, profit: 500, "owners-pay": 3000, opex: 5500 });
    expect(r.allocated).toBe(10000);
    expect(r.unallocated).toBe(0);
    expect(r.totalPercent).toBe(100);
  });

  it("gives every centavo a home when the income does not divide evenly", () => {
    const r = profitFirstSplit(3333.33, buckets);
    expect(r.allocated).toBe(3333.33);
    expect(r.unallocated).toBe(0);
    expect(r.lines.reduce((s, l) => s + l.amount, 0)).toBeCloseTo(3333.33, 10);
  });

  it("uses largest-remainder rounding, stable for the same input", () => {
    // 100.01 claims 10001 centavos; the four exact shares end in .1, .05, .3
    // and .55 of a centavo, so the leftover centavo goes to OpEx (largest
    // fraction). Checked in code, not by hand.
    const r = profitFirstSplit(100.01, buckets);
    expect(r.allocated).toBe(100.01);
    expect(byKey(r)).toEqual({ tax: 10, profit: 5, "owners-pay": 30, opex: 55.01 });
    expect(byKey(profitFirstSplit(100.01, buckets))).toEqual(byKey(r));
  });

  it("returns zeros for no income instead of a negative or NaN bucket", () => {
    for (const income of [0, -50, NaN, Infinity]) {
      const r = profitFirstSplit(income, buckets);
      expect(r.lines.every((l) => l.amount === 0)).toBe(true);
      expect(r.allocated).toBe(0);
      expect(r.unallocated).toBe(0);
    }
  });

  it("leaves the unclaimed share unallocated when the percentages do not add to 100", () => {
    const short = buckets.map((b) => (b.key === "opex" ? { ...b, percent: 50 } : b)); // 95 percent total
    const r = profitFirstSplit(10000, short);
    expect(r.totalPercent).toBe(95);
    expect(r.allocated).toBe(9500);
    expect(r.unallocated).toBe(500);
    expect(byKey(r).opex).toBe(5000);
  });

  it("handles a custom split a member sets themselves", () => {
    const custom = [
      { key: "tax", label: "Tax", percent: 20 },
      { key: "profit", label: "Profit", percent: 10 },
      { key: "owners-pay", label: "Owner's Pay", percent: 40 },
      { key: "opex", label: "OpEx", percent: 30 },
    ];
    const r = profitFirstSplit(5000, custom);
    expect(byKey(r)).toEqual({ tax: 1000, profit: 500, "owners-pay": 2000, opex: 1500 });
    expect(r.unallocated).toBe(0);
  });

  it("ignores a bucket whose percent is not a real number", () => {
    const broken = [...buckets.slice(0, 3), { key: "opex", label: "OpEx", percent: NaN }];
    const r = profitFirstSplit(1000, broken);
    expect(r.lines[3].amount).toBe(0);
    expect(r.totalPercent).toBe(45);
    expect(r.allocated).toBe(450);
  });
});

describe("inputs", () => {
  it("reads money however a member types it", () => {
    expect(parseAmount("12,345.67")).toBe(12345.67);
    expect(parseAmount("1000")).toBe(1000);
    expect(parseAmount("")).toBe(0);
    expect(parseAmount("abc")).toBe(0);
    expect(parseAmount("-500")).toBe(0);
  });

  it("keeps percentages inside 0 to 100", () => {
    expect(parsePercent("55")).toBe(55);
    expect(parsePercent("")).toBe(0);
    expect(parsePercent("120")).toBe(100);
    expect(parsePercent("-5")).toBe(0);
    expect(parsePercent("12.5")).toBe(12.5);
  });
});
