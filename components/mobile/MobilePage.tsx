"use client";

import { useState, useEffect, useRef, memo, useCallback } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Heart, Bookmark, Share, ExternalLink, MoveLeft, MoveRight, Play, Pause, Loader2, Maximize2, BookOpen } from "lucide-react";
import MobileHeader from "@/components/mobile/MobileHeader";
import MobileSideMenu from "@/components/mobile/MobileSideMenu";
import MobileFooter from "@/components/mobile/MobileFooter";
import { MobileAboutView, MobileGrievanceView, MobileTeamView, MobileContactView } from "@/components/mobile/MobileInfoPages";
import BeatsFilter from "@/components/mobile/BeatsFilter";
import { useArticles, type Article } from "@/hooks/useArticles";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/auth/firebase";

const RED = "#c0392b";
const BLACK = "#111111";
const BG = "#f5f0eb";
const WHITE = "#ffffff";
const BORDER = "#e0d8d0";
const MUTED = "#666666";
const LIGHT_TEXT = "#999999";
const CARD_BG = WHITE;

// ── Skeleton ──────────────────────────────────────────────────
function Sk({ h = 16, w = "100%", r = 4 }: { h?: number; w?: string | number; r?: number }) {
  return <div style={{ height: h, width: w as any, borderRadius: r }} className="bg-[#e0d8d0] animate-[oksk_1.4s_ease-in-out_infinite]" />;
}

// ── Section header ────────────────────────────────────────────
const SectionHeader = memo(function SectionHeader({ label, onClick }: { label: string; onClick?: () => void }) {
  return (
    <button onClick={onClick} className={`bg-none border-none ${onClick ? "cursor-pointer" : "cursor-default"} font-sans font-bold text-[1rem] tracking-[0.12em] uppercase text-[#111111] pt-3 pb-2 flex items-baseline gap-[3px]`}>
      {label}<span className="text-[1.5rem]">→</span>
    </button>
  );
});

// ── Tag chip — small pill/chip style with background ─
// ── Tag chip — small pill/chip style with background ─
function Tag({ label }: { label: string }) {
  return (
    <span className="inline-block px-[6px] py-[1.5px] rounded-full font-sans text-[0.52rem] font-bold text-[#c0392b] uppercase tracking-[0.04em] bg-[#c0392b]/10 whitespace-nowrap">
      {label}
    </span>
  );
}

// ── Read pill — desktop style ─────────────────────────────────
// ── Read pill — desktop style ─────────────────────────────────

// ── Thin section divider (like desktop) ───────────────────────
// ── Thin section divider (like desktop) ───────────────────────
function SectionDivider() {
  return <hr className="border-none border-t border-[#e0d8d0] my-1" />;
}

