// src/components/MatchList.tsx
import React from "react";
import { useWebSocket } from "../hooks/useLiveMatches"; // Assuming useWebSocket hook is handling WebSocket connection and state
import { useMatchContext } from "../context/MatchContext";

const MatchList = () => {
  const { connected, matchList, sendMessage } = useWebSocket();
  const { setSelectedMatchId } = useMatchContext();

  React.useEffect(() => {
    if (connected) sendMessage({ type: "getMatchList" });
  }, [connected]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Available Matches</h2>
      <ul className="space-y-2">
        {matchList.map((match) => (
          <li key={match.matchId} className="border p-2 rounded">
            <button
              onClick={() => {
                sendMessage({ type: "subscribe", matchId: match.matchId });
                setSelectedMatchId(match.matchId);
              }}
              className="text-blue-600 hover:underline"
            >
              {match.teams.home} vs {match.teams.away}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MatchList;
