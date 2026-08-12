import { useLocation, useNavigate } from "react-router-dom";
import "./OrderSummary.css";

function OrderSummary() {

    const navigate = useNavigate();

    const { state } = useLocation();

    const { movie, seats, theatre, time, date } = state;

    const subtotal = seats.length * movie.ticketPrice;

    const convenienceFee = 50;

    const gst = Math.round(subtotal * 0.18);

    const total = subtotal + convenienceFee + gst;

    return (

        <div className="summary-page">

            <h1>Booking Summary</h1>

            <div className="summary-card">

                <img
                    src={movie.poster}
                    alt={movie.title}
                />

                <div className="summary-details">

                    <h2>{movie.title}</h2>

                    <p>{movie.genre}</p>

                    <p>{date}</p>

                    <p>{time}</p>

                    <p>{theatre}</p>

                    <p>
                        Seats:
                        <span>{seats.join(", ")}</span>
                    </p>

                </div>

            </div>

            <div className="price-box">

                <div>
                    <span>Tickets</span>

                    <span>₹{subtotal}</span>
                </div>

                <div>
                    <span>Convenience Fee</span>

                    <span>₹50</span>
                </div>

                <div>
                    <span>GST</span>

                    <span>₹{gst}</span>
                </div>

                <hr />

                <div className="total">

                    <span>Total</span>

                    <span>₹{total}</span>

                </div>

            </div>

            <button
                className="pay-btn"
                onClick={() => navigate("/payment")}
            >
                Proceed to Payment →
            </button>

        </div>

    );

}

export default OrderSummary;