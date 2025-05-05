import { useEffect, useState } from "react";
import { fetchHistory } from "../api/history";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

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
      <h2 className="text-xl font-bold mb-4">
        {t("betting_history.betting_history")}
      </h2>

      {historyData.length === 0 ? (
        <p className="text-gray-300 bg-[#282828] min-h-[calc(100vh-112px)]">
          {t("betting_history.no_history_available")}
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-600 rounded-md">
            <thead>
              <tr className="bg-[#5c5448] text-white">
                <th className="px-4 py-2 text-center">
                  {t("betting_history.match_id")}
                </th>
                <th className="px-4 py-2 text-center">
                  {t("betting_history.market")}
                </th>
                <th className="px-4 py-2 text-center">
                  {t("betting_history.outcome")}
                </th>
                <th className="px-4 py-2 text-center">
                  {t("betting_history.handicap")}
                </th>
                <th className="px-4 py-2 text-center">
                  {t("betting_history.odds")}
                </th>
                <th className="px-4 py-2 text-center">
                  {t("betting_history.amount")}
                </th>
                <th className="px-4 py-2 text-center">
                  {t("betting_history.status")}
                </th>
                <th className="px-4 py-2 text-center">
                  {t("betting_history.result")}
                </th>
                <th className="px-4 py-2 text-center">
                  {t("betting_history.time")}
                </th>
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
                  <td className="px-4 py-2">
                    {["under", "over", "home", "away"].includes(
                      bet.outcomeName.toLowerCase()
                    )
                      ? t(
                          "betting_history."
                            .concat(bet.outcomeName)
                            .toLowerCase()
                        )
                      : bet.outcomeName}
                  </td>{" "}
                  <td className="px-4 py-2">{bet.handicap}</td>
                  <td className="px-4 py-2">{bet.odds}</td>
                  <td className="px-4 py-2">{bet.amount}</td>
                  <td className="px-4 py-2 capitalize">
                    {t("betting_history.".concat(bet.status).toLowerCase())}
                  </td>
                  <td className="px-4 py-2 capitalize">
                    {bet.result
                      ? t("betting_history.".concat(bet.result).toLowerCase())
                      : t("betting_history.pending")}
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
      {t("betting_history.loading_history")}
    </div>
  );
};

export default History;
