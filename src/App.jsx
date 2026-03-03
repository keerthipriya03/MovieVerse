import React, { useState, useEffect } from "react";
import Navbar from "./components/navbar";
import MovieList from "./components/movielist";
import "./index.css";
import MovieverseShuffleNoGSAP from "./components/shuffletxt";
import "./ShinyText.css";
import Favourites from "./components/favourites";

// require('dotenv').config();


function App() {
  const [movies, setMovies] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [error, setError] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [view, setView] = useState("home");
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [favouritesLoaded, setFavouritesLoaded] = useState(false);
  const [query, setQuery] = useState(""); // ✅ Lifted query state

  // 🌙 Toggle Theme
  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // 🌗 Apply theme globally
  useEffect(() => {
    document.body.classList.toggle("dark-mode", isDarkMode);
  }, [isDarkMode]);

  // Load favourites from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("favourites");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFavourites(parsed);
        console.log("Loaded favourites:", parsed);
      } catch (e) {
        console.error("Error parsing favourites:", e);
      }
    }
    setFavouritesLoaded(true);
  }, []);

  // Save favourites to localStorage whenever they change
  useEffect(() => {
    if (favouritesLoaded) {
      localStorage.setItem("favourites", JSON.stringify(favourites));
      console.log("Saving favourites:", favourites);
    }
  }, [favourites, favouritesLoaded]);

  // 🎬 Fetch movies from API
  const apiKey = import.meta.env.VITE_OMDB_API_KEY;

  const handleSearch = async (searchTerm) => {
  if (!searchTerm.trim()) return;

  setQuery(searchTerm);
  setError("");
  setLoading(true);
  setMovies([]);
  setView("home");
  setHasSearched(true);

  try {
    const response = await fetch(
      `https://www.omdbapi.com/?s=${searchTerm}&apikey=${apiKey}`
    );
    const data = await response.json();

    if (data.Response === "True") {
      setMovies(data.Search);
    } else {
      setError(data.Error || "No movies found."); // use OMDB's error message
    }
  } catch (err) {
    setError("Something went wrong. Please try again.");
  } finally {
    setLoading(false);
  }
};


  // ❤️ Add / Remove favourites
  const addToFavourites = (movie) => {
    setFavourites((prev) => {
      const alreadyAdded = prev.some((fav) => fav.imdbID === movie.imdbID);
      if (alreadyAdded) return prev;
      const updated = [...prev, movie];
      localStorage.setItem("favourites", JSON.stringify(updated));
      return updated;
    });
  };

  const removeFromFavourites = (movie) => {
    setFavourites((prev) => {
      const updated = prev.filter((fav) => fav.imdbID !== movie.imdbID);
      localStorage.setItem("favourites", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <div
  className={`App min-vh-100 transition-all`}
  style={{
    backgroundColor: isDarkMode ? "#121212" : "#f5f5f5", // uniform bg
    color: isDarkMode ? "#f0f0f0" : "#1a1a1a",
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    transition: "all 0.3s ease-in-out",
  }}
>

  {/* Background animation layer */}
  <div
    className="bg-animated"
    style={{
      background: isDarkMode
        ? "linear-gradient(135deg, #1e1e1e 0%, #2a2a2a 100%)"
        : "linear-gradient(135deg, #ffffff 0%, #e6e6e6 100%)",
      position: "absolute",
      width: "100%",
      height: "100%",
      top: 0,
      left: 0,
      zIndex: -1,
      transition: "all 0.3s ease-in-out",
    }}
  ></div>

  {/* 🧭 Navbar */}
  <Navbar
    onSearch={handleSearch}
    favouritesCount={favourites.length}
    toggleTheme={toggleTheme}
    isDarkMode={isDarkMode}
    setView={(newView) => {
      setView(newView);
      if (newView === "home") {
        setError("");
        setHasSearched(false);
        setMovies([]);   // clear previous search results
        setQuery("");    // clear search bar input
      }
    }}
    currentView={view}

  />


  {/* 🏠 Home Section */}
  {view === "home" && movies.length === 0 && !hasSearched && (
    <section
  className="hero-section d-flex flex-column justify-content-center align-items-center"
  style={{
    minHeight: "calc(100vh - 80px)", // 80px reserved for navbar
    width: "100%",
    padding: "2rem",
    backgroundColor: isDarkMode ? "#121212" : "#f5f5f5", // same as App background
    transition: "all 0.3s ease-in-out",
  }}
>
  <MovieverseShuffleNoGSAP
    className={`display-4 fw-bold mb-3 text-gradient ${
      isDarkMode ? "text-light" : "text-dark"
    }`}
    text="MovieVerse"
  />
  <p
    className={`lead mb-5 text-center`}
    style={{
      color: isDarkMode ? "#cccccc" : "#555555",
      maxWidth: "700px",
    }}
  >
    Discover, Favourite, and Enjoy your favourite films with personalized recommendations!
  </p>

  <div className="hero-images d-flex justify-content-center flex-wrap gap-4">
    {[
      "https://wallpaper.dog/large/5486474.jpg",
      "https://tse4.mm.bing.net/th/id/OIP.AAGlLz5a8UVl6A3Hh54gOQHaEK?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3",
      "https://i.pinimg.com/originals/98/19/ee/9819ee6d392c0fccf160202adc2b1f7f.gif",
      "https://media0.giphy.com/media/7zMsa4CDcXY7PEDNGN/giphy.gif",
    ].map((img, index) => (
      <div
        key={index}
        className="hero-card shadow-lg"
        style={{
          background: isDarkMode ? "#1f1f1f" : "#fff",
          borderRadius: "12px",
          width: "180px",
          height: "270px",
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          transition: "all 0.3s ease-in-out",
        }}
      >
        <img
          src={img}
          alt={`Movie ${index + 1}`}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.3s ease",
          }}
          className="hero-img"
        />
      </div>
    ))}
  </div>
</section>

  )}

  {/* ⚠️ Error Display */}
  {hasSearched && error && (
    <p className="text-center text-danger mt-3">{error}</p>
  )}

  {/* 🎥 Search Results */}
  {/* 🎥 Search Results */}
{view === "home" && (
  <>
    {/* ← Back to Home Button */}
    {hasSearched && movies.length > 0 && (
      <div className="text-center mb-3">
        <button
          className="btn btn-outline-primary"
          onClick={() => {
            setView("home");
            setMovies([]);
            setHasSearched(false);
            setQuery("");
            setError("");
          }}
        >
          ← Back to Home
        </button>
      </div>
    )}

    {movies.length > 0 && (
      <h3 className="text-center mt-4" style={{ color: isDarkMode ? "#f0f0f0" : "#1a1a1a" }}>
        Search Results
      </h3>
    )}
    {loading ? (
      <div className="movie-grid mt-3">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="skeleton movie-skeleton" style={{ background: isDarkMode ? "#2a2a2a" : "#e0e0e0" }}></div>
        ))}
      </div>
    ) : (
      <MovieList
        movies={movies}
        addToFavourites={addToFavourites}
        removeFromFavourites={removeFromFavourites}
        favourites={favourites}
        hasSearched={hasSearched}
        loading={loading}
        searchQuery={query}
        isDarkMode={isDarkMode}
      />
    )}
  </>
)}


  {/* ❤️ Favourites Page */}
  {view === "favourites" && (
    <Favourites
      favourites={favourites}
      removeFromFavourites={removeFromFavourites}
      isDarkMode={isDarkMode} // pass theme for child styling
    />
  )}
