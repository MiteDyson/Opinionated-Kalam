"use client";

import {
  useState,
  useEffect,
  useRef,
  memo,
  useCallback,
} from "react";
import Link from "next/link";
import MobileHeader from "@/components/mobile/MobileHeader";
import MobileSideMenu from "@/components/mobile/MobileSideMenu";
import MobileFooter from "@/components/mobile/MobileFooter";
import BeatsFilter from "@/components/mobile/BeatsFilter";
import { useArticles, type Article } from "@/hooks/useArticles";
import { useAuth } from "@/context/AuthContext";

// ── Design tokens (matching the sample HTML exactly) ──────────────
const RED = "#c0392b";
const BLACK = "#111111";
const BG = "#f5f0eb";
const WHITE = "#ffffff";
const BORDER = "#e0d8d0";
const MUTED = "#666666";
const LIGHT_TEXT = "#999999";
const CARD_BG = WHITE;

// ── Skeleton ─────────────────────────────────────────────────────
function Sk({
  h = 16,
  w = "100%",
  r = 4,
}: {
  h?: number;
  w?: string | number;
  r?: number;
}) {
  return (
    <div
      style={{
        height: h,
        width: w as any,
        borderRadius: r,
        backgroundColor: "#e0d8d0",
        animation: "oksk 1.4s ease-in-out infinite",
      }}
    />
  );
}

// ── Section header ────────────────────────────────────────────────
const SectionHeader = memo(function SectionHeader({
  label,
  onClick,
}: {
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "none",
        border: "none",
        cursor: onClick ? "pointer" : "default",
        fontFamily: "'Inter', sans-serif",
        fontWeight: 700,
        fontSize: "0.78rem",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: BLACK,
        padding: "14px 0 10px",
        display: "flex",
        alignItems: "baseline",
        gap: 2,
      }}
    >
      {label}
      <span style={{ fontWeight: 700, fontSize: "0.78rem" }}>→</span>
    </button>
  );
});

// ── Tag pill ─────────────────────────────────────────────────────
function Tag({ label }: { label: string }) {
  return (
    <span
      style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: "0.62rem",
        fontWeight: 500,
        color: RED,
        textTransform: "capitalize",
        letterSpacing: "0.02em",
      }}
    >
      {label}
    </span>
  );
}

