"use client";

import { useState, useEffect, useRef, memo, useCallback } from "react";
import Link from "next/link";
import MobileHeader from "@/components/mobile/MobileHeader";
import MobileSideMenu from "@/components/mobile/MobileSideMenu";
import MobileFooter from "@/components/mobile/MobileFooter";
import BeatsFilter from "@/components/mobile/BeatsFilter";
import { useArticles, type Article } from "@/hooks/useArticles";
import { useAuth } from "@/context/AuthContext";

const RED      = "#D92323";
const ACCENT   = "#1B2A47";
const POD_BG   = "#e1dfe8";
const SHORT_BG = "#fae8c1";

function Sk({ h = 16, w = "100%", r = 6 }: { h?: number; w?: string | number; r?: number }) {
  return <div style={{ height: h, width: w as any, borderRadius: r, backgroundColor: "#e8e5e0", animation: "sk 1.4s ease-in-out infinite" }} />;
}

const SectionHeader = memo(function SectionHeader({ label, onClick }: { label: string; onClick?: () => void }) {
  return (
    <button onClick={onClick} style={{ background: "none", border: "none", cursor: onClick ? "pointer" : "default", fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: "0.88rem", letterSpacing: "0.06em", textTransform: "uppercase", color: ACCENT, padding: "0 0 12px", display: "flex", alignItems: "center", gap: 4 }}>
      {label} →
    </button>
  );
});

const MobileHeroArticle = memo(function MobileHeroArticle({ a }: { a: Article }) {
  const date = a.publishedAt ? new Date(a.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "";
  return (
    <Link href={`/article/${a.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
      <article style={{ marginBottom: 4 }}>
        {a.coverImage
          ? <img src={a.coverImage} alt={a.title} loading="lazy" decoding="async" style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", borderRadius: 8, display: "block", marginBottom: 12 }} />
          : <div style={{ width: "100%", aspectRatio: "16/9", backgroundColor: "#CFCBC3", borderRadius: 8, marginBottom: 12 }} />}
        {a.tags?.length > 0 && (
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 6 }}>
            {a.tags.map(t => <span key={t} style={{ fontSize: "0.6rem", fontWeight: 700, color: RED, fontFamily: "'Inter', sans-serif", textTransform: "uppercase", letterSpacing: "0.05em" }}>{t}</span>)}
          </div>
        )}
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.5rem", lineHeight: 1.15, color: "var(--text-main)", margin: "0 0 8px" }}>{a.title}</h2>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", color: "var(--text-muted)", marginBottom: 8 }}>{date} · {a.author}</div>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.65, margin: "0 0 10px" }}>{a.excerpt}</p>
        <span style={{ display: "inline-block", padding: "4px 14px", borderRadius: 20, backgroundColor: "rgba(211,139,136,0.15)", color: "#a94438", fontSize: "0.7rem", fontWeight: 700, fontFamily: "'Inter', sans-serif" }}>Read Further</span>
      </article>
    </Link>
  );
});

const MobileArticleCard = memo(function MobileArticleCard({ a }: { a: Article }) {
  const date = a.publishedAt ? new Date(a.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "";
  return (
    <Link href={`/article/${a.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
      <article style={{ display: "flex", gap: 12, padding: "13px 0", borderBottom: "1px solid var(--border)" }}>
        {a.coverImage
          ? <img src={a.coverImage} alt={a.title} loading="lazy" decoding="async" style={{ width: 88, height: 66, objectFit: "cover", borderRadius: 6, flexShrink: 0 }} />
          : <div style={{ width: 88, height: 66, backgroundColor: "#CFCBC3", borderRadius: 6, flexShrink: 0 }} />}
        <div style={{ flex: 1, minWidth: 0 }}>
          {a.tags?.length > 0 && (
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 3 }}>
              {a.tags.slice(0, 2).map(t => <span key={t} style={{ fontSize: "0.58rem", fontWeight: 700, color: RED, fontFamily: "'Inter', sans-serif", textTransform: "uppercase" }}>{t}</span>)}
            </div>
          )}
          <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "0.92rem", lineHeight: 1.22, color: "var(--text-main)", margin: "0 0 4px", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2 } as any}>{a.title}</h3>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ fontSize: "0.63rem", color: "var(--text-muted)", fontFamily: "'Inter', sans-serif" }}>{date}</span>
            <span style={{ fontSize: "0.6rem", color: "var(--text-muted)" }}>·</span>
            <span style={{ fontSize: "0.63rem", color: "var(--text-muted)", fontFamily: "'Inter', sans-serif" }}>{a.author}</span>
            <span style={{ marginLeft: "auto", padding: "2px 8px", borderRadius: 20, backgroundColor: "rgba(211,139,136,0.15)", color: "#a94438", fontSize: "0.58rem", fontWeight: 700, fontFamily: "'Inter', sans-serif", flexShrink: 0 }}>Read</span>
          </div>
        </div>
      </article>
    </Link>
  );
});

