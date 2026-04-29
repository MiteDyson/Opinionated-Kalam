"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase";
import { Menu, Search, X, User, ChevronDown, LogOut, ChevronRight } from "lucide-react";

const ACCENT = "#1B2A47";
const RED    = "#D92323";

// Beats tab removed — now lives as a dropdown filter on each section page
const TABS = [
  { id: "home",     label: "Home" },
  { id: "articles", label: "Articles" },
  { id: "podcasts", label: "Podcasts" },
  { id: "shorts",   label: "Short Articles" },
];

interface HeaderProps {
  onMenuOpen: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Header({ onMenuOpen, activeTab, onTabChange }: HeaderProps) {
  const router = useRouter();
  const { user, logout, isAdmin, isMainAdmin } = useAuth();
  const [dateStr, setDateStr]           = useState("");
  const [searchOpen, setSearchOpen]     = useState(false);
  const [searchQuery, setSearchQuery]   = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef   = useRef<HTMLDivElement>(null);
  const inputRef    = useRef<HTMLInputElement>(null);

  const hasUsername = !!(user?.displayName?.trim());
  const displayName = hasUsername ? user!.displayName!.trim().slice(0, 15) : "Set name";

  useEffect(() => {
    const d = new Date();
    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    const days   = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    setDateStr(`${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()} — ${days[d.getDay()]}`);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setDropdownOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) { setSearchOpen(false); setSearchQuery(""); }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const openSearch = () => { setSearchOpen(true); setTimeout(() => inputRef.current?.focus(), 20); };
  const closeSearch = () => { setSearchOpen(false); setSearchQuery(""); };

  return (
    <header>
      <style>{`
        .ok-search::placeholder { color: #908e8a; }
        .ok-search:focus        { border-color: #908e8a !important; outline: none; }
      `}</style>

      {user && !hasUsername && (
        <div className="bg-[#1B2A47]/[0.07] border border-[#1B2A47]/15 rounded-[8px] p-[9px_14px] mb-[10px] flex items-center justify-between gap-[12px]">
          <div className="flex items-center gap-2">
            <User size={14} color="#1B2A47" />
            <span className="font-sans text-[0.82rem] text-[#1B2A47]">
              <strong>You haven't set a username yet.</strong> Add one to personalise your profile.
            </span>
          </div>
          <button onClick={() => router.push("/login")} className="shrink-0 px-[14px] py-[5px] rounded-[6px] border-none bg-[#1B2A47] text-white font-sans text-[0.78rem] font-bold cursor-pointer">
            Set Username
          </button>
        </div>
      )}

      <div className="text-center pt-6">
        <button onClick={() => onTabChange("home")} className="bg-none border-none cursor-pointer p-0 font-serif text-[clamp(2rem,4.5vw,3.2rem)] font-normal leading-none tracking-[-0.5px] text-[var(--text-main)] flex items-center justify-center gap-4 mx-auto">
          Opinionated Kalam
        </button>
      </div>

      <div className="flex items-center justify-between py-[10px] border-b border-[var(--border)]">
        <span className="text-[0.78rem] text-[var(--text-muted)] font-sans">{dateStr}</span>
        <div className="flex items-center gap-[10px]">
          {isAdmin && (
            <a href="/admin" className="bg-[#1B2A47] text-white px-3 py-1 rounded-[6px] text-[0.75rem] font-semibold font-sans no-underline">Admin</a>
          )}
          <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-8 h-8 rounded-full bg-[#FF0000] text-white shrink-0">
            {/* Social media icons remain as SVGs per user request */}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
          </a>
        </div>
      </div>

      <nav className="grid grid-cols-[1fr_auto_1fr] items-center py-[10px] mb-8 relative">
        <div ref={searchRef} className="flex items-center gap-2 relative">
          <button onClick={onMenuOpen} className="bg-none border-none cursor-pointer text-[var(--text-main)] p-0 flex shrink-0 hover:text-[#1B2A47] transition-colors">
            <Menu size={20} />
          </button>

          {searchOpen ? (
            <div className="relative w-[220px] animate-in fade-in slide-in-from-left-2 duration-200">
              <Search size={13} className="absolute left-[9px] top-1/2 -translate-y-1/2 text-[#908e8a] pointer-events-none" />
              <input 
                ref={inputRef} 
                type="text" 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                onKeyDown={(e) => { if (e.key === "Escape") closeSearch(); }} 
                placeholder="Search..." 
                className="w-full pl-[28px] pr-[26px] py-[6px] rounded-[8px] border-[1.5px] border-[#d5d2cb] bg-transparent font-sans text-[0.84rem] text-[var(--text-main)] focus:outline-none focus:border-[#908e8a] placeholder:text-[#908e8a]"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")} 
                  className="absolute right-[7px] top-1/2 -translate-y-1/2 bg-none border-none cursor-pointer text-[#908e8a] p-0 flex hover:text-[var(--text-main)]"
                >
                  <X size={14} />
                </button>
              )}
              {searchQuery.trim().length > 1 && (
                <div className="absolute top-[calc(100%+6px)] left-0 w-[300px] z-[200] bg-white rounded-[10px] border border-[var(--border)] shadow-[0_8px_28px_rgba(0,0,0,0.1)] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                  <SearchResults query={searchQuery} onClose={closeSearch} />
                </div>
              )}
            </div>
          ) : (
            <button onClick={openSearch} className="bg-none border-none cursor-pointer p-0 flex items-center gap-[5px] group">
              <Search size={15} className="text-[var(--text-main)] group-hover:text-[#1B2A47] transition-colors" />
              <span className="text-[0.85rem] font-sans text-[var(--text-main)] group-hover:text-[#1B2A47] transition-colors">Search</span>
            </button>
          )}
        </div>

        <div className="flex gap-6 items-center">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button 
                key={tab.id} 
                onClick={() => onTabChange(tab.id)} 
                className={`bg-none border-none cursor-pointer text-[0.88rem] ${isActive ? "font-bold text-[#D92323]" : "font-medium text-[var(--text-main)]"} font-sans p-0 whitespace-nowrap transition-colors duration-150 hover:text-[#D92323]`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-[14px] justify-end">
          {user ? (
            <div ref={dropdownRef} className="relative">
              <button onClick={() => setDropdownOpen(o => !o)} className={`flex items-center gap-[6px] bg-none border ${!hasUsername ? "border-[#d38b88]/60 text-[#b85c58]" : "border-[var(--border)] text-[var(--text-main)]"} cursor-pointer px-[12px] py-[5px] rounded-full text-[0.82rem] font-sans font-semibold transition-all hover:bg-black/5`}>
                {displayName}
                {!hasUsername && <span className="ml-1 text-[0.62rem] text-[#b85c58]">!</span>}
              </button>

              {dropdownOpen && (
                <div className="absolute top-[calc(100%+8px)] right-0 bg-white rounded-[10px] min-w-[180px] border border-[var(--border)] shadow-[0_4px_20px_rgba(0,0,0,0.1)] overflow-hidden z-[50] py-1 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-[14px] pt-[10px] pb-[8px] border-b border-[var(--border)]">
                    <div className="text-[0.78rem] font-bold text-[var(--text-main)] font-sans">
                      {hasUsername ? displayName : <span className="text-[#b85c58]">No username set</span>}
                    </div>
                    <div className="text-[0.7rem] text-[var(--text-muted)] font-sans mt-[2px]">{user.email}</div>
                  </div>

                   {!hasUsername && (
                    <a href="/login" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-[14px] py-[10px] no-underline text-[#b85c58] text-[0.82rem] font-sans font-semibold border-b border-[var(--border)] bg-[#d38b88]/[0.06] hover:bg-[#d38b88]/10 transition-colors">
                      Set your username →
                    </a>
                  )}

                  {[{ label: "Saved Articles", href: "/saved" }, { label: "My Subscriptions", href: "/subscriptions" }].map((item) => (
                    <a key={item.label} href={item.href} className="flex items-center px-[14px] py-[10px] no-underline text-[var(--text-main)] text-[0.85rem] font-sans border-b border-[var(--border)] transition-colors hover:bg-[#faf9f7]">
                      {item.label}
                    </a>
                  ))}

                  {isMainAdmin && (
                    <a href="/admin/team" className="flex items-center gap-2 px-[14px] py-[10px] no-underline text-[#1B2A47] text-[0.85rem] font-sans font-semibold border-b border-[var(--border)] transition-colors hover:bg-[#faf9f7]">
                      Manage Team
                    </a>
                  )}

                  <button 
                    onClick={() => { logout(); setDropdownOpen(false); }} 
                    className="flex items-center w-full px-[14px] py-[10px] bg-none border-none cursor-pointer text-[#e05555] text-[0.85rem] font-sans text-left transition-colors hover:bg-[#fff5f5]"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <a href="/login" className="bg-[var(--text-main)] text-white px-[14px] py-[5px] rounded-[6px] text-[0.78rem] font-semibold font-sans no-underline transition-opacity hover:opacity-90">Login</a>
          )}
          <button onClick={() => onTabChange("about")} className="bg-none border-none cursor-pointer text-[0.88rem] text-[var(--text-main)] font-sans font-medium whitespace-nowrap hover:text-[#1B2A47] transition-colors">About Us</button>
        </div>
      </nav>
    </header>
  );
}

function SearchResults({ query, onClose }: { query: string; onClose: () => void }) {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.trim().length < 2) return;
    setLoading(true);
    const q = query.toLowerCase();
    Promise.all([
      fetch("/api/articles?type=article&status=published").then(r => r.ok ? r.json() : []),
      fetch("/api/articles?type=short&status=published").then(r => r.ok ? r.json() : []),
      fetch("/api/articles?type=podcast&status=published").then(r => r.ok ? r.json() : []),
    ])
      .then(([articles, shorts, podcasts]) => {
        const all = [...(Array.isArray(articles) ? articles : []), ...(Array.isArray(shorts) ? shorts : []), ...(Array.isArray(podcasts) ? podcasts : [])];
        setResults(all.filter((c: any) =>
          c.title?.toLowerCase().includes(q) ||
          (c.tags ?? []).some((t: string) => t.toLowerCase().includes(q)) ||
          c.excerpt?.toLowerCase().includes(q)
        ).slice(0, 6));
      })
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [query]);

  const typeIcon = (t: string) => t === "article" ? "📄" : t === "podcast" ? "🎙" : "⚡";
  const typeHref = (c: any) => c.type === "podcast" ? `/podcasts/${c.slug}` : c.type === "short" ? `/shorts/${c.slug}` : `/article/${c.slug}`;

  if (loading) return <div className="px-[14px] py-[12px] font-sans text-[0.82rem] text-[var(--text-muted)] animate-pulse">Searching…</div>;
  if (!results.length) return <div className="px-[14px] py-[12px] font-sans text-[0.82rem] text-[var(--text-muted)]">No results for "{query}"</div>;

  return (
    <>
      {results.map((r, i) => (
        <a key={r._id ?? i} href={typeHref(r)} onClick={onClose} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", textDecoration: "none", color: "inherit", borderBottom: i < results.length - 1 ? "1px solid var(--border)" : "none", backgroundColor: "white" }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#faf9f7")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "white")}
        >
          <span style={{ fontSize: "0.9rem" }}>{typeIcon(r.type)}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.82rem", fontWeight: 600, color: "var(--text-main)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.title}</div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.68rem", color: "var(--text-muted)", marginTop: 1 }}>{(r.tags ?? [])[0] ?? r.type} · {r.type}</div>
          </div>
          <ChevronRight size={11} color="#aaa" />
        </a>
      ))}
    </>
  );
}
