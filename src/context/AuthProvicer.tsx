import React, { createContext, useContext, useState, useEffect } from "react";
import { axiosInstance } from "../api/axiosInstance";

interface AuthContextType {
  isAuthenticated: boolean;
  user: any;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Check if the user is authenticated based on token
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const user = localStorage.getItem("user");
    if (token) {
      setIsAuthenticated(true);
    }
    if (user) setUser(JSON.parse(user));
  }, []);

  // Handle login
  const login = async (email: string, password: string) => {
    try {
      const response = await axiosInstance.post("/auth/signin", {
        email,
        password,
      });
      localStorage.setItem("authToken", response.data.token); // Save token
      localStorage.setItem("user", JSON.stringify(response.data.user)); // Save token
      setIsAuthenticated(true);
      setUser(response.data.user); // Assuming response contains user info
    } catch (error) {
      throw error;
    }
  };

  // Handle logout
  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