const MobilePodcastCard = memo(function MobilePodcastCard({ p, activeSlug, setActiveSlug }: { p: Article; activeSlug: string | null; setActiveSlug: (s: string | null) => void }) {
  const audioRef  = useRef<HTMLAudioElement | null>(null);
  const seekRef   = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [current,  setCurrent]  = useState("0:00");
  const [totalDur, setTotalDur] = useState(p.duration ?? "0:00");
  const isPlaying = activeSlug === p.slug;

  // Lazy: only create Audio on first user interaction
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
      const audio = audioRef.current;
      if (!audio) return;
      if (isPlaying) { audio.pause(); setActiveSlug(null); }
      else { audio.play().catch(() => {}); setActiveSlug(p.slug); }
    }, 0);
  }, [p.audioUrl, p.slug, isPlaying, ensureAudio, setActiveSlug]);

  const handleSeek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault(); e.stopPropagation();
    const audio = audioRef.current;
    if (!audio || !seekRef.current) return;
    const rect = seekRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.currentTime = ratio * (audio.duration || 0);
    setProgress(ratio * 100);
  }, []);

  return (
    <Link href={`/podcasts/${p.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
      <div style={{ backgroundColor: POD_BG, borderRadius: 10, padding: 12, display: "flex", gap: 12, alignItems: "center", border: "1px solid rgba(27,42,71,0.08)", marginBottom: 10 }}>
        {p.coverImage
          ? <img src={p.coverImage} alt={p.title} loading="lazy" decoding="async" style={{ width: 70, height: 70, objectFit: "cover", borderRadius: 6, flexShrink: 0 }} />
          : <div style={{ width: 70, height: 70, backgroundColor: "rgba(27,42,71,0.1)", borderRadius: 6, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem" }}>🎙</div>}
        <div style={{ flex: 1, minWidth: 0 }}>
          {p.tags?.length > 0 && (
            <div style={{ fontSize: "0.58rem", fontWeight: 800, color: RED, fontFamily: "'Inter', sans-serif", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>
              {p.tags[0]}{p.episode ? ` → ${p.episode}` : ""}
            </div>
          )}
          <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "0.9rem", lineHeight: 1.2, color: "var(--text-main)", margin: "0 0 7px", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2 } as any}>{p.title}</h3>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button onClick={togglePlay} style={{ width: 26, height: 26, borderRadius: "50%", backgroundColor: "var(--text-main)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {isPlaying
                ? <svg width="8" height="8" viewBox="0 0 24 24" fill="white"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                : <svg width="8" height="8" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>}
            </button>
            <div ref={seekRef} onClick={handleSeek} style={{ flex: 1, height: 4, backgroundColor: "rgba(27,42,71,0.15)", borderRadius: 2, cursor: "pointer", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${progress}%`, backgroundColor: RED, borderRadius: 2, transition: "width 0.25s linear" }} />
            </div>
            <span style={{ fontSize: "0.58rem", color: "var(--text-muted)", fontFamily: "'Inter', sans-serif", whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }}>{current} / {totalDur}</span>
          </div>
        </div>
      </div>
    </Link>
  );
});

