"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase";

const ACCENT = "#1B2A47";
const BG     = "#D5D2CB";
const TEXT   = "#1A1A1A";
const MUTED  = "#555555";
const TERRA  = "#D38B88";

interface Article {
  _id: string;
  title: string;
  slug: string;
  type: string;
  status: string;
  views: number;
  likes: number;
  publishedAt?: string;
  createdAt: string;
}

type Tab     = "all" | "article" | "short" | "podcast";
type SortKey = "title" | "views" | "likes" | "createdAt";
type SortDir = "asc" | "desc";

const IconEye = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>);
const IconEdit = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>);
const IconTrash = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>);
const IconSignOut = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>);
const IconHome = () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>);
const IconPlus = () => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>);
const IconSort = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M6 12h12M9 18h6"/></svg>);
const IconChevUp = () => (<svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="18 15 12 9 6 15"/></svg>);
const IconChevDown = () => (<svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>);

function SkeletonRow({ isMobile }: { isMobile: boolean }) {
  if (isMobile) {
    return (
      <div style={{ padding: "14px 16px", borderBottom: "1px solid #f5f5f3" }}>
        <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 7 }}>
            <div style={{ height: 13, width: "70%", borderRadius: 4, background: "linear-gradient(90deg,#e8e5e0 25%,#f0eeea 50%,#e8e5e0 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite" }} />
            <div style={{ height: 10, width: "40%", borderRadius: 4, background: "linear-gradient(90deg,#e8e5e0 25%,#f0eeea 50%,#e8e5e0 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite 0.1s" }} />
          </div>
          <div style={{ height: 28, width: 80, borderRadius: 4, background: "linear-gradient(90deg,#e8e5e0 25%,#f0eeea 50%,#e8e5e0 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite 0.2s" }} />
        </div>
      </div>
    );
  }
  return (
    <div style={{ display: "grid", gridTemplateColumns: "2fr 80px 100px 64px 64px 96px", padding: "14px 20px", alignItems: "center", borderBottom: "1px solid #f5f5f3" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
        <div style={{ height: 13, width: "65%", borderRadius: 4, background: "linear-gradient(90deg,#e8e5e0 25%,#f0eeea 50%,#e8e5e0 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite" }} />
        <div style={{ height: 10, width: "35%", borderRadius: 4, background: "linear-gradient(90deg,#e8e5e0 25%,#f0eeea 50%,#e8e5e0 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite 0.1s" }} />
      </div>
      {[60, 70, 36, 28, 84].map((w, i) => (
        <div key={i} style={{ height: 20, width: w, borderRadius: 4, background: "linear-gradient(90deg,#e8e5e0 25%,#f0eeea 50%,#e8e5e0 75%)", backgroundSize: "200% 100%", animation: `shimmer 1.4s infinite ${i * 0.06}s` }} />
      ))}
    </div>
  );
}

const SkeletonStat = () => (
  <div style={{ backgroundColor: "white", borderRadius: 10, padding: "18px 20px", border: "1px solid #CFCBC3" }}>
    <div style={{ height: 22, width: 28, borderRadius: 4, marginBottom: 10, background: "linear-gradient(90deg,#e8e5e0 25%,#f0eeea 50%,#e8e5e0 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite" }} />
    <div style={{ height: 28, width: "55%", borderRadius: 4, marginBottom: 7, background: "linear-gradient(90deg,#e8e5e0 25%,#f0eeea 50%,#e8e5e0 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite 0.1s" }} />
    <div style={{ height: 11, width: "40%", borderRadius: 3, background: "linear-gradient(90deg,#e8e5e0 25%,#f0eeea 50%,#e8e5e0 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite 0.2s" }} />
  </div>
);

const typeBadge = (type: string) => {
  const map: Record<string, { bg: string; color: string }> = {
    article: { bg: "rgba(27,42,71,0.12)",   color: ACCENT },
    short:   { bg: "rgba(211,139,136,0.2)", color: "#b85c58" },
    podcast: { bg: "rgba(76,140,80,0.12)",  color: "#3a7a3e" },
  };
  const s = map[type] ?? map.article;
  return <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.05em", backgroundColor: s.bg, color: s.color, fontFamily: "'Inter', sans-serif", whiteSpace: "nowrap" as const }}>{type}</span>;
};

// Mobile card row for an article
function MobileArticleRow({ a, i, filtered, onToggleStatus, onDelete, deleting, router }: {
  a: Article; i: number; filtered: Article[];
  onToggleStatus: (a: Article) => void;
  onDelete: (slug: string, title: string) => void;
  deleting: string | null;
  router: ReturnType<typeof useRouter>;
}) {
  return (
    <div
      key={a._id}
      style={{
        padding: "12px 16px",
        borderBottom: i < filtered.length - 1 ? "1px solid #f5f5f3" : "none",
        transition: "background 0.1s",
      }}
      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#faf9f7")}
      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")}
    >
      {/* Row 1: title + action buttons */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 8 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.84rem", color: TEXT, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {a.title}
          </div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.69rem", color: MUTED, marginTop: 3 }}>
            {new Date(a.publishedAt ?? a.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
          </div>
        </div>
        {/* Action buttons */}
        <div style={{ display: "flex", gap: 5, flexShrink: 0 }}>
          <Link
            href={a.type === "podcast" ? `/admin/podcasts/${a.slug}/edit` : `/admin/articles/${a.slug}/edit`}
            title="Edit"
            style={{ width: 30, height: 30, borderRadius: 6, border: "1px solid rgba(27,42,71,0.25)", backgroundColor: "transparent", color: ACCENT, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}
          ><IconEdit /></Link>
          <Link
            href={a.type === "short" ? `/shorts/${a.slug}` : a.type === "podcast" ? `/podcasts/${a.slug}` : `/article/${a.slug}`}
            title="View"
            style={{ width: 30, height: 30, borderRadius: 6, border: "1px solid #CFCBC3", backgroundColor: "transparent", color: MUTED, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}
          ><IconEye /></Link>
          <button
            onClick={() => onDelete(a.slug, a.title)}
            disabled={deleting === a.slug}
            title="Delete"
            style={{ width: 30, height: 30, borderRadius: 6, border: "1px solid rgba(192,57,43,0.25)", backgroundColor: "transparent", color: "#c0392b", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: deleting === a.slug ? 0.4 : 1 }}
          ><IconTrash /></button>
        </div>
      </div>
      {/* Row 2: type badge + status toggle + stats */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        {typeBadge(a.type)}
        <button
          onClick={() => onToggleStatus(a)}
          style={{
            padding: "2px 8px", borderRadius: 4, cursor: "pointer", fontSize: "0.67rem", fontWeight: 600,
            fontFamily: "'Inter', sans-serif", border: "none", textTransform: "capitalize" as const,
            backgroundColor: a.status === "published" ? "rgba(76,140,80,0.12)" : "rgba(217,178,0,0.12)",
            color: a.status === "published" ? "#3a7a3e" : "#8a6a00",
          }}
        >
          {a.status}
        </button>
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.72rem", color: MUTED, display: "flex", alignItems: "center", gap: 3 }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          {(a.views ?? 0).toLocaleString()}
        </span>
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.72rem", color: MUTED, display: "flex", alignItems: "center", gap: 3 }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill={a.likes > 0 ? TERRA : "none"} stroke={TERRA} strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          {a.likes ?? 0}
        </span>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { logout } = useAuth();
  const router     = useRouter();

  const [tab, setTab]           = useState<Tab>("all");
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading]   = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError]       = useState("");
  const [sortKey, setSortKey]   = useState<SortKey>("createdAt");
  const [sortDir, setSortDir]   = useState<SortDir>("desc");
  const [sortOpen, setSortOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) setSortOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
    setSortOpen(false);
  };

  const fetchArticles = async () => {
    setLoading(true); setError("");
    try {
      const token = await auth.currentUser?.getIdToken();
      const headers = { Authorization: `Bearer ${token}` };
      const [pubRes, draftRes] = await Promise.all([
        fetch("/api/articles?status=published", { headers }),
        fetch("/api/articles?status=draft",     { headers }),
      ]);
      const pub   = pubRes.ok   ? await pubRes.json()   : [];
      const draft = draftRes.ok ? await draftRes.json() : [];
      setArticles([...(Array.isArray(pub) ? pub : []), ...(Array.isArray(draft) ? draft : [])]);
    } catch (e: any) { setError("Failed to load: " + e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchArticles(); }, []);

  const handleDelete = async (slug: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    setDeleting(slug);
    try {
      const token = await auth.currentUser?.getIdToken();
      await fetch(`/api/articles/${slug}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      setArticles(prev => prev.filter(a => a.slug !== slug));
    } catch (e: any) { alert("Delete failed: " + e.message); }
    finally { setDeleting(null); }
  };

  const handleToggleStatus = async (article: Article) => {
    const newStatus = article.status === "published" ? "draft" : "published";
    setArticles(prev => prev.map(a => a.slug === article.slug ? { ...a, status: newStatus } : a));
    try {
      const token = await auth.currentUser?.getIdToken();
      await fetch(`/api/articles/${article.slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus, publishedAt: newStatus === "published" ? new Date() : null }),
      });
    } catch { setArticles(prev => prev.map(a => a.slug === article.slug ? { ...a, status: article.status } : a)); }
  };

  const sorted = [...articles].sort((a, b) => {
    let cmp = 0;
    if (sortKey === "title")     cmp = a.title.localeCompare(b.title);
    if (sortKey === "views")     cmp = (a.views ?? 0) - (b.views ?? 0);
    if (sortKey === "likes")     cmp = (a.likes ?? 0) - (b.likes ?? 0);
    if (sortKey === "createdAt") cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    return sortDir === "asc" ? cmp : -cmp;
  });
  const filtered = tab === "all" ? sorted : sorted.filter(a => a.type === tab);

  const published  = articles.filter(a => a.status === "published").length;
  const drafts     = articles.filter(a => a.status === "draft").length;
  const totalViews = articles.reduce((s, a) => s + (a.views ?? 0), 0);
  const totalLikes = articles.reduce((s, a) => s + (a.likes ?? 0), 0);

  const STATS = [
    { label: "Total",     value: articles.length.toString(), sub: `${drafts} drafts`,  icon: "📄" },
    { label: "Published", value: published.toString(),        sub: `${drafts} pending`, icon: "✅" },
    { label: "Views",     value: totalViews > 999 ? `${(totalViews/1000).toFixed(1)}k` : totalViews.toString(), sub: "all time", icon: "👁" },
    { label: "Likes",     value: totalLikes.toLocaleString(), sub: "all time", icon: "❤️" },
  ];

  const sortLabels: Record<SortKey, string> = { title: "Name", views: "Views", likes: "Likes", createdAt: "Date" };

  const iconBtn = (color = TEXT, bg = "transparent", border = "#CFCBC3"): React.CSSProperties => ({
    width: 34, height: 34, borderRadius: 7, border: `1px solid ${border}`,
    backgroundColor: bg, color, cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    transition: "all 0.14s", flexShrink: 0,
  });

  return (
    <div style={{ minHeight: "100vh", backgroundColor: BG, color: TEXT }}>
      <style>{`
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        .tab-scroll { overflow-x: auto; scrollbar-width: none; }
        .tab-scroll::-webkit-scrollbar { display: none; }
      `}</style>

      {/* ── Top bar ── */}
      <div style={{
        backgroundColor: TEXT, padding: isMobile ? "0 14px" : "0 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: 56, position: "sticky", top: 0, zIndex: 10,
        boxShadow: "0 1px 0 rgba(255,255,255,0.06)",
      }}>
        <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.15rem", color: "white", letterSpacing: "-0.3px", flexShrink: 0 }}>
          Admin
        </span>
        <div style={{ display: "flex", gap: isMobile ? 6 : 8, alignItems: "center" }}>
          {!isMobile && (
            <button onClick={() => router.push("/")} title="View Site" style={{ ...iconBtn("#aaa", "transparent", "rgba(255,255,255,0.14)") }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.09)"; (e.currentTarget as HTMLElement).style.color = "white"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; (e.currentTarget as HTMLElement).style.color = "#aaa"; }}
            ><IconHome /></button>
          )}
          <button onClick={() => router.push("/admin/create")} style={{ display: "flex", alignItems: "center", gap: 6, padding: isMobile ? "0 10px" : "0 14px", height: 34, borderRadius: 7, border: "none", backgroundColor: TERRA, color: TEXT, cursor: "pointer", fontSize: "0.82rem", fontWeight: 700, fontFamily: "'Inter', sans-serif" }}>
            <IconPlus /> {!isMobile && "Create"}
          </button>
          <button onClick={logout} title="Sign out" style={{ ...iconBtn("#888", "transparent", "rgba(255,255,255,0.14)") }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.09)"; (e.currentTarget as HTMLElement).style.color = "#e05555"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; (e.currentTarget as HTMLElement).style.color = "#888"; }}
          ><IconSignOut /></button>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: isMobile ? "16px 12px" : "24px" }}>

        {/* Stats — 2-col on mobile, 4-col on desktop */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: isMobile ? 8 : 12, marginBottom: isMobile ? 16 : 24 }}>
          {loading
            ? [0,1,2,3].map(i => <SkeletonStat key={i} />)
            : STATS.map(s => (
              <div key={s.label} style={{ backgroundColor: "white", borderRadius: 10, padding: isMobile ? "12px 14px" : "16px 18px", border: "1px solid #CFCBC3" }}>
                <div style={{ fontSize: isMobile ? "1rem" : "1.2rem", marginBottom: 4 }}>{s.icon}</div>
                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: isMobile ? "1.4rem" : "1.7rem", color: TEXT, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.74rem", color: MUTED, marginTop: 3 }}>{s.label}</div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.69rem", color: "#3a7a3e", marginTop: 4 }}>{s.sub}</div>
              </div>
            ))
          }
        </div>

        {error && (
          <div style={{ padding: "10px 16px", backgroundColor: "rgba(217,35,35,0.08)", border: "1px solid rgba(217,35,35,0.2)", borderRadius: 8, marginBottom: 16, fontFamily: "'Inter', sans-serif", fontSize: "0.83rem", color: "#c0392b", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            {error}
            <button onClick={fetchArticles} style={{ background: ACCENT, border: "none", color: "white", padding: "3px 10px", borderRadius: 5, cursor: "pointer", fontSize: "0.75rem", fontFamily: "'Inter', sans-serif" }}>Retry</button>
          </div>
        )}

        {/* Content table / card list */}
        <div style={{ backgroundColor: "white", borderRadius: 12, border: "1px solid #CFCBC3", overflow: "hidden" }}>

          {/* Table toolbar */}
          <div style={{ padding: isMobile ? "10px 14px" : "12px 18px", borderBottom: "1px solid #CFCBC3", display: "flex", alignItems: "center", gap: 8, flexWrap: "nowrap" }}>

            {/* Sort */}
            <div ref={sortRef} style={{ position: "relative", flexShrink: 0 }}>
              <button onClick={() => setSortOpen(o => !o)} title={`Sort by ${sortLabels[sortKey]}`}
                style={{ ...iconBtn(sortOpen ? ACCENT : MUTED, sortOpen ? "rgba(27,42,71,0.07)" : "transparent", sortOpen ? "rgba(27,42,71,0.3)" : "#CFCBC3"), position: "relative" }}
                onMouseEnter={(e) => { if (!sortOpen) { (e.currentTarget as HTMLElement).style.backgroundColor = "#f0f0ee"; (e.currentTarget as HTMLElement).style.color = TEXT; } }}
                onMouseLeave={(e) => { if (!sortOpen) { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; (e.currentTarget as HTMLElement).style.color = MUTED; } }}
              >
                <IconSort />
                <span style={{ position: "absolute", top: 4, right: 4, width: 5, height: 5, borderRadius: "50%", backgroundColor: ACCENT, opacity: sortKey !== "createdAt" || sortDir !== "desc" ? 1 : 0, transition: "opacity 0.2s" }} />
              </button>

              {sortOpen && (
                <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, zIndex: 50, backgroundColor: "white", borderRadius: 10, border: "1px solid #CFCBC3", boxShadow: "0 8px 28px rgba(0,0,0,0.1)", overflow: "hidden", minWidth: 160, animation: "fadeDown 0.12s ease" }}>
                  <style>{`@keyframes fadeDown{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}`}</style>
                  <div style={{ padding: "8px 12px 6px", fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: "1px solid #f5f5f3" }}>Sort by</div>
                  {(["title","views","likes","createdAt"] as SortKey[]).map((key, i, arr) => (
                    <button key={key} onClick={() => handleSort(key)} style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      width: "100%", padding: "9px 14px", background: "none", border: "none",
                      cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: "0.83rem",
                      color: sortKey === key ? ACCENT : TEXT, fontWeight: sortKey === key ? 700 : 400,
                      backgroundColor: sortKey === key ? "rgba(27,42,71,0.04)" : "transparent",
                      borderBottom: i < arr.length - 1 ? "1px solid #f5f5f3" : "none",
                    }}
                      onMouseEnter={(e) => { if (sortKey !== key) (e.currentTarget as HTMLElement).style.backgroundColor = "#faf9f7"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = sortKey === key ? "rgba(27,42,71,0.04)" : "transparent"; }}
                    >
                      <span>{sortLabels[key]}</span>
                      {sortKey === key && (
                        <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: "0.65rem", padding: "1px 5px", borderRadius: 3, backgroundColor: "rgba(27,42,71,0.1)", color: ACCENT }}>
                          {sortDir === "asc" ? <><IconChevUp /> Asc</> : <><IconChevDown /> Desc</>}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div style={{ width: 1, height: 18, backgroundColor: "#e0ddd8", flexShrink: 0 }} />
            <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: isMobile ? "0.82rem" : "0.86rem", color: TEXT, flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Content</span>

            {/* Tab filters — scrollable strip on mobile */}
            <div className="tab-scroll" style={{ display: "flex", gap: 4, flexShrink: 0, maxWidth: isMobile ? "50vw" : "none" }}>
              {(["all","article","short","podcast"] as Tab[]).map(t => (
                <button key={t} onClick={() => setTab(t)} style={{
                  padding: isMobile ? "4px 8px" : "5px 11px",
                  borderRadius: 6, cursor: "pointer",
                  border: `1px solid ${tab === t ? ACCENT : "#CFCBC3"}`,
                  backgroundColor: tab === t ? ACCENT : "transparent",
                  color: tab === t ? "white" : MUTED,
                  fontSize: isMobile ? "0.68rem" : "0.72rem",
                  fontFamily: "'Inter', sans-serif", textTransform: "capitalize" as const,
                  transition: "all 0.13s", whiteSpace: "nowrap" as const, flexShrink: 0,
                }}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* ── DESKTOP: column headers + grid rows ── */}
          {!isMobile && (
            <div style={{ display: "grid", gridTemplateColumns: "2fr 80px 100px 64px 64px 96px", padding: "8px 20px", borderBottom: "1px solid #CFCBC3", backgroundColor: "#faf9f7" }}>
              {["Title","Type","Status","Views","Likes","Actions"].map(h => (
                <span key={h} style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.66rem", fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</span>
              ))}
            </div>
          )}

          {/* Rows */}
          {loading ? (
            <>{[0,1,2,3,4].map(i => <SkeletonRow key={i} isMobile={isMobile} />)}</>
          ) : filtered.length === 0 ? (
            <div style={{ padding: "40px 20px", textAlign: "center", color: MUTED, fontFamily: "'Inter', sans-serif", fontSize: "0.85rem" }}>
              No content yet.{" "}
              <button onClick={() => router.push("/admin/create")} style={{ color: ACCENT, background: "none", border: "none", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem" }}>Create something →</button>
            </div>
          ) : isMobile ? (
            // ── MOBILE: card rows ──
            filtered.map((a, i) => (
              <MobileArticleRow
                key={a._id}
                a={a} i={i} filtered={filtered}
                onToggleStatus={handleToggleStatus}
                onDelete={handleDelete}
                deleting={deleting}
                router={router}
              />
            ))
          ) : (
            // ── DESKTOP: grid rows ──
            filtered.map((a, i) => (
              <div key={a._id}
                style={{ display: "grid", gridTemplateColumns: "2fr 80px 100px 64px 64px 96px", padding: "12px 20px", alignItems: "center", borderBottom: i < filtered.length - 1 ? "1px solid #f5f5f3" : "none", transition: "background 0.1s" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#faf9f7")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")}
              >
                <div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.84rem", color: TEXT, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 280 }}>{a.title}</div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.69rem", color: MUTED, marginTop: 2 }}>
                    {new Date(a.publishedAt ?? a.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </div>
                </div>
                <div>{typeBadge(a.type)}</div>
                <div>
                  <button onClick={() => handleToggleStatus(a)} style={{ padding: "2px 8px", borderRadius: 4, cursor: "pointer", fontSize: "0.67rem", fontWeight: 600, fontFamily: "'Inter', sans-serif", border: "none", textTransform: "capitalize", backgroundColor: a.status === "published" ? "rgba(76,140,80,0.12)" : "rgba(217,178,0,0.12)", color: a.status === "published" ? "#3a7a3e" : "#8a6a00" }}>
                    {a.status}
                  </button>
                </div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.82rem", color: MUTED }}>{(a.views ?? 0).toLocaleString()}</div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.82rem", color: MUTED }}>{a.likes ?? 0}</div>
                <div style={{ display: "flex", gap: 5 }}>
                  <Link href={a.type === "podcast" ? `/admin/podcasts/${a.slug}/edit` : `/admin/articles/${a.slug}/edit`} title="Edit"
                    style={{ width: 30, height: 30, borderRadius: 6, border: "1px solid rgba(27,42,71,0.25)", backgroundColor: "transparent", color: ACCENT, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", transition: "all 0.13s" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(27,42,71,0.08)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
                  ><IconEdit /></Link>

                  <Link href={a.type === "short" ? `/shorts/${a.slug}` : a.type === "podcast" ? `/podcasts/${a.slug}` : `/article/${a.slug}`} title="View"
                    style={{ width: 30, height: 30, borderRadius: 6, border: "1px solid #CFCBC3", backgroundColor: "transparent", color: MUTED, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", transition: "all 0.13s" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "#f0f0ee"; (e.currentTarget as HTMLElement).style.color = TEXT; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; (e.currentTarget as HTMLElement).style.color = MUTED; }}
                  ><IconEye /></Link>

                  <button onClick={() => handleDelete(a.slug, a.title)} disabled={deleting === a.slug} title="Delete"
                    style={{ width: 30, height: 30, borderRadius: 6, border: "1px solid rgba(192,57,43,0.25)", backgroundColor: "transparent", color: "#c0392b", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.13s", opacity: deleting === a.slug ? 0.4 : 1 }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(192,57,43,0.06)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
                  ><IconTrash /></button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}