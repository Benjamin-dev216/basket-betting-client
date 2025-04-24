import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import MatchList from "./routes/MatchList";
import MarketPanel from "./routes/MarketPanel";
import History from "./routes/History";
import { WebSocketProvider } from "./context/WebSocketProvider";
import "./App.css";

const App = () => {
  return (
    <WebSocketProvider>
      <Router>
        <nav className="flex gap-4 bg-gray-200 p-4">
          <Link to="/">Matches</Link>
          <Link to="/history">History</Link>
        </nav>
        <Routes>
          <Route path="/" element={<MatchList />} />
          <Route path="/market" element={<MarketPanel />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </Router>
    </WebSocketProvider>
  );
};

export default App;
