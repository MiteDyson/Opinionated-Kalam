"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";
import SideMenu from "@/components/layout/SideMenu";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
import { useMobileReady } from "@/hooks/useMobile";
import { useArticles } from "@/hooks/useArticles";
import dynamic from "next/dynamic";
import { MobileAboutView, MobileGrievanceView, MobileTeamView, MobileContactView } from "@/components/mobile/MobileInfoPages";
import { BookOpen, MoveLeft, Heart, Bookmark, Share, Maximize2, Play, Pause, MoveRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Lazy-load the mobile page to avoid SSR issues
const MobilePage = dynamic(() => import("@/components/mobile/MobilePage"), { ssr: false });

const ACCENT   = "#1B2A47";
const RED      = "#D92323";
const MUTED    = "#666666";
const ALL_TAGS = ["Automotive", "Business", "Environment", "Geo Politics", "Governance", "Law & Order", "Media", "Society", "Technology"];

const POD_BG       = "#e1dfe8";
const SHORT_BG     = "#fae8c1";
const READ_PILL_BG = "#f2e3e1";
const READ_PILL_TX = "#a94438";

interface Article {
  _id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  author: string;
  tags: string[];
  type: string;
  readTime: string;
  publishedAt: string;
  likes: number;
  views?: number;
  episode?: string;
  duration?: string;
  audioUrl?: string;
}


function SectionLabel({ children, onClick }: { children: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "none", border: "none",
        cursor: onClick ? "pointer" : "default",
        fontFamily: "'Inter', sans-serif",
        fontWeight: 800,
        fontSize: "0.95rem",
        letterSpacing: "0.12em",
        textTransform: "uppercase" as const,
        color: ACCENT,
        marginBottom: 16,
        padding: 0,
        display: "flex",
        alignItems: "center",
        gap: 6,
      }}
      onMouseEnter={(e) => { if (onClick) (e.currentTarget as HTMLElement).style.opacity = "0.65"; }}
      onMouseLeave={(e) => { if (onClick) (e.currentTarget as HTMLElement).style.opacity = "1"; }}
    >
      {children} <span style={{ fontSize: "0.95rem" }}>→</span>
    </button>
  );
}