</div>

  );
}

export default App;





// {/* 🎥 Search Results */}
// {view === "home" && (
//   <>
//     {/* ← Back to Home Button */}
//     {hasSearched && (
//       <div className="text-center mb-3">
//         <button
//           className="btn btn-outline-primary"
//           onClick={() => {
//             setView("home");
//             setMovies([]);
//             setHasSearched(false);
//             setQuery("");
//             setError("");
//           }}
//         >
//           ← Back to Home
//         </button>
//       </div>
//     )}

//     {movies.length > 0 && (
//       <h3 className="text-center mt-4" style={{ color: isDarkMode ? "#f0f0f0" : "#1a1a1a" }}>
//         Search Results
//       </h3>
//     )}

//     {loading ? (
//       <div className="movie-grid mt-3">
//         {[...Array(8)].map((_, i) => (
//           <div key={i} className="skeleton movie-skeleton" style={{ background: isDarkMode ? "#2a2a2a" : "#e0e0e0" }}></div>
//         ))}
//       </div>
//     ) : (
//       <MovieList
//         movies={movies}
//         addToFavourites={addToFavourites}
//         removeFromFavourites={removeFromFavourites}
//         favourites={favourites}
//         hasSearched={hasSearched}
//         loading={loading}
//         searchQuery={query}
//         isDarkMode={isDarkMode}
//       />
//     )}
//   </>
// )}
