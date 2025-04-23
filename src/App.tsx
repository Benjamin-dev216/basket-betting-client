// src/App.tsx
import React from "react";
import MatchList from "./components/MatchList";
import { useMatchContext } from "./context/MatchContext";
import MarketPanel from "./components/MarketPanel";

const App: React.FC = () => {
  const { selectedMatchId } = useMatchContext();
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Sports Betting Platform</h1>
      <div>{selectedMatchId ? <MarketPanel /> : <MatchList />}</div>
    </div>
  );
};

export default App;
