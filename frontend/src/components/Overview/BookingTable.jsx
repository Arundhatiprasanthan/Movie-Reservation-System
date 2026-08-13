import "./BookingTable.css";
import bookings from "../../data/bookingData";

function BookingTable() {
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>REFERENCE</th>
            <th>FILM</th>
            <th>CUSTOMER</th>
            <th>SEATS</th>
            <th>TOTAL</th>
            <th>STATUS</th>
          </tr>
        </thead>

        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id}>
                <td className="booking-refrence">{booking.reference}</td>
                <td className="booking-title">{booking.title}</td>
                <td>{booking.customer}</td>
                <td>{booking.seats}</td>
                <td className="booking-total">{booking.total}</td>
                <td className={`status ${booking.status}`}>{booking.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BookingTable;