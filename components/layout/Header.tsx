"use client";

import { useEffect, useState } from "react";

interface HeaderProps {
  onMenuOpen: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TABS = [
  { id: "home", label: "Home" },
  { id: "recent", label: "Recent Stories" },
  { id: "videos", label: "Videos" },
  { id: "shorts", label: "Short Reads" },
];

export default function Header({ onMenuOpen, activeTab, onTabChange }: HeaderProps) {
  const [dateStr, setDateStr] = useState("");

  useEffect(() => {
    const d = new Date();
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];
    setDateStr(`${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()} – ${days[d.getDay()]}`);
  }, []);

  return (
    <header style={{ padding: "25px 0 0" }}>
      {/* Top bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        {/* Date */}
        <div style={{ fontSize: "0.875rem", color: "var(--text-muted)", width: 200 }}>
          {dateStr}
        </div>

        {/* Brand */}
        <div style={{ textAlign: "center", flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(2rem, 5vw, 3.2rem)",
            fontWeight: 400,
            lineHeight: 1,
            letterSpacing: "-0.5px",
            color: "var(--text-main)",
          }}>
            Opinionated Kalam
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 6, fontSize: "0.75rem", fontFamily: "'Inter', sans-serif" }}>
            by{" "}
            <span style={{
              backgroundColor: "var(--text-main)",
              color: "white",
              padding: "2px 7px",
              borderRadius: 6,
              fontWeight: 600,
              fontSize: "0.68rem",
              letterSpacing: "0.5px",
            }}>
              dense
            </span>
          </div>
        </div>

        {/* Socials */}
        <div style={{ display: "flex", gap: 15, alignItems: "center", width: 200, justifyContent: "flex-end" }}>
          {/* YouTube */}
          <a href="#" aria-label="YouTube" style={{ color: "var(--red)", display: "flex" }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
            </svg>
          </a>
          {/* X / Twitter */}
          <a href="#" aria-label="X" style={{ color: "var(--text-main)", display: "flex" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
        </div>
      </div>

      {/* Nav bar */}
      <nav style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 0",
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
        marginBottom: 40,
      }}>
        {/* Left: Hamburger + Search */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button
            onClick={onMenuOpen}
            aria-label="Open menu"
            style={{
              fontSize: "1.7rem",
              lineHeight: 0.6,
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text-main)",
              padding: "0 4px",
            }}
          >
            ≡
          </button>
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "0.9rem",
              color: "var(--text-main)",
            }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
            Search
          </button>
        </div>

        {/* Center: Tabs */}
        <div style={{ display: "flex", gap: 30, fontSize: "0.92rem", fontWeight: 500 }}>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "0.92rem",
                fontWeight: activeTab === tab.id ? 700 : 500,
                color: "var(--text-main)",
                position: "relative",
                padding: "0 0 14px",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "100%",
                  height: 2,
                  backgroundColor: "var(--text-main)",
                  borderRadius: 1,
                }} />
              )}
            </button>
          ))}
        </div>

        {/* Right */}
        <div style={{ fontSize: "0.9rem", cursor: "pointer" }}>
          About Us
        </div>
      </nav>
    </header>
  );
}
