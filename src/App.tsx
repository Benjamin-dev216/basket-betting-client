import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MatchList from "./routes/MatchList";
import MarketPanel from "./routes/MarketPanel";
import History from "./routes/History";
import { WebSocketProvider } from "./context/WebSocketProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";
import "./App.css";

const App = () => {
  return (
    <WebSocketProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<MatchList />} />
          <Route path="/market" element={<MarketPanel />} />
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
  );
};

export default App;