// ── Beats Filter dropdown (desktop) ────────────────────────────
function BeatsDropdown({ selectedBeat, onBeatChange }: { selectedBeat: string | null; onBeatChange: (b: string | null) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const RotateCcw = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.4 }}>
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>
    </svg>
  );

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "6px 14px", borderRadius: 6,
          border: "1px solid #ddd",
          backgroundColor: "white",
          color: "#333",
          fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", fontWeight: 500,
          cursor: "pointer",
        }}
      >
        Beats <span style={{ fontSize: "0.55rem", opacity: 0.6 }}>▼</span>
      </button>

      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", right: 0,
          backgroundColor: "white", borderRadius: 8,
          border: "1px solid #eee", boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
          zIndex: 100, minWidth: 180, overflow: "hidden",
          animation: "fadeDown 0.1s ease",
        }}>
          <style>{`@keyframes fadeDown{from{opacity:0;transform:translateY(-5px)}to{opacity:1;transform:translateY(0)}}`}</style>
          
          <button
            onClick={() => { onBeatChange(null); setOpen(false); }}
            style={{
              width: "100%", padding: "12px 16px", background: "none", border: "none",
              cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: "0.85rem",
              color: "#999", fontWeight: 600, textAlign: "left",
              display: "flex", alignItems: "center", gap: "8px",
              transition: "background 0.2s"
            }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = "#f9f9f9"}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"}
          >
            <RotateCcw /> Reset to Default
          </button>
          
          <div style={{ height: "1px", backgroundColor: "#eee" }} />

          <div style={{ display: "flex", flexDirection: "column", padding: "4px 0" }}>
            {ALL_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => { onBeatChange(tag); setOpen(false); }}
                style={{
                  width: "100%", padding: "10px 16px", background: "none", border: "none",
                  cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: "0.88rem",
                  color: selectedBeat === tag ? "#1B2A47" : "#444",
                  fontWeight: selectedBeat === tag ? 700 : 400,
                  textAlign: "left",
                  transition: "background 0.2s",
                  backgroundColor: selectedBeat === tag ? "#f5f2ed" : "transparent"
                }}
                onMouseEnter={e => { if (selectedBeat !== tag) (e.currentTarget as HTMLElement).style.backgroundColor = "#f9f9f9"; }}
                onMouseLeave={e => { if (selectedBeat !== tag) (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SortDropdown({ selectedSort, onSortChange }: { selectedSort: string; onSortChange: (s: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const options = ["Trending", "Most Views", "Least Views", "Newest", "Oldest"];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "6px 14px", borderRadius: 6,
          border: "1px solid #ddd",
          backgroundColor: "white",
          color: "#333",
          fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", fontWeight: 500,
          cursor: "pointer",
        }}
      >
        Sort <span style={{ fontSize: "0.55rem", opacity: 0.6 }}>▼</span>
      </button>

      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", right: 0,
          backgroundColor: "white", borderRadius: 8,
          border: "1px solid #eee", boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
          zIndex: 100, minWidth: 160, overflow: "hidden",
          animation: "fadeDown 0.1s ease",
        }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {options.map((opt, i) => (
              <React.Fragment key={opt}>
                <button
                  onClick={() => { onSortChange(opt); setOpen(false); }}
                  style={{
                    width: "100%", padding: "12px 16px", background: "none", border: "none",
                    cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: "0.88rem",
                    color: selectedSort === opt ? "#1B2A47" : "#444",
                    fontWeight: selectedSort === opt ? 700 : 400,
                    textAlign: "left",
                    transition: "background 0.2s",
                    backgroundColor: selectedSort === opt ? "#f5f2ed" : "transparent"
                  }}
                  onMouseEnter={e => { if (selectedSort !== opt) (e.currentTarget as HTMLElement).style.backgroundColor = "#f9f9f9"; }}
                  onMouseLeave={e => { if (selectedSort !== opt) (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
                >
                  {opt}
                </button>
                {i < options.length - 1 && <div style={{ height: "1px", backgroundColor: "#eee" }} />}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function PodcastCard({ p, showTag = true, activeSlug, setActiveSlug }: { p: Article; showTag?: boolean; activeSlug: string | null; setActiveSlug: (slug: string | null) => void }) {
  const [progress, setProgress] = useState(0);
  const [current, setCurrent]   = useState("0:00");
  const [totalDur, setTotalDur] = useState(p.duration ?? "0:00");
  const [liked, setLiked]       = useState(false);
  const [saved, setSaved]       = useState(false);
  const [saving, setSaving]     = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef   = useRef<HTMLAudioElement | null>(null);
  const seekBarRef = useRef<HTMLDivElement>(null);
  const isExpanded = activeSlug === p.slug;

  const { user } = useAuth();

  useEffect(() => {
    if (!p.audioUrl) return;
    const audio = new Audio(p.audioUrl);
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
    audio.onended = () => {
      setIsPlaying(false);
      setActiveSlug(null);
    };
    return () => { audio.pause(); audio.src = ""; audioRef.current = null; };
  }, [p.audioUrl]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!isExpanded && isPlaying) {
      setIsPlaying(false);
      audio.pause();
    }
  }, [isExpanded, isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) audio.play().catch(() => { setIsPlaying(false); });
    else audio.pause();
  }, [isPlaying]);

  const togglePlay = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (!p.audioUrl) return;
    if (!isExpanded) {
      setActiveSlug(p.slug);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (saving) return;
    setSaving(true);
    try {
      const token = await (user as any)?.getIdToken();
      if (!token) { setSaved(s => !s); return; }
      await fetch(`/api/articles/${p.slug}/save`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      setSaved(s => !s);
    } catch {
      setSaved(s => !s);
    } finally {
      setSaving(false);
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    const url = `${window.location.origin}/podcasts/${p.slug}`;
    if (navigator.share) navigator.share({ title: p.title, url }).catch(() => { });
    else {
      navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  };

  const skip = (e: React.MouseEvent, sec: number) => {
    e.preventDefault(); e.stopPropagation();
    if (audioRef.current) audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime + sec);
  };

  const handleSeekClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault(); e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;
    
    // Ensure metadata is loaded
    if (!isFinite(audio.duration) || audio.duration === 0) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    if (rect.width === 0) return;
    
    const x = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, x / rect.width));
    const targetTime = ratio * audio.duration;
    
    if (isFinite(targetTime)) {
      audio.currentTime = targetTime;
      // Force immediate progress update for better feedback
      setProgress(ratio * 100);
      const m = Math.floor(targetTime / 60);
      const s = Math.floor(targetTime % 60).toString().padStart(2, "0");
      setCurrent(`${m}:${s}`);
    }
  };

  return (
    <div onClick={togglePlay} style={{ textDecoration: "none", color: "inherit" }}>
      <article style={{
        backgroundColor: "white",
        border: "1px solid #111",
        borderRadius: 14,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.2s ease-in-out",
        cursor: "pointer",
        position: "relative",
        boxShadow: isExpanded ? "0 12px 40px rgba(0,0,0,0.12)" : "none",
        transform: isExpanded ? "translateY(-4px)" : "none"
      }}>
        <div style={{ padding: "12px 12px 0" }}>
          {p.coverImage ? (
            <img src={p.coverImage} alt={p.title} style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", borderRadius: 10, display: "block" }} />
          ) : (
            <div style={{ width: "100%", aspectRatio: "4/3", backgroundColor: "rgba(27,42,71,0.06)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: "2.4rem" }}>🎙</span>
            </div>
          )}
        </div>

        <div style={{ padding: "14px 16px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
          {/* Tags row */}
          {showTag && p.tags?.length > 0 && (
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {p.tags.slice(0, 2).map(t => (
                <span key={t} style={{ fontSize: "0.58rem", fontWeight: 800, color: RED, fontFamily: "'Inter', sans-serif", textTransform: "uppercase", letterSpacing: "0.06em", backgroundColor: "rgba(217,35,35,0.08)", borderRadius: 20, padding: "2px 8px" }}>{t}</span>
              ))}
            </div>
          )}

          <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.05rem", lineHeight: 1.25, color: "#111", margin: 0 }}>
            {p.title}
          </h3>

          {!isExpanded && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 4 }}>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.72rem", color: MUTED }}>{totalDur}</span>
              <button
                onClick={togglePlay}
                style={{ width: 34, height: 34, borderRadius: "50%", backgroundColor: "#111", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <Play size={16} color="white" fill="white" style={{ marginLeft: 2 }} />
              </button>
            </div>
          )}

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                style={{ overflow: "hidden" }}
              >
                <div style={{ paddingTop: 16 }}>
                  {/* Playback Row */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20, marginBottom: 16 }}>
                    <button onClick={(e) => skip(e, -10)} style={{ background: "none", border: "none", cursor: "pointer", color: "#111", display: "flex", alignItems: "center", gap: 6, fontSize: "0.75rem", fontWeight: 600 }}>
                      <MoveLeft size={16} /> 10
                    </button>
                    <button onClick={togglePlay} style={{ width: 44, height: 44, borderRadius: "50%", backgroundColor: "#111", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {isPlaying ? (
                        <Pause size={20} color="white" fill="white" />
                      ) : (
                        <Play size={20} color="white" fill="white" style={{ marginLeft: 3 }} />
                      )}
                    </button>
                    <button onClick={(e) => skip(e, 10)} style={{ background: "none", border: "none", cursor: "pointer", color: "#111", display: "flex", alignItems: "center", gap: 6, fontSize: "0.75rem", fontWeight: 600 }}>
                      10 <MoveRight size={16} />
                    </button>
                  </div>

                  {/* Progress Bar */}
                  <div style={{ width: "85%", margin: "0 auto 12px" }}>
                    <div ref={seekBarRef} onClick={handleSeekClick} style={{ height: 4, backgroundColor: "rgba(0,0,0,0.1)", borderRadius: 2, cursor: "pointer", position: "relative" }}>
                      <div style={{ width: `${progress}%`, height: "100%", backgroundColor: RED, borderRadius: 2, transition: "width 0.2s linear" }} />
                    </div>
                  </div>

                  {/* Interactions Row */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", gap: 12 }}>
                      <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); setLiked(!liked); }} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: liked ? RED : "#111" }}>
                        <Heart size={20} fill={liked ? "currentColor" : "none"} strokeWidth={1.5} />
                      </button>
                      <button onClick={handleShare} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: "#111" }}>
                        <Share size={18} strokeWidth={1.5} />
                      </button>
                    </div>

                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", fontWeight: 500, color: "#111" }}>
                      {current} / {totalDur}
                    </div>

                    <div style={{ display: "flex", gap: 12 }}>
                      <button onClick={handleSave} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: saved ? RED : "#111", opacity: saving ? 0.5 : 1 }}>
                        <Bookmark size={20} fill={saved ? "currentColor" : "none"} strokeWidth={1.5} />
                      </button>
                      <Link href={`/podcasts/${p.slug}`} onClick={(e) => e.stopPropagation()} style={{ color: "#111", display: "flex" }}>
                        <Maximize2 size={18} strokeWidth={1.5} />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </article>
    </div>
  );
}

function ShortCard({ s, showTag = true }: { s: Article; showTag?: boolean }) {
  return (
    <Link href={`/shorts/${s.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
      <article style={{ backgroundColor: "transparent", border: "1px solid #000", borderRadius: 12, overflow: "hidden", display: "flex", flexDirection: "column", cursor: "pointer", transition: "transform 0.18s, box-shadow 0.18s" }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 20px rgba(0,0,0,0.08)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}>
        <div style={{ padding: "10px 10px 0" }}>
          {s.coverImage ? <img src={s.coverImage} alt={s.title} style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", borderRadius: 8, display: "block" }} />
            : <div style={{ width: "100%", aspectRatio: "16/9", backgroundColor: "rgba(211,139,136,0.15)", borderRadius: 8 }} />}
        </div>
        <div style={{ padding: "10px 14px 14px" }}>
          {s.tags?.length > 0 && (
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 6, alignItems: "center" }}>
              {s.tags.slice(0, 3).map(t => (
                <span key={t} style={{ fontSize: "0.55rem", fontWeight: 800, color: RED, fontFamily: "'Inter', sans-serif", textTransform: "uppercase", letterSpacing: "0.07em", backgroundColor: "rgba(217,35,35,0.08)", borderRadius: 20, padding: "2px 8px" }}>{t}</span>
              ))}
            </div>
          )}
          <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "0.95rem", lineHeight: 1.25, color: "var(--text-main)", margin: "0 0 8px" }}>{s.title}</h3>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", color: "var(--text-muted)", fontSize: "0.68rem", fontFamily: "'Inter', sans-serif" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.7 }}>
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
              </svg>
              {(s.views || 0).toLocaleString()} {(s.views || 0) === 1 ? 'View' : 'Views'}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <BookOpen size={10} />
              {s.readTime} min read
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

function ArticleCard({ a }: { a: Article }) {
  const date = a.publishedAt ? new Date(a.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "";
  return (
    <Link href={`/article/${a.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
      <article style={{ display: "flex", flexDirection: "column", gap: 8, cursor: "pointer" }}>
        {a.coverImage ? <img src={a.coverImage} alt={a.title} style={{ width: "100%", aspectRatio: "16/10", objectFit: "cover", borderRadius: 10 }} />
          : <div style={{ width: "100%", aspectRatio: "16/10", backgroundColor: "#CFCBC3", borderRadius: 10 }} />}
        
        {/* Tags — pill chips below image */}
        {a.tags?.length > 0 && (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 4 }}>
            {a.tags.slice(0, 2).map(t => (
              <span key={t} style={{ fontSize: "0.58rem", fontWeight: 700, color: RED, fontFamily: "'Inter', sans-serif", textTransform: "uppercase", letterSpacing: "0.05em", backgroundColor: "rgba(217,35,35,0.06)", borderRadius: 4, padding: "2px 6px" }}>{t}</span>
            ))}
          </div>
        )}

        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.15rem", lineHeight: 1.25, margin: "4px 0 2px", color: "var(--text-main)" }}>{a.title}</h2>
        <div style={{ display: "flex", gap: 6, alignItems: "center", fontSize: "0.65rem", color: "var(--text-muted)", fontFamily: "'Inter', sans-serif" }}>
          <span>{date}</span>
          {a.author && <><span style={{ opacity: 0.3 }}>·</span><span>{a.author}</span></>}
        </div>
      </article>
    </Link>
  );
}

function Skeleton({ h = 20, w = "100%", radius = 6 }: { h?: number; w?: string | number; radius?: number }) {
  return <div style={{ height: h, width: w, borderRadius: radius, backgroundColor: "#e8e5e0", animation: "pulse 1.5s ease-in-out infinite" }} />;
}
function SkeletonCard() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <Skeleton h={160} radius={8} />
      <Skeleton h={16} w="80%" />
      <Skeleton h={12} w="50%" />
    </div>
  );
}

