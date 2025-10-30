// src/components/DashboardNavbarSimple.js
import React, { useState } from "react";
import { User, LogOut, History } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DashboardNavbarSimple({ username = "User", onHistoryClick }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("isAuthenticated");
    navigate("/");
  };

  const goToProfile = () => {
    navigate("/profile");
    setShowDropdown(false);
  };

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "70px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 40px",
        background: "rgba(17, 17, 17, 0.95)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        zIndex: 2000,
      }}
    >
      {/* Logo */}
      <div
        style={{
          fontFamily: "'Great Vibes', cursive",
          fontSize: "2rem",
          color: "#fff",
          cursor: "pointer",
        }}
        onClick={() => navigate("/")}
      >
        ⚖️ LegalSeg
      </div>

      {/* Only History Button */}
      <div style={{ display: "flex", gap: "15px", marginLeft: "40px" }}>
        <button
          onClick={onHistoryClick}
          style={{
            padding: "10px 20px",
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.2)",
            background: "rgba(255,255,255,0.05)",
            color: "#fff",
            fontSize: "0.95rem",
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.3s ease",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "rgba(0, 198, 255, 0.15)";
            e.target.style.borderColor = "#00c6ff";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "rgba(255,255,255,0.05)";
            e.target.style.borderColor = "rgba(255,255,255,0.2)";
          }}
        >
          <History size={18} />
          History
        </button>
      </div>

      {/* Profile + Dropdown */}
      <div style={{ display: "flex", alignItems: "center", gap: "25px" }}>
        <div style={{ position: "relative" }}>
          <div
            onClick={() => setShowDropdown(!showDropdown)}
            style={{
              width: "45px",
              height: "45px",
              borderRadius: "50%",
              background:
                "linear-gradient(135deg, #00c6ff, #bc13fe, #ff0080)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "1.2rem",
              color: "#fff",
              transition: "transform 0.3s ease",
            }}
            onMouseEnter={(e) =>
              (e.target.style.transform = "rotate(5deg) scale(1.05)")
            }
            onMouseLeave={(e) =>
              (e.target.style.transform = "rotate(0deg) scale(1)")
            }
          >
            {username.split(" ").map((n) => n[0]).join("")}
          </div>

          {showDropdown && (
            <div
              style={{
                position: "absolute",
                top: "55px",
                right: 0,
                width: "200px",
                background: "rgba(17, 17, 17, 0.95)",
                backdropFilter: "blur(20px)",
                borderRadius: "12px",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                overflow: "hidden",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
              }}
            >
              <div
                onClick={goToProfile}
                style={{
                  padding: "15px 20px",
                  cursor: "pointer",
                  color: "#fff",
                  fontFamily: "Montserrat, sans-serif",
                  transition: "background 0.3s ease",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.background = "rgba(255, 255, 255, 0.1)")
                }
                onMouseLeave={(e) =>
                  (e.target.style.background = "transparent")
                }
              >
                <User size={16} style={{ marginRight: "8px" }} />
                Profile
              </div>

              <div
                onClick={handleLogout}
                style={{
                  padding: "15px 20px",
                  cursor: "pointer",
                  color: "#F44336",
                  fontFamily: "Montserrat, sans-serif",
                  borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                  transition: "background 0.3s ease",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.background = "rgba(244, 67, 54, 0.1)")
                }
                onMouseLeave={(e) =>
                  (e.target.style.background = "transparent")
                }
              >
                <LogOut size={16} style={{ marginRight: "8px" }} />
                Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
