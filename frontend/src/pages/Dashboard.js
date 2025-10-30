// src/pages/Dashboard.js
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DashboardNavbarSimple from "../components/DashboardNavbarSimple";
import UploadZone from "../components/UploadZone";
import ProgressBar from "../components/ProgressBar";
import HistoryPanel from "../components/HistoryPanel";
import InsightsPanel from "../components/InsightsPanel";
import { getAllRoles } from "../utils/constants";
import { toast } from "react-toastify";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { uploadDocument, getDocumentHistory, getDocumentResults } from "../utils/api";

export default function Dashboard() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [uploadState, setUploadState] = useState("idle");
  const location = useLocation();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analysisStage, setAnalysisStage] = useState(1);
  const [currentDocument, setCurrentDocument] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [results, setResults] = useState(null);
  const [activeRoleFilters, setActiveRoleFilters] = useState([]);
  const [insightsCollapsed, setInsightsCollapsed] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  useDocumentTitle("Dashboard | LegalSeg");
  const allRoles = getAllRoles();

  const handleHistoryClick = () => setIsHistoryOpen(!isHistoryOpen);
  const handleCloseHistory = () => setIsHistoryOpen(false);

  useEffect(() => {
    if (location.state?.fromInsights) {
      navigate("/dashboard", { replace: true, state: null });
    }
  }, [location.state, navigate]);

  // ✅ Load user and show correct name
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const isAuthenticated = localStorage.getItem("isAuthenticated");

      if (!isAuthenticated || !storedUser) {
        navigate("/signin");
        return;
      }

      const userData = JSON.parse(storedUser);
      const fullName = userData.fullName || userData.name || "User";
      const firstName = fullName.split(" ")[0];
      setUsername(firstName);

    } catch (err) {
      console.error("Error loading user:", err);
      navigate("/signin");
    }
  }, [navigate]);

  // ✅ Fetch real document history from backend
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await getDocumentHistory();
        if (res && res.documents) {
          setDocuments(res.documents);
        }
      } catch (err) {
        console.error("Error fetching document history:", err);
      }
    };
    fetchHistory();
  }, []);

  // File Upload Handler (mock progress but could connect to backend later)
  const handleFileSelect = async (file) => {
    setUploadState("uploading");
    setUploadProgress(0);
    try {
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i);
        await new Promise((resolve) => setTimeout(resolve, 200));
      }

      setUploadState("analyzing");
      setAnalysisStage(2);
      const stages = [2, 3, 4, 5];
      for (let stage of stages) {
        setAnalysisStage(stage);
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }

      const mockResults = generateMockResults(file.name);
      setResults(mockResults);
      const newDoc = {
        id: Date.now(),
        title: file.name,
        date: new Date().toLocaleString(),
        sentenceCount: mockResults.sentences.length,
        status: "completed",
      };
      setCurrentDocument(newDoc);
      setUploadState("completed");
      setDocuments([newDoc, ...documents]);
      navigate("/results", { state: { document: newDoc, results: mockResults } });
    } catch (error) {
      console.error("Error processing document:", error);
      toast.error("Error processing document. Please try again.");
      setUploadState("idle");
    }
  };

  const generateMockResults = (filename) => {
    const mockSentences = [
      { text: "The petitioner filed a case...", roleId: "facts", confidence: 92 },
      { text: "The main issue is whether...", roleId: "issues", confidence: 88 },
      { text: "The petitioner argues...", roleId: "argument_petitioner", confidence: 85 },
      { text: "The respondent contends...", roleId: "argument_respondent", confidence: 87 },
      { text: "The court considers Section 56...", roleId: "reasoning", confidence: 94 },
      { text: "After careful consideration...", roleId: "decision", confidence: 96 },
    ];
    return {
      sentences: mockSentences.map((s, i) => ({ ...s, originalIndex: i })),
      summary: "This is a mock legal summary.",
      avgConfidence: 89,
    };
  };

  const handleSelectDocument = (doc) => {
    setCurrentDocument(doc);
    const mockResults = generateMockResults(doc.title);
    setResults(mockResults);
    setUploadState("completed");
  };

  // --- UI ---
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)",
        position: "relative",
        overflow: "hidden",
        width: "100vw",
      }}
    >
      {/* Navbar */}
      <DashboardNavbarSimple username={username} onHistoryClick={handleHistoryClick} />

      {/* History Panel */}
      <HistoryPanel
        documents={documents}
        onSelectDocument={handleSelectDocument}
        isCollapsed={!isHistoryOpen}
        onToggle={handleHistoryClick}
      />

      {isHistoryOpen && (
        <div
          onClick={handleCloseHistory}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.4)",
            zIndex: 50,
            cursor: "pointer",
          }}
        />
      )}

      {/* Main Content */}
      <div
        style={{
          marginLeft: isHistoryOpen ? "0" : "0",
          marginTop: "70px",
          padding: "40px",
          minHeight: "calc(100vh - 70px)",
          transition: "margin 0.3s ease",
        }}
      >
        {uploadState === "idle" && (
          <div style={{ maxWidth: "900px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
              <h1
                style={{
                  fontSize: "3rem",
                  fontWeight: 500,
                  background: "linear-gradient(90deg, #00c6ff, #bc13fe, #ff0080)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontFamily: "Montserrat, sans-serif",
                  marginBottom: "15px",
                }}
              >
                Hey, {username}!
              </h1>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "1.3rem" }}>
                Ready to analyze some legal documents?
              </p>
            </div>
            <UploadZone onFileSelect={handleFileSelect} />
          </div>
        )}

        {(uploadState === "uploading" || uploadState === "analyzing") && (
          <div style={{ maxWidth: "800px", margin: "80px auto", textAlign: "center" }}>
            <h2 style={{ color: "#fff", fontSize: "2rem", marginBottom: "40px" }}>
              {uploadState === "uploading"
                ? "Uploading your document..."
                : "Analyzing document..."}
            </h2>
            <ProgressBar stage={analysisStage} progress={uploadProgress} />
          </div>
        )}
      </div>

      {uploadState === "completed" && results && (
        <InsightsPanel
          results={results}
          isCollapsed={insightsCollapsed}
          onToggle={() => setInsightsCollapsed(!insightsCollapsed)}
        />
      )}
    </div>
  );
}
