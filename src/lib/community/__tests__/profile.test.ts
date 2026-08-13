import { describe, expect, it } from "vitest";
import { percentPaidOff, generatePseudonym, flagEmoji, countryName } from "../profile";

describe("percentPaidOff", () => {
  it("computes progress from original vs current", () => {
    expect(percentPaidOff(10000, 2500)).toBe(75);
    expect(percentPaidOff(10000, 10000)).toBe(0);
    expect(percentPaidOff(10000, 0)).toBe(100);
  });
  it("clamps to 0..100 and handles no baseline", () => {
    expect(percentPaidOff(0, 0)).toBe(0); // no original debt
    expect(percentPaidOff(1000, 1500)).toBe(0); // grew — never negative
    expect(percentPaidOff(1000, -50)).toBe(100); // never over 100
  });
  it("rounds to one decimal", () => {
    expect(percentPaidOff(3, 1)).toBe(66.7);
  });
});

describe("generatePseudonym", () => {
  it("matches the DebtSlayer_#### format", () => {
    expect(generatePseudonym()).toMatch(/^DebtSlayer_\d{4}$/);
  });
});

describe("flagEmoji", () => {
  it("maps ISO codes to flags and falls back safely", () => {
    expect(flagEmoji("PH")).toBe("🇵🇭");
    expect(flagEmoji("us")).toBe("🇺🇸");
    expect(flagEmoji("")).toBe("🏳️");
  });
});

describe("countryName", () => {
  it("resolves known codes", () => {
    expect(countryName("PH")).toBe("Philippines");
    expect(countryName("ZZ")).toBe("ZZ");
  });
});
