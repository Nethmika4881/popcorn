import { useEffect, useState } from "react";
import StarComponent from "./StartComponent";

const KEY = "51040e31";

function Load() {
  return <p className="loader">Loading...</p>;
}
export default function MovieDetail({
  selectedID,
  handleDeselectID,
  handleWatchList,
  defaultValue = 0,
  watched,
}) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [rating, setRating] = useState(defaultValue);
  function handleRating(i) {
    setRating(i);
  }
  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedID,
      userRating: rating,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
    };

    handleWatchList(newWatchedMovie);
    handleDeselectID();
  }

  //check has watched now selected movie
  const hasWatched = Boolean(
    watched.find((eachMovie) => eachMovie.imdbID === selectedID)
  );
  const watchedRating = watched.find(
    (eachMovie) => eachMovie.imdbID === selectedID
  )?.userRating;

  useEffect(
    function () {
      const getDetails = async function () {
        try {
          setIsLoading(true);
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedID}`
          );

          if (!res.ok) throw new Error("Something went wrong...");

          const resJson = await res.json();

          setMovie(resJson);

          //handle titile
        } catch (err) {
          console.error(err.message);
        } finally {
          setIsLoading(false);
        }
      };

      getDetails();
    },
    [selectedID]
  );

  //handle key presses

  useEffect(
    function () {
      const callBack = function (e) {
        if (e.code === "Escape") {
          handleDeselectID();
        }
      };
      document.addEventListener("keydown", callBack);

      return function () {
        document.removeEventListener("keydown", callBack);
      };
    },
    [handleDeselectID]
  );
  //change document title

  useEffect(
    function () {
      if (!title) return;
      document.title = `Movie | ${title}`;

      return function () {
        document.title = "usePopcorn";
        // console.log(`cleanup ${title}`);
      }; //this will run,when the component here  MovieDetail component removing from the UI
    },
    [title]
  );
  return (
    <div className="details">
      {isLoading ? (
        <Load />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={handleDeselectID}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${movie} movie`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>

              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating} IMDb rating
              </p>
            </div>
          </header>

          <section>
            <div className="rating">
              {!hasWatched ? (
                <>
                  <StarComponent
                    maxRating={10}
                    rating={rating}
                    handleRating={handleRating}
                  />

                  <button
                    className="btn-add"
                    onClick={!hasWatched ? handleAdd : null}
                    disabled={rating ? false : true} //if raitng has set then should want to button work so set disbled to false
                  >
                    + add to list
                  </button>
                </>
              ) : (
                <StarComponent
                  maxRating={10}
                  rating={watchedRating}
                  handleRating={handleRating}
                  hasWatched={true}
                />
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}
