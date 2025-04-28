import { ScoreFormat } from "../types/match";

export function normalizeScores(stats: any): ScoreFormat {
  // Case B: already normalized (Q1, Q2, H1...)
  if (stats.Q1 !== undefined) {
    return stats as ScoreFormat;
  }

  // Case A: stats["1"], stats["2"], etc.
  const map: Record<string, keyof ScoreFormat> = {
    "1": "Q1",
    "2": "Q2",
    H1: "H1",
    "3": "Q3",
    "4": "Q4",
    OT: "OT",
    T: "T",
  };

  const result: ScoreFormat = {};

  for (const key in stats) {
    const mapped = map[stats[key].name];
    if (mapped) {
      const home = parseInt(stats[key].home ?? "0", 10);
      const away = parseInt(stats[key].away ?? "0", 10);
      result[mapped] = [home, away];
    }
  }

  // Only add H1 if missing but Q1 and Q2 exist
  if (!result.H1 && result.Q1 && result.Q2) {
    result.H1 = [
      (result.Q1[0] ?? 0) + (result.Q2[0] ?? 0),
      (result.Q1[1] ?? 0) + (result.Q2[1] ?? 0),
    ];
  }

  return result;
}
