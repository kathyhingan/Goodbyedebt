import { describe, expect, it } from "vitest";
import { parseBdoStatement, parseStatementDate, statementToDebt } from "../bdo";

// Line-reconstructed text from a real BDO Installment Card ESOA (redacted).
const BDO_TEXT = `Statement of Account
INSTALLMENT CARD (PHP)
MS KATHLEEN JOY C HINGAN
Statement Date August 3, 2026
Card Number 5480-9505-6493-1032
Credit Limit 20,000
Interest Rate per Month 3.00%
Minimum Amount Due 850.00
Total Amount Due 18,428.89
Payment Due Date Aug 28, 2026
BDO Unibank, Inc. is regulated by the Bangko Sentral ng Pilipinas`;

describe("parseStatementDate", () => {
  it("parses abbreviated and full month names without tz drift", () => {
    expect(parseStatementDate("Aug 28, 2026")).toBe("2026-08-28");
    expect(parseStatementDate("August 3, 2026")).toBe("2026-08-03");
  });
  it("returns null on unparseable input", () => {
    expect(parseStatementDate("sometime next week")).toBeNull();
  });
});

describe("parseBdoStatement", () => {
  const p = parseBdoStatement(BDO_TEXT);

  it("detects the bank and creditor", () => {
    expect(p.bank).toBe("BDO");
    expect(p.creditor).toBe("BDO Installment Card");
  });

  it("extracts balance from Total Amount Due", () => {
    expect(p.balance.value).toBe(18428.89);
  });

  it("extracts the minimum payment", () => {
    expect(p.minimumPayment.value).toBe(850);
  });

  it("annualizes the monthly interest rate to APR", () => {
    expect(p.aprMonthlyRaw).toBe("3.00%");
    expect(p.apr.value).toBe(36); // 3.00% × 12
  });

  it("extracts and normalizes the due + statement dates", () => {
    expect(p.dueDate.value).toBe("2026-08-28");
    expect(p.statementDate.value).toBe("2026-08-03");
  });

  it("derives a stable account id from the card's last 4", () => {
    expect(p.accountId).toBe("bdo-1032");
    expect(p.cardMasked).toBe("•••• 1032");
  });

  it("reports nothing missing for a complete statement", () => {
    expect(p.missing).toEqual([]);
  });

  it("builds a Debt draft ready for the confirm form", () => {
    expect(statementToDebt(p)).toEqual({
      accountId: "bdo-1032",
      creditor: "BDO Installment Card",
      balance: 18428.89,
      apr: 36,
      minimumPayment: 850,
      debtType: "credit_card",
      dueDate: "2026-08-28",
      billingDate: "2026-08-03",
    });
  });
});

describe("parseBdoStatement — non-BDO / incomplete", () => {
  it("flags an unknown bank and lists missing fields", () => {
    const p = parseBdoStatement("Some other bank statement with no useful labels");
    expect(p.bank).toBe("Unknown");
    expect(p.missing.length).toBeGreaterThan(0);
  });
});
