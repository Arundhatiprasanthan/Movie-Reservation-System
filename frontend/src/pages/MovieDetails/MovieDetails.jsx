import rapidStrike from "../../assets/images/movies/rapid-strike.png";
import silentReckoning from "../../assets/images/movies/silent-reckoning.png";
import eclipse from "../../assets/images/movies/eclipse.png";
import beyondForever from "../../assets/images/movies/beyond-forever.png";
import whispersInTheDark from "../../assets/images/movies/the-whispers-in-the-dark.png";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Navbar from "../../components/Navbar/Navbar";
import LoginModal from "../../components/LoginModal/LoginModal";

import { fetchPublicMovieById } from "../../api/movies";
import fallbackMovies from "../../data/movieData";

import "./MovieDetails.css";

function MovieDetails({
  isLoggedIn,
  setIsLoggedIn,
  user,
  setUser,
  isAdmin,
  setIsAdmin,
}) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);

  // --------------------------------------------------
  // LOAD MOVIE + SHOWTIMES
  // --------------------------------------------------

  useEffect(() => {
    async function loadMovie() {
      setLoading(true);

      try {
        const data = await fetchPublicMovieById(id);

        console.log("MOVIE DETAILS RESPONSE:", data);
        console.log("SHOWTIMES FROM BACKEND:", data?.showtimes);

        if (data && data.movie) {
          setMovie(data.movie);
          setShowtimes(data.showtimes || []);
        } else {
          const fallback = fallbackMovies.find(
            (m) =>
              String(m.id) === String(id) ||
              String(m._id) === String(id)
          );

          setMovie(fallback || null);

          // Do not create fake showtimes.
          setShowtimes([]);
        }
      } catch (error) {
        console.warn(
          "Failed to fetch movie details:",
          error.message
        );

        const fallback = fallbackMovies.find(
          (m) =>
            String(m.id) === String(id) ||
            String(m._id) === String(id)
        );

        setMovie(fallback || null);

        // Do not create fake showtimes.
        setShowtimes([]);
      } finally {
        setLoading(false);
      }
    }

    loadMovie();
  }, [id]);

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#0b0c10",
          color: "#c5a880",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p>Loading movie details...</p>
      </div>
    );
  }

  // --------------------------------------------------
  // MOVIE NOT FOUND
  // --------------------------------------------------

  if (!movie) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#0b0c10",
          color: "#fff",
          textAlign: "center",
          padding: "5rem",
        }}
      >
        <h2>Movie not found</h2>

        <button
          onClick={() => navigate("/")}
          style={{
            marginTop: "1rem",
            padding: "0.6rem 1.5rem",
            background: "#c5a880",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Back to Films
        </button>
      </div>
    );
  }

  // --------------------------------------------------
  // MOVIE IMAGES
  // --------------------------------------------------

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

  // --------------------------------------------------
  // MOVIE INFORMATION
  // --------------------------------------------------

  const genreStr = Array.isArray(movie.genre)
    ? movie.genre.join(", ")
    : movie.genre || "Unknown";

  const durationStr =
    typeof movie.duration === "number"
      ? `${movie.duration} mins`
      : movie.duration || "N/A";

  const releaseYear = movie.releaseDate
    ? new Date(movie.releaseDate).getFullYear()
    : movie.year || 2026;

  // --------------------------------------------------
  // DIRECTOR
  // --------------------------------------------------

  const directorStr =
    movie.director?.trim?.() ||
    movie.director ||
    "Director information unavailable";

  // --------------------------------------------------
  // CAST
  // --------------------------------------------------

  const castStr = Array.isArray(movie.cast)
    ? movie.cast.join(", ")
    : movie.cast || "Cast information unavailable";

  // --------------------------------------------------
  // GO TO SEAT SELECTION
  // --------------------------------------------------

  const goToSeats = (
    showtimeId,
    theatre,
    time,
    date,
    price
  ) => {
    // A booking must always have a real Showtime ID.
    if (!showtimeId) {
      console.error("No showtime ID provided.");
      return;
    }

    navigate(`/seats/${showtimeId}`, {
      state: {
        showtimeId,
        theatre,
        time,
        date,
        price,
        movie,
      },
    });
  };

  // --------------------------------------------------
  // GROUP SHOWTIMES BY DATE
  // --------------------------------------------------

  const groupedShowtimes = {};

  showtimes.forEach((showtime) => {
    if (!showtime?._id || !showtime?.startTime) {
      return;
    }

    const date = new Date(showtime.startTime);

    const dateKey = date
      .toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
      })
      .toUpperCase();

    if (!groupedShowtimes[dateKey]) {
      groupedShowtimes[dateKey] = [];
    }

    groupedShowtimes[dateKey].push(showtime);
  });

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

  return (
    <>
      <Navbar
        isLoggedIn={isLoggedIn}
        user={user}
        setUser={setUser}
        setIsLoggedIn={setIsLoggedIn}
        onSignIn={() => setShowLogin(true)}
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
      />

      {/* ------------------------------------------------ */}
      {/* LOGIN MODAL */}
      {/* ------------------------------------------------ */}

      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          setUser={setUser}
          setIsAdmin={setIsAdmin}
          onLogin={() => {
            setIsLoggedIn(true);
            setShowLogin(false);
          }}
        />
      )}

      {/* ------------------------------------------------ */}
      {/* MOVIE DETAILS */}
      {/* ------------------------------------------------ */}

      <div className="movie-details-page">
        <div className="movie-banner">

          {/* -------------------------------------------- */}
          {/* LEFT - POSTER */}
          {/* -------------------------------------------- */}

          <div className="movie-left">
            <img
              src={poster}
              alt={movie.title}
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = eclipse;
              }}
            />
          </div>

          {/* -------------------------------------------- */}
          {/* RIGHT - DETAILS */}
          {/* -------------------------------------------- */}

          <div className="movie-right">

            {/* MOVIE META */}
            <p className="movie-info-top">
              {releaseYear} •{" "}
              {genreStr.toUpperCase()} •{" "}
              {durationStr.toUpperCase()}
            </p>

            {/* TITLE */}
            <h1 className="movie-title">
              {movie.title}
            </h1>

            {/* RATING */}
            <div className="age-badge">
              {movie.rating ||
                movie.certificate ||
                "PG-13"}
            </div>

            {/* DESCRIPTION */}
            <p className="movie-description">
              {movie.description}
            </p>

            {/* ------------------------------------------ */}
            {/* DIRECTOR + CAST */}
            {/* ------------------------------------------ */}

            <div className="info-grid">

              {/* DIRECTOR */}

              <div className="info-item">
                <span>DIRECTOR</span>

                <h4>
                  {directorStr}
                </h4>
              </div>

              {/* CAST */}

              <div className="info-item">
                <span>CAST</span>

                <h4>
                  {castStr}
                </h4>
              </div>

            </div>

            {/* ------------------------------------------ */}
            {/* SHOWTIMES */}
            {/* ------------------------------------------ */}

            <h2 className="showtime-heading">
              Available Showtimes
            </h2>

            {Object.keys(groupedShowtimes).length > 0 ? (

              Object.entries(groupedShowtimes).map(
                ([dayLabel, showtimeList]) => (

                  <div
                    className="showtime-group"
                    key={dayLabel}
                  >

                    {/* DATE */}

                    <p className="showtime-day">
                      {dayLabel}
                    </p>

                    {/* SHOWTIME CARDS */}

                    <div className="showtime-cards">

                      {showtimeList.map((showtime) => {

                        const startTime = new Date(
                          showtime.startTime
                        );

                        const time =
                          startTime.toLocaleTimeString(
                            "en-US",
                            {
                              hour: "numeric",
                              minute: "2-digit",
                            }
                          );

                        const theatreName =
                          showtime.theater?.name ||
                          "Grand Hall";

                        const screenName =
                          showtime.screen?.name ||
                          "";

                        const theatreDisplay =
                          screenName
                            ? theatreName
                            : theatreName;

                        return (
                          <div
                            key={showtime._id}
                            className="showtime-card"
                            onClick={() =>
                              goToSeats(
                                showtime._id,
                                theatreDisplay,
                                time,
                                dayLabel,
                                showtime.price
                              )
                            }
                          >

                            {/* TIME */}

                            <h3>
                              {time}
                            </h3>

                            {/* THEATRE + PRICE */}

                            <p>
                              {theatreDisplay} · ₹
                              {showtime.price}
                            </p>

                          </div>
                        );
                      })}

                    </div>
                  </div>
                )
              )

            ) : (

              /* ---------------------------------------- */
              /* NO BACKEND SHOWTIMES */
              /* ---------------------------------------- */

              <div className="showtime-group">

                <p className="showtime-day">
                  SHOWTIMES
                </p>

                <p
                  style={{
                    color: "#a0a5b5",
                    marginTop: "0.5rem",
                  }}
                >
                  No showtimes available for this movie.
                </p>

              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
}

export default MovieDetails;