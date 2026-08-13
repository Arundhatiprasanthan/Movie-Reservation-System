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

  // --------------------------------------------------
  // CHECK BOOKING DATA
  // --------------------------------------------------

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

  // --------------------------------------------------
  // BOOKING STATE
  // --------------------------------------------------

  const {
    movie,
    seats,
    theatre,
    time,
    date,
    price,
    showtimeId,
  } = state;

  // --------------------------------------------------
  // TICKET PRICE
  // --------------------------------------------------

  const ticketPrice =
    Number(price) ||
    Number(movie.ticketPrice) ||
    350;

  // --------------------------------------------------
  // PRICE CALCULATION
  // --------------------------------------------------

  const subtotal =
    seats.length * ticketPrice;

  const convenienceFee = 50;

  const gst =
    Math.round(subtotal * 0.18);

  const total =
    subtotal +
    convenienceFee +
    gst;

  // --------------------------------------------------
  // LOCAL POSTERS
  //
  // These are ONLY FALLBACKS for the original
  // 5 frontend movies.
  // --------------------------------------------------

  const movieImages = {
    "Rapid Strike": rapidStrike,
    "Silent Reckoning": silentReckoning,
    Eclipse: eclipse,
    "Beyond Forever": beyondForever,
    "The Whispers in the Dark": whispersInTheDark,
  };

  // --------------------------------------------------
  // POSTER URL
  //
  // IMPORTANT:
  // Backend/admin poster comes FIRST.
  //
  // This means:
  //
  // Admin movie posterUrl
  //        ↓
  // movie.poster
  //        ↓
  // local poster for original movies
  //        ↓
  // eclipse fallback
  // --------------------------------------------------

  const backendPoster =
    movie.posterUrl ||
    movie.poster ||
    "";

  const localPoster =
    movieImages[movie.title] ||
    "";

  const poster =
    backendPoster ||
    localPoster ||
    eclipse;

  console.log("ORDER SUMMARY MOVIE:", movie);
  console.log("ADMIN POSTER URL:", movie.posterUrl);
  console.log("FINAL POSTER:", poster);

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

      {/* ------------------------------------------------ */}
      {/* PAGE TITLE */}
      {/* ------------------------------------------------ */}

      <h1>Booking Summary</h1>

      {/* ------------------------------------------------ */}
      {/* MOVIE SUMMARY */}
      {/* ------------------------------------------------ */}

      <div className="summary-card">

        {/* MOVIE POSTER */}

        <img
          src={poster}
          alt={movie.title}
          onError={(event) => {
            console.error(
              "Failed to load movie poster:",
              poster
            );

            event.currentTarget.onerror = null;

            // Try local poster if available
            if (localPoster) {
              event.currentTarget.src = localPoster;
            } else {
              // Final fallback
              event.currentTarget.src = eclipse;
            }
          }}
        />

        {/* MOVIE DETAILS */}

        <div className="summary-details">

          {/* TITLE */}

          <h2>
            {movie.title}
          </h2>

          {/* GENRE */}

          <p>
            {genreText}
          </p>

          {/* DATE */}

          <p>
            📅 {date}
          </p>

          {/* TIME */}

          <p>
            ⏰ {time}
          </p>

          {/* THEATRE */}

          <p>
            📍 {theatre}
          </p>

          {/* SEATS */}

          <p>
            Seats:{" "}
            <span>
              {seats.join(", ")}
            </span>
          </p>

        </div>
      </div>

      {/* ------------------------------------------------ */}
      {/* PRICE SUMMARY */}
      {/* ------------------------------------------------ */}

      <div className="price-box">

        {/* TICKETS */}

        <div>
          <span>
            Tickets ({seats.length} × ₹{ticketPrice})
          </span>

          <span>
            ₹{subtotal}
          </span>
        </div>

        {/* CONVENIENCE FEE */}

        <div>
          <span>
            Convenience Fee
          </span>

          <span>
            ₹{convenienceFee}
          </span>
        </div>

        {/* GST */}

        <div>
          <span>
            GST (18%)
          </span>

          <span>
            ₹{gst}
          </span>
        </div>

        <hr />

        {/* TOTAL */}

        <div className="total">

          <span>
            Total Amount
          </span>

          <span>
            ₹{total}
          </span>

        </div>

      </div>

      {/* ------------------------------------------------ */}
      {/* PAYMENT BUTTON */}
      {/* ------------------------------------------------ */}

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