// ── Desktop sub-views with Beats filter ────────────────────────

function RecentView({ articles, loading, onTabChange }: { articles: Article[]; loading: boolean; onTabChange: (t: string) => void }) {
  const [selectedBeat, setSelectedBeat] = useState<string | null>(null);
  const [selectedSort, setSelectedSort] = useState("Newest");

  let filtered = selectedBeat ? articles.filter(a => a.tags?.includes(selectedBeat)) : [...articles];
  
  if (selectedSort === "Newest") filtered.sort((a,b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  else if (selectedSort === "Oldest") filtered.sort((a,b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime());
  else if (selectedSort === "Most Views") filtered.sort((a,b) => (b.views || 0) - (a.views || 0));
  else if (selectedSort === "Least Views") filtered.sort((a,b) => (a.views || 0) - (b.views || 0));

  return (
    <div>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
        <button onClick={() => onTabChange("home")} style={{ background: "none", border: "1px solid rgb(221, 221, 221)", borderRadius: 6, padding: "5px 12px", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", display: "flex", alignItems: "center", gap: 4 }}>
          <MoveLeft size={14} /> Back
        </button>
        <div style={{ flex: 1 }} />
        <BeatsDropdown selectedBeat={selectedBeat} onBeatChange={setSelectedBeat} />
        <SortDropdown selectedSort={selectedSort} onSortChange={setSelectedSort} />
      </div>

      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "48px 28px" }}>
          {[1,2,3,4,5,6].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <p style={{ color: "#aaa", fontFamily: "'Inter', sans-serif", textAlign: "center", padding: "40px 0" }}>
          {selectedBeat ? `No articles in the "${selectedBeat}" beat.` : "No articles yet."}
        </p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "48px 28px", marginBottom: 60 }}>
          {filtered.map(a => <ArticleCard key={a._id} a={a} />)}
        </div>
      )}
    </div>
  );
}

