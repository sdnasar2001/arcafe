// Reads opening hours like "5 AM - 11 PM Open Daily" into minutes after midnight.
export type Hours = { open: number; close: number; openLabel: string; closeLabel: string };

function toMinutes(h: string, m: string | undefined, ap: string) {
  let hour = Number(h) % 12;
  if (ap.toUpperCase() === "PM") hour += 12;
  return hour * 60 + (m ? Number(m) : 0);
}

export function parseHours(text: string): Hours | null {
  const m = /(\d{1,2})(?:[:.](\d{2}))?\s*(AM|PM)\s*[-–to]+\s*(\d{1,2})(?:[:.](\d{2}))?\s*(AM|PM)/i.exec(text || "");
  if (!m) return null;
  return {
    open: toMinutes(m[1], m[2], m[3]),
    close: toMinutes(m[4], m[5], m[6]),
    openLabel: `${m[1]}${m[2] ? ":" + m[2] : ""} ${m[3].toUpperCase()}`,
    closeLabel: `${m[4]}${m[5] ? ":" + m[5] : ""} ${m[6].toUpperCase()}`,
  };
}

// "05:00" style, for Google's opening-hours format.
export function hhmm(minutes: number) {
  const h = Math.floor(minutes / 60) % 24;
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}
