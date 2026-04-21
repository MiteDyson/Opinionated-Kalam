"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Header from "@/components/layout/Header";
import SideMenu from "@/components/layout/SideMenu";
import Footer from "@/components/layout/Footer";
import MobileHeader from "@/components/mobile/MobileHeader";
import MobileSideMenu from "@/components/mobile/MobileSideMenu";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase";
import { useMobile } from "@/hooks/useMobile";

const ACCENT = "#1B2A47";
const RED    = "#D92323";
const TERRA  = "#D38B88";
const BLACK  = "#111111";
const BG     = "#f5f0eb";
const BORDER = "#e0d8d0";
const MUTED  = "#666666";

interface Podcast {
  _id: string; slug: string; title: string; excerpt?: string; coverImage?: string;
  audioUrl?: string; episode?: string; duration?: string; tags: string[];
  author: string; publishedAt?: string; likes: number; views: number;
  isLiked: boolean; isSaved: boolean;
}

// ── Desktop audio player (unchanged) ──────────────────────────
function DesktopAudioPlayer({ src }: { src: string }) {
  const audioRef    = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [total,   setTotal]   = useState(0);
  const [volume,  setVolume]  = useState(1);
  const [muted,   setMuted]   = useState(false);
  const [speed,   setSpeed]   = useState(1);
  const [speedOpen, setSpeedOpen] = useState(false);
  const [buffering, setBuffering] = useState(true);
  const SPEEDS = [0.75, 1, 1.25, 1.5, 1.75, 2];

  useEffect(() => {
    const audio = new Audio(src);
    audioRef.current = audio; audio.volume = volume;
    audio.onloadedmetadata = () => { setTotal(audio.duration); setBuffering(false); };
    audio.ontimeupdate = () => setCurrent(audio.currentTime);
    audio.onended = () => setPlaying(false);
    audio.onwaiting = () => setBuffering(true);
    audio.oncanplay = () => setBuffering(false);
    return () => { audio.pause(); audio.src = ""; };
  }, [src]);

  const togglePlay = () => {
    const a = audioRef.current; if (!a) return;
    if (playing) { a.pause(); setPlaying(false); } else { a.play(); setPlaying(true); }
  };
  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const a = audioRef.current; const bar = progressRef.current; if (!a || !bar) return;
    const pct = (e.clientX - bar.getBoundingClientRect().left) / bar.getBoundingClientRect().width;
    a.currentTime = pct * a.duration;
  };
  const skip = (s: number) => { if (audioRef.current) audioRef.current.currentTime += s; };
  const setVol = (v: number) => { setVolume(v); if (audioRef.current) audioRef.current.volume = v; if (v > 0) setMuted(false); };
  const toggleMute = () => { if (!audioRef.current) return; const n = !muted; setMuted(n); audioRef.current.volume = n ? 0 : volume; };
  const applySpeed = (s: number) => { setSpeed(s); if (audioRef.current) audioRef.current.playbackRate = s; setSpeedOpen(false); };
  const fmt = (s: number) => { if (isNaN(s)) return "0:00"; return `${Math.floor(s/60)}:${Math.floor(s%60).toString().padStart(2,"0")}`; };
  const pct = total > 0 ? (current / total) * 100 : 0;

  return (
    <div style={{ backgroundColor: "#1a1a1a", borderRadius: 16, padding: "28px 28px 24px", color: "white" }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div ref={progressRef} onClick={seek} style={{ height: 4, backgroundColor: "rgba(255,255,255,0.12)", borderRadius: 2, cursor: "pointer", marginBottom: 10, position: "relative" }}>
        <div style={{ height: "100%", width: `${pct}%`, backgroundColor: TERRA, borderRadius: 2, transition: "width 0.3s linear", position: "relative" }}>
          <div style={{ position: "absolute", right: -5, top: "50%", transform: "translateY(-50%)", width: 12, height: 12, borderRadius: "50%", backgroundColor: "white", boxShadow: "0 0 0 2px rgba(0,0,0,0.3)" }} />
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'Inter', sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.45)", marginBottom: 20 }}>
        <span>{fmt(current)}</span><span>{fmt(total)}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ position: "relative", minWidth: 52 }}>
          <button onClick={() => setSpeedOpen(o => !o)} style={{ background: "none", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 6, color: "rgba(255,255,255,0.7)", padding: "4px 8px", cursor: "pointer", fontSize: "0.75rem", fontFamily: "'Inter', sans-serif", fontWeight: 700 }}>{speed}×</button>
          {speedOpen && (
            <div style={{ position: "absolute", bottom: "calc(100% + 8px)", left: 0, backgroundColor: "#2a2a2a", borderRadius: 10, overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)", zIndex: 10, minWidth: 72 }}>
              {SPEEDS.map(s => <button key={s} onClick={() => applySpeed(s)} style={{ display: "block", width: "100%", padding: "8px 14px", background: "none", border: "none", cursor: "pointer", color: speed === s ? TERRA : "rgba(255,255,255,0.75)", fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", fontWeight: speed === s ? 700 : 400, textAlign: "left", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>{s}×</button>)}
            </div>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <button onClick={() => skip(-15)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.65)", display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 1 0 .49-3"/></svg>
            <span style={{ fontSize: "0.58rem", fontFamily: "'Inter', sans-serif", fontWeight: 700 }}>15</span>
          </button>
          <button onClick={togglePlay} disabled={buffering} style={{ width: 56, height: 56, borderRadius: "50%", backgroundColor: buffering ? "rgba(255,255,255,0.12)" : TERRA, border: "none", cursor: buffering ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "transform 0.12s", boxShadow: buffering ? "none" : `0 4px 18px rgba(211,139,136,0.45)` }}>
            {buffering
              ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" style={{ animation: "spin 0.8s linear infinite" }}><path d="M12 2a10 10 0 0 1 10 10" strokeOpacity="0.9"/><circle cx="12" cy="12" r="10" strokeOpacity="0.15"/></svg>
              : playing
                ? <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                : <svg width="20" height="20" viewBox="0 0 24 24" fill="white" style={{ marginLeft: 2 }}><polygon points="5 3 19 12 5 21 5 3"/></svg>
            }
          </button>
          <button onClick={() => skip(15)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.65)", display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 1 1-.49-3"/></svg>
            <span style={{ fontSize: "0.58rem", fontFamily: "'Inter', sans-serif", fontWeight: 700 }}>15</span>
          </button>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 52, justifyContent: "flex-end" }}>
          <button onClick={toggleMute} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.55)", padding: 0, display: "flex" }}>
            {muted || volume === 0
              ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
              : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
            }
          </button>
          <input type="range" min={0} max={1} step={0.02} value={muted ? 0 : volume} onChange={(e) => setVol(parseFloat(e.target.value))} style={{ width: 60, accentColor: TERRA, cursor: "pointer" }} />
        </div>
      </div>
    </div>
  );
}

// ── Mobile podcast layout ──────────────────────────────────────
function MobilePodcastView({ podcast, liked, saved, likes, views, copied, actionLoading, onLike, onSave, onShare }: {
  podcast: Podcast; liked: boolean; saved: boolean; likes: number; views: number;
  copied: boolean; actionLoading: boolean;
  onLike: () => void; onSave: () => void; onShare: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const dateStr = podcast.publishedAt
    ? new Date(podcast.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
    : "";

  const actionBtn = (active: boolean): React.CSSProperties => ({
    display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8,
    cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", fontWeight: 600,
    border: `1.5px solid ${active ? BLACK : BORDER}`,
    backgroundColor: active ? BLACK : "transparent",
    color: active ? "white" : BLACK, transition: "all 0.15s",
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const seekRef  = useRef<HTMLDivElement>(null);
  const [playing,  setPlaying]  = useState(false);
  const [progress, setProgress] = useState(0);
  const [current,  setCurrent]  = useState("0:00");
  const [totalDur, setTotalDur] = useState(podcast.duration ?? "0:00");
  const [buffering, setBuffering] = useState(false);

  useEffect(() => {
    if (!podcast.audioUrl) return;
    const audio = new Audio(podcast.audioUrl);
    audioRef.current = audio;
    audio.ontimeupdate = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
        const m = Math.floor(audio.currentTime / 60);
        const s = Math.floor(audio.currentTime % 60).toString().padStart(2, "0");
        setCurrent(`${m}:${s}`);
      }
    };
    audio.onloadedmetadata = () => {
      if (!isNaN(audio.duration)) {
        const m = Math.floor(audio.duration / 60);
        const s = Math.floor(audio.duration % 60).toString().padStart(2, "0");
        setTotalDur(`${m}:${s}`);
      }
    };
    audio.onended = () => setPlaying(false);
    audio.onwaiting = () => setBuffering(true);
    audio.oncanplay = () => setBuffering(false);
    return () => { audio.pause(); audio.src = ""; };
  }, [podcast.audioUrl]);

  const togglePlay = () => {
    const a = audioRef.current; if (!a) return;
    if (playing) { a.pause(); setPlaying(false); } else { a.play().catch(() => {}); setPlaying(true); }
  };
  const skip = (sec: number) => { if (audioRef.current) audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime + sec); };
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const a = audioRef.current;
    if (!a || !seekRef.current) return;
    const rect  = seekRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    a.currentTime = ratio * (a.duration || 0);
    setProgress(ratio * 100);
  };

  return (
    <div style={{ backgroundColor: BG, minHeight: "100vh" }}>
      <MobileSideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} onTabChange={(t) => router.push(`/?tab=${t}`)} onBeatSelect={() => router.push("/")} />
      <MobileHeader activeTab="" onTabChange={(t) => router.push(`/?tab=${t}`)} onMenuOpen={() => setMenuOpen(true)} />

      <div style={{ padding: "12px 16px 60px" }}>
        {/* Cover image */}
        {podcast.coverImage
          ? <img src={podcast.coverImage} alt={podcast.title} style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", borderRadius: 10, display: "block", marginBottom: 16, boxShadow: "0 8px 28px rgba(0,0,0,0.15)" }} />
          : <div style={{ width: "100%", aspectRatio: "1/1", backgroundColor: "#2a2a2a", borderRadius: 10, marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "3rem" }}>🎙</div>
        }

        {/* Tags */}
        {podcast.tags?.length > 0 && (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
            {podcast.tags.map(t => (
              <span key={t} style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.6rem", fontWeight: 800, color: RED, textTransform: "uppercase", letterSpacing: "0.06em" }}>{t}</span>
            ))}
            {podcast.episode && <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.68rem", fontWeight: 600, color: MUTED, padding: "1px 7px", borderRadius: 4, backgroundColor: "rgba(0,0,0,0.06)" }}>{podcast.episode}</span>}
          </div>
        )}

        {/* Title — normal weight */}
        <h1 style={{ fontFamily: "'Playfair Display', 'DM Serif Display', Georgia, serif", fontSize: "1.45rem", fontWeight: 400, lineHeight: 1.2, color: BLACK, margin: "0 0 8px" }}>
          {podcast.title}
        </h1>

        {/* Meta */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", fontFamily: "'Inter', sans-serif", fontSize: "0.68rem", color: MUTED, marginBottom: 20, alignItems: "center" }}>
          {dateStr && <span>{dateStr}</span>}
          {podcast.author && <><span style={{ opacity: 0.4 }}>·</span><span>{podcast.author}</span></>}
          {podcast.duration && <><span style={{ opacity: 0.4 }}>·</span><span>{podcast.duration}</span></>}
          {views > 0 && <><span style={{ opacity: 0.4 }}>·</span><span style={{ display: "flex", alignItems: "center", gap: 3 }}><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>{views.toLocaleString()}</span></>}
        </div>

        {/* Inline player */}
        {podcast.audioUrl ? (
          <div style={{ backgroundColor: "#1a1a1a", borderRadius: 12, padding: "16px 18px", marginBottom: 24 }}>
            {/* progress bar */}
            <div ref={seekRef} onClick={handleSeek} style={{ height: 3, backgroundColor: "rgba(255,255,255,0.12)", borderRadius: 2, cursor: "pointer", marginBottom: 8, position: "relative", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${progress}%`, backgroundColor: TERRA, borderRadius: 2, transition: "width 0.3s linear" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", color: "rgba(255,255,255,0.4)", marginBottom: 14 }}>
              <span>{current}</span><span>{totalDur}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 22 }}>
              <button onClick={() => skip(-15)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.6)", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, fontFamily: "'Inter', sans-serif", fontSize: "0.58rem" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 1 0 .49-3"/></svg>15
              </button>
              <button onClick={togglePlay} style={{ width: 48, height: 48, borderRadius: "50%", backgroundColor: TERRA, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 14px rgba(211,139,136,0.4)" }}>
                {playing
                  ? <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                  : <svg width="16" height="16" viewBox="0 0 24 24" fill="white" style={{ marginLeft: 2 }}><polygon points="5 3 19 12 5 21 5 3"/></svg>
                }
              </button>
              <button onClick={() => skip(15)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.6)", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, fontFamily: "'Inter', sans-serif", fontSize: "0.58rem" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 1 1-.49-3"/></svg>15
              </button>
            </div>
          </div>
        ) : (
          <div style={{ padding: "24px", borderRadius: 12, backgroundColor: "#e8e5e0", textAlign: "center", fontFamily: "'Inter', sans-serif", fontSize: "0.88rem", color: MUTED, marginBottom: 24 }}>
            Audio not available yet.
          </div>
        )}

        {/* Interactions */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button style={actionBtn(liked)} onClick={onLike}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            {likes.toLocaleString()} {liked ? "Liked" : "Like"}
          </button>
          <button style={actionBtn(saved)} onClick={onSave}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
            {saved ? "Saved" : "Save"}
          </button>
          <button style={actionBtn(copied)} onClick={onShare}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
            {copied ? "Copied!" : "Share"}
          </button>
        </div>

        {podcast.excerpt && (
          <div style={{ marginTop: 28 }}>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.2rem", color: BLACK, marginBottom: 10, fontWeight: 400 }}>Episode Notes</h2>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", lineHeight: 1.7, color: MUTED }}>{podcast.excerpt}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PodcastPage() {
  const router   = useRouter();
  const params   = useParams();
  const slug     = params?.slug as string;
  const { user } = useAuth();
  const isMobile = useMobile();

  const [desktopMenuOpen, setDesktopMenuOpen] = useState(false);
  const [podcast,  setPodcast]  = useState<Podcast | null>(null);
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
        setPodcast(d); setLikes(d.likes ?? 0); setViews(d.views ?? 0);
        setLiked(d.isLiked ?? false); setSaved(d.isSaved ?? false);
      } catch { setNotFound(true); } finally { setLoading(false); }
    })();
  }, [slug]);

  useEffect(() => {
    if (!podcast || viewTracked.current || !user) return;
    viewTracked.current = true;
    (async () => {
      try {
        const token = await auth.currentUser?.getIdToken();
        if (!token) return;
        const res = await fetch(`/api/articles/${slug}/view`, { method: "POST", headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) { const d = await res.json(); setViews(d.views); }
      } catch { /* silent */ }
    })();
  }, [podcast, user, slug]);

  const handleLike = async () => {
    if (!user) { router.push("/login"); return; }
    if (actionLoading) return; setActionLoading(true);
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
    if (actionLoading) return; setActionLoading(true);
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
    if (navigator.share) { try { await navigator.share({ title: podcast?.title, url }); return; } catch { /* fall */ } }
    try { await navigator.clipboard.writeText(url); } catch {
      const el = document.createElement("textarea"); el.value = url;
      document.body.appendChild(el); el.select(); document.execCommand("copy"); document.body.removeChild(el);
    }
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  if (notFound) return <div style={{ minHeight: "100vh", backgroundColor: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}><div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "2rem" }}>Episode not found</div><button onClick={() => router.push("/")} style={{ fontFamily: "'Inter', sans-serif", color: ACCENT, background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>← Back</button></div>;

  if (loading) {
    if (isMobile) {
      return (
        <div style={{ backgroundColor: BG, minHeight: "100vh" }}>
          <MobileHeader activeTab="" onTabChange={(t) => router.push(`/?tab=${t}`)} onMenuOpen={() => {}} />
          <div style={{ padding: "16px" }}><div style={{ fontFamily: "'Inter', sans-serif", color: MUTED, textAlign: "center", paddingTop: 40 }}>Loading…</div></div>
        </div>
      );
    }
    return <div style={{ minHeight: "100vh", backgroundColor: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ fontFamily: "'Inter', sans-serif", color: "var(--text-muted)" }}>Loading…</div></div>;
  }

  if (!podcast) return null;

  if (isMobile) {
    return <MobilePodcastView podcast={podcast} liked={liked} saved={saved} likes={likes} views={views} copied={copied} actionLoading={actionLoading} onLike={handleLike} onSave={handleSave} onShare={handleShare} />;
  }

  // Desktop (original layout)
  const dateStr = podcast.publishedAt ? new Date(podcast.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "";
  const actionBtn = (active: boolean): React.CSSProperties => ({
    display: "flex", alignItems: "center", gap: 7, padding: "8px 16px", borderRadius: 8, cursor: "pointer",
    fontFamily: "'Inter', sans-serif", fontSize: "0.82rem", fontWeight: 600,
    border: `1px solid ${active ? "var(--text-main)" : "var(--border)"}`,
    backgroundColor: active ? "var(--text-main)" : "transparent",
    color: active ? "white" : "var(--text-main)", transition: "all 0.15s",
  });

  return (
    <>
      <SideMenu isOpen={desktopMenuOpen} onClose={() => setDesktopMenuOpen(false)} onTabChange={() => router.push("/")} />
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
        <Header onMenuOpen={() => setDesktopMenuOpen(true)} activeTab="" onTabChange={() => router.push("/")} />
      </div>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 24px 80px" }}>
        <button onClick={() => router.back()} style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: "0.88rem", fontWeight: 600, color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer", marginBottom: 32, fontFamily: "'Inter', sans-serif", padding: 0 }}>
          <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, stroke: "currentColor", strokeWidth: 2, fill: "none" }}><polyline points="15 18 9 12 15 6"/></svg>
          Back
        </button>
        <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 40, marginBottom: 36, alignItems: "start" }}>
          <div>
            {podcast.coverImage
              ? <img src={podcast.coverImage} alt={podcast.title} style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", borderRadius: 16, display: "block", boxShadow: "0 12px 40px rgba(0,0,0,0.18)" }} />
              : <div style={{ width: "100%", aspectRatio: "1/1", backgroundColor: "#CFCBC3", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "4rem" }}>🎙</div>
            }
          </div>
          <div style={{ paddingTop: 8 }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 14, flexWrap: "wrap" }}>
              {podcast.tags[0] && <span style={{ fontSize: "0.65rem", fontWeight: 800, color: RED, fontFamily: "'Inter', sans-serif", textTransform: "uppercase", letterSpacing: "0.07em" }}>{podcast.tags[0]}</span>}
              {podcast.episode && <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--text-muted)", fontFamily: "'Inter', sans-serif", padding: "2px 8px", borderRadius: 4, backgroundColor: "rgba(0,0,0,0.06)" }}>{podcast.episode}</span>}
            </div>
            <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(1.6rem, 3vw, 2.4rem)", lineHeight: 1.1, color: "var(--text-main)", marginBottom: 16, fontWeight: 400 }}>{podcast.title}</h1>
            <div style={{ display: "flex", gap: 14, color: "var(--text-muted)", fontSize: "0.8rem", fontFamily: "'Inter', sans-serif", marginBottom: 24, flexWrap: "wrap", alignItems: "center" }}>
              {dateStr && <span>{dateStr}</span>}
              {podcast.author && <><span style={{ opacity: 0.4 }}>·</span><span>{podcast.author}</span></>}
              {podcast.duration && <><span style={{ opacity: 0.4 }}>·</span><span style={{ display: "flex", alignItems: "center", gap: 4 }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>{podcast.duration}</span></>}
              {views > 0 && <><span style={{ opacity: 0.4 }}>·</span><span style={{ display: "flex", alignItems: "center", gap: 4 }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>{views.toLocaleString()}</span></>}
            </div>
          </div>
        </div>
        {podcast.audioUrl ? <DesktopAudioPlayer src={podcast.audioUrl} /> : <div style={{ padding: "32px 24px", borderRadius: 16, backgroundColor: "#e8e5e0", textAlign: "center", fontFamily: "'Inter', sans-serif", fontSize: "0.88rem", color: "var(--text-muted)" }}>Audio not available yet.</div>}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 36, paddingTop: 28, borderTop: "1px solid var(--border)", flexWrap: "wrap" }}>
          <button style={actionBtn(liked)} onClick={handleLike} disabled={actionLoading}><svg width="16" height="16" viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>{likes.toLocaleString()} {liked ? "Liked" : "Like"}</button>
          <button style={actionBtn(saved)} onClick={handleSave} disabled={actionLoading}><svg width="16" height="16" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>{saved ? "Saved" : "Save"}</button>
          <button style={actionBtn(copied)} onClick={handleShare}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>{copied ? "Link Copied!" : "Share"}</button>
        </div>
        {podcast.excerpt && <div style={{ marginTop: 36 }}><h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.3rem", color: "var(--text-main)", marginBottom: 14, fontWeight: 400 }}>Episode Notes</h2><p style={{ fontFamily: "'Inter', sans-serif", fontSize: "1rem", lineHeight: 1.75, color: "var(--text-muted)" }}>{podcast.excerpt}</p></div>}
      </div>
      <Footer />
    </>
  );
}
