// ============================================================================
// FILE: styles/chipStyles.ts
// ISSUE #2 FIX: Tags/Beats chip styling
// ============================================================================

export const CHIP_STYLE = {
  display: "inline-block",
  padding: "3px 8px",
  borderRadius: "12px",
  backgroundColor: "rgba(211, 139, 136, 0.1)",
  color: "#D38B88",
  fontSize: "0.65rem",
  fontWeight: 600,
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
  fontFamily: "'Inter', sans-serif",
  whiteSpace: "nowrap" as const,
  lineHeight: 1.2,
  marginRight: "6px",
  marginBottom: "4px",
};

// Usage in your components:
// 
// import { CHIP_STYLE } from "@/styles/chipStyles";
// 
// {beats.map(beat => (
//   <span key={beat} style={CHIP_STYLE}>
//     {beat}
//   </span>
// ))}