// ── HERO ARTICLE ──────────────────────────────────────────────
const MobileHeroArticle = memo(function MobileHeroArticle({ a }: { a: Article }) {
  const date = a.publishedAt
    ? new Date(a.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
    : "";
  return (
    <Link href={`/article/${a.slug}`} className="no-underline text-inherit block">
      <article className="mb-1">
        {a.coverImage
          ? <img src={a.coverImage} alt={a.title} loading="lazy" decoding="async" className="w-full h-auto rounded-[4px] block mb-[10px] bg-[#2a2a2a]" />
          : <div className="w-full h-[196px] bg-[#2a2a2a] rounded-[4px] mb-[10px]" />
        }

        {a.tags?.length > 0 && (
          <div className="flex gap-[6px] flex-wrap mb-[5px]">
            {a.tags.map(t => <Tag key={t} label={t} />)}
          </div>
        )}

        <h3 className="font-serif text-[1.25rem] font-normal text-[#111111] m-0 mb-[5px] leading-[1.25]">
          {a.title}
        </h3>

        <div className="flex items-center gap-[6px] font-sans text-[0.68rem] text-[#666666] mb-2">
          {date && <span>{date}</span>}
          {date && a.author && <span className="opacity-40">·</span>}
          {a.author && <span>{a.author}</span>}
        </div>

        {a.excerpt && (
          <p className="font-serif text-[0.88rem] text-[#666666] leading-[1.6] m-0 mb-[10px]">
            {a.excerpt.slice(0, 130)}{a.excerpt.length > 130 ? "..." : ""}
          </p>
        )}
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
    <Link href={`/article/${a.slug}`} className="no-underline text-inherit">
      <article className={`flex gap-[10px] py-[10px] items-start ${noBorder ? "border-none" : "border-b border-[#e0d8d0]"}`}>
        {a.coverImage
          ? <img src={a.coverImage} alt={a.title} loading="lazy" className="w-[70px] h-[56px] object-cover rounded-[3px] flex-shrink-0 bg-[#2a2a2a]" />
          : <div className="w-[70px] h-[56px] bg-[#2a2a2a] rounded-[3px] flex-shrink-0" />
        }
        <div className="flex-1 min-w-0">
          {a.tags?.length > 0 && (
            <div className="flex gap-1 flex-wrap mb-1">
              {a.tags.slice(0, 2).map(t => <Tag key={t} label={t} />)}
            </div>
          )}
          {/* Normal weight */}
          <h4 className="font-serif text-[1.05rem] font-normal text-[#111111] leading-[1.3] mb-1">
            {a.title}
          </h4>
          <div className="flex justify-between items-center font-sans text-[0.63rem] text-[#666666]">
            <span>{date} · {a.author}</span>
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
    <Link href={`/article/${a.slug}`} className="no-underline text-inherit block">
      <article className="bg-[#f5f0eb]">
        {a.coverImage
          ? <img src={a.coverImage} alt={a.title} loading="lazy" className="w-full aspect-video object-cover rounded-[3px] block bg-[#2a2a2a]" />
          : <div className="w-full aspect-video bg-[#2a2a2a] rounded-[3px]" />
        }
        <h3 className="font-serif text-[0.95rem] font-normal text-[#111111] mt-[6px] mb-1 leading-[1.28]">
          {a.title}
        </h3>
        <div className="flex justify-between items-center font-sans text-[0.6rem] text-[#666666] mb-1">
          <span>{date} · {a.author}</span>
        </div>
        {a.tags?.length > 0 && (
          <div className="flex gap-1 flex-wrap">
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
  const seekRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [current, setCurrent] = useState("0:00");
  const [totalDur, setTotalDur] = useState(p.duration ?? "0:00");
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [playing, setPlaying] = useState(false);
  
  const isExpanded = activeSlug === p.slug;

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
    audio.onended = () => {
      setPlaying(false);
      setActiveSlug(null);
    };
  }, [p.audioUrl, setActiveSlug]);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!isExpanded && audio) {
      audio.pause();
      setPlaying(false);
    }
  }, [isExpanded]);

  const togglePlay = useCallback(() => {
    if (!p.audioUrl) return;
    ensureAudio();
    setTimeout(() => {
      const audio = audioRef.current;
      if (!audio) return;
      if (playing) {
        audio.pause();
        setPlaying(false);
      } else {
        audio.play().catch(() => { });
        setPlaying(true);
        setActiveSlug(p.slug);
      }
    }, 0);
  }, [p.audioUrl, p.slug, playing, ensureAudio, setActiveSlug]);

  const skip = useCallback((e: React.MouseEvent, sec: number) => {
    e.stopPropagation();
    if (audioRef.current) audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime + sec);
  }, []);

  const handleSeek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio || !seekRef.current) return;
    const rect = seekRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.currentTime = ratio * (audio.duration || 0);
    setProgress(ratio * 100);
  }, []);

  const handleSave = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (saving) return;
    setSaving(true);
    try {
      const token = await auth.currentUser?.getIdToken();
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
  }, [p.slug, saving]);

  const handleShare = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/podcasts/${p.slug}`;
    if (navigator.share) navigator.share({ title: p.title, url }).catch(() => { });
    else navigator.clipboard.writeText(url).catch(() => { });
  }, [p.slug, p.title]);

  return (
    <div
      onClick={togglePlay}
      className="bg-transparent border-[1.5px] border-[#111111] rounded-[12px] p-[16px] mb-[12px] cursor-pointer select-none transition-all duration-200 ease-in-out"
    >
      {/* Top section: Image + Title */}
      <div className="flex gap-3 items-start">
        {p.coverImage
          ? <img src={p.coverImage} alt={p.title} loading="lazy"
            className="w-[84px] h-[84px] object-cover rounded-[8px] flex-shrink-0" />
          : <div className="w-[84px] h-[84px] bg-[#2a2a2a] rounded-[8px] flex-shrink-0 flex items-center justify-center text-[1.4rem]">🎙</div>
        }
        <div className="flex-1 min-w-0">
          {showTag && p.tags?.length > 0 && (
            <div className="flex gap-[6px] flex-wrap mb-[6px]">
              {p.tags.slice(0, 2).map(t => <Tag key={t} label={t} />)}
            </div>
          )}
          <h4 className="font-serif text-[1.05rem] font-normal text-[#111111] leading-[1.3] m-0">{p.title}</h4>
          {!isExpanded && (
            <span className="font-sans text-[0.7rem] text-[#666666] mt-1 block">
              {totalDur}
            </span>
          )}
        </div>
        {!isExpanded && (
          <button
            onClick={(e) => { e.stopPropagation(); togglePlay(); }}
            className="w-[40px] h-[40px] rounded-full bg-[#111111] border-none cursor-pointer flex items-center justify-center flex-shrink-0 self-center"
          >
            <Play size={18} color="white" fill="white" className="ml-[2px]" />
          </button>
        )}
      </div>

      {isExpanded && (
        <div className="mt-5">
          {/* Playback Row */}
          <div className="flex items-center justify-center gap-8 mb-4">
            <button onClick={(e) => skip(e, -10)} className="bg-none border-none cursor-pointer text-[#111111] flex items-center gap-[6px] p-0 font-sans text-[0.85rem] font-medium">
              <MoveLeft size={20} /> 10
            </button>
            <button onClick={(e) => { e.stopPropagation(); togglePlay(); }} className="w-[52px] h-[52px] rounded-full bg-[#111111] border-none cursor-pointer flex items-center justify-center">
              {playing ? <Pause size={24} color="white" fill="white" /> : <Play size={24} color="white" fill="white" className="ml-[3px]" />}
            </button>
            <button onClick={(e) => skip(e, 10)} className="bg-none border-none cursor-pointer text-[#111111] flex items-center gap-[6px] p-0 font-sans text-[0.85rem] font-medium">
              10 <MoveRight size={20} />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="w-[70%] mx-auto mb-3">
            <div ref={seekRef} onClick={handleSeek} className="w-full h-[3px] bg-[#d9d5ce] rounded-[1.5px] cursor-pointer relative">
              <div style={{ width: `${progress}%` }} className="h-full bg-[#c0392b] rounded-[1.5px] transition-[width] duration-200 linear" />
            </div>
          </div>

          {/* Bottom Interactions Bar */}
          <div className="flex items-center justify-between px-[4px]">
            <div className="flex gap-4">
              <button
                onClick={(e) => { e.stopPropagation(); setLiked(l => !l); }}
                className={`bg-none border-none cursor-pointer p-0 flex ${liked ? "text-[#c0392b]" : "text-[#111111]"}`}
              >
                <Heart size={22} fill={liked ? "currentColor" : "none"} strokeWidth={1.5} />
              </button>
              <button
                onClick={handleShare}
                className="bg-none border-none cursor-pointer p-0 text-[#111111] flex"
              >
                <Share size={20} strokeWidth={1.5} />
              </button>
            </div>

            <div className="font-sans text-[0.9rem] font-medium text-[#111111] tabular-nums">
              {current} / {totalDur}
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleSave}
                className={`bg-none border-none cursor-pointer p-0 flex ${saved ? "text-[#c0392b]" : "text-[#111111]"} ${saving ? "opacity-50" : "opacity-100"}`}
              >
                <Bookmark size={22} fill={saved ? "currentColor" : "none"} strokeWidth={1.5} />
              </button>
              <Link
                href={`/podcasts/${p.slug}`}
                onClick={(e) => e.stopPropagation()}
                className="text-[#111111] flex no-underline"
              >
                <Maximize2 size={20} strokeWidth={1.5} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});


// ── SHORT ARTICLE CARD ────────────────────────────────────────
const MobileShortCard = memo(function MobileShortCard({ s }: { s: Article }) {
  const views = (s as any).views || 0;
  return (
    <Link href={`/shorts/${s.slug}`} className="no-underline text-inherit">
      <article className="bg-transparent border-[1.5px] border-[#111111] rounded-[6px] p-[10px] flex flex-col min-h-[105px]">
        {/* Tags top-left */}
        {s.tags?.length > 0 && (
          <div className="flex gap-1 flex-wrap mb-1">
            {s.tags.slice(0, 2).map(t => <Tag key={t} label={t} />)}
          </div>
        )}
        {/* Normal weight title */}
        <h4 className="font-sans text-[0.76rem] font-medium text-[#111111] leading-[1.35] mb-auto pb-2">
          {s.title}
        </h4>
        {/* Bottom: duration left, views right */}
        <div className="flex justify-between items-center mt-auto">
          <span className="font-sans text-[0.6rem] text-[#999999] flex items-center gap-[3px]">
            <BookOpen size={10} />
            {s.readTime || "2"} minute read
          </span>
          <span className="font-sans text-[0.6rem] text-[#999999] flex items-center gap-[3px]">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
            </svg>
            {views.toLocaleString()} {views === 1 ? 'view' : 'views'}
          </span>
        </div>
      </article>
    </Link>
  );
});

import SortFilter, { type SortOption } from "@/components/mobile/SortFilter";


// ─────────────────────────────────────────────────────────────
// HOME VIEW
// ─────────────────────────────────────────────────────────────
function MobileHomeView({ articles, podcasts, shorts, loading, onTabChange, activeSlug, setActiveSlug }: {
  articles: Article[]; podcasts: Article[]; shorts: Article[]; loading: boolean;
  onTabChange: (t: string) => void; activeSlug: string | null; setActiveSlug: (s: string | null) => void;
}) {
  const hero = articles[0];
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
        <section className="mb-[14px]">
          <SectionHeader label="OTHER ARTICLES" onClick={() => onTabChange("articles")} />
          {loading
            ? [1, 2, 3].map(i => (
              <div key={i} className="flex gap-[10px] py-[10px] border-b border-[#e0d8d0]">
                <Sk h={56} w={70} r={3} />
                <div className="flex-1 flex flex-col gap-[7px]"><Sk h={13} w="70%" /><Sk h={10} w="50%" /></div>
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
        <section className="mb-[14px]">
          <SectionHeader label="PODCASTS" onClick={() => onTabChange("podcasts")} />
          {loading
            ? [1, 2].map(i => <div key={i} className="h-[96px] rounded-[6px] bg-white border-[1.5px] border-[#111111] mb-[10px] animate-[oksk_1.4s_ease-in-out_infinite]" />)
            : podcasts.slice(0, 3).map(p => <MobilePodcastCard key={p._id} p={p} activeSlug={activeSlug} setActiveSlug={setActiveSlug} />)
          }
        </section>
      )}

      {/* Thin divider before shorts */}
      {!loading && shorts.length > 0 && <SectionDivider />}

      {/* Short Articles */}
      {(loading || shorts.length > 0) && (
        <section className="mb-[24px]">
          <SectionHeader label="SHORT ARTICLES" onClick={() => onTabChange("shorts")} />
          {loading
            ? <div className="grid grid-cols-2 gap-[10px]">
              {[1, 2, 3, 4].map(i => <div key={i} className="h-[105px] rounded-[6px] bg-white border-[1.5px] border-[#111111] animate-[oksk_1.4s_ease-in-out_infinite]" />)}
            </div>
            : <div className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-[10px]">
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
  const [sortOpt, setSortOpt] = useState<SortOption>("newest");
  const [trendingList, setTrending] = useState<Article[]>([]);
  const [trendLoad, setTrendLoad] = useState(false);

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
      if (sortOpt === "mostViews") return ((b as any).views ?? 0) - ((a as any).views ?? 0);
      if (sortOpt === "leastViews") return ((a as any).views ?? 0) - ((b as any).views ?? 0);
      const da = new Date(a.publishedAt ?? 0).getTime();
      const db = new Date(b.publishedAt ?? 0).getTime();
      return sortOpt === "newest" ? db - da : da - db;
    });
  })();

  const isLoading = loading || (sortOpt === "trending" && trendLoad);

  return (
    <div>
      <div className="flex items-center justify-between py-[10px] gap-2">
        <button onClick={() => onTabChange("home")} style={{ background: "none", border: "1px solid rgb(221, 221, 221)", borderRadius: "6px", padding: "5px 12px", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "4px", color: BLACK, whiteSpace: "nowrap" }}><MoveLeft size={14} /> Back</button>
        <div className="flex gap-[6px] ml-auto">
          <BeatsFilter selectedBeat={selectedBeat} onBeatChange={setSelectedBeat} />
          <SortFilter sortOpt={sortOpt} setSortOpt={setSortOpt} />
        </div>
      </div>

      {isLoading
        ? <div className="grid grid-cols-2 gap-[14px]">
          {[1, 2, 3, 4].map(i => <div key={i} className="flex flex-col gap-2"><Sk h={108} r={3} /><Sk h={13} w="80%" /><Sk h={10} w="50%" /></div>)}
        </div>
        : displayList.length === 0
          ? <p className="text-center text-[#666666] font-sans py-[48px] text-[0.88rem]">
            {selectedBeat ? `No articles in "${selectedBeat}" beat.` : "No articles yet."}
          </p>
          : <div className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-[14px] pb-5">
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
      <div className="flex items-center justify-between py-[10px]">
        <button onClick={() => onTabChange("home")} style={{ background: "none", border: "1px solid rgb(221, 221, 221)", borderRadius: "6px", padding: "5px 12px", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "4px", color: BLACK, whiteSpace: "nowrap" }}><MoveLeft size={14} /> Back</button>
        <div className="ml-auto"><BeatsFilter selectedBeat={selectedBeat} onBeatChange={setSelectedBeat} /></div>
      </div>
      {loading
        ? [1, 2, 3].map(i => <div key={i} className="h-[96px] rounded-[6px] bg-white border-[1.5px] border-[#111111] mb-[10px] animate-[oksk_1.4s_ease-in-out_infinite]" />)
        : filtered.length === 0
          ? <p className="text-center text-[#666666] font-sans py-[48px] text-[0.88rem]">
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
  const [sortOpt, setSortOpt] = useState<SortOption>("newest");

  const filtered = selectedBeat ? shorts.filter(s => s.tags?.includes(selectedBeat)) : shorts;
  const sorted = [...filtered].sort((a, b) => {
    if (sortOpt === "mostViews") return ((b as any).views ?? 0) - ((a as any).views ?? 0);
    if (sortOpt === "leastViews") return ((a as any).views ?? 0) - ((b as any).views ?? 0);
    const da = new Date(a.publishedAt ?? 0).getTime();
    const db = new Date(b.publishedAt ?? 0).getTime();
    return sortOpt === "newest" ? db - da : da - db;
  });

  return (
    <div>
      <div className="flex items-center justify-between py-[10px] gap-2">
        <button onClick={() => onTabChange("home")} style={{ background: "none", border: "1px solid rgb(221, 221, 221)", borderRadius: "6px", padding: "5px 12px", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "4px", color: BLACK, whiteSpace: "nowrap" }}><MoveLeft size={14} /> Back</button>
        <div className="flex gap-[6px] ml-auto">
          <BeatsFilter selectedBeat={selectedBeat} onBeatChange={setSelectedBeat} />
          <SortFilter sortOpt={sortOpt} setSortOpt={setSortOpt} />
        </div>
      </div>
      {loading
        ? <div className="grid grid-cols-2 gap-[10px]">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-[105px] rounded-[6px] bg-white border-[1.5px] border-[#111111] animate-[oksk_1.4s_ease-in-out_infinite]" />)}
        </div>
        : sorted.length === 0
          ? <p className="text-center text-[#666666] font-sans py-[48px] text-[0.88rem]">
            {selectedBeat ? `No short reads in "${selectedBeat}" beat.` : "No short reads yet."}
          </p>
          : <div className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-[10px] pb-5">
            {sorted.map(s => <MobileShortCard key={s._id} s={s} />)}
          </div>
      }
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ROOT
// ─────────────────────────────────────────────────────────────
export default function MobilePage({ initialData }: {
  initialData?: { articles: any[]; podcasts: any[]; shorts: any[]; loading: boolean }
}) {
  const [activeTab, setActiveTab] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const { user } = useAuth();

  const searchParams = useSearchParams();
  const router = useRouter();

  const uid = (user as any)?.uid ?? "";
  const { articles, podcasts, shorts, loading, error, refetch } = useArticles(uid, initialData);

  useEffect(() => {
    const tab = searchParams?.get("tab");
    if (tab) setActiveTab(tab);
    else setActiveTab("home");
  }, [searchParams]);

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
    router.push(`/?tab=${tab}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [router]);

  const renderTab = () => {
    switch (activeTab) {
      case "articles": return <MobileArticlesView articles={articles} loading={loading} onTabChange={handleTabChange} />;
      case "podcasts": return <MobilePodcastsView podcasts={podcasts} loading={loading} onTabChange={handleTabChange} activeSlug={activeSlug} setActiveSlug={setActiveSlug} />;
      case "shorts": return <MobileShortsView shorts={shorts} loading={loading} onTabChange={handleTabChange} />;
      case "about": return <MobileAboutView onTabChange={handleTabChange} />;
      case "team": return <MobileTeamView onTabChange={handleTabChange} />;
      case "grievance": return <MobileGrievanceView onTabChange={handleTabChange} />;
      case "contact": return <MobileContactView onTabChange={handleTabChange} />;
      default: return <MobileHomeView articles={articles} podcasts={podcasts} shorts={shorts} loading={loading} onTabChange={handleTabChange} activeSlug={activeSlug} setActiveSlug={setActiveSlug} />;
    }
  };

  return (
    <div className="bg-[#f5f0eb] min-h-screen flex flex-col">
      <style>{`
        @keyframes oksk { 0%,100%{opacity:1} 50%{opacity:0.45} }
        * { -webkit-tap-highlight-color: transparent; }
      `}</style>

      <MobileSideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} onTabChange={handleTabChange} onBeatSelect={() => handleTabChange("articles")} />
      <MobileHeader activeTab={activeTab} onTabChange={handleTabChange} onMenuOpen={() => setMenuOpen(true)} />

      <main className="px-4 animate-in fade-in slide-in-from-bottom-1 duration-200 fill-mode-forwards flex-1" key={activeTab}>
        {error && (
          <div className="px-[14px] py-[10px] rounded-[6px] bg-[#c0392b]/[0.08] border border-[#c0392b]/20 font-sans text-[0.8rem] text-[#c0392b] mb-4 mt-3 flex items-center justify-between">
            {error}
            <button onClick={refetch} className="bg-[#111111] border-none text-white px-[10px] py-[3px] rounded-[4px] cursor-pointer text-[0.72rem] font-sans">Retry</button>
          </div>
        )}
        {renderTab()}
      </main>

      <MobileFooter />
    </div>
  );
}
