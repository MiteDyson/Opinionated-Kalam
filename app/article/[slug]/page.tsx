"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Heart, Bookmark, Share, Eye, MoveLeft, Play, Pause, Loader2, BookOpen } from "lucide-react";
import DOMPurify from "isomorphic-dompurify";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase";
import { useMobile } from "@/hooks/useMobile";
import Header from "@/components/layout/Header";
import SideMenu from "@/components/layout/SideMenu";
import Footer from "@/components/layout/Footer";
import MobileHeader from "@/components/mobile/MobileHeader";
import MobileSideMenu from "@/components/mobile/MobileSideMenu";
import MobileFooter from "@/components/mobile/MobileFooter";

const ACCENT  = "#1B2A47";
const RED     = "#c0392b";
const BLACK   = "#111111";
const BG      = "#f5f0eb";
const BORDER  = "#e0d8d0";
const MUTED   = "#666666";

interface Article {
  _id: string; slug: string; title: string; excerpt: string; content: string;
  coverImage: string; author: string; tags: string[]; type: string;
  readTime: string; publishedAt: string; likes: number; views: number;
  isLiked: boolean; isSaved: boolean; audioUrl?: string; duration?: string;
}

// ── Desktop tag ───────────────────────────────────────────────
function DesktopTag({ label }: { label: string }) {
  return (
    <span style={{ 
      display: "inline-block", padding: "1.5px 7px", borderRadius: 3, 
      fontSize: "0.55rem", fontWeight: 700, textTransform: "uppercase", 
      letterSpacing: "0.03em", fontFamily: "'Inter', sans-serif", 
      backgroundColor: "rgba(217,35,35,0.06)", color: "#D92323"
    }}>
      {label}
    </span>
  );
}

// ── Mobile tag — chip/pill style ─────────
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

