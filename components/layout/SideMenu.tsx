"use client";

import { useState } from "react";

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onTabChange: (tab: string) => void;
}

export default function SideMenu({ isOpen, onClose, onTabChange }: SideMenuProps) {
  const [tabsOpen, setTabsOpen] = useState(true);
  const [genreOpen, setGenreOpen] = useState(true);

  const navigate = (tab: string) => {
    onTabChange(tab);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.4)",
          zIndex: 99,
          opacity: isOpen ? 1 : 0,
          visibility: isOpen ? "visible" : "hidden",
          transition: "opacity 0.3s ease, visibility 0.3s ease",
        }}
      />

      {/* Drawer */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: isOpen ? 0 : -350,
          width: 310,
          height: "100vh",
          backgroundColor: "var(--bg)",
          zIndex: 100,
          padding: "36px 28px",
          boxShadow: "5px 0 20px rgba(0,0,0,0.12)",
          transition: "left 0.3s ease",
          overflowY: "auto",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 36 }}>
          <button
            onClick={onClose}
            style={{
              fontSize: "1.8rem",
              lineHeight: 0.7,
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text-main)",
            }}
          >
            ≡
          </button>
          <span style={{ fontWeight: 600, fontSize: "1.05rem" }}>Menu</span>
        </div>

        {/* Tabs group */}
        <div style={{ marginBottom: 28 }}>
          <button
            onClick={() => setTabsOpen(!tabsOpen)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontWeight: 600,
              fontSize: "1rem",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text-main)",
              marginBottom: 12,
              width: "100%",
              textAlign: "left",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{ width: 14, height: 14, transition: "transform 0.2s", transform: tabsOpen ? "rotate(90deg)" : "rotate(0deg)" }}
            >
              <path d="M9 18l6-6-6-6"/>
            </svg>
            Tabs
          </button>
          {tabsOpen && (
            <ul style={{ listStyle: "none", paddingLeft: 22, display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { id: "home", label: "Home" },
                { id: "recent", label: "Recent Uploads" },
                { id: "videos", label: "Videos" },
                { id: "shorts", label: "Short Reads" },
              ].map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => navigate(item.id)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "0.92rem",
                      color: "var(--text-main)",
                      fontFamily: "'Inter', sans-serif",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--red)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-main)")}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Genre group */}
        <div>
          <button
            onClick={() => setGenreOpen(!genreOpen)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontWeight: 600,
              fontSize: "1rem",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text-main)",
              marginBottom: 12,
              width: "100%",
              textAlign: "left",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{ width: 14, height: 14, transition: "transform 0.2s", transform: genreOpen ? "rotate(90deg)" : "rotate(0deg)" }}
            >
              <path d="M9 18l6-6-6-6"/>
            </svg>
            Genre
          </button>
          {genreOpen && (
            <ul style={{ listStyle: "none", paddingLeft: 22, display: "flex", flexDirection: "column", gap: 14 }}>
              {["Automotive", "Geo Politics", "Scandals", "Crime", "Explainers"].map((genre) => (
                <li key={genre}>
                  <a
                    href="#"
                    style={{ fontSize: "0.92rem", color: "var(--text-main)" }}
                    onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "var(--red)")}
                    onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "var(--text-main)")}
                  >
                    {genre}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
