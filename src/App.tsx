import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MatchList from "./routes/MatchList";
import MarketPanel from "./routes/MarketPanel";
import History from "./routes/History";
import { WebSocketProvider } from "./context/WebSocketProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";
import "./App.css";
import { AuthProvider } from "./context/AuthProvicer";

const App = () => {
  return (
    <AuthProvider>
      <WebSocketProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<MatchList />} />
            <Route path="/:matchId" element={<MarketPanel />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </Router>
        <ToastContainer
          position="top-center"
          theme="dark"
          closeOnClick
          pauseOnHover
          hideProgressBar={false}
        />
      </WebSocketProvider>
    </AuthProvider>
  );
};

export default App;
