"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

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
  const router = useRouter();
  const { user, logout } = useAuth();
  const [dateStr, setDateStr] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const d = new Date();
    const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    const months = ["January","February","March","April","May","June",
      "July","August","September","October","November","December"];
    setDateStr(`${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()} — ${days[d.getDay()]}`);
  }, []);

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
    router.push("/");
  };

  /* display name: Firebase displayName (username) → email prefix → "User" */
  const displayName = user?.displayName || user?.email?.split("@")[0] || "User";
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <header>
      {/* Row: date | title | socials */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr auto 1fr",
        alignItems: "center", padding: "22px 0 14px",
      }}>
        <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontFamily: "'Inter', sans-serif" }}>
          {dateStr}
        </div>

        <div style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: "clamp(2.2rem, 5vw, 3.6rem)",
          fontWeight: 400, lineHeight: 1,
          color: "var(--text-main)", letterSpacing: "-0.5px", textAlign: "center",
        }}>
          Opinionated Kalam
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center", justifyContent: "flex-end" }}>
          <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube" style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: 36, height: 36, borderRadius: "50%",
            backgroundColor: "#FF0000", color: "white", flexShrink: 0,
          }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </a>
          <a href="https://www.x.com" target="_blank" rel="noopener noreferrer" aria-label="X" style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: 36, height: 36, borderRadius: "50%",
            backgroundColor: "#000", color: "white", flexShrink: 0,
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
        </div>
      </div>

      {/* Nav */}
      <nav style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        borderTop: "1px solid var(--border)", padding: "10px 0", marginBottom: 28,
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

          {user ? (
            /* Logged in — show avatar + dropdown */
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{
                  display: "flex", alignItems: "center", gap: 7,
                  background: "none", border: "1px solid var(--border)",
                  borderRadius: 20, padding: "4px 10px 4px 4px",
                  cursor: "pointer", fontFamily: "'Inter', sans-serif",
                }}
              >
                <div style={{
                  width: 26, height: 26, borderRadius: "50%",
                  backgroundColor: ACCENT, color: "white",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.65rem", fontWeight: 700,
                }}>
                  {user.photoURL
                    ? <img src={user.photoURL} style={{ width: 26, height: 26, borderRadius: "50%", objectFit: "cover" }} alt="" />
                    : initials
                  }
                </div>
                <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-main)", maxWidth: 80, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {displayName}
                </span>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>

              {dropdownOpen && (
                <div style={{
                  position: "absolute", right: 0, top: "calc(100% + 8px)",
                  backgroundColor: "white", border: "1px solid var(--border)",
                  borderRadius: 10, padding: "6px 0", minWidth: 160,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)", zIndex: 100,
                }}>
                  <div style={{ padding: "8px 14px", borderBottom: "1px solid var(--border)", marginBottom: 4 }}>
                    <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-main)" }}>{displayName}</div>
                    <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: 2 }}>{user.email}</div>
                  </div>
                  <button onClick={() => { router.push("/admin"); setDropdownOpen(false); }} style={{
                    width: "100%", padding: "8px 14px", background: "none", border: "none",
                    textAlign: "left", fontSize: "0.83rem", cursor: "pointer",
                    color: "var(--text-main)", fontFamily: "'Inter', sans-serif",
                    display: "flex", alignItems: "center", gap: 8,
                  }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                      <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
                    </svg>
                    Admin Panel
                  </button>
                  <button onClick={handleLogout} style={{
                    width: "100%", padding: "8px 14px", background: "none", border: "none",
                    textAlign: "left", fontSize: "0.83rem", cursor: "pointer",
                    color: "#D92323", fontFamily: "'Inter', sans-serif",
                    display: "flex", alignItems: "center", gap: 8,
                  }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                      <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Not logged in — show Login button */
            <a href="/login" style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              backgroundColor: "var(--text-main)", color: "white",
              padding: "5px 14px", borderRadius: 6,
              fontSize: "0.8rem", fontWeight: 600,
              fontFamily: "'Inter', sans-serif", textDecoration: "none",
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
              </svg>
              Login
            </a>
          )}
        </div>
      </nav>
    </header>
  );
}
