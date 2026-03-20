"use client";

import { useState } from "react";

const ACCENT = "#1B2A47";
const TEXT   = "#1A1A1A";
const MUTED  = "#555555";
const TERRA  = "#D38B88";

const PRESET_TAGS = ["Automotive", "Geo Politics", "Scandals", "Crime", "Explainers"];

interface TagSelectorProps {
  selected: string[];
  onChange: (tags: string[]) => void;
}

export default function TagSelector({ selected, onChange }: TagSelectorProps) {
  const [customOpen, setCustomOpen] = useState(false);
  const [customInput, setCustomInput] = useState("");

  const toggleTag = (tag: string) => {
    onChange(selected.includes(tag) ? selected.filter(t => t !== tag) : [...selected, tag]);
  };

  const addCustomTag = () => {
    const t = customInput.trim();
    if (t && !selected.includes(t)) onChange([...selected, t]);
    setCustomInput("");
    setCustomOpen(false);
  };

  const labelStyle: React.CSSProperties = {
    display: "block", fontFamily: "'Inter', sans-serif",
    fontSize: "0.72rem", fontWeight: 700, color: MUTED,
    textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8,
  };

  return (
    <div>
      <label style={labelStyle}>Tags</label>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
        {/* Preset tags */}
        {PRESET_TAGS.map(tag => {
          const active = selected.includes(tag);
          return (
            <button key={tag} onClick={() => toggleTag(tag)} style={{
              padding: "5px 12px", borderRadius: 20, cursor: "pointer",
              border: `1.5px solid ${active ? ACCENT : "#CFCBC3"}`,
              backgroundColor: active ? ACCENT : "white",
              color: active ? "white" : MUTED,
              fontSize: "0.76rem", fontWeight: 600, fontFamily: "'Inter', sans-serif",
              display: "flex", alignItems: "center", gap: 5, transition: "all 0.14s",
            }}>
              {tag}
              {active && <span style={{ opacity: 0.7, lineHeight: 1 }}>×</span>}
            </button>
          );
        })}

        {/* Custom tags that were added */}
        {selected.filter(t => !PRESET_TAGS.includes(t)).map(tag => (
          <button key={tag} onClick={() => toggleTag(tag)} style={{
            padding: "5px 12px", borderRadius: 20, cursor: "pointer",
            border: `1.5px solid ${TERRA}`, backgroundColor: TERRA,
            color: TEXT, fontSize: "0.76rem", fontWeight: 600,
            fontFamily: "'Inter', sans-serif", display: "flex", alignItems: "center", gap: 5,
          }}>
            {tag}
            <span style={{ opacity: 0.7, lineHeight: 1 }}>×</span>
          </button>
        ))}

        {/* Add custom tag icon button */}
        {customOpen ? (
          <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
            <input
              autoFocus
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") { e.preventDefault(); addCustomTag(); }
                if (e.key === "Escape") { setCustomOpen(false); setCustomInput(""); }
              }}
              placeholder="Tag name…"
              style={{
                padding: "4px 10px", borderRadius: 8, border: "1.5px solid #CFCBC3",
                fontSize: "0.76rem", fontFamily: "'Inter', sans-serif",
                outline: "none", width: 110, color: TEXT, backgroundColor: "white",
              }}
              onFocus={(e) => (e.target.style.borderColor = ACCENT)}
              onBlur={(e) => (e.target.style.borderColor = "#CFCBC3")}
            />
            <button onClick={addCustomTag} style={{ width: 26, height: 26, borderRadius: 6, border: "none", backgroundColor: ACCENT, color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            </button>
            <button onClick={() => { setCustomOpen(false); setCustomInput(""); }} style={{ width: 26, height: 26, borderRadius: 6, border: "1px solid #CFCBC3", backgroundColor: "white", color: MUTED, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem" }}>
              ×
            </button>
          </div>
        ) : (
          <button
            onClick={() => setCustomOpen(true)}
            title="Add custom tag"
            style={{
              width: 28, height: 28, borderRadius: "50%", cursor: "pointer",
              border: "1.5px dashed #CFCBC3", backgroundColor: "transparent",
              color: MUTED, display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.14s",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = ACCENT; (e.currentTarget as HTMLElement).style.color = ACCENT; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#CFCBC3"; (e.currentTarget as HTMLElement).style.color = MUTED; }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
