import { useState } from "react";
import Auth from "./components/Auth";
import AdminDashboard from "./components/AdminDashboard";

import { 
  mockMovies, 
  mockTheaters, 
  mockShowtimes, 
  initialBookings 
} from "./utils/data";

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  
  // Shared Application States
  const [movies, setMovies] = useState(mockMovies);
  const [theaters, setTheaters] = useState(mockTheaters);
  const [showtimes, setShowtimes] = useState(mockShowtimes);
  const [bookings, setBookings] = useState(initialBookings);

  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <main>
      {!currentUser ? (
        <Auth onLoginSuccess={handleLoginSuccess} />
      ) : (
        <AdminDashboard 
          user={currentUser} 
          onLogout={handleLogout}
          movies={movies}
          setMovies={setMovies}
          theaters={theaters}
          setTheaters={setTheaters}
          showtimes={showtimes}
          setShowtimes={setShowtimes}
          bookings={bookings}
          setBookings={setBookings}
        />
      )}
    </main>
  );
}
