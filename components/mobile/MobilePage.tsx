"use client";

import { useState, useEffect, useRef, memo, useCallback } from "react";
import Link from "next/link";
import MobileHeader from "@/components/mobile/MobileHeader";
import MobileSideMenu from "@/components/mobile/MobileSideMenu";
import MobileFooter from "@/components/mobile/MobileFooter";
import BeatsFilter from "@/components/mobile/BeatsFilter";
import { useArticles, type Article } from "@/hooks/useArticles";
import { useAuth } from "@/context/AuthContext";

const RED       = "#c0392b";
const BLACK     = "#111111";
const BG        = "#f5f0eb";
const WHITE     = "#ffffff";
const BORDER    = "#e0d8d0";
const MUTED     = "#666666";
const LIGHT_TEXT = "#999999";
const CARD_BG   = WHITE;

// ── Skeleton ──────────────────────────────────────────────────
function Sk({ h = 16, w = "100%", r = 4 }: { h?: number; w?: string | number; r?: number }) {
  return <div style={{ height: h, width: w as any, borderRadius: r, backgroundColor: "#e0d8d0", animation: "oksk 1.4s ease-in-out infinite" }} />;
}

// ── Section header ────────────────────────────────────────────
const SectionHeader = memo(function SectionHeader({ label, onClick }: { label: string; onClick?: () => void }) {
  return (
    <button onClick={onClick} style={{
      background: "none", border: "none",
      cursor: onClick ? "pointer" : "default",
      fontFamily: "'Inter', sans-serif",
      fontWeight: 700,
      fontSize: "0.72rem",
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      color: BLACK,
      padding: "12px 0 8px",
      display: "flex", alignItems: "baseline", gap: 2,
    }}>
      {label}<span>→</span>
    </button>
  );
});

// ── Tag chip — small pill/chip style with background ─
function Tag({ label }: { label: string }) {
  return (
    <span style={{
      display: "inline-block",
      padding: "1px 6px",
      borderRadius: 999,
      fontFamily: "'Inter', sans-serif",
      fontSize: "0.48rem",
      fontWeight: 700,
      color: RED,
      textTransform: "uppercase",
      letterSpacing: "0.04em",
      backgroundColor: "rgba(192,57,43,0.1)",
      whiteSpace: "nowrap",
    }}>
      {label}
    </span>
  );
}

// ── Read pill — desktop style ─────────────────────────────────
function ReadPill({ label = "Read" }: { label?: string }) {
  return (
    <span style={{
      display: "inline-block",
      padding: "2px 9px",
      borderRadius: 999,
      fontSize: "0.58rem",
      fontWeight: 700,
      fontFamily: "'Inter', sans-serif",
      backgroundColor: "rgba(211,139,136,0.18)",
      color: "#a94438",
      whiteSpace: "nowrap",
    }}>
      {label}
    </span>
  );
}

// ── Thin section divider (like desktop) ───────────────────────
function SectionDivider() {
  return <hr style={{ border: "none", borderTop: `1px solid ${BORDER}`, margin: "4px 0" }} />;
}

