export function localDateIso(now = new Date()): string {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Compares numerically: string comparison breaks for years with more than 4 digits.
function dayNumber(isoDate: string): number {
  const match = /^(\d+)-(\d{2})-(\d{2})$/.exec(isoDate);
  if (!match) return Number.NaN;
  const [, year, month, day] = match;
  return Number(year) * 10000 + Number(month) * 100 + Number(day);
}

export function isReferralDeadlineInPast(
  deadline: string,
  now = new Date(),
): boolean {
  return dayNumber(deadline) < dayNumber(localDateIso(now));
}
