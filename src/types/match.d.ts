export interface Team {
  name: string;
  score?: number;
  kitColor?: String[];
}

export interface Outcome {
  name: string;
  value: number;
  liveValue: number | null;
}

export interface Market {
  marketId: string;
  handicap?: string;
  outcomes: Outcome[];
}

export interface Match {
  matchId: string;
  teams: {
    home: Team;
    away: Team;
  };
  status?: string;
  timer?: string;
  odds?: Market[];
  numericStats?: any;
  stp: number;
  statsParsed?: any;
  score?: ScoreFormat;
}
export interface ScoreFormat {
  Q1?: [number, number];
  Q2?: [number, number];
  H1?: [number, number];
  Q3?: [number, number];
  Q4?: [number, number];
  OT?: [number, number];
  T?: [number, number];
}
