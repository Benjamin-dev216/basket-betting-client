// src/hooks/useWebSocket.ts
import { useState, useEffect } from "react";
import type { Match } from "../types";

const url = import.meta.env.VITE_WS_URL;

export const useWebSocket = () => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const [matchList, setMatchList] = useState<Match[]>([]);
  const [oddsByMatchId, setOddsByMatchId] = useState<Record<string, any>>({});

  useEffect(() => {
    const socket = new WebSocket(url);
    setWs(socket);

    socket.onopen = () => setConnected(true);
    socket.onclose = () => setConnected(false);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "matchList") {
        setMatchList(data.matches);
      } else if (data.type === "odds" && data.matchId) {
        setOddsByMatchId((prev) => ({
          ...prev,
          [data.matchId]: data.odds,
        }));
      }
    };

    return () => socket.close();
  }, [url]);

  const sendMessage = (message: any) => {
    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  };

  return { connected, matchList, oddsByMatchId, sendMessage };
};
