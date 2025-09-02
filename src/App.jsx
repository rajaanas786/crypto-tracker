import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import CoinDetail from "./pages/CoinDetail";

function App() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/coin/:id" element={<CoinDetail />} />
      </Routes>
    </div>
  );
}

export default App;
