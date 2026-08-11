import { useState } from "react";
import "./LoginModal.css";

function LoginModal({ onClose, onLogin, setUser, setIsAdmin }) {
  const [isRegister, setIsRegister] = useState(false);

  return (
    <div className="login-overlay">
      <div className="login-modal">

        <h1>{isRegister ? "Create Account" : "Sign In"}</h1>

        <div className="login-content">

          {/* Tabs */}
          <div className="tabs">
            <button
              type="button"
              className={!isRegister ? "active" : ""}
              onClick={() => setIsRegister(false)}
            >
              Sign In
            </button>

            <button
              type="button"
              className={isRegister ? "active" : ""}
              onClick={() => setIsRegister(true)}
            >
              Register
            </button>
          </div>

          {/* Register Form */}
          {isRegister ? (
            <>
              <div className="form-group">
                <label>FULL NAME</label>
                <input
                  type="text"
                  placeholder="Your name"
                />
              </div>

              <div className="form-group">
                <label>EMAIL ADDRESS</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                />
              </div>

              <div className="form-group">
                <label>ACCOUNT ROLE</label>

                <div className="role-box">
                  <button
                    type="button"
                    className="member active"
                  >
                    Member
                  </button>
                </div>
              </div>

              <button
                className="main-btn"
                onClick={onLogin}
              >
                Create Account
              </button>
            </>
          ) : (
            <>
              <div className="form-group">
                <label>EMAIL ADDRESS</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                />
              </div>

              <div className="form-group">
                <label>PASSWORD</label>
                <input
                  type="password"
                  placeholder="••••••••"
                />
              </div>

              <div className="demo-box">
                <p>Demo account — click to autofill</p>

                <button
                  type="button"
                  className="demo-user"
                  onClick={() => {
                    setUser({
                      name: "Alex Rivera",
                      role: "Member",
                    });

                    setIsAdmin(false);
                    onLogin();
                  }}
                >
                  Member — Alex Rivera
                </button>
                <button
                  type="button"
                  className="demo-admin"
                  onClick={() => {
                    setUser({
                      name: "Morgan Adeyemi",
                      role: "Admin",
                    });

                    setIsAdmin(true);
                    onLogin();
                  }}
                >
                  Admin - Morgan Adeyemi
                </button>
              </div>

<button
  className="main-btn"
  onClick={() => {
    setUser({
      name: "Alex Rivera",
      role: "Member",
    });
    setIsAdmin(false);
    onLogin();
  }}
>
  {isRegister ? "Create Account" : "Sign In"}
</button>
            </>
          )}

          <button
            type="button"
            className="cancel-btn"
            onClick={onClose}
          >
            Cancel
          </button>

        </div>

      </div>
    </div>
  );
}

export default LoginModal;