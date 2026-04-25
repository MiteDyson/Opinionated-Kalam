"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase";
import { useMobile } from "@/hooks/useMobile";
import Header from "@/components/layout/Header";
import SideMenu from "@/components/layout/SideMenu";
import Footer from "@/components/layout/Footer";
import MobileHeader from "@/components/mobile/MobileHeader";
import MobileSideMenu from "@/components/mobile/MobileSideMenu";
import MobileFooter from "@/components/mobile/MobileFooter";

const ACCENT = "#1B2A47";
const RED    = "#c0392b";
const BLACK  = "#111111";
const BG     = "#f5f0eb";
const BORDER = "#e0d8d0";
const MUTED  = "#666666";

interface Short {
  _id: string; slug: string; title: string; content: string; excerpt?: string;
  coverImage?: string; author: string; tags: string[]; readTime?: string;
  publishedAt?: string; likes: number; views: number; isLiked: boolean; isSaved: boolean;
}

function MobileTag({ label }: { label: string }) {
  return (
    <span style={{
      display: "inline-block", padding: "2px 8px", borderRadius: 999,
      fontFamily: "'Inter', sans-serif", fontSize: "0.55rem", fontWeight: 700,
      color: RED, textTransform: "uppercase", letterSpacing: "0.05em",
      backgroundColor: "rgba(192,57,43,0.1)", whiteSpace: "nowrap",
    }}>
      {label}
    </span>
  );
}