// ── Listen player (shared) ─────────────────────────────────────
function ListenPlayer({ src, readTime, compact = false }: { src: string; readTime?: string; compact?: boolean }) {
  const audioRef   = useRef<HTMLAudioElement | null>(null);
  const seekBarRef = useRef<HTMLDivElement>(null);
  const [playing,   setPlaying]   = useState(false);
  const [current,   setCurrent]   = useState(0);
  const [total,     setTotal]     = useState(0);
  const [speed,     setSpeed]     = useState(1);
  const [speedOpen, setSpeedOpen] = useState(false);
  const [buffering, setBuffering] = useState(true);
  const SPEEDS = [0.75, 1, 1.25, 1.5, 1.75, 2];

  useEffect(() => {
    const audio = new Audio(src);
    audioRef.current = audio;
    audio.onloadedmetadata = () => { setTotal(audio.duration); setBuffering(false); };
    audio.ontimeupdate     = () => setCurrent(audio.currentTime);
    audio.onended          = () => setPlaying(false);
    audio.onwaiting        = () => setBuffering(true);
    audio.oncanplay        = () => setBuffering(false);
    return () => { audio.pause(); audio.src = ""; };
  }, [src]);

  const togglePlay = () => {
    const a = audioRef.current; if (!a) return;
    if (playing) { a.pause(); setPlaying(false); } else { a.play().catch(() => {}); setPlaying(true); }
  };
  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const a = audioRef.current;
    const bar = seekBarRef.current;
    if (!a || !bar || !isFinite(a.duration) || a.duration === 0) return;
    
    const rect = bar.getBoundingClientRect();
    if (rect.width === 0) return;
    
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const targetTime = pct * a.duration;
    
    if (isFinite(targetTime)) {
      a.currentTime = targetTime;
    }
  };
  const applySpeed = (s: number) => { setSpeed(s); if (audioRef.current) audioRef.current.playbackRate = s; setSpeedOpen(false); };
  const fmt = (s: number) => { if (!s || isNaN(s)) return "0:00"; return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, "0")}`; };
  const fmtTotal = () => total > 0 ? fmt(total) : readTime ? `${parseInt(readTime)}:00` : "—";
  const pct = total > 0 ? (current / total) * 100 : 0;

  return (
    <div style={{ backgroundColor: "white", borderRadius: compact ? 10 : 14, padding: compact ? "14px 16px" : "18px 22px", border: "1px solid #e8e5e0", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: compact ? 24 : 40 }}>
      <style>{`@keyframes spin-lp { to { transform: rotate(360deg); } }`}</style>
      <div style={{ display: "flex", alignItems: "center", gap: compact ? 10 : 18, marginBottom: 8 }}>
        <button onClick={togglePlay} disabled={buffering} style={{ width: compact ? 42 : 52, height: compact ? 42 : 52, borderRadius: 12, backgroundColor: buffering ? "#e8e5e0" : "#1A1A1A", border: "none", cursor: buffering ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          {buffering
            ? <Loader2 size={16} color="white" style={{ animation: "spin-lp 0.8s linear infinite" }} />
            : playing
              ? <Pause size={18} color="white" fill="white" />
              : <Play size={18} color="white" fill="white" style={{ marginLeft: 2 }} />
          }
        </button>
        <div style={{ flexShrink: 0 }}>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#888", marginBottom: 2 }}>Listen to Article</div>
          <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: compact ? "0.9rem" : "1.1rem", fontStyle: "italic", color: "#1A1A1A" }}>{readTime ?? "Audio"}</div>
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", color: "#555", fontVariantNumeric: "tabular-nums" }}>{fmt(current)} / {fmtTotal()}</div>
        <div style={{ position: "relative", flexShrink: 0 }}>
          <button onClick={() => setSpeedOpen(o => !o)} style={{ padding: "4px 9px", borderRadius: 6, border: "1px solid #e0ddd8", backgroundColor: "#f5f4f2", fontFamily: "'Inter', sans-serif", fontSize: "0.72rem", fontWeight: 700, color: "#333", cursor: "pointer" }}>{speed}X</button>
          {speedOpen && (
            <div style={{ position: "absolute", bottom: "calc(100% + 6px)", right: 0, backgroundColor: "white", borderRadius: 10, border: "1px solid #e0ddd8", boxShadow: "0 4px 16px rgba(0,0,0,0.1)", overflow: "hidden", zIndex: 10, minWidth: 70 }}>
              {SPEEDS.map(s => <button key={s} onClick={() => applySpeed(s)} style={{ display: "block", width: "100%", padding: "7px 12px", background: "none", border: "none", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", fontWeight: speed === s ? 700 : 400, color: speed === s ? "#1A1A1A" : "#555", backgroundColor: speed === s ? "#f5f4f2" : "transparent", textAlign: "left", borderBottom: "1px solid #f5f4f2" }}>{s}×</button>)}
            </div>
          )}
        </div>
      </div>
      <div ref={seekBarRef} onClick={seek} style={{ height: 4, borderRadius: 2, cursor: "pointer", backgroundColor: "#e0ddd8", position: "relative", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, backgroundColor: "#1A1A1A", borderRadius: 2, transition: "width 0.3s linear", pointerEvents: "none" }} />
      </div>
    </div>
  );
}

// ── Mobile article body ────────────────────────────────────────
function MobileArticleView({ article, liked, saved, likes, views, copied, actionLoading, onLike, onSave, onShare }: {
  article: Article; liked: boolean; saved: boolean; likes: number; views: number;
  copied: boolean; actionLoading: boolean;
  onLike: () => void; onSave: () => void; onShare: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const dateStr = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
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
        .art-body-m { font-size: 1rem; line-height: 1.82; color: #2A2A2A; font-family: 'Radley', serif; }
        .art-body-m p { margin: 0 0 1.1em; }
        .art-body-m h2 { font-family: 'DM Serif Display', serif; font-size: 1.5rem; font-weight: 400; color: #1A1A1A; margin: 1.5em 0 0.5em; }
        .art-body-m h3 { font-family: 'DM Serif Display', serif; font-size: 1.15rem; font-weight: 400; color: #1A1A1A; margin: 1.3em 0 0.4em; }
        .art-body-m blockquote { border-left: 3px solid #D38B88; padding: 8px 16px; margin: 1.4em 0; background: rgba(211,139,136,0.06); color: #555; font-style: italic; }
        .art-body-m img { max-width: 100%; border-radius: 6px; margin: 16px 0; display: block; }
        .art-body-m a { color: ${ACCENT}; }
        .art-body-m ul { list-style: disc; padding-left: 1.4em; margin: 0.5em 0 1.1em; }
        .art-body-m ol { list-style: decimal; padding-left: 1.4em; margin: 0.5em 0 1.1em; }
        .art-body-m li { margin: 0.35em 0; }
        .art-body-m code { background: rgba(27,42,71,0.08); color: ${ACCENT}; padding: 2px 5px; border-radius: 3px; font-size: 0.88em; }
        .art-body-m hr { border: none; border-top: 1px solid ${BORDER}; margin: 1.8em 0; }
      `}</style>

      <MobileSideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} onTabChange={() => router.push("/")} onBeatSelect={() => router.push("/")} />
      <MobileHeader activeTab="articles" onTabChange={(t) => router.push(`/?tab=${t}`)} onMenuOpen={() => setMenuOpen(true)} />

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
        {/* Cover image */}
        {article.coverImage && (
          <img src={article.coverImage} alt={article.title} style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", borderRadius: 6, display: "block", marginBottom: 14 }} />
        )}

        {/* Title — normal weight */}
        <h1 style={{ fontFamily: "'Playfair Display', 'DM Serif Display', Georgia, serif", fontSize: "1.6rem", fontWeight: 400, lineHeight: 1.2, color: BLACK, margin: "0 0 10px" }}>
          {article.title}
        </h1>

        {/* Date · Author · Views */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", color: MUTED, marginBottom: 10, alignItems: "center" }}>
          {dateStr && <span>{dateStr}</span>}
          <span style={{ opacity: 0.4 }}>·</span>
          <span>{article.author}</span>
          {views > 0 && (
            <>
              <span style={{ opacity: 0.4 }}>·</span>
              <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                <Eye size={12} />
                {views.toLocaleString()} {views === 1 ? 'View' : 'Views'}
              </span>
            </>
          )}
          {article.readTime && (
            <>
              <span style={{ opacity: 0.4 }}>·</span>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <BookOpen size={12} />
                {article.readTime} minute read
              </span>
            </>
          )}
        </div>

        {/* Tag chips — desktop style */}
        {article.tags?.length > 0 && (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 18 }}>
            {article.tags.map(t => <MobileTag key={t} label={t} />)}
          </div>
        )}

        {/* Listen */}
        {article.audioUrl && <ListenPlayer src={article.audioUrl} readTime={article.readTime} compact />}

        {/* Body */}
        <div className="art-body-m" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.content) }} />

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

