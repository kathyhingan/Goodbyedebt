/** "3 years, 2 months" style phrasing for a whole number of months. */
export function formatDuration(totalMonths: number): string {
  const months = Math.max(0, Math.round(totalMonths));
  if (months === 0) return "already debt-free";
  const years = Math.floor(months / 12);
  const rem = months % 12;
  const parts: string[] = [];
  if (years > 0) parts.push(`${years} year${years === 1 ? "" : "s"}`);
  if (rem > 0) parts.push(`${rem} month${rem === 1 ? "" : "s"}`);
  return parts.join(", ");
}

/** "March 2027" from an ISO yyyy-mm-dd date. */
export function formatMonthYear(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}