function PodcastsView({ podcasts, loading, activeSlug, setActiveSlug, onTabChange }: { podcasts: Article[]; loading: boolean; activeSlug: string | null; setActiveSlug: (s: string | null) => void; onTabChange: (t: string) => void }) {
  const [selectedBeat, setSelectedBeat] = useState<string | null>(null);
  const [selectedSort, setSelectedSort] = useState("Newest");

  let filtered = selectedBeat ? podcasts.filter(p => p.tags?.includes(selectedBeat)) : [...podcasts];
  
  if (selectedSort === "Most Views") filtered.sort((a,b) => (b.views || 0) - (a.views || 0));
  else if (selectedSort === "Newest") filtered.sort((a,b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  return (
    <div>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
        <button onClick={() => onTabChange("home")} style={{ background: "none", border: "1px solid rgb(221, 221, 221)", borderRadius: 6, padding: "5px 12px", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", display: "flex", alignItems: "center", gap: 4 }}>
          <MoveLeft size={14} /> Back
        </button>
        <div style={{ flex: 1 }} />
        <BeatsDropdown selectedBeat={selectedBeat} onBeatChange={setSelectedBeat} />
        <SortDropdown selectedSort={selectedSort} onSortChange={setSelectedSort} />
      </div>

      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20 }}>
          {[1,2,3,4,5,6,7,8].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <p style={{ color: "#aaa", fontFamily: "'Inter', sans-serif", textAlign: "center", padding: "40px 0" }}>
          {selectedBeat ? `No podcasts in the "${selectedBeat}" beat.` : "No podcasts yet."}
        </p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20, marginBottom: 60 }}>
          {filtered.map(p => <PodcastCard key={p._id} p={p} activeSlug={activeSlug} setActiveSlug={setActiveSlug} />)}
        </div>
      )}
    </div>
  );
}

