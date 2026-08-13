import { describe, expect, it } from "vitest";
import {
  detectBank,
  extractTransactions,
  parseStatement,
  parseStatementDate,
  statementToDebt,
} from "../statement";

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

// A hypothetical third bank using slash dates and "New Balance" — proves the
// parser is not hard-coded to the two banks we have samples for.
const GENERIC_TEXT = `BPI Credit Cards
Statement Date 07/24/2026
Payment Due Date 08/14/2026
New Balance 12,500.00
Minimum Payment Due 625.00
Credit Limit 100,000.00
Card Number 4000-1234-5678-9010`;

describe("parseStatementDate", () => {
  it("parses the common PH formats", () => {
    expect(parseStatementDate("Aug 28, 2026")).toBe("2026-08-28");
    expect(parseStatementDate("24 JUL 2026")).toBe("2026-07-24");
    expect(parseStatementDate("08/14/2026")).toBe("2026-08-14");
    expect(parseStatementDate("2026-08-14")).toBe("2026-08-14");
    expect(parseStatementDate("28-Aug-2026")).toBe("2026-08-28");
  });
  it("returns null on unparseable input", () => {
    expect(parseStatementDate("sometime next week")).toBeNull();
  });
});

describe("detectBank", () => {
  it("names known issuers and falls back for the rest", () => {
    expect(detectBank(BDO_TEXT).name).toBe("BDO");
    expect(detectBank(SBC_TEXT).name).toBe("Security Bank");
    expect(detectBank(GENERIC_TEXT).name).toBe("BPI");
    expect(detectBank("Some other lender").name).toBe("Unknown bank");
  });
});

describe("parseStatement — BDO", () => {
  const p = parseStatement(BDO_TEXT);
  it("extracts every field and annualizes APR", () => {
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
  it("handles PHP amounts, above-label due date, prose APR", () => {
    expect(p.bank).toBe("Security Bank");
    expect(p.balance.value).toBe(79043.1);
    expect(p.minimumPayment.value).toBe(2371.29);
    expect(p.dueDate.value).toBe("2026-08-14");
    expect(p.statementDate.value).toBe("2026-07-24");
    expect(p.apr.value).toBe(36);
    expect(p.aprNeedsReview).toBe(true);
    expect(p.accountId).toBe("sbc-3301");
    expect(p.missing).toEqual([]);
  });
});

describe("parseStatement — generic (no per-bank code)", () => {
  const p = parseStatement(GENERIC_TEXT);
  it("reads a bank we have no dedicated parser for", () => {
    expect(p.recognized).toBe(true);
    expect(p.balance.value).toBe(12500); // "New Balance"
    expect(p.minimumPayment.value).toBe(625);
    expect(p.dueDate.value).toBe("2026-08-14"); // slash date
    expect(p.statementDate.value).toBe("2026-07-24");
    expect(p.accountId).toBe("bpi-9010");
  });
});

describe("extractTransactions", () => {
  const TXNS = `PREVIOUS STATEMENT BALANCE 16,186.30
08/03/26 08/03/26 FINANCE CHARGE-RETAIL PURCHASES 423.96
07/09/26 07/12/26 PAYMENT RECEIVED - THANK YOU -3,000.00
07/09/26 07/12/26 APPLE.COM/BILL CORK IRL 565.60
07/16/26 07/16/26 PAYMENT - PHP/SBC1 3,000.00 CR
07/19/26 07/20/26 FS *dataforseo fsprg nl NLD 3,540.72
SUBTOTAL 18,428.89`;

  const txns = extractTransactions(TXNS);

  it("captures the transaction rows and skips balance/subtotal noise", () => {
    expect(txns.map((t) => t.description)).toEqual([
      "FINANCE CHARGE-RETAIL PURCHASES",
      "PAYMENT RECEIVED - THANK YOU",
      "APPLE.COM/BILL CORK IRL",
      "PAYMENT - PHP/SBC1",
      "FS *dataforseo fsprg nl NLD",
    ]);
  });

  it("marks payments/credits vs charges", () => {
    const byDesc = Object.fromEntries(txns.map((t) => [t.description, t]));
    expect(byDesc["APPLE.COM/BILL CORK IRL"].direction).toBe("debit");
    expect(byDesc["APPLE.COM/BILL CORK IRL"].amount).toBe(565.6);
    expect(byDesc["PAYMENT RECEIVED - THANK YOU"].direction).toBe("credit"); // leading minus
    expect(byDesc["PAYMENT - PHP/SBC1"].direction).toBe("credit"); // trailing CR
  });

  it("normalizes MM/DD/YY dates to ISO using the transaction date", () => {
    expect(txns[0].txnDate).toBe("2026-08-03");
  });
});

describe("parseStatement — unreadable", () => {
  it("is not recognized when no figures are found", () => {
    const p = parseStatement("A scanned image with no extractable text labels");
    expect(p.recognized).toBe(false);
    expect(p.missing.length).toBeGreaterThan(0);
  });
});
