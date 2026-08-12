import "./SeatSelection.css";
import { useState } from "react";
import {
  useNavigate,
  useParams,
  useLocation,
} from "react-router-dom";
import LoginModal from "../../components/LoginModal/LoginModal";
import movies from "../../data/movieData";

function SeatSelection({ isLoggedIn, setIsLoggedIn }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const movie = movies.find(
    (m) => m.id === Number(id)
  );

  const {
    theatre = "Grand Hall",
    time = "2:30 PM",
    date = "Tue, Jul 28",
    price = movie.ticketPrice,
  } = location.state || {};

  const [showLogin, setShowLogin] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState([]);

  const rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
  const cols = 14;

  const reservedSeats = [
    "B5",
    "C4",
    "D8",
    "E3",
    "F11",
    "G6",
    "H2",
  ];

  const blockedSeats = [
    "A1",
    "A2",
    "A3",
  ];

  const handleSeatClick = (seatNo) => {
    if (
      reservedSeats.includes(seatNo) ||
      blockedSeats.includes(seatNo)
    ) {
      return;
    }

    if (selectedSeats.includes(seatNo)) {
      setSelectedSeats(
        selectedSeats.filter(
          (seat) => seat !== seatNo
        )
      );
    } else {
      setSelectedSeats([
        ...selectedSeats,
        seatNo,
      ]);
    }
  };

  const bookingData = {
    movie,
    seats: selectedSeats,
    theatre,
    time,
    date,
    price,
    total: selectedSeats.length * price,
  };

  return (
    <div className="seat-page">

      <div className="movie-info">
        <h1>{movie.title}</h1>

        <p>
          {theatre} • {date} • {time} •
          <span> ₹{price}</span> / seat
        </p>
      </div>

      <div className="screen">
        SCREEN
      </div>

      <div className="seat-layout">

        {rows.map((row) => (
          <div
            className="seat-row"
            key={row}
          >

            <span className="row-label">
              {row}
            </span>

            {Array.from({
              length: cols,
            }).map((_, index) => {

              const seatNo = `${row}${index + 1}`;

              let seatClass =
                "seat available";

              if (
                reservedSeats.includes(
                  seatNo
                )
              ) {
                seatClass =
                  "seat reserved";
              } else if (
                blockedSeats.includes(
                  seatNo
                )
              ) {
                seatClass =
                  "seat blocked";
              } else if (
                selectedSeats.includes(
                  seatNo
                )
              ) {
                seatClass =
                  "seat selected";
              }

              return (
                <div
                  key={seatNo}
                  className={seatClass}
                  onClick={() =>
                    handleSeatClick(
                      seatNo
                    )
                  }
                ></div>
              );
            })}

            <span className="row-label">
              {row}
            </span>

          </div>
        ))}

      </div>

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

      <div className="bottom-bar">

        <div className="selected-info">

          <h3>
            {selectedSeats.length} Seats:
            <span>
              {selectedSeats.length
                ? " " +
                  selectedSeats.join(", ")
                : " None"}
            </span>
          </h3>

          <p>
            Total:
            <span>
              {" "}
              ₹
              {selectedSeats.length *
                price}
            </span>
          </p>

        </div>

        <button
          className="continue-btn"
          disabled={
            selectedSeats.length === 0
          }
          onClick={() => {

            if (!isLoggedIn) {

              setShowLogin(true);

            } else {

              navigate("/summary", {
                state: bookingData,
              });

            }

          }}
        >
          Continue →
        </button>

      </div>

      {showLogin && (
        <LoginModal
          onClose={() =>
            setShowLogin(false)
          }
          onLogin={() => {

            setIsLoggedIn(true);
            setShowLogin(false);

            navigate("/summary", {
              state: bookingData,
            });

          }}
        />
      )}

    </div>
  );
}

export default SeatSelection;