import React from "react";
import { Heart, HeartOff } from "lucide-react";

function MovieCard({ movie, favourites, addToFavourites, removeFromFavourites }) {
  const isFav = favourites.some((f) => f.imdbID === movie.imdbID);

  return (
    <div className="relative group bg-gray-800 rounded-xl overflow-hidden shadow-lg transition transform hover:scale-105">
      <img
        src={movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/300x450?text=No+Image"}
        alt={movie.Title}
        className="w-full h-72 object-cover"
      />

      {/* ❤️ Favourite Icon */}
      <button
        onClick={() =>
          isFav ? removeFromFavourites(movie.imdbID) : addToFavourites(movie)
        }
        className="absolute top-3 right-3 text-white"
      >
        {isFav ? <Heart fill="red" /> : <Heart />}
      </button>

      {/* 🩶 Overlay on hover */}
      <div className="absolute inset-0 bg-black bg-opacity-70 opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
        <h3 className="font-semibold text-lg">{movie.Title}</h3>
        <p className="text-sm text-gray-300">{movie.Year}</p>
      </div>
    </div>
  );
}

export default MovieCard;
