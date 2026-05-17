"use client";

import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Heart, Bookmark, Share, Ear, Eye, ChevronLeft, ChevronDown, MoveLeft, MoveRight, Play, Pause, Volume2, VolumeX, Maximize2, Minimize2, Loader2, Clock } from "lucide-react";
import Header from "@/components/layout/Header";
import SideMenu from "@/components/layout/SideMenu";
import Footer from "@/components/layout/Footer";
import MobileHeader from "@/components/mobile/MobileHeader";
import MobileSideMenu from "@/components/mobile/MobileSideMenu";
import MobileFooter from "@/components/mobile/MobileFooter";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/auth/firebase";
import { useMobile } from "@/hooks/useMobile";

const ACCENT = "#1B2A47";
const RED = "#D92323";
const TERRA = "#D38B88";
const BLACK = "#111111";
const BG = "#f5f0eb";
const BORDER = "#e0d8d0";
const MUTED = "#666666";

interface Podcast {
  _id: string; slug: string; title: string; excerpt?: string; coverImage?: string;
  audioUrl?: string; episode?: string; duration?: string; tags: string[];
  author: string; publishedAt?: string; likes: number; views: number;
  isLiked: boolean; isSaved: boolean;
}

// ── Desktop audio player (unchanged) ──────────────────────────
function DesktopAudioPlayer({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [total, setTotal] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [speed, setSpeed] = useState(1);
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
    const a = audioRef.current;
    if (!a) return;
    
    // Ensure metadata is loaded
    if (!isFinite(a.duration) || a.duration === 0) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    if (rect.width === 0) return;
    
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const targetTime = pct * a.duration;
    
    if (isFinite(targetTime)) {
      a.currentTime = targetTime;
      setCurrent(targetTime);
    }
  };
  const skip = (s: number) => { if (audioRef.current) audioRef.current.currentTime += s; };
  const setVol = (v: number) => { setVolume(v); if (audioRef.current) audioRef.current.volume = v; if (v > 0) setMuted(false); };
  const toggleMute = () => { if (!audioRef.current) return; const n = !muted; setMuted(n); audioRef.current.volume = n ? 0 : volume; };
  const applySpeed = (s: number) => { setSpeed(s); if (audioRef.current) audioRef.current.playbackRate = s; setSpeedOpen(false); };
  const fmt = (s: number) => { if (isNaN(s)) return "0:00"; return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, "0")}`; };
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
            <MoveLeft size={22} />
            <span style={{ fontSize: "0.58rem", fontFamily: "'Inter', sans-serif", fontWeight: 700 }}>15</span>
          </button>
          <button onClick={togglePlay} disabled={buffering} style={{ width: 56, height: 56, borderRadius: "50%", backgroundColor: buffering ? "rgba(255,255,255,0.12)" : TERRA, border: "none", cursor: buffering ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "transform 0.12s", boxShadow: buffering ? "none" : `0 4px 18px rgba(211,139,136,0.45)` }}>
            {buffering
              ? <Loader2 size={20} color="white" style={{ animation: "spin 0.8s linear infinite" }} />
              : playing
                ? <Pause size={20} color="white" fill="white" />
                : <Play size={20} color="white" fill="white" style={{ marginLeft: 2 }} />
            }
          </button>
          <button onClick={() => skip(15)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.65)", display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
            <MoveRight size={22} />
            <span style={{ fontSize: "0.58rem", fontFamily: "'Inter', sans-serif", fontWeight: 700 }}>15</span>
          </button>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 52, justifyContent: "flex-end" }}>
          <button onClick={toggleMute} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.55)", padding: 0, display: "flex" }}>
            {muted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <input type="range" min={0} max={1} step={0.02} value={muted ? 0 : volume} onChange={(e) => setVol(parseFloat(e.target.value))} style={{ width: 60, accentColor: TERRA, cursor: "pointer" }} />
        </div>
      </div>
    </div>
  );
}


// ── Mobile podcast layout (New Maximized View) ───────────────────
function MobilePodcastView({ podcast, liked, saved, likes, views, copied, actionLoading, onLike, onSave, onShare, morePodcasts }: {
  podcast: Podcast; liked: boolean; saved: boolean; likes: number; views: number;
  copied: boolean; actionLoading: boolean;
  onLike: () => void; onSave: () => void; onShare: () => void;
  morePodcasts: Podcast[];
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [descriptionOpen, setDescriptionOpen] = useState(false);
  const router = useRouter();

  const dateStr = podcast.publishedAt
    ? new Date(podcast.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
    : "";

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const seekRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [current, setCurrent] = useState("0:00");
  const [totalDur, setTotalDur] = useState(podcast.duration ?? "0:00");
  const [volume, setVolume] = useState(1);
  const [speed, setSpeed] = useState(1);
  const [showVol, setShowVol] = useState(false);
  const [buffering, setBuffering] = useState(false);

  useEffect(() => {
    if (!podcast.audioUrl) return;
    const audio = new Audio(podcast.audioUrl);
    audioRef.current = audio;
    audio.volume = volume;
    audio.playbackRate = speed;
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
    if (playing) { a.pause(); setPlaying(false); } else { a.play().catch(() => { }); setPlaying(true); }
  };
  const skip = (sec: number) => { if (audioRef.current) audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime + sec); };
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const a = audioRef.current;
    if (!a) return;
    
    // Ensure metadata is loaded
    if (!isFinite(a.duration) || a.duration === 0) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    if (rect.width === 0) return;
    
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const targetTime = ratio * a.duration;
    
    if (isFinite(targetTime)) {
      a.currentTime = targetTime;
      setProgress(ratio * 100);
      const m = Math.floor(targetTime / 60);
      const s = Math.floor(targetTime % 60).toString().padStart(2, "0");
      setCurrent(`${m}:${s}`);
    }
  };
  const setVol = (v: number) => { setVolume(v); if (audioRef.current) audioRef.current.volume = v; };
  const applySpeed = (s: number) => { setSpeed(s); if (audioRef.current) audioRef.current.playbackRate = s; };

  return (
    <div style={{ backgroundColor: BG, minHeight: "100vh" }} onClick={() => setShowVol(false)}>
      <MobileSideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} onTabChange={(t) => router.push(`/?tab=${t}`)} onBeatSelect={() => router.push("/")} />
      <MobileHeader activeTab="podcasts" onTabChange={(t) => router.push(`/?tab=${t}`)} onMenuOpen={() => setMenuOpen(true)} />

      <div style={{ padding: "12px 16px 20px" }}>
        {/* Row 1: Back | Filter / Sort */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: 20 }}>
          <button onClick={() => router.back()} style={{
            background: "none", border: "1px solid rgb(221, 221, 221)", borderRadius: "6px",
            padding: "5px 12px", cursor: "pointer", fontFamily: "'Inter', sans-serif",
            fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "4px",
            color: BLACK,
          }}>
            <MoveLeft size={14} strokeWidth={2.5} />
            Back
          </button>
        </div>

        {/* Unified Cover + Description Unit */}
        <div style={{ 
          marginBottom: 24, 
          borderRadius: 16, 
          overflow: "hidden", 
          boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
          border: `1px solid ${BORDER}`,
          backgroundColor: "#e0d8d0"
        }}>
          {/* Cover image */}
          <div style={{ position: "relative" }}>
            {podcast.coverImage
              ? <img src={podcast.coverImage} alt={podcast.title} style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", display: "block" }} />
              : <div style={{ width: "100%", aspectRatio: "16/9", backgroundColor: "#2a2a2a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "3rem" }}>🎙</div>
            }
          </div>

          {/* Description Dropdown (Merged) */}
          <div style={{
            padding: "12px 16px",
            transition: "all 0.3s ease",
            maxHeight: descriptionOpen ? "500px" : "44px",
            overflow: "hidden",
          }}>
            <button
              onClick={() => setDescriptionOpen(!descriptionOpen)}
              style={{
                width: "100%", background: "none", border: "none",
                display: "flex", alignItems: "center", gap: 6,
                padding: 0, cursor: "pointer",
                fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", fontWeight: 600, color: MUTED,
                height: 20,
                marginBottom: descriptionOpen ? 12 : 0
              }}
            >
              Description
              <ChevronDown size={12} strokeWidth={2.5} style={{ transform: descriptionOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }} />
            </button>
            {descriptionOpen && (
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.88rem", lineHeight: 1.6, color: BLACK, margin: 0, paddingBottom: 6 }}>
                {podcast.excerpt || "No description available for this episode."}
              </p>
            )}
          </div>
        </div>

        {/* Tags */}
        {podcast.tags?.length > 0 && (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
            {podcast.tags.map(t => (
              <span key={t} style={{
                display: "inline-block", padding: "2px 8px", borderRadius: 999,
                fontFamily: "'Inter', sans-serif", fontSize: "0.58rem", fontWeight: 700,
                color: "#c0392b", backgroundColor: "rgba(192,57,43,0.1)",
              }}>{t}</span>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.75rem", fontWeight: 700, lineHeight: 1.2, color: BLACK, margin: "0 0 12px" }}>
          {podcast.title}
        </h1>

        {/* Meta Info */}
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px", fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", color: MUTED, marginBottom: 32 }}>
          <span>{dateStr}</span>
          <span style={{ opacity: 0.4 }}>·</span>
          <span>{podcast.author}</span>
          {views > 0 && (
            <>
              <span style={{ opacity: 0.4 }}>·</span>
              <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <Ear size={14} />
                {views.toLocaleString()} {views === 1 ? 'Listen' : 'Listens'}
              </span>
            </>
          )}
        </div>


        {/* Audio Player Controls */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 28, marginBottom: 40 }}>
          {/* Control Row: Speed | Skip-10 | Play/Pause | Skip+10 | Volume */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "0 4px" }}>
            {/* Speed Button */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
                const next = speeds[(speeds.indexOf(speed) + 1) % speeds.length];
                applySpeed(next);
              }}
              style={{ 
                background: "white", border: `1.2px solid ${BORDER}`, borderRadius: 8, 
                width: 44, height: 40, display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.78rem", fontFamily: "'Inter', sans-serif", fontWeight: 700, color: BLACK, cursor: "pointer" 
              }}
            >
              {speed}x
            </button>

            <button onClick={(e) => { e.stopPropagation(); skip(-10); }} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", fontWeight: 600, color: BLACK }}>
              <MoveLeft size={22} /> 10
            </button>

            <button onClick={(e) => { e.stopPropagation(); togglePlay(); }} style={{ width: 58, height: 58, borderRadius: "50%", backgroundColor: BLACK, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}>
              {playing 
                ? <Pause size={24} color="white" fill="white" />
                : <Play size={24} color="white" fill="white" style={{ marginLeft: 4 }} />
              }
            </button>

            <button onClick={(e) => { e.stopPropagation(); skip(10); }} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", fontWeight: 600, color: BLACK }}>
              10 <MoveRight size={22} />
            </button>

            {/* Volume Toggle & Vertical Slider */}
            <div style={{ position: "relative" }}>
              {showVol && (
                <div 
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    position: "absolute", bottom: "130%", left: "50%", transform: "translateX(-50%)",
                    backgroundColor: "white", padding: "16px 8px", borderRadius: 12,
                    boxShadow: "0 10px 40px rgba(0,0,0,0.2)", border: `1.2px solid ${BORDER}`,
                    zIndex: 100, display: "flex", flexDirection: "column", alignItems: "center", gap: 12
                  }}
                >
                    <div 
                      style={{ height: 120, display: "flex", alignItems: "center", justifyContent: "center", width: 30, touchAction: "none" }}
                      onTouchStart={(e) => e.stopPropagation()}
                      onTouchMove={(e) => e.stopPropagation()}
                    >
                      <input 
                        type="range" min={0} max={1} step={0.05} 
                        value={volume} 
                        onChange={(e) => setVol(parseFloat(e.target.value))} 
                        style={{ 
                          transform: "rotate(-90deg)", width: 100, accentColor: RED, cursor: "pointer",
                          touchAction: "none"
                        }} 
                        onTouchStart={(e) => e.stopPropagation()}
                        onTouchMove={(e) => e.stopPropagation()}
                      />
                    </div>
                </div>
              )}
              <button 
                onClick={(e) => { e.stopPropagation(); setShowVol(!showVol); }}
                style={{ 
                  background: "white", border: `1.2px solid ${BORDER}`, borderRadius: 8, 
                  width: 44, height: 40, display: "flex", alignItems: "center", justifyContent: "center",
                  color: BLACK, cursor: "pointer" 
                }}
              >
                {volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
            </div>
          </div>
          
          <div style={{ width: "80%", display: "flex", flexDirection: "column", gap: 12 }}>
            <div ref={seekRef} onClick={handleSeek} style={{ height: 4, backgroundColor: "#d9d5ce", borderRadius: 2, cursor: "pointer", position: "relative" }}>
              <div style={{ height: "100%", width: `${progress}%`, backgroundColor: RED, borderRadius: 2, transition: "width 0.2s linear" }} />
            </div>
            <div style={{ textAlign: "center", fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", color: BLACK, fontWeight: 500 }}>
              {current} / {totalDur}
            </div>
          </div>
        </div>

        {/* Interaction Bar (Now below Audio Controls) */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 40, borderTop: `1px solid ${BORDER}`, paddingTop: 24 }}>
          <div style={{ display: "flex", gap: 8, flex: "1 1 auto", justifyContent: "flex-start" }}>
            <button
              onClick={onLike}
              style={{
                display: "flex", alignItems: "center", gap: 6, padding: "7px 12px",
                borderRadius: 8, border: `1px solid ${BORDER}`, background: "white",
                fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", fontWeight: 600, color: liked ? RED : BLACK,
                cursor: "pointer", flex: 1, minWidth: 0, justifyContent: "center"
              }}
            >
              <Heart size={14} fill={liked ? RED : "none"} />
              Like
            </button>
            <button
              onClick={onShare}
              style={{
                display: "flex", alignItems: "center", gap: 6, padding: "7px 12px",
                borderRadius: 8, border: `1px solid ${BORDER}`, background: "white",
                fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", fontWeight: 600, color: BLACK,
                cursor: "pointer", flex: 1, minWidth: 0, justifyContent: "center"
              }}
            >
              <Share size={14} />
              Share
            </button>
          </div>
          <div style={{ display: "flex", gap: 8, flex: "1 1 auto", justifyContent: "flex-end" }}>
            <button
              onClick={onSave}
              style={{
                display: "flex", alignItems: "center", gap: 6, padding: "7px 12px",
                borderRadius: 8, border: `1px solid ${BORDER}`, background: "white",
                fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", fontWeight: 600, color: saved ? RED : BLACK,
                cursor: "pointer", flex: 1, minWidth: 0, justifyContent: "center"
              }}
            >
              <Bookmark size={14} fill={saved ? RED : "none"} />
              Save
            </button>
            <button
              onClick={() => router.push("/")}
              style={{
                display: "flex", alignItems: "center", gap: 6, padding: "7px 10px",
                borderRadius: 8, border: `1px solid ${BORDER}`, background: "white",
                fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", fontWeight: 600, color: BLACK,
                cursor: "pointer", flex: 1, minWidth: 0, justifyContent: "center"
              }}
            >
              <Minimize2 size={15} />
              Min
            </button>
          </div>
        </div>

        {/* Listen to more Podcasts */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", color: MUTED }}>Listen to more Podcasts</span>
            <span style={{ color: MUTED }}>→</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {morePodcasts.map(p => (
              <Link key={p._id} href={`/podcasts/${p.slug}`} style={{ textDecoration: "none", display: "flex", gap: 12, alignItems: "flex-start" }}>
                <span style={{ fontSize: "1.2rem", color: BLACK, lineHeight: 1.1 }}>↪</span>
                <span style={{
                  fontFamily: "'Playfair Display', serif", fontSize: "1.05rem", fontWeight: 700,
                  color: BLACK, textDecoration: "underline", textDecorationThickness: "1px", textUnderlineOffset: "3px"
                }}>
                  {p.title}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <MobileFooter />
    </div>
  );
}


export default function PodcastPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;
  const { user } = useAuth();
  const isMobile = useMobile();

  const [desktopMenuOpen, setDesktopMenuOpen] = useState(false);
  const [podcast, setPodcast] = useState<Podcast | null>(null);
  const [morePodcasts, setMorePodcasts] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likes, setLikes] = useState(0);
  const [views, setViews] = useState(0);
  const [copied, setCopied] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const viewTracked = useRef(false);

  useEffect(() => {
    if (!slug) return;
    (async () => {
      try {
        const uid = auth.currentUser?.uid ?? "";
        // Fetch current podcast
        const res = await fetch(`/api/articles/${slug}${uid ? `?uid=${uid}` : ""}`);
        if (!res.ok) { setNotFound(true); return; }
        const d = await res.json();
        setPodcast(d); setLikes(d.likes ?? 0); setViews(d.views ?? 0);
        setLiked(d.isLiked ?? false); setSaved(d.isSaved ?? false);

        // Fetch more podcasts for recommendations
        const moreRes = await fetch(`/api/articles?type=podcast&limit=4`);
        if (moreRes.ok) {
          const moreData = await moreRes.json();
          // Filter out current podcast
          setMorePodcasts(moreData.filter((p: Podcast) => p.slug !== slug).slice(0, 3));
        }
      } catch { setNotFound(true); } finally { setLoading(false); }
    })();
  }, [slug]);


  useEffect(() => {
    if (!podcast || !user || viewTracked.current) return;
    viewTracked.current = true;
    (async () => {
      try {
        const token = await auth.currentUser?.getIdToken();
        if (!token) {
          viewTracked.current = false;
          return;
        }
        const res = await fetch(`/api/articles/${slug}/view`, { 
          method: "POST", 
          headers: { Authorization: `Bearer ${token}` } 
        });
        if (res.ok) { const d = await res.json(); setViews(d.views); }
      } catch { viewTracked.current = false; }
    })();
  }, [podcast, user, slug]);

  const handleLike = async () => {
    if (!user) { router.push("/login"); return; }
    if (actionLoading) return; setActionLoading(true);
    const was = liked; setLiked(!was); setLikes(n => was ? n - 1 : n + 1);
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch(`/api/articles/${slug}/like`, { method: "POST", headers: { Authorization: `Bearer ${token}` } });
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
      const res = await fetch(`/api/articles/${slug}/save`, { method: "POST", headers: { Authorization: `Bearer ${token}` } });
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

  if (notFound) return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
      <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "2rem" }}>Episode not found</div>
      <button onClick={() => router.push("/")} style={{
        background: "none", border: "1px solid rgb(221, 221, 221)", borderRadius: "6px",
        padding: "5px 12px", cursor: "pointer", fontFamily: "'Inter', sans-serif",
        fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "4px",
        color: ACCENT,
      }}>
        <MoveLeft size={16} />
        Back
      </button>
    </div>
  );

  if (loading) {
    if (isMobile) {
      return (
        <div style={{ backgroundColor: BG, minHeight: "100vh" }}>
          <MobileHeader activeTab="" onTabChange={(t) => router.push(`/?tab=${t}`)} onMenuOpen={() => { }} />
          <div style={{ padding: "16px" }}><div style={{ fontFamily: "'Inter', sans-serif", color: MUTED, textAlign: "center", paddingTop: 40 }}>Loading…</div></div>
        </div>
      );
    }
    return <div style={{ minHeight: "100vh", backgroundColor: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ fontFamily: "'Inter', sans-serif", color: "var(--text-muted)" }}>Loading…</div></div>;
  }

  if (!podcast) return null;

  if (isMobile) {
    return <MobilePodcastView
      podcast={podcast}
      liked={liked}
      saved={saved}
      likes={likes}
      views={views}
      copied={copied}
      actionLoading={actionLoading}
      onLike={handleLike}
      onSave={handleSave}
      onShare={handleShare}
      morePodcasts={morePodcasts}
    />;
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
        <Header onMenuOpen={() => setDesktopMenuOpen(true)} activeTab="podcasts" onTabChange={() => router.push("/")} />
      </div>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px 80px" }}>
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
        <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 40, marginBottom: 36, alignItems: "start" }}>
          <div>
            {podcast.coverImage
              ? <img src={podcast.coverImage} alt={podcast.title} style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", borderRadius: 16, display: "block", boxShadow: "0 12px 40px rgba(0,0,0,0.18)" }} />
              : <div style={{ width: "100%", aspectRatio: "1/1", backgroundColor: "#CFCBC3", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "4rem" }}>🎙</div>
            }
          </div>
          <div style={{ paddingTop: 8 }}>
            <div style={{ display: "flex", gap: 4, alignItems: "center", marginBottom: 10, flexWrap: "wrap" }}>
              {podcast.tags.map(t => (
                <span key={t} style={{ 
                  fontSize: "0.55rem", fontWeight: 700, color: RED, 
                  fontFamily: "'Inter', sans-serif", textTransform: "uppercase", 
                  letterSpacing: "0.03em", backgroundColor: "rgba(217,35,35,0.06)",
                  padding: "1.5px 7px", borderRadius: 3
                }}>
                  {t}
                </span>
              ))}
            </div>
            <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(1.6rem, 3vw, 2.4rem)", lineHeight: 1.1, color: "var(--text-main)", marginBottom: 16, fontWeight: 400 }}>{podcast.title}</h1>
            <div style={{ display: "flex", gap: 14, color: "var(--text-muted)", fontSize: "0.8rem", fontFamily: "'Inter', sans-serif", marginBottom: 24, flexWrap: "wrap", alignItems: "center" }}>
              {dateStr && <span>{dateStr}</span>}
              {podcast.author && <><span style={{ opacity: 0.4 }}>·</span><span>{podcast.author}</span></>}
              {podcast.duration && <><span style={{ opacity: 0.4 }}>·</span><span style={{ display: "flex", alignItems: "center", gap: 4 }}><Clock size={12} />{podcast.duration}</span></>}
              {views > 0 && <><span style={{ opacity: 0.4 }}>·</span><span style={{ display: "flex", alignItems: "center", gap: 4 }}><Ear size={12} />{views.toLocaleString()} {views === 1 ? 'Listen' : 'Listens'}</span></>}
            </div>
          </div>
        </div>
        {podcast.audioUrl ? <DesktopAudioPlayer src={podcast.audioUrl} /> : <div style={{ padding: "32px 24px", borderRadius: 16, backgroundColor: "#e8e5e0", textAlign: "center", fontFamily: "'Inter', sans-serif", fontSize: "0.88rem", color: "var(--text-muted)" }}>Audio not available yet.</div>}
        {/* Interaction Bar — barefoot style */}
        <div style={{ display: "flex", alignItems: "center", gap: 24, marginTop: 36, paddingTop: 28, borderTop: "1px solid var(--border)", flexWrap: "wrap" }}>
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
        {podcast.excerpt && <div style={{ marginTop: 36 }}><h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.3rem", color: "var(--text-main)", marginBottom: 14, fontWeight: 400 }}>Episode Notes</h2><p style={{ fontFamily: "'Radley', serif", fontSize: "1rem", lineHeight: 1.75, color: "var(--text-muted)" }}>{podcast.excerpt}</p></div>}
      </div>
      <Footer />
    </>
  );
}
