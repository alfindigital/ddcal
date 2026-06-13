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

interface HistoryFile {
  version: number;
  entries: HistoryEntry[];
}

const KEY = "dd-history";
const MAX = 10;
export const HISTORY_VERSION = 1;

function isEntry(v: unknown): v is HistoryEntry {
  if (!v || typeof v !== "object") return false;
  const e = v as Record<string, unknown>;
  return (
    typeof e.id === "string" &&
    typeof e.timestamp === "string" &&
    (e.mode === "persen" || e.mode === "equity") &&
    typeof e.drawdownPct === "number" &&
    typeof e.recoveryPct === "number"
  );
}

function migrate(raw: unknown): HistoryEntry[] {
  // v1 shape: { version, entries }
  if (raw && typeof raw === "object" && "version" in (raw as object)) {
    const file = raw as HistoryFile;
    if (Array.isArray(file.entries)) return file.entries.filter(isEntry);
    return [];
  }
  // legacy: plain array
  if (Array.isArray(raw)) return raw.filter(isEntry);
  return [];
}

export function loadHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    return migrate(JSON.parse(raw));
  } catch {
    // Corrupt data — reset cleanly so the app never white-screens.
    try {
      window.localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
    return [];
  }
}

export function saveHistory(entries: HistoryEntry[]): boolean {
  if (typeof window === "undefined") return false;
  let attempt = entries;
  // On quota errors, trim oldest entries and retry a few times before giving up.
  for (let i = 0; i < 4; i++) {
    try {
      const payload: HistoryFile = { version: HISTORY_VERSION, entries: attempt };
      window.localStorage.setItem(KEY, JSON.stringify(payload));
      return true;
    } catch {
      if (attempt.length <= 1) return false;
      attempt = attempt.slice(0, Math.max(1, Math.floor(attempt.length / 2)));
    }
  }
  return false;
}

export function appendHistory(
  prev: HistoryEntry[],
  entry: Omit<HistoryEntry, "id" | "timestamp">,
): HistoryEntry[] {
  const last = prev[0];
  if (
    last &&
    last.drawdownPct === entry.drawdownPct &&
    last.mode === entry.mode &&
    last.equityAwal === entry.equityAwal &&
    last.equityTersisa === entry.equityTersisa
  ) {
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

export function exportHistory(entries: HistoryEntry[]): string {
  return JSON.stringify({ version: HISTORY_VERSION, entries }, null, 2);
}

export function importHistory(text: string): HistoryEntry[] {
  const parsed = JSON.parse(text);
  const migrated = migrate(parsed);
  return migrated.slice(0, MAX);
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
