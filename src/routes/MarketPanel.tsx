import { useWebSocket } from "../context/WebSocketProvider";
import { MarketGroup } from "./MarketGroup";
import { useEffect } from "react";
import axios from "axios";
import { Match } from "../types/match.d";
import { ClipLoader } from "react-spinners";
import { GameStatePanel } from "./GameStatePanel";
import { normalizeScores } from "../utils/utils.functions";
import { useParams } from "react-router-dom";

const MarketPanel = () => {
  const { selectedMatch, setSelectedMatch } = useWebSocket();
  const { matchId } = useParams();

  function formatStats(statStr: string | undefined) {
    if (!statStr) return null;
    const segments = statStr?.split("|").filter(Boolean);
    const stats: Record<string, string> = {};
    for (const seg of segments) {
      const [key, value] = seg.split("=");
      if (key && value) stats[key.trim()] = value.trim();
    }
    return stats;
  }
  const parseScore = (score: any): number | undefined => {
    if (typeof score === "string" && score.trim() !== "") {
      const parsed = Number(score);
      return isNaN(parsed) ? undefined : parsed;
    }
    if (typeof score === "number") {
      return score;
    }
    return undefined;
  };
  const getMarketHandicap = (market: any): string | undefined => {
    const participants = Object.values(market.participants || {});
    if (participants.length === 0) return undefined;

    const handicaps = participants
      .map((p: any) => p.handicap)
      .filter((h: any) => h !== undefined && h !== null && h !== "");

    return handicaps.length > 0 ? handicaps[0] : undefined;
  };

  const fetchData = async () => {
    const { data } = await axios.get("/inplay-basket");
    const tempMatch = matchId ? data.events[matchId] : undefined;
    if (tempMatch) {
      const parsedMatch: Match = {
        matchId: tempMatch.info.id,
        teams: {
          home: {
            name: tempMatch.team_info.home.name,
            score: parseScore(tempMatch.team_info.home.score),
            kitColor: tempMatch.team_info.home.kit_color?.split(",") ?? [],
          },
          away: {
            name: tempMatch.team_info.away.name,
            score: parseScore(tempMatch.team_info.away.score),
            kitColor: tempMatch.team_info.away.kit_color?.split(",") ?? [],
          },
        },
        status: tempMatch.info.period, // or tempMatch.info.state depending on what you want
        timer: tempMatch.info.seconds
          ? `${tempMatch.info.minute}:${tempMatch.info.seconds}`
          : undefined,
        odds: tempMatch.odds
          ? Object.values(tempMatch.odds).flatMap((market: any) => {
              const participants = Object.values(
                market.participants || {}
              ) as any[];

              if (participants.length >= 4) {
                // Try to detect repeating pattern
                let patternSize = 0;

                if (participants[0]?.name === participants[2]?.name) {
                  patternSize = 2; // 2 items repeating (e.g., Home/Away)
                } else if (participants[0]?.name === participants[3]?.name) {
                  patternSize = 3; // 3 items repeating (e.g., Home/Away/Neither)
                }

                if (patternSize > 0) {
                  const markets: any[] = [];

                  markets.push({
                    marketId: market.id,
                    handicap: getMarketHandicap(market),
                    outcomes: participants
                      .slice(0, patternSize) // ONLY the first pattern group
                      .map((p) => ({
                        name: p.name,
                        value: parseFloat(p.value_eu),
                        liveValue: parseFloat(p.value_eu),
                      })),
                  });

                  return markets;
                }
              }

              // No repeating pattern -> normal single market
              return [
                {
                  marketId: market.id,
                  handicap: getMarketHandicap(market),
                  outcomes: participants.map((p) => ({
                    name: p.name,
                    value: parseFloat(p.value_eu),
                    liveValue: parseFloat(p.value_eu),
                  })),
                },
              ];
            })
          : [],
        stp: Number(tempMatch.core?.stopped ?? 0), // <- important for stop
        statsParsed: tempMatch.sts ? formatStats(tempMatch.sts) : undefined,
        score: normalizeScores(tempMatch.stats),
      };

      // Then you set:
      setSelectedMatch(parsedMatch);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  console.log(selectedMatch);

  return (
    <>
      {selectedMatch?.odds ? (
        <div className="flex flex-col md:flex-row w-full max-w-6xl mx-auto px-4 min-h-[calc(100vh-112px)]">
          {/* GameStatePanel */}
          <div className="w-full md:w-1/3 order-1 md:order-2 mt-4 md:mt-0 md:sticky md:top-0 self-start ">
            <GameStatePanel
              homeTeamName={selectedMatch.teams.home.name}
              awayTeamName={selectedMatch.teams.away.name}
              homeTeamColor={
                selectedMatch.teams.home.kitColor?.[0]?.toString() || "#3498db"
              }
              awayTeamColor={
                selectedMatch.teams.away.kitColor?.[0]?.toString() || "#e74c3c"
              }
              statsParsed={selectedMatch.statsParsed}
              score={selectedMatch.score ? selectedMatch.score : {}}
            />
          </div>

          {/* MarketGroup */}
          <div className="w-full md:w-2/3 order-2 md:order-1 relative">
            <MarketGroup
              homeTeam={selectedMatch.teams.home}
              awayTeam={selectedMatch.teams.away}
              markets={selectedMatch.odds}
              stop={0}
            />
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-400 py-10 min-h-[calc(100vh-112px)]">
          <ClipLoader color="white" size={50} /> {/* Spinner component */}
          <p className="text-lg mt-4">Loading Market...</p>
        </div>
      )}
    </>
  );
};

export default MarketPanel;
