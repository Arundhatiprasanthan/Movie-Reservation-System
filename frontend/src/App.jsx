import { Routes, Route, NavLink } from "react-router-dom";
import { useState } from "react";

import Home from "./pages/Home/Home";
import MovieDetails from "./pages/MovieDetails/MovieDetails";
import SeatSelection from "./pages/SeatSelection/SeatSelection";
import OrderSummary from "./pages/OrderSummary/OrderSummary";
import Admin from "./pages/Admin/Admin";
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin,setIsAdmin] = useState(false);

  const [user, setUser] = useState(null);

  return (
    <Routes>
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

      <Route path="/movie/:id" element={<MovieDetails />} />

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
      <Route path="/summary" element={<OrderSummary />} />
      <Route path="/admin" 
        element={isAdmin?<Admin 
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
              user={user}
              setUser={setUser}
              isAdmin={isAdmin}
              setIsAdmin={setIsAdmin}/>:<NavLink to="/"/>}/>
    </Routes>
  );
}

export default App;