export type DifficultyLevel =
  | "Mudah"
  | "Sedang"
  | "Sulit"
  | "Sangat Sulit"
  | "Hampir Mustahil";

export interface ReferenceRow {
  drawdown: number;
  remaining: number;
  recovery: number;
  level: DifficultyLevel;
}

export const REFERENCE_ROWS: ReferenceRow[] = [
  { drawdown: 5, remaining: 95, recovery: 5.3, level: "Mudah" },
  { drawdown: 10, remaining: 90, recovery: 11.1, level: "Mudah" },
  { drawdown: 15, remaining: 85, recovery: 17.6, level: "Mudah" },
  { drawdown: 20, remaining: 80, recovery: 25.0, level: "Mudah" },
  { drawdown: 25, remaining: 75, recovery: 33.3, level: "Sedang" },
  { drawdown: 30, remaining: 70, recovery: 42.9, level: "Sedang" },
  { drawdown: 35, remaining: 65, recovery: 53.8, level: "Sedang" },
  { drawdown: 40, remaining: 60, recovery: 66.7, level: "Sedang" },
  { drawdown: 45, remaining: 55, recovery: 81.8, level: "Sulit" },
  { drawdown: 50, remaining: 50, recovery: 100.0, level: "Sulit" },
  { drawdown: 55, remaining: 45, recovery: 122.2, level: "Sangat Sulit" },
  { drawdown: 60, remaining: 40, recovery: 150.0, level: "Sangat Sulit" },
  { drawdown: 65, remaining: 35, recovery: 185.7, level: "Sangat Sulit" },
  { drawdown: 70, remaining: 30, recovery: 233.3, level: "Sangat Sulit" },
  { drawdown: 75, remaining: 25, recovery: 300.0, level: "Sangat Sulit" },
  { drawdown: 80, remaining: 20, recovery: 400.0, level: "Hampir Mustahil" },
  { drawdown: 85, remaining: 15, recovery: 566.7, level: "Hampir Mustahil" },
  { drawdown: 90, remaining: 10, recovery: 900.0, level: "Hampir Mustahil" },
  { drawdown: 95, remaining: 5, recovery: 1900.0, level: "Hampir Mustahil" },
  { drawdown: 99, remaining: 1, recovery: 9900.0, level: "Hampir Mustahil" },
];

export function levelClass(level: DifficultyLevel): string {
  switch (level) {
    case "Mudah":
      return "text-emerald-600 dark:text-emerald-400";
    case "Sedang":
      return "text-amber-600 dark:text-amber-400";
    case "Sulit":
      return "text-orange-600 dark:text-orange-400";
    case "Sangat Sulit":
      return "text-red-600 dark:text-red-400";
    case "Hampir Mustahil":
      return "text-red-800 dark:text-red-300";
  }
}

export function nearestReferenceDrawdown(dd: number): number {
  let best = REFERENCE_ROWS[0].drawdown;
  let bestDiff = Math.abs(dd - best);
  for (const r of REFERENCE_ROWS) {
    const diff = Math.abs(dd - r.drawdown);
    if (diff < bestDiff) {
      best = r.drawdown;
      bestDiff = diff;
    }
  }
  return best;
}
