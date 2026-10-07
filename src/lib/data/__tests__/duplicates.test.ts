import { describe, it, expect } from "vitest";
import { findDuplicateGroups, mergedBalance } from "../duplicates";
import type { Debt } from "../../engine/types";

function debt(partial: Partial<Debt> & Pick<Debt, "accountId">): Debt {
  return {
    creditor: partial.creditor ?? partial.accountId,
    balance: 1000,
    apr: 20,
    minimumPayment: 50,
    debtType: "credit_card",
    ...partial,
  };
}

describe("findDuplicateGroups", () => {
  it("groups two statements of the same card uploaded under different ids", () => {
    // The real case: the same BDO card, monthly statements, ids derived from
    // the card number on one upload and a manual nickname on the other.
    const debts = [
      debt({ accountId: "bdo-1032", creditor: "BDO Installment Card", balance: 18_982, apr: 36, minimumPayment: 850 }),
      debt({ accountId: "BDO", creditor: "BDO Installment Card", balance: 19_866, apr: 36, minimumPayment: 850 }),
    ];
    const groups = findDuplicateGroups(debts);
    expect(groups).toHaveLength(1);
    expect(groups[0].accountIds.sort()).toEqual(["BDO", "bdo-1032"]);
  });

  it("is case and punctuation insensitive on the creditor name", () => {
    const debts = [
      debt({ accountId: "a", creditor: "BDO Installment Card" }),
      debt({ accountId: "b", creditor: "bdo  installment  card" }),
    ];
    expect(findDuplicateGroups(debts)).toHaveLength(1);
  });

  it("does not group same bank at different APRs (different products)", () => {
    const debts = [
      debt({ accountId: "a", creditor: "Gcash", apr: 24 }),
      debt({ accountId: "b", creditor: "Gcash", apr: 22 }),
    ];
    expect(findDuplicateGroups(debts)).toHaveLength(0);
  });

  it("does not group differently-named cards even at an identical APR", () => {
    // "Eastwest" and "East West 2" — the app can't tell whether the suffix
    // means a second card or the same card typed twice, so it must not guess.
    const debts = [
      debt({ accountId: "EW1", creditor: "Eastwest", apr: 36 }),
      debt({ accountId: "EW2", creditor: "East West 2", apr: 36 }),
    ];
    expect(findDuplicateGroups(debts)).toHaveLength(0);
  });

  it("groups three rows of the same account", () => {
    const debts = [
      debt({ accountId: "x", creditor: "Metrobank", apr: 36 }),
      debt({ accountId: "y", creditor: "Metrobank", apr: 36 }),
      debt({ accountId: "z", creditor: "Metrobank", apr: 36 }),
    ];
    expect(findDuplicateGroups(debts)[0].accountIds.sort()).toEqual(["x", "y", "z"]);
  });

  it("returns nothing for a clean set", () => {
    const debts = [
      debt({ accountId: "a", creditor: "BPI Credit Card", apr: 36 }),
      debt({ accountId: "b", creditor: "Metrobank", apr: 36 }),
      debt({ accountId: "c", creditor: "Gcash", apr: 24 }),
    ];
    expect(findDuplicateGroups(debts)).toHaveLength(0);
  });
});

describe("mergedBalance", () => {
  const rows = [
    debt({ accountId: "a", balance: 18_982 }),
    debt({ accountId: "b", balance: 19_866 }),
  ];

  it("defaults to the largest for statement-overlap duplicates", () => {
    // The newer statement already reflects everything the older did, so
    // summing them double-counts the same borrowing.
    expect(mergedBalance(rows, "largest")).toBe(19_866);
  });

  it("sums only when explicitly asked (genuinely separate balances)", () => {
    expect(mergedBalance(rows, "sum")).toBe(38_848);
  });

  it("ignores negative balances", () => {
    expect(mergedBalance([debt({ accountId: "a", balance: -5 }), debt({ accountId: "b", balance: 100 })], "sum")).toBe(100);
  });
});