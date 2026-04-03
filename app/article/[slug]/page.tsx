"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Header from "@/components/layout/Header";
import SideMenu from "@/components/layout/SideMenu";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase";

const ACCENT = "#1B2A47";

interface Article {
  _id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  tags: string[];
  type: string;
  readTime: string;
  publishedAt: string;
  likes: number;
  views: number;
  isLiked: boolean;
  isSaved: boolean;
  audioUrl?: string;
  duration?: string;
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

// ── Listen to Article Player ────────────────────────────────────
function ListenPlayer({ src, readTime }: { src: string; readTime?: string }) {
  const audioRef    = useRef<HTMLAudioElement | null>(null);
  const seekBarRef  = useRef<HTMLDivElement>(null);
  const [playing, setPlaying]   = useState(false);
  const [current, setCurrent]   = useState(0);
  const [total,   setTotal]     = useState(0);
  const [muted,   setMuted]     = useState(false);
  const [volume,  setVolume]    = useState(1);
  const [speed,   setSpeed]     = useState(1);
  const [speedOpen, setSpeedOpen] = useState(false);
  const [buffering, setBuffering] = useState(true);
  const SPEEDS = [0.75, 1, 1.25, 1.5, 1.75, 2];

  useEffect(() => {
    const audio = new Audio(src);
    audioRef.current = audio;
    audio.volume = volume;
    audio.onloadedmetadata = () => { setTotal(audio.duration); setBuffering(false); };
    audio.ontimeupdate = () => setCurrent(audio.currentTime);
    audio.onended  = () => setPlaying(false);
    audio.onwaiting = () => setBuffering(true);
    audio.oncanplay = () => setBuffering(false);
    return () => { audio.pause(); audio.src = ""; };
  }, [src]);

  const togglePlay = () => {
    const a = audioRef.current; if (!a) return;
    if (playing) { a.pause(); setPlaying(false); }
    else { a.play().catch(() => {}); setPlaying(true); }
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const a = audioRef.current; const bar = seekBarRef.current;
    if (!a || !bar || !a.duration) return;
    const rect = bar.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    a.currentTime = pct * a.duration;
  };

  const applySpeed = (s: number) => {
    setSpeed(s);
    if (audioRef.current) audioRef.current.playbackRate = s;
    setSpeedOpen(false);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    const n = !muted;
    setMuted(n);
    audioRef.current.volume = n ? 0 : volume;
  };

  const setVol = (v: number) => {
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
    if (v > 0) setMuted(false);
  };

  const fmt = (s: number) => {
    if (!s || isNaN(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  const fmtTotal = () => {
    if (total > 0) return fmt(total);
    if (readTime) {
      const mins = parseInt(readTime);
      if (!isNaN(mins)) return `${mins}:00`;
    }
    return "—";
  };

  const pct = total > 0 ? (current / total) * 100 : 0;

  return (
    <div style={{
      backgroundColor: "white",
      borderRadius: 14,
      padding: "18px 22px",
      border: "1px solid #e8e5e0",
      boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      display: "flex",
      alignItems: "center",
      gap: 18,
      marginBottom: 40,
      position: "relative",
    }}>
      <style>{`
        @keyframes spin-player { to { transform: rotate(360deg); } }
        .listen-seek:hover { opacity: 0.85; }
      `}</style>

      {/* Play button */}
      <button
        onClick={togglePlay}
        disabled={buffering}
        style={{
          width: 52, height: 52, borderRadius: 12,
          backgroundColor: buffering ? "#e8e5e0" : "#1A1A1A",
          border: "none", cursor: buffering ? "not-allowed" : "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0, transition: "background 0.15s, transform 0.1s",
        }}
        onMouseEnter={(e) => { if (!buffering) (e.currentTarget as HTMLElement).style.transform = "scale(1.05)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}
      >
        {buffering ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"
            style={{ animation: "spin-player 0.8s linear infinite" }}>
            <path d="M12 2a10 10 0 0 1 10 10" strokeOpacity="0.9"/>
            <circle cx="12" cy="12" r="10" strokeOpacity="0.15"/>
          </svg>
        ) : playing ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
            <rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white" style={{ marginLeft: 2 }}>
            <polygon points="5 3 19 12 5 21 5 3"/>
          </svg>
        )}
      </button>

      {/* Label */}
      <div style={{ flexShrink: 0, minWidth: 90 }}>
        <div style={{
          fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", fontWeight: 700,
          textTransform: "uppercase", letterSpacing: "0.08em", color: "#888", marginBottom: 3,
        }}>
          Listen to Article
        </div>
        <div style={{
          fontFamily: "'DM Serif Display', serif", fontSize: "1.1rem",
          fontStyle: "italic", color: "#1A1A1A", lineHeight: 1,
        }}>
          {readTime ?? `${Math.round((total || 0) / 60)} minutes`}
        </div>
      </div>

      {/* Seek bar */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 5 }}>
        <div
          ref={seekBarRef}
          onClick={seek}
          className="listen-seek"
          style={{
            height: 4, borderRadius: 2, cursor: "pointer",
            backgroundColor: "#e0ddd8", position: "relative", overflow: "hidden",
          }}
        >
          <div style={{
            height: "100%", width: `${pct}%`,
            backgroundColor: "#1A1A1A", borderRadius: 2,
            transition: "width 0.3s linear", pointerEvents: "none",
          }} />
        </div>
      </div>

      {/* Time */}
      <div style={{
        fontFamily: "'Inter', sans-serif", fontSize: "0.8rem",
        color: "#555", flexShrink: 0, letterSpacing: "0.02em",
        fontVariantNumeric: "tabular-nums",
      }}>
        {fmt(current)} / {fmtTotal()}
      </div>

      {/* Speed */}
      <div style={{ position: "relative", flexShrink: 0 }}>
        <button
          onClick={() => setSpeedOpen(o => !o)}
          style={{
            padding: "5px 10px", borderRadius: 7,
            border: "1px solid #e0ddd8", backgroundColor: "#f5f4f2",
            fontFamily: "'Inter', sans-serif", fontSize: "0.78rem",
            fontWeight: 700, color: "#333", cursor: "pointer",
          }}
        >
          {speed}X
        </button>
        {speedOpen && (
          <div style={{
            position: "absolute", bottom: "calc(100% + 6px)", right: 0,
            backgroundColor: "white", borderRadius: 10, border: "1px solid #e0ddd8",
            boxShadow: "0 4px 16px rgba(0,0,0,0.1)", overflow: "hidden",
            zIndex: 10, minWidth: 70,
          }}>
            {SPEEDS.map(s => (
              <button key={s} onClick={() => applySpeed(s)} style={{
                display: "block", width: "100%", padding: "8px 14px",
                background: "none", border: "none", cursor: "pointer",
                fontFamily: "'Inter', sans-serif", fontSize: "0.82rem",
                fontWeight: speed === s ? 700 : 400,
                color: speed === s ? "#1A1A1A" : "#555",
                backgroundColor: speed === s ? "#f5f4f2" : "transparent",
                textAlign: "left",
                borderBottom: "1px solid #f5f4f2",
              }}>
                {s}×
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Volume */}
      <button onClick={toggleMute} style={{
        background: "none", border: "none", cursor: "pointer",
        color: "#888", padding: 0, display: "flex", flexShrink: 0,
      }}>
        {muted || volume === 0 ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
            <line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
          </svg>
        )}
      </button>
    </div>
  );
}

export default function ArticlePage() {
  const router   = useRouter();
  const params   = useParams();
  const slug     = params?.slug as string;
  const { user } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [article, setArticle]   = useState<Article | null>(null);
  const [loading, setLoading]   = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [liked,  setLiked]  = useState(false);
  const [saved,  setSaved]  = useState(false);
  const [likes,  setLikes]  = useState(0);
  const [views,  setViews]  = useState(0);
  const [copied, setCopied] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const viewTracked = useRef(false);

  useEffect(() => {
    if (!slug) return;
    const fetchArticle = async () => {
      try {
        const uid = auth.currentUser?.uid ?? "";
        const res = await fetch(`/api/articles/${slug}${uid ? `?uid=${uid}` : ""}`);
        if (!res.ok) { setNotFound(true); return; }
        const data = await res.json();
        setArticle(data);
        setLikes(data.likes ?? 0);
        setViews(data.views ?? 0);
        setLiked(data.isLiked ?? false);
        setSaved(data.isSaved ?? false);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [slug]);

  useEffect(() => {
    if (!article || viewTracked.current || !user) return;
    viewTracked.current = true;
    const trackView = async () => {
      try {
        const token = await auth.currentUser?.getIdToken();
        if (!token) return;
        const res = await fetch(`/api/articles/${slug}/view`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) { const data = await res.json(); setViews(data.views); }
      } catch { /* silent */ }
    };
    trackView();
  }, [article, user, slug]);

  const handleLike = async () => {
    if (!user) { router.push("/login"); return; }
    if (actionLoading) return;
    setActionLoading(true);
    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikes(n => wasLiked ? n - 1 : n + 1);
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch(`/api/articles/${slug}/like`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setLiked(data.liked); setLikes(data.likes);
    } catch {
      setLiked(wasLiked); setLikes(n => wasLiked ? n + 1 : n - 1);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) { router.push("/login"); return; }
    if (actionLoading) return;
    setActionLoading(true);
    const wasSaved = saved; setSaved(!wasSaved);
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch(`/api/articles/${slug}/save`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      const data = await res.json(); setSaved(data.saved);
    } catch { setSaved(wasSaved); }
    finally { setActionLoading(false); }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) { try { await navigator.share({ title: article?.title, url }); return; } catch { /* fall through */ } }
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

  if (notFound || !article) return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
      <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "2rem" }}>Article not found</div>
      <button onClick={() => router.push("/")} style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", color: ACCENT, background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>← Back to home</button>
    </div>
  );

  const dateStr = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
    : "";

  return (
    <>
      <style>{`
        .article-body { font-size: 1.05rem; line-height: 1.85; color: #2A2A2A; font-family: 'Inter', sans-serif; }
        .article-body p  { margin: 0 0 1.2em; }
        .article-body h2 { font-family: 'DM Serif Display', serif; font-size: 1.7rem; font-weight: 400; color: #1A1A1A; margin: 1.6em 0 0.5em; }
        .article-body h3 { font-family: 'DM Serif Display', serif; font-size: 1.25rem; font-weight: 400; color: #1A1A1A; margin: 1.4em 0 0.4em; }
        .article-body blockquote { border-left: 3px solid #D38B88; padding: 8px 20px; margin: 1.5em 0; background: rgba(211,139,136,0.06); color: #555; font-style: italic; border-radius: 0 6px 6px 0; }
        .article-body img { max-width: 100%; border-radius: 8px; margin: 20px 0; display: block; }
        .article-body a  { color: ${ACCENT}; }
        .article-body ul, .article-body ol { padding-left: 1.5em; margin: 0.5em 0 1.2em; }
        .article-body li { margin: 0.4em 0; }
        .article-body code { background: rgba(27,42,71,0.08); color: ${ACCENT}; padding: 2px 6px; border-radius: 4px; font-size: 0.9em; }
        .article-body pre { background: #1A1A1A; color: #e8e8e8; padding: 16px 20px; border-radius: 8px; overflow-x: auto; margin: 1.2em 0; }
        .article-body hr { border: none; border-top: 1px solid #CFCBC3; margin: 2em 0; }
      `}</style>

      <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} onTabChange={() => router.push("/")} />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
        <Header onMenuOpen={() => setMenuOpen(true)} activeTab="" onTabChange={(tab) => router.push(`/?tab=${tab}`)} />

        <div style={{ maxWidth: 780, margin: "0 auto 80px" }}>

          <button onClick={() => router.push("/")} style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: "0.88rem", fontWeight: 600, color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer", marginBottom: 32, fontFamily: "'Inter', sans-serif", padding: 0 }}>
            <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, stroke: "currentColor", strokeWidth: 2, fill: "none" }}><polyline points="15 18 9 12 15 6" /></svg>
            Back
          </button>

          {article.tags.length > 0 && (
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
              {article.tags.map(t => <Tag key={t} label={t} />)}
            </div>
          )}

          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(2rem, 5vw, 3rem)", lineHeight: 1.1, marginBottom: 16, color: "var(--text-main)", fontWeight: 400 }}>
            {article.title}
          </h1>

          <div style={{ display: "flex", gap: 16, color: "var(--text-muted)", fontSize: "0.83rem", fontFamily: "'Inter', sans-serif", marginBottom: 32, flexWrap: "wrap", alignItems: "center" }}>
            {dateStr && <span>{dateStr}</span>}
            <span style={{ opacity: 0.4 }}>|</span>
            <span>{article.author}</span>
            {article.readTime && <><span style={{ opacity: 0.4 }}>|</span><span>{article.readTime}</span></>}
            {views > 0 && (
              <><span style={{ opacity: 0.4 }}>|</span>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  {views.toLocaleString()}
                </span>
              </>
            )}
          </div>

          {article.coverImage && (
            <img src={article.coverImage} alt={article.title} style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", borderRadius: 8, display: "block", marginBottom: 40 }} />
          )}

          {/* ── Listen to Article Player ── */}
          {article.audioUrl && (
            <ListenPlayer src={article.audioUrl} readTime={article.readTime} />
          )}

          <div className="article-body" dangerouslySetInnerHTML={{ __html: article.content }} />

          {/* Action bar */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 48, paddingTop: 32, borderTop: "1px solid var(--border)", flexWrap: "wrap" }}>
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
              {saved ? "Saved" : "Bookmark"}
            </button>

            <button style={actionBtn(copied)} onClick={handleShare}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
              </svg>
              {copied ? "Link Copied!" : "Share"}
            </button>

            {!user && (
              <span style={{ marginLeft: "auto", fontSize: "0.78rem", color: "var(--text-muted)", fontFamily: "'Inter', sans-serif" }}>
                <button onClick={() => router.push("/login")} style={{ color: ACCENT, background: "none", border: "none", cursor: "pointer", fontWeight: 600, fontSize: "0.78rem", textDecoration: "underline" }}>Sign in</button>
                {" "}to like & bookmark
              </span>
            )}
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
}
