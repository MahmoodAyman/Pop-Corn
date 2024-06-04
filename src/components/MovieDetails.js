import { useEffect, useState } from "react";
import StarRating from "./StarRating";
const KEY = "ad4b4032";
export default function MovieDetails({
  selectedId,
  onCloseMovie,
  onAddWatched,
  watched,
}) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("");
  const [error, setError] = useState("");

  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);
  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;

  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ")[0]),
      userRating,
    };
    onAddWatched(newWatchedMovie);
    onCloseMovie();
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
  useEffect(
    function () {
      function esc(e) {
        if (e.code === "Escape") {
          onCloseMovie();
        }
      }
      document.addEventListener("keydown", esc);
      // clean up eventlitener with unmount
      return function () {
        document.removeEventListener("keydown", esc);
      };
    },
    [onCloseMovie]
  );
  useEffect(
    function () {
      setIsLoading(true);
      async function getMovieDetails() {
        try {
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
          );
          if (!res.ok) throw new Error("fuck");
          const data = await res.json();
          if (data.Response === "False") throw new Error("fuck data");
          setMovie(data);
        } catch (error) {
          setError(error.message);
        } finally {
          setIsLoading(false);
        }
      }
      getMovieDetails();
    },
    [selectedId]
  );
  useEffect(
    function () {
      if (!title) return;
      document.title = `PopCorn | ${title}`;
      return function () {
        document.title = "PopCorn";
      };
    },
    [title]
  );
  return (
    <div className="details">
      {isLoading && <Loader />}
      {!isLoading && !error && (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={`poster of the ${movie} movie`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>{released} &bull;</p>
              <p>{genre}</p>
              <p>
                <span>💫</span>
                {imdbRating}
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    onSetRating={setUserRating}
                  />
                  {userRating > 0 && (
                    <button className="btn-add" onClick={handleAdd}>
                      + Add to watched list
                    </button>
                  )}
                </>
              ) : (
                <p>You rated this movie before with: {watchedUserRating} ⭐</p>
              )}
            </div>
            <p>
              <em>{plot}</em>
              <p>Starring : {actors}</p>
              <p>Directed By: {director}</p>
            </p>
          </section>
        </>
      )}
      {error && <ErrorMessage message={error} />}
    </div>
  );
}
function Loader() {
  return <p className="loader">Loading... </p>;
}
function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>❌</span>
      {message}
    </p>
  );
}
