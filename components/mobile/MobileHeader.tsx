"use client";

import { useState, useEffect, useRef } from "react";
import { X, Search, Menu, ChevronRight } from "lucide-react";

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
    <div className="fixed inset-0 z-[300]">
      <div onClick={onClose} className="absolute inset-0 bg-black/30" />
      <div className="absolute top-0 right-0 bottom-0 w-[72%] bg-white flex flex-col p-[20px_16px_16px] animate-in slide-in-from-right duration-200">
        {/* Close / Back button */}
        <div className="flex items-center justify-between mb-[10px]">
          <span className="font-sans text-[0.82rem] font-bold text-[#111111]">Search</span>
          <button onClick={onClose} className="bg-none border-none cursor-pointer p-1 flex items-center justify-center">
            <X size={18} color="#111111" strokeWidth={2.5} />
          </button>
        </div>
        <div className="flex items-center gap-2 border-b-2 border-[#111111] pb-[10px] mb-[14px]">
          <Search size={16} className="text-[#aaaaaa]" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search Here..."
            className="flex-1 border-none outline-none text-[0.9rem] font-sans bg-transparent text-[#111111]"
          />
          {query && <button onClick={() => setQuery("")} className="bg-none border-none cursor-pointer text-[#aaaaaa] text-[1.2rem] p-0">×</button>}
        </div>
        <div className="flex gap-0 mb-4">
          {filters.map((f, i) => (
            <span key={f} className="flex items-center">
              <button
                onClick={() => setFilter(activeFilter === f ? null : f)}
                className={`px-[10px] py-[4px] rounded-[3px] border-none cursor-pointer font-sans text-[0.72rem] transition-colors ${activeFilter === f ? "bg-[#111111] text-white font-semibold" : "bg-transparent text-[#111111] font-normal"}`}
              >
                {f}
              </button>
              {i < filters.length - 1 && <span className="text-[#cccccc] text-[0.72rem] px-1">|</span>}
            </span>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto">
          {loading && <p className="font-sans text-[0.82rem] text-[#666666] py-3">Searching...</p>}
          {!loading && shown.map((r, i) => (
            <a key={r._id ?? i} href={href(r)} onClick={onClose} className="block no-underline py-[10px] border-b border-[#e0d8d0]">
              <div className="font-serif text-[0.9rem] text-[#111111] leading-[1.3] mb-[3px]">{r.title}</div>
              <div className="font-sans text-[0.68rem] text-[#666666]">{typeLabel(r.type)}</div>
            </a>
          ))}
          {!loading && query.length >= 2 && shown.length === 0 && (
            <p className="font-sans text-[0.82rem] text-[#666666] py-3">No results found</p>
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

  // Shared tab button — bold if active, color change
  const TabBtn = ({ tab }: { tab: { id: string; label: string } }) => {
    const isActive = activeTab === tab.id;
    return (
      <button
        onClick={() => onTabChange(tab.id)}
        className={`bg-none border-none cursor-pointer px-[9px] py-[8px] font-sans text-[0.78rem] ${isActive ? "font-bold text-[#D92323]" : "font-normal text-[#111111]"} whitespace-nowrap shrink-0 transition-colors duration-[120ms]`}
      >
        {tab.label}
      </button>
    );
  };

  return (
    <>
      {searchOpen && <SearchOverlay onClose={() => setSearch(false)} />}

      <header className="bg-[#f5f0eb] relative">
        {/* ── Brand ─────────────────────────────────────── */}
        <div className="text-center px-[16px] pt-[14px] pb-[25px]">
          <button
            onClick={() => onTabChange("home")}
            className="bg-none border-none cursor-pointer font-serif text-[2.25rem] text-[#111111] leading-[1.1] tracking-[-0.01em] flex items-center justify-center gap-3 mx-auto"
          >
            Opinionated Kalam
          </button>
        </div>

        {/* ── Date + socials ────────────────────────────── */}
        <div className="flex items-center justify-between px-[16px] py-[7px] pb-2 border-b border-[#e0d8d0]">
          <span className="font-sans text-[0.68rem] text-[#666666]">{dateStr}</span>
          <div className="flex items-center gap-[10px]">
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="flex text-[#111111]">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
            <a href={X_URL} target="_blank" rel="noopener noreferrer" className="flex text-[#111111]">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-[22px] h-[16px] rounded-[3px] bg-[#c0392b] text-white shrink-0">
              <span className="text-[8px] font-bold">▶</span>
            </a>
          </div>
        </div>

        {/* ── Nav row 1: hamburger | centred tabs | search ─ */}
        <div className="flex items-center px-4 border-none">
          {/* Hamburger */}
          <button onClick={onMenuOpen} className="bg-none border-none cursor-pointer p-[10px_8px_10px_0] flex items-center shrink-0">
            <Menu size={26} color="#111111" />
          </button>

          {/* Row-1 tabs — centred */}
          <div className="flex-1 flex justify-center gap-0">
            {TABS_ROW1.map(tab => <TabBtn key={tab.id} tab={tab} />)}
          </div>

          {/* Search */}
          <button onClick={() => setSearch(true)} className="bg-none border-none cursor-pointer p-[10px_0_10px_8px] shrink-0 flex items-center">
            <Search size={21} color="#111111" />
          </button>
        </div>

        {/* ── Nav row 2: centred tabs ───────────────────── */}
        <div className="flex justify-center px-4 -mt-[6px]">
          {TABS_ROW2.map(tab => <TabBtn key={tab.id} tab={tab} />)}
        </div>
      </header>
    </>
  );
}
