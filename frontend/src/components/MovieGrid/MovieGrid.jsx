import MovieCard from "../MovieCard/MovieCard";
import movies from "../../data/movieData";
import "./MovieGrid.css";

function MovieGrid() {
  return (
    <div className="movie-grid">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
        />
      ))}
    </div>
  );
}

export default MovieGrid;