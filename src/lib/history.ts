export type HistoryMode = "persen" | "equity";

export interface HistoryEntry {
  id: string;
  timestamp: string;
  mode: HistoryMode;
  drawdownPct: number;
  recoveryPct: number;
  equityAwal: number | null;
  equityTersisa: number | null;
}

const KEY = "dd-history";
const MAX = 10;

export function loadHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as HistoryEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveHistory(entries: HistoryEntry[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(entries));
  } catch {
    /* ignore */
  }
}

export function appendHistory(
  prev: HistoryEntry[],
  entry: Omit<HistoryEntry, "id" | "timestamp">,
): HistoryEntry[] {
  const last = prev[0];
  if (last && last.drawdownPct === entry.drawdownPct && last.mode === entry.mode) {
    return prev;
  }
  const next: HistoryEntry = {
    ...entry,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: new Date().toISOString(),
  };
  return [next, ...prev].slice(0, MAX);
}

export function clearHistory() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

const MONTHS_FULL = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

export function formatHistoryDate(iso: string): string {
  const d = new Date(iso);
  const day = d.getDate();
  const month = MONTHS_FULL[d.getMonth()];
  const year = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${day} ${month} ${year}, ${hh}:${mm}`;
}
