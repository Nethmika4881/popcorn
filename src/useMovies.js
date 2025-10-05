import { useEffect, useState } from "react";
const KEY = "51040e31";

export function useMovies(query, callBack) {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [movies, setMovies] = useState([]);

  useEffect(
    function () {
      const controller = new AbortController();
      callBack?.();

      const fetchMovies = async function () {
        try {
          setIsLoading(true);
          setError("");

          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );
          // console.log(res);
          if (!res.ok) throw new Error("Something went wrong...");

          const resJson = await res.json();
          if (resJson.Response === "False")
            throw new Error("Check spelling and try again.");
          console.log(resJson);
          setMovies(resJson.Search);
        } catch (err) {
          if (err.name !== "AbortError") {
            setError(err.message);
            console.error(err.message);
            setMovies([]);
          }
        } finally {
          setIsLoading(false);
        }
      };
      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }
      // handleDeselectID();
      fetchMovies();

      // If user rapidly clicks between movies:
      // Movie A selected → fetch starts
      // Movie B selected → fetch starts (Movie A fetch still running!)
      // Movie A response arrives → sets wrong movie data! so use this cleanup function
      return function () {
        controller.abort();
      };
    },
    [query]
  );

  return { isLoading, error, movies };
}
