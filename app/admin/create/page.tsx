"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

const TEXT  = "#1A1A1A";
const BG    = "#F5F2EE";
const MUTED = "#777";

const OPTIONS = [
  {
    href: "/admin/articles/new",
    type: "article",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
    label: "Article",
    desc: "Long-form journalism with rich text, images and formatting",
    color: "#1B2A47",
    bg: "rgba(27,42,71,0.06)",
  },
  {
    href: "/admin/articles/new?type=short",
    type: "short",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
    label: "Short Read",
    desc: "Quick takes, snippets and fast explainers under 5 minutes",
    color: "#9a3f3c",
    bg: "rgba(211,139,136,0.1)",
  },
  {
    href: "/admin/podcasts/new",
    type: "podcast",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
        <line x1="12" y1="19" x2="12" y2="23"/>
        <line x1="8" y1="23" x2="16" y2="23"/>
      </svg>
    ),
    label: "Podcast",
    desc: "Upload audio episodes with cover art, tags and timestamps",
    color: "#2D7A4A",
    bg: "rgba(45,122,74,0.08)",
  },
];

export default function CreatePage() {
  const router = useRouter();

  return (
    <div style={{ minHeight: "100vh", backgroundColor: BG, display: "flex", flexDirection: "column" }}>

      {/* Top bar */}
      <div style={{ backgroundColor: TEXT, padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>
        <button onClick={() => router.back()} style={{
          background: "none", border: "none", cursor: "pointer",
          color: "#888", display: "flex", alignItems: "center", gap: 8,
          fontSize: "0.83rem", fontFamily: "'Inter', sans-serif",
        }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#ccc")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#888")}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          Back
        </button>
        <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "#888" }}>
          Admin
        </span>
        <div style={{ width: 60 }} />
      </div>

      {/* Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 24px" }}>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "2.4rem", fontWeight: 400, color: TEXT, marginBottom: 8, textAlign: "center" }}>
          What are you creating?
        </h1>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", color: MUTED, marginBottom: 48, textAlign: "center" }}>
          Choose a content type to get started
        </p>

        <div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center", maxWidth: 900 }}>
          {OPTIONS.map((opt) => (
            <Link key={opt.type} href={opt.href} style={{ textDecoration: "none", flex: "1 1 240px", maxWidth: 280 }}>
              <div style={{
                backgroundColor: "white", borderRadius: 16,
                border: "1.5px solid #E8E4DE", padding: "32px 28px",
                cursor: "pointer", transition: "all 0.18s",
                display: "flex", flexDirection: "column", gap: 16,
              }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = opt.color;
                  el.style.boxShadow = `0 8px 32px rgba(0,0,0,0.08)`;
                  el.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "#E8E4DE";
                  el.style.boxShadow = "none";
                  el.style.transform = "translateY(0)";
                }}
              >
                <div style={{
                  width: 64, height: 64, borderRadius: 14,
                  backgroundColor: opt.bg, display: "flex",
                  alignItems: "center", justifyContent: "center",
                  color: opt.color,
                }}>
                  {opt.icon}
                </div>
                <div>
                  <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.4rem", color: TEXT, marginBottom: 6 }}>
                    {opt.label}
                  </div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.83rem", color: MUTED, lineHeight: 1.5 }}>
                    {opt.desc}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, color: opt.color, fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", fontWeight: 600, marginTop: 4 }}>
                  Create {opt.label}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
