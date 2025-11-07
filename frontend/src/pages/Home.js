import React, { useRef } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import About from "../components/About";
import More from "../components/More";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

export default function Home() {
  const heroRef = useRef(null);
  const aboutRef = useRef(null);
  const moreRef = useRef(null); // ✅ added this line

  useDocumentTitle("Home | LegalSeg");

  const scrollToSection = (section) => {
    if (section === "hero" && heroRef.current) {
      heroRef.current.scrollIntoView({ behavior: "smooth" });
    } else if (section === "about" && aboutRef.current) {
      aboutRef.current.scrollIntoView({ behavior: "smooth" });
    } else if (section === "more" && moreRef.current) { // ✅ added for "More"
      moreRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <Navbar scrollToSection={scrollToSection} />
      <div ref={heroRef}>
        <Hero />
      </div>
      <div ref={aboutRef}>
        <About />
      </div>
      <div ref={moreRef}>
        <More />
      </div>
    </>
  );
}
