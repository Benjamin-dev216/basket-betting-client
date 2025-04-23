import { useMatchContext } from "../context/MatchContext";
import { useWebSocket } from "../hooks/useLiveMatches";

const MarketPanel = () => {
  const { selectedMatchId, setSelectedMatchId } = useMatchContext();
  const { matchList, oddsByMatchId } = useWebSocket();

  const match = matchList.find((m) => m.matchId === selectedMatchId);
  const odds = selectedMatchId ? oddsByMatchId[selectedMatchId] : null;

  if (!match) return null;

  return (
    <div className="p-4">
      <button
        onClick={() => setSelectedMatchId(null)}
        className="text-sm text-gray-500 mb-2"
      >
        ← Back to matches
      </button>
      <h2 className="text-2xl font-bold">
        {match.teams.home} vs {match.teams.away}
      </h2>

      <div className="mt-4">
        <h3 className="text-lg font-semibold">Live Odds</h3>
        {odds ? (
          <pre className="text-sm mt-2 bg-gray-100 p-2 rounded">
            {JSON.stringify(odds, null, 2)}
          </pre>
        ) : (
          <p className="text-sm text-gray-400">Waiting for odds...</p>
        )}
      </div>
    </div>
  );
};

export default MarketPanel;
