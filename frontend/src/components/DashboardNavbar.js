// src/components/DashboardNavbar.js
import React, { useState, useEffect } from "react";
import { User, LogOut, History, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DashboardNavbar({
  username = "User",
  onHistoryClick,
  onInsightsClick,
  showHistoryInsights = false,
  results,
}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [displayName, setDisplayName] = useState(username);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    let name = "User";

    try {
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        if (parsed?.name) name = parsed.name;
      }
    } catch (err) {
      console.error("Error reading user from localStorage:", err);
    }

    // Capitalize and use only first initial
    name = name.trim();
    if (name.length > 0) name = name.charAt(0).toUpperCase();

    setDisplayName(name);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("token");
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
        zIndex:9999,
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

      {/* History & Insights buttons */}
      {showHistoryInsights && (
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

          <button
            onClick={() => {
              const currentPath = window.location.pathname;
              const match = currentPath.match(/\/results\/([^/]+)/);
              const resultId =
                match ? match[1] : results?._id || results?.id || results?.documentId;

              if (resultId) {
                console.log("Navigating to insights for ID:", resultId);
                navigate(`/insights/${resultId}`, { state: { results } });
              } else {
                console.error("No result ID found for insights navigation.");
              }
            }}
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
              e.target.style.background = "rgba(188, 19, 254, 0.15)";
              e.target.style.borderColor = "#bc13fe";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "rgba(255,255,255,0.05)";
              e.target.style.borderColor = "rgba(255,255,255,0.2)";
            }}
          >
            <BarChart3 size={18} />
            Insights
          </button>
        </div>
      )}

      {/* Right Section */}
      <div style={{ display: "flex", alignItems: "center", gap: "25px" }}>
        <div style={{ position: "relative" }}>
          <div
            onClick={() => setShowDropdown(!showDropdown)}
            style={{
              width: "45px",
              height: "45px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #00c6ff, #bc13fe, #ff0080)",
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
            {displayName || "U"}
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
