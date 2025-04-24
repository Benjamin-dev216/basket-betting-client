import { useNavigate } from "react-router-dom";
import { useWebSocket } from "../context/WebSocketProvider";

interface Match {
  matchId: string;
  competition?: string;
  status?: string;
  timer?: string;
  teams: {
    home: {
      name: string;
      kitColors?: String[];
    };
    away: {
      name: string;
      kitColors?: String[];
    };
  };
  numericStats?: {
    T?: [number, number];
  };
}

interface GroupedMatches {
  [competition: string]: Match[];
}

const groupByCompetition = (matches: Match[]): GroupedMatches => {
  return matches.reduce((acc, match) => {
    const comp = match.competition || "Others";
    acc[comp] = acc[comp] || [];
    acc[comp].push(match);
    return acc;
  }, {} as GroupedMatches);
};

const MatchList = () => {
  const { matchList, selectMatch } = useWebSocket();
  const navigate = useNavigate();
  const groupedMatches = groupByCompetition(matchList);

  const handleSelect = (matchId: string) => {
    selectMatch(matchId);
    navigate("/market");
  };

  return (
    <div className="p-4 space-y-6">
      {Object.entries(groupedMatches).map(([competition, matches]) => (
        <CompetitionBlock
          key={competition}
          title={competition}
          matches={matches}
          onMatchClick={handleSelect}
        />
      ))}
    </div>
  );
};

const CompetitionBlock = ({
  title,
  matches,
  onMatchClick,
}: {
  title: string;
  matches: Match[];
  onMatchClick: (matchId: string) => void;
}) => (
  <div>
    <div className="bg-neutral-700 text-white font-bold px-4 py-2 rounded-t-md uppercase tracking-wide text-sm shadow">
      {title}
    </div>
    <div className="space-y-2">
      {matches.map((match) => (
        <MatchCard
          key={match.matchId}
          match={match}
          onClick={() => onMatchClick(match.matchId)}
        />
      ))}
    </div>
  </div>
);

const MatchCard = ({
  match,
  onClick,
}: {
  match: Match;
  onClick: () => void;
}) => (
  <div
    onClick={onClick}
    className="cursor-pointer bg-neutral-800 text-white rounded-xl p-4 shadow hover:shadow-lg transition"
  >
    <TeamRow team={match.teams.home} score={match.numericStats?.T?.[0]} />
    <div className="my-1" />
    <TeamRow team={match.teams.away} score={match.numericStats?.T?.[1]} />
    {match.status || match.timer ? (
      <div className="mt-2 text-right text-xs text-gray-400">
        {match.status} {match.timer && `• ${match.timer}`}
      </div>
    ) : null}
  </div>
);

const TeamRow = ({
  team,
  score,
}: {
  team: { name: string; kitColors?: String[] };
  score?: number;
}) => {
  const primaryColor = team.kitColors?.[0].toString() || "#666";
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2 min-w-0">
        <div
          className="w-3 h-5 rounded-sm"
          style={{ backgroundColor: primaryColor }}
        />
        <span className="truncate">{team.name}</span>
      </div>
      <div className="text-xl font-bold">
        {typeof score === "number" ? score : 0}
      </div>
    </div>
  );
};

export default MatchList;
