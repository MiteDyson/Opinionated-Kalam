"use client";

const ACCENT = "#1B2A47";
const MUTED  = "#555555";

const PRESET_TAGS = [
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

interface TagSelectorProps {
  selected: string[];
  onChange: (tags: string[]) => void;
}

export default function TagSelector({ selected, onChange }: TagSelectorProps) {
  const toggleTag = (tag: string) => {
    onChange(selected.includes(tag) ? selected.filter(t => t !== tag) : [...selected, tag]);
  };

  const labelStyle: React.CSSProperties = {
    display: "block", fontFamily: "'Inter', sans-serif",
    fontSize: "0.72rem", fontWeight: 700, color: MUTED,
    textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8,
  };

  return (
    <div>
      <label style={labelStyle}>Beats</label>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
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
      </div>
    </div>
  );
}
