// src/pages/SignIn.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

export default function SignIn({ onClose }) {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [errors, setErrors] = useState({});
const [touched, setTouched] = useState({});
useDocumentTitle("SignIn | LegalSeg");

useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  const userString = params.get("user");

  if (token && userString) {
    try {
      const user = JSON.parse(decodeURIComponent(userString));

      localStorage.setItem("token", token);
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("user", JSON.stringify(user));

      toast.success(`Welcome ${user.username || "User"}!`);
      navigate("/dashboard");

      // clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } catch (err) {
      console.error("Error parsing user data from Google auth:", err);
      toast.error("Login failed. Please try again.");
    }
  }
}, [navigate]);



  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes gradientFlow {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }

      @keyframes pulseGlow {
        0% { box-shadow: 0 0 15px rgba(188,19,254,0.3); }
        50% { box-shadow: 0 0 25px rgba(255,0,128,0.6); }
        100% { box-shadow: 0 0 15px rgba(188,19,254,0.3); }
      }

      .email-wrapper input:focus ~ .input-gradient-border {
        opacity: 1 !important;
      }

      .password-wrapper input:focus ~ .input-gradient-border {
        opacity: 1 !important;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const handleSwitchToSignUp = () => {
    navigate('/signup');
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      navigate('/');
    }
  };

  const validateEmail = (email) => {
  if (!email) return "Email is required";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return "Please enter a valid email address";
  return "";
};

const validatePassword = (password) => {
  if (!password) return "Password is required";
  return "";
};
const handleEmailChange = (e) => {
  const value = e.target.value;
  setEmail(value);
  if (touched.email) {
    setErrors({ ...errors, email: validateEmail(value) });
  }
};

const handlePasswordChange = (e) => {
  const value = e.target.value;
  setPassword(value);
  if (touched.password) {
    setErrors({ ...errors, password: validatePassword(value) });
  }
};
const handleBlur = (field) => {
  setTouched({ ...touched, [field]: true });
  if (field === "email") setErrors({ ...errors, email: validateEmail(email) });
  if (field === "password") setErrors({ ...errors, password: validatePassword(password) });
};

const handleSignIn = async (e) => {
  e.preventDefault();

  const loginData = { email, password };

  try {
    const res = await axios.post("http://localhost:5000/api/auth/login", loginData);
    const result = res.data;

    const user = result.user || {};
    const normalizedUser = {
      name: user.fullName || user.name || "User",  // ✅ use "name"
      email: user.email,
      id: user._id || user.id,
    };

    localStorage.setItem("token", result.token);
    localStorage.setItem("user", JSON.stringify(normalizedUser));
    localStorage.setItem("isAuthenticated", "true");

    toast.success("Login successful!");
    navigate("/dashboard");
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || "Invalid credentials. Please try again.";
    toast.error(errorMessage);
  }
};
const handleGoogleSignIn = () => {
  window.location.href = "http://localhost:5000/api/auth/google";
};

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backdropFilter: "blur(10px)",
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      
        {/* X Close Button - ADD THIS */}
      <button
        onClick={handleClose}
        style={{
          position: "absolute",
          top: "15px",
          right: "15px",
          background: "rgba(255,255,255,0.1)",
          border: "1px solid rgba(255,255,255,0.3)",
          borderRadius: "50%",
          width: "35px",
          height: "35px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          color: "#fff",
          fontSize: "1.3rem",
          fontWeight: "bold",
          transition: "all 0.3s ease",
          zIndex: 10,
        }}
        onMouseEnter={(e) => {
          e.target.style.background = "rgba(255,255,255,0.2)";
          e.target.style.transform = "scale(1.1)";
        }}
        onMouseLeave={(e) => {
          e.target.style.background = "rgba(255,255,255,0.1)";
          e.target.style.transform = "scale(1)";
        }}
      >
        ✕
      </button>

       <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          width: "420px",
          padding: "40px 30px",
          borderRadius: "20px",
          background: "rgba(17,17,17,0.85)",
          color: "#fff",
          textAlign: "center",
          overflow: "hidden",
          backdropFilter: "blur(20px)",
        }}
      >
        {/* animated border */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "20px",
            padding: "2px",
            background:
              "linear-gradient(270deg, #00c6ff, #bc13fe, #ff0080, #00c6ff)",
            backgroundSize: "400% 400%",
            animation:
              "gradientFlow 10s ease infinite, pulseGlow 4s ease-in-out infinite",
            WebkitMask:
              "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            pointerEvents: "none",
          }}
        />

        <h2
          style={{
            color: "#fff",
            fontFamily: "Montserrat, sans-serif",
            marginBottom: "25px",
          }}
        >
          Login to your account
        </h2>

        {/* Email Input with Gradient Border */}
        <div className="email-wrapper" style={{ position: "relative", width: "100%", marginBottom: "25px" }}>
          <input 
  type="email" 
  placeholder="Email"
  value={email}
  onChange={handleEmailChange}
  onBlur={() => handleBlur("email")}
  style={{
    ...inputStyle,
    margin: 0,
    border: touched.email && errors.email ? "1px solid #F44336" : "none",
  }}
