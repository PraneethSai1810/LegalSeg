import React from "react";
import { motion } from "framer-motion";
import { scroller } from "react-scroll";
import { useNavigate } from "react-router-dom";

export default function More() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    // Option 1: Scroll back to Hero (signup button area)
    scroller.scrollTo("home", {
      duration: 800,
      delay: 0,
      smooth: "easeInOutQuart",
      offset: -80,
    });

    // Option 2: If you prefer direct login page navigation instead:
    // navigate("/login");
  };

  return (
    <section
      id="more"
      style={{
        minHeight: "100vh",
        padding: "40px 20px",
        background: "transparent",
        color: "#fff",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* background overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(90deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.7) 100%)",
          zIndex: 0,
        }}
      />

      {/* MAIN TITLE */}
      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        style={{
          fontSize: "4.5rem",
          fontWeight: "500",
          marginBottom: "30px",
          fontFamily: "'Great Vibes', cursive",
          background: "linear-gradient(90deg, #00c6ff, #bc13fe, #ff0080)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          position: "relative",
          zIndex: 2,
        }}
      >
        Explore More — Why LegalSeg Matters
      </motion.h2>

      {/* USE CASES SECTION */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        style={{
          width: "100%",
          maxWidth: "1100px",
          scrollMarginTop: "10px",
          zIndex: 2,
        }}
      >
        <h3
          style={{
            fontSize: "2.4rem",
            fontFamily: "Montserrat, sans-serif",
            fontWeight: "600",
            marginBottom: "20px",
            background: "linear-gradient(90deg, #00c6ff, #bc13fe, #ff0080)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Who Can Use LegalSeg?
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "2rem",
            marginTop: "2rem",
          }}
        >
          {[
            {
              title: "Lawyers",
              desc: "Speed up your case preparation by automatically segmenting judgments into meaningful parts.",
            },
            {
              title: "Students",
              desc: "Understand judgment flow, rhetorical reasoning, and improve your legal writing.",
            },
            {
              title: "Researchers",
              desc: "Extract labeled data for advanced NLP, legal analytics, and citation pattern mining.",
            },
          ].map((user, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              style={{
                background: "rgba(20, 20, 20, 0.55)",
                border: "1px solid rgba(255,255,255,0.25)",
                borderRadius: "18px",
                padding: "2rem",
                backdropFilter: "blur(8px)",
                boxShadow: "0 6px 20px rgba(0,0,0,0.5)",
              }}
            >
              <h4
                style={{
                  fontSize: "1.8rem",
                  marginBottom: "10px",
                  background:
                    "linear-gradient(90deg, #00c6ff, #bc13fe, #ff0080)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {user.title}
              </h4>
              <p style={{ fontSize: "1.1rem", lineHeight: "1.6" }}>
                {user.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

{/* CONTACT + GET STARTED SIDE BY SIDE */}
<motion.div
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  transition={{ duration: 1 }}
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    width: "100%",
    maxWidth: "1100px",
    marginTop: "20px",
    borderTop: "1px solid rgba(255,255,255,0.2)",
    paddingTop: "10px",
    zIndex: 2,
  }}
>
  {/* LEFT SIDE – CONTACT */}
  <div
    style={{
      textAlign: "left",
      flex: 1,
      minWidth: "250px",
    }}
  >
    <h3
      style={{
        fontSize: "1.8rem",
        background: "linear-gradient(90deg, #00c6ff, #bc13fe, #ff0080)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        marginBottom: "10px",
      }}
    >
      Contact
    </h3>
    <p style={{ fontSize: "1.1rem", marginBottom: "8px" }}>
      📧{" "}
      <a
        href="mailto:praneeth@example.com"
        style={{
          color: "#fff",
          textDecoration: "none",
          borderBottom: "1px solid rgba(255,255,255,0.4)",
        }}
      >
        legalseg2025@gmail.com
      </a>
    </p>
  </div>

  {/* RIGHT SIDE – GET STARTED BUTTON */}
  <div
    style={{
      flex: 1,
      minWidth: "250px",
      textAlign: "right",
    }}
  >
    <div
      style={{
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
        onClick={() =>
          scroller.scrollTo("home", {
            duration: 800,
            smooth: "easeInOutQuart",
            offset: -80,
          })
        }
        style={{
          padding: "1rem 2.5rem",
          fontSize: "1.2rem",
          fontFamily: "Montserrat, sans-serif",
          color: "white",
          border: "none",
          borderRadius: "9999px",
          background: "black",
          cursor: "pointer",
        }}
      >
        Get Started
      </button>
    </div>
  </div>
</motion.div>


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
