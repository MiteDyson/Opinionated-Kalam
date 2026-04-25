"use client";

import { useState, useRef, useEffect } from "react";

const ALL_BEATS = [
  "Automotive",
  "Business",
  "Environment",
  "Geo Politics",
  "Governance",
  "Law & Order",
  "Media",
  "Society",
  "Technology",
];

const BLACK = "#111111";
const BORDER = "#e0d8d0";

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
          padding: "4px 10px", borderRadius: 4, border: `1px solid ${BORDER}`,
          backgroundColor: "white", color: BLACK,
          fontFamily: "'Inter', sans-serif", fontSize: "0.72rem", fontWeight: 400,
          cursor: "pointer", whiteSpace: "nowrap",
        }}
      >
        {selectedBeat ? `Beat: ${selectedBeat}` : "Beats"}
        <span style={{ fontSize: "0.6rem", display: "inline-block", transform: open ? "rotate(-90deg)" : "rotate(0deg)", transition: "transform 0.15s", lineHeight: 1 }}>‹</span>
      </button>

      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", right: 0,
          backgroundColor: "white", borderRadius: 6, border: `1px solid ${BORDER}`,
          boxShadow: "0 4px 20px rgba(0,0,0,0.12)", zIndex: 50,
          minWidth: 140, overflow: "hidden", animation: "fadeDown 0.12s ease",
        }}>
          <style>{`@keyframes fadeDown{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}`}</style>

          {/* Reset to Default button — always visible */}
          <button
            onClick={() => { onBeatChange(null); setOpen(false); }}
            style={{
              display: "flex", alignItems: "center", gap: 5, width: "100%",
              padding: "8px 16px", background: "none", border: "none",
              borderBottom: `1px solid #f5f0eb`, cursor: "pointer",
              fontFamily: "'Inter', sans-serif", fontSize: "0.72rem", fontWeight: 600,
              color: selectedBeat ? BLACK : "#aaa", textAlign: "left",
            }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
            </svg>
            Reset to Default
          </button>

          <ul style={{ listStyle: "none", padding: "6px 0", margin: 0 }}>
            {ALL_BEATS.map(beat => (
              <li key={beat} onClick={() => { onBeatChange(beat); setOpen(false); }}
                style={{
                  fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", padding: "7px 16px",
                  color: selectedBeat === beat ? BLACK : "#333", fontWeight: selectedBeat === beat ? 600 : 400,
                  cursor: "pointer", backgroundColor: selectedBeat === beat ? "#f5f0eb" : "transparent",
                }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.backgroundColor = "#f5f0eb")}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.backgroundColor = selectedBeat === beat ? "#f5f0eb" : "transparent")}
              >{beat}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
