import { AxiosError } from "axios";
import { axiosInstance } from "./axiosInstance";

export async function placeBet(payload: {
  marketId: string | number;
  handicap?: string | null;
  outcomeName: string;
  odds: number | null;
  amount?: number;
  matchId: string;
}) {
  try {
    const { data } = await axiosInstance.post("/bet", payload);
    return data;
  } catch (error: AxiosError | any) {
    throw error;
  }
}
