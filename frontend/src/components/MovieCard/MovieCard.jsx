import "./MovieCard.css";
import { useNavigate } from "react-router-dom";

import rapidStrike from "../../assets/images/movies/rapid-strike.png";
import silentReckoning from "../../assets/images/movies/silent-reckoning.png";
import eclipse from "../../assets/images/movies/eclipse.png";
import beyondForever from "../../assets/images/movies/beyond-forever.png";
import whispersInTheDark from "../../assets/images/movies/the-whispers-in-the-dark.png";

function MovieCard({ movie }) {
  const navigate = useNavigate();

  const movieId = movie._id || movie.id;

  const movieImages = {
    "Rapid Strike": rapidStrike,
    "Silent Reckoning": silentReckoning,
    Eclipse: eclipse,
    "Beyond Forever": beyondForever,
    "The Whispers in the Dark": whispersInTheDark,
  };

  const poster =
    movieImages[movie.title] ||
    movie.posterUrl ||
    movie.poster ||
    eclipse;

  const genreText = Array.isArray(movie.genre)
    ? movie.genre.join(" • ")
    : movie.genre || "Genre";

  const durationText =
    typeof movie.duration === "number"
      ? `${movie.duration} mins`
      : movie.duration || "";

  return (
    <div className="movie-card">
      <div className="movie-poster">
        <img
          src={poster}
          alt={movie.title}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = eclipse;
          }}
        />

        <div className="movie-rating">
          ⭐ {movie.rating || "8.5"}
        </div>
      </div>

      <div className="movie-details">
        <span className="movie-genre">
          {genreText}
        </span>

        <h3>{movie.title}</h3>

        <p>{durationText}</p>

        <button onClick={() => navigate(`/movie/${movieId}`)}>
          Book Now
        </button>
      </div>
    </div>
  );
}

export default MovieCard;