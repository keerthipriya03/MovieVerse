import React from "react";
import MovieList from "./movielist";

function Favourites({ favourites, removeFromFavourites }) {
  return (
    <div className="fade-in mt-5">
      <h3 className="text-center text-danger mb-4">
        ❤️ Your Favourites
      </h3>

      {favourites.length > 0 ? (
        <MovieList
          movies={favourites}
          favourites={favourites}
          removeFromFavourites={removeFromFavourites}
        />
      ) : (
        <p className="text-center">
          No favourites yet. Start adding some!
        </p>
      )}
    </div>
  );
}

export default Favourites;
