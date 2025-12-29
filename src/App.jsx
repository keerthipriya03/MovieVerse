import React, { useState, useEffect, useRef } from "react";
import Navbar from "./components/navbar";
import MovieList from "./components/movielist";
import "./index.css";
import MovieverseShuffleNoGSAP from "./components/shuffletxt";
import "./ShinyText.css";
import Favourites from "./components/favourites";


function App() {
  const [movies, setMovies] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [error, setError] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [view, setView] = useState("home");
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [favouritesLoaded, setFavouritesLoaded] = useState(false);

  // 🌙 Toggle Theme
  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // 🌗 Apply theme globally
  useEffect(() => {
    document.body.classList.toggle("dark-mode", isDarkMode);
  }, [isDarkMode]);

useEffect(() => {
  const saved = localStorage.getItem("favourites");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      setFavourites(parsed);
      console.log("Loaded favourites:", favourites);
    } catch (e) {
      console.error("Error parsing favourites:", e);
    }
  }
  setFavouritesLoaded(true); // ✅ Mark as loaded
}, []);

  useEffect(() => {
  if (favouritesLoaded) {
    localStorage.setItem("favourites", JSON.stringify(favourites));
    console.log("Saving favourites:", favourites);
  }
}, [favourites, favouritesLoaded]);

  // 🎬 Fetch movies from API
  const handleSearch = async (query) => {
    if (!query.trim()) return;

    setError("");
    setLoading(true);
    setMovies([]);
    setView("home");
    setHasSearched(true);

    try {
      const response = await fetch(
        `https://www.omdbapi.com/?s=${query}&apikey=d4b5fa97`
      );
      const data = await response.json();

      if (data.Response === "True") {
        setMovies(data.Search);
      } else {
        setError("No movies found.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ❤️ Add / Remove favourites (fully synced)
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
      className={`App min-vh-100 ${
        isDarkMode ?  "text-light" : "text-dark" //"bg-dark text-light" : "bg-light text-dark"
      } transition-all`}
      style={{
    backgroundColor: isDarkMode
      ? "rgba(0, 0, 0, 0.5)"
      : "rgba(255, 255, 255, 0.5)",
    backdropFilter: "blur(5px)",
  }}
    >
      <div className="bg-animated"></div>
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
          }
        }}
        currentView={view}
      />

      {/* 🏠 Home Section */}
      {view === "home" && movies.length === 0 && (
        <section className="hero-section text-center py-5 position-relative overflow-hidden">
          <div className="parallax-bg"></div>
          <div className="floating-icons">
            <i className="fa-solid fa-film icon-1"></i>
            <i className="fa-solid fa-video icon-2"></i>
            <i className="fa-solid fa-clapperboard icon-3"></i>
            <i className="fa-solid fa-star icon-4"></i>
          </div>

          <MovieverseShuffleNoGSAP
            className="display-4 fw-bold mb-3 text-gradient position-relative"
            text=" MovieVerse"
          />
          <p className="lead shiny-text position-relative">
            Discover, Favourite, and Enjoy your favourite films!
          </p>

          <div className="hero-images mt-5 d-flex justify-content-center flex-wrap gap-4 position-relative">
            {[
              "https://wallpaper.dog/large/5486474.jpg",
              "https://tse4.mm.bing.net/th/id/OIP.AAGlLz5a8UVl6A3Hh54gOQHaEK?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3",
              "https://i.pinimg.com/originals/98/19/ee/9819ee6d392c0fccf160202adc2b1f7f.gif",
              "https://media0.giphy.com/media/7zMsa4CDcXY7PEDNGN/giphy.gif",
            ].map((img, index) => (
              <div key={index} className="parallax-layer" data-speed={(index + 1) * 0.2}>
                <img src={img} alt={`Movie ${index + 1}`} className="hero-poster shadow-lg" />
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
      {view === "home" && (
        <>
          {movies.length > 0 && (
            <h3 className="text-center mt-4">Search Results</h3>
          )}
          {loading ? (
            <div className="movie-grid mt-3">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="skeleton movie-skeleton"></div>
              ))}
            </div>
          ) : (
            <MovieList
              movies={movies}
              addToFavourites={addToFavourites}
              removeFromFavourites={removeFromFavourites}
              favourites={favourites}
            />
          )}
        </>
      )}

      {/* ❤️ Favourites Page */}
      {/* {view === "favourites" && (
        <div className="fade-in mt-5">
          <h3 className="text-center text-danger mb-4">❤️ Your Favourites</h3>
          {favourites.length > 0 ? (
            <MovieList
              movies={favourites}
              removeFromFavourites={removeFromFavourites}
              favourites={favourites}
            />
          ) : (
            <p className="text-center">No favourites yet. Start adding some!</p>
          )}
        </div>
      )} */}
      {view === "favourites" && (
  <Favourites
    favourites={favourites}
    removeFromFavourites={removeFromFavourites}
  />
)}

    </div>
  );
}

export default App;