function MobileShortView({ short, liked, saved, likes, views, copied, actionLoading, onLike, onSave, onShare }: {
  short: Short; liked: boolean; saved: boolean; likes: number; views: number;
  copied: boolean; actionLoading: boolean;
  onLike: () => void; onSave: () => void; onShare: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const dateStr = short.publishedAt
    ? new Date(short.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
    : "";

  const actionBtn = (active: boolean): React.CSSProperties => ({
    display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8,
    cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", fontWeight: 600,
    border: `1.5px solid ${active ? BLACK : BORDER}`,
    backgroundColor: active ? BLACK : "transparent",
    color: active ? "white" : BLACK, transition: "all 0.15s",
  });

  return (
    <div style={{ backgroundColor: BG, minHeight: "100vh" }}>
      <style>{`
        .short-body-m { font-size: 1rem; line-height: 1.82; color: #2A2A2A; font-family: 'Radley', serif; }
        .short-body-m p { margin: 0 0 1.1em; }
        .short-body-m h2 { font-family: 'DM Serif Display', serif; font-size: 1.5rem; font-weight: 400; color: #1A1A1A; margin: 1.5em 0 0.5em; }
        .short-body-m h3 { font-family: 'DM Serif Display', serif; font-size: 1.15rem; font-weight: 400; color: #1A1A1A; margin: 1.3em 0 0.4em; }
        .short-body-m blockquote { border-left: 3px solid #D38B88; padding: 8px 16px; margin: 1.4em 0; background: rgba(211,139,136,0.06); color: #555; font-style: italic; }
        .short-body-m ul, .short-body-m ol { padding-left: 1.4em; margin: 0.5em 0 1.1em; }
        .short-body-m li { margin: 0.35em 0; }
        .short-body-m strong { font-weight: 700; }
        .short-body-m a { color: ${ACCENT}; }
        .short-body-m hr { border: none; border-top: 1px solid ${BORDER}; margin: 1.8em 0; }
      `}</style>

      <MobileSideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} onTabChange={(t) => router.push(`/?tab=${t}`)} onBeatSelect={() => router.push("/")} />
      <MobileHeader activeTab="" onTabChange={(t) => router.push(`/?tab=${t}`)} onMenuOpen={() => setMenuOpen(true)} />

      <div style={{ padding: "12px 16px 0" }}>
        {/* Back button */}
        <button onClick={() => router.back()} style={{
          display: "inline-flex", alignItems: "center", gap: 5,
          fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", fontWeight: 600,
          color: MUTED, background: "none", border: `1px solid ${BORDER}`,
          borderRadius: 6, padding: "5px 12px", cursor: "pointer", marginBottom: 12,
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
          Back
        </button>
      </div>

      <div style={{ padding: "0 16px 60px" }}>
        {/* Title — normal weight */}
        <h1 style={{ fontFamily: "'Playfair Display', 'DM Serif Display', Georgia, serif", fontSize: "1.55rem", fontWeight: 400, lineHeight: 1.2, color: BLACK, margin: "0 0 10px" }}>
          {short.title}
        </h1>

        {/* Date · Author · Views */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", color: MUTED, marginBottom: 10, alignItems: "center" }}>
          {dateStr && <span>{dateStr}</span>}
          <span style={{ opacity: 0.4 }}>·</span>
          <span>{short.author}</span>
          <span style={{ opacity: 0.4 }}>·</span>
          <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            {(views || 0).toLocaleString()}
          </span>
        </div>

        {/* Tags */}
        {short.tags?.length > 0 && (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 18 }}>
            {short.tags.map(t => <MobileTag key={t} label={t} />)}
            {short.readTime && <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", color: "#888" }}>⚡ {short.readTime}</span>}
          </div>
        )}

        {/* Body */}
        <div className="short-body-m" dangerouslySetInnerHTML={{ __html: short.content }} />

        {/* Interactions */}
        <div style={{ display: "flex", gap: 10, marginTop: 28, flexWrap: "wrap" }}>
          <button style={actionBtn(liked)} onClick={onLike} disabled={actionLoading}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            {likes.toLocaleString()} {liked ? "Liked" : "Like"}
          </button>
          <button style={actionBtn(saved)} onClick={onSave} disabled={actionLoading}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
            {saved ? "Saved" : "Save"}
          </button>
          <button style={actionBtn(copied)} onClick={onShare}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
            {copied ? "Copied!" : "Share"}
          </button>
        </div>
      </div>

      <MobileFooter />
    </div>
  );
}

export default function ShortPage() {
  const router   = useRouter();
  const params   = useParams();
  const slug     = params?.slug as string;
  const { user } = useAuth();
  const isMobile = useMobile();

  const [desktopMenuOpen, setDesktopMenuOpen] = useState(false);
  const [short,    setShort]    = useState<Short | null>(null);
  const [loading,  setLoading]  = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [liked,    setLiked]    = useState(false);
  const [saved,    setSaved]    = useState(false);
  const [likes,    setLikes]    = useState(0);
  const [views,    setViews]    = useState(0);
  const [copied,   setCopied]   = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const viewTracked = useRef(false);

  useEffect(() => {
    if (!slug) return;
    (async () => {
      try {
        const uid = auth.currentUser?.uid ?? "";
        const res = await fetch(`/api/articles/${slug}${uid ? `?uid=${uid}` : ""}`);
        if (!res.ok) { setNotFound(true); return; }
        const d = await res.json();
        setShort(d); setLikes(d.likes ?? 0); setViews(d.views ?? 0);
        setLiked(d.isLiked ?? false); setSaved(d.isSaved ?? false);
      } catch { setNotFound(true); } finally { setLoading(false); }
    })();
  }, [slug]);

  useEffect(() => {
    if (!short || viewTracked.current || !user) return;
    viewTracked.current = true;
    (async () => {
      try {
        const token = await auth.currentUser?.getIdToken();
        if (!token) return;
        const res = await fetch(`/api/articles/${slug}/view`, { method: "POST", headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) { const d = await res.json(); setViews(d.views); }
      } catch { /* silent */ }
    })();
  }, [short, user, slug]);

  const handleLike = async () => {
    if (!user) { router.push("/login"); return; }
    if (actionLoading) return;
    setActionLoading(true);
    const was = liked; setLiked(!was); setLikes(n => was ? n - 1 : n + 1);
    try {
      const token = await auth.currentUser?.getIdToken();
      const res   = await fetch(`/api/articles/${slug}/like`, { method: "POST", headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error();
      const d = await res.json(); setLiked(d.liked); setLikes(d.likes);
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
      const res   = await fetch(`/api/articles/${slug}/save`, { method: "POST", headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error();
      const d = await res.json(); setSaved(d.saved);
    } catch { setSaved(was); } finally { setActionLoading(false); }
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

  if (loading) return <div style={{ minHeight: "100vh", backgroundColor: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ fontFamily: "'Inter', sans-serif", color: "var(--text-muted)" }}>Loading…</div></div>;
  if (notFound || !short) return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
      <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "2rem" }}>Article not found</div>
      <button onClick={() => router.push("/")} style={{ fontFamily: "'Inter', sans-serif", color: ACCENT, background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>← Back</button>
    </div>
  );

  if (isMobile) {
    return <MobileShortView short={short} liked={liked} saved={saved} likes={likes} views={views} copied={copied} actionLoading={actionLoading} onLike={handleLike} onSave={handleSave} onShare={handleShare} />;
  }

  // Desktop (original)
  const dateStr = short.publishedAt ? new Date(short.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "";
  const actionBtn = (active: boolean): React.CSSProperties => ({
    display: "flex", alignItems: "center", gap: 7, padding: "8px 16px", borderRadius: 8, cursor: "pointer",
    fontFamily: "'Inter', sans-serif", fontSize: "0.82rem", fontWeight: 600,
    border: `1px solid ${active ? "var(--text-main)" : "var(--border)"}`,
    backgroundColor: active ? "var(--text-main)" : "transparent",
    color: active ? "white" : "var(--text-main)", transition: "all 0.15s",
  });

  return (
    <>
      <style>{`
        .short-body { font-size: 1.05rem; line-height: 1.85; color: #2A2A2A; font-family: 'Radley', serif; }
        .short-body p { margin: 0 0 1.2em; }
        .short-body h2 { font-family: 'DM Serif Display', serif; font-size: 1.7rem; font-weight: 400; color: #1A1A1A; margin: 1.6em 0 0.5em; }
        .short-body h3 { font-family: 'DM Serif Display', serif; font-size: 1.25rem; font-weight: 400; color: #1A1A1A; margin: 1.4em 0 0.4em; }
        .short-body blockquote { border-left: 3px solid #D38B88; padding: 8px 20px; margin: 1.5em 0; background: rgba(211,139,136,0.06); color: #555; font-style: italic; }
        .short-body ul, .short-body ol { padding-left: 1.5em; margin: 0.5em 0 1.2em; }
        .short-body li { margin: 0.4em 0; }
        .short-body strong { font-weight: 700; }
        .short-body a { color: ${ACCENT}; }
        .short-body hr { border: none; border-top: 1px solid #CFCBC3; margin: 2em 0; }
      `}</style>
      <SideMenu isOpen={desktopMenuOpen} onClose={() => setDesktopMenuOpen(false)} onTabChange={() => router.push("/")} />
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
        <Header onMenuOpen={() => setDesktopMenuOpen(true)} activeTab="" onTabChange={() => router.push("/")} />
        <div style={{ maxWidth: 680, margin: "0 auto 80px" }}>
          <button onClick={() => router.push("/")} style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: "0.9rem", fontWeight: 600, color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer", marginBottom: 30, fontFamily: "'Inter', sans-serif", padding: 0 }}>
            <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, stroke: "currentColor", strokeWidth: 2, fill: "none" }}><polyline points="15 18 9 12 15 6"/></svg>
            Home
          </button>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginBottom: 16 }}>
            {short.tags?.map(t => <span key={t} style={{ display: "inline-block", padding: "3px 10px", borderRadius: 4, fontSize: "0.65rem", fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.05em", fontFamily: "'Inter', sans-serif", backgroundColor: "rgba(27,42,71,0.1)", color: ACCENT }}>{t}</span>)}
            {short.readTime && <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontFamily: "'Inter', sans-serif" }}>⚡ {short.readTime}</span>}
          </div>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "2.6rem", lineHeight: 1.1, marginBottom: 16, color: "var(--text-main)" }}>{short.title}</h1>
          
          <div style={{ display: "flex", gap: 16, color: "var(--text-muted)", fontSize: "0.83rem", fontFamily: "'Inter', sans-serif", marginBottom: 32, flexWrap: "wrap", alignItems: "center" }}>
            {dateStr && <span>{dateStr}</span>}
            <span style={{ opacity: 0.4 }}>|</span>
            <span>{short.author}</span>
            <span style={{ opacity: 0.4 }}>|</span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              {(views || 0).toLocaleString()}
            </span>
          </div>

          <div className="short-body" dangerouslySetInnerHTML={{ __html: short.content }} />
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 40, paddingTop: 28, borderTop: "1px solid var(--border)" }}>
            <button style={actionBtn(liked)} onClick={handleLike} disabled={actionLoading}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              {likes.toLocaleString()} {liked ? "Liked" : "Like"}
            </button>
            <button style={actionBtn(saved)} onClick={handleSave} disabled={actionLoading}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
              {saved ? "Saved" : "Save"}
            </button>
            <button style={actionBtn(copied)} onClick={handleShare}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
              {copied ? "Copied!" : "Share"}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