// ── HERO ARTICLE (latest article, full-width image) ───────────────
const MobileHeroArticle = memo(function MobileHeroArticle({
  a,
}: {
  a: Article;
}) {
  const date = a.publishedAt
    ? new Date(a.publishedAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  return (
    <Link href={`/article/${a.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
      <article style={{ marginBottom: 4 }}>
        {/* Cover image */}
        {a.coverImage ? (
          <img
            src={a.coverImage}
            alt={a.title}
            loading="lazy"
            decoding="async"
            style={{
              width: "100%",
              height: 200,
              objectFit: "cover",
              borderRadius: 4,
              display: "block",
              marginBottom: 10,
              backgroundColor: "#2a2a2a",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: 200,
              backgroundColor: "#2a2a2a",
              borderRadius: 4,
              marginBottom: 10,
            }}
          />
        )}

        {/* Tags */}
        {a.tags?.length > 0 && (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 6 }}>
            {a.tags.map(t => <Tag key={t} label={t} />)}
          </div>
        )}

        {/* Title */}
        <h3
          style={{
            fontFamily: "'Playfair Display', 'DM Serif Display', Georgia, serif",
            fontSize: "1.2rem",
            fontWeight: 700,
            color: BLACK,
            margin: "0 0 4px",
            lineHeight: 1.3,
          }}
        >
          {a.title}
        </h3>

        {/* Byline */}
        <div
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.7rem",
            color: MUTED,
            display: "flex",
            gap: 10,
            marginBottom: 6,
          }}
        >
          {date && <span>{date}</span>}
          <span>{a.author}</span>
        </div>

        {/* Excerpt */}
        {a.excerpt && (
          <p
            style={{
              fontFamily: "'Source Serif 4', Georgia, serif",
              fontSize: "0.78rem",
              color: MUTED,
              lineHeight: 1.5,
              margin: "0 0 8px",
            }}
          >
            {a.excerpt.slice(0, 120)}
            {a.excerpt.length > 120 && (
              <span style={{ color: RED, fontWeight: 600 }}> Read Further</span>
            )}
          </p>
        )}
      </article>
    </Link>
  );
});

// ── OTHER ARTICLE (thumb + text row) ─────────────────────────────
const MobileArticleItem = memo(function MobileArticleItem({
  a,
  noBorder,
}: {
  a: Article;
  noBorder?: boolean;
}) {
  const date = a.publishedAt
    ? new Date(a.publishedAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";

  return (
    <Link href={`/article/${a.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
      <article
        style={{
          display: "flex",
          gap: 10,
          padding: "10px 0",
          borderBottom: noBorder ? "none" : `1px solid ${BORDER}`,
          alignItems: "flex-start",
        }}
      >
        {/* Thumb */}
        {a.coverImage ? (
          <img
            src={a.coverImage}
            alt={a.title}
            loading="lazy"
            style={{
              width: 68,
              height: 56,
              objectFit: "cover",
              borderRadius: 3,
              flexShrink: 0,
              backgroundColor: "#2a2a2a",
            }}
          />
        ) : (
          <div
            style={{
              width: 68,
              height: 56,
              backgroundColor: "#2a2a2a",
              borderRadius: 3,
              flexShrink: 0,
            }}
          />
        )}

        <div style={{ flex: 1, minWidth: 0 }}>
          {a.tags?.length > 0 && (
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 3 }}>
              {a.tags.slice(0, 2).map(t => <Tag key={t} label={t} />)}
            </div>
          )}
          <h4
            style={{
              fontFamily: "'Playfair Display', 'DM Serif Display', Georgia, serif",
              fontSize: "0.85rem",
              fontWeight: 700,
              color: BLACK,
              lineHeight: 1.3,
              margin: "0 0 3px",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            } as any}
          >
            {a.title}
          </h4>
          <div
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.65rem",
              color: MUTED,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>{date} &nbsp; {a.author}</span>
            <span style={{ color: RED, fontWeight: 600, fontSize: "0.65rem" }}>
              Read
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
});

// ── ARTICLES GRID card (2-col, used in Articles page) ────────────
const MobileArticleCard = memo(function MobileArticleCard({
  a,
}: {
  a: Article;
}) {
  const date = a.publishedAt
    ? new Date(a.publishedAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";

  return (
    <Link href={`/article/${a.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
      <article style={{ backgroundColor: BG, cursor: "pointer" }}>
        {a.coverImage ? (
          <img
            src={a.coverImage}
            alt={a.title}
            loading="lazy"
            style={{
              width: "100%",
              height: 110,
              objectFit: "cover",
              borderRadius: 3,
              display: "block",
              backgroundColor: "#2a2a2a",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: 110,
              backgroundColor: "#2a2a2a",
              borderRadius: 3,
            }}
          />
        )}

        {a.tags?.length > 0 && (
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 7, marginBottom: 3 }}>
            {a.tags.slice(0, 2).map(t => <Tag key={t} label={t} />)}
          </div>
        )}

        <h3
          style={{
            fontFamily: "'Playfair Display', 'DM Serif Display', Georgia, serif",
            fontSize: "0.82rem",
            fontWeight: 700,
            color: BLACK,
            margin: "0 0 4px",
            lineHeight: 1.3,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          } as any}
        >
          {a.title}
        </h3>

        <div
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.62rem",
            color: MUTED,
          }}
        >
          {date}
        </div>
      </article>
    </Link>
  );
});

// ── PODCAST CARD ─────────────────────────────────────────────────
const MobilePodcastCard = memo(function MobilePodcastCard({
  p,
  activeSlug,
  setActiveSlug,
  showTag = true,
}: {
  p: Article;
  activeSlug: string | null;
  setActiveSlug: (s: string | null) => void;
  showTag?: boolean;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const seekRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [current, setCurrent] = useState("0:00");
  const [totalDur, setTotalDur] = useState(p.duration ?? "0:00");
  const isPlaying = activeSlug === p.slug;

  const ensureAudio = useCallback(() => {
    if (audioRef.current || !p.audioUrl) return;
    const audio = new Audio(p.audioUrl);
    audioRef.current = audio;
    audio.ontimeupdate = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
        const m = Math.floor(audio.currentTime / 60);
        const s = Math.floor(audio.currentTime % 60)
          .toString()
          .padStart(2, "0");
        setCurrent(`${m}:${s}`);
      }
    };
    audio.onloadedmetadata = () => {
      if (!isNaN(audio.duration)) {
        const m = Math.floor(audio.duration / 60);
        const s = Math.floor(audio.duration % 60)
          .toString()
          .padStart(2, "0");
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

  const togglePlay = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!p.audioUrl) return;
      ensureAudio();
      setTimeout(() => {
        const audio = audioRef.current;
        if (!audio) return;
        if (isPlaying) {
          audio.pause();
          setActiveSlug(null);
        } else {
          audio.play().catch(() => {});
          setActiveSlug(p.slug);
        }
      }, 0);
    },
    [p.audioUrl, p.slug, isPlaying, ensureAudio, setActiveSlug]
  );

  const handleSeek = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      const audio = audioRef.current;
      if (!audio || !seekRef.current) return;
      const rect = seekRef.current.getBoundingClientRect();
      const ratio = Math.max(
        0,
        Math.min(1, (e.clientX - rect.left) / rect.width)
      );
      audio.currentTime = ratio * (audio.duration || 0);
      setProgress(ratio * 100);
    },
    []
  );

  return (
    <Link
      href={`/podcasts/${p.slug}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div
        style={{
          backgroundColor: CARD_BG,
          border: `1px solid ${BORDER}`,
          borderRadius: 6,
          padding: 12,
          marginBottom: 12,
          display: "flex",
          gap: 12,
          alignItems: "flex-start",
        }}
      >
        {/* Thumb */}
        {p.coverImage ? (
          <img
            src={p.coverImage}
            alt={p.title}
            loading="lazy"
            style={{
              width: 72,
              height: 72,
              objectFit: "cover",
              borderRadius: 4,
              flexShrink: 0,
              backgroundColor: "#2a2a2a",
            }}
          />
        ) : (
          <div
            style={{
              width: 72,
              height: 72,
              backgroundColor: "#2a2a2a",
              borderRadius: 4,
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.4rem",
            }}
          >
            🎙
          </div>
        )}

        <div style={{ flex: 1, minWidth: 0 }}>
          {showTag && p.tags?.length > 0 && (
            <div
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.6rem",
                fontWeight: 700,
                color: RED,
                textTransform: "uppercase",
                letterSpacing: "0.07em",
                marginBottom: 4,
              }}
            >
              {p.tags[0]}
              {p.episode ? ` → ${p.episode}` : ""}
            </div>
          )}

          <h4
            style={{
              fontFamily:
                "'Playfair Display', 'DM Serif Display', Georgia, serif",
              fontSize: "0.85rem",
              fontWeight: 700,
              color: BLACK,
              lineHeight: 1.3,
              marginTop: 4,
              marginBottom: 8,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            } as any}
          >
            {p.title}
          </h4>

          {/* Player controls */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* Play/Pause button */}
            <button
              onClick={togglePlay}
              style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                backgroundColor: BLACK,
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {isPlaying ? (
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="white"
                >
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
              ) : (
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="white"
                >
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              )}
            </button>

            {/* Seek bar */}
            <div
              ref={seekRef}
              onClick={handleSeek}
              style={{
                flex: 1,
                height: 2,
                backgroundColor: BORDER,
                borderRadius: 1,
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${progress}%`,
                  backgroundColor: RED,
                  borderRadius: 1,
                  transition: "width 0.25s linear",
                }}
              />
            </div>

            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.65rem",
                color: MUTED,
                whiteSpace: "nowrap",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {current} / {totalDur}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
});

// ── SHORT ARTICLE CARD (2-col grid) ──────────────────────────────
const MobileShortCard = memo(function MobileShortCard({
  s,
}: {
  s: Article;
}) {
  return (
    <Link href={`/shorts/${s.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
      <article
        style={{
          backgroundColor: CARD_BG,
          border: `1px solid ${BORDER}`,
          borderRadius: 6,
          padding: 10,
          cursor: "pointer",
        }}
      >
        {/* Tags */}
        {s.tags?.length > 0 && (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 4 }}>
            {s.tags.slice(0, 3).map(t => <Tag key={t} label={t} />)}
          </div>
        )}

        <h4
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.75rem",
            fontWeight: 600,
            color: BLACK,
            lineHeight: 1.35,
            margin: "4px 0 8px",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          } as any}
        >
          {s.title}
        </h4>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.62rem",
            color: LIGHT_TEXT,
          }}
        >
          <span>{s.readTime ?? "2 min Read"}</span>
        </div>
      </article>
    </Link>
  );
});

