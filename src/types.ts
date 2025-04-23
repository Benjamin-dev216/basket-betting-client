// src/types.ts
export interface Team {
  name: string;
  id?: string; // optional, if GoalServe sends team ID
}

export interface Match {
  matchId: string;
  eventId: string;
  competition: string;
  teams: {
    home: string;
    away: string;
  };
  isLive: boolean;
}
