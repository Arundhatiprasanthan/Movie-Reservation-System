import { NavLink, useNavigate } from "react-router-dom";
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
  return (
    <header className="navbar">
      <div className="navbar-container">

        {/* Left Side */}
        <div className="nav-left">

          <h2 className="logo">
            <span className="gold">CINÉ</span>VAULT
          </h2>

          <nav>
            <NavLink
            to="/"
            end
            className={({isActive})=> isActive?"active":""}
            >
              Films
            </NavLink>

            {isLoggedIn &&(
              <NavLink
                to="/bookings"
                className={({ isActive }) =>
                isActive ? "active" : ""
                }
              >
                My Bookings
              </NavLink>
            )}

            {isAdmin && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                isActive ? "active" : ""
                }
              >
                Admin
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
                  {user?.name?.charAt(0)}
                </div>

                <div className="user-text">
                  <h4>{user?.name}</h4>
                  <p>{user?.role}</p>
                </div>

              </div>

              <button
                className="logout-btn"
                onClick={() => {
                  setIsLoggedIn(false);
                  setUser(null);
                  setIsAdmin(false);
                  navigate("/");
                }}
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