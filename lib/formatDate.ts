// lib/formatDate.ts
export function formatDate(dateStr: string) {
  // "2026-01-19T21:30:00+09:00" → "2026.01.19"
  const m = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return dateStr;
  return `${m[1]}.${m[2]}.${m[3]}`;
}
