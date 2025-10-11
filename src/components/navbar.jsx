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
    <nav className={`navbar navbar-expand-lg ${ 
      isDarkMode ? "navbar-dark glass-dark" : "navbar-light glass-light"
    } sticky-top px-3 py-2 shadow-sm`} >
      {/* Left Section: Logo / Home */}
      <div
        className="d-flex align-items-center gap-2 fw-bold fs-4 cursor-pointer"
        onClick={() => setView("home")} style={{cursor: "pointer"}}
      >
        <Home
          size={22}
          color={currentView === "home" ? "#0d6efd" : isDarkMode ? "white" : "black"}
        />
        <span className="fw-semibold" onClick={() => <AppBar />}>🎥 MovieVerse</span>
      </div>

      {/* Middle Section: Search Bar */}
      <form onSubmit={handleSubmit} className="d-flex align-items-center gap-2">
        <input
          type="text"
          className={`form-control rounded-pill px-3 ${
            isDarkMode ? "bg-secondary text-white border-0" : ""
          }`}
          placeholder="Search movies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ width: "260px" }}
        />
        <button type="submit" className="btn btn-primary rounded-pill px-3">
          Search
        </button>
      </form>

      {/* Right Section: Favourites + Theme Toggle */}
      <div className="d-flex align-items-center gap-6" style={{cursor: "pointer"}}>

        {/* 🌗 Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          className={`btn btn-outline-${isDarkMode ? "light" : "secondary"} rounded-circle p-2`}
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        
        {/* ❤️ Favourites Button */}
        <div
          className="position-relative cursor-pointer"
          onClick={() => setView("favourites")}
        >
          <Heart
            size={24}
            fill={currentView === "favourites" ? "red" : "none"}
            color={currentView === "favourites" ? "red" : "gray"}
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
