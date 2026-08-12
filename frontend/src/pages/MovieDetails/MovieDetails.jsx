import { useParams, useNavigate } from "react-router-dom";
import movies from "../../data/movieData";
import "./MovieDetails.css";

function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const movie = movies.find((m) => m.id === Number(id));

  if (!movie) {
    return <h2 style={{ color: "white" }}>Movie not found</h2>;
  }

  const goToSeats = (theatre, time, date, price) => {
    navigate(`/seats/${movie.id}`, {
      state: {
        theatre,
        time,
        date,
        price,
      },
    });
  };

  return (
    <div className="movie-details-page">
      <div className="movie-banner">

        {/* Left Side */}
        <div className="movie-left">
          <img src={movie.poster} alt={movie.title} />
        </div>

        {/* Right Side */}
        <div className="movie-right">

          <p className="movie-info-top">
            {movie.year} • {movie.genre.toUpperCase()} •{" "}
            {movie.duration.toUpperCase()}
          </p>

          <h1 className="movie-title">{movie.title}</h1>

          <div className="age-badge">
            {movie.certificate}
          </div>

          <p className="movie-description">
            {movie.description}
          </p>

          <div className="info-grid">

            <div className="info-item">
              <span>DIRECTOR</span>
              <h4>{movie.director}</h4>
            </div>

            <div className="info-item">
              <span>CAST</span>
              <h4>{movie.cast}</h4>
            </div>

          </div>

          <h2 className="showtime-heading">
            Available Showtimes
          </h2>

          {/* Tuesday */}

          <div className="showtime-group">

            <p className="showtime-day">
              TUESDAY, JULY 28
            </p>

            <div className="showtime-cards">

              <div
                className="showtime-card"
                onClick={() =>
                  goToSeats(
                    "Grand Hall",
                    "2:30 PM",
                    "Tue, Jul 28",
                    movie.ticketPrice
                  )
                }
              >
                <h3>2:30 PM</h3>
                <p>Grand Hall · ₹{movie.ticketPrice}</p>
              </div>

              <div
                className="showtime-card"
                onClick={() =>
                  goToSeats(
                    "Premiere Suite",
                    "7:00 PM",
                    "Tue, Jul 28",
                    movie.ticketPrice + 100
                  )
                }
              >
                <h3>7:00 PM</h3>
                <p>Premiere Suite · ₹{movie.ticketPrice + 100}</p>
              </div>

            </div>

          </div>

          {/* Wednesday */}

          <div className="showtime-group">

            <p className="showtime-day">
              WEDNESDAY, JULY 29
            </p>

            <div className="showtime-cards">

              <div
                className="showtime-card"
                onClick={() =>
                  goToSeats(
                    "Grand Hall",
                    "1:00 PM",
                    "Wed, Jul 29",
                    movie.ticketPrice
                  )
                }
              >
                <h3>1:00 PM</h3>
                <p>Grand Hall · ₹{movie.ticketPrice}</p>
              </div>

              <div
                className="showtime-card"
                onClick={() =>
                  goToSeats(
                    "Premiere Suite",
                    "8:30 PM",
                    "Wed, Jul 29",
                    movie.ticketPrice + 100
                  )
                }
              >
                <h3>8:30 PM</h3>
                <p>Premiere Suite · ₹{movie.ticketPrice + 100}</p>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default MovieDetails;