function ShortsView({ shorts, loading, onTabChange }: { shorts: Article[]; loading: boolean; onTabChange: (t: string) => void }) {
  const [selectedBeat, setSelectedBeat] = useState<string | null>(null);
  const [selectedSort, setSelectedSort] = useState("Newest");

  let filtered = selectedBeat ? shorts.filter(s => s.tags?.includes(selectedBeat)) : [...shorts];

  return (
    <div>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
        <button onClick={() => onTabChange("home")} style={{ background: "none", border: "1px solid rgb(221, 221, 221)", borderRadius: 6, padding: "5px 12px", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", display: "flex", alignItems: "center", gap: 4 }}>
          <MoveLeft size={14} /> Back
        </button>
        <div style={{ flex: 1 }} />
        <BeatsDropdown selectedBeat={selectedBeat} onBeatChange={setSelectedBeat} />
        <SortDropdown selectedSort={selectedSort} onSortChange={setSelectedSort} />
      </div>

      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20 }}>
          {[1,2,3,4,5,6,7,8].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <p style={{ color: "#aaa", fontFamily: "'Inter', sans-serif", textAlign: "center", padding: "40px 0" }}>
          {selectedBeat ? `No short articles in the "${selectedBeat}" beat.` : "No short articles yet."}
        </p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20, marginBottom: 60 }}>
          {filtered.map(s => <ShortCard key={s._id} s={s} />)}
        </div>
      )}
    </div>
  );
}

