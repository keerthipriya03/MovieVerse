import React, { useState } from "react";
import { Heart, Moon, Sun, Home } from "lucide-react";

function Navbar({ onSearch, favouritesCount, toggleTheme, isDarkMode, setView, currentView }) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
    setView("home"); // Always go to home after search
  };

  return (
    <nav
      className={`navbar navbar-expand-lg ${
        isDarkMode ? "navbar-dark glass-dark" : "navbar-light glass-light"
      } sticky-top px-3 py-2 shadow-sm`}
      style={{
        backgroundColor: isDarkMode ? "rgba(30,30,30,0.85)" : "rgba(255,255,255,0.85)",
        backdropFilter: "blur(10px)",
        transition: "all 0.3s ease-in-out",
      }}
    >
      {/* Left Section: Logo / Home */}
      <div
        className="d-flex align-items-center gap-2 fw-bold fs-4"
        onClick={() => setView("home")}
        style={{ cursor: "pointer" }}
      >
        <Home
          size={22}
          color={currentView === "home" ? "#0d6efd" : isDarkMode ? "#f0f0f0" : "#000"}
        />
        <span
          className="fw-semibold"
          style={{ color: isDarkMode ? "#f0f0f0" : "#1a1a1a", transition: "color 0.3s" }}
        >
          🎥 MovieVerse
        </span>
      </div>

      {/* Middle Section: Search Bar */}
      <form onSubmit={handleSubmit} className="d-flex align-items-center gap-2">
        <input
          type="text"
          className={`form-control rounded-pill px-3`}
          placeholder="Search movies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            width: "260px",
            backgroundColor: isDarkMode ? "#2c2c2c" : "#f8f9fa",
            color: isDarkMode ? "#f0f0f0" : "#1a1a1a",
            border: isDarkMode ? "1px solid #444" : "1px solid #ced4da",
            transition: "all 0.3s ease-in-out",
          }}
        />
        <button
          type="submit"
          className={`btn ${isDarkMode ? "btn-primary" : "btn-primary"} rounded-pill px-3`}
        >
          Search
        </button>
      </form>

      {/* Right Section: Favourites + Theme Toggle */}
      <div className="d-flex align-items-center gap-3" style={{ cursor: "pointer" }}>
        {/* 🌗 Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          className={`btn btn-outline-${isDarkMode ? "light" : "secondary"} rounded-circle p-2`}
          style={{ transition: "all 0.3s ease-in-out" }}
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* ❤️ Favourites Button */}
        <div
          className="position-relative"
          onClick={() => setView("favourites")}
        >
          <Heart
            size={24}
            fill={currentView === "favourites" ? "red" : "none"}
            color={currentView === "favourites" ? "red" : isDarkMode ? "#f0f0f0" : "#555"}
            style={{ transition: "all 0.3s ease-in-out" }}
          />
          {favouritesCount > 0 && (
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              {favouritesCount}
            </span>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
