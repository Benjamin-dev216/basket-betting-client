import React, { useEffect, useState } from "react";

// Define the structure of a match
interface Match {
  matchId: string;
  home: string;
  away: string;
}

const MatchList: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [webSocket, setWebSocket] = useState<WebSocket | null>(null);
  const [error, setError] = useState<string | null>(null); // State for WebSocket error

  useEffect(() => {
    // Create WebSocket connection
    const ws = new WebSocket("ws://localhost:8000/live"); // Replace with your WebSocket server URL

    ws.onopen = () => {
      console.log("WebSocket connection established");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "availableMatches") {
        setMatches(data.matches);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
      setError("WebSocket connection closed unexpectedly.");
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setError("Failed to connect to WebSocket server.");
    };

    // Save WebSocket to state
    setWebSocket(ws);

    // Cleanup on component unmount
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  const handleMatchClick = (matchId: string) => {
    if (webSocket) {
      webSocket.send(
        JSON.stringify({
          type: "subscribe",
          matchId,
        })
      );
      console.log(`Subscribed to match: ${matchId}`);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Live Matches</h2>
      {error && <p className="text-red-500">{error}</p>}
      {matches.length === 0 ? (
        <p>No live matches available</p>
      ) : (
        <ul className="space-y-2">
          {matches.map((match, index) => (
            <li
              key={match.matchId ?? `fallback-${index}`}
              className="p-4 border border-gray-300 rounded-lg flex justify-between items-center hover:bg-gray-100 cursor-pointer"
              onClick={() => handleMatchClick(match.matchId)}
            >
              <span>
                {match.home} vs {match.away}
              </span>
              <button className="bg-blue-500 text-white py-1 px-3 rounded-md">
                Subscribe
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MatchList;
