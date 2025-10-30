import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { sendOtp, verifyOtp, resetPassword } from "../utils/api";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  useDocumentTitle("ForgotPassword | LegalSeg")
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

      .otp-wrapper input:focus ~ .input-gradient-border {
        opacity: 1 !important;
      }

      .password-wrapper input:focus ~ .input-gradient-border {
        opacity: 1 !important;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const handleClose = () => {
    navigate('/');
  };

  const handleNext = async () => {
  try {
    if (step === 1 && email) {
      await sendOtp(email);
      toast.success("OTP sent to your email.");
      setStep(2);
    } else if (step === 2 && otp) {
      await verifyOtp(email, otp);
      toast.success("OTP verified.");
      setStep(3);
    } else if (step === 3 && newPassword && confirmPassword) {
      if (newPassword !== confirmPassword) {
        toast.success("Passwords do not match!");
        return;
      }
      await resetPassword(email, newPassword);
      toast.success("Password changed successfully!");
      navigate("/signin");
    }
  } catch (err) {
    toast.success(err.response?.data?.message || "Something went wrong.");
  }
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

        {/* Animated Border */}
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
            fontSize: "1.8rem",
          }}
        >
          {step === 1
            ? "Reset Your Password"
            : step === 2
            ? "Verify OTP"
            : "Change Password"}
        </h2>

        {/* Step 1: Email Input */}
        {step === 1 && (
          <div>
            <div className="email-wrapper" style={{ position: "relative", width: "100%", marginBottom: "30px" }}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{...inputStyle, margin: 0}}
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
            <button style={waterButtonStyle} onClick={handleNext}>
              Send OTP
            </button>
          </div>
        )}

        {/* Step 2: OTP Input */}
        {step === 2 && (
          <div>
            <div className="otp-wrapper" style={{ position: "relative", width: "100%", marginBottom: "30px" }}>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                style={{...inputStyle, margin: 0}}
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
            <button style={waterButtonStyle} onClick={handleNext}>
              Confirm OTP
            </button>
          </div>
        )}

        {/* Step 3: New Password */}
        {step === 3 && (
          <div>
            <div className="password-wrapper" style={{ position: "relative", width: "100%", marginBottom: "20px" }}>
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={{...inputStyle, paddingRight: "45px", margin: 0, position: "relative", zIndex: 1}}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
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
                {showNewPassword ? "👁️" : "👁️‍🗨️"}
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

            <div className="password-wrapper" style={{ position: "relative", width: "100%", marginBottom: "30px" }}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{...inputStyle, paddingRight: "45px", margin: 0, position: "relative", zIndex: 1}}
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

            <button style={waterButtonStyle} onClick={handleNext}>
              Change Password
            </button>
          </div>
        )}
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
  color: "#fff",
  fontSize: "1.1rem",
  fontWeight: 600,
  cursor: "pointer",
  transition: "all 0.3s ease",
  boxShadow:
    "inset 2px 2px 6px rgba(255,255,255,0.2), inset -2px -2px 6px rgba(0,0,0,0.5), 0 10px 20px rgba(0,0,0,0.6)",
};