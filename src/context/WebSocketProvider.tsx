import React, { createContext, useContext, useEffect, useState } from "react";
import { Match } from "../types/match";

interface WebSocketContextType {
  matchList: Match[];
  selectedMatch: Match | null;
  selectMatch: (matchId: string) => void;
  sendMessage: (msg: any) => void;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [matchList, setMatchList] = useState<Match[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/live");
    setSocket(ws);

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "getMatchList" }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "matchList") {
        setMatchList((prev) => {
          const incoming = data.matches || [];
          const prevMap = new Map(prev.map((m) => [m.matchId, m]));

          return incoming.map((incomingMatch: Match) => {
            const existing: Match | undefined = prevMap.get(
              incomingMatch.matchId
            );

            if (existing) {
              return {
                ...existing,
                ...incomingMatch, // override any updated basic info
              };
            }

            return incomingMatch;
          });
        });
      }

      if (data.type === "matchInfo") {
        setMatchList((prev) =>
          prev.map((match) => {
            if (match.matchId !== data.matchId) return match;

            const updated = {
              ...match,
              status: data.status ?? match.status,
              numericStats: data.numericStats ?? match.numericStats,
            };

            // Avoid updating if nothing actually changed
            if (JSON.stringify(match) === JSON.stringify(updated)) return match;

            return updated;
          })
        );
      }

      if (data.type === "odds") {
        setMatchList((prevMatches) =>
          prevMatches.map((match) =>
            match.matchId === data.matchId
              ? { ...match, odds: data.odds }
              : match
          )
        );

        // Also update selectedMatch if it's the same matchId
        if (selectedMatch?.matchId === data.matchId) {
          setSelectedMatch((prev) =>
            prev ? { ...prev, odds: data.odds } : prev
          );
        }
      }
    };

    return () => ws.close();
  }, [selectedMatch?.matchId]);

  const selectMatch = (matchId: string) => {
    const found = matchList.find((m) => m.matchId === matchId) || null;
    setSelectedMatch(found);
    socket?.send(JSON.stringify({ type: "subscribe", matchId }));
  };

  const sendMessage = (msg: any) => {
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(msg));
    }
  };

  return (
    <WebSocketContext.Provider
      value={{ matchList, selectedMatch, selectMatch, sendMessage }}
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
