import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="flex flex-wrap items-center justify-between bg-[#1f1f1f] p-4 shadow-md">
      <div className="flex items-center gap-3">
        <img
          src="/basket.png"
          alt="Basketball Logo"
          className="h-12 w-12 md:h-20 md:w-20 object-contain"
        />
        <span className="text-white font-bold text-2xl md:text-[28px]">
          BasketBet
        </span>
      </div>

      <div className="w-full mt-4 flex justify-center md:mt-0 md:w-auto md:flex md:gap-6 text-sm font-medium text-gray-300">
        <Link to="/" className="hover:text-white transition px-2">
          Matches
        </Link>
        <Link to="/history" className="hover:text-white transition px-2">
          History
        </Link>
      </div>
    </nav>
  );
}
