"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const RED = "#c0392b";
const BLACK = "#111111";
const BG = "#f5f0eb";
const BORDER = "#e0d8d0";
const MUTED = "#666666";

const ALL_BEATS = [
  "Automotive",
  "Geo Politics",
  "Scandals",
  "Crime",
  "Explainers",
  "Society",
  "Global",
  "War",
];

interface MobileSideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onTabChange: (tab: string) => void;
  onBeatSelect?: (beat: string) => void;
}

export default function MobileSideMenu({
  isOpen,
  onClose,
  onTabChange,
  onBeatSelect,
}: MobileSideMenuProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [beatsOpen, setBeatsOpen] = useState(false);

  const navigateBeat = (beat: string) => {
    if (onBeatSelect) onBeatSelect(beat);
    onClose();
  };

  const menuItemStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontFamily: "'Inter', sans-serif",
    fontSize: "1.05rem",
    fontWeight: 500,
    color: BLACK,
    padding: "12px 0",
    cursor: "pointer",
    background: "none",
    border: "none",
    width: "100%",
    textAlign: "left",
    borderBottom: "none",
  };

  return (
    <>
      {/* Dim overlay */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.35)",
          zIndex: 199,
          opacity: isOpen ? 1 : 0,
          visibility: isOpen ? "visible" : "hidden",
          transition: "opacity 0.25s ease, visibility 0.25s ease",
        }}
      />

      {/* Side panel — slides from left */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: isOpen ? 0 : "-280px",
          width: "62%",
          maxWidth: 260,
          height: "100vh",
          backgroundColor: BG,
          zIndex: 200,
          boxShadow: "4px 0 24px rgba(0,0,0,0.15)",
          transition: "left 0.26s ease",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "20px 20px 16px",
          }}
        >
          {/* Hamburger (closes menu) — lines are red in menu */}
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              gap: 4,
              padding: 0,
            }}
          >
            <span style={{ display: "block", width: 18, height: 1.5, backgroundColor: RED, borderRadius: 1 }} />
            <span style={{ display: "block", width: 18, height: 1.5, backgroundColor: RED, borderRadius: 1 }} />
            <span style={{ display: "block", width: 18, height: 1.5, backgroundColor: RED, borderRadius: 1 }} />
          </button>
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 700,
              fontSize: "1.1rem",
              color: RED,
            }}
          >
            Menu
          </span>
        </div>

        {/* Menu items */}
        <div style={{ flex: 1, padding: "0 20px", overflowY: "auto" }}>
          {/* Beats — expandable */}
          <div>
            <button
              onClick={() => setBeatsOpen(o => !o)}
              style={menuItemStyle}
            >
              <span>Beats</span>
              {/* Chevron: right when closed, down when open */}
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke={MUTED}
                strokeWidth="2"
                style={{
                  transform: beatsOpen ? "rotate(90deg)" : "rotate(0deg)",
                  transition: "transform 0.2s",
                }}
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

            {beatsOpen && (
              <div style={{ paddingLeft: 12, paddingBottom: 8 }}>
                {ALL_BEATS.map(beat => (
                  <button
                    key={beat}
                    onClick={() => navigateBeat(beat)}
                    style={{
                      display: "block",
                      width: "100%",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "0.85rem",
                      color: MUTED,
                      padding: "6px 0",
                      textAlign: "left",
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
            style={{
              ...menuItemStyle,
              textDecoration: "none",
              display: "flex",
            }}
          >
            Saved
          </a>

          {/* My Subscriptions */}
          <a
            href="/subscriptions"
            onClick={onClose}
            style={{
              ...menuItemStyle,
              textDecoration: "none",
              display: "flex",
            }}
          >
            My Subscriptions
          </a>
        </div>

        {/* Auth area */}
        <div
          style={{
            padding: "16px 20px 28px",
            borderTop: `1px solid ${BORDER}`,
          }}
        >
          {user ? (
            <button
              onClick={() => {
                logout();
                onClose();
              }}
              style={{
                width: "100%",
                padding: "12px 0",
                borderRadius: 8,
                border: `1px solid ${BORDER}`,
                backgroundColor: "transparent",
                color: "#e05555",
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.9rem",
                fontWeight: 600,
                cursor: "pointer",
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
                  display: "block",
                  textAlign: "center",
                  padding: "12px 0",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.95rem",
                  color: BLACK,
                  textDecoration: "none",
                  marginBottom: 10,
                  borderBottom: `1px solid ${BORDER}`,
                }}
              >
                Log In
              </a>
              <a
                href="/login"
                onClick={onClose}
                style={{
                  display: "block",
                  textAlign: "center",
                  padding: "12px 0",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.95rem",
                  color: RED,
                  textDecoration: "none",
                  fontWeight: 500,
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