function HomeView({ articles, podcasts, shorts, loading, onTabChange, activeSlug, setActiveSlug }: {
  articles: Article[]; podcasts: Article[]; shorts: Article[]; loading: boolean;
  onTabChange: (t: string) => void; activeSlug: string | null; setActiveSlug: (s: string | null) => void;
}) {
  const router = useRouter();
  const hero   = articles[0];
  const others = articles.slice(1, 5);

  if (loading) return (
    <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Skeleton h={240} radius={8} /><Skeleton h={28} w="70%" /><Skeleton h={14} w="40%" /><Skeleton h={14} /><Skeleton h={14} w="90%" />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {[1,2,3,4].map(i => (
            <div key={i} style={{ display: "flex", gap: 12 }}>
              <Skeleton h={60} w={90} radius={6} />
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}><Skeleton h={14} /><Skeleton h={12} w="60%" /></div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <Skeleton h={20} w={180} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginTop: 16 }}>
          {[1,2,3,4].map(i => <SkeletonCard key={i} />)}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>

      {/* ── Hero + Other Stories ── */}
      {(hero || others.length > 0) && (
        <div style={{
          display: "grid",
          gridTemplateColumns: "1.65fr 1fr",
          gap: 0,
          marginBottom: 48,
          borderBottom: "1px solid var(--border)",
          paddingBottom: 40,
        }}>
          {/* Left: Latest Article */}
          <div style={{ paddingRight: 36, borderRight: "1px solid var(--border)" }}>
            <SectionLabel onClick={hero ? () => router.push(`/article/${hero.slug}`) : undefined}>Latest Article</SectionLabel>
            {hero ? (
              <Link href={`/article/${hero.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                <article style={{ cursor: "pointer" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.88")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}>
                  {hero.coverImage
                    ? <img src={hero.coverImage} alt={hero.title} referrerPolicy="no-referrer" style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", borderRadius: 10, marginBottom: 14, display: "block" }} />
                    : <div style={{ width: "100%", aspectRatio: "16/9", backgroundColor: "#CFCBC3", borderRadius: 10, marginBottom: 14 }} />}
                  {/* Hero tags — pill chips */}
                  {hero.tags?.length > 0 && (
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 8 }}>
                      {hero.tags.map(t => (
                        <span key={t} style={{ fontSize: "0.55rem", fontWeight: 800, color: RED, fontFamily: "'Inter', sans-serif", textTransform: "uppercase", letterSpacing: "0.07em", backgroundColor: "rgba(217,35,35,0.08)", borderRadius: 20, padding: "2px 8px" }}>{t}</span>
                      ))}
                    </div>
                  )}
                  <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.75rem", lineHeight: 1.15, marginBottom: 8, color: "var(--text-main)" }}>{hero.title}</h2>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", color: "var(--text-muted)", fontSize: "0.73rem", fontFamily: "'Inter', sans-serif", marginBottom: 10 }}>
                    <span>{hero.publishedAt ? new Date(hero.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : ""}</span>
                    {hero.author && <><span style={{ opacity: 0.4 }}>·</span><span>{hero.author}</span></>}
                  </div>
                  <p style={{ fontSize: "0.95rem", color: "var(--text-muted)", lineHeight: 1.75, fontFamily: "var(--font-radley), 'Radley', serif", margin: 0 }}>{hero.excerpt}</p>
                </article>
              </Link>
            ) : <p style={{ color: "#aaa", fontFamily: "'Inter', sans-serif", fontSize: "0.9rem" }}>No articles yet.</p>}
          </div>

          {/* Right: Other Stories */}
          <div style={{ paddingLeft: 36 }}>
            <SectionLabel onClick={() => onTabChange("articles")}>Other Stories</SectionLabel>
            {others.length === 0
              ? <p style={{ color: "#aaa", fontFamily: "'Inter', sans-serif", fontSize: "0.9rem" }}>No other stories yet.</p>
              : (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {others.map((a, i) => (
                    <Link key={a._id} href={`/article/${a.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                      <article
                        style={{ padding: "13px 0", borderBottom: "none", display: "flex", gap: 16, alignItems: "flex-start" }}
                        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.72")}
                        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}>
                        {/* Thumbnail */}
                        {a.coverImage
                          ? <img src={a.coverImage} alt={a.title} referrerPolicy="no-referrer" style={{ width: 92, height: 64, objectFit: "cover", borderRadius: 6, flexShrink: 0 }} />
                          : <div style={{ width: 92, height: 64, backgroundColor: "#CFCBC3", borderRadius: 6, flexShrink: 0 }} />}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          {a.tags?.length > 0 && (
                            <div style={{ display: "flex", gap: 4, marginBottom: 4, flexWrap: "wrap" }}>
                              {a.tags.slice(0, 2).map(t => (
                                <span key={t} style={{ fontSize: "0.55rem", fontWeight: 800, color: RED, fontFamily: "'Inter', sans-serif", textTransform: "uppercase", letterSpacing: "0.07em", backgroundColor: "rgba(217,35,35,0.08)", borderRadius: 20, padding: "2px 8px" }}>{t}</span>
                              ))}
                            </div>
                          )}
                          <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "0.95rem", lineHeight: 1.3, color: "var(--text-main)", margin: "0 0 5px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>{a.title}</h3>
                          <div style={{ fontSize: "0.6rem", color: "var(--text-muted)", fontFamily: "'Inter', sans-serif" }}>
                            {a.publishedAt ? new Date(a.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : ""}
                            {a.author ? ` · ${a.author}` : ""}
                          </div>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
              )}
          </div>
        </div>
      )}

      {/* ── Latest Podcasts ── */}
      {podcasts.length > 0 && (
        <section style={{ marginBottom: 0, paddingBottom: 40 }}>
          <SectionLabel onClick={() => onTabChange("podcasts")}>Latest Podcasts</SectionLabel>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {podcasts.slice(0, 4).map(p => (
              <PodcastCard key={p._id} p={p} showTag activeSlug={activeSlug} setActiveSlug={setActiveSlug} />
            ))}
          </div>
        </section>
      )}

      <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: "40px 0 36px" }} />

      {/* ── Short Articles ── */}
      {shorts.length > 0 && (
        <section style={{ marginBottom: 60 }}>
          <SectionLabel onClick={() => onTabChange("shorts")}>Short Articles</SectionLabel>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {shorts.slice(0, 4).map(s => (
              <ShortCard key={s._id} s={s} showTag />
            ))}
          </div>
        </section>
      )}

      {articles.length === 0 && podcasts.length === 0 && shorts.length === 0 && (
        <div style={{ textAlign: "center", padding: "80px 0", color: "#aaa", fontFamily: "'Inter', sans-serif" }}>
          <div style={{ fontSize: "2rem", marginBottom: 12 }}>✍️</div>
          <div style={{ fontSize: "1rem", marginBottom: 6 }}>No content published yet.</div>
          <div style={{ fontSize: "0.85rem" }}>Go to the admin panel to publish your first article.</div>
        </div>
      )}
    </>
  );
}