const MobileShortCard = memo(function MobileShortCard({ s }: { s: Article }) {
  return (
    <Link href={`/shorts/${s.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
      <div style={{ backgroundColor: SHORT_BG, borderRadius: 10, padding: 12, border: "1px solid rgba(211,139,136,0.15)" }}>
        {s.tags?.length > 0 && (
          <div style={{ display: "flex", gap: 4, alignItems: "center", marginBottom: 5 }}>
            <span style={{ fontSize: "0.58rem", fontWeight: 700, color: RED, fontFamily: "'Inter', sans-serif", textTransform: "uppercase" }}>{s.tags[0]}</span>
            {s.readTime && <span style={{ fontSize: "0.58rem", color: "var(--text-muted)", fontFamily: "'Inter', sans-serif", marginLeft: "auto" }}>{s.readTime} Read</span>}
          </div>
        )}
        <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "0.87rem", lineHeight: 1.22, color: "var(--text-main)", margin: 0, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 3 } as any}>{s.title}</h3>
      </div>
    </Link>
  );
});

function SortDropdown({ sortDir, setSortDir }: { sortDir: "newest" | "oldest"; setSortDir: (d: "newest" | "oldest") => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <button onClick={() => setOpen(o => !o)} style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 12px", borderRadius: 6, border: "1.5px solid var(--border)", backgroundColor: "white", fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", fontWeight: 600, color: "var(--text-main)", cursor: "pointer" }}>
        Sort <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
      </button>
      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 6px)", right: 0, backgroundColor: "white", borderRadius: 10, border: "1px solid var(--border)", boxShadow: "0 8px 24px rgba(0,0,0,0.1)", zIndex: 40, minWidth: 120, overflow: "hidden" }}>
          {(["newest", "oldest"] as const).map((opt, i) => (
            <button key={opt} onClick={() => { setSortDir(opt); setOpen(false); }} style={{ display: "block", width: "100%", padding: "10px 14px", background: "none", border: "none", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: "0.82rem", fontWeight: sortDir === opt ? 700 : 400, color: sortDir === opt ? ACCENT : "var(--text-main)", backgroundColor: sortDir === opt ? "rgba(27,42,71,0.05)" : "transparent", borderBottom: i === 0 ? "1px solid #f5f5f3" : "none", textAlign: "left", textTransform: "capitalize" }}>
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function MobileArticlesView({ articles, loading }: { articles: Article[]; loading: boolean }) {
  const [selectedBeat, setSelectedBeat] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"newest" | "oldest">("newest");

  const filtered = selectedBeat ? articles.filter(a => a.tags?.includes(selectedBeat)) : articles;
  const sorted = [...filtered].sort((a, b) => {
    const da = new Date(a.publishedAt ?? 0).getTime();
    const db = new Date(b.publishedAt ?? 0).getTime();
    return sortDir === "newest" ? db - da : da - db;
  });

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 0", borderBottom: "1px solid var(--border)", marginBottom: 4 }}>
        <div style={{ flex: 1 }} />
        <BeatsFilter selectedBeat={selectedBeat} onBeatChange={setSelectedBeat} />
        <SortDropdown sortDir={sortDir} setSortDir={setSortDir} />
      </div>
      {loading
        ? [1,2,3,4].map(i => (
            <div key={i} style={{ display: "flex", gap: 12, padding: "13px 0", borderBottom: "1px solid var(--border)" }}>
              <Sk h={66} w={88} r={6} />
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 7 }}><Sk h={12} w="80%" /><Sk h={10} w="50%" /><Sk h={10} w="40%" /></div>
            </div>
          ))
        : sorted.length === 0
          ? <p style={{ textAlign: "center", color: "#aaa", fontFamily: "'Inter', sans-serif", padding: "48px 0", fontSize: "0.88rem" }}>{selectedBeat ? `No articles in "${selectedBeat}" beat.` : "No articles yet."}</p>
          : sorted.map(a => <MobileArticleCard key={a._id} a={a} />)
      }
    </div>
  );
}

function MobilePodcastsView({ podcasts, loading, activeSlug, setActiveSlug }: { podcasts: Article[]; loading: boolean; activeSlug: string | null; setActiveSlug: (s: string | null) => void }) {
  const [selectedBeat, setSelectedBeat] = useState<string | null>(null);
  const filtered = selectedBeat ? podcasts.filter(p => p.tags?.includes(selectedBeat)) : podcasts;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", padding: "10px 0", borderBottom: "1px solid var(--border)", marginBottom: 8 }}>
        <BeatsFilter selectedBeat={selectedBeat} onBeatChange={setSelectedBeat} />
      </div>
      {loading
        ? [1,2,3].map(i => <div key={i} style={{ height: 82, borderRadius: 10, backgroundColor: POD_BG, marginBottom: 10, animation: "sk 1.4s ease-in-out infinite" }} />)
        : filtered.length === 0
          ? <p style={{ textAlign: "center", color: "#aaa", fontFamily: "'Inter', sans-serif", padding: "48px 0", fontSize: "0.88rem" }}>{selectedBeat ? `No podcasts in "${selectedBeat}" beat.` : "No podcasts yet."}</p>
          : filtered.map(p => <MobilePodcastCard key={p._id} p={p} activeSlug={activeSlug} setActiveSlug={setActiveSlug} />)
      }
    </div>
  );
}

function MobileShortsView({ shorts, loading }: { shorts: Article[]; loading: boolean }) {
  const [selectedBeat, setSelectedBeat] = useState<string | null>(null);
  const filtered = selectedBeat ? shorts.filter(s => s.tags?.includes(selectedBeat)) : shorts;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", padding: "10px 0", borderBottom: "1px solid var(--border)", marginBottom: 8 }}>
        <BeatsFilter selectedBeat={selectedBeat} onBeatChange={setSelectedBeat} />
      </div>
      {loading
        ? <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>{[1,2,3,4].map(i => <div key={i} style={{ height: 100, borderRadius: 10, backgroundColor: SHORT_BG, animation: "sk 1.4s ease-in-out infinite" }} />)}</div>
        : filtered.length === 0
          ? <p style={{ textAlign: "center", color: "#aaa", fontFamily: "'Inter', sans-serif", padding: "48px 0", fontSize: "0.88rem" }}>{selectedBeat ? `No short reads in "${selectedBeat}" beat.` : "No short reads yet."}</p>
          : <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>{filtered.map(s => <MobileShortCard key={s._id} s={s} />)}</div>
      }
    </div>
  );
}

function MobileHomeView({ articles, podcasts, shorts, loading, onTabChange, activeSlug, setActiveSlug }: { articles: Article[]; podcasts: Article[]; shorts: Article[]; loading: boolean; onTabChange: (t: string) => void; activeSlug: string | null; setActiveSlug: (s: string | null) => void }) {
  const hero   = articles[0];
  const others = articles.slice(1, 4);

  return (
    <div>
      <section style={{ marginBottom: 24 }}>
        <SectionHeader label="Latest Article" onClick={() => onTabChange("articles")} />
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}><Sk h={200} r={8} /><Sk h={22} w="80%" /><Sk h={14} w="50%" /><Sk h={14} /><Sk h={14} w="90%" /></div>
        ) : hero ? <MobileHeroArticle a={hero} /> : null}
      </section>

      {(loading || others.length > 0) && (
        <section style={{ marginBottom: 24 }}>
          <SectionHeader label="Other Articles" onClick={() => onTabChange("articles")} />
          {loading
            ? [1,2,3].map(i => <div key={i} style={{ display: "flex", gap: 12, padding: "13px 0", borderBottom: "1px solid var(--border)" }}><Sk h={66} w={88} r={6} /><div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 7 }}><Sk h={12} w="70%" /><Sk h={10} w="50%" /></div></div>)
            : others.map(a => <MobileArticleCard key={a._id} a={a} />)}
        </section>
      )}

      {(loading || podcasts.length > 0) && (
        <section style={{ marginBottom: 24 }}>
          <SectionHeader label="Latest Podcasts" onClick={() => onTabChange("podcasts")} />
          {loading
            ? [1,2].map(i => <div key={i} style={{ height: 82, borderRadius: 10, backgroundColor: POD_BG, marginBottom: 10, animation: "sk 1.4s ease-in-out infinite" }} />)
            : podcasts.slice(0, 3).map(p => <MobilePodcastCard key={p._id} p={p} activeSlug={activeSlug} setActiveSlug={setActiveSlug} />)}
        </section>
      )}

      {(loading || shorts.length > 0) && (
        <section style={{ marginBottom: 24 }}>
          <SectionHeader label="Short Reads" onClick={() => onTabChange("shorts")} />
          {loading
            ? <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>{[1,2,3,4].map(i => <div key={i} style={{ height: 100, borderRadius: 10, backgroundColor: SHORT_BG, animation: "sk 1.4s ease-in-out infinite" }} />)}</div>
            : <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>{shorts.slice(0, 4).map(s => <MobileShortCard key={s._id} s={s} />)}</div>}
        </section>
      )}
    </div>
  );
}

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
      case "articles": return <MobileArticlesView articles={articles} loading={loading} />;
      case "podcasts": return <MobilePodcastsView podcasts={podcasts} loading={loading} activeSlug={activeSlug} setActiveSlug={setActiveSlug} />;
      case "shorts":   return <MobileShortsView shorts={shorts} loading={loading} />;
      default:         return <MobileHomeView articles={articles} podcasts={podcasts} shorts={shorts} loading={loading} onTabChange={handleTabChange} activeSlug={activeSlug} setActiveSlug={setActiveSlug} />;
    }
  };

  return (
    <div style={{ backgroundColor: "var(--bg)", minHeight: "100vh" }}>
      <style>{`
        @keyframes sk { 0%,100%{opacity:1} 50%{opacity:0.45} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }
        * { -webkit-tap-highlight-color: transparent; }
      `}</style>

      <MobileSideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} onTabChange={handleTabChange} onBeatSelect={() => handleTabChange("articles")} />
      <MobileHeader activeTab={activeTab} onTabChange={handleTabChange} onMenuOpen={() => setMenuOpen(true)} />

      <main style={{ padding: "16px 16px 0", animation: "fadeIn 0.22s ease forwards" }} key={activeTab}>
        {error && (
          <div style={{ padding: "10px 14px", borderRadius: 8, backgroundColor: "rgba(217,35,35,0.08)", border: "1px solid rgba(217,35,35,0.2)", fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", color: "#c0392b", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            {error}
            <button onClick={refetch} style={{ background: ACCENT, border: "none", color: "white", padding: "3px 10px", borderRadius: 5, cursor: "pointer", fontSize: "0.75rem", fontFamily: "'Inter', sans-serif" }}>Retry</button>
          </div>
        )}
        {renderTab()}
      </main>

      <MobileFooter />
    </div>
  );
}
