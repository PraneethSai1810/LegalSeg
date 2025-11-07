import React, { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function About() {
  const steps = [
    { title: "Upload Document", text: "Upload a judgement or text to get started." },
    { title: "Legal Longfromer", text: "Longformer processes and extracts context-rich embeddings." },
    { title: "Transformer", text: "Transformer captures global context from the text." },
    { title: "CRF", text: "CRF assigns labels and segments the document." },
    { title: "Output", text: "Get clean structured legal segments for easy research." },
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev < steps.length - 1 ? prev + 1 : 0));
    }, 3000);

    return () => clearInterval(interval);
  }, [steps.length]);

  const handlePrev = () => {
    if (current > 0) setCurrent((prev) => prev - 1);
  };

  const handleNext = () => {
    if (current < steps.length - 1) setCurrent((prev) => prev + 1);
  };

  return (
    <section
      id="about"
      className="about-section"
      style={{
        minHeight: "100vh",
        padding: "60px 20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        color: "#fff",
        textAlign: "center",
        position: "relative",
        justifyContent: "flex-start",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "linear-gradient(90deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.6) 100%)",
          zIndex: 0,
        }}
      />
<h2
  className="about-title"
  style={{
    fontSize: "4.3rem",
    fontWeight: "500",
    lineHeight: "1.25",
    marginBottom: "40px",
    marginTop: "10px",
    fontFamily: "'Great Vibes', cursive",
    letterSpacing: "0.5px",
    background: "linear-gradient(90deg, #00c6ff, #bc13fe, #ff0080)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    position: "relative",
    zIndex: 1,
    textAlign: "center",
    maxWidth: "90%",
  }}
>
  From Legal Docs to Lasting Insights.
</h2>

      <div
        className="about-carousel"
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "380px",
          overflow: "hidden",
          zIndex: 1,
          marginBottom: "50px",
        }}
      >
        {current > 0 && (
          <button
            onClick={handlePrev}
            className="about-arrow-left"
            style={{
              position: "absolute",
              left: "200px",
              zIndex: 2,
              background: "rgba(0,0,0,0.7)",
              border: "1px solid rgba(255,255,255,0.3)",
              borderRadius: "50%",
              width: "50px",
              height: "50px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              padding: "0",
            }}
          >
            <ArrowLeft size={24} color="#fff" strokeWidth={2.5} />
          </button>
        )}

        <div
          className="about-cards-container"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            position: "relative",
          }}
        >
          {steps.map((step, index) => {
            const offset = index - current;
            if (Math.abs(offset) > 4) return null;

            const scale = offset === 0 ? 1 : 0.94;
            const translateX = offset * 70;
            const zIndex = 10 - Math.abs(offset);
            const opacity = 1 - Math.abs(offset) * 0.15;

            return (
              <div
                key={index}
                className="about-card"
                style={{
                  position: "absolute",
                  transform: `translateX(${translateX}px) scale(${scale})`,
                  transition: "all 0.6s ease",
                  zIndex,
                  opacity,
                  width: "340px",
                  height: "230px",
                  padding: "16px",
                  borderRadius: "18px",
                  background: "rgba(20, 20, 20, 0.55)",
                  border: "1px solid rgba(247, 238, 238, 0.25)",
                  backdropFilter: "blur(6px)",
                  boxShadow: "0 6px 18px rgba(0,0,0,0.5)",
                  textAlign: "center",
                }}
              >
                <h3
                  style={{
                    fontSize: "2rem",
                    marginBottom: "14px",
                    background: "linear-gradient(90deg, #00c6ff, #bc13fe, #ff0080)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    fontSize: "1.8rem",
                    lineHeight: "1.6",
                    color: "#fff",
                  }}
                >
                  {step.text}
                </p>
              </div>
            );
          })}
        </div>

        {current < steps.length + 3 && (
          <button
            onClick={handleNext}
            className="about-arrow-right"
            style={{
              position: "absolute",
              right: "200px",
              zIndex: 2,
              background: "rgba(0,0,0,0.7)",
              border: "1px solid rgba(255,255,255,0.3)",
              borderRadius: "50%",
              width: "50px",
              height: "50px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              padding: "0",
            }}
          >
            <ArrowRight size={24} color="#fff" strokeWidth={2.5} />
          </button>
        )}
      </div>
    </section>
  );
}
