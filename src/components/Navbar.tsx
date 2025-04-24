import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between bg-[#1f1f1f] p-4 shadow-md px-15">
      <div className="flex items-center gap-3">
        <img
          src="/basket.png"
          alt="Basketball Logo"
          className="h-20 w-20 object-contain"
        />
        <span className="text-white font-bold text-[28px]">BasketBet</span>
      </div>
      <div className="flex gap-6 text-sm font-medium text-gray-300 text-[16px]">
        <Link to="/" className="hover:text-white transition">
          Matches
        </Link>
        <Link to="/history" className="hover:text-white transition">
          History
        </Link>
      </div>
    </nav>
  );
}
