// src/components/SentenceCard.js
import React, { useState } from "react";

export default function SentenceCard({ sentence, index, role, confidence }) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div
      style={{
        padding: "15px 20px",
        borderRadius: "12px",
        background: "rgba(255, 255, 255, 0.03)",
        border: `1px solid rgba(255, 255, 255, 0.1)`,
        borderLeft: `4px solid ${role.color}`,
        marginBottom: "12px",
        transition: "all 0.3s ease",
        cursor: "pointer",
        position: "relative",
      }}
      onClick={() => setShowDetails(!showDetails)}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = role.bgColor;
        e.currentTarget.style.borderLeftWidth = "6px";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
        e.currentTarget.style.borderLeftWidth = "4px";
      }}
    >
      {/* Sentence Number and Role Badge */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "8px",
        }}
      >
        <span
          style={{
            color: "rgba(255, 255, 255, 0.5)",
            fontSize: "0.85rem",
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 600,
          }}
        >
          #{index + 1}
        </span>
       <span
  style={{
    padding: "3px 10px",
    borderRadius: "12px",
    background: role.bgColor,
    color: role.color,
    fontSize: "0.75rem",
    fontFamily: "Montserrat, sans-serif",
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    gap: "5px",
  }}
>
  {React.createElement(role.icon, { size: 14, color: role.color, strokeWidth: 2.5 })}
  {role.name}
</span>
      </div>

      {/* Sentence Text */}
      <p
        style={{
          color: "#fff",
          fontFamily: "Montserrat, sans-serif",
          fontSize: "1rem",
          lineHeight: "1.6",
          margin: 0,
        }}
      >
        {sentence}
      </p>

      {/* Confidence Bar */}
      {!showDetails && (
        <div
          style={{
            marginTop: "10px",
            width: "100%",
            height: "4px",
            background: "rgba(255, 255, 255, 0.1)",
            borderRadius: "2px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${confidence}%`,
              height: "100%",
              background:
                confidence >= 80
                  ? "#4CAF50"
                  : confidence >= 60
                  ? "#FF9800"
                  : "#F44336",
              borderRadius: "2px",
            }}
          />
        </div>
      )}

      {/* Detailed View */}
      {showDetails && (
        <div
          style={{
            marginTop: "15px",
            padding: "15px",
            borderRadius: "8px",
            background: "rgba(0, 0, 0, 0.3)",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            <span
              style={{
                color: "rgba(255, 255, 255, 0.7)",
                fontSize: "0.9rem",
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              Confidence Score:
            </span>
            <span
              style={{
                color: role.color,
                fontSize: "0.9rem",
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 600,
              }}
            >
              {confidence.toFixed(1)}%
            </span>
          </div>
          <div
            style={{
              color: "rgba(255, 255, 255, 0.6)",
              fontSize: "0.85rem",
              fontFamily: "Montserrat, sans-serif",
              fontStyle: "italic",
            }}
          >
            {role.description}
          </div>
        </div>
      )}
    </div>
  );
}