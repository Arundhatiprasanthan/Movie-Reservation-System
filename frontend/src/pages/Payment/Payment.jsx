import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import LoginModal from "../../components/LoginModal/LoginModal";
import { createBooking } from "../../api/bookings";
import "./Payment.css";

function Payment({
  isLoggedIn,
  setIsLoggedIn,
  user,
  setUser,
  isAdmin,
  setIsAdmin,
}) {
  const navigate = useNavigate();
  const { state } = useLocation();

  const [showLogin, setShowLogin] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");

  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState(user?.name || "");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [upiId, setUpiId] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmedBooking, setConfirmedBooking] = useState(null);


  const bookingState = state || {};

  const {
    showtimeId,
    movie,
    seats = [],
    theatre = "Grand Hall",
    time = "2:30 PM",
    date = "Today",
    price = 350,
  } = bookingState;


  const ticketPrice = Number(price) || 350;

  const subtotal = seats.length * ticketPrice;

  const convenienceFee = 50;

  const gst = Math.round(subtotal * 0.18);

  const total = subtotal + convenienceFee + gst;


  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    setError("");


    if (!isLoggedIn) {
      setShowLogin(true);
      return;
    }

  
    if (!showtimeId) {
      setError(
        "Showtime information is missing. Please go back and select a showtime again."
      );
      return;
    }

    if (!seats || seats.length === 0) {
      setError("Please select at least one seat.");
      return;
    }

    setLoading(true);

    try {

      const response = await createBooking(showtimeId, seats);

      console.log("Booking response:", response);

      if (!response || !response.booking) {
        throw new Error("Booking was not created by the server.");
      }


      setConfirmedBooking(response.booking);
    } catch (err) {
      console.error("Booking failed:", err);

      const message =
        err.response?.data?.message ||
        err.message ||
        "Payment/booking failed. Please try again.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };


  if (!state || !movie || seats.length === 0) {
    return (
      <div
        className="payment-page"
        style={{
          textAlign: "center",
          paddingTop: "6rem",
        }}
      >
        <h2>Invalid Booking</h2>

        <p style={{ marginTop: "1rem" }}>
          Please select a movie and seats before proceeding to payment.
        </p>

        <button
          className="pay-submit-btn"
          style={{ marginTop: "2rem" }}
          onClick={() => navigate("/")}
        >
          Return to Films
        </button>
      </div>
    );
  }

  /*
   * If booking is confirmed
   */
  if (confirmedBooking) {
    return (
      <div className="payment-page">
        <Navbar
          isLoggedIn={isLoggedIn}
          user={user}
          setUser={setUser}
          setIsLoggedIn={setIsLoggedIn}
          onSignIn={() => setShowLogin(true)}
          isAdmin={isAdmin}
          setIsAdmin={setIsAdmin}
        />

        <div className="modal-overlay">
          <div className="ticket-modal">
            <div className="success-badge">✓</div>

            <h2
              style={{
                color: "#ffffff",
                marginBottom: "0.5rem",
              }}
            >
              Booking Confirmed!
            </h2>

            <p
              style={{
                color: "#a0a5b5",
                fontSize: "0.9rem",
              }}
            >
              Your seats have been successfully reserved.
            </p>

            <div className="ticket-code">
              {confirmedBooking.bookingId}
            </div>

            <div className="qr-box">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                  confirmedBooking.bookingId
                )}`}
                alt="Ticket QR Code"
              />
            </div>

            <p
              style={{
                color: "#c5a880",
                fontWeight: "600",
                fontSize: "0.95rem",
              }}
            >
              {seats.join(", ")} • {theatre}
            </p>

            <p
              style={{
                color: "#a0a5b5",
                marginTop: "0.5rem",
              }}
            >
              Total Paid: ₹{total}
            </p>

            <div className="modal-actions">
              <button
                className="modal-btn-primary"
                onClick={() => navigate("/my-bookings")}
              >
                View My Bookings
              </button>

              <button
                className="modal-btn-secondary"
                onClick={() => navigate("/")}
              >
                Return to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <Navbar
        isLoggedIn={isLoggedIn}
        user={user}
        setUser={setUser}
        setIsLoggedIn={setIsLoggedIn}
        onSignIn={() => setShowLogin(true)}
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
      />

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

      <div className="payment-container">
        <h1 className="payment-title">
          Checkout & Payment
        </h1>

        <div className="payment-grid">

          {/* LEFT COLUMN */}

          <div className="payment-methods">

            <div className="method-tabs">

              <button
                type="button"
                className={`method-tab ${
                  paymentMethod === "card" ? "active" : ""
                }`}
                onClick={() => setPaymentMethod("card")}
              >
                💳 Credit / Debit Card
              </button>

              <button
                type="button"
                className={`method-tab ${
                  paymentMethod === "upi" ? "active" : ""
                }`}
                onClick={() => setPaymentMethod("upi")}
              >
                📱 UPI / GPay
              </button>

              <button
                type="button"
                className={`method-tab ${
                  paymentMethod === "netbanking"
                    ? "active"
                    : ""
                }`}
                onClick={() => setPaymentMethod("netbanking")}
              >
                🏦 Net Banking
              </button>

            </div>

            {error && (
              <p
                style={{
                  color: "#ef4444",
                  marginBottom: "1rem",
                }}
              >
                {error}
              </p>
            )}

            <form
              onSubmit={handlePaymentSubmit}
              className="payment-form"
            >

              {/* CARD */}

              {paymentMethod === "card" && (
                <>
                  <div className="form-group">
                    <label>CARD NUMBER</label>

                    <input
                      type="text"
                      placeholder="4532 •••• •••• 8921"
                      value={cardNumber}
                      onChange={(e) =>
                        setCardNumber(e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>CARDHOLDER NAME</label>

                    <input
                      type="text"
                      placeholder="Name on card"
                      value={cardHolder}
                      onChange={(e) =>
                        setCardHolder(e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="form-row">

                    <div className="form-group">
                      <label>EXPIRY DATE</label>

                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={expiry}
                        onChange={(e) =>
                          setExpiry(e.target.value)
                        }
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>CVV / CVC</label>

                      <input
                        type="password"
                        placeholder="•••"
                        maxLength="4"
                        value={cvv}
                        onChange={(e) =>
                          setCvv(e.target.value)
                        }
                        required
                      />
                    </div>

                  </div>
                </>
              )}

              {/* UPI */}

              {paymentMethod === "upi" && (
                <div className="form-group">

                  <label>
                    VIRTUAL PAYMENT ADDRESS
                    (VPA / UPI ID)
                  </label>

                  <input
                    type="text"
                    placeholder="yourname@upi"
                    value={upiId}
                    onChange={(e) =>
                      setUpiId(e.target.value)
                    }
                    required
                  />

                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: "#a0a5b5",
                      marginTop: "0.25rem",
                    }}
                  >
                    Enter your UPI ID to continue.
                  </span>

                </div>
              )}

              {/* NET BANKING */}

              {paymentMethod === "netbanking" && (
                <div className="form-group">

                  <label>
                    SELECT YOUR BANK
                  </label>

                  <select defaultValue="hdfc">

                    <option value="hdfc">
                      HDFC Bank
                    </option>

                    <option value="icici">
                      ICICI Bank
                    </option>

                    <option value="sbi">
                      State Bank of India
                    </option>

                    <option value="axis">
                      Axis Bank
                    </option>

                    <option value="kotak">
                      Kotak Mahindra
                    </option>

                  </select>

                </div>
              )}

              <button
                type="submit"
                className="pay-submit-btn"
                disabled={loading}
              >
                {loading
                  ? "Processing Booking..."
                  : `Pay ₹${total} & Confirm Booking`}
              </button>

            </form>
          </div>

          {/* RIGHT COLUMN */}

          <div className="order-recap">

            <div className="recap-header">

              <h3>{movie.title}</h3>

              <p>📍 {theatre}</p>

              <p>
                📅 {date} at {time}
              </p>

            </div>

            <div className="recap-item">
              <span>Seats Selected</span>

              <span
                style={{
                  color: "#c5a880",
                  fontWeight: "600",
                }}
              >
                {seats.join(", ")}
              </span>
            </div>

            <div className="recap-item">
              <span>Tickets Subtotal</span>
              <span>₹{subtotal}</span>
            </div>

            <div className="recap-item">
              <span>Convenience Fee</span>
              <span>₹{convenienceFee}</span>
            </div>

            <div className="recap-item">
              <span>GST (18%)</span>
              <span>₹{gst}</span>
            </div>

            <div className="recap-item total">
              <span>Total Payable</span>
              <span>₹{total}</span>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default Payment;