import { useWebSocket } from "../context/WebSocketProvider";
import { placeBet } from "../api/betting";

const MarketPanel = () => {
  const { selectedMatch } = useWebSocket();

  const handleBet = async (marketId: string, outcomeName: string) => {
    if (!selectedMatch) return;
    const res = await placeBet({
      matchId: selectedMatch.matchId,
      marketId,
      outcome: outcomeName,
      stake: 100, // test value
    });
    console.log("Bet result", res);
  };

  if (!selectedMatch) return <div className="p-4">No match selected.</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">
        {selectedMatch.teams.home.name} vs {selectedMatch.teams.away.name}
      </h2>

      {selectedMatch.odds?.map((market) => (
        <div key={market.marketId} className="mb-4 border p-2 rounded">
          <h3 className="font-semibold mb-1">
            Market: {market.handicap ?? "N/A"}
          </h3>
          <ul>
            {market.outcomes.map((outcome, idx) => (
              <li key={idx} className="flex justify-between">
                <span>{outcome.name}</span>
                <button
                  className="bg-blue-600 text-white px-2 py-1 rounded"
                  onClick={() => handleBet(market.marketId, outcome.name)}
                >
                  {outcome.value}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default MarketPanel;
