"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onTabChange: (tab: string) => void;
}

const RED    = "#D92323";
const ACCENT = "#1B2A47";

export default function SideMenu({ isOpen, onClose, onTabChange }: SideMenuProps) {
  const { user } = useAuth();
  const router = useRouter();

  const itemStyle: React.CSSProperties = {
    background: "none", border: "none", cursor: "pointer",
    fontFamily: "'Inter', sans-serif", fontSize: "1rem",
    color: "var(--text-main)", padding: "10px 0",
    textAlign: "left", width: "100%", display: "block",
  };

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, backgroundColor: "#3f3f3d", zIndex: 99, opacity: isOpen ? 0.85 : 0, visibility: isOpen ? "visible" : "hidden", transition: "opacity 0.25s ease, visibility 0.25s ease" }} />

      <div style={{ position: "fixed", top: 0, left: isOpen ? 0 : -340, width: 260, height: "100vh", backgroundColor: "var(--bg)", zIndex: 100, boxShadow: "4px 0 24px rgba(0,0,0,0.12)", transition: "left 0.26s ease", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "24px 28px 20px" }}>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-main)", padding: 0, display: "flex" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
          <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: "1.1rem", color: RED }}>Menu</span>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "4px 28px 20px" }}>
          <a href="/saved" onClick={onClose} style={{ ...itemStyle, textDecoration: "none", display: "block" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = ACCENT)}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-main)")}
          >Saved Content</a>

          <a href="/subscriptions" onClick={onClose} style={{ ...itemStyle, textDecoration: "none", display: "block" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = ACCENT)}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-main)")}
          >My Subscriptions</a>
        </div>

        {!user && (
          <div style={{ padding: "16px 28px 28px", borderTop: "1px solid var(--border)" }}>
            <a href="/login" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: "var(--text-main)", color: "white", padding: "11px 0", borderRadius: 8, fontSize: "0.88rem", fontWeight: 600, fontFamily: "'Inter', sans-serif", textDecoration: "none" }}>
              Login / Sign up
            </a>
          </div>
        )}
      </div>
    </>
  );
}
