import { useEffect, useState } from "react";
import { fetchHistory } from "../api/history";
import { AxiosError } from "axios";
import { toast } from "react-toastify";

const History = () => {
  const [historyData, setHistoryData] = useState(null);

  const getHistory = async () => {
    try {
      const historyData = await fetchHistory();
      setHistoryData(historyData);
    } catch (error: AxiosError | any) {
      // console.error("Error fetching history:", error);
      toast.error(error.response?.data?.message || "Error fetching history");
    }
  };
  useEffect(() => {
    getHistory();
  }, []);
  return (
    <div className="p-4 min-h-[calc(100vh-112px)]">
      <h2 className="text-xl font-bold">Betting History</h2>
      <p>(History data coming soon...)</p>
    </div>
  );
};

export default History;
