"use client";

import { useEffect, useState } from "react";

interface HeaderProps {
  onMenuOpen: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const ACCENT = "#1B2A47";

const TABS = [
  { id: "home",     label: "Home" },
  { id: "recent",   label: "Recent Stories" },
  { id: "podcasts", label: "Podcasts" },
  { id: "shorts",   label: "Short Reads" },
];

export default function Header({ onMenuOpen, activeTab, onTabChange }: HeaderProps) {
  const [dateStr, setDateStr] = useState("");

  useEffect(() => {
    const d = new Date();
    const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    const months = ["January","February","March","April","May","June",
      "July","August","September","October","November","December"];
    setDateStr(`${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()} — ${days[d.getDay()]}`);
  }, []);

  return (
    <header>
      {/* Title — full width centred */}
      <div style={{ textAlign: "center", padding: "22px 0 8px" }}>
        <div style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: "clamp(1.9rem, 4.5vw, 3rem)",
          fontWeight: 400, lineHeight: 1,
          color: "var(--text-main)", letterSpacing: "-0.3px",
        }}>
          Opinionated Kalam
        </div>
      </div>

      {/* date | dense logo | socials — all on same row, vertically centred */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr auto 1fr",
        alignItems: "center",
        paddingBottom: 14,
      }}>
        <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontFamily: "'Inter', sans-serif" }}>
          {dateStr}
        </div>
        <img src="/logo.png" alt="dense" style={{ height: 36, width: 36, borderRadius: 6, display: "block" }} />
        <div style={{ display: "flex", gap: 10, alignItems: "center", justifyContent: "flex-end" }}>
          <a href="#" aria-label="YouTube" style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: 36, height: 36, borderRadius: "50%",
            backgroundColor: "var(--red)", color: "white", flexShrink: 0,
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
            </svg>
          </a>
          <a href="#" aria-label="X" style={{ display: "flex", color: "var(--text-main)" }}>
            <svg width="21" height="21" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
        </div>
      </div>

      {/* Nav — top border only */}
      <nav style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        borderTop: "1px solid var(--border)",
        padding: "10px 0", marginBottom: 28,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button onClick={onMenuOpen} aria-label="Open menu" style={{
            background: "none", border: "none", cursor: "pointer",
            color: "var(--text-main)", padding: 0, display: "flex",
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6"  x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          <button style={{
            display: "flex", alignItems: "center", gap: 5,
            background: "none", border: "none", cursor: "pointer",
            fontSize: "0.88rem", color: "var(--text-main)", fontFamily: "'Inter', sans-serif",
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            Search
          </button>
        </div>

        <div style={{ display: "flex", gap: 26, alignItems: "center" }}>
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => onTabChange(tab.id)} style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: "0.9rem",
                fontWeight: isActive ? 700 : 500,
                color: isActive ? ACCENT : "var(--text-main)",
                fontFamily: "'Inter', sans-serif",
                padding: 0, whiteSpace: "nowrap",
              }}>
                {tab.label}
              </button>
            );
          })}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button style={{
            background: "none", border: "none", cursor: "pointer",
            fontSize: "0.88rem", color: "var(--text-main)",
            fontFamily: "'Inter', sans-serif", fontWeight: 500, padding: 0,
          }}>
            About Us
          </button>
          <a href="/login" style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            backgroundColor: "var(--text-main)", color: "white",
            padding: "5px 14px", borderRadius: 6,
            fontSize: "0.8rem", fontWeight: 600,
            fontFamily: "'Inter', sans-serif", textDecoration: "none",
          }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.8")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
            </svg>
            Login
          </a>
        </div>
      </nav>
    </header>
  );
}
