"use client";

import { useState, useRef, useEffect } from "react";

// Only original beats — no society, global, war
const ALL_BEATS = [
  "Automotive",
  "Geo Politics",
  "Scandals",
  "Crime",
  "Society",
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
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.72rem", padding: "8px 14px 6px", borderBottom: `1px solid #f5f0eb`, display: "flex", alignItems: "center", justifyContent: "space-between", color: BLACK }}>
            <span>Filter</span>
            {selectedBeat && (
              <button onClick={() => { onBeatChange(null); setOpen(false); }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.7rem", color: "#888", padding: 0 }}>✕</button>
            )}
          </div>
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