// ── HERO ARTICLE ──────────────────────────────────────────────
const MobileHeroArticle = memo(function MobileHeroArticle({ a }: { a: Article }) {
  const date = a.publishedAt
    ? new Date(a.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
    : "";
  return (
    <Link href={`/article/${a.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
      <article style={{ marginBottom: 4 }}>
        {a.coverImage
          ? <img src={a.coverImage} alt={a.title} loading="lazy" decoding="async" style={{ width: "100%", height: 196, objectFit: "cover", borderRadius: 4, display: "block", marginBottom: 10, backgroundColor: "#2a2a2a" }} />
          : <div style={{ width: "100%", height: 196, backgroundColor: "#2a2a2a", borderRadius: 4, marginBottom: 10 }} />
        }

        {a.tags?.length > 0 && (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 5 }}>
            {a.tags.map(t => <Tag key={t} label={t} />)}
          </div>
        )}

        {/* Normal weight title — not bold */}
        <h3 style={{
          fontFamily: "'Playfair Display', 'DM Serif Display', Georgia, serif",
          fontSize: "1.25rem",
          fontWeight: 400,        /* normal, not bold */
          color: BLACK,
          margin: "0 0 5px",
          lineHeight: 1.25,
        }}>
          {a.title}
        </h3>

        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.68rem", color: MUTED, marginBottom: 8 }}>
          {date}{date && a.author ? " · " : ""}{a.author}
        </div>

        {a.excerpt && (
          <p style={{ fontFamily: "'Radley', serif", fontSize: "0.88rem", color: MUTED, lineHeight: 1.6, margin: "0 0 10px" }}>
            {a.excerpt.slice(0, 130)}{a.excerpt.length > 130 ? "..." : ""}
          </p>
        )}
        <ReadPill label="Read Further" />
      </article>
    </Link>
  );
});

// ── OTHER ARTICLE item (home list) ────────────────────────────
const MobileArticleItem = memo(function MobileArticleItem({ a, noBorder }: { a: Article; noBorder?: boolean }) {
  const date = a.publishedAt
    ? new Date(a.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : "";
  return (
    <Link href={`/article/${a.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
      <article style={{
        display: "flex", gap: 10, padding: "10px 0",
        borderBottom: noBorder ? "none" : `1px solid ${BORDER}`,
        alignItems: "flex-start",
      }}>
        {a.coverImage
          ? <img src={a.coverImage} alt={a.title} loading="lazy" style={{ width: 70, height: 56, objectFit: "cover", borderRadius: 3, flexShrink: 0, backgroundColor: "#2a2a2a" }} />
          : <div style={{ width: 70, height: 56, backgroundColor: "#2a2a2a", borderRadius: 3, flexShrink: 0 }} />
        }
        <div style={{ flex: 1, minWidth: 0 }}>
          {a.tags?.length > 0 && (
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 3 }}>
              {a.tags.slice(0, 2).map(t => <Tag key={t} label={t} />)}
            </div>
          )}
          {/* Normal weight */}
          <h4 style={{
            fontFamily: "'Playfair Display', 'DM Serif Display', Georgia, serif",
            fontSize: "0.85rem", fontWeight: 400,
            color: BLACK, lineHeight: 1.3, margin: "0 0 4px",
            display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
          } as any}>
            {a.title}
          </h4>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "'Inter', sans-serif", fontSize: "0.63rem", color: MUTED }}>
            <span>{date} · {a.author}</span>
            <ReadPill />
          </div>
        </div>
      </article>
    </Link>
  );
});

