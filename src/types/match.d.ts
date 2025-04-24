export interface Team {
  name: string;
  score?: number;
}

export interface Outcome {
  name: string;
  value: number;
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
}
