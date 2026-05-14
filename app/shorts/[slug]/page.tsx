"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Heart, Bookmark, Share, Eye, MoveLeft, BookOpen } from "lucide-react";
import DOMPurify from "isomorphic-dompurify";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/auth/firebase";
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
      color: "#c0392b", textTransform: "uppercase", letterSpacing: "0.05em",
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
        .short-body-m ul { list-style: disc; padding-left: 1.4em; margin: 0.5em 0 1.1em; }
        .short-body-m ol { list-style: decimal; padding-left: 1.4em; margin: 0.5em 0 1.1em; }
        .short-body-m li { margin: 0.35em 0; }
        .short-body-m strong { font-weight: 700; }
        .short-body-m a { color: ${ACCENT}; }
        .short-body-m hr { border: none; border-top: 1px solid ${BORDER}; margin: 1.8em 0; }
      `}</style>

      <MobileSideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} onTabChange={(t) => router.push(`/?tab=${t}`)} onBeatSelect={() => router.push("/")} />
      <MobileHeader activeTab="shorts" onTabChange={(t) => router.push(`/?tab=${t}`)} onMenuOpen={() => setMenuOpen(true)} />

      <div style={{ padding: "12px 16px 0" }}>
        {/* Back button */}
        <button onClick={() => router.back()} style={{
          background: "none", border: "1px solid rgb(221, 221, 221)", borderRadius: "6px",
          padding: "5px 12px", cursor: "pointer", fontFamily: "'Inter', sans-serif",
          fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "4px",
          color: MUTED, marginBottom: 12,
        }}>
          <MoveLeft size={14} strokeWidth={2.5} />
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
            <Eye size={12} />
            {(views || 0).toLocaleString()} {views === 1 ? 'View' : 'Views'}
          </span>
          {short.readTime && (
            <>
              <span style={{ opacity: 0.4 }}>·</span>
              <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                <BookOpen size={12} />
                {short.readTime} minute read
              </span>
            </>
          )}
        </div>

        {/* Tags - Moved below metadata */}
        {short.tags?.length > 0 && (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 18 }}>
            {short.tags.map(t => <MobileTag key={t} label={t} />)}
          </div>
        )}

        {/* Body */}
        <div className="short-body-m" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(short.content) }} />

        {/* Interactions */}
        <div style={{ display: "flex", gap: 10, marginTop: 28, flexWrap: "wrap" }}>
          <button style={actionBtn(liked)} onClick={onLike} disabled={actionLoading}>
            <Heart size={14} fill={liked ? "currentColor" : "none"} />
            {likes.toLocaleString()} {likes === 1 ? 'Like' : 'Likes'}
          </button>
          <button style={actionBtn(saved)} onClick={onSave} disabled={actionLoading}>
            <Bookmark size={14} fill={saved ? "currentColor" : "none"} />
            {saved ? "Saved" : "Save"}
          </button>
          <button style={actionBtn(copied)} onClick={onShare}>
            <Share size={14} />
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
      <button onClick={() => router.push("/")} style={{
        background: "none", border: "1px solid rgb(221, 221, 221)", borderRadius: "6px",
        padding: "5px 12px", cursor: "pointer", fontFamily: "'Inter', sans-serif",
        fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "4px",
        color: ACCENT,
      }}>
        <MoveLeft size={16} />
        Back to home
      </button>
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
        <Header onMenuOpen={() => setDesktopMenuOpen(true)} activeTab="shorts" onTabChange={() => router.push("/")} />
        <div style={{ maxWidth: 900, margin: "0 auto 80px" }}>
          {/* Back button */}
          <button onClick={() => router.back()} style={{
            background: "none", border: "1px solid rgb(221, 221, 221)", borderRadius: "6px",
            padding: "5px 12px", cursor: "pointer", fontFamily: "'Inter', sans-serif",
            fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "4px",
            color: MUTED, marginBottom: 32,
          }}>
            <MoveLeft size={14} strokeWidth={2.5} />
            Back
          </button>

          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "2.6rem", lineHeight: 1.1, marginBottom: 16, color: "var(--text-main)" }}>{short.title}</h1>
          
          <div style={{ display: "flex", gap: 14, color: "var(--text-muted)", fontSize: "0.75rem", fontFamily: "'Inter', sans-serif", marginBottom: 12, flexWrap: "wrap", alignItems: "center" }}>
            {dateStr && <span>{dateStr}</span>}
            <span style={{ opacity: 0.3 }}>·</span>
            <span>{short.author}</span>
            <span style={{ opacity: 0.3 }}>·</span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Eye size={14} />
              {(views || 0).toLocaleString()} {views === 1 ? 'View' : 'Views'}
            </span>
            {short.readTime && (
              <>
                <span style={{ opacity: 0.3 }}>·</span>
                <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <BookOpen size={15} />
                  {short.readTime} minute read
                </span>
              </>
            )}
          </div>

          {/* Tags - Moved below metadata */}
          <div style={{ display: "flex", gap: 4, alignItems: "center", flexWrap: "wrap", marginBottom: 32 }}>
            {short.tags?.map(t => (
              <span key={t} style={{ 
                display: "inline-block", padding: "1.5px 7px", borderRadius: 3, 
                fontSize: "0.55rem", fontWeight: 700, textTransform: "uppercase", 
                letterSpacing: "0.03em", fontFamily: "'Inter', sans-serif", 
                backgroundColor: "rgba(217,35,35,0.06)", color: "#D92323"
              }}>
                {t}
              </span>
            ))}
          </div>

          <div className="short-body" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(short.content) }} />
          <div style={{ display: "flex", alignItems: "center", gap: 24, marginTop: 40, paddingTop: 28, borderTop: "1px solid var(--border)", flexWrap: "wrap" }}>
            <button onClick={handleLike} disabled={actionLoading} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", fontWeight: 600, color: liked ? RED : "var(--text-main)", padding: 0 }}>
              <Heart size={20} fill={liked ? "currentColor" : "none"} />
              Like
            </button>
            <button onClick={handleSave} disabled={actionLoading} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", fontWeight: 600, color: saved ? ACCENT : "var(--text-main)", padding: 0 }}>
              <Bookmark size={20} fill={saved ? "currentColor" : "none"} />
              Save
            </button>
            <button onClick={handleShare} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", fontWeight: 600, color: "var(--text-main)", padding: 0 }}>
              <Share size={20} />
              Share
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
