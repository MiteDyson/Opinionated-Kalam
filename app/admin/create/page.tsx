"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const BG   = "#D5D2CB";
const TEXT = "#1A1A1A";
const MUTED = "#555555";
const ACCENT = "#1B2A47";
const TERRA  = "#D38B88";

const OPTIONS = [
  {
    href:  "/admin/articles/new",
    icon:  "📄",
    label: "Article",
    desc:  "Long-form written piece with rich formatting",
    accent: ACCENT,
  },
  {
    href:  "/admin/shorts/new",
    icon:  "⚡",
    label: "Short Read",
    desc:  "Quick fact, explainer, or timeline under 500 words",
    accent: "#b85c58",
  },
  {
    href:  "/admin/podcasts/new",
    icon:  "🎙",
    label: "Podcast",
    desc:  "Audio episode with cover image and show notes",
    accent: "#3a7a3e",
  },
];

export default function CreatePage() {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: BG, color: TEXT, display: "flex", flexDirection: "column" }}>

      {/* Top bar */}
      <div style={{ backgroundColor: TEXT, padding: isMobile ? "0 16px" : "0 26px", display: "flex", alignItems: "center", gap: 14, height: isMobile ? 48 : 52 }}>
        <button onClick={() => router.push("/admin")} style={{ background: "none", border: "none", cursor: "pointer", color: "#888", display: "flex", alignItems: "center", gap: 6, fontSize: "0.83rem", fontFamily: "'Inter', sans-serif" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          Back
        </button>
        <span style={{ color: "rgba(255,255,255,0.15)" }}>|</span>
        <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.1rem", color: "white" }}>Create</span>
      </div>

      {/* Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: isMobile ? "40px 20px" : "60px 24px" }}>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ fontFamily: "'DM Serif Display', serif", fontSize: isMobile ? "1.8rem" : "2.2rem", color: TEXT, marginBottom: 8, textAlign: "center" }}
        >
          What are you creating?
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ fontFamily: "'Inter', sans-serif", fontSize: isMobile ? "0.83rem" : "0.88rem", color: MUTED, marginBottom: isMobile ? 32 : 48, textAlign: "center" }}
        >
          Pick a content type to get started
        </motion.p>

        <div style={{ display: "flex", gap: isMobile ? 12 : 20, flexDirection: isMobile ? "column" : "row", flexWrap: "wrap", justifyContent: "center", maxWidth: 780, width: "100%" }}>
          {OPTIONS.map((opt, i) => (
            <motion.button
              key={opt.label}
              onClick={() => router.push(opt.href)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              style={{
                width: isMobile ? "100%" : 220, padding: isMobile ? "24px" : "32px 24px 28px",
                backgroundColor: "white", border: `2px solid #CFCBC3`,
                borderRadius: 14, cursor: "pointer",
                display: "flex", flexDirection: isMobile ? "row" : "column", alignItems: "center", gap: 12,
                transition: "all 0.18s", textAlign: isMobile ? "left" : "center",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = opt.accent;
                if (!isMobile) el.style.transform = "translateY(-3px)";
                el.style.boxShadow = `0 8px 28px rgba(0,0,0,0.1)`;
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "#CFCBC3";
                if (!isMobile) el.style.transform = "translateY(0)";
                el.style.boxShadow = "none";
              }}
            >
              <span style={{ fontSize: isMobile ? "1.8rem" : "2.4rem", lineHeight: 1 }}>{opt.icon}</span>
              <div style={{ flex: 1 }}>
                <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: isMobile ? "1.1rem" : "1.3rem", color: TEXT, display: "block" }}>{opt.label}</span>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.74rem", color: MUTED, lineHeight: 1.4, display: "block", marginTop: 2 }}>{opt.desc}</span>
              </div>
              <span style={{ marginTop: isMobile ? 0 : 4, padding: "5px 16px", borderRadius: 20, backgroundColor: opt.accent, color: "white", fontSize: "0.75rem", fontWeight: 700, fontFamily: "'Inter', sans-serif" }}>
                {isMobile ? "→" : "Create →"}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