// ── Sort dropdown ─────────────────────────────────────────────────
type SortDir = "newest" | "oldest";

function SortDropdown({
  sortDir,
  setSortDir,
}: {
  sortDir: SortDir;
  setSortDir: (d: SortDir) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          padding: "4px 10px",
          borderRadius: 4,
          border: `1px solid ${BORDER}`,
          backgroundColor: WHITE,
          fontFamily: "'Inter', sans-serif",
          fontSize: "0.72rem",
          fontWeight: 400,
          color: BLACK,
          cursor: "pointer",
        }}
      >
        Sort
        <span style={{ fontSize: "0.6rem" }}>‹</span>
      </button>
      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            right: 0,
            backgroundColor: WHITE,
            borderRadius: 6,
            border: `1px solid ${BORDER}`,
            boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
            zIndex: 40,
            minWidth: 120,
            overflow: "hidden",
          }}
        >
          {(["newest", "oldest"] as const).map((opt, i) => (
            <button
              key={opt}
              onClick={() => {
                setSortDir(opt);
                setOpen(false);
              }}
              style={{
                display: "block",
                width: "100%",
                padding: "9px 14px",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.8rem",
                fontWeight: sortDir === opt ? 600 : 400,
                color: sortDir === opt ? BLACK : MUTED,
                backgroundColor:
                  sortDir === opt ? "#f5f0eb" : "transparent",
                borderBottom: i === 0 ? `1px solid ${BORDER}` : "none",
                textAlign: "left",
                textTransform: "capitalize",
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// VIEW: HOME
// ─────────────────────────────────────────────────────────────────
function MobileHomeView({
  articles,
  podcasts,
  shorts,
  loading,
  onTabChange,
  activeSlug,
  setActiveSlug,
}: {
  articles: Article[];
  podcasts: Article[];
  shorts: Article[];
  loading: boolean;
  onTabChange: (t: string) => void;
  activeSlug: string | null;
  setActiveSlug: (s: string | null) => void;
}) {
  const hero = articles[0];
  const others = articles.slice(1, 4);

  return (
    <div>
      {/* Latest Article section */}
      <section style={{ marginBottom: 16 }}>
        <SectionHeader label="LATEST ARTICLE" onClick={() => onTabChange("articles")} />
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Sk h={190} r={4} />
            <Sk h={20} w="80%" />
            <Sk h={12} w="50%" />
            <Sk h={12} />
            <Sk h={12} w="90%" />
          </div>
        ) : hero ? (
          <MobileHeroArticle a={hero} />
        ) : null}
      </section>

      {/* Other Articles section */}
      {(loading || others.length > 0) && (
        <section style={{ marginBottom: 16 }}>
          <SectionHeader label="OTHER ARTICLES" onClick={() => onTabChange("articles")} />
          {loading ? (
            [1, 2, 3].map(i => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 10,
                  padding: "10px 0",
                  borderBottom: `1px solid ${BORDER}`,
                }}
              >
                <Sk h={56} w={68} r={3} />
                <div
                  style={{ flex: 1, display: "flex", flexDirection: "column", gap: 7 }}
                >
                  <Sk h={12} w="70%" />
                  <Sk h={10} w="50%" />
                </div>
              </div>
            ))
          ) : (
            others.map((a, i) => (
              <MobileArticleItem
                key={a._id}
                a={a}
                noBorder={i === others.length - 1}
              />
            ))
          )}
        </section>
      )}

      {/* Latest Podcasts section */}
      {(loading || podcasts.length > 0) && (
        <section style={{ marginBottom: 16 }}>
          <SectionHeader label="LATEST PODCASTS" onClick={() => onTabChange("podcasts")} />
          {loading ? (
            [1, 2].map(i => (
              <div
                key={i}
                style={{
                  height: 94,
                  borderRadius: 6,
                  backgroundColor: CARD_BG,
                  border: `1px solid ${BORDER}`,
                  marginBottom: 12,
                  animation: "oksk 1.4s ease-in-out infinite",
                }}
              />
            ))
          ) : (
            podcasts
              .slice(0, 3)
              .map(p => (
                <MobilePodcastCard
                  key={p._id}
                  p={p}
                  activeSlug={activeSlug}
                  setActiveSlug={setActiveSlug}
                />
              ))
          )}
        </section>
      )}

      {/* Short Articles section */}
      {(loading || shorts.length > 0) && (
        <section style={{ marginBottom: 24 }}>
          <SectionHeader label="SHORT READS" onClick={() => onTabChange("shorts")} />
          {loading ? (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[1, 2, 3, 4].map(i => (
                <div
                  key={i}
                  style={{
                    height: 100,
                    borderRadius: 6,
                    backgroundColor: CARD_BG,
                    border: `1px solid ${BORDER}`,
                    animation: "oksk 1.4s ease-in-out infinite",
                  }}
                />
              ))}
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {shorts.slice(0, 4).map(s => (
                <MobileShortCard key={s._id} s={s} />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// VIEW: ARTICLES (2-col grid with Beat + Sort filters)
// ─────────────────────────────────────────────────────────────────
function MobileArticlesView({
  articles,
  loading,
  onTabChange,
}: {
  articles: Article[];
  loading: boolean;
  onTabChange: (t: string) => void;
}) {
  const [selectedBeat, setSelectedBeat] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("newest");

  const filtered = selectedBeat
    ? articles.filter(a => a.tags?.includes(selectedBeat))
    : articles;

  const sorted = [...filtered].sort((a, b) => {
    const da = new Date(a.publishedAt ?? 0).getTime();
    const db = new Date(b.publishedAt ?? 0).getTime();
    return sortDir === "newest" ? db - da : da - db;
  });

  return (
    <div>
      {/* Breadcrumb bar: ← Home | Beats Sort */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 0",
          gap: 8,
        }}
      >
        <button
          onClick={() => onTabChange("home")}
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.72rem",
            color: BLACK,
            background: "transparent",
            border: `1px solid ${BORDER}`,
            borderRadius: 4,
            padding: "4px 10px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 4,
            whiteSpace: "nowrap",
          }}
        >
          ← Home
        </button>

        <div style={{ display: "flex", gap: 6, marginLeft: "auto" }}>
          <BeatsFilter selectedBeat={selectedBeat} onBeatChange={setSelectedBeat} />
          <SortDropdown sortDir={sortDir} setSortDir={setSortDir} />
        </div>
      </div>

      {/* 2-col article grid */}
      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <Sk h={110} r={3} />
              <Sk h={12} w="80%" />
              <Sk h={10} w="50%" />
            </div>
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <p
          style={{
            textAlign: "center",
            color: MUTED,
            fontFamily: "'Inter', sans-serif",
            padding: "48px 0",
            fontSize: "0.88rem",
          }}
        >
          {selectedBeat ? `No articles in "${selectedBeat}" beat.` : "No articles yet."}
        </p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, paddingBottom: 20 }}>
          {sorted.map(a => (
            <MobileArticleCard key={a._id} a={a} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// VIEW: PODCASTS (list with Beat filter)
// ─────────────────────────────────────────────────────────────────
function MobilePodcastsView({
  podcasts,
  loading,
  onTabChange,
  activeSlug,
  setActiveSlug,
}: {
  podcasts: Article[];
  loading: boolean;
  onTabChange: (t: string) => void;
  activeSlug: string | null;
  setActiveSlug: (s: string | null) => void;
}) {
  const [selectedBeat, setSelectedBeat] = useState<string | null>(null);
  const filtered = selectedBeat
    ? podcasts.filter(p => p.tags?.includes(selectedBeat))
    : podcasts;

  return (
    <div>
      {/* Breadcrumb bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 0",
        }}
      >
        <button
          onClick={() => onTabChange("home")}
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.72rem",
            color: BLACK,
            background: "transparent",
            border: `1px solid ${BORDER}`,
            borderRadius: 4,
            padding: "4px 10px",
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          ← Home
        </button>
        <div style={{ marginLeft: "auto" }}>
          <BeatsFilter selectedBeat={selectedBeat} onBeatChange={setSelectedBeat} />
        </div>
      </div>

      {loading ? (
        [1, 2, 3].map(i => (
          <div
            key={i}
            style={{
              height: 96,
              borderRadius: 6,
              backgroundColor: CARD_BG,
              border: `1px solid ${BORDER}`,
              marginBottom: 12,
              animation: "oksk 1.4s ease-in-out infinite",
            }}
          />
        ))
      ) : filtered.length === 0 ? (
        <p
          style={{
            textAlign: "center",
            color: MUTED,
            fontFamily: "'Inter', sans-serif",
            padding: "48px 0",
            fontSize: "0.88rem",
          }}
        >
          {selectedBeat ? `No podcasts in "${selectedBeat}" beat.` : "No podcasts yet."}
        </p>
      ) : (
        filtered.map(p => (
          <MobilePodcastCard
            key={p._id}
            p={p}
            activeSlug={activeSlug}
            setActiveSlug={setActiveSlug}
          />
        ))
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// VIEW: SHORT ARTICLES (2-col grid with Beat + Sort filters)
// ─────────────────────────────────────────────────────────────────
function MobileShortsView({
  shorts,
  loading,
  onTabChange,
}: {
  shorts: Article[];
  loading: boolean;
  onTabChange: (t: string) => void;
}) {
  const [selectedBeat, setSelectedBeat] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("newest");

  const filtered = selectedBeat
    ? shorts.filter(s => s.tags?.includes(selectedBeat))
    : shorts;

  const sorted = [...filtered].sort((a, b) => {
    const da = new Date(a.publishedAt ?? 0).getTime();
    const db = new Date(b.publishedAt ?? 0).getTime();
    return sortDir === "newest" ? db - da : da - db;
  });

  return (
    <div>
      {/* Breadcrumb bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 0",
          gap: 8,
        }}
      >
        <button
          onClick={() => onTabChange("home")}
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.72rem",
            color: BLACK,
            background: "transparent",
            border: `1px solid ${BORDER}`,
            borderRadius: 4,
            padding: "4px 10px",
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          ← Home
        </button>
        <div style={{ display: "flex", gap: 6, marginLeft: "auto" }}>
          <BeatsFilter selectedBeat={selectedBeat} onBeatChange={setSelectedBeat} />
          <SortDropdown sortDir={sortDir} setSortDir={setSortDir} />
        </div>
      </div>

      {/* 2-col short articles grid */}
      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[1, 2, 3, 4].map(i => (
            <div
              key={i}
              style={{
                height: 100,
                borderRadius: 6,
                backgroundColor: CARD_BG,
                border: `1px solid ${BORDER}`,
                animation: "oksk 1.4s ease-in-out infinite",
              }}
            />
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <p
          style={{
            textAlign: "center",
            color: MUTED,
            fontFamily: "'Inter', sans-serif",
            padding: "48px 0",
            fontSize: "0.88rem",
          }}
        >
          {selectedBeat ? `No short reads in "${selectedBeat}" beat.` : "No short reads yet."}
        </p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, paddingBottom: 20 }}>
          {sorted.map(s => (
            <MobileShortCard key={s._id} s={s} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// ROOT MOBILE PAGE
// ─────────────────────────────────────────────────────────────────
export default function MobilePage() {
  const [activeTab, setActiveTab] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const { user } = useAuth();

  const uid = (user as any)?.uid ?? "";
  const { articles, podcasts, shorts, loading, error, refetch } =
    useArticles(uid);

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
      case "articles":
        return (
          <MobileArticlesView
            articles={articles}
            loading={loading}
            onTabChange={handleTabChange}
          />
        );
      case "podcasts":
        return (
          <MobilePodcastsView
            podcasts={podcasts}
            loading={loading}
            onTabChange={handleTabChange}
            activeSlug={activeSlug}
            setActiveSlug={setActiveSlug}
          />
        );
      case "shorts":
        return (
          <MobileShortsView
            shorts={shorts}
            loading={loading}
            onTabChange={handleTabChange}
          />
        );
      default:
        return (
          <MobileHomeView
            articles={articles}
            podcasts={podcasts}
            shorts={shorts}
            loading={loading}
            onTabChange={handleTabChange}
            activeSlug={activeSlug}
            setActiveSlug={setActiveSlug}
          />
        );
    }
  };

  return (
    <div style={{ backgroundColor: BG, minHeight: "100vh" }}>
      <style>{`
        @keyframes oksk { 0%,100%{opacity:1} 50%{opacity:0.45} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }
        * { -webkit-tap-highlight-color: transparent; }
      `}</style>

      <MobileSideMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        onTabChange={handleTabChange}
        onBeatSelect={() => handleTabChange("articles")}
      />

      <MobileHeader
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onMenuOpen={() => setMenuOpen(true)}
      />

      <main
        style={{
          padding: "0 16px",
          animation: "fadeIn 0.22s ease forwards",
        }}
        key={activeTab}
      >
        {/* Error banner */}
        {error && (
          <div
            style={{
              padding: "10px 14px",
              borderRadius: 6,
              backgroundColor: "rgba(192,57,43,0.08)",
              border: "1px solid rgba(192,57,43,0.2)",
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.8rem",
              color: RED,
              marginBottom: 16,
              marginTop: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {error}
            <button
              onClick={refetch}
              style={{
                background: BLACK,
                border: "none",
                color: "white",
                padding: "3px 10px",
                borderRadius: 4,
                cursor: "pointer",
                fontSize: "0.72rem",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Retry
            </button>
          </div>
        )}

        {renderTab()}
      </main>

      <MobileFooter />
    </div>
  );
}
