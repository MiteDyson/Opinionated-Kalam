"use client";

import { useState } from "react";
import Link from "next/link";

const ACCENT  = "#1B2A47";
const SURFACE = "#1a1a1a";

const STATS = [
  { label: "Total Articles",   value: "24",   sub: "+3 this week",    icon: "📄" },
  { label: "Published",        value: "18",   sub: "6 drafts",        icon: "✅" },
  { label: "Total Views",      value: "12.4k", sub: "+18% this month", icon: "👁" },
  { label: "Total Likes",      value: "1,832", sub: "+124 this week",  icon: "❤️" },
];

const ARTICLES = [
  { title: "Indians are Sunroof-Suckers?",                               type: "article", status: "published", views: 4200, likes: 142, date: "5 Mar 2026",  tags: ["Automotive", "India"],   slug: "indians-are-sunroof-suckers" },
  { title: "How Volkswagen fooled the American Government for 7 Years?", type: "article", status: "published", views: 3800, likes: 98,  date: "7 Mar 2026",  tags: ["Scandals"],              slug: "how-volkswagen-fooled-the-american-government-for-7-years" },
  { title: "Pakistan vs Afghanistan War",                                 type: "article", status: "published", views: 2100, likes: 76,  date: "3 Mar 2026",  tags: ["Geo Politics"],          slug: "pakistan-vs-afghanistan-war" },
  { title: "Why is Japan so Prone to Earthquakes?",                      type: "article", status: "draft",     views: 0,    likes: 0,   date: "2 Mar 2026",  tags: ["Explainers"],            slug: "why-is-japan-so-prone-to-earthquakes-explained" },
  { title: "Quick Fact: Sunroofs vs. AC Efficiency",                     type: "short",   status: "published", views: 980,  likes: 38,  date: "1 Mar 2026",  tags: ["Automotive"],            slug: "quick-fact-sunroofs-vs-ac-efficiency" },
  { title: "Timeline: VW Scandal",                                        type: "short",   status: "published", views: 740,  likes: 27,  date: "28 Feb 2026", tags: ["Scandals"],              slug: "timeline-vw-scandal" },
];

type TabType = "all" | "article" | "short" | "podcast";

const typeBadge = (type: string) => {
  const map: Record<string, { bg: string; color: string }> = {
    article: { bg: "rgba(27,42,71,0.2)", color: "#1B2A47" },
    short:   { bg: "rgba(211,139,136,0.2)", color: "#d38b88" },
    podcast: { bg: "rgba(76,175,80,0.15)", color: "#4CAF50" },
  };
  const s = map[type] ?? map.article;
  return (
    <span style={{
      padding: "2px 8px", borderRadius: 4, fontSize: "0.68rem", fontWeight: 700,
      textTransform: "uppercase" as const, letterSpacing: "0.05em",
      backgroundColor: s.bg, color: s.color, fontFamily: "'Inter', sans-serif",
    }}>
      {type}
    </span>
  );
};

export default function AdminDashboard() {
  const [tab, setTab] = useState<TabType>("all");

  const filtered = tab === "all" ? ARTICLES : ARTICLES.filter(a => a.type === tab);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0f0f0f", color: "#e8e8e8" }}>

      {/* Top bar */}
      <div style={{ backgroundColor: SURFACE, borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.5rem", color: "white" }}>
          Admin — Opinionated Kalam
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Link href="/" style={{ color: "#888", fontSize: "0.85rem", fontFamily: "'Inter', sans-serif", textDecoration: "none" }}>
            ← View Site
          </Link>
          <Link href="/admin/articles/new" style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            padding: "9px 18px", borderRadius: 8,
            backgroundColor: ACCENT, color: "white",
            fontSize: "0.85rem", fontWeight: 700,
            fontFamily: "'Inter', sans-serif", textDecoration: "none",
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            New Article
          </Link>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "36px 32px" }}>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginBottom: 40 }}>
          {STATS.map((s) => (
            <div key={s.label} style={{
              backgroundColor: SURFACE, borderRadius: 12,
              padding: "22px 24px",
              border: "1px solid rgba(255,255,255,0.06)",
            }}>
              <div style={{ fontSize: "1.6rem", marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "2rem", color: "white", lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", color: "#888", marginTop: 4 }}>{s.label}</div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.72rem", color: "#4CAF50", marginTop: 6 }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Articles table */}
        <div style={{ backgroundColor: SURFACE, borderRadius: 14, border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden" }}>
          {/* Table header */}
          <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <h2 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: "1rem", color: "white", margin: 0 }}>
              Articles
            </h2>
            {/* Filter tabs */}
            <div style={{ display: "flex", gap: 6 }}>
              {(["all", "article", "short", "podcast"] as TabType[]).map(t => (
                <button key={t} onClick={() => setTab(t)} style={{
                  padding: "5px 12px", borderRadius: 6, cursor: "pointer",
                  border: `1px solid ${tab === t ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.1)"}`,
                  backgroundColor: tab === t ? "rgba(255,255,255,0.1)" : "transparent",
                  color: tab === t ? "white" : "#666",
                  fontSize: "0.78rem", fontFamily: "'Inter', sans-serif", textTransform: "capitalize",
                }}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Column headers */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 80px 90px 70px 60px 100px 80px", gap: 0, padding: "10px 24px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            {["Title", "Type", "Status", "Views", "Likes", "Tags", "Actions"].map(h => (
              <span key={h} style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.72rem", fontWeight: 600, color: "#555", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</span>
            ))}
          </div>

          {/* Rows */}
          {filtered.map((a, i) => (
            <div key={a.slug} style={{
              display: "grid", gridTemplateColumns: "2fr 80px 90px 70px 60px 100px 80px",
              gap: 0, padding: "14px 24px", alignItems: "center",
              borderBottom: i < filtered.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
              transition: "background 0.15s",
            }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.02)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")}
            >
              <div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.88rem", color: "#e8e8e8", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 280 }}>
                  {a.title}
                </div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.72rem", color: "#555", marginTop: 3 }}>{a.date}</div>
              </div>
              <div>{typeBadge(a.type)}</div>
              <div>
                <span style={{
                  padding: "2px 8px", borderRadius: 4,
                  fontSize: "0.68rem", fontWeight: 600, fontFamily: "'Inter', sans-serif",
                  backgroundColor: a.status === "published" ? "rgba(76,175,80,0.15)" : "rgba(255,193,7,0.15)",
                  color: a.status === "published" ? "#4CAF50" : "#FFC107",
                  textTransform: "capitalize",
                }}>
                  {a.status}
                </span>
              </div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", color: "#aaa" }}>{a.views.toLocaleString()}</div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", color: "#aaa" }}>{a.likes}</div>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                {a.tags.slice(0, 2).map(t => (
                  <span key={t} style={{ padding: "1px 6px", borderRadius: 3, backgroundColor: "rgba(27,42,71,0.4)", color: "#7b99cc", fontSize: "0.65rem", fontFamily: "'Inter', sans-serif" }}>
                    {t}
                  </span>
                ))}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <Link href={`/admin/articles/${a.slug}/edit`} style={{
                  fontSize: "0.78rem", color: "#888", fontFamily: "'Inter', sans-serif",
                  textDecoration: "none", padding: "3px 8px", borderRadius: 4,
                  border: "1px solid rgba(255,255,255,0.1)", transition: "color 0.15s",
                }}
                  onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "white")}
                  onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "#888")}
                >
                  Edit
                </Link>
                <Link href="/admin/users" style={{ color: "#888", fontSize: "0.85rem", fontFamily: "'Inter', sans-serif", textDecoration: "none" }}>
  Manage Admins
</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
