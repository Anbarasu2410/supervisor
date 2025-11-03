import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
   
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Immediate client-side validation
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    
    if (!email.includes('@')) {
      setError("Please enter a valid email address");
      return;
    }
    
    setError("");
    setLoading(true);

    try {
      console.log("🔄 Attempting login...");
      
      // Create AbortController for timeout
      // const controller = new AbortController();
      // const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      // Make API call with timeout
      const res = await api.post("/auth/login", 
        { email, password },
        { 
          // signal: controller.signal,
          // timeout: 10000 // Additional axios timeout
        }
      );
      
      //clearTimeout(timeoutId);
      
      console.log("✅ Login successful:", res.data);
      
     
      // Immediate storage
       localStorage.setItem("token", res.data.token);
       localStorage.setItem("user", JSON.stringify(res.data.user));
      
      // Instant redirect - remove any delays
      //window.location.href = "/driver/tasks";
      navigate("/driver/tasks");
      
    } catch (err) {
      console.error("❌ Login error:", err);
      
      let errorMessage = "Login failed. Please try again.";
      
      // Handle different error types
      if (err.name === 'AbortError' || err.code === 'ECONNABORTED') {
        errorMessage = "Request timeout. Please check your connection and try again.";
      } else if (err.response?.status === 401) {
        errorMessage = "Invalid email or password";
      } else if (err.response?.status === 400) {
        errorMessage = "Invalid request. Please check your input.";
      } else if (err.response?.status >= 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (!navigator.onLine) {
        errorMessage = "No internet connection. Please check your network.";
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container" style={styles.container}>
      <div style={styles.card}>
        {/* Header Section */}
        <div style={styles.header}>
          <h1 style={styles.title}>Driver Login</h1>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              style={{
                ...styles.input,
                ...(loading ? styles.inputDisabled : {})
              }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              placeholder="Enter your email"
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <div style={styles.passwordContainer}>
              <input
                type={showPassword ? "text" : "password"}
                style={{
                  ...styles.passwordInput,
                  ...(loading ? styles.inputDisabled : {})
                }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                placeholder="Enter your password"
              />
              <button
                type="button"
                style={{
                  ...styles.eyeButton,
                  ...(loading ? styles.buttonDisabled : {})
                }}
                onClick={togglePasswordVisibility}
                disabled={loading}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          {error && (
            <div style={styles.error}>
              {error}
            </div>
          )}

          {/* Divider Line */}
          <div style={styles.divider}></div>

          <button 
            type="submit" 
            style={{
              ...styles.button,
              ...(loading ? styles.buttonLoading : {}),
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
            disabled={loading}
          >
            {loading ? (
              <div style={styles.loadingContent}>
                <div style={styles.spinner}></div>
                Signing In...
              </div>
            ) : (
              "Sign In"
            )}
          </button>

          <div style={styles.footer}>
            <label style={{
              ...styles.rememberMe,
              ...(loading ? styles.labelDisabled : {})
            }}>
              <input 
                type="checkbox" 
                style={{
                  ...styles.checkbox,
                  ...(loading ? styles.inputDisabled : {})
                }} 
                disabled={loading} 
              /> 
              <span style={styles.rememberText}>Remember me</span>
            </label>
            <a 
              href="/forgot-password" 
              style={{
                ...styles.forgotLink,
                ...(loading ? styles.linkDisabled : {})
              }}
              onClick={(e) => loading && e.preventDefault()}
            >
              Forgot password?
            </a>
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
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    fontFamily: "Arial, sans-serif",
  },
  card: {
    width: 380,
    padding: 25,
    borderRadius: 12,
    background: "white",
    boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
  },
  header: {
    textAlign: "center",
    marginBottom: 15,
  },
  title: { 
    color: "#333",
    fontSize: "24px",
    fontWeight: "bold",
    margin: 0,
    padding: 0,
  },
  field: { 
    marginBottom: 12,
    display: "flex", 
    flexDirection: "column" 
  },
  label: {
    marginBottom: 4,
    fontWeight: "600",
    color: "#333",
    fontSize: "13px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  input: {
    padding: "10px",
    border: "2px solid #e1e1e1",
    borderRadius: "6px",
    fontSize: "15px",
    outline: "none",
    transition: "all 0.3s ease",
    backgroundColor: "#fafafa",
  },
  inputDisabled: {
    backgroundColor: "#f8f8f8",
    borderColor: "#e8e8e8",
    color: "#aaa",
    cursor: "not-allowed",
  },
  passwordContainer: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  passwordInput: {
    padding: "10px 40px 10px 10px",
    border: "2px solid #e1e1e1",
    borderRadius: "6px",
    fontSize: "15px",
    width: "100%",
    outline: "none",
    transition: "all 0.3s ease",
    backgroundColor: "#fafafa",
  },
  eyeButton: {
    position: "absolute",
    right: "10px",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "15px",
    padding: "0",
    width: "22px",
    height: "22px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.6,
    transition: "all 0.3s ease",
    borderRadius: "50%",
  },
  buttonDisabled: {
    opacity: 0.4,
    cursor: "not-allowed",
  },
  divider: {
    height: "1px",
    background: "#e1e1e1",
    margin: "6px 0",
  },
  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "bold",
    transition: "all 0.3s ease",
    marginBottom: "8px",
    position: "relative",
  },
  buttonLoading: {
    backgroundColor: "#66a8ff",
    color: "#ffffff",
  },
  loadingContent: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
  spinner: {
    width: "16px",
    height: "16px",
    border: "2px solid rgba(255,255,255,0.5)",
    borderTop: "2px solid white",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "13px",
  },
  rememberMe: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    cursor: "pointer",
    color: "#666",
  },
  labelDisabled: {
    color: "#ccc",
    cursor: "not-allowed",
  },
  checkbox: {
    margin: 0,
    width: "14px",
    height: "14px",
    cursor: "pointer",
  },
  rememberText: {
    fontSize: "13px",
    color: "#666",
  },
  forgotLink: {
    fontSize: "13px",
    color: "#007bff",
    textDecoration: "none",
    fontWeight: "500",
    transition: "color 0.3s ease",
  },
  linkDisabled: {
    color: "#ccc",
    pointerEvents: "none",
  },
  error: {
    color: "#d32f2f",
    fontSize: "13px",
    padding: "8px",
    background: "#ffebee",
    borderRadius: "4px",
    marginBottom: "8px",
    textAlign: "center",
    border: "1px solid #ffcdd2",
  },
};

// Add CSS for spinner animation
const spinnerStyle = document.createElement('style');
spinnerStyle.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(spinnerStyle);

export default Login;