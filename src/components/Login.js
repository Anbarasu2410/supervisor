import React, { useState } from "react";
import api from "../api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log("🔄 Attempting login...");
      const res = await api.post("/auth/login", { email, password });
      
      console.log("✅ Login successful:", res.data);
      
      // Store token and user data
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      
      console.log("🔐 Token stored, redirecting...");
     
      
      // FIX: Redirect to the correct driver tasks route
      setTimeout(() => {
       window.location.href = "/driver/tasks";
        }, 500);
      
    } catch (err) {
      console.error("❌ Login error:", err);
     setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container" style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>🚖 Driver Login</h2>
        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label>Email</label>
            <input
              type="email"
              style={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="anbu@gmail.com"
              required
              disabled={loading}
            />
          </div>

          <div style={styles.field}>
            <label>Password</label>
            <input
              type="password"
              style={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={loading}
            />
          </div>

          {error && (
            <div style={{ 
              color: "red", 
              fontSize: "14px", 
              padding: "10px", 
              background: "#ffe6e6", 
              borderRadius: "4px",
              marginBottom: "15px"
            }}>
              {error}
            </div>
          )}

          <button 
            type="submit" 
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

          <div style={styles.footer}>
            <label>
              <input type="checkbox" disabled={loading} /> Remember me
            </label>
            <a href="#" style={{ fontSize: "13px" }}>Forgot password?</a>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    alignItems: "center",
    justifyContent: "center",
    background: "#f0f2f5",
  },
  card: {
    width: 380,
    padding: 30,
    borderRadius: 10,
    background: "white",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  },
  title: { 
    marginBottom: 20, 
    textAlign: "center",
    color: "#333"
  },
  field: { 
    marginBottom: 15, 
    display: "flex", 
    flexDirection: "column" 
  },
  input: {
    padding: "12px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "15px",
    marginTop: "5px"
  },
  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold"
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 15,
  },
};

export default Login;