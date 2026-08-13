/** Percent of debt paid off, clamped to 0–100. Returns 0 when there's no
 * original baseline (avoids divide-by-zero and negative progress). */
export function percentPaidOff(original: number, current: number): number {
  if (original <= 0) return 0;
  const pct = ((original - current) / original) * 100;
  return Math.max(0, Math.min(100, Math.round(pct * 10) / 10));
}

/** Default pseudonym — real name is never required (spec §2, §3.3). */
export function generatePseudonym(): string {
  return `DebtSlayer_${Math.floor(1000 + Math.random() * 9000)}`;
}

/** ISO alpha-2 → flag emoji (regional indicator letters). */
export function flagEmoji(cc: string): string {
  if (!/^[A-Za-z]{2}$/.test(cc)) return "🏳️";
  return cc
    .toUpperCase()
    .replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)));
}

export interface Country {
  code: string;
  name: string;
}

// A practical list; Philippines first since that's the primary audience.
export const COUNTRIES: Country[] = [
  { code: "PH", name: "Philippines" },
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "GB", name: "United Kingdom" },
  { code: "AU", name: "Australia" },
  { code: "NZ", name: "New Zealand" },
  { code: "SG", name: "Singapore" },
  { code: "MY", name: "Malaysia" },
  { code: "ID", name: "Indonesia" },
  { code: "TH", name: "Thailand" },
  { code: "VN", name: "Vietnam" },
  { code: "IN", name: "India" },
  { code: "JP", name: "Japan" },
  { code: "KR", name: "South Korea" },
  { code: "HK", name: "Hong Kong" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "SA", name: "Saudi Arabia" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "ES", name: "Spain" },
  { code: "IT", name: "Italy" },
  { code: "NL", name: "Netherlands" },
  { code: "MX", name: "Mexico" },
  { code: "BR", name: "Brazil" },
  { code: "ZA", name: "South Africa" },
];

export function countryName(code: string): string {
  return COUNTRIES.find((c) => c.code === code)?.name ?? code;
}
