import React, { useState } from "react";
import { motion } from "framer-motion";

export default function Hero() {
  const [showModal, setShowModal] = useState(false);

  return (
    <section
      id="home"
      className="hero-section"
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        color: "#fff",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "relative",
          zIndex: 2,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          marginTop: "-50px",
        }}
      >
        <motion.h1
          className="hero-title"
          style={{
            fontSize: "11rem",
            fontFamily: "Bebas Neue, sans-serif",
            fontWeight: 400,
            display: "flex",
            gap: "1rem",
            marginBottom: "1rem",
          }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2 }}
        >
          <span
            style={{
              color: "black",
              WebkitTextStroke: "0.8px white",
            }}
          >
            Legal
          </span>
          <span style={{ color: "white" }}>Seg</span>
        </motion.h1>

        <motion.p
          className="hero-subtitle"
          style={{
            fontSize: "2.5rem",
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 300,
            letterSpacing: "-0.3px",
            color: "#f0f0f0",
            maxWidth: "900px",
            lineHeight: "1.3",
          }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2 }}
        >
          Unlocking the Structure of Indian Legal Judgements
          <br />
          Through{" "}
          <motion.span
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              background:
                "linear-gradient(90deg, #00c6ff, #bc13fe, #ff0080, #00c6ff)",
              backgroundSize: "200% 200%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: 600,
              display: "inline-block",
            }}
          >
            Rhetorical
          </motion.span>{" "}
          Role Classification.
        </motion.p>

        <div
          style={{
            marginTop: "2rem",
            display: "inline-block",
            borderRadius: "9999px",
            padding: "2px",
            background:
              "linear-gradient(90deg, #ff0080, #7928ca, #00c6ff, #ff0080)",
            backgroundSize: "200% 200%",
            animation: "gradientMove 3s linear infinite, pulse 2.5s infinite",
          }}
        >
          <button
            onClick={() => setShowModal(true)}
            style={{
              padding: "0.8rem 2rem",
              fontSize: "1.2rem",
              fontFamily: "Montserrat, sans-serif",
              color: "white",
              border: "none",
              borderRadius: "9999px",
              background: "black",
              cursor: "pointer",
            }}
          >
            What is LegalSeg?
          </button>
        </div>
      </div>

      {showModal && (
        <div
          onClick={() => setShowModal(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(5px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              background: "#111",
              padding: "2rem",
              borderRadius: "16px",
              maxWidth: "600px",
              width: "90%",
              color: "white",
              textAlign: "center",
              boxShadow: "0 8px 20px rgba(0,0,0,0.5)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "16px",
                padding: "2px",
                background:
                  "linear-gradient(90deg, #ff0080, #7928ca, #00c6ff, #ff0080)",
                backgroundSize: "200% 200%",
                animation: "gradientMove 3s linear infinite",
                zIndex: 0,
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "14px",
                  background: "#111",
                }}
              ></div>
            </div>

            <button
              onClick={() => setShowModal(false)}
              style={{
                position: "absolute",
                top: "10px",
                right: "15px",
                background: "transparent",
                border: "none",
                fontSize: "1.5rem",
                color: "#fff",
                cursor: "pointer",
                zIndex: 2,
              }}
            >
              ✕
            </button>

            <h2
              style={{
                fontSize: "2rem",
                fontFamily: "Montserrat, sans-serif",
                fontWeight: "bold",
                background:
                  "linear-gradient(90deg, #ff0080, #7928ca, #00c6ff, #ff0080)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                marginBottom: "1rem",
                position: "relative",
                zIndex: 2,
              }}
            >
              What is LegalSeg?
            </h2>
            <p
              style={{
                fontSize: "1.1rem",
                lineHeight: "1.5",
                position: "relative",
                zIndex: 2,
              }}
            >
              LegalSeg is an advanced AI-powered tool designed to unlock the
              structure of Indian legal judgements. By leveraging Rhetorical Role
              Classification, it helps in breaking down complex legal documents into
              meaningful segments, making legal research and understanding easier
              for lawyers, students, and researchers.
            </p>
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes gradientMove {
            0% { background-position: 0% 50%; }
            100% { background-position: 100% 50%; }
          }

          @keyframes pulse {
            0%, 100% {
              transform: scale(1);
              box-shadow: 0 0 0px rgba(255,0,128,0.6);
            }
            50% {
              transform: scale(1.05);
              box-shadow: 0 0 20px rgba(255,0,128,0.6), 0 0 40px rgba(0,198,255,0.4);
            }
          }
        `}
      </style>
    </section>
  );
}
