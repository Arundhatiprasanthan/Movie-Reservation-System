import Navbar from "../../components/Navbar/Navbar";
import StatCard from "../../components/StatCard/StatCard";
import { useState } from "react";
import AdminTabs from "../../components/AdminTabs/AdminTabs";
import Overview from "../../components/Overview/Overview";
import "./Admin.css";

const stats = [
  {
    title: "Films",
    value: "6",
  },
  {
    title: "Theaters",
    value: "3",
  },
  {
    title: "Confirmed bookings",
    value: "1",
  },
  {
    title: "Revenue",
    value: "$14.7",
  },
];

function Admin({
  isLoggedIn,
  setIsLoggedIn,
  user,
  setUser,
  isAdmin,
  setIsAdmin,
}) {
  const [activeTab, setActiveTab] = useState("Overview");
  const [AdminData, seAdminData] = useState(null);
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
        <div className="dashboard-cards">
          {stats.map((card, index) => (
            <StatCard
              key={index}
              title={card.title}
              value={card.value}
            />
          ))}
        </div>
        <AdminTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {activeTab === "Overview" && (
        <Overview Admin={AdminData} />
      )}

      {/* {activeTab === "Movies" && (
        <Movies Admin={AdminData} />
      )}

      {activeTab === "Theaters" && (
        <Theaters Admin={AdminData} />
      )}

      {activeTab === "Showtimes" && (
        <Showtimes Admin={AdminData} />
      )} */}
      </div>
    </>
  );
}
export default Admin;
