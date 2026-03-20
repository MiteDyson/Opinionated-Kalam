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

// ── Icons ────────────────────────────────────────────────────────
const IconEye = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>);
const IconEdit = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>);
const IconTrash = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>);
const IconSignOut = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>);
const IconHome = () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>);
const IconPlus = () => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>);
const IconSort = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M6 12h12M9 18h6"/></svg>);
const IconChevUp = () => (<svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="18 15 12 9 6 15"/></svg>);
const IconChevDown = () => (<svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>);

// ── Skeleton row ─────────────────────────────────────────────────
const SkeletonRow = () => (
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
  return <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.05em", backgroundColor: s.bg, color: s.color, fontFamily: "'Inter', sans-serif" }}>{type}</span>;
};

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
  const sortRef = useRef<HTMLDivElement>(null);

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
      `}</style>

      {/* ── Thicker top bar (64px) ── */}
      <div style={{ backgroundColor: TEXT, padding: "0 28px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64, position: "sticky", top: 0, zIndex: 10, boxShadow: "0 1px 0 rgba(255,255,255,0.06)" }}>
        <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.25rem", color: "white", letterSpacing: "-0.3px" }}>
          Admin
        </span>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {/* View site — navigates internally, no new tab */}
          <button
            onClick={() => router.push("/")}
            title="View Site"
            style={{ ...iconBtn("#aaa", "transparent", "rgba(255,255,255,0.14)") }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.09)"; (e.currentTarget as HTMLElement).style.color = "white"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; (e.currentTarget as HTMLElement).style.color = "#aaa"; }}
          >
            <IconHome />
          </button>

          {/* Create */}
          <button
            onClick={() => router.push("/admin/create")}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "0 16px", height: 36, borderRadius: 8, border: "none", backgroundColor: TERRA, color: TEXT, cursor: "pointer", fontSize: "0.82rem", fontWeight: 700, fontFamily: "'Inter', sans-serif" }}
          >
            <IconPlus /> Create
          </button>

          {/* Sign out */}
          <button
            onClick={logout}
            title="Sign out"
            style={{ ...iconBtn("#888", "transparent", "rgba(255,255,255,0.14)") }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.09)"; (e.currentTarget as HTMLElement).style.color = "#e05555"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; (e.currentTarget as HTMLElement).style.color = "#888"; }}
          >
            <IconSignOut />
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px" }}>

        {/* Stats — skeleton or real */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 28 }}>
          {loading
            ? [0,1,2,3].map(i => <SkeletonStat key={i} />)
            : STATS.map(s => (
              <div key={s.label} style={{ backgroundColor: "white", borderRadius: 10, padding: "18px 20px", border: "1px solid #CFCBC3" }}>
                <div style={{ fontSize: "1.3rem", marginBottom: 6 }}>{s.icon}</div>
                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.8rem", color: TEXT, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", color: MUTED, marginTop: 3 }}>{s.label}</div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", color: "#3a7a3e", marginTop: 4 }}>{s.sub}</div>
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

        {/* ── Content table ── */}
        <div style={{ backgroundColor: "white", borderRadius: 12, border: "1px solid #CFCBC3", overflow: "hidden" }}>

          {/* Table toolbar */}
          <div style={{ padding: "13px 20px", borderBottom: "1px solid #CFCBC3", display: "flex", alignItems: "center", gap: 10 }}>

            {/* Sort icon button — leftmost */}
            <div ref={sortRef} style={{ position: "relative" }}>
              <button
                onClick={() => setSortOpen(o => !o)}
                title={`Sort by ${sortLabels[sortKey]} (${sortDir === "asc" ? "ascending" : "descending"})`}
                style={{
                  ...iconBtn(sortOpen ? ACCENT : MUTED, sortOpen ? "rgba(27,42,71,0.07)" : "transparent", sortOpen ? "rgba(27,42,71,0.3)" : "#CFCBC3"),
                  position: "relative",
                }}
                onMouseEnter={(e) => { if (!sortOpen) { (e.currentTarget as HTMLElement).style.backgroundColor = "#f0f0ee"; (e.currentTarget as HTMLElement).style.color = TEXT; } }}
                onMouseLeave={(e) => { if (!sortOpen) { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; (e.currentTarget as HTMLElement).style.color = MUTED; } }}
              >
                <IconSort />
                {/* tiny indicator dot showing active sort */}
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

            <div style={{ width: 1, height: 18, backgroundColor: "#e0ddd8" }} />

            <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: "0.86rem", color: TEXT, flex: 1 }}>
              Content
            </span>

            {/* Tab filters */}
            <div style={{ display: "flex", gap: 4 }}>
              {(["all","article","short","podcast"] as Tab[]).map(t => (
                <button key={t} onClick={() => setTab(t)} style={{ padding: "5px 11px", borderRadius: 6, cursor: "pointer", border: `1px solid ${tab === t ? ACCENT : "#CFCBC3"}`, backgroundColor: tab === t ? ACCENT : "transparent", color: tab === t ? "white" : MUTED, fontSize: "0.72rem", fontFamily: "'Inter', sans-serif", textTransform: "capitalize", transition: "all 0.13s" }}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Column labels */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 80px 100px 64px 64px 96px", padding: "8px 20px", borderBottom: "1px solid #CFCBC3", backgroundColor: "#faf9f7" }}>
            {["Title","Type","Status","Views","Likes","Actions"].map(h => (
              <span key={h} style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.66rem", fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</span>
            ))}
          </div>

          {/* Rows — skeleton or real */}
          {loading ? (
            <>{[0,1,2,3,4].map(i => <SkeletonRow key={i} />)}</>
          ) : filtered.length === 0 ? (
            <div style={{ padding: "40px 20px", textAlign: "center", color: MUTED, fontFamily: "'Inter', sans-serif", fontSize: "0.85rem" }}>
              No content yet.{" "}
              <button onClick={() => router.push("/admin/create")} style={{ color: ACCENT, background: "none", border: "none", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem" }}>Create something →</button>
            </div>
          ) : filtered.map((a, i) => (
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
          ))}
        </div>
      </div>
    </div>
  );
}
