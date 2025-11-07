// src/pages/InsightsPage.js
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  BarChart3,
  Download,
  FileSpreadsheet,
  ClipboardCopy,
  TrendingUp,
  FileText,
} from "lucide-react";
import { jsPDF } from "jspdf";
import { getAllRoles, getRoleById } from "../utils/constants";
import axios from "axios";

export default function InsightsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  console.log("Opened Insights for ID:", params.id);
  const allRoles = getAllRoles();

  const [results, setResults] = useState(location.state?.results || null);
  const [documentData, setDocumentData] = useState(location.state?.document || null);
  const [loading, setLoading] = useState(!results);

  console.log("Insights received:", results);

  // ✅ Fetch actual prediction if no results were passed (direct access from history)
useEffect(() => {
  const fetchPrediction = async () => {
    const id = params.id || location.state?.document?.id;
    console.log("Opened Insights for ID:", id);

    try {
      if (!id) return;

      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        `http://localhost:5000/api/cases/predictions/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("🧩 Prediction title from backend:", data.prediction.title);
      console.log("Insights received:", data.prediction);

      setResults(data.prediction);

      const docInfo = {
        id: data.prediction._id,
        title:
          data.prediction.title ||
          data.prediction.fileName ||
          data.prediction.storedFilename ||
          location.state?.document?.title ||
          "Untitled Document",
      };

      setDocumentData(docInfo);
      localStorage.setItem("lastOpenedDoc", JSON.stringify(docInfo));
    } catch (err) {
      console.error("Error fetching insights:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Only run once per ID (prevents duplicate fetch)
  if (params.id) {
    fetchPrediction();
  }
}, [params.id]);


  // ✅ Back to Results (preserves correct file name)
  const handleBackToResults = () => {
  const resultId =
    params.id ||
    results?._id ||
    results?.id ||
    location.state?.document?.id;

  const savedDoc = JSON.parse(localStorage.getItem("lastOpenedDoc") || "{}");

  const titleFromAnySource =
    location.state?.document?.title ||
    results?.title ||
    results?.storedFilename ||
    savedDoc.title ||
    "Untitled Document";

  console.log("🧭 Navigating back with:", { resultId, titleFromAnySource });

  if (!resultId) {
    navigate("/dashboard");
    return;
  }

  navigate(`/results/${resultId}`, {
    state: {
      results,
      document: { id: resultId, title: titleFromAnySource },
    },
  });
};




  // ✅ Export: Download PDF
 const handleDownloadPDF = () => {
  const doc = new jsPDF();
  doc.setFontSize(14);
  doc.text("LegalSeg Results Report", 10, 10);
  doc.setFontSize(11);
  doc.text(`Document: ${document.title || "Untitled"}`, 10, 20);
  doc.text(`Analyzed: ${document.date || "N/A"}`, 10, 30);
  doc.text("Sentences:", 10, 40);

  let y = 50;
  results.sentences.forEach((s, i) => {
    const line = `${i + 1}. [${getRoleById(s.roleId)?.name || s.roleId}] ${s.text}`;
    const splitText = doc.splitTextToSize(line, 180);
    if (y + splitText.length * 7 > 280) {
      doc.addPage();
      y = 20;
    }
    doc.text(splitText, 10, y);
    y += splitText.length * 7;
  });

  doc.save("LegalSeg_Results_Report.pdf");
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

  if (loading)
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontFamily: "Montserrat, sans-serif",
        }}
      >
        <h2>Loading insights...</h2>
      </div>
    );

  if (!results)
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

  const totalSentences = results.sentences?.length || 0;
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
