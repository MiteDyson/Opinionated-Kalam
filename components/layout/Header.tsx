"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Menu, Search, ChevronRight, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  onSearchOpen?: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const dropdownStaggerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.05,
    },
  },
};

const dropdownItemVariants = {
  hidden: { opacity: 0, x: 8 },
  show: {
    opacity: 1,
    x: 0,
    transition: { type: "spring" as const, stiffness: 350, damping: 25 },
  },
};

export default function Header({ onMenuOpen, onSearchOpen, activeTab, onTabChange }: HeaderProps) {
  const router = useRouter();
  const { user, logout, isAdmin, isMainAdmin } = useAuth();
  const [dateStr, setDateStr] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const hasUsername = !!(user?.displayName?.trim());
  const displayName = hasUsername ? user!.displayName!.trim().slice(0, 18) : "Set name";

  useEffect(() => {
    const d = new Date();
    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    const days   = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    setDateStr(`${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()} — ${days[d.getDay()]}`);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header>

      <div className="text-center pt-6">
        <button onClick={() => onTabChange("home")} className="bg-none border-none cursor-pointer p-0 font-serif text-[clamp(2rem,4.5vw,3.2rem)] font-normal leading-none tracking-[-0.5px] text-[var(--text-main)] flex items-center justify-center gap-4 mx-auto whitespace-nowrap">
          <img src="/logo.png" alt="OK Logo" style={{ height: "clamp(1.8rem, 4vw, 2.8rem)", width: "auto" }} />
          Opinionated Kalam
        </button>
      </div>

      <div className="flex items-center justify-between py-[10px] border-b border-[var(--border)]">
        <span className="text-[0.78rem] text-[var(--text-muted)] font-sans">{dateStr}</span>
        {/* Social icons only — Admin button moved to SideMenu */}
        <div className="flex items-center gap-[8px]">
          {/* Instagram — bare icon, no circle */}
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center text-[var(--text-main)] shrink-0 hover:opacity-60 transition-opacity p-[3px]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
          </a>
          {/* X (Twitter) — bare icon, no circle */}
          <a href="https://www.x.com" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center text-[var(--text-main)] shrink-0 hover:opacity-60 transition-opacity p-[3px]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </a>
          {/* YouTube — bare icon, red brand color */}
          <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center text-[#FF0000] shrink-0 hover:opacity-60 transition-opacity p-[3px]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
          </a>
        </div>
      </div>

      <nav className="grid grid-cols-[1fr_auto_1fr] items-center py-[10px] mb-8 relative">
        <div className="flex items-center gap-2">
          <button onClick={onMenuOpen} className="bg-none border-none cursor-pointer text-[var(--text-main)] p-0 flex shrink-0 hover:text-[#1B2A47] transition-colors">
            <Menu size={20} />
          </button>
          {/* Search button — opens side drawer in search mode */}
          <button onClick={onSearchOpen} className="bg-none border-none cursor-pointer p-0 flex items-center gap-[5px] group ml-1">
            <Search size={15} className="text-[var(--text-main)] group-hover:text-[#1B2A47] transition-colors" />
            <span className="text-[0.85rem] font-sans text-[var(--text-main)] group-hover:text-[#1B2A47] transition-colors">Search</span>
          </button>
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
              <motion.button
                onClick={() => setDropdownOpen(o => !o)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className={`flex items-center gap-[6px] bg-none border ${
                  !hasUsername ? "border-[#D92323]/60 text-[#D92323]" : "border-[var(--border)] text-[var(--text-main)]"
                } cursor-pointer px-[12px] py-[5px] rounded-full text-[0.82rem] font-sans font-semibold transition-all hover:bg-black/5`}
              >
                {displayName}
                {!hasUsername && <span className="ml-1 text-[0.62rem] text-[#D92323]">!</span>}
              </motion.button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute top-[calc(100%+8px)] right-0 bg-white rounded-[10px] min-w-[180px] border border-[var(--border)] shadow-[0_4px_20px_rgba(0,0,0,0.1)] overflow-hidden z-[50] py-1"
                  >
                    <div className="px-[14px] pt-[10px] pb-[8px] border-b border-[var(--border)]">
                      <div className="text-[0.78rem] font-bold text-[var(--text-main)] font-sans">
                        {hasUsername ? displayName : <span className="text-[#D92323]">No username set</span>}
                      </div>
                      <div className="text-[0.7rem] text-[var(--text-muted)] font-sans mt-[2px]">{user.email}</div>
                    </div>
                    
                    <motion.div variants={dropdownStaggerVariants} initial="hidden" animate="show">
                      {[{ label: "Saved Articles", href: "/saved" }, { label: "My Subscriptions", href: "/subscriptions" }].map((item) => (
                        <motion.div key={item.label} variants={dropdownItemVariants} whileTap={{ scale: 0.97 }}>
                          <Link href={item.href} className="flex items-center px-[14px] py-[10px] no-underline text-[var(--text-main)] text-[0.85rem] font-sans border-b border-[var(--border)] transition-colors hover:bg-[#faf9f7]">
                            {item.label} <ChevronRight size={12} className="ml-auto text-[var(--text-muted)]" />
                          </Link>
                        </motion.div>
                      ))}
                      
                      <motion.div variants={dropdownItemVariants} whileTap={{ scale: 0.97 }}>
                        <button
                          onClick={() => { logout(); setDropdownOpen(false); }}
                          className="flex items-center w-full px-[14px] py-[10px] bg-none border-none cursor-pointer text-[#e05555] text-[0.85rem] font-sans text-left transition-colors hover:bg-[#fff5f5]"
                        >
                          Sign out
                        </button>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link href="/login" className="bg-[var(--text-main)] text-white px-[14px] py-[5px] rounded-[6px] text-[0.78rem] font-semibold font-sans no-underline transition-opacity hover:opacity-90">Login</Link>
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
        <Link key={r._id ?? i} href={typeHref(r)} onClick={onClose} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", textDecoration: "none", color: "inherit", borderBottom: i < results.length - 1 ? "1px solid var(--border)" : "none", backgroundColor: "white" }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#faf9f7")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "white")}
        >
          <span style={{ fontSize: "0.9rem" }}>{typeIcon(r.type)}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.82rem", fontWeight: 600, color: "var(--text-main)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.title}</div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.68rem", color: "var(--text-muted)", marginTop: 1 }}>{(r.tags ?? [])[0] ?? r.type} · {r.type}</div>
          </div>
          <ChevronRight size={11} color="#aaa" />
        </Link>
      ))}
    </>
  );
}
