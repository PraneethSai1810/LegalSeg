// src/components/UploadZone.js
import React, { useState, useRef } from "react";
import { Upload } from "lucide-react";

export default function UploadZone({ onFileSelect }) {
  const [isDragging, setIsDragging] = useState(false);
  const [activeTab, setActiveTab] = useState("file");
  const [textInput, setTextInput] = useState("");
  const fileInputRef = useRef(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file) => {
    // Validate file type
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a PDF, DOCX, or TXT file');
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    onFileSelect(file);
  };

  const handleTextAnalysis = () => {
  if (textInput.trim().length < 50) {
    alert("Please enter at least 50 characters of text");
    return;
  }

  console.log("📤 Sending plain text to backend...");
  onFileSelect(textInput); // ✅ send string directly, NOT a File object
};


  return (
    <>
      {/* Tab Switcher */}
      <div style={{
        display: "flex",
        gap: "10px",
        marginBottom: "20px",
        justifyContent: "center",
      }}>
        <button
          onClick={() => setActiveTab("file")}
          style={{
            padding: "12px 30px",
            borderRadius: "12px",
            border: activeTab === "file" ? "2px solid #00c6ff" : "2px solid rgba(255,255,255,0.2)",
            background: activeTab === "file" ? "rgba(0, 198, 255, 0.15)" : "rgba(255,255,255,0.05)",
            color: activeTab === "file" ? "#00c6ff" : "rgba(255,255,255,0.7)",
            fontSize: "1rem",
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.3s ease",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          📄 Upload File
        </button>
        <button
          onClick={() => setActiveTab("text")}
          style={{
            padding: "12px 30px",
            borderRadius: "12px",
            border: activeTab === "text" ? "2px solid #bc13fe" : "2px solid rgba(255,255,255,0.2)",
            background: activeTab === "text" ? "rgba(188, 19, 254, 0.15)" : "rgba(255,255,255,0.05)",
            color: activeTab === "text" ? "#bc13fe" : "rgba(255,255,255,0.7)",
            fontSize: "1rem",
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.3s ease",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          📝 Paste Text
        </button>
      </div>

      {/* Main Container */}
      <div
        onDragEnter={activeTab === "file" ? handleDragEnter : undefined}
        onDragOver={activeTab === "file" ? handleDragOver : undefined}
        onDragLeave={activeTab === "file" ? handleDragLeave : undefined}
        onDrop={activeTab === "file" ? handleDrop : undefined}
        onClick={activeTab === "file" ? () => fileInputRef.current?.click() : undefined}
        style={{
          width: "100%",
          minHeight: "400px",
          borderRadius: "20px",
          background: isDragging ? 'rgba(0, 198, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)',
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "25px",
          padding: "40px",
          transition: "all 0.3s ease",
          cursor: activeTab === "file" ? "pointer" : "default",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Gradient Border */}
        <div
          style={{
            position: "absolute",
            inset: "-2px",
            borderRadius: "20px",
            padding: "5px",
            background: isDragging 
              ? "linear-gradient(270deg, #00c6ff, #bc13fe, #ff0080, #00c6ff)"
              : "linear-gradient(270deg, rgba(0,198,255,0.6), rgba(188,19,254,0.6), rgba(255,0,128,0.6), rgba(0,198,255,0.6))",
            backgroundSize: "400% 400%",
            animation: "gradientFlow 8s ease infinite",
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            pointerEvents: "none",
            opacity: isDragging ? 1 : 0.6,
            transition: "opacity 0.3s ease",
            zIndex: 0,
          }}
        />

        {/* Animated gradient background */}
        {isDragging && activeTab === "file" && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(270deg, rgba(0,198,255,0.2), rgba(188,19,254,0.2), rgba(255,0,128,0.2))",
              backgroundSize: "400% 400%",
              animation: "gradientFlow 3s ease infinite",
              pointerEvents: "none",
            }}
          />
        )}

        {/* FILE UPLOAD TAB */}
        {activeTab === "file" && (
          <>
            {/* Upload Icon */}
            <div
              style={{
                animation: isDragging ? "none" : "float 3s ease-in-out infinite",
                zIndex: 1,
              }}
            >
              <Upload size={64} color="#00c6ff" strokeWidth={1.5} />
            </div>

            {/* Text */}
            <div style={{ textAlign: "center", zIndex: 1 }}>
              <h3
                style={{
                  color: "#fff",
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: "1.5rem",
                  marginBottom: "10px",
                }}
              >
                {isDragging ? "Drop your document here" : "Drag & drop your document here"}
              </h3>
              <p
                style={{
                  color: "rgba(255, 255, 255, 0.6)",
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: "1rem",
                }}
              >
                or click to browse files
              </p>
            </div>

            {/* OR Divider */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                maxWidth: "400px",
                gap: "15px",
                zIndex: 1,
              }}
            >
              <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.3)" }} />
              <span style={{ color: "#aaa", fontSize: "0.9rem", fontFamily: "Montserrat, sans-serif" }}>
                OR
              </span>
              <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.3)" }} />
            </div>

            {/* Browse Button */}
            <button
              style={{
                padding: "14px 40px",
                borderRadius: "25px",
                border: "1px solid rgba(255,255,255,0.3)",
                background: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(15px)",
                color: "#fff",
                fontSize: "1.1rem",
                fontWeight: 600,
                fontFamily: "Montserrat, sans-serif",
                cursor: "pointer",
                transition: "all 0.3s ease",
                zIndex: 1,
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "rgba(0, 198, 255, 0.2)";
                e.target.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "rgba(255,255,255,0.08)";
                e.target.style.transform = "scale(1)";
              }}
            >
              Browse Files
            </button>

            {/* Supported Formats */}
            <p
              style={{
                color: "rgba(255, 255, 255, 0.5)",
                fontSize: "0.85rem",
                fontFamily: "Montserrat, sans-serif",
                zIndex: 1,
              }}
            >
              Supported formats: PDF, DOCX, TXT (Max 10MB)
            </p>
          </>
        )}

        {/* TEXT INPUT TAB */}
        {activeTab === "text" && (
          <>
            {/* Character Counter */}
            <div style={{
              width: "100%",
              textAlign: "right",
              color: textInput.length >= 10000 ? "#F44336" : "rgba(255,255,255,0.6)",
              fontSize: "0.85rem",
              fontFamily: "Montserrat, sans-serif",
              marginBottom: "10px",
              zIndex: 1,
            }}>
              {textInput.length} / 10,000 characters
            </div>

            {/* Textarea */}
            <textarea
              value={textInput}
              onChange={(e) => {
                if (e.target.value.length <= 10000) {
                  setTextInput(e.target.value);
                }
              }}
              placeholder="Paste your legal document text here...&#10;&#10;Example: The petitioner filed a case against the respondent on January 15, 2024. The main issue is whether..."
              style={{
                width: "100%",
                height: "280px",
                padding: "20px",
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.2)",
                background: "rgba(255,255,255,0.08)",
                color: "#fff",
                fontSize: "0.95rem",
                fontFamily: "Montserrat, sans-serif",
                lineHeight: "1.6",
                outline: "none",
                resize: "none",
                zIndex: 1,
              }}
            />

            {/* Analyze Button */}
            <button
              onClick={handleTextAnalysis}
              disabled={textInput.trim().length < 50}
              style={{
                padding: "14px 40px",
                borderRadius: "25px",
                border: "1px solid rgba(188, 19, 254, 0.5)",
                background: textInput.trim().length >= 50 ? "rgba(188, 19, 254, 0.2)" : "rgba(255,255,255,0.08)",
                backdropFilter: "blur(15px)",
                color: textInput.trim().length >= 50 ? "#bc13fe" : "rgba(255,255,255,0.5)",
                fontSize: "1.1rem",
                fontWeight: 600,
                fontFamily: "Montserrat, sans-serif",
                cursor: textInput.trim().length >= 50 ? "pointer" : "not-allowed",
                transition: "all 0.3s ease",
                zIndex: 1,
                opacity: textInput.trim().length >= 50 ? 1 : 0.5,
              }}
              onMouseEnter={(e) => {
                if (textInput.trim().length >= 50) {
                  e.target.style.background = "rgba(188, 19, 254, 0.3)";
                  e.target.style.transform = "scale(1.05)";
                }
              }}
              onMouseLeave={(e) => {
                if (textInput.trim().length >= 50) {
                  e.target.style.background = "rgba(188, 19, 254, 0.2)";
                  e.target.style.transform = "scale(1)";
                }
              }}
            >
              Analyze Text
            </button>

            {/* Info Text */}
            <p style={{
              color: "rgba(255, 255, 255, 0.5)",
              fontSize: "0.85rem",
              fontFamily: "Montserrat, sans-serif",
              zIndex: 1,
            }}>
              Minimum 50 characters required
            </p>
          </>
        )}

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.txt"
          onChange={handleFileInput}
          style={{ display: "none" }}
        />

        {/* Add floating animation keyframes */}
        <style>
          {`
            @keyframes float {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-20px); }
            }
            
            @keyframes gradientFlow {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
          `}
        </style>
      </div>
    </>
  );
}