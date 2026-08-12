import { describe, expect, it } from "vitest";
import { formatDuration, formatMonthYear } from "../duration";

describe("formatDuration", () => {
  it("handles zero months", () => {
    expect(formatDuration(0)).toBe("already debt-free");
  });

  it("formats months only", () => {
    expect(formatDuration(1)).toBe("1 month");
    expect(formatDuration(11)).toBe("11 months");
  });

  it("formats whole years", () => {
    expect(formatDuration(12)).toBe("1 year");
    expect(formatDuration(24)).toBe("2 years");
  });

  it("formats years and months together", () => {
    expect(formatDuration(38)).toBe("3 years, 2 months");
    expect(formatDuration(13)).toBe("1 year, 1 month");
  });

  it("rounds fractional months", () => {
    expect(formatDuration(11.6)).toBe("1 year");
  });
});

describe("formatMonthYear", () => {
  it("formats an ISO date to month + year", () => {
    expect(formatMonthYear("2027-03-15")).toBe("March 2027");
  });

  it("returns the input when unparseable", () => {
    expect(formatMonthYear("not-a-date")).toBe("not-a-date");
  });
});
