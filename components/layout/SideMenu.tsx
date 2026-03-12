"use client";

import { useState } from "react";

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onTabChange: (tab: string) => void;
}

const ACCENT = "#1B2A47";

export default function SideMenu({ isOpen, onClose, onTabChange }: SideMenuProps) {
  const [tabsOpen, setTabsOpen] = useState(false);
  const [genreOpen, setGenreOpen] = useState(false);

  const navigate = (tab: string) => { onTabChange(tab); onClose(); };

  const Chevron = ({ open }: { open: boolean }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
      style={{ width: 13, height: 13, flexShrink: 0, transition: "transform 0.2s", transform: open ? "rotate(90deg)" : "rotate(0deg)" }}>
      <path d="M9 18l6-6-6-6"/>
    </svg>
  );

  const groupBtn: React.CSSProperties = {
    display: "flex", alignItems: "center", gap: 10,
    background: "none", border: "none", cursor: "pointer",
    fontFamily: "'Inter', sans-serif", fontWeight: 600,
    fontSize: "1.05rem", color: "var(--text-main)",
    padding: "10px 0", width: "100%", textAlign: "left",
  };

  const linkBtn: React.CSSProperties = {
    background: "none", border: "none", cursor: "pointer",
    fontFamily: "'Inter', sans-serif", fontSize: "0.95rem",
    color: "var(--text-main)", padding: 0, textAlign: "left",
  };

  return (
    <>
      <div onClick={onClose} style={{
        position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.45)", zIndex: 99,
        opacity: isOpen ? 1 : 0, visibility: isOpen ? "visible" : "hidden",
        transition: "opacity 0.28s ease, visibility 0.28s ease",
      }} />

      <div style={{
        position: "fixed", top: 0, left: isOpen ? 0 : -380,
        width: 320, height: "100vh",
        backgroundColor: "var(--bg)", zIndex: 100,
        boxShadow: "6px 0 28px rgba(0,0,0,0.14)",
        transition: "left 0.28s ease",
        display: "flex", flexDirection: "column",
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "26px 28px 20px" }}>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-main)", padding: 0 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6"  x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: "1.15rem", color: ACCENT }}>
            Menu
          </span>
        </div>

        {/* Nav */}
        <div style={{ flex: 1, overflowY: "auto", padding: "4px 28px 20px" }}>
          {/* Tabs */}
          <div style={{ marginBottom: 4 }}>
            <button style={groupBtn} onClick={() => setTabsOpen(!tabsOpen)}>
              <Chevron open={tabsOpen} /> Tabs
            </button>
            {tabsOpen && (
              <ul style={{ listStyle: "none", paddingLeft: 24, margin: "4px 0 10px", display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  { id: "recent",   label: "Recent Stories" },
                  { id: "podcasts", label: "Podcast" },
                  { id: "shorts",   label: "Short Reads" },
                  { id: "about",    label: "About Us" },
                ].map((item) => (
                  <li key={item.id}>
                    <button style={linkBtn} onClick={() => navigate(item.id)}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = ACCENT)}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-main)")}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Genre */}
          <div>
            <button style={groupBtn} onClick={() => setGenreOpen(!genreOpen)}>
              <Chevron open={genreOpen} /> Genre
            </button>
            {genreOpen && (
              <ul style={{ listStyle: "none", paddingLeft: 24, margin: "4px 0 10px", display: "flex", flexDirection: "column", gap: 14 }}>
                {["Automotive", "Geo Politics", "Scandals", "Crime", "Explainers"].map((g) => (
                  <li key={g}>
                    <a href="#" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.95rem", color: "var(--text-main)", textDecoration: "none" }}
                      onMouseEnter={(e) => ((e.target as HTMLElement).style.color = ACCENT)}
                      onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "var(--text-main)")}
                    >
                      {g}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Login button at bottom */}
        <div style={{ padding: "16px 28px 28px", borderTop: "1px solid var(--border)" }}>
          <a href="/login" style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            backgroundColor: "var(--text-main)", color: "white",
            padding: "11px 0", borderRadius: 8,
            fontSize: "0.88rem", fontWeight: 600,
            fontFamily: "'Inter', sans-serif", textDecoration: "none", width: "100%",
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="12" cy="8" r="4"/>
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
            </svg>
            Login / Sign up
          </a>
        </div>
      </div>
    </>
  );
}
