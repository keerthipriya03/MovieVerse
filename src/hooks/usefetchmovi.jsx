import { useEffect, useState } from "react";
import { fetchMovies } from "../api/movieapi";

export function useFetchMovies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMovies()
      .then((data) => {
        setMovies(data.Search || []); // OMDb returns { Search: [...] }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { movies, loading, error };
}
