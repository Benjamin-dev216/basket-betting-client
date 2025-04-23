// src/context/MatchContext.tsx
import React, { createContext, useContext, useState } from "react";

interface MatchContextType {
  selectedMatchId: string | null;
  setSelectedMatchId: (id: string | null) => void;
}

const MatchContext = createContext<MatchContextType | undefined>(undefined);

export const MatchProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);

  return (
    <MatchContext.Provider value={{ selectedMatchId, setSelectedMatchId }}>
      {children}
    </MatchContext.Provider>
  );
};

export const useMatchContext = () => {
  const context = useContext(MatchContext);
  if (!context)
    throw new Error("useMatchContext must be used within a MatchProvider");
  return context;
};
