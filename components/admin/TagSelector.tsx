"use client";

import { useState } from "react";

const ACCENT = "#1B2A47";
const TERRA  = "#D38B88";
const TEXT   = "#1A1A1A";
const MUTED  = "#555555";

const PRESET_TAGS = ["Automotive","Geo Politics","Scandals","Crime","Explainers"];

interface Props {
  selectedTags: string[];
  onToggle: (tag: string) => void;
  onAdd: () => void;
  tagInput: string;
  setTagInput: (v: string) => void;
}

export default function TagSelector({ selectedTags, onToggle, onAdd, tagInput, setTagInput }: Props) {
  const [showInput, setShowInput] = useState(false);

  const handleAdd = () => {
    onAdd();
    setShowInput(false);
  };

  return (
    <div>
      <label style={{ display: "block", fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", fontWeight: 700, color: MUTED, textTransform: "uppercase" as const, letterSpacing: "0.06em", marginBottom: 7 }}>
        Tags
      </label>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 7, alignItems: "center" }}>
        {/* Preset tags */}
        {PRESET_TAGS.map(tag => {
          const active = selectedTags.includes(tag);
          return (
            <button key={tag} onClick={() => onToggle(tag)} style={{
              padding: "5px 12px", borderRadius: 20, cursor: "pointer",
              border: `1.5px solid ${active ? ACCENT : "#CFCBC3"}`,
              backgroundColor: active ? ACCENT : "white",
              color: active ? "white" : MUTED,
              fontSize: "0.78rem", fontWeight: 600, fontFamily: "'Inter', sans-serif",
              display: "flex", alignItems: "center", gap: 5, transition: "all 0.15s",
            }}>
              {tag}
              {active && <span style={{ fontSize: "0.9rem", lineHeight: 1, opacity: 0.7, marginLeft: 2 }}>×</span>}
            </button>
          );
        })}

        {/* Custom tags */}
        {selectedTags.filter(t => !PRESET_TAGS.includes(t)).map(tag => (
          <button key={tag} onClick={() => onToggle(tag)} style={{
            padding: "5px 12px", borderRadius: 20, cursor: "pointer",
            border: `1.5px solid ${TERRA}`,
            backgroundColor: TERRA, color: TEXT,
            fontSize: "0.78rem", fontWeight: 600, fontFamily: "'Inter', sans-serif",
            display: "flex", alignItems: "center", gap: 5,
          }}>
            {tag}
            <span style={{ fontSize: "0.9rem", lineHeight: 1, opacity: 0.7, marginLeft: 2 }}>×</span>
          </button>
        ))}

        {/* + button to show custom tag input */}
        {!showInput && (
          <button onClick={() => setShowInput(true)} title="Add custom tag" style={{
            width: 28, height: 28, borderRadius: "50%",
            border: `1.5px dashed #CFCBC3`, backgroundColor: "transparent",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            color: MUTED, fontSize: "1.1rem", lineHeight: 1, transition: "all 0.15s",
          }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = ACCENT; (e.currentTarget as HTMLElement).style.color = ACCENT; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#CFCBC3"; (e.currentTarget as HTMLElement).style.color = MUTED; }}
          >+</button>
        )}

        {/* Custom tag input — shown on + click */}
        {showInput && (
          <div style={{ display: "flex", gap: 6, alignItems: "center", animation: "fadeIn 0.15s ease" }}>
            <style>{`@keyframes fadeIn{from{opacity:0;transform:translateX(-4px)}to{opacity:1;transform:translateX(0)}}`}</style>
            <input
              autoFocus
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") { e.preventDefault(); handleAdd(); }
                if (e.key === "Escape") { setShowInput(false); setTagInput(""); }
              }}
              placeholder="Tag name..."
              style={{
                padding: "5px 10px", borderRadius: 20,
                border: `1.5px solid ${ACCENT}`, outline: "none",
                fontSize: "0.78rem", fontFamily: "'Inter', sans-serif",
                backgroundColor: "white", color: TEXT, width: 120,
              }}
            />
            <button onClick={handleAdd} style={{
              padding: "5px 10px", borderRadius: 20, border: "none",
              backgroundColor: ACCENT, color: "white",
              fontSize: "0.75rem", fontWeight: 600, fontFamily: "'Inter', sans-serif", cursor: "pointer",
            }}>Add</button>
            <button onClick={() => { setShowInput(false); setTagInput(""); }} style={{
              background: "none", border: "none", cursor: "pointer",
              color: MUTED, fontSize: "1rem", lineHeight: 1, padding: "0 2px",
            }}>×</button>
          </div>
        )}
      </div>
    </div>
  );
}
