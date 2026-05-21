"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // 1000ms min loading time to feel punchy and fast
    const minLoadTime = 1000;
    const startTime = Date.now();

    const handleLoad = () => {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minLoadTime - elapsedTime);

      setTimeout(() => {
        setIsVisible(false);
        // Unlock scroll as the curtain raise begins for premium responsiveness
        document.body.style.overflow = "auto";
      }, remainingTime);
    };

    // Lock scroll on mount
    document.body.style.overflow = "hidden";

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
      return () => {
        window.removeEventListener("load", handleLoad);
        document.body.style.overflow = "auto";
      };
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const text = "Opinionated Kalam";
  const words = text.split(" ");

  // Framer Motion Variants for Staggered Letter Reveal
  const containerVariants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.025, // Fast and responsive delay between letters
        delayChildren: 0.15,
      },
    },
  };

  const letterVariants = {
    initial: { opacity: 0, y: 12 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.45,
        ease: [0.16, 1, 0.3, 1] as const, // Smooth custom ease-out
      },
    },
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 0 }}
          exit={{
            y: "-100%",
            transition: {
              duration: 0.8,
              ease: [0.76, 0, 0.24, 1] as const, // Classic premium editorial raise curve
            },
          }}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "#f4efea", // Site background token (--bg)
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999999,
          }}
        >
          {/* Logo & Ring Wrapper */}
          <div
            className="logo-wrapper"
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Framer Motion Pulsing Halo Ring */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{
                scale: [0.8, 1.25, 1.45],
                opacity: [0, 0.45, 0],
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                position: "absolute",
                width: "140%",
                height: "140%",
                border: "1px solid rgba(27, 42, 71, 0.15)",
                borderRadius: "50%",
                pointerEvents: "none",
              }}
            />

            {/* Logo Pop-in with spring physics */}
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 110,
                damping: 14,
              }}
            >
              {/* Gentle Floating Loop */}
              <motion.img
                src="/loader.png"
                alt="Opinionated Kalam"
                className="preloader-logo"
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{
                  width: "clamp(120px, 25vw, 200px)",
                  height: "auto",
                  filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.05))",
                }}
              />
            </motion.div>
          </div>

          {/* Premium Staggered Letter Text Reveal */}
          <motion.div
            variants={containerVariants}
            initial="initial"
            animate="animate"
            style={{
              marginTop: "32px",
              fontFamily: "'DM Serif Display', serif",
              fontSize: "clamp(1.4rem, 4vw, 2.2rem)",
              color: "#1a1a1a",
              textAlign: "center",
              letterSpacing: "-0.5px",
              display: "flex",
              gap: "0.28em",
            }}
          >
            {words.map((word, wordIdx) => (
              <span
                key={wordIdx}
                style={{ display: "inline-flex", whiteSpace: "nowrap" }}
              >
                {word.split("").map((char, charIdx) => (
                  <motion.span
                    key={charIdx}
                    variants={letterVariants}
                    style={{ display: "inline-block" }}
                  >
                    {char}
                  </motion.span>
                ))}
              </span>
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
