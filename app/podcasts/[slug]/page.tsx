"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Header from "@/components/layout/Header";
import SideMenu from "@/components/layout/SideMenu";
import Footer from "@/components/layout/Footer";

const ACCENT = "#1B2A47";
const TERRA  = "#D38B88";
const RED    = "#D92323";

interface Podcast {
  _id: string;
  slug: string;
  title: string;
  excerpt?: string;
  coverImage?: string;
  audioUrl?: string;
  episode?: string;
  duration?: string;
  tags: string[];
  author: string;
  publishedAt?: string;
  likes: number;
}

// ── Custom audio player ──────────────────────────────────────────
function AudioPlayer({ src, duration: initDuration }: { src: string; duration?: string }) {
  const audioRef     = useRef<HTMLAudioElement | null>(null);
  const progressRef  = useRef<HTMLDivElement>(null);
  const [playing, setPlaying]     = useState(false);
  const [current, setCurrent]     = useState(0);
  const [total, setTotal]         = useState(0);
  const [volume, setVolume]       = useState(1);
  const [muted, setMuted]         = useState(false);
  const [speed, setSpeed]         = useState(1);
  const [speedOpen, setSpeedOpen] = useState(false);
  const [loading, setLoading]     = useState(true);
  const SPEEDS = [0.75, 1, 1.25, 1.5, 1.75, 2];

  useEffect(() => {
    const audio = new Audio(src);
    audioRef.current = audio;
    audio.volume = volume;
    audio.onloadedmetadata = () => { setTotal(audio.duration); setLoading(false); };
    audio.ontimeupdate = () => setCurrent(audio.currentTime);
    audio.onended = () => setPlaying(false);
    audio.onwaiting = () => setLoading(true);
    audio.oncanplay  = () => setLoading(false);
    return () => { audio.pause(); audio.src = ""; };
  }, [src]);

  const togglePlay = () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) { a.pause(); setPlaying(false); }
    else         { a.play(); setPlaying(true); }
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const a = audioRef.current;
    const bar = progressRef.current;
    if (!a || !bar) return;
    const rect = bar.getBoundingClientRect();
    const pct  = (e.clientX - rect.left) / rect.width;
    a.currentTime = pct * a.duration;
  };

  const skip = (sec: number) => {
    if (audioRef.current) audioRef.current.currentTime += sec;
  };

  const setVol = (v: number) => {
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
    if (v > 0) setMuted(false);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    const next = !muted;
    setMuted(next);
    audioRef.current.volume = next ? 0 : volume;
  };

  const applySpeed = (s: number) => {
    setSpeed(s);
    if (audioRef.current) audioRef.current.playbackRate = s;
    setSpeedOpen(false);
  };

  const fmt = (s: number) => {
    if (isNaN(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  const pct = total > 0 ? (current / total) * 100 : 0;

  return (
    <div style={{ backgroundColor: "#1a1a1a", borderRadius: 16, padding: "28px 28px 24px", color: "white" }}>
      {/* Progress bar */}
      <div ref={progressRef} onClick={seek} style={{ height: 4, backgroundColor: "rgba(255,255,255,0.12)", borderRadius: 2, cursor: "pointer", marginBottom: 10, position: "relative" }}>
        <div style={{ height: "100%", width: `${pct}%`, backgroundColor: TERRA, borderRadius: 2, transition: "width 0.3s linear", position: "relative" }}>
          <div style={{ position: "absolute", right: -5, top: "50%", transform: "translateY(-50%)", width: 12, height: 12, borderRadius: "50%", backgroundColor: "white", boxShadow: "0 0 0 2px rgba(0,0,0,0.3)" }} />
        </div>
      </div>

      {/* Time */}
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'Inter', sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.45)", marginBottom: 20 }}>
        <span>{fmt(current)}</span>
        <span>{fmt(total)}</span>
      </div>

      {/* Controls row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>

        {/* Left: speed */}
        <div style={{ position: "relative", minWidth: 52 }}>
          <button onClick={() => setSpeedOpen(o => !o)} style={{ background: "none", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 6, color: "rgba(255,255,255,0.7)", padding: "4px 8px", cursor: "pointer", fontSize: "0.75rem", fontFamily: "'Inter', sans-serif", fontWeight: 700 }}>
            {speed}×
          </button>
          {speedOpen && (
            <div style={{ position: "absolute", bottom: "calc(100% + 8px)", left: 0, backgroundColor: "#2a2a2a", borderRadius: 10, overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)", zIndex: 10, minWidth: 72 }}>
              {SPEEDS.map(s => (
                <button key={s} onClick={() => applySpeed(s)} style={{ display: "block", width: "100%", padding: "8px 14px", background: "none", border: "none", cursor: "pointer", color: speed === s ? TERRA : "rgba(255,255,255,0.75)", fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", fontWeight: speed === s ? 700 : 400, textAlign: "left", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  {s}×
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Center: skip back / play / skip fwd */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <button onClick={() => skip(-15)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.65)", display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 1 0 .49-3"/>
            </svg>
            <span style={{ fontSize: "0.58rem", fontFamily: "'Inter', sans-serif", fontWeight: 700 }}>15</span>
          </button>

          <button onClick={togglePlay} disabled={loading} style={{
            width: 56, height: 56, borderRadius: "50%",
            backgroundColor: loading ? "rgba(255,255,255,0.12)" : TERRA,
            border: "none", cursor: loading ? "not-allowed" : "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "transform 0.12s, background 0.15s",
            boxShadow: loading ? "none" : `0 4px 18px rgba(211,139,136,0.45)`,
          }}
            onMouseEnter={(e) => { if (!loading) (e.currentTarget as HTMLElement).style.transform = "scale(1.05)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}
          >
            {loading ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" style={{ animation: "spin 0.8s linear infinite" }}>
                <path d="M12 2a10 10 0 0 1 10 10" strokeOpacity="0.9"/><circle cx="12" cy="12" r="10" strokeOpacity="0.15"/>
              </svg>
            ) : playing ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white" style={{ marginLeft: 2 }}><polygon points="5 3 19 12 5 21 5 3"/></svg>
            )}
          </button>

          <button onClick={() => skip(15)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.65)", display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 1 1-.49-3"/>
            </svg>
            <span style={{ fontSize: "0.58rem", fontFamily: "'Inter', sans-serif", fontWeight: 700 }}>15</span>
          </button>
        </div>

        {/* Right: volume */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 52, justifyContent: "flex-end" }}>
          <button onClick={toggleMute} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.55)", padding: 0, display: "flex" }}>
            {muted || volume === 0 ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
            ) : volume < 0.5 ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
            )}
          </button>
          <input type="range" min={0} max={1} step={0.02} value={muted ? 0 : volume} onChange={(e) => setVol(parseFloat(e.target.value))}
            style={{ width: 60, accentColor: TERRA, cursor: "pointer" }}
          />
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

export default function PodcastPage() {
  const router   = useRouter();
  const params   = useParams();
  const slug     = params?.slug as string;

  const [menuOpen, setMenuOpen] = useState(false);
  const [podcast, setPodcast]   = useState<Podcast | null>(null);
  const [loading, setLoading]   = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied]     = useState(false);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/articles/${slug}`)
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(d => setPodcast(d))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleShare = async () => {
    try { await navigator.clipboard.writeText(window.location.href); }
    catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (notFound) return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
      <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "2rem" }}>Episode not found</div>
      <button onClick={() => router.push("/")} style={{ fontFamily: "'Inter', sans-serif", color: ACCENT, background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>← Back to home</button>
    </div>
  );

  const dateStr = podcast?.publishedAt
    ? new Date(podcast.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
    : "";

  return (
    <>
      <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} onTabChange={() => router.push("/")} />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
        <Header onMenuOpen={() => setMenuOpen(true)} activeTab="" onTabChange={() => router.push("/")} />
      </div>

      {loading ? (
        /* ── Skeleton ── */
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 24px 80px" }}>
          <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
          {[200, 40, 60, 300, 120].map((h, i) => (
            <div key={i} style={{ height: h, borderRadius: 12, marginBottom: 20, background: "linear-gradient(90deg,#e0ddd8 25%,#eae7e2 50%,#e0ddd8 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite" }} />
          ))}
        </div>
      ) : podcast ? (
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 24px 80px" }}>

          {/* Back */}
          <button onClick={() => router.back()} style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: "0.88rem", fontWeight: 600, color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer", marginBottom: 32, fontFamily: "'Inter', sans-serif", padding: 0 }}>
            <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, stroke: "currentColor", strokeWidth: 2, fill: "none" }}><polyline points="15 18 9 12 15 6"/></svg>
            Back
          </button>

          {/* ── Hero layout: cover left, info right ── */}
          <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 40, marginBottom: 36, alignItems: "start" }}>

            {/* Cover art */}
            <div>
              {podcast.coverImage ? (
                <img src={podcast.coverImage} alt={podcast.title} style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", borderRadius: 16, display: "block", boxShadow: "0 12px 40px rgba(0,0,0,0.18)" }} />
              ) : (
                <div style={{ width: "100%", aspectRatio: "1/1", backgroundColor: "#CFCBC3", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "4rem" }}>🎙</div>
              )}
            </div>

            {/* Info */}
            <div style={{ paddingTop: 8 }}>
              {/* Tag + episode badge */}
              <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 14, flexWrap: "wrap" }}>
                {podcast.tags[0] && (
                  <span style={{ fontSize: "0.65rem", fontWeight: 800, color: RED, fontFamily: "'Inter', sans-serif", textTransform: "uppercase", letterSpacing: "0.07em" }}>{podcast.tags[0]}</span>
                )}
                {podcast.tags[0] && podcast.episode && <span style={{ color: "#CFCBC3", fontSize: "0.8rem" }}>·</span>}
                {podcast.episode && (
                  <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--text-muted)", fontFamily: "'Inter', sans-serif", padding: "2px 8px", borderRadius: 4, backgroundColor: "rgba(0,0,0,0.06)" }}>{podcast.episode}</span>
                )}
              </div>

              {/* Title */}
              <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(1.6rem, 3vw, 2.4rem)", lineHeight: 1.1, color: "var(--text-main)", marginBottom: 16, fontWeight: 400 }}>
                {podcast.title}
              </h1>

              {/* Meta */}
              <div style={{ display: "flex", gap: 14, color: "var(--text-muted)", fontSize: "0.8rem", fontFamily: "'Inter', sans-serif", marginBottom: 24, flexWrap: "wrap", alignItems: "center" }}>
                {dateStr && <span>{dateStr}</span>}
                {dateStr && podcast.author && <span style={{ opacity: 0.4 }}>·</span>}
                {podcast.author && <span>{podcast.author}</span>}
                {podcast.duration && (
                  <>
                    <span style={{ opacity: 0.4 }}>·</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      {podcast.duration}
                    </span>
                  </>
                )}
              </div>

              {/* All tags */}
              {podcast.tags.length > 1 && (
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 24 }}>
                  {podcast.tags.slice(1).map(t => (
                    <span key={t} style={{ padding: "3px 10px", borderRadius: 4, fontSize: "0.65rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "'Inter', sans-serif", backgroundColor: "rgba(27,42,71,0.08)", color: ACCENT }}>
                      {t}
                    </span>
                  ))}
                </div>
              )}

              {/* Share button */}
              <button onClick={handleShare} style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "8px 16px", borderRadius: 8, border: "1px solid var(--border)", backgroundColor: copied ? "var(--text-main)" : "transparent", color: copied ? "white" : "var(--text-main)", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", fontWeight: 600, transition: "all 0.15s" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                {copied ? "Copied!" : "Share"}
              </button>
            </div>
          </div>

          {/* ── Audio player ── */}
          {podcast.audioUrl ? (
            <AudioPlayer src={podcast.audioUrl} duration={podcast.duration} />
          ) : (
            <div style={{ padding: "32px 24px", borderRadius: 16, backgroundColor: "#e8e5e0", textAlign: "center", fontFamily: "'Inter', sans-serif", fontSize: "0.88rem", color: "var(--text-muted)" }}>
              Audio not available for this episode yet.
            </div>
          )}

          {/* ── Episode notes / excerpt ── */}
          {podcast.excerpt && (
            <div style={{ marginTop: 36 }}>
              <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.3rem", color: "var(--text-main)", marginBottom: 14, fontWeight: 400 }}>Episode Notes</h2>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "1rem", lineHeight: 1.75, color: "var(--text-muted)" }}>{podcast.excerpt}</p>
            </div>
          )}

        </div>
      ) : null}

      <Footer />
    </>
  );
}
