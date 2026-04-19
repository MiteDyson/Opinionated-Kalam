"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const RED = "#c0392b";
const BLACK = "#111111";
const BG = "#f5f0eb";
const BORDER = "#e0d8d0";
const MUTED = "#666666";

const INSTAGRAM_URL = "https://www.instagram.com/opinionatedkalam";
const X_URL = "https://x.com/opinionatedkalam";
const YOUTUBE_URL = "https://www.youtube.com";

const TABS = [
  { id: "home", label: "Home" },
  { id: "articles", label: "Articles" },
  { id: "podcasts", label: "Podcasts" },
  { id: "shorts", label: "Short Articles" },
];

interface MobileHeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onMenuOpen: () => void;
}

function MobileSearchOverlay({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"Article" | "Short Article" | "Podcast" | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  useEffect(() => {
    if (query.trim().length < 2) { setResults([]); return; }
    setLoading(true);
    const q = query.toLowerCase();
    Promise.all([
      fetch("/api/articles?type=article&status=published").then(r => r.ok ? r.json() : []),
      fetch("/api/articles?type=short&status=published").then(r => r.ok ? r.json() : []),
      fetch("/api/articles?type=podcast&status=published").then(r => r.ok ? r.json() : []),
    ])
      .then(([art, sh, pod]) => {
        const all = [
          ...(Array.isArray(art) ? art : []),
          ...(Array.isArray(sh) ? sh : []),
          ...(Array.isArray(pod) ? pod : []),
        ];
        setResults(
          all
            .filter((c: any) =>
              c.title?.toLowerCase().includes(q) ||
              (c.tags ?? []).some((t: string) => t.toLowerCase().includes(q)) ||
              c.excerpt?.toLowerCase().includes(q)
            )
            .slice(0, 10)
        );
      })
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [query]);

  const typeLabel = (t: string) =>
    t === "article" ? "Article" : t === "podcast" ? "Podcast" : "Short Article";
  const href = (c: any) =>
    c.type === "podcast"
      ? `/podcasts/${c.slug}`
      : c.type === "short"
      ? `/shorts/${c.slug}`
      : `/article/${c.slug}`;

  const filters: ("Article" | "Short Article" | "Podcast")[] = ["Article", "Short Article", "Podcast"];

  const filteredResults = activeFilter
    ? results.filter(r => typeLabel(r.type) === activeFilter)
    : results;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 300,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Dim overlay on left */}
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.3)",
        }}
      />

      {/* Search panel — slides in from right */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          width: "72%",
          backgroundColor: "white",
          display: "flex",
          flexDirection: "column",
          padding: "20px 16px 16px",
          animation: "slideInRight 0.22s ease",
        }}
      >
        <style>{`@keyframes slideInRight{from{transform:translateX(100%)}to{transform:translateX(0)}}`}</style>

        {/* Search input row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            borderBottom: `2px solid ${BLACK}`,
            paddingBottom: 10,
            marginBottom: 14,
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#aaa"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search Here..."
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              fontSize: "0.9rem",
              fontFamily: "'Inter', sans-serif",
              backgroundColor: "transparent",
              color: BLACK,
            }}
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#aaa",
                fontSize: "1.2rem",
                padding: 0,
              }}
            >
              ×
            </button>
          )}
        </div>

        {/* Filter tabs — Article | Short Article | Podcast */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 0,
            marginBottom: 16,
          }}
        >
          {filters.map((f, i) => (
            <span key={f} style={{ display: "flex", alignItems: "center" }}>
              <button
                onClick={() => setActiveFilter(activeFilter === f ? null : f)}
                style={{
                  padding: "4px 10px",
                  borderRadius: 3,
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.72rem",
                  fontWeight: activeFilter === f ? 600 : 400,
                  backgroundColor: activeFilter === f ? BLACK : "transparent",
                  color: activeFilter === f ? "white" : BLACK,
                  transition: "all 0.12s",
                }}
              >
                {f}
              </button>
              {i < filters.length - 1 && (
                <span
                  style={{
                    color: "#ccc",
                    fontSize: "0.72rem",
                    padding: "0 4px",
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  |
                </span>
              )}
            </span>
          ))}
        </div>

        {/* Results */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {loading && (
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.82rem",
                color: MUTED,
                padding: "12px 0",
              }}
            >
              Searching...
            </p>
          )}
          {!loading &&
            filteredResults.map((r, i) => (
              <a
                key={r._id ?? i}
                href={href(r)}
                onClick={onClose}
                style={{
                  display: "block",
                  textDecoration: "none",
                  padding: "10px 0",
                  borderBottom: `1px solid ${BORDER}`,
                }}
              >
                <div
                  style={{
                    fontFamily: "'DM Serif Display', serif",
                    fontSize: "0.9rem",
                    color: BLACK,
                    lineHeight: 1.3,
                    marginBottom: 3,
                  }}
                >
                  {r.title}
                </div>
                <div
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.68rem",
                    color: MUTED,
                  }}
                >
                  {typeLabel(r.type)}
                </div>
              </a>
            ))}
          {!loading && query.length >= 2 && filteredResults.length === 0 && (
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.82rem",
                color: MUTED,
                padding: "12px 0",
              }}
            >
              No results found
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MobileHeader({
  activeTab,
  onTabChange,
  onMenuOpen,
}: MobileHeaderProps) {
  const [dateStr, setDateStr] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const d = new Date();
    const months = [
      "January","February","March","April","May","June",
      "July","August","September","October","November","December",
    ];
    const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    setDateStr(`${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()} — ${days[d.getDay()]}`);
  }, []);

  return (
    <>
      {searchOpen && <MobileSearchOverlay onClose={() => setSearchOpen(false)} />}

      <header
        style={{
          backgroundColor: BG,
          borderBottom: "none",
          paddingBottom: 0,
        }}
      >
        {/* ── Title row ── */}
        <div style={{ textAlign: "center", padding: "16px 16px 0" }}>
          <button
            onClick={() => onTabChange("home")}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "'Playfair Display', 'DM Serif Display', Georgia, serif",
              fontSize: "2rem",
              fontWeight: 900,
              color: BLACK,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            Opinionated Kalam
          </button>
        </div>

        {/* ── Date + socials row ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "8px 16px 10px",
            borderBottom: `1px solid ${BORDER}`,
          }}
        >
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.72rem",
              color: MUTED,
            }}
          >
            {dateStr}
          </span>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* Instagram */}
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "flex", color: BLACK }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>

            {/* X / Twitter */}
            <a
              href={X_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "flex", color: BLACK }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>

            {/* YouTube */}
            <a
              href={YOUTUBE_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 24,
                height: 18,
                borderRadius: 4,
                backgroundColor: RED,
                color: "white",
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: "9px", fontWeight: 700 }}>▶</span>
            </a>
          </div>
        </div>

        {/* ── Nav row: hamburger + tabs + search ── */}
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            padding: "0 16px",
            borderBottom: `1px solid ${BORDER}`,
            gap: 0,
          }}
        >
          {/* Hamburger */}
          <button
            onClick={onMenuOpen}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "12px 10px 12px 0",
              display: "flex",
              flexDirection: "column",
              gap: 4,
              alignItems: "flex-start",
              flexShrink: 0,
            }}
          >
            <span style={{ display: "block", width: 18, height: 1.5, backgroundColor: BLACK, borderRadius: 1 }} />
            <span style={{ display: "block", width: 18, height: 1.5, backgroundColor: BLACK, borderRadius: 1 }} />
            <span style={{ display: "block", width: 18, height: 1.5, backgroundColor: BLACK, borderRadius: 1 }} />
          </button>

          {/* Scrollable tabs */}
          <div
            className="ok-mobile-tabs"
            style={{
              display: "flex",
              gap: 0,
              overflowX: "auto",
              flex: 1,
              scrollbarWidth: "none",
            }}
          >
            <style>{`.ok-mobile-tabs::-webkit-scrollbar{display:none}`}</style>
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "12px 10px",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.8rem",
                  fontWeight: activeTab === tab.id ? 500 : 400,
                  color: activeTab === tab.id ? RED : BLACK,
                  whiteSpace: "nowrap",
                  borderBottom:
                    activeTab === tab.id
                      ? `2px solid ${RED}`
                      : "2px solid transparent",
                  transition: "color 0.12s",
                }}
              >
                {tab.label}
              </button>
            ))}
            <button
              onClick={() => onTabChange("about")}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "12px 10px",
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.8rem",
                fontWeight: activeTab === "about" ? 500 : 400,
                color: activeTab === "about" ? RED : BLACK,
                whiteSpace: "nowrap",
                borderBottom:
                  activeTab === "about"
                    ? `2px solid ${RED}`
                    : "2px solid transparent",
              }}
            >
              About Us
            </button>
          </div>

          {/* Search icon */}
          <button
            onClick={() => setSearchOpen(true)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "12px 0 12px 8px",
              flexShrink: 0,
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke={BLACK}
              strokeWidth="2"
              strokeLinecap="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </button>
        </nav>
      </header>
    </>
  );
}
