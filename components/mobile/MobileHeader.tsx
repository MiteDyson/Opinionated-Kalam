"use client";

import { useState, useEffect, useRef } from "react";

const RED = "#c0392b";
const BLACK = "#111111";
const BG = "#f5f0eb";
const BORDER = "#e0d8d0";
const MUTED = "#666666";

const INSTAGRAM_URL = "https://www.instagram.com/opinionatedkalam";
const X_URL = "https://x.com/opinionatedkalam";
const YOUTUBE_URL = "https://www.youtube.com";

// Row 1: Home · Articles · Podcasts
const TABS_ROW1 = [
  { id: "home", label: "Home" },
  { id: "articles", label: "Articles" },
  { id: "podcasts", label: "Podcasts" },
];
// Row 2: Short Articles · About Us
const TABS_ROW2 = [
  { id: "shorts", label: "Short Articles" },
  { id: "about", label: "About Us" },
];

export interface MobileHeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onMenuOpen: () => void;
}

/* ── Search overlay (unchanged logic) ─────────────────────── */
function SearchOverlay({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [activeFilter, setFilter] = useState<string | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setTimeout(() => inputRef.current?.focus(), 50); }, []);

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
        const all = [...(Array.isArray(art) ? art : []), ...(Array.isArray(sh) ? sh : []), ...(Array.isArray(pod) ? pod : [])];
        setResults(all.filter((c: any) =>
          c.title?.toLowerCase().includes(q) ||
          (c.tags ?? []).some((t: string) => t.toLowerCase().includes(q)) ||
          c.excerpt?.toLowerCase().includes(q)
        ).slice(0, 10));
      })
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [query]);

  const typeLabel = (t: string) => t === "article" ? "Article" : t === "podcast" ? "Podcast" : "Short Article";
  const href = (c: any) => c.type === "podcast" ? `/podcasts/${c.slug}` : c.type === "short" ? `/shorts/${c.slug}` : `/article/${c.slug}`;
  const filters = ["Article", "Short Article", "Podcast"];
  const shown = activeFilter ? results.filter(r => typeLabel(r.type) === activeFilter) : results;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 300 }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.3)" }} />
      <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: "72%", backgroundColor: "white", display: "flex", flexDirection: "column", padding: "20px 16px 16px", animation: "slideInR 0.22s ease" }}>
        <style>{`@keyframes slideInR{from{transform:translateX(100%)}to{transform:translateX(0)}}`}</style>
        {/* Close / Back button */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.82rem", fontWeight: 700, color: BLACK }}>Search</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={BLACK} strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, borderBottom: `2px solid ${BLACK}`, paddingBottom: 10, marginBottom: 14 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
          <input ref={inputRef} value={query} onChange={e => setQuery(e.target.value)} placeholder="Search Here..."
            style={{ flex: 1, border: "none", outline: "none", fontSize: "0.9rem", fontFamily: "'Inter', sans-serif", backgroundColor: "transparent", color: BLACK }} />
          {query && <button onClick={() => setQuery("")} style={{ background: "none", border: "none", cursor: "pointer", color: "#aaa", fontSize: "1.2rem", padding: 0 }}>×</button>}
        </div>
        <div style={{ display: "flex", gap: 0, marginBottom: 16 }}>
          {filters.map((f, i) => (
            <span key={f} style={{ display: "flex", alignItems: "center" }}>
              <button onClick={() => setFilter(activeFilter === f ? null : f)} style={{ padding: "4px 10px", borderRadius: 3, border: "none", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: "0.72rem", fontWeight: activeFilter === f ? 600 : 400, backgroundColor: activeFilter === f ? BLACK : "transparent", color: activeFilter === f ? "white" : BLACK }}>
                {f}
              </button>
              {i < filters.length - 1 && <span style={{ color: "#ccc", fontSize: "0.72rem", padding: "0 4px" }}>|</span>}
            </span>
          ))}
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          {loading && <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.82rem", color: MUTED, padding: "12px 0" }}>Searching...</p>}
          {!loading && shown.map((r, i) => (
            <a key={r._id ?? i} href={href(r)} onClick={onClose} style={{ display: "block", textDecoration: "none", padding: "10px 0", borderBottom: `1px solid ${BORDER}` }}>
              <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "0.9rem", color: BLACK, lineHeight: 1.3, marginBottom: 3 }}>{r.title}</div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.68rem", color: MUTED }}>{typeLabel(r.type)}</div>
            </a>
          ))}
          {!loading && query.length >= 2 && shown.length === 0 && (
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.82rem", color: MUTED, padding: "12px 0" }}>No results found</p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Main Header ──────────────────────────────────────────── */
export default function MobileHeader({ activeTab, onTabChange, onMenuOpen }: MobileHeaderProps) {
  const [dateStr, setDateStr] = useState("");
  const [searchOpen, setSearch] = useState(false);

  useEffect(() => {
    const d = new Date();
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    setDateStr(`${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()} — ${days[d.getDay()]}`);
  }, []);

  // Shared tab button — no bold active, just colour change + no underline
  const TabBtn = ({ tab }: { tab: { id: string; label: string } }) => (
    <button onClick={() => onTabChange(tab.id)} style={{
      background: "none", border: "none", cursor: "pointer",
      padding: "8px 9px",
      fontFamily: "'Inter', sans-serif",
      fontSize: "0.78rem",
      fontWeight: 400,           // not bold ever
      color: activeTab === tab.id ? RED : BLACK,
      whiteSpace: "nowrap",
      flexShrink: 0,
      transition: "color 0.12s",
    }}>
      {tab.label}
    </button>
  );

  return (
    <>
      {searchOpen && <SearchOverlay onClose={() => setSearch(false)} />}

      <header style={{ backgroundColor: BG }}>
        {/* ── Brand ─────────────────────────────────────── */}
        <div style={{ textAlign: "center", padding: "14px 16px 25px" }}>
          <button onClick={() => onTabChange("home")} style={{
            background: "none", border: "none", cursor: "pointer",
            fontFamily: "'Playfair Display', 'DM Serif Display', Georgia, serif",
            fontSize: "1.9rem", fontWeight: 700, color: BLACK, lineHeight: 1.1, letterSpacing: "-0.01em",
          }}>
            Opinionated Kalam
          </button>
        </div>

        {/* ── Date + socials ────────────────────────────── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 16px 8px", borderBottom: `1px solid ${BORDER}` }}>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.68rem", color: MUTED }}>{dateStr}</span>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" style={{ display: "flex", color: BLACK }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
            <a href={X_URL} target="_blank" rel="noopener noreferrer" style={{ display: "flex", color: BLACK }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 22, height: 16, borderRadius: 3, backgroundColor: RED, color: "white", flexShrink: 0 }}>
              <span style={{ fontSize: "8px", fontWeight: 700 }}>▶</span>
            </a>
          </div>
        </div>

        {/* ── Nav row 1: hamburger | centred tabs | search ─ */}
        <div style={{ display: "flex", alignItems: "center", padding: "0 12px", borderBottom: "none" }}>
          {/* Hamburger */}
          <button onClick={onMenuOpen} style={{ background: "none", border: "none", cursor: "pointer", padding: "10px 8px 10px 0", display: "flex", flexDirection: "column", gap: 4, flexShrink: 0 }}>
            <span style={{ display: "block", width: 18, height: 1.5, backgroundColor: BLACK, borderRadius: 1 }} />
            <span style={{ display: "block", width: 18, height: 1.5, backgroundColor: BLACK, borderRadius: 1 }} />
            <span style={{ display: "block", width: 18, height: 1.5, backgroundColor: BLACK, borderRadius: 1 }} />
          </button>

          {/* Row-1 tabs — centred */}
          <div style={{ flex: 1, display: "flex", justifyContent: "center", gap: 0 }}>
            {TABS_ROW1.map(tab => <TabBtn key={tab.id} tab={tab} />)}
          </div>

          {/* Search */}
          <button onClick={() => setSearch(true)} style={{ background: "none", border: "none", cursor: "pointer", padding: "10px 0 10px 8px", flexShrink: 0 }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={BLACK} strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
          </button>
        </div>

        {/* ── Nav row 2: centred tabs ───────────────────── */}
        <div style={{ display: "flex", justifyContent: "center", padding: "0 12px", marginTop: -6 }}>
          {TABS_ROW2.map(tab => <TabBtn key={tab.id} tab={tab} />)}
        </div>
      </header>
    </>
  );
}
