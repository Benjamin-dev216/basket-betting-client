import { useWebSocket } from "../context/WebSocketProvider";
import { placeBet } from "../api/betting";

const MarketPanel = () => {
  const { selectedMatch } = useWebSocket();

  // const handleBet = async (marketId: string, outcomeName: string) => {
  //   if (!selectedMatch) return;
  //   const res = await placeBet({
  //     matchId: selectedMatch.matchId,
  //     marketId,
  //     outcome: outcomeName,
  //     stake: 100, // test value
  //   });
  //   console.log("Bet result", res);
  // };

  // if (!selectedMatch) return <div className="p-4">No match selected.</div>;
  console.log(selectedMatch);
  return <div></div>;
};

export default MarketPanel;
