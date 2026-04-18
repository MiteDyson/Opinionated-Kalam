"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const RED = "#D92323";
const ACCENT = "#1B2A47";
const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

// Change 7 — Update these hrefs to your actual social URLs
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
        const all = [...(Array.isArray(art) ? art : []), ...(Array.isArray(sh) ? sh : []), ...(Array.isArray(pod) ? pod : [])];
        setResults(all.filter((c: any) =>
          c.title?.toLowerCase().includes(q) ||
          (c.tags ?? []).some((t: string) => t.toLowerCase().includes(q)) ||
          c.excerpt?.toLowerCase().includes(q)
        ).slice(0, 8));
      })
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [query]);

  const typeLabel = (t: string) => t === "article" ? "Article" : t === "podcast" ? "Podcast" : "Short Article";
  const href = (c: any) => c.type === "podcast" ? `/podcasts/${c.slug}` : c.type === "short" ? `/shorts/${c.slug}` : `/article/${c.slug}`;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200,
      display: "flex", flexDirection: "column",
    }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.3)" }} />

      <div style={{
        position: "absolute", top: 0, right: 0, bottom: 0,
        width: "75%", backgroundColor: "#f4efea",
        display: "flex", flexDirection: "column",
        padding: "20px 20px",
        animation: "slideInRight 0.22s ease",
      }}>
        <style>{`@keyframes slideInRight{from{transform:translateX(100%)}to{transform:translateX(0)}}`}</style>

        <div style={{ display: "flex", alignItems: "center", gap: 10, borderBottom: "2px solid #1A1A1A", paddingBottom: 10, marginBottom: 20 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search Here..."
            style={{ flex: 1, border: "none", outline: "none", fontSize: "1rem", fontFamily: "'Inter', sans-serif", backgroundColor: "transparent" }}
          />
          {query && (
            <button onClick={() => setQuery("")} style={{ background: "none", border: "none", cursor: "pointer", color: "#888", fontSize: "1.2rem" }}>×</button>
          )}
        </div>

        <div style={{ flex: 1, overflowY: "auto" }}>
          {loading && <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", color: "#888" }}>Searching...</p>}
          {!loading && results.map((r, i) => (
            <a key={r._id ?? i} href={href(r)} onClick={onClose} style={{ display: "block", textDecoration: "none", padding: "12px 0", borderBottom: "1px solid #f0f0f0" }}>
              <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1rem", color: "#1A1A1A", lineHeight: 1.3, marginBottom: 3 }}>{r.title}</div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.72rem", color: "#888" }}>{typeLabel(r.type)}</div>
            </a>
          ))}
          {!loading && query.length >= 2 && results.length === 0 && (
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", color: "#888" }}>No results found</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MobileHeader({ activeTab, onTabChange, onMenuOpen }: MobileHeaderProps) {
  const [dateStr, setDateStr] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const d = new Date();
    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    setDateStr(`${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()} — ${days[d.getDay()]}`);
  }, []);

  return (
    <>
      {searchOpen && <MobileSearchOverlay onClose={() => setSearchOpen(false)} />}

      <header style={{ backgroundColor: "var(--bg)", paddingBottom: 0 }}>
        {/* Title */}
        <div style={{ textAlign: "center", padding: "16px 16px 0" }}>
          <button
            onClick={() => onTabChange("home")}
            style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Serif Display', serif", fontSize: "2.2rem", fontWeight: 400, color: "var(--text-main)", lineHeight: 1 }}
          >
            Opinionated Kalam
          </button>
        </div>

        {/* Date + social icons row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", borderBottom: "1px solid var(--border)" }}>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.72rem", color: "var(--text-muted)" }}>{dateStr}</span>

          {/* Change 7: Instagram, X, YouTube all linked */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* Instagram */}
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" style={{ display: "flex", color: "#1A1A1A" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="5"/>
                <circle cx="12" cy="12" r="5"/>
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
              </svg>
            </a>
            {/* X / Twitter */}
            <a href={X_URL} target="_blank" rel="noopener noreferrer" style={{ display: "flex", color: "#1A1A1A" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            {/* YouTube */}
            <a href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 26, height: 26, borderRadius: "50%", backgroundColor: "#FF0000", color: "white", flexShrink: 0 }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Nav tabs */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {/* Hamburger */}
            <button
              onClick={onMenuOpen}
              style={{ background: "none", border: "none", cursor: "pointer", padding: "12px 8px 12px 0", display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-start" }}
            >
              <span style={{ display: "block", width: 20, height: 2, backgroundColor: "#1A1A1A" }} />
              <span style={{ display: "block", width: 20, height: 2, backgroundColor: "#1A1A1A" }} />
              <span style={{ display: "block", width: 20, height: 2, backgroundColor: "#1A1A1A" }} />
            </button>

            {/* Tabs */}
            <div className="mobile-tabs" style={{ display: "flex", gap: 0, overflowX: "auto", scrollbarWidth: "none" }}>
              <style>{`.mobile-tabs::-webkit-scrollbar{display:none}`}</style>
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    padding: "12px 10px",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.82rem",
                    fontWeight: activeTab === tab.id ? 700 : 500,
                    color: activeTab === tab.id ? RED : "var(--text-main)",
                    whiteSpace: "nowrap",
                    borderBottom: activeTab === tab.id ? `2px solid ${RED}` : "2px solid transparent",
                  }}
                >
                  {tab.label}
                </button>
              ))}
              <button
                onClick={() => onTabChange("about")}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  padding: "12px 10px",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.82rem",
                  fontWeight: activeTab === "about" ? 700 : 500,
                  color: activeTab === "about" ? RED : "var(--text-main)",
                  whiteSpace: "nowrap",
                  borderBottom: activeTab === "about" ? `2px solid ${RED}` : "2px solid transparent",
                }}
              >
                About Us
              </button>
            </div>
          </div>

          {/* Search icon */}
          <button
            onClick={() => setSearchOpen(true)}
            style={{ background: "none", border: "none", cursor: "pointer", padding: "12px 0 12px 8px", flexShrink: 0 }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
          </button>
        </div>
      </header>
    </>
  );
}
