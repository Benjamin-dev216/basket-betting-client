import { useNavigate } from "react-router-dom";
import { useWebSocket } from "../context/WebSocketProvider";
import { useEffect } from "react";
import axios from "axios";
import { ClipLoader } from "react-spinners";

interface Match {
  matchId: string;
  competition?: string;
  status?: string;
  timer?: string;
  teams: {
    home: {
      name: string;
      kitColor?: String[];
    };
    away: {
      name: string;
      kitColor?: String[];
    };
  };
  numericStats?: {
    T?: [number, number];
  };
  pc?: number;
  stp: number;
  statsParsed?: any;
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
  const { matchList, selectMatch, setMatchList } = useWebSocket();
  const navigate = useNavigate();
  const groupedMatches = groupByCompetition(matchList);

  const handleSelect = (matchId: string) => {
    selectMatch(matchId);
    navigate("/market");
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get("/inplay-basket");

      const tempMatchList: Match[] = [];
      const tempEvents = Object.values(data.events) as Array<{
        info: { id: string; league: string; period: String };
        status: string;
        timer: string;
        team_info: {
          home: { name: string; kit_color?: string; score?: number };
          away: { name: string; kit_color?: string; score?: number };
        };
        pc: number;
      }>;
      tempEvents.map((match) => {
        const pc = !Number(match.info.period[0])
          ? 5
          : Number(match.info.period[0]);
        const tempMatch = {
          matchId: match.info.id,
          competition: match.info.league,
          status: match.status,
          timer: match.timer,
          teams: {
            home: {
              name: match.team_info.home.name,
              kitColors: match.team_info.home.kit_color?.split(",") ?? [],
            },
            away: {
              name: match.team_info.away.name,
              kitColors: match.team_info.away.kit_color?.split(",") ?? [],
            },
          },
          pc: pc,
          numericStats: {
            T: [
              Number(match.team_info.home.score) ?? 0,
              Number(match.team_info.away.score) ?? 0,
            ] as [number, number],
          },
          stp: 0, // Default value for stp
        };
        tempMatchList.push(tempMatch);
      });
      setMatchList(tempMatchList);
    };
    fetchData();
  }, []);

  return (
    <div className="p-4 space-y-6 w-full max-w-4xl mx-auto min-h-[calc(100vh-112px)]">
      {Object.keys(groupedMatches).length > 0 ? (
        Object.entries(groupedMatches).map(([competition, matches]) => (
          <CompetitionBlock
            key={competition}
            title={competition}
            matches={matches}
            onMatchClick={handleSelect}
          />
        ))
      ) : (
        <div className="text-center text-gray-400 py-10 min-h-[calc(100vh-112px)]">
          <ClipLoader color="white" size={50} /> {/* Spinner component */}
          <p className="text-lg mt-4">Loading Matches...</p>
        </div>
      )}
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
    <div className="bg-[#4c4c4c] text-white font-bold px-4 py-2 rounded-t-md uppercase tracking-wide text-sm shadow ">
      {title}
    </div>
    <div className="space-y-1">
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
    className="cursor-pointer bg-[#383838] text-white p-4 shadow hover:shadow-lg transition"
  >
    <div className="flex gap-4 items-start">
      {/* Left: Quarter Info */}
      <div className="text-sm font-semibold mt-1 min-w-[32px]">
        {"Q" + (Number(match.pc) >= 5 ? "T" : match.pc)}
      </div>

      {/* Right: Teams + Timer */}
      <div className="flex-1">
        <TeamRow team={match.teams.home} score={match.numericStats?.T?.[0]} />
        <div className="my-1" />
        <TeamRow team={match.teams.away} score={match.numericStats?.T?.[1]} />

        {match.status || match.timer ? (
          <div className="mt-2 text-right text-xs text-gray-400">
            {match.status} {match.timer && `• ${match.timer}`}
          </div>
        ) : null}
      </div>
    </div>
  </div>
);

const TeamRow = ({
  team,
  score,
}: {
  team: { name: string; kitColors?: String[] };
  score?: number;
}) => {
  const primaryColor = team.kitColors?.[0]?.toString() || "#666";
  return (
    <div className="flex justify-between items-center pr-6">
      <div className="flex items-center gap-2 min-w-0">
        <div
          className="w-3 h-5 rounded-sm"
          style={{ backgroundColor: primaryColor }}
        />
        <span className="truncate">{team.name}</span>
      </div>
      <div className="bg-white/20 text-white text-sm font-bold p-1 w-[30px]">
        {typeof score === "number" ? score : 0}
      </div>
    </div>
  );
};

export default MatchList;
