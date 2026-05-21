"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onTabChange: (tab: string) => void;
  initialMode?: "menu" | "search";
}

const RED    = "#D92323";
const ACCENT = "#1B2A47";

type ContentFilter = "all" | "article" | "short" | "podcast";

interface Result {
  _id: string;
  title: string;
  type: string;
  slug: string;
}

// ── Motion Variants for Staggered Lists ──────────────────────────
const panelStaggerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
};

const panelItemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 350, damping: 25 },
  },
};

// ── Panel: Search ──────────────────────────────────────────────
function SearchPanel({ onClose }: { onClose: () => void }) {
  const [query, setQuery]         = useState("");
  const [filter, setFilter]       = useState<ContentFilter>("all");
  const [results, setResults]     = useState<Result[]>([]);
  const [loading, setLoading]     = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus on mount
  useEffect(() => { setTimeout(() => inputRef.current?.focus(), 80); }, []);

  // Fetch on query change
  useEffect(() => {
    if (query.trim().length < 2) { setResults([]); return; }
    setLoading(true);
    const q = query.toLowerCase();
    Promise.all([
      fetch("/api/articles?type=article&status=published").then(r => r.ok ? r.json() : []),
      fetch("/api/articles?type=short&status=published").then(r => r.ok ? r.json() : []),
      fetch("/api/articles?type=podcast&status=published").then(r => r.ok ? r.json() : []),
    ])
      .then(([articles, shorts, podcasts]) => {
        const all: Result[] = [
          ...(Array.isArray(articles) ? articles : []),
          ...(Array.isArray(shorts)   ? shorts   : []),
          ...(Array.isArray(podcasts) ? podcasts : []),
        ];
        setResults(
          all
            .filter((c: any) =>
              c.title?.toLowerCase().includes(q) ||
              (c.tags ?? []).some((t: string) => t.toLowerCase().includes(q)) ||
              c.excerpt?.toLowerCase().includes(q)
            )
            .slice(0, 20)
        );
      })
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [query]);

  const typeLabel = (t: string) =>
    t === "article" ? "Article" : t === "short" ? "Short Article" : "Podcast";

  const typeHref = (c: Result) =>
    c.type === "podcast" ? `/podcasts/${c.slug}` :
    c.type === "short"   ? `/shorts/${c.slug}`   :
    `/article/${c.slug}`;

  const filtered = filter === "all"
    ? results
    : results.filter(r =>
        filter === "article" ? r.type === "article" :
        filter === "short"   ? r.type === "short"   :
        r.type === "podcast"
      );

  const filters: { id: ContentFilter; label: string }[] = [
    { id: "article", label: "Article" },
    { id: "short",   label: "Short Article" },
    { id: "podcast", label: "Podcast" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>

      {/* Row 1: "Search" title + × close button */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "22px 22px 0" }}>
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "1rem", fontWeight: 700, color: "var(--text-main)" }}>Search</span>
        <motion.button 
          whileHover={{ scale: 1.15, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose} 
          style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-main)", padding: 0, display: "flex", fontSize: "1.1rem", lineHeight: 1 }}
        >
          ✕
        </motion.button>
      </div>

      {/* Row 2: search input — underline only */}
      <div style={{ padding: "14px 22px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, borderBottom: "1.5px solid var(--text-main)", paddingBottom: 10 }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === "Escape" && onClose()}
            placeholder="Search Here..."
            style={{
              flex: 1, background: "none", border: "none", outline: "none",
              fontFamily: "'Inter', sans-serif", fontSize: "0.88rem",
              color: "var(--text-main)", caretColor: RED,
            }}
          />
          {query && (
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setQuery("")} 
              style={{ background: "none", border: "none", cursor: "pointer", color: "#aaa", padding: 0, display: "flex", fontSize: "0.75rem" }}
            >
              ✕
            </motion.button>
          )}
        </div>
      </div>

      {/* Row 3: filters — active = black pill, inactive = plain text, | separator */}
      <div style={{ padding: "14px 22px 0", display: "flex", alignItems: "center", gap: 0 }}>
        {filters.map((f, i) => (
          <div key={f.id} style={{ display: "flex", alignItems: "center" }}>
            <motion.button
              onClick={() => setFilter(prev => prev === f.id ? "all" : f.id)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              style={{
                background: filter === f.id ? "#111" : "transparent",
                color: filter === f.id ? "white" : "var(--text-muted)",
                border: "none",
                cursor: "pointer",
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.78rem",
                fontWeight: filter === f.id ? 700 : 400,
                padding: filter === f.id ? "4px 12px" : "4px 0",
                borderRadius: filter === f.id ? 6 : 0,
                whiteSpace: "nowrap" as const,
                transition: "background-color 0.15s, color 0.15s",
              }}
            >
              {f.label}
            </motion.button>
            {i < filters.length - 1 && (
              <span style={{ color: "var(--border)", margin: "0 8px", fontSize: "0.9rem", userSelect: "none" }}>|</span>
            )}
          </div>
        ))}
      </div>


      {/* Results */}
      <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
        {loading && (
          <div style={{ padding: "16px 22px", fontFamily: "'Inter', sans-serif", fontSize: "0.82rem", color: "var(--text-muted)", opacity: 0.6 }}>Searching…</div>
        )}
        {!loading && query.trim().length > 1 && filtered.length === 0 && (
          <div style={{ padding: "16px 22px", fontFamily: "'Inter', sans-serif", fontSize: "0.82rem", color: "var(--text-muted)" }}>
            No results for "<strong>{query}</strong>"
          </div>
        )}
        
        <motion.div 
          variants={panelStaggerVariants} 
          initial="hidden" 
          animate="show"
        >
          {filtered.map((r, i) => (
            <motion.div
              key={r._id ?? i}
              variants={panelItemVariants}
              whileHover={{ x: 6, backgroundColor: "rgba(27,42,71,0.03)" }}
              whileTap={{ scale: 0.99 }}
              style={{ borderBottom: "1px solid var(--border)", cursor: "pointer", transition: "background-color 0.15s" }}
            >
              <a
                href={typeHref(r)}
                onClick={onClose}
                style={{ display: "block", padding: "12px 22px", textDecoration: "none", color: "inherit" }}
              >
                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "0.95rem", fontWeight: 400, color: "var(--text-main)", lineHeight: 1.3, marginBottom: 3 }}>
                  {r.title}
                </div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.68rem", color: "var(--text-muted)" }}>
                  {typeLabel(r.type)}
                </div>
              </a>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

// ── Panel: Menu ────────────────────────────────────────────────
function MenuPanel({ onClose, onTabChange }: { onClose: () => void; onTabChange: (t: string) => void }) {
  const { user, logout, isAdmin, isMainAdmin } = useAuth();

  const hasUsername = !!(user?.displayName?.trim());
  const displayName = hasUsername ? user!.displayName!.trim() : user?.email ?? "";

  const linkStyle: React.CSSProperties = {
    display: "block", textDecoration: "none", color: "var(--text-main)",
    fontFamily: "'Inter', sans-serif", fontSize: "1.05rem", fontWeight: 500,
    padding: "10px 0",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "28px 28px 0" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
        <svg width="22" height="16" viewBox="0 0 22 16" fill="none" stroke={RED} strokeWidth="2.2" strokeLinecap="round">
          <line x1="0" y1="2"  x2="22" y2="2"/>
          <line x1="0" y1="8"  x2="22" y2="8"/>
          <line x1="0" y1="14" x2="22" y2="14"/>
        </svg>
        <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: "1.15rem", color: RED, letterSpacing: "0.02em" }}>Menu</span>
      </div>

      {/* Nav links */}
      <motion.div 
        variants={panelStaggerVariants} 
        initial="hidden" 
        animate="show" 
        style={{ flex: 1 }}
      >
        <motion.div 
          variants={panelItemVariants}
          whileHover={{ x: 6 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          <Link href="/saved" onClick={onClose} style={linkStyle}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = RED}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "var(--text-main)"}
          >
            Saved Content
          </Link>
        </motion.div>
        <motion.div 
          variants={panelItemVariants}
          whileHover={{ x: 6 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          <Link href="/subscriptions" onClick={onClose} style={linkStyle}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = RED}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "var(--text-main)"}
          >
            My Subscriptions
          </Link>
        </motion.div>
      </motion.div>

      {/* ── Bottom pinned section ── */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12, type: "spring", stiffness: 350, damping: 26 }}
        style={{ borderTop: "1px solid var(--border)", paddingTop: 18, paddingBottom: 24 }}
      >
        {user ? (
          <>
            {/* User row: avatar + name + email */}
            <motion.div 
              whileHover={{ x: 2 }}
              style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}
            >
              {/* Avatar circle */}
              <div style={{ width: 38, height: 38, borderRadius: "50%", backgroundColor: "rgba(27,42,71,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.88rem", fontWeight: 700, color: "var(--text-main)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {hasUsername ? displayName : <span style={{ color: "#D92323" }}>No username</span>}
                </div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.68rem", color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {user.email}
                </div>
              </div>
            </motion.div>

            {/* Admin Panel button — outlined navy */}
            {isAdmin && (
              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/admin"
                  onClick={onClose}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    textDecoration: "none", color: ACCENT,
                    border: `1.5px solid ${ACCENT}`, borderRadius: 10,
                    fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", fontWeight: 600,
                    padding: "10px 0", marginBottom: 10, transition: "background 0.15s",
                  }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "rgba(27,42,71,0.06)"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
                >
                  {/* Shield icon */}
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                  Admin Panel
                </Link>
              </motion.div>
            )}

            {/* Manage Team button — for main admin only */}
            {isMainAdmin && (
              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/admin/team"
                  onClick={onClose}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    textDecoration: "none", color: ACCENT,
                    border: `1.5px solid ${ACCENT}`, borderRadius: 10,
                    fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", fontWeight: 600,
                    padding: "10px 0", marginBottom: 10, transition: "background 0.15s",
                  }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "rgba(27,42,71,0.06)"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
                >
                  {/* Users icon */}
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                  Manage Team
                </Link>
              </motion.div>
            )}

            {/* Sign out — outlined red */}
            <motion.button
              onClick={() => { logout(); onClose(); }}
              whileHover={{ scale: 1.01, backgroundColor: "rgba(224,85,85,0.05)" }}
              whileTap={{ scale: 0.98 }}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                width: "100%", background: "none",
                border: "1.5px solid rgba(224,85,85,0.4)", borderRadius: 10,
                cursor: "pointer",
                fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", fontWeight: 600,
                color: "#e05555", padding: "10px 0", transition: "border-color 0.15s, color 0.15s",
              }}
            >
              {/* Arrow-right-from-bracket icon */}
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Sign out
            </motion.button>
          </>
        ) : (
          /* Not logged in */
          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
            <a
              href="/login"
              onClick={onClose}
              style={{
                display: "block",
                textAlign: "center",
                backgroundColor: "#111",
                color: "white",
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.95rem",
                fontWeight: 600,
                textDecoration: "none",
                padding: "12px 0",
                borderRadius: 10,
                transition: "opacity 0.15s"
              }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = "0.85"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = "1"}
            >
              Login/Signup
            </a>
          </motion.div>
        )}
      </motion.div>

    </div>
  );
}

