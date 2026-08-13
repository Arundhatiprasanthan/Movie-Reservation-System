import React from 'react';

export default function Navbar({ user, onOpenAuth, onLogout, activeTab, setActiveTab }) {
  return (
    <header className="top-navbar">
      {/* Left Group: Logo + Nav Items (Exact spacing as Figma Images 1 & 2) */}
      <div className="nav-left-group">
        <div className="brand-logo" onClick={() => setActiveTab('films')}>
          <span className="logo-gold">CINÉ</span>
          <span className="logo-white">VAULT</span>
        </div>

        <nav>
          <ul className="nav-links">
            <li>
              <a
                href="#films"
                className={`nav-link ${activeTab === 'films' ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); setActiveTab('films'); }}
              >
                Films
              </a>
            </li>

            {user && (
              <li>
                <a
                  href="#bookings"
                  className={`nav-link ${activeTab === 'bookings' ? 'active' : ''}`}
                  onClick={(e) => { e.preventDefault(); setActiveTab('bookings'); }}
                >
                  My Bookings
                </a>
              </li>
            )}

            {user && user.role === 'ADMIN' && (
              <li>
                <a
                  href="#admin"
                  className={`nav-link ${activeTab === 'admin' ? 'active' : ''}`}
                  onClick={(e) => { e.preventDefault(); setActiveTab('admin'); }}
                >
                  Admin
                </a>
              </li>
            )}
          </ul>
        </nav>
      </div>

      {/* Right Group: User Profile when logged in OR Sign In gold pill button when logged out */}
      <div className="nav-right-group">
        {user ? (
          <div className="nav-user-section">
            <div className="user-profile-info">
              <span className="profile-name">{user.name}</span>
              <span className="profile-role-sub">
                {user.role === 'ADMIN' ? 'Administrator' : 'Member Account'}
              </span>
            </div>

            {user.role === 'ADMIN' && (
              <span className="admin-pill-badge">ADMIN</span>
            )}

            <button className="signout-link" onClick={onLogout}>
              Sign out
            </button>
          </div>
        ) : (
          <button className="nav-btn-signin" onClick={onOpenAuth}>
            Sign In
          </button>
        )}
      </div>
    </header>
  );
}