/>
{touched.email && errors.email && (
  <div style={{ 
    color: "#F44336", 
    fontSize: "0.8rem", 
    textAlign: "left", 
    marginTop: "5px",
    fontFamily: "Montserrat, sans-serif"
  }}>
    {errors.email}
  </div>
)}
          <div
            className="input-gradient-border"
            style={{
              position: "absolute",
              top: "-2px",
              left: "-2px",
              right: "-2px",
              bottom: "-2px",
              borderRadius: "12px",
              padding: "2px",
              background: "linear-gradient(270deg, #00c6ff, #bc13fe, #ff0080, #00c6ff)",
              backgroundSize: "400% 400%",
              animation: "gradientFlow 10s ease infinite",
              WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
              pointerEvents: "none",
              opacity: 0,
              transition: "opacity 0.3s ease",
              zIndex: 0,
            }}
          />
        </div>
        <div style={{ 
          textAlign: "right", 
          marginBottom: "5px",
          marginTop: "5px"
        }}>
          <span 
            style={{ 
              color: "#00c6ff", 
              cursor: "pointer",
              fontSize: "0.95rem",
              fontFamily: "Montserrat, sans-serif",
              transition: "color 0.3s ease"
            }}
            onClick={() => navigate('/forgot-password')}
            onMouseEnter={(e) => e.target.style.color = "#bc13fe"}
            onMouseLeave={(e) => e.target.style.color = "#00c6ff"}
          >
            Forgot Password?
          </span>
        </div>

        {/* Password Input with Gradient Border and Eye Button */}
        <div className="password-wrapper" style={{ position: "relative", width: "100%", marginBottom: "30px" }}>
          <input 
  type={showPassword ? "text" : "password"}
  placeholder="Password"
  value={password}
  onChange={handlePasswordChange}
  onBlur={() => handleBlur("password")}
  style={{
    ...inputStyle, 
    paddingRight: "45px", 
    margin: 0, 
    position: "relative", 
    zIndex: 1,
    border: touched.password && errors.password ? "1px solid #F44336" : "none",
  }}
/>

{touched.password && errors.password && (
  <div style={{ 
    color: "#F44336", 
    fontSize: "0.8rem", 
    textAlign: "left", 
    marginTop: "5px",
    fontFamily: "Montserrat, sans-serif"
  }}>
    {errors.password}
  </div>
)}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#aaa",
              fontSize: "1.2rem",
              padding: "5px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 2,
            }}
          >
            {showPassword ? "👁️" : "👁️‍🗨️"}
          </button>
          <div
            className="input-gradient-border"
            style={{
              position: "absolute",
              top: "-2px",
              left: "-2px",
              right: "-2px",
              bottom: "-2px",
              borderRadius: "12px",
              padding: "2px",
              background: "linear-gradient(270deg, #00c6ff, #bc13fe, #ff0080, #00c6ff)",
              backgroundSize: "400% 400%",
              animation: "gradientFlow 10s ease infinite",
              WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
              pointerEvents: "none",
              opacity: 0,
              transition: "opacity 0.3s ease",
              zIndex: 0,
            }}
          />
        </div>

        {/* Sign In Button */}
<button 
  onClick={handleSignIn}
  disabled={!email || !password}
  style={{
    ...waterButtonStyle, 
    marginTop: "0",
    opacity: (email && password) ? 1 : 0.5,
    cursor: (email && password) ? "pointer" : "not-allowed",
  }}
>
  Sign In
</button>

        {/* OR Divider */}
        <div style={{
          display: "flex",
          alignItems: "center",
          margin: "20px 0",
          gap: "15px"
        }}>
          <div style={{
            flex: 1,
            height: "1px",
            background: "rgba(255,255,255,0.3)"
          }}></div>
          <span style={{
            color: "#aaa",
            fontSize: "0.9rem",
            fontFamily: "Montserrat, sans-serif"
          }}>OR</span>
          <div style={{
            flex: 1,
            height: "1px",
            background: "rgba(255,255,255,0.3)"
          }}></div>
        </div>

        {/* Google Button with SVG Icon */}
        <button 
         onClick={handleGoogleSignIn}
         style={{ 
          ...waterButtonStyle, 
          marginTop: "0",
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          gap: "10px" 
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        <p
          style={{
            color: "#ccc",
            marginTop: "20px",
            fontFamily: "Montserrat, sans-serif",
          }}
        >
          New to LegalSeg?{" "}
          <span 
            style={{ color: "#00c6ff", cursor: "pointer" }}
            onClick={handleSwitchToSignUp}
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px 18px",
  borderRadius: "12px",
  border: "none",
  background: "rgba(255,255,255,0.15)",
  color: "#fff",
  fontSize: "1rem",
  outline: "none",
};

const waterButtonStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "25px",
  border: "1px solid rgba(255,255,255,0.3)",
  background: "rgba(255,255,255,0.08)",
  backdropFilter: "blur(15px)",
  WebkitBackdropFilter: "blur(15px)",
  color: "#fff",
  fontSize: "1.1rem",
  fontWeight: 600,
  cursor: "pointer",
  boxShadow:
    "inset 2px 2px 6px rgba(255,255,255,0.2), inset -2px -2px 6px rgba(0,0,0,0.5), 0 5px 20px rgba(0,0,0,0.6)",
  transition: "all 0.3s ease",
};