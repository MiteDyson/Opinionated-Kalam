"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

const RED = "#c0392b";
const BLACK = "#111111";
const BG = "#f5f0eb";
const BORDER = "#e0d8d0";
const MUTED = "#666666";
const ACCENT = "#1B2A47";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onTabChange: (tab: string) => void;
  onBeatSelect?: (beat: string) => void;
}


export default function MobileSideMenu({ isOpen, onClose, onTabChange, onBeatSelect }: Props) {
  const { user, logout } = useAuth();

  const isAdmin = user?.email === ADMIN_EMAIL;

  const itemStyle: React.CSSProperties = {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    fontFamily: "'Inter', sans-serif", fontSize: "1rem", fontWeight: 400, color: BLACK,
    padding: "11px 0", cursor: "pointer", background: "none", border: "none",
    width: "100%", textAlign: "left",
  };

  return (
    <>
      {/* Overlay */}
      <div onClick={onClose} style={{
        position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.35)", zIndex: 199,
        opacity: isOpen ? 1 : 0, visibility: isOpen ? "visible" : "hidden",
        transition: "opacity 0.25s ease, visibility 0.25s ease",
      }} />

      {/* Panel */}
      <div style={{
        position: "fixed", top: 0, left: isOpen ? 0 : "-280px",
        width: "62%", maxWidth: 260, height: "100vh",
        backgroundColor: BG, zIndex: 200,
        boxShadow: "4px 0 24px rgba(0,0,0,0.15)", transition: "left 0.26s ease",
        display: "flex", flexDirection: "column",
      }}>
        {/* Header row */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "20px 20px 16px" }}>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", gap: 4, padding: 0 }}>
            <span style={{ display: "block", width: 18, height: 1.5, backgroundColor: RED, borderRadius: 1 }} />
            <span style={{ display: "block", width: 18, height: 1.5, backgroundColor: RED, borderRadius: 1 }} />
            <span style={{ display: "block", width: 18, height: 1.5, backgroundColor: RED, borderRadius: 1 }} />
          </button>
          <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: "1.1rem", color: RED }}>Menu</span>
        </div>

        {/* Scrollable items */}
        <div style={{ flex: 1, padding: "0 20px", overflowY: "auto" }}>

          <a href="/saved" onClick={onClose} style={{ ...itemStyle, textDecoration: "none", display: "flex" }}>Saved Content</a>
          <a href="/subscriptions" onClick={onClose} style={{ ...itemStyle, textDecoration: "none", display: "flex" }}>My Subscriptions</a>
        </div>

        {/* Bottom: user + admin button + signout */}
        <div style={{ padding: "14px 20px 28px", borderTop: `1px solid ${BORDER}` }}>
          {user ? (
            <>
              {/* User info */}
              <div style={{ marginBottom: 12, paddingBottom: 12, borderBottom: `1px solid ${BORDER}` }}>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", fontWeight: 500, color: BLACK, marginBottom: 1 }}>
                  {user.displayName?.trim() || "User"}
                </div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", color: MUTED }}>{user.email}</div>
              </div>

              {/* Admin Panel — styled button, not just a link text */}
              {isAdmin && (
                <button
                  onClick={() => { window.location.href = "/admin"; onClose(); }}
                  style={{
                    width: "100%", padding: "10px 0", marginBottom: 10,
                    borderRadius: 7, border: `1.5px solid ${ACCENT}`,
                    backgroundColor: "transparent", color: ACCENT,
                    fontFamily: "'Inter', sans-serif", fontSize: "0.85rem",
                    fontWeight: 600, cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  }}
                >

                  Admin Panel
                </button>
              )}

              {/* Sign out */}
              <button onClick={() => { logout(); onClose(); }} style={{
                width: "100%", padding: "10px 0", borderRadius: 7,
                border: "1px solid rgba(224,85,85,0.4)",
                backgroundColor: "transparent", color: "#e05555",
                fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", fontWeight: 500, cursor: "pointer",
              }}>
                Sign out
              </button>
            </>
          ) : (
            <>
              <a href="/login" onClick={onClose} style={{
                display: "block", textAlign: "center", padding: "11px 0",
                fontFamily: "'Inter', sans-serif", fontSize: "0.92rem", color: BLACK,
                textDecoration: "none", marginBottom: 8, borderBottom: `1px solid ${BORDER}`,
              }}>Log In</a>
              <a href="/login" onClick={onClose} style={{
                display: "block", textAlign: "center", padding: "11px 0",
                fontFamily: "'Inter', sans-serif", fontSize: "0.92rem", color: RED,
                textDecoration: "none", fontWeight: 500,
              }}>Create an Account</a>
            </>
          )}
        </div>
      </div>
    </>
  );
}
