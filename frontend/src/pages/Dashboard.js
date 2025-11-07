// src/pages/Dashboard.js
import React, { useState, useEffect } from "react";
import axios from "axios";
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
  const [error, setError] = useState(null);
const [history, setHistory] = useState([]);


  useDocumentTitle("Dashboard | LegalSeg");
  const allRoles = getAllRoles();

  const handleHistoryClick = () => setIsHistoryOpen(!isHistoryOpen);
  const handleCloseHistory = () => setIsHistoryOpen(false);

  useEffect(() => {
    if (location.state?.fromInsights) {
      navigate("/dashboard", { replace: true, state: null });
    }
  }, [location.state, navigate]);

  useEffect(() => {
  try {

    // ✅ 1. Check if token is in URL (after Google login)
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      console.log("🔐 Token found in URL:", token);

      // ✅ Store token
      localStorage.setItem("token", token);
      localStorage.setItem("isAuthenticated", "true");

      // Optionally fetch user profile with this token
      fetch("http://localhost:5000/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((userData) => {
          if (userData && !userData.message) {
            localStorage.setItem("user", JSON.stringify(userData));
            const firstName = (userData.name || "User").split(" ")[0];
            setUsername(firstName);
          } else {
            console.warn("⚠️ Profile fetch failed:", userData);
          }
        })
        .catch((err) => console.error("Profile fetch error:", err));

      // ✅ Remove token from URL (for clean UI)
      navigate("/dashboard", { replace: true });
      return;
    }

    // ✅ 2. Normal flow: load from localStorage
    const storedUser = localStorage.getItem("user");
    const isAuthenticated = localStorage.getItem("isAuthenticated");

    if (!isAuthenticated || !storedUser) {
      navigate("/signin");
      return;
    }

    const userData = JSON.parse(storedUser);
    const fullName = userData.name || userData.fullName || "User";
    const firstName = fullName.split(" ")[0];
    setUsername(firstName);
  } catch (err) {
    console.error("Error loading user:", err);
    navigate("/signin");
  }
}, [location, navigate]);

/*
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
      const fullName = userData.name || userData.fullName || "User";
      const firstName = fullName.split(" ")[0];
      setUsername(firstName);

    } catch (err) {
      console.error("Error loading user:", err);
      navigate("/signin");
    }
  }, [navigate]);
  */

  // ✅ Fetch real document history from backend
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await getDocumentHistory();
if (res) setDocuments(res);

      } catch (err) {
        console.error("Error fetching document history:", err);
      }
    };
    fetchHistory();
  }, []);

  // File Upload Handler (mock progress but could connect to backend later)
// File Upload Handler (mock progress but could connect to backend later)
const handleFileSelect = async (inputFileOrText) => {
  setUploadState("uploading");
  setUploadProgress(0);
  setAnalysisStage(1);

   try {
    console.log("📤 Sending document to backend...");

    // ✅ Detect whether it's plain text or a file
    let res;
    if (typeof inputFileOrText === "string") {
      // plain text
      res = await uploadDocument({ text: inputFileOrText }, (percent) =>
        setUploadProgress(percent)
      );
    } else {
      // file (PDF, DOCX, TXT)
      res = await uploadDocument(inputFileOrText, (percent) =>
        setUploadProgress(percent)
      );
    }

    console.log("✅ Backend response:", res);

    // guard: backend returns document & results (your routes do this)
    const returnedDoc = res.document || res.prediction || null;
    const returnedResults = res.results || res.prediction?.sentences
      ? {
          sentences: res.prediction?.sentences || res.results?.sentences,
          summary: res.prediction?.summary || res.results?.summary,
          avgConfidence:
            res.prediction?.avgConfidence || res.results?.avgConfidence,
        }
      : res.results || null;

    // If backend returns immediately, we still want to show analyzing UI
    setUploadState("analyzing");
    // small animation/stages for UX
    const stages = [2, 3, 4, 5];
    for (let st of stages) {
      setAnalysisStage(st);
      // tweak delay if you want slower/faster
      await new Promise((r) => setTimeout(r, 600));
    }

    // Build document object for UI (normalize fields)
    const newDoc = {
      id: returnedDoc?.id || returnedDoc?._id || Date.now(),
      title:
        returnedDoc?.title ||
        returnedDoc?.storedFilename ||
        inputFileOrText.name ||
        "pasted-text.txt",
      date: returnedDoc?.date
        ? new Date(returnedDoc.date).toLocaleString()
        : new Date().toLocaleString(),
      sentenceCount: returnedResults?.sentences?.length || 0,
      status: returnedDoc?.status || "completed",
    };

    setResults(returnedResults || inputFileOrText.name); // fallback
    setCurrentDocument(newDoc);
    setUploadState("completed");
    setDocuments((prev) => [newDoc, ...prev]);

    // ✅ Navigate to results page using backend _id
    const docId =
      returnedDoc?.id ||
      returnedDoc?._id ||
      res?.prediction?._id ||
      newDoc.id;

    navigate(`/results/${docId}`, {
      state: { document: newDoc, results: returnedResults },
    });
  } catch (err) {
    console.error("Error uploading document:", err);
    toast.error("Upload failed. Please try again.");
    setUploadState("idle");
    setUploadProgress(0);
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

 // src/pages/Dashboard.js
const handleSelectDocument = async (doc) => {
  try {
    setUploadState("completed"); // ensure results UI is enabled
    setCurrentDocument(doc);
    // Fetch detailed results from backend for this doc id
    // Use your existing util:
    const res = await getDocumentResults(doc.id); // make sure this util uses /cases/:id
    const documentFromServer = res; // getDocumentResults returns the document object per your api util
    const mockResults = generateMockResults(doc.title); // fallback

    const finalResults = documentFromServer?.results || documentFromServer?.prediction || mockResults;

    setResults(finalResults);
    // navigate to results page with state (same approach as upload)
    navigate(`/results/${doc.id}`, { state: { document: doc, results: finalResults } }); 
  } catch (err) {
    console.error("Error fetching results for document:", err);
    toast.error("Could not load document. Try again.");
  }
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
