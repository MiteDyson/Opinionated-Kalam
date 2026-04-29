"use client";

import { useEffect, useState } from "react";

export default function Preloader() {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // We want the preloader to show for at least 1.5 seconds to make it feel intentional
    const minLoadTime = 1500;
    const startTime = Date.now();

    const handleLoad = () => {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minLoadTime - elapsedTime);

      setTimeout(() => {
        setIsFading(true);
        setTimeout(() => {
          setIsVisible(false);
          // Re-enable scrolling if it was disabled
          document.body.style.overflow = "auto";
        }, 600); // Match this with CSS transition duration
      }, remainingTime);
    };

    // Disable scrolling while preloader is active
    document.body.style.overflow = "hidden";

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
      return () => window.removeEventListener("load", handleLoad);
    }
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`preloader-overlay ${isFading ? "fade-out" : ""}`}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "#f4efea", // --bg token
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999999,
        transition: "opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), visibility 0.6s",
        opacity: isFading ? 0 : 1,
        visibility: isFading ? "hidden" : "visible",
      }}
    >
      <div className="logo-wrapper">
        <img
          src="/loader.png"
          alt="Opinionated Kalam"
          className="preloader-logo"
          style={{
            width: "clamp(120px, 25vw, 200px)",
            height: "auto",
          }}
        />
      </div>

      <div className="loader-text" style={{ 
        marginTop: "32px", 
        fontFamily: "'DM Serif Display', serif", 
        fontSize: "clamp(1.4rem, 4vw, 2.2rem)", 
        color: "#1a1a1a",
        textAlign: "center",
        opacity: isFading ? 0 : 0.9,
        transform: isFading ? "translateY(15px)" : "translateY(0)",
        transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
        letterSpacing: "-0.5px"
      }}>
        Opinionated Kalam
      </div>

      <style jsx global>{`
        .preloader-logo {
          animation: logo-float 3s ease-in-out infinite;
          filter: drop-shadow(0 10px 20px rgba(0,0,0,0.05));
        }

        .logo-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .logo-wrapper::after {
          content: '';
          position: absolute;
          width: 140%;
          height: 140%;
          border: 1px solid rgba(27, 42, 71, 0.1);
          border-radius: 50%;
          animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }

        @keyframes logo-float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-10px) scale(1.02); }
        }

        @keyframes pulse-ring {
          0% { transform: scale(0.8); opacity: 0; }
          50% { opacity: 0.5; }
          100% { transform: scale(1.2); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
