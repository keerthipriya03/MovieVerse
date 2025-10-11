import React, { useState, useEffect } from "react";
import Navbar from "./components/navbar";
import MovieList from "./components/movielist";
import "./index.css";
import MovieverseShuffleNoGSAP from "./components/shuffletxt";
import "./ShinyText.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [error, setError] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [view, setView] = useState("home");
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // 🌙 Toggle Theme
  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // Apply theme globally
  useEffect(() => {
    document.body.classList.toggle("dark-mode", isDarkMode);
  }, [isDarkMode]);

  // Load favourites from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("favourites")) || [];
    setFavourites(saved);
  }, []);

  // Save favourites to localStorage
  useEffect(() => {
    localStorage.setItem("favourites", JSON.stringify(favourites));
  }, [favourites]);

  // 🎬 Fetch movies from API
  const handleSearch = async (query) => {
    if (!query.trim()) return;
    setError("");
    setLoading(true);
    setMovies([]);
    setView("home"); // always go back to home when searching
    setHasSearched(true); // mark that a search was performed

    try {
      const response = await fetch(`https://www.omdbapi.com/?s=${query}&apikey=d4b5fa97`);
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

  // ❤️ Add / Remove favourites
  const addToFavourites = (movie) => {
    if (!favourites.find((fav) => fav.imdbID === movie.imdbID)) {
      setFavourites([...favourites, movie]);
    }
  };

  const removeFromFavourites = (id) => {
    setFavourites(favourites.filter((fav) => fav.imdbID !== id));
  };

  return (
    <div
      className={`App min-vh-100 ${
        isDarkMode ? "bg-dark text-light" : "bg-light text-dark"
      } transition-all`}
    >
      {/* Sticky Navbar */}
      <Navbar
        onSearch={handleSearch}
        favouritesCount={favourites.length}
        toggleTheme={toggleTheme}
        isDarkMode={isDarkMode}
        // ✅ reset error and search state when navigating home
        setView={(newView) => {
          setView(newView);
          if (newView === "home") {
            setError("");
            setHasSearched(false);
          }
        }}
        currentView={view}
      />

      {/* Default Home Hero Section */}
      {view === "home" && movies.length === 0 && (
        <section className="hero-section text-center py-5 position-relative overflow-hidden">
          {/* Glowing parallax background */}
          <div className="parallax-bg"></div>

          {/* Floating film icons */}
          <div className="floating-icons">
            <i className="fa-solid fa-film icon-1"></i>
            <i className="fa-solid fa-video icon-2"></i>
            <i className="fa-solid fa-clapperboard icon-3"></i>
            <i className="fa-solid fa-star icon-4"></i>
          </div>

          {/* MovieVerse title with shuffle animation */}
          <MovieverseShuffleNoGSAP
            className="display-4 fw-bold mb-3 text-gradient position-relative"
            text=" MovieVerse"
          />
          <p className="lead shiny-text position-relative">
            Discover, Favourite, and Enjoy your favourite films!
          </p>

          {/* Parallax movie posters */}
          <div className="hero-images mt-5 d-flex justify-content-center flex-wrap gap-4 position-relative">
            {[
              "https://wallpaper.dog/large/5486474.jpg",
              "https://tse4.mm.bing.net/th/id/OIP.AAGlLz5a8UVl6A3Hh54gOQHaEK?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3",
              "https://i.pinimg.com/originals/98/19/ee/9819ee6d392c0fccf160202adc2b1f7f.gif",
              "https://media0.giphy.com/media/7zMsa4CDcXY7PEDNGN/giphy.gif",
            ].map((img, index) => (
              <div key={index} className="parallax-layer" data-speed={(index + 1) * 0.2}>
                <img
                  src={img}
                  alt={`Movie ${index + 1}`}
                  className="hero-poster shadow-lg"
                />
              </div>
            ))}
          </div>
        </section>
      )}


      {/* 🧩 Show error only after searching */}
      {hasSearched && error && (
        <p className="text-center text-danger mt-3">{error}</p>
      )}

      {/* Search Results Section */}
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

      {/* ❤️ Favourites Section */}
      {view === "favourites" && (
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
      )}
    </div>
  );
}

export default App;
