import React from "react";
import { useNavigate } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll"; // 👈 use react-scroll for smooth scrolling

export default function Navbar() {
  const navigate = useNavigate();

  // Navigation for other pages
  const openSignUp = () => navigate("/signup");
  const goHome = () => navigate("/");

  return (
    <>
      <nav
        className="navbar-container"
        style={{
          position: "fixed",
          top: "20px",
          left: "40px",
          right: "40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 5,
        }}
      >
        {/* Left side - Logo */}
        <div
          className="navbar-logo"
          style={{
            fontFamily: "'Great Vibes', cursive",
            fontSize: "2.5rem",
            fontWeight: 300,
            color: "#fff",
            letterSpacing: "-0.2px",
            cursor: "pointer",
          }}
          onClick={goHome}
        >
          ⚖️ LegalSeg
        </div>

        {/* Right side - Menu Links + Button */}
        <div className="navbar-links-wrapper" style={{ display: "flex", alignItems: "center", gap: "25px" }}>
          <div
            className="navbar-links"
            style={{
              display: "flex",
              gap: "35px",
              padding: "14px 40px",
              borderRadius: "60px",
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(12px)",
            }}
          >
            <ScrollLink
              to="home"
              smooth={true}
              duration={600}
              offset={-80}
              spy={true}
              activeClass="active"
              className="navbar-link"
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: "1.1rem",
                fontWeight: 600,
                color: "#fff",
                cursor: "pointer",
                transition: "all 0.3s ease",
                padding: "4px 10px",
                borderRadius: "8px",
              }}
            >
              Home
            </ScrollLink>

            <ScrollLink
              to="about"
              smooth={true}
              duration={600}
              offset={-80}
              spy={true}
              activeClass="active"
              className="navbar-link"
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: "1.1rem",
                fontWeight: 600,
                color: "#fff",
                cursor: "pointer",
                transition: "all 0.3s ease",
                padding: "4px 10px",
                borderRadius: "8px",
              }}
            >
              About
            </ScrollLink>

            <ScrollLink
              to="more"
              smooth={true}
              duration={600}
              offset={-80}
              spy={true}
              activeClass="active"
              className="navbar-link"
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: "1.1rem",
                fontWeight: 600,
                color: "#fff",
                cursor: "pointer",
                transition: "all 0.3s ease",
                padding: "4px 10px",
                borderRadius: "8px",
              }}
            >
              More
            </ScrollLink>
          </div>

          {/* Signup Button */}
          <button
            onClick={openSignUp}
            className="navbar-signup-btn"
            style={{
              padding: "14px 34px",
              borderRadius: "20px",
              fontSize: "1.1rem",
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 700,
              color: "#fff",
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.3)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              position: "relative",
              overflow: "hidden",
              cursor: "pointer",
              boxShadow:
                "inset 2px 2px 6px rgba(255,255,255,0.2), inset -2px -2px 6px rgba(0,0,0,0.4), 0 10px 25px rgba(0,0,0,0.6)",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "scale(1.08)";
              e.target.style.boxShadow =
                "inset 2px 2px 8px rgba(255,255,255,0.3), inset -2px -2px 8px rgba(0,0,0,0.5), 0 0 25px rgba(0,198,255,0.6)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "scale(1)";
              e.target.style.boxShadow =
                "inset 2px 2px 6px rgba(255,255,255,0.2), inset -2px -2px 6px rgba(0,0,0,0.4), 0 10px 25px rgba(0,0,0,0.6)";
            }}
          >
            Sign Up
          </button>
        </div>
      </nav>
    </>
  );
}