// ── ARTICLES GRID CARD (articles page, 2-col) ─────────────────
const MobileArticleCard = memo(function MobileArticleCard({ a }: { a: Article }) {
  const date = a.publishedAt
    ? new Date(a.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : "";
  return (
    <Link href={`/article/${a.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
      <article style={{ backgroundColor: BG }}>
        {a.coverImage
          ? <img src={a.coverImage} alt={a.title} loading="lazy" style={{ width: "100%", height: 108, objectFit: "cover", borderRadius: 3, display: "block", backgroundColor: "#2a2a2a" }} />
          : <div style={{ width: "100%", height: 108, backgroundColor: "#2a2a2a", borderRadius: 3 }} />
        }
        {/* Normal weight title */}
        <h3 style={{
          fontFamily: "'Playfair Display', 'DM Serif Display', Georgia, serif",
          fontSize: "0.82rem", fontWeight: 400,
          color: BLACK, margin: "6px 0 4px", lineHeight: 1.28,
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
        } as any}>
          {a.title}
        </h3>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.6rem", color: MUTED, marginBottom: 4 }}>
          {date} · {a.author}
        </div>
        {a.tags?.length > 0 && (
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {a.tags.slice(0, 2).map(t => <Tag key={t} label={t} />)}
          </div>
        )}
      </article>
    </Link>
  );
});

// ── PODCAST CARD ──────────────────────────────────────────────
const MobilePodcastCard = memo(function MobilePodcastCard({
  p, activeSlug, setActiveSlug, showTag = true,
}: {
  p: Article; activeSlug: string | null; setActiveSlug: (s: string | null) => void; showTag?: boolean;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const seekRef  = useRef<HTMLDivElement>(null);
  const [progress,  setProgress]  = useState(0);
  const [current,   setCurrent]   = useState("0:00");
  const [totalDur,  setTotalDur]  = useState(p.duration ?? "0:00");
  const isPlaying = activeSlug === p.slug;

  const ensureAudio = useCallback(() => {
    if (audioRef.current || !p.audioUrl) return;
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
  }, [p.audioUrl, setActiveSlug]);

  useEffect(() => () => { audioRef.current?.pause(); }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) audio.play().catch(() => {});
    else audio.pause();
  }, [isPlaying]);

  const togglePlay = useCallback((e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (!p.audioUrl) return;
    ensureAudio();
    setTimeout(() => {
      const audio = audioRef.current; if (!audio) return;
      if (isPlaying) { audio.pause(); setActiveSlug(null); }
      else { audio.play().catch(() => {}); setActiveSlug(p.slug); }
    }, 0);
  }, [p.audioUrl, p.slug, isPlaying, ensureAudio, setActiveSlug]);

  const skip = useCallback((e: React.MouseEvent, sec: number) => {
    e.preventDefault(); e.stopPropagation();
    if (audioRef.current) audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime + sec);
  }, []);

  const handleSeek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault(); e.stopPropagation();
    const audio = audioRef.current;
    if (!audio || !seekRef.current) return;
    const rect  = seekRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.currentTime = ratio * (audio.duration || 0);
    setProgress(ratio * 100);
  }, []);



  return (
    <Link href={`/podcasts/${p.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
      <div style={{
        backgroundColor: "transparent",
        border: `1.5px solid ${BLACK}`,
        borderRadius: 6, padding: 12, marginBottom: 10,
        position: "relative",
      }}>
        {/* Maximize arrow — top right */}
        <div style={{ position: "absolute", top: 8, right: 8, zIndex: 2 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={MUTED} strokeWidth="2" strokeLinecap="round">
            <polyline points="15 3 21 3 21 9"/><line x1="21" y1="3" x2="14" y2="10"/>
          </svg>
        </div>

        {/* Top row: image + info */}
        <div style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: isPlaying ? 10 : 0 }}>
          {p.coverImage
            ? <img src={p.coverImage} alt={p.title} loading="lazy" style={{ width: 72, height: 72, objectFit: "cover", borderRadius: 4, flexShrink: 0, backgroundColor: "#2a2a2a" }} />
            : <div style={{ width: 72, height: 72, backgroundColor: "#2a2a2a", borderRadius: 4, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem" }}>🎙</div>
          }
          <div style={{ flex: 1, minWidth: 0 }}>
            {showTag && p.tags?.length > 0 && (
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 4 }}>
                {p.tags.slice(0, 2).map(t => <Tag key={t} label={t} />)}
              </div>
            )}
            <h4 style={{
              fontFamily: "'Playfair Display', 'DM Serif Display', Georgia, serif",
              fontSize: "0.88rem", fontWeight: 400,
              color: BLACK, lineHeight: 1.3, margin: "0 0 5px",
              display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
            } as any}>
              {p.title}
            </h4>
            {!isPlaying && (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.62rem", color: MUTED }}>{totalDur}</span>
                <button onClick={togglePlay} style={{ width: 32, height: 32, borderRadius: "50%", backgroundColor: BLACK, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Player controls — shown when playing */}
        {isPlaying && (
          <div style={{ display: "flex", flexDirection: "column", gap: 5, alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <button onClick={(e) => skip(e, -10)} style={{ background: "none", border: "none", cursor: "pointer", color: MUTED, display: "flex", flexDirection: "column", alignItems: "center", gap: 1, padding: 0, fontFamily: "'Inter', sans-serif", fontSize: "0.6rem" }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 1 0 .49-3"/></svg>
                10
              </button>
              <button onClick={togglePlay} style={{ width: 36, height: 36, borderRadius: "50%", backgroundColor: BLACK, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
              </button>
              <button onClick={(e) => skip(e, 10)} style={{ background: "none", border: "none", cursor: "pointer", color: MUTED, display: "flex", flexDirection: "column", alignItems: "center", gap: 1, padding: 0, fontFamily: "'Inter', sans-serif", fontSize: "0.6rem" }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 1 1-.49-3"/></svg>
                10
              </button>
            </div>
            <div ref={seekRef} onClick={handleSeek} style={{ width: "100%", height: 3, backgroundColor: BORDER, borderRadius: 2, cursor: "pointer", position: "relative", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${progress}%`, backgroundColor: BLACK, borderRadius: 2, transition: "width 0.25s linear" }} />
            </div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.62rem", color: MUTED, fontVariantNumeric: "tabular-nums" }}>
              {current} / {totalDur}
            </div>
          </div>
        )}


      </div>
    </Link>
  );
});

// ── SHORT ARTICLE CARD ────────────────────────────────────────
const MobileShortCard = memo(function MobileShortCard({ s }: { s: Article }) {
  return (
    <Link href={`/shorts/${s.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
      <article style={{
        backgroundColor: "transparent",
        border: `1.5px solid ${BLACK}`,
        borderRadius: 6, padding: 10,
        display: "flex", flexDirection: "column", minHeight: 105,
      }}>
        {/* Tags top-left */}
        {s.tags?.length > 0 && (
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 4 }}>
            {s.tags.slice(0, 2).map(t => <Tag key={t} label={t} />)}
          </div>
        )}
        {/* Normal weight title */}
        <h4 style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "0.76rem", fontWeight: 500,
          color: BLACK, lineHeight: 1.35,
          margin: "0 0 auto", paddingBottom: 8,
          display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden",
        } as any}>
          {s.title}
        </h4>
        {/* Bottom: duration left, views right */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto" }}>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.6rem", color: LIGHT_TEXT }}>
            {s.readTime ?? "2 min read"}
          </span>
          {(s as any).views > 0 && (
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.6rem", color: LIGHT_TEXT, display: "flex", alignItems: "center", gap: 2 }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
              </svg>
              {(s as any).views}
            </span>
          )}
        </div>
      </article>
    </Link>
  );
});

// ── Sort dropdown ─────────────────────────────────────────────
type SortOption = "trending" | "mostViews" | "leastViews" | "newest" | "oldest";
const SORT_LABELS: Record<SortOption, string> = {
  trending: "Trending", mostViews: "Most Views", leastViews: "Least Views", newest: "Newest", oldest: "Oldest",
};

function SortDropdown({ sortOpt, setSortOpt }: { sortOpt: SortOption; setSortOpt: (d: SortOption) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <button onClick={() => setOpen(o => !o)} style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 4, border: `1px solid ${BORDER}`, backgroundColor: WHITE, fontFamily: "'Inter', sans-serif", fontSize: "0.72rem", fontWeight: 400, color: BLACK, cursor: "pointer" }}>
        Sort <span style={{ fontSize: "0.6rem" }}>‹</span>
      </button>
      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 4px)", right: 0, backgroundColor: WHITE, borderRadius: 6, border: `1px solid ${BORDER}`, boxShadow: "0 4px 20px rgba(0,0,0,0.12)", zIndex: 40, minWidth: 130, overflow: "hidden" }}>
          {(Object.keys(SORT_LABELS) as SortOption[]).map((opt, i, arr) => (
            <button key={opt} onClick={() => { setSortOpt(opt); setOpen(false); }} style={{
              display: "block", width: "100%", padding: "8px 14px", background: "none", border: "none", cursor: "pointer",
              fontFamily: "'Inter', sans-serif", fontSize: "0.78rem",
              fontWeight: sortOpt === opt ? 600 : 400, color: sortOpt === opt ? BLACK : MUTED,
              backgroundColor: sortOpt === opt ? "#f5f0eb" : "transparent",
              borderBottom: i < arr.length - 1 ? `1px solid ${BORDER}` : "none", textAlign: "left",
            }}>
              {SORT_LABELS[opt]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// HOME VIEW
// ─────────────────────────────────────────────────────────────
function MobileHomeView({ articles, podcasts, shorts, loading, onTabChange, activeSlug, setActiveSlug }: {
  articles: Article[]; podcasts: Article[]; shorts: Article[]; loading: boolean;
  onTabChange: (t: string) => void; activeSlug: string | null; setActiveSlug: (s: string | null) => void;
}) {
  const hero   = articles[0];
  const others = articles.slice(1, 4);

  return (
    <div>
      {/* Latest Article */}
      <section style={{ marginBottom: 14 }}>
        <SectionHeader label="LATEST ARTICLE" onClick={() => onTabChange("articles")} />
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Sk h={196} r={4} /><Sk h={18} w="80%" /><Sk h={12} w="50%" /><Sk h={12} /><Sk h={12} w="85%" />
          </div>
        ) : hero ? <MobileHeroArticle a={hero} /> : null}
      </section>

      {/* Other Articles */}
      {(loading || others.length > 0) && (
        <section style={{ marginBottom: 14 }}>
          <SectionHeader label="OTHER ARTICLES" onClick={() => onTabChange("articles")} />
          {loading
            ? [1, 2, 3].map(i => (
              <div key={i} style={{ display: "flex", gap: 10, padding: "10px 0", borderBottom: `1px solid ${BORDER}` }}>
                <Sk h={56} w={70} r={3} />
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 7 }}><Sk h={13} w="70%" /><Sk h={10} w="50%" /></div>
              </div>
            ))
            : others.map((a, i) => <MobileArticleItem key={a._id} a={a} noBorder={i === others.length - 1} />)
          }
        </section>
      )}

      {/* Thin divider before podcasts */}
      {!loading && podcasts.length > 0 && <SectionDivider />}

      {/* Podcasts */}
      {(loading || podcasts.length > 0) && (
        <section style={{ marginBottom: 14 }}>
          <SectionHeader label="PODCASTS" onClick={() => onTabChange("podcasts")} />
          {loading
            ? [1, 2].map(i => <div key={i} style={{ height: 96, borderRadius: 6, backgroundColor: CARD_BG, border: `1.5px solid ${BLACK}`, marginBottom: 10, animation: "oksk 1.4s ease-in-out infinite" }} />)
            : podcasts.slice(0, 3).map(p => <MobilePodcastCard key={p._id} p={p} activeSlug={activeSlug} setActiveSlug={setActiveSlug} />)
          }
        </section>
      )}

      {/* Thin divider before shorts */}
      {!loading && shorts.length > 0 && <SectionDivider />}

      {/* Short Reads */}
      {(loading || shorts.length > 0) && (
        <section style={{ marginBottom: 24 }}>
          <SectionHeader label="SHORT READS" onClick={() => onTabChange("shorts")} />
          {loading
            ? <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[1, 2, 3, 4].map(i => <div key={i} style={{ height: 105, borderRadius: 6, backgroundColor: CARD_BG, border: `1.5px solid ${BLACK}`, animation: "oksk 1.4s ease-in-out infinite" }} />)}
              </div>
            : <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {shorts.slice(0, 4).map(s => <MobileShortCard key={s._id} s={s} />)}
              </div>
          }
        </section>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ARTICLES VIEW
// ─────────────────────────────────────────────────────────────
function MobileArticlesView({ articles, loading, onTabChange }: { articles: Article[]; loading: boolean; onTabChange: (t: string) => void }) {
  const [selectedBeat, setSelectedBeat] = useState<string | null>(null);
  const [sortOpt, setSortOpt]           = useState<SortOption>("newest");
  const [trendingList, setTrending]     = useState<Article[]>([]);
  const [trendLoad, setTrendLoad]       = useState(false);

  useEffect(() => {
    if (sortOpt !== "trending") return;
    setTrendLoad(true);
    fetch("/api/articles/trending?type=article")
      .then(r => r.ok ? r.json() : { articles: [] })
      .then(d => setTrending(Array.isArray(d.articles) ? d.articles : []))
      .catch(() => setTrending([]))
      .finally(() => setTrendLoad(false));
  }, [sortOpt]);

  const displayList = (() => {
    if (sortOpt === "trending") {
      const base = selectedBeat ? trendingList.filter(a => a.tags?.includes(selectedBeat)) : trendingList;
      return base;
    }
    const filtered = selectedBeat ? articles.filter(a => a.tags?.includes(selectedBeat)) : articles;
    return [...filtered].sort((a, b) => {
      if (sortOpt === "mostViews")  return ((b as any).views ?? 0) - ((a as any).views ?? 0);
      if (sortOpt === "leastViews") return ((a as any).views ?? 0) - ((b as any).views ?? 0);
      const da = new Date(a.publishedAt ?? 0).getTime();
      const db = new Date(b.publishedAt ?? 0).getTime();
      return sortOpt === "newest" ? db - da : da - db;
    });
  })();

  const isLoading = loading || (sortOpt === "trending" && trendLoad);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", gap: 8 }}>
        <button onClick={() => onTabChange("home")} style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.72rem", color: BLACK, background: "transparent", border: `1px solid ${BORDER}`, borderRadius: 4, padding: "4px 10px", cursor: "pointer", whiteSpace: "nowrap" }}>← Home</button>
        <div style={{ display: "flex", gap: 6, marginLeft: "auto" }}>
          <BeatsFilter selectedBeat={selectedBeat} onBeatChange={setSelectedBeat} />
          <SortDropdown sortOpt={sortOpt} setSortOpt={setSortOpt} />
        </div>
      </div>

      {isLoading
        ? <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {[1, 2, 3, 4].map(i => <div key={i} style={{ display: "flex", flexDirection: "column", gap: 8 }}><Sk h={108} r={3} /><Sk h={13} w="80%" /><Sk h={10} w="50%" /></div>)}
          </div>
        : displayList.length === 0
          ? <p style={{ textAlign: "center", color: MUTED, fontFamily: "'Inter', sans-serif", padding: "48px 0", fontSize: "0.88rem" }}>
              {selectedBeat ? `No articles in "${selectedBeat}" beat.` : "No articles yet."}
            </p>
          : <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, paddingBottom: 20 }}>
              {displayList.map(a => <MobileArticleCard key={a._id} a={a} />)}
            </div>
      }
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// PODCASTS VIEW
// ─────────────────────────────────────────────────────────────
function MobilePodcastsView({ podcasts, loading, onTabChange, activeSlug, setActiveSlug }: {
  podcasts: Article[]; loading: boolean; onTabChange: (t: string) => void;
  activeSlug: string | null; setActiveSlug: (s: string | null) => void;
}) {
  const [selectedBeat, setSelectedBeat] = useState<string | null>(null);
  const filtered = selectedBeat ? podcasts.filter(p => p.tags?.includes(selectedBeat)) : podcasts;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0" }}>
        <button onClick={() => onTabChange("home")} style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.72rem", color: BLACK, background: "transparent", border: `1px solid ${BORDER}`, borderRadius: 4, padding: "4px 10px", cursor: "pointer", whiteSpace: "nowrap" }}>← Home</button>
        <div style={{ marginLeft: "auto" }}><BeatsFilter selectedBeat={selectedBeat} onBeatChange={setSelectedBeat} /></div>
      </div>
      {loading
        ? [1, 2, 3].map(i => <div key={i} style={{ height: 96, borderRadius: 6, backgroundColor: CARD_BG, border: `1.5px solid ${BLACK}`, marginBottom: 10, animation: "oksk 1.4s ease-in-out infinite" }} />)
        : filtered.length === 0
          ? <p style={{ textAlign: "center", color: MUTED, fontFamily: "'Inter', sans-serif", padding: "48px 0", fontSize: "0.88rem" }}>
              {selectedBeat ? `No podcasts in "${selectedBeat}" beat.` : "No podcasts yet."}
            </p>
          : filtered.map(p => <MobilePodcastCard key={p._id} p={p} activeSlug={activeSlug} setActiveSlug={setActiveSlug} />)
      }
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SHORTS VIEW
// ─────────────────────────────────────────────────────────────
function MobileShortsView({ shorts, loading, onTabChange }: { shorts: Article[]; loading: boolean; onTabChange: (t: string) => void }) {
  const [selectedBeat, setSelectedBeat] = useState<string | null>(null);
  const [sortOpt, setSortOpt]           = useState<SortOption>("newest");

  const filtered = selectedBeat ? shorts.filter(s => s.tags?.includes(selectedBeat)) : shorts;
  const sorted   = [...filtered].sort((a, b) => {
    if (sortOpt === "mostViews")  return ((b as any).views ?? 0) - ((a as any).views ?? 0);
    if (sortOpt === "leastViews") return ((a as any).views ?? 0) - ((b as any).views ?? 0);
    const da = new Date(a.publishedAt ?? 0).getTime();
    const db = new Date(b.publishedAt ?? 0).getTime();
    return sortOpt === "newest" ? db - da : da - db;
  });

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", gap: 8 }}>
        <button onClick={() => onTabChange("home")} style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.72rem", color: BLACK, background: "transparent", border: `1px solid ${BORDER}`, borderRadius: 4, padding: "4px 10px", cursor: "pointer", whiteSpace: "nowrap" }}>← Home</button>
        <div style={{ display: "flex", gap: 6, marginLeft: "auto" }}>
          <BeatsFilter selectedBeat={selectedBeat} onBeatChange={setSelectedBeat} />
          <SortDropdown sortOpt={sortOpt} setSortOpt={setSortOpt} />
        </div>
      </div>
      {loading
        ? <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[1, 2, 3, 4].map(i => <div key={i} style={{ height: 105, borderRadius: 6, backgroundColor: CARD_BG, border: `1.5px solid ${BLACK}`, animation: "oksk 1.4s ease-in-out infinite" }} />)}
          </div>
        : sorted.length === 0
          ? <p style={{ textAlign: "center", color: MUTED, fontFamily: "'Inter', sans-serif", padding: "48px 0", fontSize: "0.88rem" }}>
              {selectedBeat ? `No short reads in "${selectedBeat}" beat.` : "No short reads yet."}
            </p>
          : <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, paddingBottom: 20 }}>
              {sorted.map(s => <MobileShortCard key={s._id} s={s} />)}
            </div>
      }
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ROOT
// ─────────────────────────────────────────────────────────────
export default function MobilePage() {
  const [activeTab,  setActiveTab]  = useState("home");
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const { user } = useAuth();

  const uid = (user as any)?.uid ?? "";
  const { articles, podcasts, shorts, loading, error, refetch } = useArticles(uid);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const tab = params.get("tab");
    if (tab) setActiveTab(tab);
  }, []);

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const renderTab = () => {
    switch (activeTab) {
      case "articles": return <MobileArticlesView articles={articles} loading={loading} onTabChange={handleTabChange} />;
      case "podcasts": return <MobilePodcastsView podcasts={podcasts} loading={loading} onTabChange={handleTabChange} activeSlug={activeSlug} setActiveSlug={setActiveSlug} />;
      case "shorts":   return <MobileShortsView shorts={shorts} loading={loading} onTabChange={handleTabChange} />;
      default:         return <MobileHomeView articles={articles} podcasts={podcasts} shorts={shorts} loading={loading} onTabChange={handleTabChange} activeSlug={activeSlug} setActiveSlug={setActiveSlug} />;
    }
  };

  return (
    <div style={{ backgroundColor: BG, minHeight: "100vh" }}>
      <style>{`
        @keyframes oksk { 0%,100%{opacity:1} 50%{opacity:0.45} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }
        * { -webkit-tap-highlight-color: transparent; }
      `}</style>

      <MobileSideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} onTabChange={handleTabChange} onBeatSelect={() => handleTabChange("articles")} />
      <MobileHeader activeTab={activeTab} onTabChange={handleTabChange} onMenuOpen={() => setMenuOpen(true)} />

      <main style={{ padding: "0 16px", animation: "fadeIn 0.22s ease forwards" }} key={activeTab}>
        {error && (
          <div style={{ padding: "10px 14px", borderRadius: 6, backgroundColor: "rgba(192,57,43,0.08)", border: "1px solid rgba(192,57,43,0.2)", fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", color: RED, marginBottom: 16, marginTop: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            {error}
            <button onClick={refetch} style={{ background: BLACK, border: "none", color: "white", padding: "3px 10px", borderRadius: 4, cursor: "pointer", fontSize: "0.72rem", fontFamily: "'Inter', sans-serif" }}>Retry</button>
          </div>
        )}
        {renderTab()}
      </main>

      <MobileFooter />
    </div>
  );
}
