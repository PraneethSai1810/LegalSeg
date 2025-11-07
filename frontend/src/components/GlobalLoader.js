import React, { useEffect, useState } from "react";
import axios from "axios";

const GlobalLoader = () => {
  const [visible, setVisible] = useState(false);
  const [requests, setRequests] = useState(0);

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
  .loader-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(3px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    animation: fadeIn 0.3s ease-in-out;
  }

  .loader-ring {
    width: 55px;
    height: 55px;
    border-radius: 50%;
    border: 4px solid transparent;
    background: conic-gradient(
      from 0deg,
      #ff00cc,
      #00aaff,
      #ff00cc
    );
    -webkit-mask: 
      radial-gradient(farthest-side, transparent calc(100% - 6px), black 0);
    mask: 
      radial-gradient(farthest-side, transparent calc(100% - 6px), black 0);
    animation: spin 1s linear infinite;
    filter: drop-shadow(0 0 8px rgba(255, 0, 204, 0.6)) 
            drop-shadow(0 0 8px rgba(0, 170, 255, 0.6));
  }

  .loader-text {
    margin-top: 14px;
    font-size: 1.4rem;
    font-weight: 600;
    font-family: "Poppins", sans-serif;
    background: linear-gradient(90deg, #00aaff, #ff00cc);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-transform: uppercase;
    letter-spacing: 1px;
    animation: textGlow 2s ease-in-out infinite alternate;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @keyframes textGlow {
    from { text-shadow: 0 0 4px #00aaff, 0 0 8px #ff00cc; }
    to { text-shadow: 0 0 10px #ff00cc, 0 0 20px #00aaff; }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

    document.head.appendChild(style);

    const requestInterceptor = axios.interceptors.request.use((config) => {
      setRequests((prev) => prev + 1);
      setVisible(true);
      return config;
    });

    const responseInterceptor = axios.interceptors.response.use(
      (response) => {
        setRequests((prev) => {
          const newCount = prev - 1;
          if (newCount === 0) setVisible(false);
          return newCount;
        });
        return response;
      },
      (error) => {
        setRequests((prev) => {
          const newCount = prev - 1;
          if (newCount === 0) setVisible(false);
          return newCount;
        });
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
      document.head.removeChild(style);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="loader-overlay">
      <div className="loader-ring"></div>
      <h2 className="loader-text">LegalSeg</h2>
    </div>
  );
};

export default GlobalLoader;
