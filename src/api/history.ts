import { axiosInstance } from "./axiosInstance";

export const fetchHistory = () => {
  return axiosInstance
    .get("/history")
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error fetching history:", error);
      throw error;
    });
};
