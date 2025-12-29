import React, { useState } from "react";
import "./MovieList.css";

function MovieList({
  movies = [],
  hasSearched,
  loading,
  addToFavourites,
  removeFromFavourites,
  favourites = [],
}) {
  const [hoveredMovieId, setHoveredMovieId] = useState(null);
  const [details, setDetails] = useState({});

  // 🧠 Prevent duplicates (optional but good for stability)
  const uniqueMovies = movies.filter(
    (movie, index, self) =>
      index === self.findIndex((m) => m.imdbID === movie.imdbID)
  );

  // 🩶 Empty state handling
  if (!uniqueMovies || uniqueMovies.length === 0) {
    if (hasSearched) {
      return <p className="text-center mt-3 text-danger">No movies found.</p>;
    }
    return null;
  }

  // ⏳ Loading skeleton
  if (loading) {
    return (
      <div className="movie-grid">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="movie-card skeleton-card">
            <div className="poster-skeleton shimmer"></div>
            <div className="text-skeleton shimmer"></div>
            <div className="text-skeleton shimmer short"></div>
          </div>
        ))}
      </div>
    );
  }

  // 🎬 Fetch detailed info on hover (cached)
  const fetchDetails = async (movieId) => {
    if (details[movieId]) return; // Already fetched

    try {
      const res = await fetch(
        `https://www.omdbapi.com/?apikey=d4b5fa97&i=${movieId}&plot=short`
      );
      const data = await res.json();
      if (data.Response === "True") {
        setDetails((prev) => ({ ...prev, [movieId]: data }));
      }
    } catch (error) {
      console.error("Error fetching movie details:", error);
    }
  };

  // ❤️ Check if a movie is favourite
  const isFavourite = (movie) =>
    favourites?.some((fav) => fav.imdbID === movie.imdbID);

  return (
    <div className="movie-grid">
      {uniqueMovies.map((movie, index) => (
        <div
          key={`${movie.imdbID}-${index}`} // ✅ Unique key fix
          className="movie-card"
          onMouseEnter={() => {
            setHoveredMovieId(movie.imdbID);
            fetchDetails(movie.imdbID);
          }}
          onMouseLeave={() => setHoveredMovieId(null)}
        >
          <div className="poster-container">
            <img
              src={
                movie.Poster !== "N/A"
                  ? movie.Poster
                  : "https://via.placeholder.com/200x300"
              }
              alt={movie.Title}
              className="movie-poster"
            />

            {/* ❤️ Favourite toggle */}
            <div
              className={`fav-icon ${isFavourite(movie) ? "active" : ""}`}
              onClick={(e) => {
                e.stopPropagation(); // Prevent hover issues
                isFavourite(movie)
                  ? removeFromFavourites(movie)
                  : addToFavourites(movie);
              }}
            >
              {isFavourite(movie) ? "❤️" : "🤍"}
            </div>

            {/* Hover details overlay */}
            {hoveredMovieId === movie.imdbID && (
              <div className="hover-overlay">
                <h3>{movie.Title}</h3>
                {details[movie.imdbID] ? (
                  <>
                    <p>
                      <strong>Cast:</strong> {details[movie.imdbID].Actors}
                    </p>
                    <p>
                      <strong>Director:</strong> {details[movie.imdbID].Director}
                    </p>
                  </>
                ) : (
                  <p>Loading...</p>
                )}
              </div>
            )}
          </div>

          {/* 📅 Movie Info */}
          <div className="movie-info">
            <h4>{movie.Title}</h4>
            <p>{movie.Year}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MovieList;


