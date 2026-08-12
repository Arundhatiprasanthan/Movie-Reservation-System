import MovieCard from "../MovieCard/MovieCard";
import fallbackMovies from "../../data/movieData";
import "./MovieGrid.css";

function MovieGrid({ movies, loading }) {
  const displayMovies = Array.isArray(movies) && movies.length > 0 ? movies : fallbackMovies;

  if (loading) {
    return (
      <div style={{ padding: "3rem", textAlign: "center", color: "#c5a880" }}>
        <p>Loading current films...</p>
      </div>
    );
  }

  if (displayMovies.length === 0) {
    return (
      <div style={{ padding: "3rem", textAlign: "center", color: "#888" }}>
        <h3>No movies found</h3>
        <p>Try adjusting your search criteria or genre filter.</p>
      </div>
    );
  }

  return (
    <div className="movie-grid">
      {displayMovies.map((movie) => (
        <MovieCard
          key={movie._id || movie.id}
          movie={movie}
        />
      ))}
    </div>
  );
}

export default MovieGrid;