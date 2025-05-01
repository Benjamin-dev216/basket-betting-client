import { useEffect, useState } from "react";
import { fetchHistory } from "../api/history";
import { AxiosError } from "axios";
import { toast } from "react-toastify";

interface Bet {
  id: number;
  matchId: string;
  marketId: number;
  outcomeName: string;
  amount: string;
  odds: string;
  status: string;
  result: string | null;
  handicap: string;
  createdAt: string;
}

const History = () => {
  const [historyData, setHistoryData] = useState<Bet[]>([]);

  const getHistory = async () => {
    try {
      const history = await fetchHistory();
      setHistoryData(history.bets);
    } catch (error: AxiosError | any) {
      toast.error(error.response?.data?.message || "Error fetching history");
    }
  };

  useEffect(() => {
    getHistory();
  }, []);

  return historyData && historyData.length > 0 ? (
    <div className="p-4 min-h-[calc(100vh-112px)] bg-[#282828] text-white">
      <h2 className="text-xl font-bold mb-4">Betting History</h2>

      {historyData.length === 0 ? (
        <p className="text-gray-300 bg-[#282828] min-h-[calc(100vh-112px)]">
          No history available.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-600 rounded-md">
            <thead>
              <tr className="bg-[#5c5448] text-white">
                <th className="px-4 py-2 text-center">Match ID</th>
                <th className="px-4 py-2 text-center">Market</th>
                <th className="px-4 py-2 text-center">Outcome</th>
                <th className="px-4 py-2 text-center">Handicap</th>
                <th className="px-4 py-2 text-center">Odds</th>
                <th className="px-4 py-2 text-center">Amount</th>
                <th className="px-4 py-2 text-center">Status</th>
                <th className="px-4 py-2 text-center">Result</th>
                <th className="px-4 py-2 text-center">Time</th>
              </tr>
            </thead>
            <tbody>
              {historyData.map((bet) => (
                <tr
                  key={bet.id}
                  className="border-t border-gray-600 hover:bg-[#5c5448]"
                >
                  <td className="px-4 py-2">{bet.matchId}</td>
                  <td className="px-4 py-2">{bet.marketId}</td>
                  <td className="px-4 py-2">{bet.outcomeName}</td>
                  <td className="px-4 py-2">{bet.handicap}</td>
                  <td className="px-4 py-2">{bet.odds}</td>
                  <td className="px-4 py-2">{bet.amount}</td>
                  <td className="px-4 py-2 capitalize">{bet.status}</td>
                  <td className="px-4 py-2 capitalize">
                    {bet.result || "Pending"}
                  </td>
                  <td className="px-4 py-2 text-sm">
                    {new Date(bet.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  ) : (
    <div className="bg-[#282828] min-h-[calc(100vh-112px)]">
      Loading History
    </div>
  );
};

export default History;
