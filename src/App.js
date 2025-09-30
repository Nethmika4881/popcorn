import { useEffect, useState } from "react";
import { NavBar, Search, Logo, NumResults } from "./NavBar";
import WatchedMoviesList from "./WatchedMoviesList";
import Box from "./Box";
import MovieList from "./MovieList";
import WatchedSummary from "./WatchedSummary";
import MovieDetail from "./MovieDetail";
export const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

export const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const KEY = "51040e31";

function Load() {
  return <p className="loader">Loading...</p>;
}

function ErrorDisplay({ errorMsg }) {
  return (
    <p className="error">
      <span>👎</span>
      {errorMsg}
    </p>
  );
}
export default function App() {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState("inception");
  const [watched, setWatched] = useState([]);
  const [clicked, setClicked] = useState(0);
  const [error, setError] = useState("");
  const [selectedID, setSelectedID] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  function handleSelectedID(id) {
    setSelectedID((selectedID) => (selectedID === id ? null : id));
  }

  function handleDeselectID() {
    setSelectedID(null);
  }
  function handleWatchList(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  function handleDelete(id) {
    setWatched((movies) => movies.filter((movie) => movie.imdbID !== id));
  }
  useEffect(
    function () {
      const controller = new AbortController();

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

  return (
    <>
      <NavBar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} clicked={clicked} setClicked={setClicked} />
      </NavBar>
      <Main>
        <Box>
          {isLoading && <Load />}
          {!isLoading && error && <ErrorDisplay errorMsg={error} />}
          {!isLoading && !error && (
            <MovieList movies={movies} handleSelectedID={handleSelectedID} />
          )}
        </Box>

        <Box>
          {selectedID ? (
            <MovieDetail
              selectedID={selectedID}
              handleWatchList={handleWatchList}
              handleDeselectID={handleDeselectID}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList watched={watched} onDelete={handleDelete} />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}
