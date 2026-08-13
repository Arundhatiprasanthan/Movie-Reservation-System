import { useState } from "react";
import { loginUser, registerUser } from "../../api/auth";
import "./LoginModal.css";

function LoginModal({
  onClose,
  onLogin,
  setUser,
  setIsAdmin,
}) {
  const [isRegister, setIsRegister] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // --------------------------------------------------
  // NORMAL LOGIN / REGISTER
  // --------------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      let res;

      // REGISTER
      if (isRegister) {
        if (!name || !email || !password) {
          setError("All fields are required");
          setLoading(false);
          return;
        }

        res = await registerUser(name, email, password);
      }

      // LOGIN
      else {
        if (!email || !password) {
          setError("Email and password are required");
          setLoading(false);
          return;
        }

        res = await loginUser(email, password);
      }

      console.log("Authentication response:", res);

      if (res && res.user) {
        setUser(res.user);
        setIsAdmin(res.user.role === "admin");

        onLogin(res.user);
      } else {
        setError(
          "Authentication failed. Invalid server response."
        );
      }
    } catch (err) {
      console.error("Authentication error:", err);

      setError(
        err.response?.data?.message ||
          "Authentication failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // DEMO LOGIN
  // --------------------------------------------------

  const handleDemoLogin = async (
    demoEmail,
    demoPassword
  ) => {
    setError("");
    setLoading(true);

    try {
      const res = await loginUser(
        demoEmail,
        demoPassword
      );

      console.log("Demo login response:", res);

      if (res && res.user) {
        setUser(res.user);
        setIsAdmin(res.user.role === "admin");

        onLogin(res.user);
      } else {
        setError(
          "Login failed. Invalid server response."
        );
      }
    } catch (err) {
      console.error("Demo login failed:", err);

      // IMPORTANT:
      // Do NOT create a fake admin/user here.
      // The backend must successfully authenticate
      // and provide a JWT token.

      setError(
        err.response?.data?.message ||
          "Demo login failed. Please check that the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="login-overlay">
      <div className="login-modal">

        <h1>
          {isRegister ? "Create Account" : "Sign In"}
        </h1>

        <div className="login-content">

          {/* TABS */}

          <div className="tabs">

            <button
              type="button"
              className={!isRegister ? "active" : ""}
              onClick={() => {
                setIsRegister(false);
                setError("");
              }}
            >
              Sign In
            </button>

            <button
              type="button"
              className={isRegister ? "active" : ""}
              onClick={() => {
                setIsRegister(true);
                setError("");
              }}
            >
              Register
            </button>

          </div>

          {/* ERROR */}

          {error && (
            <div
              className="error-message"
              style={{
                color: "#ef4444",
                fontSize: "0.875rem",
                marginBottom: "1rem",
                textAlign: "center",
              }}
            >
              {error}
            </div>
          )}

          {/* FORM */}

          <form onSubmit={handleSubmit}>

            {/* REGISTER */}

            {isRegister ? (
              <>
                <div className="form-group">
                  <label>FULL NAME</label>

                  <input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>EMAIL ADDRESS</label>

                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>PASSWORD</label>

                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="main-btn"
                  disabled={loading}
                >
                  {loading
                    ? "Processing..."
                    : "Create Account"}
                </button>
              </>
            ) : (

              /* LOGIN */

              <>
                <div className="form-group">
                  <label>EMAIL ADDRESS</label>

                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>PASSWORD</label>

                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    required
                  />
                </div>

                {/* DEMO ACCOUNTS */}

                <div className="demo-box">

                  <p>
                    Demo account — click to autofill & login
                  </p>

                  <button
                    type="button"
                    className="demo-user"
                    onClick={() =>
                     handleDemoLogin("alex@gmail.com", "Alex@123")
                    }
                    disabled={loading}
                  >
                    Member — Alex Rivera
                  </button>

                  <button
                    type="button"
                    className="demo-admin"
                    onClick={() =>
                      handleDemoLogin("morgan@gmail.com", "Morgan@123")
                    }
                    disabled={loading}
                  >
                    Admin — Morgan Adeyemi
                  </button>

                </div>

                <button
                  type="submit"
                  className="main-btn"
                  disabled={loading}
                >
                  {loading
                    ? "Signing in..."
                    : "Sign In"}
                </button>

              </>
            )}

          </form>

          {/* CANCEL */}

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