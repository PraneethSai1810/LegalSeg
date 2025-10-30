// src/pages/InsightsPage.js
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  BarChart3,
  Download,
  FileSpreadsheet,
  ClipboardCopy,
  TrendingUp,
  FileText,
} from "lucide-react";
import { getAllRoles } from "../utils/constants";

export default function InsightsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const results = location.state?.results; // passed from DashboardNavbar
  const allRoles = getAllRoles();

  console.log("Insights received:", results);

  // ✅ Optional: redirect if no results were passed
  useEffect(() => {
    if (!results) {
      navigate("/"); // go back home if no results
    }
  }, [results, navigate]);

  // ✅ Optional: set browser tab title
  useEffect(() => {
    document.title = "Insights | LegalSeg";
  }, []);

  // ✅ Handle Back button (send results back to Dashboard so ResultsViewer shows)
const handleBackToResults = () => {
  navigate("/results", {
    state: {
      results, // safe to pass
      document: {
        id: document?.id || null,
        title: document?.title || "Untitled",
      },
    },
  });
};



  // ✅ Export: Download PDF (simple text version)
  const handleDownloadPDF = () => {
    const blob = new Blob(
      [
        `LegalSeg Insights Report\n\nSummary:\n${results.summary}\n\n` +
        `Average Confidence: ${results.avgConfidence}%\n\nSentences:\n` +
        results.sentences.map((s, i) => `${i + 1}. [${s.roleId}] ${s.text}`).join("\n"),
      ],
      { type: "application/pdf" }
    );

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "LegalSeg_Insights_Report.pdf";
    link.click();
  };

  // ✅ Export: Export CSV
  const handleExportCSV = () => {
    const header = "Index,Role,Confidence,Sentence\n";
    const rows = results.sentences
      .map((s, i) => `${i + 1},"${s.roleId}",${s.confidence},"${s.text.replace(/"/g, '""')}"`)
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "LegalSeg_Insights.csv";
    link.click();
  };

  // ✅ Export: Copy to Clipboard
  const handleCopyToClipboard = () => {
    const textToCopy =
      `Summary:\n${results.summary}\n\nSentences:\n` +
      results.sentences.map((s, i) => `${i + 1}. [${s.roleId}] ${s.text}`).join("\n");

    navigator.clipboard.writeText(textToCopy);
    alert("Copied insights to clipboard!");
  };

  if (!results) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontFamily: "Montserrat, sans-serif",
        }}
      >
        <h2>No insights data found.</h2>
        <button
          onClick={() => navigate("/dashboard")}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            borderRadius: "8px",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            background: "rgba(255, 255, 255, 0.1)",
            color: "#fff",
            cursor: "pointer",
            fontFamily: "Montserrat, sans-serif",
          }}
        >
          ← Back
        </button>
      </div>
    );
  }

  const totalSentences = results.sentences.length;
  const roleDistribution = allRoles.map((role) => ({
    ...role,
    count: results.sentences.filter((s) => s.roleId === role.id).length,
  }));

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "rgba(17, 17, 17, 0.98)",
        backdropFilter: "blur(20px)",
        color: "#fff",
        fontFamily: "Montserrat, sans-serif",
        padding: "30px",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <h2
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "1.8rem",
            margin: 0,
          }}
        >
          <BarChart3 size={28} /> Insights
        </h2>
        <button
          onClick={handleBackToResults}
          style={{
            padding: "8px 16px",
            borderRadius: "8px",
            background: "rgba(0, 198, 255, 0.15)",
            border: "1px solid rgba(0, 198, 255, 0.4)",
            color: "#00C6FF",
            fontSize: "0.9rem",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => (e.target.style.background = "rgba(0,198,255,0.25)")}
          onMouseLeave={(e) => (e.target.style.background = "rgba(0,198,255,0.15)")}
        >
          ← Back to Results
        </button>
      </div>

      {/* Document Summary */}
      <div
        style={{
          padding: "20px",
          borderRadius: "15px",
          background: "rgba(0, 198, 255, 0.1)",
          border: "1px solid rgba(0, 198, 255, 0.3)",
          marginBottom: "25px",
        }}
      >
        <h3 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <FileText size={18} /> Document Summary
        </h3>
        <p
          style={{
            color: "rgba(255,255,255,0.8)",
            fontSize: "0.9rem",
            marginTop: "10px",
          }}
        >
          {results.summary ||
            "This document contains legal analysis with multiple rhetorical roles identified."}
        </p>
      </div>

      {/* Key Statistics */}
      <div
        style={{
          padding: "20px",
          borderRadius: "15px",
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          marginBottom: "25px",
        }}
      >
        <h3 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <TrendingUp size={18} /> Key Statistics
        </h3>
        <div style={{ marginTop: "15px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <span style={{ color: "rgba(255,255,255,0.7)" }}>Total Sentences:</span>
            <span>{totalSentences}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "rgba(255,255,255,0.7)" }}>Avg. Confidence:</span>
            <span style={{ color: "#4CAF50" }}>{results.avgConfidence || 85}%</span>
          </div>
        </div>
      </div>

      {/* Role Distribution */}
      <div
        style={{
          padding: "20px",
          borderRadius: "15px",
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          marginBottom: "25px",
        }}
      >
        <h3 style={{ marginBottom: "15px" }}>📊 Role Distribution</h3>
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
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: "0.9rem",
                    }}
                  >
                    {React.createElement(role.icon, { size: 14 })} {role.name}
                  </span>
                  <span style={{ color: "rgba(255,255,255,0.7)" }}>
                    {role.count} ({percentage.toFixed(1)}%)
                  </span>
                </div>
                <div
                  style={{
                    width: "100%",
                    height: "6px",
                    background: "rgba(255,255,255,0.1)",
                    borderRadius: "3px",
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
                  ></div>
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
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <h3 style={{ marginBottom: "15px" }}>💾 Export Options</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <button
            style={buttonStyle}
            onClick={handleDownloadPDF}
            onMouseEnter={(e) => (e.target.style.background = "rgba(0,198,255,0.2)")}
            onMouseLeave={(e) => (e.target.style.background = "rgba(255,255,255,0.05)")}
          >
            <Download size={16} /> Download as PDF
          </button>
          <button
            style={buttonStyle}
            onClick={handleExportCSV}
            onMouseEnter={(e) => (e.target.style.background = "rgba(0,198,255,0.2)")}
            onMouseLeave={(e) => (e.target.style.background = "rgba(255,255,255,0.05)")}
          >
            <FileSpreadsheet size={16} /> Export as CSV
          </button>
          <button
            style={buttonStyle}
            onClick={handleCopyToClipboard}
            onMouseEnter={(e) => (e.target.style.background = "rgba(0,198,255,0.2)")}
            onMouseLeave={(e) => (e.target.style.background = "rgba(255,255,255,0.05)")}
          >
            <ClipboardCopy size={16} /> Copy to Clipboard
          </button>
        </div>
      </div>
    </div>
  );
}

const buttonStyle = {
  padding: "10px",
  borderRadius: "10px",
  border: "1px solid rgba(255,255,255,0.2)",
  background: "rgba(255,255,255,0.05)",
  color: "#fff",
  fontSize: "0.85rem",
  fontFamily: "Montserrat, sans-serif",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  transition: "all 0.3s ease",
};
