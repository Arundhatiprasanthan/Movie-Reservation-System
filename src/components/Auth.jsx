import { useState } from "react";
import { Film, ArrowRight } from "lucide-react";

export default function Auth({ onLoginSuccess }) {
  const [activeTab, setActiveTab] = useState("Sign In"); // "Sign In" or "Register"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Member"); // "Member" or "Administrator"
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("EMAIL ADDRESS is required.");
      return;
    }

    if (!name) {
      setError("FULL NAME is required.");
      return;
    }

    if (role === "Member") {
      setError("Member portal is currently disabled. Please sign in as an Administrator.");
      return;
    }
    
    // Log in as administrator
    const userData = {
      name: name || "Nandini",
      email: email,
      role: "Administrator"
    };
    
    onLoginSuccess(userData);
  };

  return (
    <div className="auth-container animate-fade-in" style={styles.container}>
      <div className="premium-card" style={styles.formCard}>
        {/* Title */}
        <h1 style={styles.cardHeading}>Create Account</h1>
        
        {/* Tab switcher: Sign In vs Register */}
        <div style={styles.tabSwitcherContainer}>
          <button 
            type="button" 
            style={{
              ...styles.tabBtn,
              ...(activeTab === "Sign In" ? styles.tabBtnActive : styles.tabBtnInactive)
            }}
            onClick={() => { setActiveTab("Sign In"); setError(""); }}
          >
            Sign In
          </button>
          <button 
            type="button" 
            style={{
              ...styles.tabBtn,
              ...(activeTab === "Register" ? styles.tabBtnActive : styles.tabBtnInactive)
            }}
            onClick={() => { setActiveTab("Register"); setError(""); }}
          >
            Register
          </button>
        </div>

        {error && <div style={styles.errorAlert}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ marginTop: "24px" }}>
          {/* Full Name field */}
          <div className="form-group">
            <label className="form-label" style={styles.label}>FULL NAME</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Your name" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          {/* Email field */}
          <div className="form-group">
            <label className="form-label" style={styles.label}>EMAIL ADDRESS</label>
            <input 
              type="email" 
              className="form-input" 
              placeholder="you@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          {/* Account Role Selector */}
          <div className="form-group" style={{ marginBottom: "28px" }}>
            <label className="form-label" style={styles.label}>ACCOUNT ROLE</label>
            <div style={styles.roleToggleContainer}>
              <button 
                type="button" 
                style={{
                  ...styles.roleBtn,
                  ...(role === "Member" ? styles.roleBtnActive : styles.roleBtnInactive)
                }}
                onClick={() => setRole("Member")}
              >
                Member
              </button>
              <button 
                type="button" 
                style={{
                  ...styles.roleBtn,
                  ...(role === "Administrator" ? styles.roleBtnActive : styles.roleBtnInactive)
                }}
                onClick={() => setRole("Administrator")}
              >
                Administrator
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn-primary" style={styles.submitBtn}>
            <span>Create Account</span>
          </button>

          {/* Cancel link */}
          <div style={styles.cancelContainer}>
            <a href="#" onClick={(e) => { e.preventDefault(); setError(""); }} style={styles.cancelLink}>Cancel</a>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    width: "100vw",
    backgroundColor: "#08080c",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px"
  },
  formCard: {
    width: "100%",
    maxWidth: "460px",
    padding: "44px 36px",
    backgroundColor: "#11111a",
    border: "1px solid #1c1c2b",
    borderRadius: "24px",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.6)"
  },
  cardHeading: {
    fontSize: "36px",
    color: "#ffffff",
    textAlign: "left",
    fontFamily: "var(--font-serif)",
    fontWeight: "700",
    marginBottom: "28px"
  },
  tabSwitcherContainer: {
    display: "flex",
    backgroundColor: "#0d0d14",
    border: "1px solid #1c1c2b",
    borderRadius: "10px",
    padding: "4px",
    marginBottom: "28px"
  },
  tabBtn: {
    flex: 1,
    padding: "12px 0",
    border: "none",
    borderRadius: "8px",
    fontFamily: "var(--font-sans)",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
    transition: "all 0.25s ease",
    textAlign: "center"
  },
  tabBtnActive: {
    backgroundColor: "#d97706",
    color: "#000000"
  },
  tabBtnInactive: {
    backgroundColor: "transparent",
    color: "#52526b"
  },
  label: {
    fontSize: "11px",
    fontWeight: "600",
    color: "#52526b",
    letterSpacing: "0.1em",
    marginBottom: "8px"
  },
  input: {
    backgroundColor: "#0a0a0f",
    border: "1px solid #1c1c2b",
    borderRadius: "8px",
    padding: "14px 16px",
    color: "#ffffff",
    fontSize: "14px",
    transition: "all 0.2s ease"
  },
  roleToggleContainer: {
    display: "flex",
    backgroundColor: "#0d0d14",
    border: "1px solid #1c1c2b",
    borderRadius: "10px",
    padding: "4px"
  },
  roleBtn: {
    flex: 1,
    padding: "12px 0",
    border: "none",
    borderRadius: "8px",
    fontFamily: "var(--font-sans)",
    fontWeight: "600",
    fontSize: "13px",
    cursor: "pointer",
    transition: "all 0.25s ease",
    textAlign: "center"
  },
  roleBtnActive: {
    backgroundColor: "#d97706",
    color: "#000000"
  },
  roleBtnInactive: {
    backgroundColor: "transparent",
    color: "#52526b"
  },
  submitBtn: {
    backgroundColor: "#d97706",
    color: "#000000",
    fontWeight: "700",
    fontSize: "15px",
    padding: "14px",
    borderRadius: "12px",
    boxShadow: "0 6px 20px rgba(217, 119, 6, 0.2)"
  },
  cancelContainer: {
    marginTop: "20px",
    textAlign: "center"
  },
  cancelLink: {
    color: "#52526b",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "500",
    transition: "color 0.2s ease"
  },
  errorAlert: {
    background: "rgba(239, 68, 68, 0.08)",
    border: "1px solid #ef4444",
    color: "#f87171",
    padding: "12px 16px",
    borderRadius: "8px",
    fontSize: "13px",
    lineHeight: "1.4",
    marginBottom: "16px"
  }
};
