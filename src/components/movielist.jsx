import React, { useState } from "react";
import "./MovieList.css"; // make sure CSS is applied

function MovieList({ movies=[],hasSearched, loading, addToFavourites, removeFromFavourites, favourites=[] }) {
  const [hoveredMovieId, setHoveredMovieId] = useState(null);

  // 🩶 Show nothing if there are no movies and no search done yet
  if (!movies || movies.length === 0) {
    if (hasSearched) {
      return <p className="text-center mt-3 text-danger">No movies found.</p>;
    }
    return null; // nothing to show before search
  }
  
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

  // ... existing code
  const [details, setDetails] = useState({});

  const fetchDetails = async (movieId) => {
    if (details[movieId]) return;
    try {
      const res = await fetch(`https://www.omdbapi.com/?apikey=d4b5fa97&i=${movieId}&plot=short`);
      const data = await res.json();
      if (data.Response === "True") {
        setDetails((prev) => ({ ...prev, [movieId]: data }));
      }
    } catch (error) {
      console.error("Error fetching movie details:", error);
    }
  };

  const isFavourite = (movie) => favourites?.some((fav) => fav.imdbID === movie.imdbID);

  if (!movies || movies.length === 0) {
    return <p className="no-movies-text">No movies found. Try searching for something!</p>;
  }

  return (
    <div className="movie-grid">
      {movies.map((movie) => (
        <div
          key={movie.imdbID}
          className="movie-card"
          onMouseEnter={() => {
            setHoveredMovieId(movie.imdbID);
            fetchDetails(movie.imdbID);
          }}
          onMouseLeave={() => setHoveredMovieId(null)}
        >
          <div className="poster-container">
            <img
              src={movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/200x300"}
              alt={movie.Title}
              className="movie-poster"
            />

            {/* Favourite Heart Icon */}
            <div
              className={`fav-icon ${isFavourite(movie) ? "active" : ""}`}
              onClick={() =>
                isFavourite(movie)
                  ? removeFromFavourites(movie.imdbID)
                  : addToFavourites(movie)
              }
            >
              {isFavourite(movie) ? "❤️" : "🤍"}
            </div>

            {/* Hover overlay details */}
            {hoveredMovieId === movie.imdbID && (
              <div className="hover-overlay">
                <h3>{movie.Title}</h3>
                {details[movie.imdbID] ? (
                  <>
                    <p><strong>Cast:</strong> {details[movie.imdbID].Actors}</p>
                    <p><strong>Director:</strong> {details[movie.imdbID].Director}</p>
                  </>
                ) : (
                  <p>Loading...</p>
                )}
              </div>
            )}
          </div>

          {/* Below poster title/year */}
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
