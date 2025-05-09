import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuthStore } from "../store/authStore";
import { AxiosError } from "axios";
import { useTranslation } from "react-i18next";

export default function Navbar() {
  const { t } = useTranslation();

  const { isAuthenticated, user, login, logout } = useAuthStore();
  const navigate = useNavigate();

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authData, setAuthdata] = useState({ email: "", password: "" });

  const toggleAuthModal = () => {
    setShowAuthModal(!showAuthModal);
  };
  const onLogin = async () => {
    try {
      await login(authData.email, authData.password);

      // Close the modal and navigate to the homepage or desired page
      setShowAuthModal(false);
      navigate("/"); // You can change this to any page after login
    } catch (err: AxiosError | any) {
      toast(err.response.data.message || "Login failed");
    }
  };

  return (
    <>
      <nav className="flex flex-wrap items-center justify-between bg-[#1f1f1f] p-4 shadow-md px-6 md:px-16">
        {/* <button onClick={() => i18n.changeLanguage("en")}>🇺🇸</button>
        <button onClick={() => i18n.changeLanguage("zh")}>🇨🇳</button> */}
        <div className="flex items-center gap-3">
          <img
            src="/basket.png"
            alt="Basketball Logo"
            className="h-12 w-12 md:h-20 md:w-20 object-contain"
          />
          <span className="text-white font-bold text-2xl md:text-[28px]">
            {t("brand")}
          </span>
        </div>

        <div className="w-full mt-4 flex justify-center md:mt-0 md:w-auto md:flex md:gap-6 text-sm font-medium text-gray-300">
          {user && user.isAdmin && (
            <Link
              to="/admin"
              className="hover:text-white transition px-2 my-auto"
            >
              {t("adminPanel.title")}
            </Link>
          )}
          <Link to="/" className="hover:text-white transition px-2 my-auto">
            {t("matches")}
          </Link>
          <Link
            to="/history"
            className="hover:text-white transition px-2 my-auto"
          >
            {t("history")}
          </Link>

          {/* Login Button */}
          {/* Login Button */}
          {!isAuthenticated ? (
            <button
              onClick={toggleAuthModal}
              className="ml-4 bg-yellow-400 hover:bg-yellow-500 text-black px-5 py-2 rounded-md transition font-semibold shadow-sm"
            >
              {t("login")}
            </button>
          ) : (
            <div className="flex items-center gap-3 ml-4">
              {/* Balance display */}
              {user && !user.isAdmin && (
                <div className="text-white bg-gray-800 px-3 py-1 rounded-md text-sm font-medium shadow-inner">
                  <span className="text-green-400">
                    ${Number(user.balance)?.toFixed(2)}
                  </span>
                </div>
              )}

              {/* Logout button */}
              <button
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="bg-yellow-400 hover:bg-yellow-500 text-black px-5 py-2 rounded-md transition font-semibold shadow-sm"
              >
                {t("logout")}
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Backdrop */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
      )}

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-[#2f2f2f] p-8 rounded-lg w-[400px] shadow-lg border border-[#444] space-y-6">
          <h2 className="text-white text-xl font-semibold text-center">
            {t("login")}
          </h2>

          <form>
            <div>
              <input
                type="text"
                placeholder={t("emailPlaceholder")}
                className="w-full p-3 rounded bg-[#3a3a3a] text-white text-sm mb-4"
                onChange={(e) => {
                  setAuthdata({ ...authData, email: e.target.value });
                }}
              />
            </div>
            <div>
              <input
                type="password"
                placeholder={t("passwordPlaceholder")}
                className="w-full p-3 rounded bg-[#3a3a3a] text-white text-sm mb-4"
                onChange={(e) => {
                  setAuthdata({ ...authData, password: e.target.value });
                }}
              />
            </div>
            <div className="flex justify-between mt-4 space-x-4">
              <button
                type="button"
                onClick={toggleAuthModal}
                className="bg-gray-600 text-white p-2 w-1/2 rounded cursor-pointer hover:bg-gray-700 transition"
              >
                {t("cancel")}
              </button>
              <button
                className="bg-yellow-400 text-black p-2 w-1/2 rounded cursor-pointer hover:bg-yellow-500 transition"
                onClick={(e) => {
                  e.preventDefault();
                  onLogin();
                }}
              >
                {t("login")}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
