import React from "react";
import { Match } from "../types/match";

interface MatchCardProps {
  match: Match;
}

const getScore = (score?: number | null) => score ?? 0;

export const MatchCard: React.FC<MatchCardProps> = ({ match }) => {
  const { teams, numericStats } = match;

  const homeScore = getScore(numericStats?.home_score);
  const awayScore = getScore(numericStats?.away_score);

  return (
    <div className="flex justify-between items-center bg-gradient-to-br from-neutral-800 to-neutral-700 rounded-md px-4 py-2 shadow text-white w-full max-w-md">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-5 rounded-sm bg-gray-200" /> {/* Home Kit */}
          <span>{teams.home.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-5 rounded-sm bg-blue-700" /> {/* Away Kit */}
          <span>{teams.away.name}</span>
        </div>
      </div>
      <div className="flex flex-col gap-2 text-right font-bold">
        <div>{homeScore}</div>
        <div>{awayScore}</div>
      </div>
    </div>
  );
};
