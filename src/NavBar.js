import { set } from "lodash";
import { useEffect, useRef } from "react";
import { useKey } from "./useKey";

export function NavBar({ children }) {
  return <nav className="nav-bar">{children}</nav>;
}

export function Logo() {
  return (
    <div className="logo">
      <span role="img" aria-label="popcorn">
        🍿
      </span>
      <h1>usePopcorn</h1>
    </div>
  );
}
export function Search({ query, setQuery }) {
  const inputRef = useRef(null);

  useKey("Enter", function () {
    if (document.activeElement === inputRef.current) return;
    inputRef.current.focus();
    setQuery("");
  });
  // useEffect(
  //   function () {
  //     // console.log(inputRef.current);
  //     function handleEnter(e) {
  //       if (e.code === "Enter") {
  //         if (document.activeElement === inputRef.current) return;
  //         inputRef.current.focus();
  //         setQuery("");
  //       }
  //     }
  //     document.addEventListener("keydown", handleEnter);
  //     return () => document.removeEventListener("keydown", handleEnter);
  //   },
  //   [setQuery]
  // );

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputRef}
    />
  );
}
export function NumResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong> {movies.length}</strong> results
    </p>
  );
}
