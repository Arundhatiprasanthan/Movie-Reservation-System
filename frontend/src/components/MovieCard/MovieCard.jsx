import "./MovieCard.css";
import { useNavigate } from "react-router-dom";
function MovieCard({ movie }) {
    const navigate = useNavigate();
  return (
    <div className="movie-card">
      <div className="movie-poster">
        <img src={movie.poster} alt={movie.title} />

        <div className="movie-rating">
            ⭐ {movie.rating}
        </div>
      </div>

      <div className="movie-details">
        <span className="movie-genre">{movie.genre}</span>

        <h3>{movie.title}</h3>

        <p>{movie.duration}</p>

        <button
    onClick={() => navigate(`/movie/${movie.id}`)}
>
    Book Now
</button>
      </div>
    </div>
  );
}

export default MovieCard;