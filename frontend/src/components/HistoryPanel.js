import React, { useState, useEffect } from "react";
import axios from "axios";
import { ChevronLeft, FileText, History } from "lucide-react";

export default function HistoryPanel({
  onSelectDocument,
  isCollapsed,
  onToggle,
}) {
  const [documents, setDocuments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // ✅ Fetch user history on mount

useEffect(() => {
  const fetchPredictions = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/cases/predictions/all", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const formattedDocs = res.data.predictions.map((item) => ({
        id: item._id,
        title: item.title || "Untitled Document",
        date: new Date(item.createdAt || item.date).toLocaleString(),
        sentenceCount: item.sentences?.length || 0,
        status: item.status || "completed",
      }));

      setDocuments(formattedDocs);
    } catch (err) {
      console.error("Error fetching predictions:", err);
    }
  };

  fetchPredictions();
}, []);




  const filteredDocs = documents.filter((doc) =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* ✅ Sliding Panel */}
      <div
       className="history-panel"
        style={{
          position: "fixed",
          top: "70px",
          left: isCollapsed ? "-340px" : "0",
          width: "320px",
          height: "calc(100vh - 70px)",
          background: "rgba(17, 17, 17, 0.95)",
          backdropFilter: "blur(20px)",
          borderRight: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: isCollapsed ? "none" : "4px 0 20px rgba(0, 0, 0, 0.5)",
          display: "flex",
          flexDirection: "column",
          transition: "left 0.4s ease-in-out, box-shadow 0.3s ease-in-out",
          zIndex: 100,
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "15px",
            }}
          >
            <h3
              style={{
                color: "#fff",
                fontFamily: "Montserrat, sans-serif",
                fontSize: "1.2rem",
                margin: 0,
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <History size={18} /> History
            </h3>
            <div
              onClick={onToggle}
              style={{
                cursor: "pointer",
                color: "rgba(255, 255, 255, 0.6)",
                fontSize: "1.2rem",
                transition: "color 0.3s ease",
              }}
              onMouseEnter={(e) => (e.target.style.color = "#fff")}
              onMouseLeave={(e) =>
                (e.target.style.color = "rgba(255, 255, 255, 0.6)")
              }
            >
              <ChevronLeft size={28} />
            </div>
          </div>

          {/* Search */}
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 15px",
              borderRadius: "10px",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              background: "rgba(255, 255, 255, 0.05)",
              color: "#fff",
              fontSize: "0.9rem",
              fontFamily: "Montserrat, sans-serif",
              outline: "none",
            }}
          />
        </div>

        {/* Document List */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "10px",
          }}
        >
          {filteredDocs.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "40px 20px",
                color: "rgba(255, 255, 255, 0.5)",
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              {searchQuery ? "No documents found" : "No documents yet"}
            </div>
          ) : (
            filteredDocs.map((doc) => (
              <div
                key={doc.id}
                onClick={() => {
  localStorage.setItem("selectedPredictionId", doc.id);
  window.location.href = `/results/${doc.id}`;
}}

                style={{
                  padding: "15px",
                  marginBottom: "10px",
                  borderRadius: "12px",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(0, 198, 255, 0.1)";
                  e.currentTarget.style.borderColor = "#00c6ff";
                  e.currentTarget.style.transform = "translateX(5px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    "rgba(255, 255, 255, 0.05)";
                  e.currentTarget.style.borderColor =
                    "rgba(255, 255, 255, 0.1)";
                  e.currentTarget.style.transform = "translateX(0)";
                }}
              >
                <div style={{ marginBottom: "8px" }}>
                  <FileText size={24} color="#00c6ff" strokeWidth={2} />
                </div>
                <div
                  style={{
                    color: "#fff",
                    fontFamily: "Montserrat, sans-serif",
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    marginBottom: "5px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {doc.title}
                </div>
                <div
                  style={{
                    color: "rgba(255, 255, 255, 0.5)",
                    fontSize: "0.75rem",
                    fontFamily: "Montserrat, sans-serif",
                    marginBottom: "8px",
                  }}
                >
                  {doc.date}
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    fontSize: "0.75rem",
                    fontFamily: "Montserrat, sans-serif",
                  }}
                >
                  <span
                    style={{
                      padding: "3px 8px",
                      borderRadius: "8px",
                      background: "rgba(33, 150, 243, 0.2)",
                      color: "#2196F3",
                    }}
                  >
                    {typeof doc.avgConfidence === "number" ? doc.avgConfidence.toFixed(1) : "—"}%
                      
                  </span>
                  {doc.status === "completed" && (
                    <span style={{ color: "#4CAF50" }}>✓</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ✅ Floating Button when collapsed */}
      {isCollapsed && (
        <div
        className="history-floating-btn"
          onClick={onToggle}
          style={{
            position: "fixed",
            top: "85px",
            left: "15px",
            width: "50px",
            height: "50px",
            borderRadius: "12px",
            background: "rgba(0, 198, 255, 0.15)",
            border: "1px solid rgba(0, 198, 255, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.3s ease",
            zIndex: 120,
            boxShadow: "0 0 12px rgba(0,198,255,0.3)",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.boxShadow = "0 0 20px rgba(0,198,255,0.7)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.boxShadow = "0 0 12px rgba(0,198,255,0.3)")
          }
        >
          <History size={26} color="#00c6ff" />
        </div>
      )}
    </>
  );
}
