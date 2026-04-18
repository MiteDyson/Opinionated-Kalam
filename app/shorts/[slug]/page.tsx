"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import SideMenu from "@/components/layout/SideMenu";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase";

const ACCENT = "#1B2A47";
const RED    = "#D92323";

interface Short {
  _id: string;
  slug: string;
  title: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  author: string;
  tags: string[];
  readTime?: string;
  publishedAt?: string;
  likes: number;
  views: number;
  isLiked: boolean;
  isSaved: boolean;
}

function Tag({ label }: { label: string }) {
  return (
    <span style={{
      display: "inline-block", padding: "3px 10px", borderRadius: 4,
      fontSize: "0.65rem", fontWeight: 600, textTransform: "uppercase" as const,
      letterSpacing: "0.05em", fontFamily: "'Inter', sans-serif",
      backgroundColor: "rgba(27,42,71,0.1)", color: ACCENT,
    }}>
      {label}
    </span>
  );
}

export default function ShortPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;
  const { user } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [short, setShort]       = useState<Short | null>(null);
  const [loading, setLoading]   = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [liked,  setLiked]  = useState(false);
  const [saved,  setSaved]  = useState(false);
  const [likes,  setLikes]  = useState(0);
  const [copied, setCopied] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!slug) return;
    const fetch_ = async () => {
      try {
        const uid = auth.currentUser?.uid ?? "";
        const res = await fetch(`/api/articles/${slug}${uid ? `?uid=${uid}` : ""}`);
        if (!res.ok) { setNotFound(true); return; }
        const data = await res.json();
        setShort(data);
        setLikes(data.likes ?? 0);
        setLiked(data.isLiked ?? false);
        setSaved(data.isSaved ?? false);
      } catch { setNotFound(true); }
      finally { setLoading(false); }
    };
    fetch_();
  }, [slug]);

  const handleLike = async () => {
    if (!user) { router.push("/login"); return; }
    if (actionLoading) return;
    setActionLoading(true);
    const was = liked; setLiked(!was); setLikes(n => was ? n - 1 : n + 1);
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch(`/api/articles/${slug}/like`, { method: "POST", headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error();
      const data = await res.json(); setLiked(data.liked); setLikes(data.likes);
    } catch { setLiked(was); setLikes(n => was ? n + 1 : n - 1); }
    finally { setActionLoading(false); }
  };

  const handleSave = async () => {
    if (!user) { router.push("/login"); return; }
    if (actionLoading) return;
    setActionLoading(true);
    const was = saved; setSaved(!was);
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch(`/api/articles/${slug}/save`, { method: "POST", headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error();
      const data = await res.json(); setSaved(data.saved);
    } catch { setSaved(was); }
    finally { setActionLoading(false); }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) { try { await navigator.share({ title: short?.title, url }); return; } catch { /* fall */ } }
    try { await navigator.clipboard.writeText(url); } catch {
      const el = document.createElement("textarea"); el.value = url;
      document.body.appendChild(el); el.select(); document.execCommand("copy"); document.body.removeChild(el);
    }
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const actionBtn = (active: boolean): React.CSSProperties => ({
    display: "flex", alignItems: "center", gap: 7,
    padding: "8px 16px", borderRadius: 8, cursor: "pointer",
    fontFamily: "'Inter', sans-serif", fontSize: "0.82rem", fontWeight: 600,
    border: `1px solid ${active ? "var(--text-main)" : "var(--border)"}`,
    backgroundColor: active ? "var(--text-main)" : "transparent",
    color: active ? "white" : "var(--text-main)",
    transition: "all 0.15s",
  });

  if (loading) return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontFamily: "'Inter', sans-serif", color: "var(--text-muted)", fontSize: "0.9rem" }}>Loading…</div>
    </div>
  );

  if (notFound || !short) return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
      <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "2rem" }}>Article not found</div>
      <button onClick={() => router.push("/")} style={{ fontFamily: "'Inter', sans-serif", color: ACCENT, background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>← Back to home</button>
    </div>
  );

  return (
    <>
      <style>{`
        /* Change 1: Radley for short read body */
        .short-body { font-size: 1.05rem; line-height: 1.85; color: #2A2A2A; font-family: 'Radley', serif; }
        .short-body p  { margin: 0 0 1.2em; }
        .short-body h2 { font-family: 'DM Serif Display', serif; font-size: 1.7rem; font-weight: 400; color: #1A1A1A; margin: 1.6em 0 0.5em; }
        .short-body h3 { font-family: 'DM Serif Display', serif; font-size: 1.25rem; font-weight: 400; color: #1A1A1A; margin: 1.4em 0 0.4em; }
        .short-body blockquote { border-left: 3px solid #D38B88; padding: 8px 20px; margin: 1.5em 0; background: rgba(211,139,136,0.06); color: #555; font-style: italic; }
        .short-body ul, .short-body ol { padding-left: 1.5em; margin: 0.5em 0 1.2em; }
        .short-body li { margin: 0.4em 0; }
        .short-body strong { font-weight: 700; }
        .short-body a { color: ${ACCENT}; }
        .short-body hr { border: none; border-top: 1px solid #CFCBC3; margin: 2em 0; }
      `}</style>

      <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} onTabChange={() => router.push("/")} />
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
        <Header onMenuOpen={() => setMenuOpen(true)} activeTab="" onTabChange={() => router.push("/")} />

        <div style={{ maxWidth: 680, margin: "0 auto 80px" }}>

          {/* Change 6: Back → Home */}
          <button onClick={() => router.push("/")} style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            fontSize: "0.9rem", fontWeight: 600, color: "var(--text-muted)",
            background: "none", border: "1px solid transparent", borderRadius: 4,
            padding: "5px 10px", cursor: "pointer", marginBottom: 30,
            fontFamily: "'Inter', sans-serif", transition: "all 0.2s",
          }}
            onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.color = "var(--text-main)"; el.style.borderColor = "var(--border)"; }}
            onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.color = "var(--text-muted)"; el.style.borderColor = "transparent"; }}
          >
            <svg viewBox="0 0 24 24" style={{ width: 16, height: 16, stroke: "currentColor", strokeWidth: 2, fill: "none" }}>
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Home
          </button>

          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginBottom: 16 }}>
            {short.tags?.map(t => <Tag key={t} label={t} />)}
            {short.readTime && (
              <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontFamily: "'Inter', sans-serif" }}>
                ⚡ {short.readTime}
              </span>
            )}
          </div>

          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "2.6rem", lineHeight: 1.1, marginBottom: 32, color: "var(--text-main)" }}>
            {short.title}
          </h1>

          <div className="short-body" dangerouslySetInnerHTML={{ __html: short.content }} />

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 40, paddingTop: 28, borderTop: "1px solid var(--border)" }}>
            <button style={actionBtn(liked)} onClick={handleLike} disabled={actionLoading}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              {likes.toLocaleString()} {liked ? "Liked" : "Like"}
            </button>
            <button style={actionBtn(saved)} onClick={handleSave} disabled={actionLoading}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
              </svg>
              {saved ? "Saved" : "Save"}
            </button>
            <button style={actionBtn(copied)} onClick={handleShare}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
              </svg>
              {copied ? "Copied!" : "Share"}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
