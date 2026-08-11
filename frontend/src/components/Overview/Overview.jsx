import BookingTable from "./BookingTable";
import "./Overview.css"

function Overview(){
    return(
        <>
        <div className="overview-tab">
            <h2>All Bookings</h2>
            {/* <p>No bookings yet.</p> */}
            <BookingTable/>
        </div>
        </>
    )
}
export default Overview;