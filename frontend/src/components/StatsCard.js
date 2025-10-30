// src/components/StatsCard.js
import React from "react";

export default function StatsCard({ role, count, total, isActive, onClick }) {
  const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : 0;

  return (
    <div
      onClick={onClick}
      style={{
        minWidth: "180px",
        padding: "20px",
        borderRadius: "15px",
        background: isActive ? role.bgColor : "rgba(255, 255, 255, 0.05)",
        border: `2px solid ${isActive ? role.color : "rgba(255, 255, 255, 0.1)"}`,
        cursor: "pointer",
        transition: "all 0.3s ease",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-5px)";
        e.currentTarget.style.boxShadow = `0 10px 30px ${role.color}40`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
    {/* Icon */}
<div style={{ marginBottom: "10px" }}>
  {React.createElement(role.icon, { size: 32, color: role.color, strokeWidth: 2 })}
</div>

      {/* Role Name */}
      <div
        style={{
          color: "#fff",
          fontFamily: "Montserrat, sans-serif",
          fontSize: "0.95rem",
          fontWeight: 600,
          marginBottom: "8px",
        }}
      >
        {role.name}
      </div>

      {/* Count */}
      <div
        style={{
          color: role.color,
          fontSize: "1.8rem",
          fontWeight: 700,
          fontFamily: "Montserrat, sans-serif",
          marginBottom: "5px",
        }}
      >
        {count}
      </div>

      {/* Percentage */}
      <div
        style={{
          color: "rgba(255, 255, 255, 0.6)",
          fontSize: "0.85rem",
          fontFamily: "Montserrat, sans-serif",
        }}
      >
        {percentage}% of total
      </div>

      {/* Active indicator */}
      {isActive && (
        <div
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            background: role.color,
            boxShadow: `0 0 10px ${role.color}`,
            animation: "glow 1.5s ease-in-out infinite",
          }}
        />
      )}

      <style>
        {`
          @keyframes glow {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}
      </style>
    </div>
  );
}