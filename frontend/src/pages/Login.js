// src/pages/Login.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useDocumentTitle} from "../hooks/useDocumentTitle";


export default function Login() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const navigate = useNavigate();
  useDocumentTitle("Signup | LegalSeg");

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

      .input-wrapper input:focus ~ .input-gradient-border {
        opacity: 1 !important;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Validation Functions
  const validateFullName = (name) => {
    if (!name.trim()) return "Full name is required";
    if (name.trim().length < 2) return "Name must be at least 2 characters";
    if (!/^[a-zA-Z\s]+$/.test(name)) return "Name can only contain letters and spaces";
    return "";
  };

  const validateEmail = (email) => {
    if (!email) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };

  const validatePassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    if (!/[A-Z]/.test(password)) return "Password must contain an uppercase letter";
    if (!/[a-z]/.test(password)) return "Password must contain a lowercase letter";
    if (!/[0-9]/.test(password)) return "Password must contain a number";
    if (!/[!@#$%^&*]/.test(password)) return "Password must contain a special character (!@#$%^&*)";
    return "";
  };

  const validateConfirmPassword = (confirmPass) => {
    if (!confirmPass) return "Please confirm your password";
    if (confirmPass !== password) return "Passwords do not match";
    return "";
  };

  // Password Strength Calculator
  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[!@#$%^&*]/.test(password)) strength++;
    
    if (strength <= 2) return { label: "Weak", color: "#F44336" };
    if (strength <= 4) return { label: "Medium", color: "#FF9800" };
    return { label: "Strong", color: "#4CAF50" };
  };

  // Handle Field Changes
  const handleFullNameChange = (e) => {
    const value = e.target.value;
    setFullName(value);
    if (touched.fullName) {
      setErrors({ ...errors, fullName: validateFullName(value) });
    }
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
    if (touched.confirmPassword && confirmPassword) {
      setErrors({ ...errors, confirmPassword: value !== confirmPassword ? "Passwords do not match" : "" });
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    if (touched.confirmPassword) {
      setErrors({ ...errors, confirmPassword: validateConfirmPassword(value) });
    }
  };

  // Handle Blur (Mark as touched)
  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
    
    if (field === "fullName") setErrors({ ...errors, fullName: validateFullName(fullName) });
    if (field === "email") setErrors({ ...errors, email: validateEmail(email) });
    if (field === "password") setErrors({ ...errors, password: validatePassword(password) });
    if (field === "confirmPassword") setErrors({ ...errors, confirmPassword: validateConfirmPassword(confirmPassword) });
  };

  // Check if form is valid
  const isFormValid = () => {
    return (
      fullName.trim() &&
      !validateFullName(fullName) &&
      email &&
      !validateEmail(email) &&
      password &&
      !validatePassword(password) &&
      confirmPassword &&
      !validateConfirmPassword(confirmPassword)
    );
  };

  const handleClose = () => {
    navigate('/');
  };

  const handleSwitchToSignIn = () => {
    navigate('/signin');
  };

const handleSignUp = async (e) => { 
  e.preventDefault();
  const userData = { name: fullName, email, password }; // your form states
  try {
    const response = await axios.post("http://localhost:5000/api/auth/register", userData);
    const result = response.data;

    localStorage.setItem("user", JSON.stringify(result.user));
    localStorage.setItem("token", result.token);
    navigate("/dashboard");
  } catch (err) {
    toast.success("Signup failed: " + err.message);
  }
};



const handleGoogleSignUp = () => {
  window.location.href = "http://localhost:5000/api/auth/google";
};

  const passwordStrength = password ? getPasswordStrength(password) : null;

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
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          width: "450px",
          maxHeight: "90vh",
          overflowY: "auto",
          padding: "40px 30px",
          borderRadius: "20px",
          background: "rgba(17,17,17,0.85)",
          color: "#fff",
          textAlign: "center",
          overflow: "hidden",
          backdropFilter: "blur(20px)",
        }}
      >
        {/* X Close Button */}
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
          Create your account
        </h2>

        {/* Full Name Input */}
        <div className="input-wrapper" style={{ position: "relative", width: "100%", marginBottom: "20px" }}>
          <input 
            type="text" 
            placeholder="Full Name" 
            value={fullName}
            onChange={handleFullNameChange}
            onBlur={() => handleBlur("fullName")}
            style={{
              ...inputStyle,
              margin: 0,
              border: touched.fullName && errors.fullName ? "1px solid #F44336" : "none",
            }}
          />
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
              background: errors.fullName && touched.fullName 
                ? "#F44336" 
                : "linear-gradient(270deg, #00c6ff, #bc13fe, #ff0080, #00c6ff)",
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
          {touched.fullName && errors.fullName && (
            <div style={{ 
              color: "#F44336", 
              fontSize: "0.8rem", 
              textAlign: "left", 
              marginTop: "5px",
              fontFamily: "Montserrat, sans-serif"
            }}>
              {errors.fullName}
            </div>
          )}
        </div>

        {/* Email Input */}
        <div className="input-wrapper" style={{ position: "relative", width: "100%", marginBottom: "20px" }}>
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
              background: errors.email && touched.email 
                ? "#F44336" 
                : "linear-gradient(270deg, #00c6ff, #bc13fe, #ff0080, #00c6ff)",
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
        </div>

        {/* Password Input */}
        <div className="input-wrapper" style={{ position: "relative", width: "100%", marginBottom: "20px" }}>
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
              background: errors.password && touched.password 
                ? "#F44336" 
                : "linear-gradient(270deg, #00c6ff, #bc13fe, #ff0080, #00c6ff)",
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

        {/* Password Strength Meter */}
        {password && (
          <div style={{ marginBottom: "15px", textAlign: "left" }}>
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center",
              marginBottom: "5px"
            }}>
              <span style={{ 
                fontSize: "0.8rem", 
                color: "rgba(255,255,255,0.7)",
                fontFamily: "Montserrat, sans-serif"
              }}>
                Password Strength:
              </span>
              <span style={{ 
                fontSize: "0.8rem", 
                color: passwordStrength.color,
                fontWeight: 600,
                fontFamily: "Montserrat, sans-serif"
              }}>
                {passwordStrength.label}
              </span>
            </div>
            <div style={{
              width: "100%",
              height: "4px",
              background: "rgba(255,255,255,0.1)",
              borderRadius: "2px",
              overflow: "hidden"
            }}>
              <div style={{
                width: passwordStrength.label === "Weak" ? "33%" : passwordStrength.label === "Medium" ? "66%" : "100%",
                height: "100%",
                background: passwordStrength.color,
                transition: "all 0.3s ease"
              }} />
            </div>
          </div>
        )}

        {touched.password && errors.password && (
          <div style={{ 
            color: "#F44336", 
            fontSize: "0.8rem", 
            textAlign: "left", 
            marginBottom: "15px",
            fontFamily: "Montserrat, sans-serif"
          }}>
            {errors.password}
          </div>
        )}

        {/* Confirm Password Input */}
        <div className="input-wrapper" style={{ position: "relative", width: "100%", marginBottom: "20px" }}>
          <input 
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password" 
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            onBlur={() => handleBlur("confirmPassword")}
            style={{
              ...inputStyle, 
              paddingRight: "45px", 
              margin: 0, 
              position: "relative", 
              zIndex: 1,
              border: touched.confirmPassword && errors.confirmPassword ? "1px solid #F44336" : "none",
            }}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
            {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
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
              background: errors.confirmPassword && touched.confirmPassword 
                ? "#F44336" 
                : "linear-gradient(270deg, #00c6ff, #bc13fe, #ff0080, #00c6ff)",
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
          {touched.confirmPassword && errors.confirmPassword && (
            <div style={{ 
              color: "#F44336", 
              fontSize: "0.8rem", 
              textAlign: "left", 
              marginTop: "5px",
              fontFamily: "Montserrat, sans-serif"
            }}>
              {errors.confirmPassword}
            </div>
          )}
        </div>

        {/* Sign Up Button */}
        <button 
          onClick={handleSignUp}
          disabled={!isFormValid()}
          style={{
            ...waterButtonStyle, 
            marginTop: "10px",
            opacity: isFormValid() ? 1 : 0.5,
            cursor: isFormValid() ? "pointer" : "not-allowed",
          }}
        >
          Sign Up
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

        {/* Google Button */}
        <button 
          onClick={handleGoogleSignUp}
          style={{ 
            ...waterButtonStyle, 
            marginTop: "0",
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            gap: "10px" 
          }}
        >
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
          Already have an account?{" "}
          <span 
            style={{ color: "#00c6ff", cursor: "pointer" }}
            onClick={handleSwitchToSignIn}
          >
            Sign In
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