import "./SeatSelection.css";

import { useState, useEffect } from "react";
import {
  useNavigate,
  useParams,
  useLocation,
} from "react-router-dom";

import LoginModal from "../../components/LoginModal/LoginModal";

import { fetchPublicShowtimeById } from "../../api/showtimes";

import fallbackMovies from "../../data/movieData";

function SeatSelection({
  isLoggedIn,
  setIsLoggedIn,
  user,
  setUser,
}) {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  // --------------------------------------------------
  // DATA PASSED FROM MOVIE DETAILS
  // --------------------------------------------------

  const stateData = location.state || {};

  const [movie, setMovie] = useState(
    stateData.movie || null
  );

  const [showtime, setShowtime] = useState(null);

  const [selectedSeats, setSelectedSeats] = useState([]);

  const [reservedSeats, setReservedSeats] = useState([]);

  const [blockedSeats, setBlockedSeats] = useState([]);

  const [showLogin, setShowLogin] = useState(false);

  const [loading, setLoading] = useState(false);

  // --------------------------------------------------
  // SHOWTIME ID
  // --------------------------------------------------

  const showtimeId =
    stateData.showtimeId ||
    (id && id.length === 24 ? id : null);

  // --------------------------------------------------
  // LOAD SHOWTIME FROM BACKEND
  // --------------------------------------------------

  useEffect(() => {
    async function loadShowtime() {
      if (!showtimeId) {
        return;
      }

      setLoading(true);

      try {
        const data =
          await fetchPublicShowtimeById(showtimeId);

        /*
         * Depending on your API, it may return:
         *
         * showtime object
         *
         * OR
         *
         * { showtime: {...} }
         */

        const st = data?.showtime || data;

        if (st) {
          setShowtime(st);

          // Update movie from backend
          if (st.movie) {
            setMovie(st.movie);
          }

          // ------------------------------------------
          // GET SEAT STATUS FROM DATABASE
          // ------------------------------------------

          const reserved = [];
          const blocked = [];

          (st.seats || []).forEach((seat) => {
            if (seat.status === "reserved") {
              reserved.push(seat.seatLabel);
            }

            if (seat.status === "blocked") {
              blocked.push(seat.seatLabel);
            }
          });

          setReservedSeats(reserved);
          setBlockedSeats(blocked);
        }
      } catch (error) {
        console.error(
          "Failed to load showtime:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadShowtime();
  }, [showtimeId]);

  // --------------------------------------------------
  // ACTIVE MOVIE
  // --------------------------------------------------

  const activeMovie =
    movie ||
    fallbackMovies.find(
      (m) =>
        String(m.id) === String(id) ||
        String(m._id) === String(id)
    ) ||
    fallbackMovies[0];

  // --------------------------------------------------
  // THEATRE
  // --------------------------------------------------

  const theatre =
    stateData.theatre ||
    (showtime?.theater?.name
      ? showtime.theater.name
      : "Grand Hall");

  // --------------------------------------------------
  // TIME
  // --------------------------------------------------

  const time =
    stateData.time ||
    (showtime?.startTime
      ? new Date(
          showtime.startTime
        ).toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        })
      : "2:30 PM");

  // --------------------------------------------------
  // DATE
  // --------------------------------------------------

  const date =
    stateData.date ||
    (showtime?.startTime
      ? new Date(
          showtime.startTime
        ).toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        })
      : "Today");

  // --------------------------------------------------
  // PRICE
  // --------------------------------------------------

  const price =
    stateData.price ||
    showtime?.price ||
    activeMovie?.ticketPrice ||
    350;

  // --------------------------------------------------
  // ACTUAL SEATS FROM BACKEND
  // --------------------------------------------------

  const seats = showtime?.seats || [];

  // --------------------------------------------------
  // ORGANIZE SEATS BY ROW
  // --------------------------------------------------

  const seatsByRow = {};

  seats.forEach((seat) => {
    const row = seat.seatLabel.charAt(0);

    if (!seatsByRow[row]) {
      seatsByRow[row] = [];
    }

    seatsByRow[row].push(seat);
  });

  const seatRows = Object.keys(seatsByRow).sort();

  // --------------------------------------------------
  // FALLBACK SEAT GRID
  // --------------------------------------------------

  const fallbackRows = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
  ];

  // --------------------------------------------------
  // SEAT CLICK
  // --------------------------------------------------

  const handleSeatClick = (seatNo) => {
    // Cannot select reserved seats
    if (reservedSeats.includes(seatNo)) {
      return;
    }

    // Cannot select blocked seats
    if (blockedSeats.includes(seatNo)) {
      return;
    }

    setSelectedSeats((previousSeats) => {
      if (previousSeats.includes(seatNo)) {
        return previousSeats.filter(
          (seat) => seat !== seatNo
        );
      }

      return [...previousSeats, seatNo];
    });
  };

  // --------------------------------------------------
  // BOOKING DATA
  // --------------------------------------------------

  const bookingData = {
    showtimeId: showtimeId,

    movie: activeMovie,

    seats: selectedSeats,

    theatre: theatre,

    time: time,

    date: date,

    price: price,

    total: selectedSeats.length * price,
  };

  // --------------------------------------------------
  // CONTINUE
  // --------------------------------------------------

  const handleContinue = () => {
    if (selectedSeats.length === 0) {
      return;
    }

    if (!isLoggedIn) {
      setShowLogin(true);
      return;
    }

    navigate("/summary", {
      state: bookingData,
    });
  };

  // --------------------------------------------------
  // AFTER LOGIN
  // --------------------------------------------------

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);

    setShowLogin(false);

    navigate("/summary", {
      state: bookingData,
    });
  };

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

  return (
    <div className="seat-page">

      {/* -------------------------------------------- */}
      {/* MOVIE INFORMATION */}
      {/* -------------------------------------------- */}

      <div className="movie-info">
        <h1>
          {activeMovie?.title || "Movie"}
        </h1>

        <p>
          {theatre} • {date} • {time} •{" "}
          <span>₹{price}</span> / seat
        </p>
      </div>

      {/* -------------------------------------------- */}
      {/* SCREEN */}
      {/* -------------------------------------------- */}

      <div className="screen">
        SCREEN
      </div>

      {/* -------------------------------------------- */}
      {/* SEAT MAP */}
      {/* -------------------------------------------- */}

      {loading ? (
        <div
          style={{
            color: "#c5a880",
            textAlign: "center",
            margin: "3rem",
          }}
        >
          Loading seat map...
        </div>
      ) : seats.length > 0 ? (
        <div className="seat-layout">

          {seatRows.map((row) => (
            <div
              className="seat-row"
              key={row}
            >

              {/* LEFT ROW LABEL */}

              <span className="row-label">
                {row}
              </span>

              {/* SEATS */}

              {seatsByRow[row].map((seat) => {
                const seatNo = seat.seatLabel;

                let seatClass = "seat available";

                if (
                  seat.status === "reserved" ||
                  reservedSeats.includes(seatNo)
                ) {
                  seatClass = "seat reserved";
                } else if (
                  seat.status === "blocked" ||
                  blockedSeats.includes(seatNo)
                ) {
                  seatClass = "seat blocked";
                } else if (
                  selectedSeats.includes(seatNo)
                ) {
                  seatClass = "seat selected";
                }

                return (
                  <div
                    key={seatNo}
                    className={seatClass}
                    onClick={() =>
                      handleSeatClick(seatNo)
                    }
                    title={seatNo}
                  >
                    {seatNo.replace(row, "")}
                  </div>
                );
              })}

              {/* RIGHT ROW LABEL */}

              <span className="row-label">
                {row}
              </span>

            </div>
          ))}

        </div>
      ) : (

        /*
         * Fallback grid when backend seat
         * data is unavailable.
         */

        <div className="seat-layout">

          {fallbackRows.map((row) => (
            <div
              className="seat-row"
              key={row}
            >

              <span className="row-label">
                {row}
              </span>

              {Array.from({
                length: 14,
              }).map((_, index) => {

                const seatNo =
                  `${row}${index + 1}`;

                let seatClass =
                  "seat available";

                if (
                  reservedSeats.includes(seatNo)
                ) {
                  seatClass =
                    "seat reserved";
                } else if (
                  blockedSeats.includes(seatNo)
                ) {
                  seatClass =
                    "seat blocked";
                } else if (
                  selectedSeats.includes(seatNo)
                ) {
                  seatClass =
                    "seat selected";
                }

                return (
                  <div
                    key={seatNo}
                    className={seatClass}
                    onClick={() =>
                      handleSeatClick(seatNo)
                    }
                    title={seatNo}
                  >
                    {index + 1}
                  </div>
                );
              })}

              <span className="row-label">
                {row}
              </span>

            </div>
          ))}

        </div>
      )}

      {/* -------------------------------------------- */}
      {/* LEGEND */}
      {/* -------------------------------------------- */}

      <div className="seat-legend">

        <div>
          <span className="legend available"></span>
          Available
        </div>

        <div>
          <span className="legend selected"></span>
          Selected
        </div>

        <div>
          <span className="legend reserved"></span>
          Reserved
        </div>

        <div>
          <span className="legend blocked"></span>
          Blocked
        </div>

      </div>

      {/* -------------------------------------------- */}
      {/* BOTTOM BAR */}
      {/* -------------------------------------------- */}

      <div className="bottom-bar">

        <div className="selected-info">

          <h3>
            {selectedSeats.length} Seats:

            <span>
              {selectedSeats.length > 0
                ? ` ${selectedSeats.join(", ")}`
                : " None"}
            </span>
          </h3>

          <p>
            Total:

            <span>
              ₹{selectedSeats.length * price}
            </span>
          </p>

        </div>

        <button
          className="continue-btn"
          disabled={
            selectedSeats.length === 0
          }
          onClick={handleContinue}
        >
          Continue →
        </button>

      </div>

      {/* -------------------------------------------- */}
      {/* LOGIN MODAL */}
      {/* -------------------------------------------- */}

      {showLogin && (
        <LoginModal
          onClose={() =>
            setShowLogin(false)
          }
          setUser={setUser}
          onLogin={
            handleLoginSuccess
          }
        />
      )}

    </div>
  );
}

export default SeatSelection;