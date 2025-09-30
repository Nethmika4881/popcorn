import _ from "lodash";

const average = (arr) => _.mean(arr);

export default function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length || 0} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>
            {isNaN(Number(avgImdbRating)) ? 0 : avgImdbRating.toFixed(2)}
          </span>
        </p>
        <p>
          <span>🌟</span>
          <span>
            {isNaN(Number(avgUserRating)) ? 0 : avgUserRating.toFixed(2)}
          </span>
        </p>
        <p>
          <span>⏳</span>
          <span>
            {isNaN(Number(avgRuntime)) ? 0 : avgRuntime.toFixed(2) || 0} min
          </span>
        </p>
      </div>
    </div>
  );
}
