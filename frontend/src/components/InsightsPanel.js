// src/components/InsightsPanel.js
import React from "react";
import { BarChart3, Download, FileSpreadsheet,ClipboardCopy, TrendingUp,FileText,ChevronRight } from "lucide-react";

import { getAllRoles } from "../utils/constants";

export default function InsightsPanel({ results, isCollapsed, onToggle }) {
  const allRoles = getAllRoles();

  // Calculate statistics
  const totalSentences = results.sentences.length;
  const roleDistribution = allRoles.map((role) => ({
    ...role,
    count: results.sentences.filter((s) => s.roleId === role.id).length,
  }));

  if (isCollapsed) {
    return (
      <div
        style={{
          position: "fixed",
          right: 0,
          top: "70px",
          bottom: 0,
          width: "60px",
          background: "rgba(17, 17, 17, 0.95)",
          backdropFilter: "blur(20px)",
          borderLeft: "1px solid rgba(255, 255, 255, 0.1)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "20px",
          gap: "20px",
          zIndex: 50,
        }}
      >
        <div
          onClick={onToggle}
          style={{
            fontSize: "1.5rem",
            cursor: "pointer",
            transition: "transform 0.3s ease",
          }}
          onMouseEnter={(e) => e.target.style.transform = "scale(1.2)"}
          onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
        >
           <h3
          style={{
            color: "#fff",
            fontFamily: "Montserrat, sans-serif",
            fontSize: "1.2rem",
            margin: 0,
          }}
        >
          <BarChart3 size={30} />
        </h3>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        right: 0,
        top: "70px",
        bottom: 0,
        width: "350px",
        background: "rgba(17, 17, 17, 0.95)",
        backdropFilter: "blur(20px)",
        borderLeft: "1px solid rgba(255, 255, 255, 0.1)",
        overflowY: "auto",
        padding: "20px",
        zIndex: 50,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "25px",
        }}
      >
        <h3
          style={{
            color: "#fff",
            fontFamily: "Montserrat, sans-serif",
            fontSize: "1.2rem",
            margin: 0,
          }}
        >
          <BarChart3 size={18} /> Insights
        </h3>
        <div
          onClick={onToggle}
          style={{
            cursor: "pointer",
            color: "rgba(255, 255, 255, 0.6)",
            fontSize: "1.2rem",
            transition: "color 0.3s ease",
          }}
          onMouseEnter={(e) => e.target.style.color = "#fff"}
          onMouseLeave={(e) => e.target.style.color = "rgba(255, 255, 255, 0.6)"}
        >
          <h3
          style={{
            color: "#fff",
            fontFamily: "Montserrat, sans-serif",
            fontSize: "1.2rem",
            margin: 0,
          }}
        >
          <ChevronRight size={30} />
        </h3>
        </div>
      </div>

      {/* Summary Card */}
      <div
        style={{
          padding: "20px",
          borderRadius: "15px",
          background: "rgba(0, 198, 255, 0.1)",
          border: "1px solid rgba(0, 198, 255, 0.3)",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            color: "#00c6ff",
            fontSize: "0.9rem",
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 600,
            marginBottom: "10px",
          }}
        >
          <h3
          style={{
            color: "#fff",
            fontFamily: "Montserrat, sans-serif",
            fontSize: "1.2rem",
            margin: 0,
          }}
        >
          <FileText size={18} /> Document Summary
        </h3>
        </div>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.8)",
            fontSize: "0.85rem",
            fontFamily: "Montserrat, sans-serif",
            lineHeight: "1.6",
            margin: 0,
          }}
        >
          {results.summary || "This document contains legal analysis with multiple rhetorical roles identified."}
        </p>
      </div>

      {/* Key Statistics */}
      <div
        style={{
          padding: "20px",
          borderRadius: "15px",
          background: "rgba(255, 255, 255, 0.05)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            color: "#fff",
            fontSize: "0.9rem",
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 600,
            marginBottom: "15px",
          }}
        >
          <h3
          style={{
            color: "#fff",
            fontFamily: "Montserrat, sans-serif",
            fontSize: "1.2rem",
            margin: 0,
          }}
        >
          <TrendingUp size={18} /> Key Statistics
        </h3>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span
              style={{
                color: "rgba(255, 255, 255, 0.7)",
                fontSize: "0.85rem",
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              Total Sentences:
            </span>
            <span
              style={{
                color: "#fff",
                fontSize: "0.85rem",
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 600,
              }}
            >
              {totalSentences}
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span
              style={{
                color: "rgba(255, 255, 255, 0.7)",
                fontSize: "0.85rem",
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              Avg. Confidence:
            </span>
            <span
              style={{
                color: "#4CAF50",
                fontSize: "0.85rem",
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 600,
              }}
            >
              {results.avgConfidence || 85}%
            </span>
          </div>
        </div>
      </div>

      {/* Distribution */}
      <div
        style={{
          padding: "20px",
          borderRadius: "15px",
          background: "rgba(255, 255, 255, 0.05)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            color: "#fff",
            fontSize: "0.9rem",
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 600,
            marginBottom: "15px",
          }}
        >
          📊 Role Distribution
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {roleDistribution.map((role) => {
            const percentage = totalSentences > 0 ? (role.count / totalSentences) * 100 : 0;
            return (
              <div key={role.id}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "5px",
                  }}
                >
                  <span
  style={{
    color: role.color,
    fontSize: "0.8rem",
    fontFamily: "Montserrat, sans-serif",
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    gap: "6px",
  }}
>
  {React.createElement(role.icon, { size: 14, strokeWidth: 2.5 })}
  <span>{role.name}</span>
</span>
                  <span
                    style={{
                      color: "rgba(255, 255, 255, 0.7)",
                      fontSize: "0.8rem",
                      fontFamily: "Montserrat, sans-serif",
                    }}
                  >
                    {role.count} ({percentage.toFixed(1)}%)
                  </span>
                </div>
                <div
                  style={{
                    width: "100%",
                    height: "6px",
                    background: "rgba(255, 255, 255, 0.1)",
                    borderRadius: "3px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${percentage}%`,
                      height: "100%",
                      background: role.color,
                      borderRadius: "3px",
                      transition: "width 0.5s ease",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Export Options */}
      <div
        style={{
          padding: "20px",
          borderRadius: "15px",
          background: "rgba(255, 255, 255, 0.05)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <div
          style={{
            color: "#fff",
            fontSize: "0.9rem",
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 600,
            marginBottom: "15px",
          }}
        >
          💾 Export Options
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <button
            style={{
              padding: "10px",
              borderRadius: "10px",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              background: "rgba(255, 255, 255, 0.05)",
              color: "#fff",
              fontSize: "0.85rem",
              fontFamily: "Montserrat, sans-serif",
              cursor: "pointer",
              textAlign: "left",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => e.target.style.background = "rgba(0, 198, 255, 0.2)"}
            onMouseLeave={(e) => e.target.style.background = "rgba(255, 255, 255, 0.05)"}
          >
            <h3
          style={{
            color: "#fff",
            fontFamily: "Montserrat, sans-serif",
            fontSize: "0.9rem",
            margin: 1,
          }}
        >
          <Download size={16} /> Download as PDF
        </h3>
          </button>
          <button
            style={{
              padding: "10px",
              borderRadius: "10px",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              background: "rgba(255, 255, 255, 0.05)",
              color: "#fff",
              fontSize: "0.85rem",
              fontFamily: "Montserrat, sans-serif",
              cursor: "pointer",
              textAlign: "left",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => e.target.style.background = "rgba(0, 198, 255, 0.2)"}
            onMouseLeave={(e) => e.target.style.background = "rgba(255, 255, 255, 0.05)"}
          >
            <h3
          style={{
            color: "#fff",
            fontFamily: "Montserrat, sans-serif",
            fontSize: "0.9rem",
            margin: 1,
          }}
        >
          <FileSpreadsheet size={16} /> Export as CSV
        </h3>
          </button>
          <button
            style={{
              padding: "10px",
              borderRadius: "10px",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              background: "rgba(255, 255, 255, 0.05)",
              color: "#fff",
              fontSize: "0.85rem",
              fontFamily: "Montserrat, sans-serif",
              cursor: "pointer",
              textAlign: "left",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => e.target.style.background = "rgba(0, 198, 255, 0.2)"}
            onMouseLeave={(e) => e.target.style.background = "rgba(255, 255, 255, 0.05)"}
          >
             <h3
          style={{
            color: "#fff",
            fontFamily: "Montserrat, sans-serif",
            fontSize: "0.9rem",
            margin: 1,
          }}
        >
          <ClipboardCopy size={16} /> Copy to ClipBoard
        </h3>
          </button>
        </div>
      </div>
    </div>
  );
}