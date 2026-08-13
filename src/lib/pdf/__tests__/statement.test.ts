import { describe, expect, it } from "vitest";
import {
  detectBank,
  parseStatement,
  parseStatementDate,
  statementToDebt,
} from "../statement";

// Line-reconstructed text from a real BDO Installment Card ESOA (redacted).
const BDO_TEXT = `Statement of Account
INSTALLMENT CARD (PHP)
Statement Date August 3, 2026
Card Number 5480-9505-6493-1032
Credit Limit 20,000
Interest Rate per Month 3.00%
Minimum Amount Due 850.00
Total Amount Due 18,428.89
Payment Due Date Aug 28, 2026
BDO Unibank, Inc. is regulated by the Bangko Sentral ng Pilipinas`;

// Line-reconstructed text from a real Security Bank Mastercard ESOA (redacted).
const SBC_TEXT = `CREDIT CARD ACCOUNT NUMBER
5181-7890-2327-3301
CUT-OFF STATEMENT DATE 24 JUL 2026
14 AUG 2026
PAYMENT DUE DATE
CREDIT LIMIT PHP 195,000.00
TOTAL AMOUNT DUE PHP 79,043.10
MINIMUM AMOUNT DUE PHP 2,371.29
Furthermore, an additional interest charge of 3% per month (or 36% per annum) will be
Security Bank Customer Service Hotline`;

describe("parseStatementDate", () => {
  it("parses BDO 'Month D, YYYY'", () => {
    expect(parseStatementDate("Aug 28, 2026")).toBe("2026-08-28");
    expect(parseStatementDate("August 3, 2026")).toBe("2026-08-03");
  });
  it("parses Security Bank 'D MON YYYY'", () => {
    expect(parseStatementDate("24 JUL 2026")).toBe("2026-07-24");
    expect(parseStatementDate("14 AUG 2026")).toBe("2026-08-14");
  });
  it("returns null on unparseable input", () => {
    expect(parseStatementDate("sometime next week")).toBeNull();
  });
});

describe("detectBank", () => {
  it("distinguishes the banks and ignores generic phrases", () => {
    expect(detectBank(BDO_TEXT)).toBe("BDO");
    expect(detectBank(SBC_TEXT)).toBe("Security Bank");
    expect(detectBank("Statement of Account\nSome other bank")).toBe("Unknown");
  });
});

describe("parseStatement — BDO", () => {
  const p = parseStatement(BDO_TEXT);
  it("extracts every field and annualizes APR", () => {
    expect(p.bank).toBe("BDO");
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
    expect(p.missing).toEqual([]);
    expect(p.aprNeedsReview).toBe(false);
  });
});

describe("parseStatement — Security Bank", () => {
  const p = parseStatement(SBC_TEXT);

  it("detects the bank", () => {
    expect(p.bank).toBe("Security Bank");
    expect(p.creditor).toBe("Security Bank Credit Card");
  });
  it("extracts PHP-prefixed amounts", () => {
    expect(p.balance.value).toBe(79043.1);
    expect(p.minimumPayment.value).toBe(2371.29);
    expect(p.creditLimit.value).toBe(195000);
  });
  it("reads the due date even though it prints above the label", () => {
    expect(p.dueDate.value).toBe("2026-08-14");
    expect(p.statementDate.value).toBe("2026-07-24");
  });
  it("derives APR from the stated per-annum rate and flags it for review", () => {
    expect(p.apr.value).toBe(36);
    expect(p.aprMonthlyRaw).toBe("3%");
    expect(p.aprNeedsReview).toBe(true);
  });
  it("derives a stable account id from the card's last 4", () => {
    expect(p.accountId).toBe("sbc-3301");
  });
  it("reports nothing missing for a complete statement", () => {
    expect(p.missing).toEqual([]);
  });
});

describe("parseStatement — unknown bank", () => {
  it("flags an unknown bank and lists missing fields", () => {
    const p = parseStatement("Some random document with no useful labels");
    expect(p.bank).toBe("Unknown");
    expect(p.missing.length).toBeGreaterThan(0);
  });
});
