"use client";

import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";

const ADMIN_EMAIL = "opinionatedkalam@gmail.com";
const ACCENT = "#1B2A47";
const RED    = "#D92323";

const TABS = [
  { id: "home",     label: "Home" },
  { id: "recent",   label: "Recent Stories" },
  { id: "podcasts", label: "Podcasts" },
  { id: "shorts",   label: "Short Reads" },
  { id: "beats",    label: "Beats" },
];

interface HeaderProps {
  onMenuOpen: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Header({ onMenuOpen, activeTab, onTabChange }: HeaderProps) {
  const { user, logout } = useAuth();
  const [dateStr, setDateStr]           = useState("");
  const [searchOpen, setSearchOpen]     = useState(false);
  const [searchQuery, setSearchQuery]   = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef   = useRef<HTMLDivElement>(null);
  const inputRef    = useRef<HTMLInputElement>(null);
  const isAdmin     = user?.email === ADMIN_EMAIL;
  const displayName = user?.displayName?.split(" ")[0] ?? user?.email?.split("@")[0] ?? "";

  useEffect(() => {
    const d = new Date();
    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    const days   = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    setDateStr(`${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()} — ${days[d.getDay()]}`);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
        setSearchQuery("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const openSearch = () => {
    setSearchOpen(true);
    setTimeout(() => inputRef.current?.focus(), 20);
  };

  const closeSearch = () => {
    setSearchOpen(false);
    setSearchQuery("");
  };

  return (
    <header>
      {/* placeholder colour — must be in a real <style> tag */}
      <style>{`
        .ok-search::placeholder { color: #908e8a; }
        .ok-search:focus        { border-color: #908e8a !important; outline: none; }
      `}</style>

      {/* ── Title ── */}
      <div style={{ textAlign: "center", paddingTop: 24 }}>
        <button onClick={() => onTabChange("home")} style={{
          background: "none", border: "none", cursor: "pointer", padding: 0,
          fontFamily: "'DM Serif Display', serif",
          fontSize: "clamp(2rem, 4.5vw, 3.2rem)",
          fontWeight: 400, lineHeight: 1, letterSpacing: "-0.5px",
          color: "var(--text-main)", display: "block", margin: "0 auto",
        }}>
          Opinionated Kalam
        </button>
      </div>

      {/* ── Date + YouTube — bottom border ── */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "10px 0",
        borderBottom: "1px solid var(--border)",
      }}>
        <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontFamily: "'Inter', sans-serif" }}>
          {dateStr}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {isAdmin && (
            <a href="/admin" style={{
              backgroundColor: ACCENT, color: "white", padding: "4px 12px",
              borderRadius: 6, fontSize: "0.75rem", fontWeight: 600,
              fontFamily: "'Inter', sans-serif", textDecoration: "none",
            }}>Admin</a>
          )}
          <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: 32, height: 32, borderRadius: "50%",
            backgroundColor: "#FF0000", color: "white", flexShrink: 0,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </a>
        </div>
      </div>

      {/* ── Nav — 3-col grid keeps tabs perfectly centred ── */}
      <nav style={{
        display: "grid",
        gridTemplateColumns: "1fr auto 1fr",
        alignItems: "center",
        borderBottom: "1px solid var(--border)",
        padding: "10px 0",
        marginBottom: 32,
        position: "relative",
      }}>

        {/* LEFT — hamburger + search */}
        <div ref={searchRef} style={{ display: "flex", alignItems: "center", gap: 8, position: "relative" }}>

          {/* Hamburger */}
          <button onClick={onMenuOpen} style={{
            background: "none", border: "none", cursor: "pointer",
            color: "var(--text-main)", padding: 0, display: "flex", flexShrink: 0,
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6"  x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>

          {/* Search — closed: icon + hint text | open: styled input */}
          {searchOpen ? (
            /* ── OPEN: inline input, #d5d2cb border, #908e8a placeholder ── */
            <div style={{ position: "relative", width: 220 }}>
              <svg style={{
                position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)",
                color: "#908e8a", pointerEvents: "none",
              }} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Escape") closeSearch(); }}
                placeholder="Search..."
                className="ok-search"
                style={{
                  width: "100%",
                  padding: "6px 26px 6px 28px",
                  borderRadius: 8,
                  border: "1.5px solid #d5d2cb",
                  backgroundColor: "transparent",
                  fontSize: "0.84rem",
                  fontFamily: "'Inter', sans-serif",
                  color: "var(--text-main)",
                  boxSizing: "border-box",
                }}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} style={{
                  position: "absolute", right: 7, top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer",
                  color: "#908e8a", fontSize: "1rem", lineHeight: 1, padding: 0,
                }}>×</button>
              )}

              {/* Results dropdown */}
              {searchQuery.trim().length > 1 && (
                <div style={{
                  position: "absolute", top: "calc(100% + 6px)", left: 0,
                  width: 300, zIndex: 200,
                  backgroundColor: "white", borderRadius: 10,
                  border: "1px solid var(--border)",
                  boxShadow: "0 8px 28px rgba(0,0,0,0.1)",
                  overflow: "hidden",
                  animation: "fadeDown 0.13s ease",
                }}>
                  <style>{`@keyframes fadeDown{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}`}</style>
                  <SearchResults query={searchQuery} onClose={closeSearch} />
                </div>
              )}
            </div>
          ) : (
            /* ── CLOSED: original styling ── */
            <button onClick={openSearch} style={{
              background: "none", border: "none", cursor: "pointer", padding: 0,
              display: "flex", alignItems: "center", gap: 5,
            }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--text-main)" }}>
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
              <span style={{ fontSize: "0.85rem", fontFamily: "'Inter', sans-serif", color: "var(--text-main)" }}>
                Search
              </span>
            </button>
          )}
        </div>

        {/* CENTER — tabs (always centred by grid) */}
        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => onTabChange(tab.id)} style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: "0.88rem", fontWeight: isActive ? 700 : 500,
                color: isActive ? RED : "var(--text-main)",
                fontFamily: "'Inter', sans-serif", padding: 0, whiteSpace: "nowrap",
              }}>{tab.label}</button>
            );
          })}
        </div>

        {/* RIGHT — user/login (left of About Us), then About Us */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, justifyContent: "flex-end" }}>

          {user ? (
            <div ref={dropdownRef} style={{ position: "relative" }}>
              <button onClick={() => setDropdownOpen(o => !o)} style={{
                display: "flex", alignItems: "center", gap: 6,
                background: "none", border: "1px solid var(--border)", cursor: "pointer",
                padding: "5px 12px", borderRadius: 20, fontSize: "0.82rem",
                fontFamily: "'Inter', sans-serif", fontWeight: 600, color: "var(--text-main)",
                transition: "border-color 0.15s",
              }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--text-main)")}
                onMouseLeave={(e) => { if (!dropdownOpen) (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                </svg>
                {displayName}
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                  style={{ transform: dropdownOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.15s" }}>
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>

              {dropdownOpen && (
                <div style={{
                  position: "absolute", top: "calc(100% + 8px)", right: 0,
                  backgroundColor: "white", borderRadius: 10, minWidth: 160,
                  border: "1px solid var(--border)", boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  overflow: "hidden", zIndex: 50,
                  animation: "fadeDown 0.15s ease",
                }}>
                  <div style={{ padding: "10px 14px 8px", borderBottom: "1px solid var(--border)" }}>
                    <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-main)", fontFamily: "'Inter', sans-serif" }}>{displayName}</div>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontFamily: "'Inter', sans-serif", marginTop: 2 }}>{user.email}</div>
                  </div>
                  {[
                    { label: "Saved Articles",   href: "/saved"         },
                    { label: "My Subscriptions", href: "/subscriptions" },
                  ].map((item) => (
                    <a key={item.label} href={item.href} style={{
                      display: "flex", alignItems: "center",
                      padding: "10px 14px", textDecoration: "none", color: "var(--text-main)",
                      fontSize: "0.85rem", fontFamily: "'Inter', sans-serif",
                      borderBottom: "1px solid var(--border)", transition: "background 0.1s",
                    }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#faf9f7")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "white")}
                    >
                      {item.label}
                    </a>
                  ))}
                  <button onClick={() => { logout(); setDropdownOpen(false); }} style={{
                    display: "flex", alignItems: "center", gap: 10,
                    width: "100%", padding: "10px 14px", background: "none",
                    border: "none", cursor: "pointer", color: "#e05555",
                    fontSize: "0.85rem", fontFamily: "'Inter', sans-serif", textAlign: "left",
                  }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#fff5f5")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "white")}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <a href="/login" style={{
              backgroundColor: "var(--text-main)", color: "white",
              padding: "5px 14px", borderRadius: 6,
              fontSize: "0.78rem", fontWeight: 600,
              fontFamily: "'Inter', sans-serif", textDecoration: "none",
            }}>Login</a>
          )}

          {/* About Us — always rightmost */}
          <button style={{
            background: "none", border: "none", cursor: "pointer",
            fontSize: "0.88rem", color: "var(--text-main)",
            fontFamily: "'Inter', sans-serif", fontWeight: 500, whiteSpace: "nowrap",
          }}>
            About Us
          </button>
        </div>
      </nav>
    </header>
  );
}

/* ── Search Results ── */
const ALL_CONTENT = [
  { type: "article", slug: "indians-are-sunroof-suckers",                                          title: "Indians are Sunroof-Suckers?",                                tag: "Automotive"   },
  { type: "article", slug: "how-volkswagen-fooled-the-american-government-for-7-years",            title: "How Volkswagen fooled the American Government for 7 Years?", tag: "Scandals"     },
  { type: "article", slug: "pakistan-vs-afghanistan-war-might-change-pak-forever-officials-worry", title: "Pakistan vs Afghanistan War",                                  tag: "Geo Politics" },
  { type: "article", slug: "why-is-japan-so-prone-to-earthquakes-explained",                       title: "Why is Japan so Prone to Earthquakes? Explained",             tag: "Explainers"   },
  { type: "short",   slug: "quick-fact-sunroofs-vs-ac-efficiency",                                 title: "Quick Fact: Sunroofs vs. AC Efficiency",                      tag: "Automotive"   },
  { type: "short",   slug: "timeline-vw-scandal",                                                  title: "Timeline: VW Scandal",                                        tag: "Scandals"     },
  { type: "short",   slug: "why-japan-gets-1-500-earthquakes-a-year",                              title: "Why Japan Gets 1,500 Earthquakes a Year",                     tag: "Explainers"   },
  { type: "short",   slug: "pak-afghan-border-key-facts",                                          title: "Pak-Afghan Border: Key Facts",                                 tag: "Geo Politics" },
];

function SearchResults({ query, onClose }: { query: string; onClose: () => void }) {
  const q       = query.toLowerCase();
  const results = ALL_CONTENT.filter(
    c => c.title.toLowerCase().includes(q) || c.tag.toLowerCase().includes(q)
  ).slice(0, 6);

  const typeIcon = (t: string) => t === "article" ? "📄" : t === "podcast" ? "🎙" : "⚡";
  const typeHref = (c: typeof ALL_CONTENT[0]) =>
    c.type === "article" ? `/article/${c.slug}` : `/shorts/${c.slug}`;

  if (!results.length) return (
    <div style={{ padding: "12px 14px", fontFamily: "'Inter', sans-serif", fontSize: "0.82rem", color: "var(--text-muted)" }}>
      No results for "{query}"
    </div>
  );

  return (
    <>
      {results.map((r, i) => (
        <a key={i} href={typeHref(r)} onClick={onClose} style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "10px 14px", textDecoration: "none", color: "inherit",
          borderBottom: i < results.length - 1 ? "1px solid var(--border)" : "none",
          backgroundColor: "white",
        }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#faf9f7")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "white")}
        >
          <span style={{ fontSize: "0.9rem" }}>{typeIcon(r.type)}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.82rem", fontWeight: 600, color: "var(--text-main)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {r.title}
            </div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.68rem", color: "var(--text-muted)", marginTop: 1 }}>
              {r.tag} · {r.type}
            </div>
          </div>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </a>
      ))}
    </>
  );
}