// ── Root page — detects mobile and routes ─────────────────────
export default function HomePage() {
  const [isMobile, mobileReady] = useMobileReady();
  const [activeTab, setActiveTab] = useState("home");
  const [menuOpen, setMenuOpen]   = useState(false);
  const [menuMode, setMenuMode]   = useState<"menu" | "search">("menu");
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const { user } = useAuth();
  const router = useRouter();

  // Shared cached hook — no duplicate fetches, 3-min TTL cache
  const uid = (user as any)?.uid ?? "";
  const { articles, podcasts, shorts, loading } = useArticles(uid);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const tab = params.get("tab");
    if (tab) setActiveTab(tab);
    else setActiveTab("home");
  }, []);

  // Don't render anything until mobile detection is ready (prevents flash)
  if (!mobileReady) {
    return <div style={{ minHeight: "100vh", backgroundColor: "var(--bg)" }} />;
  }

  // Render mobile layout if on mobile device
  if (isMobile) {
    return (
      <MobilePage 
        initialData={{ articles, podcasts, shorts, loading }} 
      />
    );
  }

  // Desktop layout
  const renderTab = () => {
    switch (activeTab) {
      case "home":     return <HomeView articles={articles} podcasts={podcasts} shorts={shorts} loading={loading} onTabChange={setActiveTab} activeSlug={activeSlug} setActiveSlug={setActiveSlug} />;
      case "articles": return <RecentView articles={articles} loading={loading} onTabChange={setActiveTab} />;
      case "podcasts": return <PodcastsView podcasts={podcasts} loading={loading} activeSlug={activeSlug} setActiveSlug={setActiveSlug} onTabChange={setActiveTab} />;
      case "shorts":   return <ShortsView shorts={shorts} loading={loading} onTabChange={setActiveTab} />;
      case "about":     return <div style={{ maxWidth: 800, margin: "0 auto" }}><MobileAboutView onTabChange={setActiveTab} /></div>;
      case "team":      return <div style={{ maxWidth: 800, margin: "0 auto" }}><MobileTeamView onTabChange={setActiveTab} /></div>;
      case "grievance": return <div style={{ maxWidth: 800, margin: "0 auto" }}><MobileGrievanceView onTabChange={setActiveTab} /></div>;
      case "contact":   return <div style={{ maxWidth: 800, margin: "0 auto" }}><MobileContactView onTabChange={setActiveTab} /></div>;
      // Legacy beats tab kept for deep links
      case "beats":    return <RecentView articles={articles} loading={loading} onTabChange={setActiveTab} />;
      default:         return <HomeView articles={articles} podcasts={podcasts} shorts={shorts} loading={loading} onTabChange={setActiveTab} activeSlug={activeSlug} setActiveSlug={setActiveSlug} />;
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} onTabChange={setActiveTab} initialMode={menuMode} />
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", flex: 1, width: "100%" }}>
        <Header
          onMenuOpen={() => { setMenuMode("menu"); setMenuOpen(true); }}
          onSearchOpen={() => { setMenuMode("search"); setMenuOpen(true); }}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        <main key={activeTab} style={{ animation: "fadeIn 0.25s ease forwards" }}>
          <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}`}</style>
          {renderTab()}
        </main>
      </div>
      <Footer />
    </div>
  );
}
