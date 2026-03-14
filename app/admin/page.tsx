"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const ACCENT  = "#1B2A47";
const BG      = "#D5D2CB";
const SURFACE = "#CFCBC3";
const TEXT    = "#1A1A1A";
const MUTED   = "#555555";
const TERRA   = "#D38B88";

const STATS = [
  { label: "Total Articles", value: "24",    sub: "+3 this week",    icon: "📄" },
  { label: "Published",      value: "18",    sub: "6 drafts",        icon: "✅" },
  { label: "Total Views",    value: "12.4k", sub: "+18% this month", icon: "👁" },
  { label: "Total Likes",    value: "1,832", sub: "+124 this week",  icon: "❤️" },
];

const ARTICLES = [
  { title: "Indians are Sunroof-Suckers?",                               type: "article", status: "published", views: 4200, likes: 142, date: "5 Mar 2026",  slug: "indians-are-sunroof-suckers" },
  { title: "How Volkswagen fooled the American Government for 7 Years?", type: "article", status: "published", views: 3800, likes: 98,  date: "7 Mar 2026",  slug: "how-volkswagen-fooled" },
  { title: "Pakistan vs Afghanistan War",                                 type: "article", status: "published", views: 2100, likes: 76,  date: "3 Mar 2026",  slug: "pakistan-vs-afghanistan" },
  { title: "Why is Japan so Prone to Earthquakes?",                      type: "article", status: "draft",     views: 0,    likes: 0,   date: "2 Mar 2026",  slug: "japan-earthquakes" },
  { title: "Quick Fact: Sunroofs vs. AC Efficiency",                     type: "short",   status: "published", views: 980,  likes: 38,  date: "1 Mar 2026",  slug: "sunroofs-ac" },
  { title: "Timeline: VW Scandal",                                        type: "short",   status: "published", views: 740,  likes: 27,  date: "28 Feb 2026", slug: "vw-scandal" },
  { title: "Why Japan Gets 1,500 Earthquakes a Year",                    type: "podcast", status: "published", views: 1200, likes: 55,  date: "25 Feb 2026", slug: "japan-earthquakes-pod" },
];

type Tab = "all" | "article" | "short" | "podcast";

const typeBadge = (type: string) => {
  const map: Record<string, { bg: string; color: string }> = {
    article: { bg: "rgba(27,42,71,0.12)", color: ACCENT },
    short:   { bg: "rgba(211,139,136,0.2)", color: "#b85c58" },
    podcast: { bg: "rgba(76,140,80,0.12)", color: "#3a7a3e" },
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
  const { logout } = useAuth();
  const [tab, setTab] = useState<Tab>("all");
  const filtered = tab === "all" ? ARTICLES : ARTICLES.filter(a => a.type === tab);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: BG, color: TEXT }}>

      {/* Top bar */}
      <div style={{
        backgroundColor: TEXT, padding: "16px 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 10,
      }}>
        <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.4rem", color: "#D5D2CB" }}>
          Opinionated Kalam — Admin
        </div>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <Link href="/" style={{ color: "#888", fontSize: "0.83rem", fontFamily: "'Inter', sans-serif", textDecoration: "none" }}>
            ← View Site
          </Link>
          <Link href="/admin/podcasts/new" style={{
            padding: "7px 16px", borderRadius: 7,
            border: "1px solid rgba(255,255,255,0.2)",
            backgroundColor: "transparent", color: "#ccc",
            fontSize: "0.83rem", fontWeight: 600,
            fontFamily: "'Inter', sans-serif", textDecoration: "none",
          }}>
            + Podcast
          </Link>
          <Link href="/admin/articles/new" style={{
            padding: "7px 16px", borderRadius: 7, border: "none",
            backgroundColor: TERRA, color: TEXT,
            fontSize: "0.83rem", fontWeight: 700,
            fontFamily: "'Inter', sans-serif", textDecoration: "none",
          }}>
            + New Article
          </Link>
          <button onClick={logout} style={{
            background: "none", border: "none", cursor: "pointer",
            color: "#666", fontSize: "0.8rem", fontFamily: "'Inter', sans-serif",
          }}>
            Sign out
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "36px 32px" }}>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 36 }}>
          {STATS.map((s) => (
            <div key={s.label} style={{
              backgroundColor: "white", borderRadius: 12,
              padding: "22px 24px", border: "1px solid #CFCBC3",
            }}>
              <div style={{ fontSize: "1.5rem", marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "2rem", color: TEXT, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", color: MUTED, marginTop: 4 }}>{s.label}</div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.72rem", color: "#3a7a3e", marginTop: 6 }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div style={{ backgroundColor: "white", borderRadius: 14, border: "1px solid #CFCBC3", overflow: "hidden" }}>
          <div style={{ padding: "18px 24px", borderBottom: "1px solid #CFCBC3", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <h2 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: "1rem", color: TEXT, margin: 0 }}>
              Content
            </h2>
            <div style={{ display: "flex", gap: 6 }}>
              {(["all", "article", "short", "podcast"] as Tab[]).map(t => (
                <button key={t} onClick={() => setTab(t)} style={{
                  padding: "5px 12px", borderRadius: 6, cursor: "pointer",
                  border: `1px solid ${tab === t ? ACCENT : "#CFCBC3"}`,
                  backgroundColor: tab === t ? ACCENT : "transparent",
                  color: tab === t ? "white" : MUTED,
                  fontSize: "0.78rem", fontFamily: "'Inter', sans-serif", textTransform: "capitalize",
                }}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Column headers */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 80px 90px 70px 60px 90px", padding: "10px 24px", borderBottom: "1px solid #CFCBC3", backgroundColor: "#faf9f7" }}>
            {["Title", "Type", "Status", "Views", "Likes", "Actions"].map(h => (
              <span key={h} style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</span>
            ))}
          </div>

          {filtered.map((a, i) => (
            <div key={a.slug} style={{
              display: "grid", gridTemplateColumns: "2fr 80px 90px 70px 60px 90px",
              padding: "14px 24px", alignItems: "center",
              borderBottom: i < filtered.length - 1 ? "1px solid #CFCBC3" : "none",
              transition: "background 0.15s",
            }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#faf9f7")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")}
            >
              <div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.88rem", color: TEXT, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 300 }}>
                  {a.title}
                </div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.72rem", color: MUTED, marginTop: 2 }}>{a.date}</div>
              </div>
              <div>{typeBadge(a.type)}</div>
              <div>
                <span style={{
                  padding: "2px 8px", borderRadius: 4,
                  fontSize: "0.68rem", fontWeight: 600, fontFamily: "'Inter', sans-serif",
                  backgroundColor: a.status === "published" ? "rgba(76,140,80,0.12)" : "rgba(217,178,0,0.12)",
                  color: a.status === "published" ? "#3a7a3e" : "#8a6a00",
                  textTransform: "capitalize",
                }}>
                  {a.status}
                </span>
              </div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", color: MUTED }}>{a.views.toLocaleString()}</div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", color: MUTED }}>{a.likes}</div>
              <div style={{ display: "flex", gap: 8 }}>
                <Link href={`/admin/articles/${a.slug}/edit`} style={{
                  fontSize: "0.78rem", color: ACCENT,
                  fontFamily: "'Inter', sans-serif", textDecoration: "none",
                  padding: "3px 8px", borderRadius: 4,
                  border: `1px solid ${ACCENT}`,
                }}>
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
