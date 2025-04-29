import { AxiosError } from "axios";
import { axiosInstance } from "./axiosInstance";
import { toast } from "react-toastify";

export async function placeBet(payload: {
  marketId: string | number;
  handicap?: string | null;
  outcomeName: string;
  odds: number | null;
  amount?: number;
}) {
  try {
    const { data } = await axiosInstance.post("/bet", payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });
    return data;
  } catch (error: AxiosError | any) {
    toast.error(
      error.response?.data?.error || "❌ Bet failed. Please try again."
    );
    throw error;
  }
}
