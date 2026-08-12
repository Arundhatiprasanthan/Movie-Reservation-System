import { NavLink, useNavigate } from "react-router-dom";
import { logoutUser } from "../../api/auth";
import "./Navbar.css";

function Navbar({
  isLoggedIn,
  user,
  setIsLoggedIn,
  setUser,
  onSignIn,
  isAdmin,
  setIsAdmin,
}) {
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    setIsLoggedIn(false);
    setUser(null);
    setIsAdmin(false);
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="navbar-container">

        {/* Left Side */}
        <div className="nav-left">

          <h2 className="logo" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
            <span className="gold">CINÉ</span>VAULT
          </h2>

          <nav>
            <NavLink
              to="/"
              end
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Films
            </NavLink>

            {isLoggedIn && (
              <NavLink
                to="/my-bookings"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                My Bookings
              </NavLink>
            )}

            {isAdmin && (
              <NavLink
                to="/admin"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Admin Dashboard
              </NavLink>
            )}
          </nav>

        </div>

        {/* Right Side */}
        <div className="nav-right">

          {!isLoggedIn ? (

            <button
              className="signin-btn"
              onClick={onSignIn}
            >
              Sign In
            </button>

          ) : (

            <div className="nav-user">

              <div className="user-profile">

                <div className="avatar">
                  {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>

                <div className="user-text">
                  <h4>{user?.name || "Member"}</h4>
                  <p>{user?.role === "admin" ? "Admin" : "Member"}</p>
                </div>

              </div>

              <button
                className="logout-btn"
                onClick={handleLogout}
              >
                Sign Out
              </button>

            </div>

          )}

        </div>

      </div>
    </header>
  );
}

export default Navbar;