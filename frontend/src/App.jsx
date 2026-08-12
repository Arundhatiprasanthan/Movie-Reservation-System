import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import { getMe } from "./api/auth";

import Home from "./pages/Home/Home";
import MovieDetails from "./pages/MovieDetails/MovieDetails";
import SeatSelection from "./pages/SeatSelection/SeatSelection";
import OrderSummary from "./pages/OrderSummary/OrderSummary";
import Payment from "./pages/Payment/Payment";
import MyBookings from "./pages/MyBookings/MyBookings";
import Admin from "./pages/Admin/Admin";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const currentUser = await getMe();

        if (currentUser) {
          setUser(currentUser);
          setIsLoggedIn(true);
          setIsAdmin(currentUser.role === "admin");
        }
      } catch (error) {
  console.error("Failed to restore session:", error);
  console.error("Status:", error.response?.status);
  console.error("Response:", error.response?.data);

  setUser(null);
  setIsLoggedIn(false);
  setIsAdmin(false);

      } finally {
        setCheckingAuth(false);
      }
    };

    restoreSession();
  }, []);

  if (checkingAuth) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#0b0c10",
          color: "#f5f5f5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p
          style={{
            fontSize: "1.2rem",
            letterSpacing: "1px",
            color: "#c5a880",
          }}
        >
          Loading CineVault...
        </p>
      </div>
    );
  }

  return (
    <Routes>

      {/* HOME */}
      <Route
        path="/"
        element={
          <Home
            isLoggedIn={isLoggedIn}
            setIsLoggedIn={setIsLoggedIn}
            user={user}
            setUser={setUser}
            isAdmin={isAdmin}
            setIsAdmin={setIsAdmin}
          />
        }
      />

      {/* MOVIE DETAILS */}
      <Route
        path="/movie/:id"
        element={
          <MovieDetails
            isLoggedIn={isLoggedIn}
            setIsLoggedIn={setIsLoggedIn}
            user={user}
            setUser={setUser}
            isAdmin={isAdmin}
            setIsAdmin={setIsAdmin}
          />
        }
      />

      {/* SEAT SELECTION */}
      <Route
        path="/seats/:id"
        element={
          <SeatSelection
            isLoggedIn={isLoggedIn}
            setIsLoggedIn={setIsLoggedIn}
            user={user}
            setUser={setUser}
          />
        }
      />

      {/* ORDER SUMMARY */}
      <Route
        path="/summary"
        element={
          <OrderSummary
            isLoggedIn={isLoggedIn}
            user={user}
          />
        }
      />

      {/* PAYMENT */}
      <Route
        path="/payment"
        element={
          <Payment
            isLoggedIn={isLoggedIn}
            setIsLoggedIn={setIsLoggedIn}
            user={user}
            setUser={setUser}
          />
        }
      />

      {/* MY BOOKINGS */}
      <Route
        path="/my-bookings"
        element={
          <MyBookings
            isLoggedIn={isLoggedIn}
            setIsLoggedIn={setIsLoggedIn}
            user={user}
            setUser={setUser}
            isAdmin={isAdmin}
            setIsAdmin={setIsAdmin}
          />
        }
      />

      {/* ADMIN */}
      <Route
        path="/admin"
        element={
          isLoggedIn && isAdmin ? (
            <Admin
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
              user={user}
              setUser={setUser}
              isAdmin={isAdmin}
              setIsAdmin={setIsAdmin}
            />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      {/* UNKNOWN URL */}
      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />

    </Routes>
  );
}

export default App;