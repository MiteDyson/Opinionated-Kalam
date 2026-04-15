"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const RED = "#D92323";
const ACCENT = "#1B2A47";
const ALL_BEATS = ["Automotive", "Geo Politics", "Scandals", "Crime", "Explainers", "Society", "Global", "War"];

interface MobileSideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onTabChange: (tab: string) => void;
  onBeatSelect?: (beat: string) => void;
}

export default function MobileSideMenu({ isOpen, onClose, onTabChange, onBeatSelect }: MobileSideMenuProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [beatsOpen, setBeatsOpen] = useState(false);

  const navigateBeat = (beat: string) => {
    if (onBeatSelect) onBeatSelect(beat);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, backgroundColor: "rgba(63,63,61,0.85)",
          zIndex: 99, opacity: isOpen ? 1 : 0, visibility: isOpen ? "visible" : "hidden",
          transition: "opacity 0.25s ease, visibility 0.25s ease",
        }}
      />

      {/* Panel */}
      <div style={{
        position: "fixed", top: 0, left: isOpen ? 0 : -280,
        width: 260, height: "100vh",
        backgroundColor: "var(--bg)", zIndex: 100,
        boxShadow: "4px 0 24px rgba(0,0,0,0.15)",
        transition: "left 0.26s ease",
        display: "flex", flexDirection: "column",
        overflowY: "auto",
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "24px 20px 16px" }}>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: "1.1rem", color: RED }}>Menu</span>
        </div>

        <div style={{ flex: 1, padding: "0 20px" }}>
          {/* Beats with sub-menu */}
          <div>
            <button
              onClick={() => setBeatsOpen(o => !o)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontFamily: "'Inter', sans-serif", fontSize: "1rem", color: "var(--text-main)",
                padding: "10px 0", textAlign: "left", width: "100%",
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}
            >
              <span>Beats</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                style={{ transform: beatsOpen ? "rotate(90deg)" : "rotate(0)", transition: "transform 0.2s" }}>
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
            {beatsOpen && (
              <div style={{ paddingLeft: 12, paddingBottom: 8 }}>
                {ALL_BEATS.map(beat => (
                  <button
                    key={beat}
                    onClick={() => navigateBeat(beat)}
                    style={{
                      display: "block", width: "100%", background: "none", border: "none",
                      cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: "0.88rem",
                      color: "var(--text-muted)", padding: "7px 0", textAlign: "left",
                    }}
                  >
                    {beat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Saved */}
          <a
            href="/saved"
            onClick={onClose}
            style={{ display: "block", fontFamily: "'Inter', sans-serif", fontSize: "1rem", color: "var(--text-main)", padding: "10px 0", textDecoration: "none" }}
          >
            Saved
          </a>

          {/* My Subscriptions */}
          <a
            href="/subscriptions"
            onClick={onClose}
            style={{ display: "block", fontFamily: "'Inter', sans-serif", fontSize: "1rem", color: "var(--text-main)", padding: "10px 0", textDecoration: "none" }}
          >
            My Subscriptions
          </a>
        </div>

        {/* Bottom auth area */}
        <div style={{ padding: "20px", borderTop: "1px solid var(--border)" }}>
          {user ? (
            <button
              onClick={() => { logout(); onClose(); }}
              style={{
                width: "100%", padding: "12px 0", borderRadius: 8,
                border: "1px solid var(--border)", backgroundColor: "transparent",
                color: "#e05555", fontFamily: "'Inter', sans-serif",
                fontSize: "0.9rem", fontWeight: 600, cursor: "pointer",
              }}
            >
              Sign out
            </button>
          ) : (
            <>
              <a
                href="/login"
                onClick={onClose}
                style={{
                  display: "block", textAlign: "center", padding: "12px 0",
                  fontFamily: "'Inter', sans-serif", fontSize: "0.95rem",
                  color: "var(--text-main)", textDecoration: "none", marginBottom: 10,
                }}
              >
                Log In
              </a>
              <a
                href="/login"
                onClick={onClose}
                style={{
                  display: "block", textAlign: "center", padding: "12px 0",
                  fontFamily: "'Inter', sans-serif", fontSize: "0.95rem",
                  color: RED, textDecoration: "none",
                  border: `1.5px solid ${RED}`, borderRadius: 8,
                }}
              >
                Create an Account
              </a>
            </>
          )}
        </div>
      </div>
    </>
  );
}
