"use client";

import { useState } from "react";

const BLACK = "#111111";
const BORDER = "#e0d8d0";
const MUTED = "#666666";
const WHITE = "#ffffff";

export type SortOption = "trending" | "mostViews" | "leastViews" | "newest" | "oldest";

const SORT_LABELS: Record<SortOption, string> = {
  trending: "Trending", mostViews: "Most Views", leastViews: "Least Views", newest: "Newest", oldest: "Oldest",
};

interface SortFilterProps {
  sortOpt: SortOption;
  setSortOpt: (d: SortOption) => void;
}

export default function SortFilter({ sortOpt, setSortOpt }: SortFilterProps) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <button onClick={() => setOpen(o => !o)} style={{
        display: "flex", alignItems: "center", gap: 4,
        padding: "4px 10px", borderRadius: 4, border: `1px solid ${BORDER}`,
        backgroundColor: WHITE, fontFamily: "'Inter', sans-serif",
        fontSize: "0.72rem", fontWeight: 400, color: BLACK, cursor: "pointer"
      }}>
        Sort <span style={{ fontSize: "0.6rem", transform: open ? "rotate(-90deg)" : "rotate(0deg)", transition: "transform 0.15s" }}>‹</span>
      </button>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", right: 0,
          backgroundColor: WHITE, borderRadius: 6, border: `1px solid ${BORDER}`,
          boxShadow: "0 4px 20px rgba(0,0,0,0.12)", zIndex: 40,
          minWidth: 130, overflow: "hidden"
        }}>
          {(Object.keys(SORT_LABELS) as SortOption[]).map((opt, i, arr) => (
            <button key={opt} onClick={() => { setSortOpt(opt); setOpen(false); }} style={{
              display: "block", width: "100%", padding: "8px 14px", background: "none", border: "none", cursor: "pointer",
              fontFamily: "'Inter', sans-serif", fontSize: "0.78rem",
              fontWeight: sortOpt === opt ? 600 : 400, color: sortOpt === opt ? BLACK : MUTED,
              backgroundColor: sortOpt === opt ? "#f5f0eb" : "transparent",
              borderBottom: i < arr.length - 1 ? `1px solid ${BORDER}` : "none", textAlign: "left",
            }}>
              {SORT_LABELS[opt]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
