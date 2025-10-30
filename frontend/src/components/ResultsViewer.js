// src/components/ResultsViewer.js
import React, { useState } from "react";
import SentenceCard from "./SentenceCard";
import { Download, Share2, Trash2 } from "lucide-react";
import { getAllRoles, getRoleById } from "../utils/constants";

export default function ResultsViewer({ document, results }) {
  const [activeFilters, setActiveFilters] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

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
    // Filter by role
    if (activeFilters.length > 0 && !activeFilters.includes(sent.roleId)) {
      return false;
    }
    // Filter by search query
    if (searchQuery && !sent.text.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div
      style={{
        flex: 1,
        padding: "30px",
        overflowY: "auto",
      }}
    >
      {/* Header */}
      <div
        style={{
          marginBottom: "30px",
        }}
      >
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
            onMouseEnter={(e) => e.target.style.background = "rgba(0, 198, 255, 0.2)"}
            onMouseLeave={(e) => e.target.style.background = "rgba(255, 255, 255, 0.08)"}
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
            onMouseEnter={(e) => e.target.style.background = "rgba(0, 198, 255, 0.2)"}
            onMouseLeave={(e) => e.target.style.background = "rgba(255, 255, 255, 0.08)"}
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
            onMouseEnter={(e) => e.target.style.background = "rgba(244, 67, 54, 0.2)"}
            onMouseLeave={(e) => e.target.style.background = "rgba(244, 67, 54, 0.1)"}
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
    padding: "8px 16px",
    borderRadius: "20px",
    border: `2px solid ${isActive ? role.color : "rgba(255, 255, 255, 0.2)"}`,
    background: isActive ? role.bgColor : "rgba(255, 255, 255, 0.05)",
    color: isActive ? role.color : "rgba(255, 255, 255, 0.7)",
    fontSize: "0.85rem",
    fontFamily: "Montserrat, sans-serif",
    fontWeight: isActive ? 600 : 400,
    cursor: "pointer",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  }}
  onMouseEnter={(e) => {
    if (!isActive) {
      e.target.style.background = role.bgColor;
      e.target.style.color = role.color;
    }
  }}
  onMouseLeave={(e) => {
    if (!isActive) {
      e.target.style.background = "rgba(255, 255, 255, 0.05)";
      e.target.style.color = "rgba(255, 255, 255, 0.7)";
    }
  }}
>
  {React.createElement(role.icon, { size: 16, strokeWidth: 2.5 })}
  <span>{role.name}</span>
  <span
    style={{
      padding: "2px 6px",
      borderRadius: "10px",
      background: isActive ? role.color : "rgba(255, 255, 255, 0.2)",
      color: isActive ? "#fff" : "rgba(255, 255, 255, 0.7)",
      fontSize: "0.75rem",
      fontWeight: 600,
    }}
  >
    {count}
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
            onMouseEnter={(e) => e.target.style.background = "rgba(244, 67, 54, 0.3)"}
            onMouseLeave={(e) => e.target.style.background = "rgba(244, 67, 54, 0.2)"}
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
  );
}