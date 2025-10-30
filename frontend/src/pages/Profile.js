// src/pages/Profile.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardNavbar from "../components/DashboardNavbar";
import { Mail, Calendar, Shield, Edit2, Save, X } from "lucide-react";
import { getUserProfile, updateUserProfile } from "../utils/api";
import { toast } from "react-toastify";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

export default function Profile() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    authMethod: "",
    createdAt: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  useDocumentTitle("Profile | LegalSeg");

  useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) {
    navigate('/signin');
    return;
  }

  // fetch from backend
  const fetchProfile = async () => {
    try {
      const user = await getUserProfile();
      setUserData({
        fullName: user.name,
        email: user.email,
        authMethod: user.authMethod || "email",
        createdAt: user.createdAt,
      });
      setEditedName(user.name);
    } catch (err) {
      console.error("Error fetching profile:", err);
      navigate('/signin');
    }
  };
  
  fetchProfile();
}, [navigate]);


 const handleSave = async () => {
  try {
    const response = await updateUserProfile({ name: editedName });
    setUserData({ ...userData, fullName: response.user.name });
    setIsEditing(false);
    toast.success("Profile updated successfully!");
  } catch (err) {
    console.error("Error updating profile:", err);
    toast.success("Failed to update profile");
  }
};


  const handleCancel = () => {
    setEditedName(userData.fullName);
    setIsEditing(false);
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)",
      }}
    >
      <DashboardNavbar username={userData.fullName.split(' ')[0]} />

      <div
        style={{
          marginTop: "70px",
          padding: "40px",
          maxWidth: "900px",
          margin: "70px auto 0",
        }}
      >
        {/* Header */}
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          marginBottom: "30px" 
        }}>
          <h1
            style={{
              color: "#fff",
              fontFamily: "Montserrat, sans-serif",
              fontSize: "2.5rem",
              margin: 0,
            }}
          >
            Profile
          </h1>
          <button
            onClick={() => navigate("/dashboard")}
            style={{
              padding: "10px 24px",
              borderRadius: "12px",
              border: "1px solid rgba(0, 198, 255, 0.5)",
              background: "rgba(0, 198, 255, 0.1)",
              color: "#00c6ff",
              fontSize: "0.95rem",
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => e.target.style.background = "rgba(0, 198, 255, 0.2)"}
            onMouseLeave={(e) => e.target.style.background = "rgba(0, 198, 255, 0.1)"}
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* Main Profile Card */}
        <div
          style={{
            padding: "40px",
            borderRadius: "20px",
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            marginBottom: "30px",
            position: "relative",
          }}
        >
          {/* Profile Picture Section */}
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <div
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #00c6ff, #bc13fe, #ff0080)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
                fontSize: "3rem",
                color: "#fff",
                fontWeight: "bold",
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              {getInitials(userData.fullName)}
            </div>

            {/* Editable Name */}
            {isEditing ? (
              <div style={{ 
                display: "flex", 
                justifyContent: "center", 
                alignItems: "center",
                gap: "10px",
                marginBottom: "10px"
              }}>
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "8px",
                    border: "1px solid rgba(0, 198, 255, 0.5)",
                    background: "rgba(255, 255, 255, 0.1)",
                    color: "#fff",
                    fontSize: "1.5rem",
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: 600,
                    textAlign: "center",
                    outline: "none",
                  }}
                />
                <button
                  onClick={handleSave}
                  style={{
                    padding: "8px",
                    borderRadius: "8px",
                    border: "none",
                    background: "rgba(76, 175, 80, 0.2)",
                    color: "#4CAF50",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => e.target.style.background = "rgba(76, 175, 80, 0.3)"}
                  onMouseLeave={(e) => e.target.style.background = "rgba(76, 175, 80, 0.2)"}
                >
                  <Save size={20} />
                </button>
                <button
                  onClick={handleCancel}
                  style={{
                    padding: "8px",
                    borderRadius: "8px",
                    border: "none",
                    background: "rgba(244, 67, 54, 0.2)",
                    color: "#F44336",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => e.target.style.background = "rgba(244, 67, 54, 0.3)"}
                  onMouseLeave={(e) => e.target.style.background = "rgba(244, 67, 54, 0.2)"}
                >
                  <X size={20} />
                </button>
              </div>
            ) : (
              <div style={{ 
                display: "flex", 
                justifyContent: "center", 
                alignItems: "center",
                gap: "10px",
                marginBottom: "10px"
              }}>
                <h2
                  style={{
                    color: "#fff",
                    fontFamily: "Montserrat, sans-serif",
                    fontSize: "2rem",
                    margin: 0,
                  }}
                >
                  {userData.fullName}
                </h2>
                <button
                  onClick={() => setIsEditing(true)}
                  style={{
                    padding: "6px",
                    borderRadius: "8px",
                    border: "none",
                    background: "rgba(0, 198, 255, 0.2)",
                    color: "#00c6ff",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => e.target.style.background = "rgba(0, 198, 255, 0.3)"}
                  onMouseLeave={(e) => e.target.style.background = "rgba(0, 198, 255, 0.2)"}
                >
                  <Edit2 size={16} />
                </button>
              </div>
            )}

            <p
              style={{
                color: "rgba(255, 255, 255, 0.6)",
                fontFamily: "Montserrat, sans-serif",
                fontSize: "1rem",
                margin: 0,
              }}
            >
              {userData.email}
            </p>
          </div>

          {/* Profile Details Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "20px",
            }}
          >
            {/* Email */}
            <div
              style={{
                padding: "20px",
                borderRadius: "12px",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "10px",
                marginBottom: "10px"
              }}>
                <Mail size={20} color="#00c6ff" />
                <span
                  style={{
                    color: "rgba(255, 255, 255, 0.6)",
                    fontSize: "0.85rem",
                    fontFamily: "Montserrat, sans-serif",
                    textTransform: "uppercase",
                  }}
                >
                  Email Address
                </span>
              </div>
              <p
                style={{
                  color: "#fff",
                  fontSize: "1rem",
                  fontFamily: "Montserrat, sans-serif",
                  margin: 0,
                }}
              >
                {userData.email}
              </p>
            </div>

            {/* Auth Method */}
            <div
              style={{
                padding: "20px",
                borderRadius: "12px",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "10px",
                marginBottom: "10px"
              }}>
                <Shield size={20} color="#bc13fe" />
                <span
                  style={{
                    color: "rgba(255, 255, 255, 0.6)",
                    fontSize: "0.85rem",
                    fontFamily: "Montserrat, sans-serif",
                    textTransform: "uppercase",
                  }}
                >
                  Auth Method
                </span>
              </div>
              <p
                style={{
                  color: "#fff",
                  fontSize: "1rem",
                  fontFamily: "Montserrat, sans-serif",
                  margin: 0,
                  textTransform: "capitalize",
                }}
              >
                {userData.authMethod === "google" ? "Google OAuth" : "Email & Password"}
              </p>
            </div>

            {/* Member Since */}
            <div
              style={{
                padding: "20px",
                borderRadius: "12px",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "10px",
                marginBottom: "10px"
              }}>
                <Calendar size={20} color="#4CAF50" />
                <span
                  style={{
                    color: "rgba(255, 255, 255, 0.6)",
                    fontSize: "0.85rem",
                    fontFamily: "Montserrat, sans-serif",
                    textTransform: "uppercase",
                  }}
                >
                  Member Since
                </span>
              </div>
              <p
                style={{
                  color: "#fff",
                  fontSize: "1rem",
                  fontFamily: "Montserrat, sans-serif",
                  margin: 0,
                }}
              >
                {formatDate(userData.createdAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Settings Section */}
        <div
          style={{
            padding: "30px",
            borderRadius: "20px",
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <h3
            style={{
              color: "#fff",
              fontFamily: "Montserrat, sans-serif",
              fontSize: "1.5rem",
              marginBottom: "20px",
            }}
          >
            Settings
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {/* Change Password */}
            <button
              onClick={() => navigate('/forgot-password')}
              style={{
                padding: "15px 20px",
                borderRadius: "12px",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                background: "rgba(255, 255, 255, 0.05)",
                color: "#fff",
                fontSize: "1rem",
                fontFamily: "Montserrat, sans-serif",
                textAlign: "left",
                cursor: "pointer",
                transition: "all 0.3s ease",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "rgba(0, 198, 255, 0.1)";
                e.target.style.borderColor = "#00c6ff";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "rgba(255, 255, 255, 0.05)";
                e.target.style.borderColor = "rgba(255, 255, 255, 0.2)";
              }}
            >
              <span>Change Password</span>
              <span>→</span>
            </button>

        
            {/* Delete Account */}
            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
                  localStorage.clear();
                  navigate('/');
                }
              }}
              style={{
                padding: "15px 20px",
                borderRadius: "12px",
                border: "1px solid rgba(244, 67, 54, 0.5)",
                background: "rgba(244, 67, 54, 0.1)",
                color: "#F44336",
                fontSize: "1rem",
                fontFamily: "Montserrat, sans-serif",
                textAlign: "left",
                cursor: "pointer",
                transition: "all 0.3s ease",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "rgba(244, 67, 54, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "rgba(244, 67, 54, 0.1)";
              }}
            >
              <span>Delete Account</span>
              <span>🗑️</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}