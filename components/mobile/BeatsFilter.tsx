"use client";

import { useState, useRef, useEffect } from "react";

const ALL_BEATS = ["Automotive", "Geo Politics", "Scandals", "Crime", "Explainers", "Society", "Global", "War"];
const ACCENT = "#1B2A47";
const RED = "#D92323";

interface BeatsFilterProps {
  selectedBeat: string | null;
  onBeatChange: (beat: string | null) => void;
}

export default function BeatsFilter({ selectedBeat, onBeatChange }: BeatsFilterProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: "flex", alignItems: "center", gap: 5,
          padding: "6px 12px", borderRadius: 6,
          border: `1.5px solid ${selectedBeat ? ACCENT : "var(--border)"}`,
          backgroundColor: selectedBeat ? ACCENT : "white",
          color: selectedBeat ? "white" : "var(--text-main)",
          fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", fontWeight: 600,
          cursor: "pointer", whiteSpace: "nowrap",
        }}
      >
        {selectedBeat ? `Beat: ${selectedBeat}` : "Beats"}
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.15s" }}>
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", left: 0,
          backgroundColor: "white", borderRadius: 10,
          border: "1px solid var(--border)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          zIndex: 50, minWidth: 160, overflow: "hidden",
          animation: "fadeDown 0.12s ease",
        }}>
          <style>{`@keyframes fadeDown{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}`}</style>

          {selectedBeat && (
            <button
              onClick={() => { onBeatChange(null); setOpen(false); }}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                width: "100%", padding: "10px 14px", background: "none", border: "none",
                cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: "0.82rem",
                color: "#888", borderBottom: "1px solid #f0f0ee", textAlign: "left",
              }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
              Clear filter
            </button>
          )}

          {ALL_BEATS.map((beat, i) => (
            <button
              key={beat}
              onClick={() => { onBeatChange(beat); setOpen(false); }}
              style={{
                display: "block", width: "100%", padding: "10px 14px",
                background: "none", border: "none", cursor: "pointer",
                fontFamily: "'Inter', sans-serif", fontSize: "0.82rem",
                color: selectedBeat === beat ? ACCENT : "var(--text-main)",
                fontWeight: selectedBeat === beat ? 700 : 400,
                backgroundColor: selectedBeat === beat ? "rgba(27,42,71,0.05)" : "transparent",
                borderBottom: i < ALL_BEATS.length - 1 ? "1px solid #f5f5f3" : "none",
                textAlign: "left",
              }}
            >
              {beat}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
