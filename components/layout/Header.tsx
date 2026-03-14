"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

const ADMIN_EMAIL = "opinionatedkalam@gmail.com";
const ACCENT = "#1B2A47";

const TABS = [
  { id: "home",     label: "Home" },
  { id: "recent",   label: "Recent Stories" },
  { id: "podcasts", label: "Podcasts" },
  { id: "shorts",   label: "Short Reads" },
  { id: "beats",    label: "Beats" },
];

interface HeaderProps {
  onMenuOpen: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Header({ onMenuOpen, activeTab, onTabChange }: HeaderProps) {
  const { user, logout } = useAuth();
  const [dateStr, setDateStr] = useState("");
  const isAdmin = user?.email === ADMIN_EMAIL;

  useEffect(() => {
    const d = new Date();
    const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    setDateStr(`${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()} — ${days[d.getDay()]}`);
  }, []);

  return (
    <header>
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", padding: "22px 0 14px" }}>
        <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontFamily: "'Inter', sans-serif" }}>{dateStr}</div>

        <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(2.2rem, 5vw, 3.6rem)", fontWeight: 400, lineHeight: 1, color: "var(--text-main)", letterSpacing: "-0.5px", textAlign: "center" }}>
          Opinionated Kalam
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center", justifyContent: "flex-end" }}>
          <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: "50%", backgroundColor: "#FF0000", color: "white", flexShrink: 0 }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
          </a>
          <a href="https://www.x.com" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: "50%", backgroundColor: "#000", color: "white", flexShrink: 0 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </a>
        </div>
      </div>

      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border)", padding: "10px 0", marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button onClick={onMenuOpen} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-main)", padding: 0, display: "flex" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
          <button style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "none", cursor: "pointer", fontSize: "0.88rem", color: "var(--text-main)", fontFamily: "'Inter', sans-serif" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            Search
          </button>
        </div>

        <div style={{ display: "flex", gap: 22, alignItems: "center" }}>
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => onTabChange(tab.id)} style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: "0.88rem", fontWeight: isActive ? 700 : 500,
                color: isActive ? ACCENT : "var(--text-main)",
                fontFamily: "'Inter', sans-serif", padding: 0, whiteSpace: "nowrap",
                // Beats tab gets a subtle accent
                ...(tab.id === "beats" && !isActive ? { color: "#D38B88" } : {}),
              }}>
                {tab.label}
              </button>
            );
          })}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.88rem", color: "var(--text-main)", fontFamily: "'Inter', sans-serif", fontWeight: 500, padding: 0 }}>
            About Us
          </button>

          {isAdmin && (
            <a href="/admin" style={{ display: "inline-flex", alignItems: "center", gap: 5, backgroundColor: ACCENT, color: "white", padding: "5px 14px", borderRadius: 6, fontSize: "0.8rem", fontWeight: 600, fontFamily: "'Inter', sans-serif", textDecoration: "none" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
              Admin
            </a>
          )}

          {user && !isAdmin && (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontFamily: "'Inter', sans-serif" }}>
                {user.displayName?.split(" ")[0] ?? user.email?.split("@")[0]}
              </span>
              <button onClick={logout} style={{ background: "none", border: "1px solid var(--border)", cursor: "pointer", padding: "4px 12px", borderRadius: 6, fontSize: "0.78rem", color: "var(--text-muted)", fontFamily: "'Inter', sans-serif" }}>
                Sign out
              </button>
            </div>
          )}

          {isAdmin && (
            <button onClick={logout} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.78rem", color: "var(--text-muted)", fontFamily: "'Inter', sans-serif", padding: 0 }}>
              Sign out
            </button>
          )}

          {!user && (
            <a href="/login" style={{ display: "inline-flex", alignItems: "center", gap: 5, backgroundColor: "var(--text-main)", color: "white", padding: "5px 14px", borderRadius: 6, fontSize: "0.8rem", fontWeight: 600, fontFamily: "'Inter', sans-serif", textDecoration: "none" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
              Login
            </a>
          )}
        </div>
      </nav>
    </header>
  );
}
