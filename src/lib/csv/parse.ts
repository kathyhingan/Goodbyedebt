import type { Debt, DebtType } from "../engine/types";
import { CSV_COLUMNS, DEBT_TYPES } from "./template";

export interface RowError {
  row: number; // 1-based, excluding header
  field?: string;
  message: string;
}

export interface ParseResult {
  debts: Debt[];
  errors: RowError[];
}

export type MergeOutcome = "created" | "updated";

export interface MergeResult {
  debts: Debt[];
  outcomes: Map<string, MergeOutcome>; // accountId -> what happened
  errors: RowError[];
}

/**
 * Parses CSV text into Debt records with per-row validation (SOW 8.2).
 * Tolerant of quoted fields, surrounding whitespace, and missing optional
 * columns. Malformed rows are collected in `errors`, not thrown.
 */
export function parseDebtsCsv(text: string): ParseResult {
  const lines = splitLines(text);
  const errors: RowError[] = [];
  const debts: Debt[] = [];

  if (lines.length === 0) return { debts, errors };

  const header = parseLine(lines[0]).map((h) => h.trim());
  const index = new Map(header.map((h, i) => [h, i]));

  for (const required of ["accountId", "creditor", "balance", "apr", "minimumPayment"]) {
    if (!index.has(required)) {
      errors.push({ row: 0, field: required, message: `Missing required column "${required}"` });
    }
  }
  if (errors.length > 0) return { debts, errors };

  const seen = new Set<string>();

  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === "") continue;
    const cells = parseLine(lines[i]);
    const rowNum = i;
    const get = (col: string) => {
      const idx = index.get(col);
      return idx == null ? "" : (cells[idx] ?? "").trim();
    };

    const accountId = get("accountId");
    if (!accountId) {
      errors.push({ row: rowNum, field: "accountId", message: "accountId is required" });
      continue;
    }
    if (seen.has(accountId)) {
      errors.push({ row: rowNum, field: "accountId", message: `Duplicate accountId "${accountId}" within file` });
      continue;
    }

    const balance = parseNumber(get("balance"));
    const apr = parseNumber(get("apr"));
    const minimumPayment = parseNumber(get("minimumPayment"));

    const rowErrors: RowError[] = [];
    if (balance == null || balance < 0) rowErrors.push({ row: rowNum, field: "balance", message: "balance must be a non-negative number" });
    if (apr == null || apr < 0) rowErrors.push({ row: rowNum, field: "apr", message: "apr must be a non-negative number" });
    if (minimumPayment == null || minimumPayment < 0) rowErrors.push({ row: rowNum, field: "minimumPayment", message: "minimumPayment must be a non-negative number" });

    const debtType = normalizeDebtType(get("debtType"));

    if (rowErrors.length > 0) {
      errors.push(...rowErrors);
      continue;
    }

    seen.add(accountId);
    const debt: Debt = {
      accountId,
      creditor: get("creditor"),
      balance: balance!,
      apr: apr!,
      minimumPayment: minimumPayment!,
      debtType,
      lastUpdated: new Date().toISOString(),
    };

    const dueDate = get("dueDate");
    if (dueDate) debt.dueDate = dueDate;
    const billingDate = get("billingDate");
    if (billingDate) debt.billingDate = billingDate;
    const promoRate = parseNumber(get("promoRate"));
    if (promoRate != null) debt.promoRate = promoRate;
    const promoExpiry = get("promoExpiry");
    if (promoExpiry) debt.promoExpiry = promoExpiry;

    debts.push(debt);
  }

  return { debts, errors };
}

/**
 * Consolidates parsed rows against existing debts by accountId (SOW 4.1).
 * A matching accountId updates the existing record; a new accountId creates
 * one. Matching is never done by creditor name.
 */
export function mergeByAccountId(existing: Debt[], incoming: Debt[]): MergeResult {
  const parse = { errors: [] as RowError[] };
  const byId = new Map(existing.map((d) => [d.accountId, d]));
  const outcomes = new Map<string, MergeOutcome>();

  for (const row of incoming) {
    if (byId.has(row.accountId)) {
      byId.set(row.accountId, { ...byId.get(row.accountId)!, ...row });
      outcomes.set(row.accountId, "updated");
    } else {
      byId.set(row.accountId, row);
      outcomes.set(row.accountId, "created");
    }
  }

  return { debts: [...byId.values()], outcomes, errors: parse.errors };
}

function normalizeDebtType(raw: string): DebtType {
  const v = raw.toLowerCase().replace(/[\s-]+/g, "_");
  return (DEBT_TYPES as string[]).includes(v) ? (v as DebtType) : "other";
}

function parseNumber(raw: string): number | null {
  if (raw === "") return null;
  const cleaned = raw.replace(/[$,]/g, "").trim();
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

function splitLines(text: string): string[] {
  return text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n").filter((l, i, a) => !(i === a.length - 1 && l === ""));
}

/** Minimal RFC-4180-ish line parser: handles quoted fields and embedded commas. */
function parseLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') { cur += '"'; i++; }
        else inQuotes = false;
      } else cur += ch;
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      out.push(cur);
      cur = "";
    } else {
      cur += ch;
    }
  }
  out.push(cur);
  return out;
}

// Re-export for convenience.
export { CSV_COLUMNS };
