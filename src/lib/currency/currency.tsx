"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

/** Supported display currencies. `locale` picks the correct symbol placement/grouping. */
export const CURRENCIES = [
  { code: "USD", label: "US Dollar", locale: "en-US" },
  { code: "CAD", label: "Canadian Dollar", locale: "en-CA" },
  { code: "EUR", label: "Euro", locale: "en-IE" },
  { code: "GBP", label: "British Pound", locale: "en-GB" },
  { code: "AUD", label: "Australian Dollar", locale: "en-AU" },
  { code: "NZD", label: "New Zealand Dollar", locale: "en-NZ" },
  { code: "INR", label: "Indian Rupee", locale: "en-IN" },
  { code: "JPY", label: "Japanese Yen", locale: "ja-JP" },
  { code: "MXN", label: "Mexican Peso", locale: "es-MX" },
  { code: "PHP", label: "Philippine Peso", locale: "en-PH" },
] as const;

export type CurrencyCode = (typeof CURRENCIES)[number]["code"];

const DEFAULT_CURRENCY: CurrencyCode = "USD";
export const STORAGE_KEY = "goodbyedebt.currency";

/** Reads the persisted currency directly from storage (for verifying a save). */
export function readSavedCurrency(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function localeFor(code: CurrencyCode): string {
  return CURRENCIES.find((c) => c.code === code)?.locale ?? "en-US";
}

export interface CurrencyContextValue {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  /** Format a number as money in the active currency. */
  format: (amount: number, opts?: { maximumFractionDigits?: number }) => string;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>(DEFAULT_CURRENCY);

  // Hydrate from localStorage after mount (avoids SSR/client mismatch).
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY) as CurrencyCode | null;
      if (saved && CURRENCIES.some((c) => c.code === saved)) setCurrencyState(saved);
    } catch {
      /* localStorage unavailable — fall back to default. */
    }
  }, []);

  const setCurrency = useCallback((code: CurrencyCode) => {
    setCurrencyState(code);
    try {
      window.localStorage.setItem(STORAGE_KEY, code);
    } catch {
      /* ignore persistence failure */
    }
  }, []);

  const format = useCallback(
    (amount: number, opts?: { maximumFractionDigits?: number }) =>
      (Number.isFinite(amount) ? amount : 0).toLocaleString(localeFor(currency), {
        style: "currency",
        currency,
        maximumFractionDigits: opts?.maximumFractionDigits ?? 2,
      }),
    [currency]
  );

  const value = useMemo(() => ({ currency, setCurrency, format }), [currency, setCurrency, format]);

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within a CurrencyProvider");
  return ctx;
}
