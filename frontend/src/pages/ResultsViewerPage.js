// src/pages/ResultsViewerPage.js
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardNavbar from "../components/DashboardNavbar";
import HistoryPanel from "../components/HistoryPanel";
import SentenceCard from "../components/SentenceCard";
import { Download, Share2, Trash2 } from "lucide-react";
import { getAllRoles, getRoleById } from "../utils/constants";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
export default function ResultsViewerPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isHistoryCollapsed, setIsHistoryCollapsed] = useState(true);
  const [activeFilters, setActiveFilters] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useDocumentTitle("Results | LegalSeg");
  // get document + results passed from dashboard
  const { document, results } = location.state || {};
  useEffect(() => {
    if (!document || !results) {
      console.warn("Missing data, redirecting to dashboard...");
      navigate("/dashboard");
    }
  }, [document, results, navigate]);

  if (!document || !results) return null;

  const documents = [
    { id: 1, title: "Case 1", date: "2025-10-14", sentenceCount: 8, status: "completed" },
    { id: 2, title: "Case 2", date: "2025-10-12", sentenceCount: 5, status: "completed" },
  ];

  // ==== 👇 BELOW IS THE FULL ResultsViewer CODE INLINED HERE ====


  const allRoles = getAllRoles();

  const toggleFilter = (roleId) => {
    if (activeFilters.includes(roleId)) {
      setActiveFilters(activeFilters.filter((id) => id !== roleId));
    } else {
      setActiveFilters([...activeFilters, roleId]);
    }
  };

  const clearFilters = () => {
    setActiveFilters([]);
    setSearchQuery("");
  };

  const filteredSentences = results.sentences.filter((sent) => {
    if (activeFilters.length > 0 && !activeFilters.includes(sent.roleId)) {
      return false;
    }
    if (searchQuery && !sent.text.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  

  // ==== 👆 END OF INLINED LOGIC ====

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "black",
        color: "white",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Navbar */}
      <DashboardNavbar
        username="User"
        showHistoryInsights={true}
        onHistoryClick={() => setIsHistoryCollapsed(!isHistoryCollapsed)}
        onInsightsClick={() => navigate("/insights", { state: { document, results } })}
        results={results}
      />

{/* Upload Button (Top Right) */}
<button
  onClick={() => navigate("/dashboard")}
  style={{
    position: "fixed",
    top: "90px", // just below navbar
    right: "40px", // aligned under profile button
    zIndex: 150,
    padding: "10px 18px",
    borderRadius: "10px",
    border: "1px solid rgba(0, 198, 255, 0.5)",
    background: "rgba(0, 198, 255, 0.1)",
    color: "#00c6ff",
    fontSize: "0.9rem",
    fontFamily: "Montserrat, sans-serif",
    cursor: "pointer",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.background = "rgba(0, 198, 255, 0.2)";
    e.currentTarget.style.boxShadow = "0 0 15px rgba(0, 198, 255, 0.6)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.background = "rgba(0, 198, 255, 0.1)";
    e.currentTarget.style.boxShadow = "none";
  }}
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#00c6ff"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
    <polyline points="7 9 12 4 17 9" />
    <line x1="12" y1="4" x2="12" y2="16" />
  </svg>
  Upload New
</button>

      {/* History Panel */}
      <HistoryPanel
        documents={documents}
        onSelectDocument={(doc) => console.log("Selected:", doc)}
        isCollapsed={isHistoryCollapsed}
        onToggle={() => setIsHistoryCollapsed(!isHistoryCollapsed)}
      />

      {/* ======= FULL RESULTS UI (was ResultsViewer.js) ======= */}
      <div
        style={{
          flex: 1,
          padding: "40px",
          marginTop: "80px",
          overflowY: "auto",
          marginLeft: isHistoryCollapsed ? "60px" : "320px",
          transition: "margin-left 0.4s ease",
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: "30px" }}>
          <h2
            style={{
              color: "#fff",
              fontFamily: "Montserrat, sans-serif",
              fontSize: "1.8rem",
              marginBottom: "10px",
            }}
          >
            {document.title}
          </h2>
          <div
            style={{
              color: "rgba(255, 255, 255, 0.6)",
              fontSize: "0.9rem",
              fontFamily: "Montserrat, sans-serif",
              marginBottom: "15px",
            }}
          >
            Analyzed on {document.date} • {results.sentences.length} sentences
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              style={{
                padding: "10px 20px",
                borderRadius: "10px",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                background: "rgba(255, 255, 255, 0.08)",
                color: "#fff",
                fontSize: "0.9rem",
                fontFamily: "Montserrat, sans-serif",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) =>
                (e.target.style.background = "rgba(0, 198, 255, 0.2)")
              }
              onMouseLeave={(e) =>
                (e.target.style.background = "rgba(255, 255, 255, 0.08)")
              }
            >
              <Download size={16} style={{ marginRight: "6px" }} />
              Export PDF
            </button>
            <button
              style={{
                padding: "10px 20px",
                borderRadius: "10px",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                background: "rgba(255, 255, 255, 0.08)",
                color: "#fff",
                fontSize: "0.9rem",
                fontFamily: "Montserrat, sans-serif",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) =>
                (e.target.style.background = "rgba(0, 198, 255, 0.2)")
              }
              onMouseLeave={(e) =>
                (e.target.style.background = "rgba(255, 255, 255, 0.08)")
              }
            >
              <Share2 size={16} style={{ marginRight: "6px" }} />
              Share
            </button>
            <button
              style={{
                padding: "10px 20px",
                borderRadius: "10px",
                border: "1px solid rgba(244, 67, 54, 0.5)",
                background: "rgba(244, 67, 54, 0.1)",
                color: "#F44336",
                fontSize: "0.9rem",
                fontFamily: "Montserrat, sans-serif",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) =>
                (e.target.style.background = "rgba(244, 67, 54, 0.2)")
              }
              onMouseLeave={(e) =>
                (e.target.style.background = "rgba(244, 67, 54, 0.1)")
              }
            >
              <Trash2 size={16} style={{ marginRight: "6px" }} />
              Delete
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div
          style={{
            marginBottom: "25px",
            padding: "20px",
            borderRadius: "15px",
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          {/* Search */}
          <input
            type="text"
            placeholder="Search in document..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 18px",
              borderRadius: "10px",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              background: "rgba(255, 255, 255, 0.05)",
              color: "#fff",
              fontSize: "0.95rem",
              fontFamily: "Montserrat, sans-serif",
              outline: "none",
              marginBottom: "15px",
            }}
          />

          {/* Role Filters */}
<div
  style={{
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    marginBottom: "10px",
  }}
>
  {allRoles.map((role) => {
  const isActive = activeFilters.includes(role.id);
  const count = results.sentences.filter((s) => s.roleId === role.id).length;

    return (
<button
  key={role.id}
  onClick={() => toggleFilter(role.id)}
  style={{
    border: `2px solid ${isActive ? role.color : "rgba(255,255,255,0.2)"}`,
    background: "rgba(255,255,255,0.05)", // subtle background always
    color: isActive ? "#fff" : "rgba(255,255,255,0.7)",
    boxShadow: isActive ? `0 0 14px ${role.color}99` : "none", // slightly stronger base glow
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "8px 16px",
    borderRadius: "20px",
    cursor: "pointer",
    fontFamily: "Montserrat, sans-serif",
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = "translateY(-4px)";
    // 💥 Brighter, more spread glow when hovered
    e.currentTarget.style.boxShadow = `0 0 22px ${role.color}cc, 0 0 40px ${role.color}55`;
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = "translateY(0)";
    e.currentTarget.style.boxShadow = isActive
      ? `0 0 14px ${role.color}99`
      : "none";
  }}
>
  {React.createElement(role.icon, { size: 16, strokeWidth: 2.5 })}

  <span
    style={{
      color: isActive ? "#fff" : "rgba(255,255,255,0.7)",
      fontWeight: isActive ? 600 : 400,
    }}
  >
    {role.name}
  </span>

  <span
    style={{
      padding: "2px 6px",
      borderRadius: "10px",
      background: isActive ? role.color : "rgba(255,255,255,0.2)",
      color: "#fff",
      fontSize: "0.75rem",
      fontWeight: 600,
    }}
  >
    {count ?? 0}
  </span>
</button>



  );
})}
</div>

          {/* Clear Filters */}
          {(activeFilters.length > 0 || searchQuery) && (
            <button
              onClick={clearFilters}
              style={{
                padding: "6px 12px",
                borderRadius: "8px",
                border: "none",
                background: "rgba(244, 67, 54, 0.2)",
                color: "#F44336",
                fontSize: "0.8rem",
                fontFamily: "Montserrat, sans-serif",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) =>
                (e.target.style.background = "rgba(244, 67, 54, 0.3)")
              }
              onMouseLeave={(e) =>
                (e.target.style.background = "rgba(244, 67, 54, 0.2)")
              }
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Results Count */}
        <div
          style={{
            color: "rgba(255, 255, 255, 0.6)",
            fontSize: "0.9rem",
            fontFamily: "Montserrat, sans-serif",
            marginBottom: "20px",
          }}
        >
          Showing {filteredSentences.length} of {results.sentences.length} sentences
        </div>

        {/* Sentences */}
        <div>
          {filteredSentences.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "60px 20px",
                color: "rgba(255, 255, 255, 0.5)",
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              No sentences match your filters
            </div>
          ) : (
            filteredSentences.map((sent, idx) => (
              <SentenceCard
                key={idx}
                sentence={sent.text}
                index={sent.originalIndex}
                role={getRoleById(sent.roleId)}
                confidence={sent.confidence}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