export default function ArticlePage() {
  const router   = useRouter();
  const params   = useParams();
  const slug     = params?.slug as string;
  const { user } = useAuth();
  const isMobile = useMobile();

  const [desktopMenuOpen, setDesktopMenuOpen] = useState(false);
  const [article,  setArticle]  = useState<Article | null>(null);
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
        const data = await res.json();
        setArticle(data); setLikes(data.likes ?? 0); setViews(data.views ?? 0);
        setLiked(data.isLiked ?? false); setSaved(data.isSaved ?? false);
      } catch { setNotFound(true); } finally { setLoading(false); }
    })();
  }, [slug]);

  useEffect(() => {
    if (!article || viewTracked.current || !user) return;
    viewTracked.current = true;
    (async () => {
      try {
        const token = await auth.currentUser?.getIdToken();
        if (!token) return;
        const res = await fetch(`/api/articles/${slug}/view`, { method: "POST", headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) { const d = await res.json(); setViews(d.views); }
      } catch { /* silent */ }
    })();
  }, [article, user, slug]);

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
    if (navigator.share) { try { await navigator.share({ title: article?.title, url }); return; } catch { /* fall */ } }
    try { await navigator.clipboard.writeText(url); } catch {
      const el = document.createElement("textarea"); el.value = url;
      document.body.appendChild(el); el.select(); document.execCommand("copy"); document.body.removeChild(el);
    }
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <div style={{ minHeight: "100vh", backgroundColor: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ fontFamily: "'Inter', sans-serif", color: "var(--text-muted)", fontSize: "0.9rem" }}>Loading…</div></div>;

  if (notFound || !article) return (
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

  // ── Mobile ─────────────────────────────────────────────────
  if (isMobile) {
    return <MobileArticleView article={article} liked={liked} saved={saved} likes={likes} views={views} copied={copied} actionLoading={actionLoading} onLike={handleLike} onSave={handleSave} onShare={handleShare} />;
  }

  // ── Desktop (original layout) ──────────────────────────────
  const dateStr = article.publishedAt ? new Date(article.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "";
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
        .article-body { font-size: 1.05rem; line-height: 1.85; color: #2A2A2A; font-family: 'Radley', serif; }
        .article-body p { margin: 0 0 1.2em; }
        .article-body h2 { font-family: 'DM Serif Display', serif; font-size: 1.7rem; font-weight: 400; color: #1A1A1A; margin: 1.6em 0 0.5em; }
        .article-body h3 { font-family: 'DM Serif Display', serif; font-size: 1.25rem; font-weight: 400; color: #1A1A1A; margin: 1.4em 0 0.4em; }
        .article-body blockquote { border-left: 3px solid #D38B88; padding: 8px 20px; margin: 1.5em 0; background: rgba(211,139,136,0.06); color: #555; font-style: italic; border-radius: 0 6px 6px 0; }
        .article-body img { max-width: 100%; border-radius: 8px; margin: 20px 0; display: block; }
        .article-body a { color: ${ACCENT}; }
        .article-body ul, .article-body ol { padding-left: 1.5em; margin: 0.5em 0 1.2em; }
        .article-body li { margin: 0.4em 0; }
        .article-body code { background: rgba(27,42,71,0.08); color: ${ACCENT}; padding: 2px 6px; border-radius: 4px; font-size: 0.9em; }
        .article-body pre { background: #1A1A1A; color: #e8e8e8; padding: 16px 20px; border-radius: 8px; overflow-x: auto; margin: 1.2em 0; }
        .article-body hr { border: none; border-top: 1px solid #CFCBC3; margin: 2em 0; }
      `}</style>
      <SideMenu isOpen={desktopMenuOpen} onClose={() => setDesktopMenuOpen(false)} onTabChange={() => router.push("/")} />
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
        <Header onMenuOpen={() => setDesktopMenuOpen(true)} activeTab="articles" onTabChange={(tab) => router.push(`/?tab=${tab}`)} />
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

          {/* Cover image above title */}
          {article.coverImage && <img src={article.coverImage} alt={article.title} style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", borderRadius: 12, display: "block", marginBottom: 28 }} />}

          {/* Title */}
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "2.4rem", lineHeight: 1.15, marginBottom: 12, color: "var(--text-main)", fontWeight: 400 }}>{article.title}</h1>
          
          {/* Metadata */}
          <div style={{ display: "flex", gap: 14, color: "var(--text-muted)", fontSize: "0.75rem", fontFamily: "'Inter', sans-serif", marginBottom: 12, flexWrap: "wrap", alignItems: "center" }}>
            {dateStr && <span>{dateStr}</span>}
            <span style={{ opacity: 0.3 }}>·</span>
            <span>{article.author}</span>
          </div>

          {/* Tags */}
          {article.tags.length > 0 && (
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 20 }}>
              {article.tags.map(t => <DesktopTag key={t} label={t} />)}
            </div>
          )}

          {article.audioUrl && <ListenPlayer src={article.audioUrl} readTime={article.readTime} />}
          
          <div className="article-body" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.content) }} />

          {/* Interaction Bar — barefoot style */}
          <div style={{ display: "flex", alignItems: "center", gap: 24, marginTop: 48, paddingTop: 32, borderTop: "1px solid var(--border)", flexWrap: "wrap" }}>
            <button 
              onClick={handleLike} 
              disabled={actionLoading}
              style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", fontWeight: 600, color: liked ? RED : "var(--text-main)", padding: 0 }}
            >
              <Heart size={20} fill={liked ? "currentColor" : "none"} />
              Like
            </button>
            <button 
              onClick={handleSave} 
              disabled={actionLoading}
              style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", fontWeight: 600, color: saved ? "#1B2A47" : "var(--text-main)", padding: 0 }}
            >
              <Bookmark size={20} fill={saved ? "currentColor" : "none"} />
              Save
            </button>
            <button 
              onClick={handleShare}
              style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", fontWeight: 600, color: "var(--text-main)", padding: 0 }}
            >
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
