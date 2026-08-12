import { describe, it, expect } from "vitest";
import { parseDebtsCsv, mergeByAccountId } from "../parse";
import { csvTemplate } from "../template";

describe("parseDebtsCsv", () => {
  it("parses the shipped template example", () => {
    const { debts, errors } = parseDebtsCsv(csvTemplate());
    expect(errors).toHaveLength(0);
    expect(debts).toHaveLength(1);
    expect(debts[0].accountId).toBe("visa-personal");
    expect(debts[0].balance).toBe(4200);
    expect(debts[0].debtType).toBe("credit_card");
  });

  it("strips $ and , from numbers and quoted fields", () => {
    const csv = [
      "accountId,creditor,balance,apr,minimumPayment",
      'amex,"Amex, Platinum","$3,500.50",19.99,75',
    ].join("\n");
    const { debts, errors } = parseDebtsCsv(csv);
    expect(errors).toHaveLength(0);
    expect(debts[0].creditor).toBe("Amex, Platinum");
    expect(debts[0].balance).toBe(3500.5);
  });

  it("reports missing required columns", () => {
    const { errors } = parseDebtsCsv("accountId,creditor\nx,y");
    expect(errors.some((e) => e.field === "balance")).toBe(true);
  });

  it("collects malformed rows without throwing", () => {
    const csv = [
      "accountId,creditor,balance,apr,minimumPayment",
      "good,Bank,100,10,5",
      "bad,Bank,notanumber,10,5",
      ",NoId,100,10,5",
    ].join("\n");
    const { debts, errors } = parseDebtsCsv(csv);
    expect(debts).toHaveLength(1);
    expect(debts[0].accountId).toBe("good");
    expect(errors).toHaveLength(2);
  });

  it("flags duplicate accountIds within a file", () => {
    const csv = [
      "accountId,creditor,balance,apr,minimumPayment",
      "dup,A,100,10,5",
      "dup,B,200,10,5",
    ].join("\n");
    const { debts, errors } = parseDebtsCsv(csv);
    expect(debts).toHaveLength(1);
    expect(errors.some((e) => /Duplicate/.test(e.message))).toBe(true);
  });
});

describe("mergeByAccountId", () => {
  it("updates matches and creates new by accountId, never by creditor name", () => {
    const existing = parseDebtsCsv(
      ["accountId,creditor,balance,apr,minimumPayment", "card,Chase,5000,20,100"].join("\n")
    ).debts;

    const incoming = parseDebtsCsv(
      [
        "accountId,creditor,balance,apr,minimumPayment",
        "card,Chase Bank,4200,20,100", // same accountId, renamed creditor + new balance
        "new,Discover,1500,15,40",
      ].join("\n")
    ).debts;

    const { debts, outcomes } = mergeByAccountId(existing, incoming);
    expect(debts).toHaveLength(2);
    expect(outcomes.get("card")).toBe("updated");
    expect(outcomes.get("new")).toBe("created");
    const card = debts.find((d) => d.accountId === "card")!;
    expect(card.balance).toBe(4200);
    expect(card.creditor).toBe("Chase Bank");
  });
});
