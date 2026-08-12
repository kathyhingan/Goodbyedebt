import { describe, it, expect } from "vitest";
import { rowToDebt, debtToRow, type DebtRow } from "../mapping";
import type { Debt } from "../../engine/types";

describe("row/debt mapping", () => {
  it("maps a full DB row (numeric-as-string) to a Debt", () => {
    const row: DebtRow = {
      account_id: "visa",
      creditor: "Chase",
      balance: "4200.00",
      apr: "22.990",
      minimum_payment: "95.00",
      due_date: "2026-09-15",
      billing_date: "2026-08-28",
      debt_type: "credit_card",
      promo_rate: "0.000",
      promo_expiry: "2026-12-01",
      last_updated: "2026-08-12T00:00:00Z",
    };
    const d = rowToDebt(row);
    expect(d.balance).toBe(4200);
    expect(d.apr).toBe(22.99);
    expect(d.promoRate).toBe(0);
    expect(d.dueDate).toBe("2026-09-15");
  });

  it("omits optional fields when null", () => {
    const row: DebtRow = {
      account_id: "loan",
      creditor: null,
      balance: 1000,
      apr: 10,
      minimum_payment: 50,
      due_date: null,
      billing_date: null,
      debt_type: "personal_loan",
      promo_rate: null,
      promo_expiry: null,
    };
    const d = rowToDebt(row);
    expect(d.creditor).toBe("");
    expect(d.dueDate).toBeUndefined();
    expect(d.promoRate).toBeUndefined();
  });

  it("round-trips Debt -> row -> Debt", () => {
    const debt: Debt = {
      accountId: "amex",
      creditor: "Amex",
      balance: 2600,
      apr: 26.24,
      minimumPayment: 70,
      debtType: "credit_card",
      dueDate: "2026-09-05",
    };
    const back = rowToDebt({ ...debtToRow(debt) } as DebtRow);
    expect(back).toMatchObject({
      accountId: "amex",
      balance: 2600,
      apr: 26.24,
      dueDate: "2026-09-05",
    });
  });
});
