import { create } from "zustand";
import { persist } from "zustand/middleware";
import { axiosInstance } from "../api/axiosInstance";

interface AuthState {
  isAuthenticated: boolean;
  user: any;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (newUserData: any) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      login: async (email, password) => {
        const response = await axiosInstance.post("/auth/signin", {
          email,
          password,
        });
        const { token, user } = response.data;

        localStorage.setItem("authToken", token); // Optionally store token
        set({ isAuthenticated: true, user });
      },
      logout: () => {
        localStorage.removeItem("authToken");
        set({ isAuthenticated: false, user: null });
      },
      updateUser: (newUserData) => {
        set((state) => ({
          user: {
            ...state.user,
            ...newUserData,
          },
        }));
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
    }
  )
);
