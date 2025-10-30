// src/components/ProgressBar.js
import React from "react";

export default function ProgressBar({ stage, progress }) {
  const stages = [
    { id: 1, name: "Uploading", icon: "📤" },
    { id: 2, name: "Extracting Text", icon: "📝" },
    { id: 3, name: "Legal Longformer Analysis", icon: "🤖" },
    { id: 4, name: "Transformer Processing", icon: "⚡" },
    { id: 5, name: "CRF Sequence Labeling", icon: "🎯" },
  ];

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "600px",
        margin: "0 auto",
        padding: "40px",
      }}
    >
      {/* Progress Bar */}
      <div
        style={{
          width: "100%",
          height: "8px",
          background: "rgba(255, 255, 255, 0.1)",
          borderRadius: "10px",
          overflow: "hidden",
          marginBottom: "30px",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${progress}%`,
            background: "linear-gradient(90deg, #00c6ff, #bc13fe, #ff0080)",
            borderRadius: "10px",
            transition: "width 0.3s ease",
          }}
        />
      </div>

      {/* Stages */}
      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        {stages.map((s) => (
          <div
            key={s.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "15px",
              padding: "12px",
              borderRadius: "12px",
              background:
                s.id === stage
                  ? "rgba(0, 198, 255, 0.15)"
                  : s.id < stage
                  ? "rgba(76, 175, 80, 0.15)"
                  : "rgba(255, 255, 255, 0.05)",
              border:
                s.id === stage
                  ? "1px solid rgba(0, 198, 255, 0.5)"
                  : "1px solid rgba(255, 255, 255, 0.1)",
              transition: "all 0.3s ease",
            }}
          >
            {/* Icon */}
            <div
              style={{
                fontSize: "1.5rem",
                animation: s.id === stage ? "pulse 1.5s ease-in-out infinite" : "none",
              }}
            >
              {s.id < stage ? "✓" : s.icon}
            </div>

            {/* Name */}
            <div
              style={{
                flex: 1,
                color: s.id <= stage ? "#fff" : "rgba(255, 255, 255, 0.5)",
                fontFamily: "Montserrat, sans-serif",
                fontWeight: s.id === stage ? 600 : 400,
              }}
            >
              {s.name}
            </div>

            {/* Status */}
            {s.id === stage && (
              <div
                style={{
                  fontSize: "0.85rem",
                  color: "#00c6ff",
                  fontFamily: "Montserrat, sans-serif",
                }}
              >
                Processing...
              </div>
            )}
            {s.id < stage && (
              <div
                style={{
                  fontSize: "0.85rem",
                  color: "#4CAF50",
                  fontFamily: "Montserrat, sans-serif",
                }}
              >
                Complete
              </div>
            )}
          </div>
        ))}
      </div>

      <style>
        {`
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.2); }
          }
        `}
      </style>
    </div>
  );
}