import { useLocation, useNavigate } from "react-router-dom";
import "./OrderSummary.css";

import rapidStrike from "../../assets/images/movies/rapid-strike.png";
import silentReckoning from "../../assets/images/movies/silent-reckoning.png";
import eclipse from "../../assets/images/movies/eclipse.png";
import beyondForever from "../../assets/images/movies/beyond-forever.png";
import whispersInTheDark from "../../assets/images/movies/the-whispers-in-the-dark.png";

function OrderSummary() {
  const navigate = useNavigate();
  const { state } = useLocation();

  if (!state || !state.movie || !state.seats) {
    return (
      <div
        className="summary-page"
        style={{
          textAlign: "center",
          paddingTop: "5rem",
        }}
      >
        <h2>No booking selected</h2>

        <button
          onClick={() => navigate("/")}
          className="pay-btn"
          style={{ marginTop: "1.5rem" }}
        >
          Return to Films
        </button>
      </div>
    );
  }

  const {
    movie,
    seats,
    theatre,
    time,
    date,
    price,
    showtimeId,
  } = state;

  const ticketPrice =
    price || movie.ticketPrice || 350;

  const subtotal =
    seats.length * ticketPrice;

  const convenienceFee = 50;

  const gst =
    Math.round(subtotal * 0.18);

  const total =
    subtotal + convenienceFee + gst;

  // --------------------------------------------------
  // MOVIE POSTER
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
  // GENRE
  // --------------------------------------------------

  const genreText = Array.isArray(movie.genre)
    ? movie.genre.join(", ")
    : movie.genre || "Genre unavailable";

  // --------------------------------------------------
  // PAYMENT DATA
  // --------------------------------------------------

  const paymentData = {
    showtimeId,
    movie,
    seats,
    theatre,
    time,
    date,
    price: ticketPrice,
    subtotal,
    convenienceFee,
    gst,
    total,
  };

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

  return (
    <div className="summary-page">

      <h1>Booking Summary</h1>

      <div className="summary-card">

        <img
          src={poster}
          alt={movie.title}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = eclipse;
          }}
        />

        <div className="summary-details">

          <h2>{movie.title}</h2>

          <p>{genreText}</p>

          <p>
            📅 {date}
          </p>

          <p>
            ⏰ {time}
          </p>

          <p>
            📍 {theatre}
          </p>

          <p>
            Seats:{" "}
            <span>
              {seats.join(", ")}
            </span>
          </p>

        </div>
      </div>

      <div className="price-box">

        <div>
          <span>
            Tickets ({seats.length} × ₹{ticketPrice})
          </span>

          <span>
            ₹{subtotal}
          </span>
        </div>

        <div>
          <span>
            Convenience Fee
          </span>

          <span>
            ₹{convenienceFee}
          </span>
        </div>

        <div>
          <span>
            GST (18%)
          </span>

          <span>
            ₹{gst}
          </span>
        </div>

        <hr />

        <div className="total">

          <span>
            Total Amount
          </span>

          <span>
            ₹{total}
          </span>

        </div>

      </div>

      <button
        className="pay-btn"
        onClick={() =>
          navigate("/payment", {
            state: paymentData,
          })
        }
      >
        Proceed to Payment →
      </button>

    </div>
  );
}

export default OrderSummary;