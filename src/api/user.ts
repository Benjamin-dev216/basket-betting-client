import { axiosInstance } from "./axiosInstance";
import { User } from "../routes/AdminPanel";

export const fetchUser = async () => {
  try {
    const { data } = await axiosInstance.get("/user/all");
    return data;
  } catch (error) {
    throw error;
  }
};

export const deleteUser = async (id: string) => {
  try {
    const { data } = await axiosInstance.delete(`/user/${id}`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const addUser = async (user: User) => {
  try {
    const { data } = await axiosInstance.post("/user", user);
    return data;
  } catch (error) {
    throw error;
  }
};

export const updateUser = async (user: User) => {
  try {
    const { data } = await axiosInstance.put(`/user/${user.id}`, user);
    return data;
  } catch (error) {
    throw error;
  }
};
