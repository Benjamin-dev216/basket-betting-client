import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Match } from "../types/match";

interface WebSocketContextType {
  matchList: Match[];
  selectedMatch: Match | null;
  setSelectedMatch: (match: Match | null) => void;
  setMatchList: (matches: Match[]) => void;
  selectMatch: (matchId: string) => void;
  sendMessage: (msg: any) => void;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [matchList, setMatchList] = useState<Match[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const selectedMatchRef = useRef<Match | null>(null); // 👉 Create a ref
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/live");
    setSocket(ws);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "matchList") {
        setMatchList((prev) => {
          const prevMap = new Map(prev.map((m) => [m.matchId, m]));

          const updatedMatches: Match[] = [];

          for (const prevMatch of prev) {
            const incomingMatch = data.matches.find(
              (m: Match) => m.matchId === prevMatch.matchId
            );
            if (incomingMatch) {
              // Update only if incoming exists
              updatedMatches.push({
                ...prevMatch,
                ...incomingMatch,
              });
            } else {
              // Keep existing if no incoming
              updatedMatches.push(prevMatch);
            }
          }

          // Add new matches not in prev
          const incomingNewMatches = data.matches.filter(
            (m: Match) => !prevMap.has(m.matchId)
          );

          return [...updatedMatches, ...incomingNewMatches];
        });
      }

      if (data.type === "odds") {
        const currentSelected = selectedMatchRef.current;

        // Update selectedMatch if it's the current one
        if (currentSelected?.matchId === data.matchId) {
          setSelectedMatch((prev) =>
            prev
              ? {
                  ...prev,
                  odds: data.odds ?? prev.odds,
                  stp: data.stp ?? prev.stp,
                  statsParsed: data.statsParsed ?? prev.statsParsed,
                  score: data.stats ?? prev.score,
                }
              : prev
          );
        }

        // Update matchList too
        setMatchList((prevList) =>
          prevList.map((match) =>
            match.matchId === data.matchId
              ? {
                  ...match,
                  odds: data.odds ?? match.odds,
                  stp: data.stp ?? match.stp,
                  statsParsed: data.statsParsed ?? match.statsParsed,
                  score: data.stats ?? match.score,
                }
              : match
          )
        );
      }
    };

    return () => ws.close();
  }, []);

  const selectMatch = (matchId: string) => {
    const found = matchList.find((m) => m.matchId === matchId) || null;
    setSelectedMatch(found);
    selectedMatchRef.current = found; // 👉 update the ref too!
    socket?.send(JSON.stringify({ type: "subscribe", matchId }));
  };

  const sendMessage = (msg: any) => {
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(msg));
    }
  };

  return (
    <WebSocketContext.Provider
      value={{
        matchList,
        selectedMatch,
        setSelectedMatch,
        setMatchList,
        selectMatch,
        sendMessage,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context)
    throw new Error("useWebSocket must be used within WebSocketProvider");
  return context;
};
