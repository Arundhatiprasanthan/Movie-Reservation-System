import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import AdminTabs from "../../components/AdminTabs/AdminTabs";
import Overview from "../../components/Overview/Overview";
import MoviesTab from "../../components/AdminTabs/MoviesTab";
import TheatersTab from "../../components/AdminTabs/TheatersTab";
import ShowtimesTab from "../../components/AdminTabs/ShowtimesTab";
import UsersTab from "../../components/AdminTabs/UsersTab";
import { fetchAdminBookingStats } from "../../api/bookings";
import { fetchAdminMovies } from "../../api/movies";
import { fetchAdminTheaters } from "../../api/theaters";
import "./Admin.css";

function Admin({ isLoggedIn, setIsLoggedIn, user, setUser, isAdmin, setIsAdmin }) {
  const [activeTab, setActiveTab] = useState("Overview");
  const [liveStats, setLiveStats] = useState([
    { title: "Films", value: "—" },
    { title: "Theaters", value: "—" },
    { title: "Confirmed Bookings", value: "—" },
    { title: "Total Revenue", value: "—" },
  ]);

  useEffect(() => {
    async function loadHeaderStats() {
      try {
        const [stats, movies, theaters] = await Promise.all([
          fetchAdminBookingStats(),
          fetchAdminMovies(),
          fetchAdminTheaters(),
        ]);
        setLiveStats([
          { title: "Films", value: String((movies || []).length) },
          { title: "Theaters", value: String((theaters || []).length) },
          { title: "Confirmed Bookings", value: String(stats?.totalBookings || 0) },
          { title: "Revenue", value: `₹${((stats?.totalRevenue || 0) / 1000).toFixed(1)}k` },
        ]);
      } catch (e) {
        console.warn("Could not load admin stats:", e.message);
      }
    }
    loadHeaderStats();
  }, []);

  return (
    <>
      <Navbar
        isLoggedIn={isLoggedIn}
        user={user}
        setUser={setUser}
        setIsLoggedIn={setIsLoggedIn}
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
      />

      <div className="admin-box">
        <div className="admin-heading">
          <h1>Admin Dashboard</h1>
          <span>Administrator</span>
        </div>

        {/* Live stat cards */}
        <div className="dashboard-cards">
          {liveStats.map((card, index) => (
            <div key={index} className="stat-card-wrapper">
              <p className="stat-label">{card.title}</p>
              <h2 className="stat-value">{card.value}</h2>
            </div>
          ))}
        </div>

        <AdminTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === "Overview"   && <Overview />}
        {activeTab === "Movies"     && <MoviesTab />}
        {activeTab === "Theaters"   && <TheatersTab />}
        {activeTab === "Showtimes"  && <ShowtimesTab />}
        {activeTab === "Users"      && <UsersTab />}
      </div>
    </>
  );
}

export default Admin;
