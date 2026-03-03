import React, { useState } from "react";
import "./movielist.css";

function MovieList({
  movies = [],
  hasSearched = false,
  loading = false,
  addToFavourites,
  removeFromFavourites,
  favourites = [],
  searchQuery = "",
}) {
  const [hoveredMovieId, setHoveredMovieId] = useState(null);
  const [details, setDetails] = useState({});

  const normalizedQuery = searchQuery.toLowerCase();

  const movieMatchesSearch = (movie) => {
    if (movie.Title.toLowerCase().includes(normalizedQuery)) return true;

    const detail = details[movie.imdbID];
    if (!detail) return false;

    if (detail.Actors?.toLowerCase().includes(normalizedQuery)) return true;
    if (detail.Director?.toLowerCase().includes(normalizedQuery)) return true;

    return false;
  };

  const uniqueMovies = movies.filter(
    (movie, index, self) => index === self.findIndex((m) => m.imdbID === movie.imdbID)
  );

  if (!uniqueMovies || uniqueMovies.length === 0) {
    if (hasSearched) return <p className="text-center mt-3 text-danger">No movies found.</p>;
    return null;
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

  const fetchDetails = async (movieId) => {
    if (details[movieId]) return;
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

  const isFavourite = (movie) => favourites?.some((fav) => fav.imdbID === movie.imdbID);

  return (
    <div className="movie-grid">
      {uniqueMovies.map((movie, index) => (
        <div
          key={`${movie.imdbID}-${index}`}
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

            <div
              className={`fav-icon ${isFavourite(movie) ? "active" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                isFavourite(movie) ? removeFromFavourites(movie) : addToFavourites(movie);
              }}
            >
              {isFavourite(movie) ? "❤️" : "🤍"}
            </div>

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