// ── Root SideMenu ──────────────────────────────────────────────
export default function SideMenu({ isOpen, onClose, onTabChange, initialMode = "menu" }: SideMenuProps) {
  const [panel, setPanel] = useState<"menu" | "search">(initialMode);

  // Sync panel to initialMode each time the drawer opens
  useEffect(() => {
    if (isOpen) setPanel(initialMode);
  }, [isOpen, initialMode]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop — subtle, not heavy dark overlay */}
          <motion.div
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            style={{
              position: "fixed", inset: 0,
              backgroundColor: "rgba(0,0,0,0.18)",
              zIndex: 99,
            }}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 240 }}
            style={{
              position: "fixed", top: 0, left: 0,
              width: 270, height: "100vh",
              backgroundColor: "var(--bg)",
              zIndex: 100,
              boxShadow: "4px 0 32px rgba(0,0,0,0.10)",
              display: "flex", flexDirection: "column",
              borderRight: "1px solid var(--border)",
            }}
          >
            <AnimatePresence mode="wait">
              {panel === "search" ? (
                <motion.div
                  key="search"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  transition={{ duration: 0.16, ease: "easeInOut" }}
                  style={{ height: "100%", display: "flex", flexDirection: "column" }}
                >
                  <SearchPanel onClose={onClose} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.16, ease: "easeInOut" }}
                  style={{ height: "100%", display: "flex", flexDirection: "column" }}
                >
                  <MenuPanel onClose={onClose} onTabChange={onTabChange} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
