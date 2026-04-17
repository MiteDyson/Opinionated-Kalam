"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";
import SideMenu from "@/components/layout/SideMenu";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
import { useMobile } from "@/hooks/useMobile";
import { useArticles } from "@/hooks/useArticles";
import dynamic from "next/dynamic";

// Lazy-load the mobile page to avoid SSR issues
const MobilePage = dynamic(() => import("@/components/mobile/MobilePage"), { ssr: false });

const ACCENT   = "#1B2A47";
const RED      = "#D92323";
const ALL_TAGS = ["Automotive", "Geo Politics", "Scandals", "Crime", "Explainers", "Society", "Global", "War"];

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
  episode?: string;
  duration?: string;
  audioUrl?: string;
}

function ReadPill({ label = "Read" }: { label?: string }) {
  return (
    <span style={{ display: "inline-block", padding: "3px 12px", borderRadius: 999, fontSize: "0.68rem", fontWeight: 700, fontFamily: "'Inter', sans-serif", backgroundColor: READ_PILL_BG, color: READ_PILL_TX, whiteSpace: "nowrap" }}>
      {label}
    </span>
  );
}

function SectionLabel({ children, onClick }: { children: string; onClick?: () => void }) {
  return (
    <button onClick={onClick} style={{ background: "none", border: "none", cursor: onClick ? "pointer" : "default", fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: "1rem", letterSpacing: "0.08em", textTransform: "uppercase" as const, color: ACCENT, marginBottom: 18, padding: 0 }}
      onMouseEnter={(e) => { if (onClick) (e.currentTarget as HTMLElement).style.opacity = "0.7"; }}
      onMouseLeave={(e) => { if (onClick) (e.currentTarget as HTMLElement).style.opacity = "1"; }}
    >
      {children} →
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

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "7px 16px", borderRadius: 8,
          border: `1.5px solid ${selectedBeat ? ACCENT : "var(--border)"}`,
          backgroundColor: selectedBeat ? ACCENT : "white",
          color: selectedBeat ? "white" : "var(--text-main)",
          fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", fontWeight: 600,
          cursor: "pointer",
        }}
      >
        {selectedBeat ? `Beat: ${selectedBeat}` : "🏷 Beats"}
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.15s" }}>
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", left: 0,
          backgroundColor: "white", borderRadius: 12,
          border: "1px solid var(--border)", boxShadow: "0 8px 28px rgba(0,0,0,0.12)",
          zIndex: 50, minWidth: 180, overflow: "hidden",
          animation: "fadeDown 0.12s ease",
        }}>
          <style>{`@keyframes fadeDown{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}`}</style>

          <div style={{ padding: "8px 14px 6px", fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: "1px solid #f0f0ee" }}>
            Filter by Beat
          </div>

          {selectedBeat && (
            <button onClick={() => { onBeatChange(null); setOpen(false); }}
              style={{ display: "flex", alignItems: "center", gap: 6, width: "100%", padding: "9px 14px", background: "none", border: "none", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: "0.82rem", color: "#888", borderBottom: "1px solid #f0f0ee", textAlign: "left" }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              Clear filter
            </button>
          )}

          {ALL_TAGS.map((tag, i) => (
            <button key={tag} onClick={() => { onBeatChange(tag); setOpen(false); }}
              style={{ display: "block", width: "100%", padding: "9px 14px", background: "none", border: "none", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: "0.83rem", color: selectedBeat === tag ? ACCENT : "var(--text-main)", fontWeight: selectedBeat === tag ? 700 : 400, backgroundColor: selectedBeat === tag ? "rgba(27,42,71,0.04)" : "transparent", borderBottom: i < ALL_TAGS.length - 1 ? "1px solid #f5f5f3" : "none", textAlign: "left" }}
              onMouseEnter={(e) => { if (selectedBeat !== tag) (e.currentTarget as HTMLElement).style.backgroundColor = "#faf9f7"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = selectedBeat === tag ? "rgba(27,42,71,0.04)" : "transparent"; }}
            >
              {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function PodcastCard({ p, showTag = true, activeSlug, setActiveSlug }: { p: Article; showTag?: boolean; activeSlug: string | null; setActiveSlug: (slug: string | null) => void }) {
  const [progress, setProgress] = useState(0);
  const [current, setCurrent]   = useState("0:00");
  const [totalDur, setTotalDur] = useState(p.duration ?? "0:00");
  const audioRef   = useRef<HTMLAudioElement | null>(null);
  const seekBarRef = useRef<HTMLDivElement>(null);
  const isPlaying  = activeSlug === p.slug;

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
    audio.onended = () => setActiveSlug(null);
    return () => { audio.pause(); audio.src = ""; };
  }, [p.audioUrl, setActiveSlug]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) audio.play().catch(() => {});
    else audio.pause();
  }, [isPlaying]);

  const togglePlay = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (!p.audioUrl) return;
    setActiveSlug(isPlaying ? null : p.slug);
  };

  const skip = (e: React.MouseEvent, sec: number) => {
    e.preventDefault(); e.stopPropagation();
    if (audioRef.current) audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime + sec);
  };

  const handleSeekClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault(); e.stopPropagation();
    const audio = audioRef.current;
    if (!audio || !seekBarRef.current) return;
    const rect = seekBarRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.currentTime = ratio * (audio.duration || 0);
    setProgress(ratio * 100);
  };

  return (
    <Link href={`/podcasts/${p.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
      <article style={{ backgroundColor: POD_BG, border: "1px solid rgba(27,42,71,0.1)", borderRadius: 12, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "10px 10px 0" }}>
          {p.coverImage ? <img src={p.coverImage} alt={p.title} style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", borderRadius: 8, display: "block" }} />
            : <div style={{ width: "100%", aspectRatio: "4/3", backgroundColor: "rgba(27,42,71,0.1)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ fontSize: "2rem" }}>🎙</span></div>}
        </div>
        <div style={{ padding: "12px 14px 14px", display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
          {showTag && <div style={{ fontSize: "0.6rem", fontWeight: 800, color: RED, fontFamily: "'Inter', sans-serif", textTransform: "uppercase", letterSpacing: "0.07em" }}>{p.tags[0] ?? "Podcast"}{p.episode ? ` → ${p.episode}` : ""}</div>}
          <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "0.95rem", lineHeight: 1.25, color: "var(--text-main)", margin: 0 }}>{p.title}</h3>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, marginTop: 4 }}>
            <button onClick={(e) => skip(e, -10)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.65rem", color: "var(--text-muted)", fontFamily: "'Inter', sans-serif", padding: 0 }}>← 10</button>
            <button onClick={togglePlay} style={{ width: 32, height: 32, borderRadius: "50%", backgroundColor: "var(--text-main)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {isPlaying ? <svg width="10" height="10" viewBox="0 0 24 24" fill="white"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                : <svg width="10" height="10" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>}
            </button>
            <button onClick={(e) => skip(e, 10)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.65rem", color: "var(--text-muted)", fontFamily: "'Inter', sans-serif", padding: 0 }}>10 →</button>
          </div>
          <div ref={seekBarRef} onClick={handleSeekClick} style={{ height: 5, backgroundColor: "rgba(27,42,71,0.15)", borderRadius: 3, cursor: "pointer", position: "relative", overflow: "hidden" }}>
            <div style={{ width: `${progress}%`, height: "100%", backgroundColor: RED, borderRadius: 3, transition: "width 0.3s linear" }} />
          </div>
          <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", fontFamily: "'Inter', sans-serif", textAlign: "center" }}>{current} / {totalDur}</div>
        </div>
      </article>
    </Link>
  );
}

function ShortCard({ s, showTag = true }: { s: Article; showTag?: boolean }) {
  return (
    <Link href={`/shorts/${s.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
      <article style={{ backgroundColor: SHORT_BG, border: "1px solid rgba(211,139,136,0.2)", borderRadius: 12, overflow: "hidden", display: "flex", flexDirection: "column", cursor: "pointer", transition: "transform 0.18s, box-shadow 0.18s" }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 20px rgba(0,0,0,0.08)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}>
        <div style={{ padding: "10px 10px 0" }}>
          {s.coverImage ? <img src={s.coverImage} alt={s.title} style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", borderRadius: 8, display: "block" }} />
            : <div style={{ width: "100%", aspectRatio: "16/9", backgroundColor: "rgba(211,139,136,0.15)", borderRadius: 8 }} />}
        </div>
        <div style={{ padding: "10px 14px 14px" }}>
          {showTag && <div style={{ fontSize: "0.6rem", fontWeight: 800, color: RED, fontFamily: "'Inter', sans-serif", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>{s.tags[0] ?? "Short"} &nbsp;·&nbsp; {s.readTime}</div>}
          <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "0.95rem", lineHeight: 1.25, color: "var(--text-main)", margin: 0 }}>{s.title}</h3>
        </div>
      </article>
    </Link>
  );
}

function ArticleCard({ a }: { a: Article }) {
  const date = a.publishedAt ? new Date(a.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "";
  return (
    <Link href={`/article/${a.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
      <article style={{ display: "flex", flexDirection: "column", gap: 12, cursor: "pointer" }}>
        {a.coverImage ? <img src={a.coverImage} alt={a.title} style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", borderRadius: 8 }} />
          : <div style={{ width: "100%", aspectRatio: "16/9", backgroundColor: "#CFCBC3", borderRadius: 8 }} />}
        {/* Tags */}
        {a.tags?.length > 0 && (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {a.tags.map(t => (
              <span key={t} style={{ fontSize: "0.62rem", fontWeight: 700, color: RED, fontFamily: "'Inter', sans-serif", textTransform: "uppercase", letterSpacing: "0.05em" }}>{t}</span>
            ))}
          </div>
        )}
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.4rem", lineHeight: 1.2, margin: 0 }}>{a.title}</h2>
        <div style={{ fontSize: "0.73rem", color: "var(--text-muted)", fontFamily: "'Inter', sans-serif" }}>{date} · {a.author}</div>
        <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", lineHeight: 1.75, margin: 0 }}>{a.excerpt}</p>
        <div style={{ alignSelf: "flex-start" }}><ReadPill /></div>
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

function RecentView({ articles, loading }: { articles: Article[]; loading: boolean }) {
  const [selectedBeat, setSelectedBeat] = useState<string | null>(null);
  const filtered = selectedBeat ? articles.filter(a => a.tags?.includes(selectedBeat)) : articles;

  return (
    <div>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--border)", paddingBottom: 12, marginBottom: 28 }}>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "2rem", margin: 0 }}>Recent Stories</h1>
        <BeatsDropdown selectedBeat={selectedBeat} onBeatChange={setSelectedBeat} />
      </div>
      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px,1fr))", gap: "48px 28px" }}>
          {[1,2,3].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <p style={{ color: "#aaa", fontFamily: "'Inter', sans-serif" }}>
          {selectedBeat ? `No articles in the "${selectedBeat}" beat.` : "No articles yet."}
        </p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px,1fr))", gap: "48px 28px", marginBottom: 60 }}>
          {filtered.map(a => <ArticleCard key={a._id} a={a} />)}
        </div>
      )}
    </div>
  );
}

function PodcastsView({ podcasts, loading, activeSlug, setActiveSlug }: { podcasts: Article[]; loading: boolean; activeSlug: string | null; setActiveSlug: (s: string | null) => void }) {
  const [selectedBeat, setSelectedBeat] = useState<string | null>(null);
  const filtered = selectedBeat ? podcasts.filter(p => p.tags?.includes(selectedBeat)) : podcasts;

  return (
    <div>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--border)", paddingBottom: 12, marginBottom: 28 }}>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "2rem", margin: 0 }}>Podcasts</h1>
        <BeatsDropdown selectedBeat={selectedBeat} onBeatChange={setSelectedBeat} />
      </div>
      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px,1fr))", gap: 20 }}>
          {[1,2,3,4].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <p style={{ color: "#aaa", fontFamily: "'Inter', sans-serif" }}>
          {selectedBeat ? `No podcasts in the "${selectedBeat}" beat.` : "No podcasts yet."}
        </p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px,1fr))", gap: 20, marginBottom: 60 }}>
          {filtered.map(p => <PodcastCard key={p._id} p={p} activeSlug={activeSlug} setActiveSlug={setActiveSlug} />)}
        </div>
      )}
    </div>
  );
}

function ShortsView({ shorts, loading }: { shorts: Article[]; loading: boolean }) {
  const [selectedBeat, setSelectedBeat] = useState<string | null>(null);
  const filtered = selectedBeat ? shorts.filter(s => s.tags?.includes(selectedBeat)) : shorts;

  return (
    <div>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--border)", paddingBottom: 12, marginBottom: 28 }}>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "2rem", margin: 0 }}>Short Reads</h1>
        <BeatsDropdown selectedBeat={selectedBeat} onBeatChange={setSelectedBeat} />
      </div>
      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px,1fr))", gap: 20 }}>
          {[1,2,3,4].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <p style={{ color: "#aaa", fontFamily: "'Inter', sans-serif" }}>
          {selectedBeat ? `No short reads in the "${selectedBeat}" beat.` : "No short reads yet."}
        </p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px,1fr))", gap: 20, marginBottom: 60 }}>
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

      {(hero || others.length > 0) && (
        <div style={{ display: "grid", gridTemplateColumns: "1.7fr 1fr", gap: 0, marginBottom: 48, borderBottom: "1px solid var(--border)", paddingBottom: 40 }}>
          <div style={{ paddingRight: 32, borderRight: "1px solid var(--border)" }}>
            <SectionLabel onClick={hero ? () => router.push(`/article/${hero.slug}`) : undefined}>Latest Story</SectionLabel>
            {hero ? (
              <Link href={`/article/${hero.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                <article style={{ cursor: "pointer" }}>
                  {hero.coverImage ? <img src={hero.coverImage} alt={hero.title} referrerPolicy="no-referrer" style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", borderRadius: 8, marginBottom: 14 }} />
                    : <div style={{ width: "100%", aspectRatio: "16/9", backgroundColor: "#CFCBC3", borderRadius: 8, marginBottom: 14 }} />}
                  {/* Tags */}
                  {hero.tags?.length > 0 && (
                    <div style={{ display: "flex", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
                      {hero.tags.map(t => (
                        <span key={t} style={{ fontSize: "0.62rem", fontWeight: 700, color: RED, fontFamily: "'Inter', sans-serif", textTransform: "uppercase", letterSpacing: "0.05em" }}>{t}</span>
                      ))}
                    </div>
                  )}
                  <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "2rem", lineHeight: 1.1, marginBottom: 8, color: "var(--text-main)" }}>{hero.title}</h2>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontFamily: "'Inter', sans-serif", marginBottom: 10 }}>
                    {hero.publishedAt ? new Date(hero.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : ""} &nbsp;·&nbsp; {hero.author}
                    {hero.readTime && <> &nbsp;·&nbsp; {hero.readTime} minute read </>}
                  </div>
                  <p style={{ fontSize: "0.88rem", color: "var(--text-main)", lineHeight: 1.7, fontFamily: "'Inter', sans-serif", marginBottom: 16 }}>{hero.excerpt}</p>
                  <ReadPill label="Read Further" />
                </article>
              </Link>
            ) : <p style={{ color: "#aaa", fontFamily: "'Inter', sans-serif", fontSize: "0.9rem" }}>No articles yet.</p>}
          </div>

          <div style={{ paddingLeft: 32 }}>
            <SectionLabel onClick={() => onTabChange("recent")}>Recent Stories</SectionLabel>
            {others.length === 0 ? <p style={{ color: "#aaa", fontFamily: "'Inter', sans-serif", fontSize: "0.9rem" }}>No other stories yet.</p> : (
              <div style={{ display: "flex", flexDirection: "column" }}>
                {others.map((a, i) => (
                  <Link key={a._id} href={`/article/${a.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                    <article style={{ padding: "14px 0", borderBottom: i < others.length - 1 ? "1px solid var(--border)" : "none", display: "flex", flexDirection: "column", gap: 7 }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.7")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}>
                      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                        {a.coverImage ? <img src={a.coverImage} alt={a.title} referrerPolicy="no-referrer" style={{ width: 80, height: 54, objectFit: "cover", borderRadius: 6, flexShrink: 0 }} />
                          : <div style={{ width: 80, height: 54, backgroundColor: "#CFCBC3", borderRadius: 6, flexShrink: 0 }} />}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          {a.tags?.length > 0 && (
                            <div style={{ display: "flex", gap: 4, marginBottom: 3 }}>
                              {a.tags.slice(0,2).map(t => <span key={t} style={{ fontSize: "0.58rem", fontWeight: 700, color: RED, fontFamily: "'Inter', sans-serif", textTransform: "uppercase" }}>{t}</span>)}
                            </div>
                          )}
                          <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1rem", lineHeight: 1.3, color: "var(--text-main)", margin: "0 0 7px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>{a.title}</h3>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                            <span style={{ fontSize: "0.62rem", color: "var(--text-muted)", fontFamily: "'Inter', sans-serif" }}>
                              {a.publishedAt ? new Date(a.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : ""}
                            </span>
                            {a.readTime && <><span style={{ fontSize: "0.6rem", color: "var(--border)" }}>·</span><span style={{ fontSize: "0.62rem", color: "var(--text-muted)", fontFamily: "'Inter', sans-serif" }}>{a.readTime} minute read</span></>}
                            <ReadPill />
                          </div>
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

      {podcasts.length > 0 && (
        <section style={{ marginBottom: 48 }}>
          <SectionLabel onClick={() => onTabChange("podcasts")}>Latest Podcasts</SectionLabel>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {podcasts.slice(0, 4).map(p => <PodcastCard key={p._id} p={p} showTag={false} activeSlug={activeSlug} setActiveSlug={setActiveSlug} />)}
          </div>
        </section>
      )}

      <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: "48px 0 40px" }} />

      {shorts.length > 0 && (
        <section style={{ marginBottom: 60 }}>
          <SectionLabel onClick={() => onTabChange("shorts")}>Short Reads</SectionLabel>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {shorts.slice(0, 4).map(s => <ShortCard key={s._id} s={s} showTag={false} />)}
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
  const isMobile = useMobile();
  const [activeTab, setActiveTab] = useState("home");
  const [menuOpen, setMenuOpen]   = useState(false);
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
  }, []);

  // Render mobile layout if on mobile device
  if (isMobile) {
    return <MobilePage />;
  }

  // Desktop layout
  const renderTab = () => {
    switch (activeTab) {
      case "home":     return <HomeView articles={articles} podcasts={podcasts} shorts={shorts} loading={loading} onTabChange={setActiveTab} activeSlug={activeSlug} setActiveSlug={setActiveSlug} />;
      case "recent":   return <RecentView articles={articles} loading={loading} />;
      case "podcasts": return <PodcastsView podcasts={podcasts} loading={loading} activeSlug={activeSlug} setActiveSlug={setActiveSlug} />;
      case "shorts":   return <ShortsView shorts={shorts} loading={loading} />;
      // Legacy beats tab kept for deep links
      case "beats":    return <RecentView articles={articles} loading={loading} />;
      default:         return <HomeView articles={articles} podcasts={podcasts} shorts={shorts} loading={loading} onTabChange={setActiveTab} activeSlug={activeSlug} setActiveSlug={setActiveSlug} />;
    }
  };

  return (
    <>
      <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} onTabChange={setActiveTab} />
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
        <Header onMenuOpen={() => setMenuOpen(true)} activeTab={activeTab} onTabChange={setActiveTab} />
        <main key={activeTab} style={{ animation: "fadeIn 0.25s ease forwards" }}>
          <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}`}</style>
          {renderTab()}
        </main>
      </div>
      <Footer />
    </>
  );
}
