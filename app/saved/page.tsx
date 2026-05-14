"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";
import SideMenu from "@/components/layout/SideMenu";
import Footer from "@/components/layout/Footer";
import MobileHeader from "@/components/mobile/MobileHeader";
import MobileSideMenu from "@/components/mobile/MobileSideMenu";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/auth/firebase";
import { useMobile } from "@/hooks/useMobile";
import { MoveLeft } from "lucide-react";

const ACCENT = "#1B2A47";
const RED = "#D92323";
const BLACK = "#111111";
const BG = "#f5f0eb";
const BORDER = "#e0d8d0";
const MUTED = "#666666";

interface SavedItem {
  _id: string; slug: string; title: string; excerpt?: string; coverImage?: string;
  author: string; type: "article" | "podcast" | "short"; tags: string[];
  readTime?: string; duration?: string; publishedAt?: string; likes: number;
}

function Skeleton() {
  return (
    <div style={{ display: "flex", gap: 16, padding: "18px 0", borderBottom: `1px solid ${BORDER}` }}>
      <div style={{ width: 90, height: 62, borderRadius: 6, backgroundColor: "#e0d8d0", flexShrink: 0, animation: "pulse 1.5s ease-in-out infinite" }} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ height: 14, width: "70%", borderRadius: 4, backgroundColor: "#e0d8d0", animation: "pulse 1.5s ease-in-out infinite" }} />
        <div style={{ height: 11, width: "40%", borderRadius: 4, backgroundColor: "#e0d8d0", animation: "pulse 1.5s ease-in-out infinite" }} />
      </div>
    </div>
  );
}

function TypeBadge({ type }: { type: string }) {
  const map: Record<string, { label: string; color: string }> = {
    article: { label: "Article", color: ACCENT },
    podcast: { label: "Podcast", color: "#3a7a3e" },
    short: { label: "Short", color: "#b85c58" },
  };
  const s = map[type] ?? map.article;
  return (
    <span style={{
      fontSize: "0.55rem", fontWeight: 800, textTransform: "uppercase",
      letterSpacing: "0.04em", fontFamily: "'Inter', sans-serif",
      color: s.color, backgroundColor: `${s.color}1A`,
      padding: "1px 7px", borderRadius: 999, whiteSpace: "nowrap"
    }}>
      {s.label}
    </span>
  );
}

function SavedList({
  items, onUnsave, removing, selected, onToggle, editMode, isMobile
}: {
  items: SavedItem[]; onUnsave: (slug: string) => void; removing: string | null;
  selected: string[]; onToggle: (slug: string) => void; editMode: boolean; isMobile: boolean;
}) {
  const dateStr = (d?: string) => d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "";
  const hrefFor = (item: SavedItem) => item.type === "podcast" ? `/podcasts/${item.slug}` : item.type === "short" ? `/shorts/${item.slug}` : `/article/${item.slug}`;

  if (items.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "60px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <div style={{ fontSize: "2.5rem" }}>🔖</div>
        <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.3rem", fontWeight: 400, color: BLACK, margin: 0 }}>Nothing saved yet</h3>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", color: MUTED, margin: 0 }}>Bookmark any article or podcast to find it here.</p>
        <Link href="/" style={{ marginTop: 8, padding: "9px 20px", backgroundColor: BLACK, color: "white", borderRadius: 8, textDecoration: "none", fontFamily: "'Inter', sans-serif", fontSize: "0.82rem", fontWeight: 600 }}>Browse content →</Link>
      </div>
    );
  }

  return (
    <div>
      {items.map((item, i) => {
        const isSel = selected.includes(item.slug);
        return (
          <div key={item._id} style={{ display: "flex", gap: 14, padding: "18px 0", borderBottom: i < items.length - 1 ? `1px solid ${BORDER}` : "none", alignItems: "flex-start", opacity: removing === item.slug ? 0.5 : 1, transition: "all 0.2s" }}>

            <Link href={hrefFor(item)} style={{ flexShrink: 0, display: "block" }}>
              {item.coverImage
                ? <img src={item.coverImage} alt={item.title} style={{ width: 88, height: 60, objectFit: "cover", borderRadius: 6, display: "block" }} />
                : <div style={{ width: 88, height: 60, backgroundColor: "#2a2a2a", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>
                  {item.type === "podcast" ? "🎙" : item.type === "short" ? "⚡" : "📄"}
                </div>
              }
            </Link>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5, flexWrap: "wrap" }}>
                <TypeBadge type={item.type} />
                {item.tags[0] && (
                  <span style={{
                    fontSize: "0.55rem", fontWeight: 800, color: RED,
                    fontFamily: "'Inter', sans-serif", textTransform: "uppercase",
                    letterSpacing: "0.04em", backgroundColor: `${RED}1A`,
                    padding: "1px 7px", borderRadius: 999, whiteSpace: "nowrap"
                  }}>
                    {item.tags[0]}
                  </span>
                )}
              </div>
              <Link href={hrefFor(item)} style={{ textDecoration: "none", color: "inherit" }}>
                <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "0.95rem", lineHeight: 1.3, color: BLACK, margin: "0 0 5px", fontWeight: 400, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" } as any}>
                  {item.title}
                </h3>
              </Link>
              <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", color: MUTED, fontFamily: "'Inter', sans-serif", fontSize: "0.68rem" }}>
                <span>{item.author}</span>
                {item.publishedAt && (
                  <>
                    <span style={{ fontSize: "1rem", lineHeight: 0, marginTop: -2, color: BORDER }}>·</span>
                    <span>{dateStr(item.publishedAt)}</span>
                  </>
                )}
              </div>
            </div>

            {/* Right side controls: Checkbox (editMode) or Unsave icon (normal) */}
            <div style={{ flexShrink: 0, width: 32, display: "flex", justifyContent: "flex-end", paddingTop: 2 }}>
              {editMode ? (
                <button
                  onClick={() => onToggle(item.slug)}
                  style={{
                    width: 32, height: 32, borderRadius: 8,
                    border: `1.5px solid ${isSel ? RED : BORDER}`,
                    backgroundColor: isSel ? RED : "white",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", padding: 0
                  }}
                >
                  {isSel && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4"><polyline points="20 6 9 17 4 12" /></svg>}
                </button>
              ) : (
                <button onClick={() => onUnsave(item.slug)} disabled={removing === item.slug} title="Remove"
                  style={{
                    width: 32, height: 32, borderRadius: 8,
                    border: "1px solid rgba(192,57,43,0.12)",
                    backgroundColor: "transparent", color: "#c0392b", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    opacity: removing === item.slug ? 0.4 : 1
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function SavedPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const isMobile = useMobile();

  const [desktopMenuOpen, setDesktopMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [items, setItems] = useState<SavedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<string | null>(null);
  const [selectedSlugs, setSelected] = useState<string[]>([]);
  const [bulkRemoving, setBulkRemoving] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) router.replace("/login");
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const token = await auth.currentUser?.getIdToken();
        const res = await fetch("/api/saved", { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) { const d = await res.json(); setItems(Array.isArray(d) ? d : []); }
      } catch { /* silent */ } finally { setLoading(false); }
    })();
  }, [user]);

  const handleUnsave = async (slug: string) => {
    if (removing || bulkRemoving) return;
    setRemoving(slug);
    try {
      const token = await auth.currentUser?.getIdToken();
      await fetch(`/api/articles/${slug}/save`, { method: "POST", headers: { Authorization: `Bearer ${token}` } });
      setItems(prev => prev.filter(i => i.slug !== slug));
      setSelected(prev => prev.filter(s => s !== slug));
    } catch { /* silent */ } finally { setRemoving(null); }
  };

  const handleToggle = (slug: string) => {
    setSelected(prev => prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]);
  };

  const handleSelectAll = () => {
    if (selectedSlugs.length === items.length) setSelected([]);
    else setSelected(items.map(i => i.slug));
  };

  const handleBulkUnsave = async () => {
    if (selectedSlugs.length === 0 || bulkRemoving) return;
    if (!confirm(`Are you sure you want to remove ${selectedSlugs.length} saved items?`)) return;
    setBulkRemoving(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      // Sequentially or concurrently? Concurrently for speed.
      await Promise.all(selectedSlugs.map(slug =>
        fetch(`/api/articles/${slug}/save`, { method: "POST", headers: { Authorization: `Bearer ${token}` } })
      ));
      setItems(prev => prev.filter(i => !selectedSlugs.includes(i.slug)));
      setSelected([]);
    } catch { /* silent */ } finally { setBulkRemoving(false); }
  };

  if (authLoading) return null;

  // ── Mobile ─────────────────────────────────────────────────
  if (isMobile) {
    return (
      <div style={{ backgroundColor: BG, minHeight: "100vh" }}>
        <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
        <MobileSideMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} onTabChange={(t) => router.push(`/?tab=${t}`)} onBeatSelect={() => router.push("/")} />
        <MobileHeader activeTab="" onTabChange={(t) => router.push(`/?tab=${t}`)} onMenuOpen={() => setMobileMenuOpen(true)} />
        <div style={{ padding: "12px 16px 60px" }}>
          <button onClick={() => router.back()} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", fontWeight: 600, color: MUTED, background: "none", border: `1px solid ${BORDER}`, borderRadius: 6, padding: "5px 12px", cursor: "pointer", marginBottom: 12 }}>
            <MoveLeft size={14} strokeWidth={2.5} /> Back
          </button>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.7rem", fontWeight: 400, color: BLACK, margin: 0 }}>Saved</h1>

            {!loading && items.length > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                {editMode && (
                  <>
                    {selectedSlugs.length > 0 && (
                      <button onClick={handleBulkUnsave} disabled={bulkRemoving} style={{ background: "none", border: "none", color: RED, fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", fontWeight: 700, cursor: "pointer" }}>
                        {bulkRemoving ? "Removing…" : "Remove"}
                      </button>
                    )}
                    <button onClick={handleSelectAll} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", color: BLACK, fontWeight: 700 }}>
                      {selectedSlugs.length === items.length ? "Deselect All" : "Select All"}
                    </button>
                  </>
                )}
                <button
                  onClick={() => { setEditMode(!editMode); if (editMode) setSelected([]); }}
                  style={{
                    background: "none", border: `1.2px solid ${editMode ? RED : BORDER}`,
                    borderRadius: 6, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", color: editMode ? RED : MUTED
                  }}
                >
                  {editMode ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                      <line x1="1" y1="1" x2="23" y2="23" strokeWidth="2.5" />
                    </svg>
                  )}
                </button>
              </div>
            )}
          </div>

          {loading ? [1, 2, 3].map(i => <Skeleton key={i} />) : <SavedList items={items} onUnsave={handleUnsave} removing={removing} selected={selectedSlugs} onToggle={handleToggle} editMode={editMode} isMobile={isMobile} />}
        </div>
      </div>
    );
  }

  // ── Desktop ─────────────────────────────────────────────────
  return (
    <>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
      <SideMenu isOpen={desktopMenuOpen} onClose={() => setDesktopMenuOpen(false)} onTabChange={(tab) => router.push(`/?tab=${tab}`)} />
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
        <Header onMenuOpen={() => setDesktopMenuOpen(true)} activeTab="" onTabChange={(tab) => router.push(`/?tab=${tab}`)} />
        <div style={{ maxWidth: 720, margin: "0 auto 80px" }}>
          <button onClick={() => router.back()} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", fontWeight: 600, color: MUTED, background: "none", border: `1px solid ${BORDER}`, borderRadius: 6, padding: "5px 12px", cursor: "pointer", marginBottom: 32 }}>
            <MoveLeft size={14} strokeWidth={2.5} /> Back
          </button>
          <div style={{ marginBottom: 32, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "2.2rem", fontWeight: 400, color: "var(--text-main)", margin: 0 }}>Saved</h1>
            {!loading && items.length > 0 && (
              <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
                {editMode && (
                  <>
                    {selectedSlugs.length > 0 && (
                      <button onClick={handleBulkUnsave} disabled={bulkRemoving} style={{ backgroundColor: RED, color: "white", border: "none", borderRadius: 8, padding: "8px 16px", fontFamily: "'Inter', sans-serif", fontSize: "0.82rem", fontWeight: 700, cursor: "pointer", transition: "opacity 0.2s", opacity: bulkRemoving ? 0.7 : 1 }}>
                        {bulkRemoving ? "Removing…" : "Remove "}
                      </button>
                    )}
                    <button onClick={handleSelectAll} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", color: "var(--text-main)", fontWeight: 600 }}>
                      {selectedSlugs.length === items.length ? "Deselect All" : "Select All"}
                    </button>
                  </>
                )}
                <button
                  onClick={() => { setEditMode(!editMode); if (editMode) setSelected([]); }}
                  style={{
                    background: "none", border: `1.5px solid ${editMode ? RED : "var(--border)"}`,
                    borderRadius: 8, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", color: editMode ? RED : "var(--text-muted)", transition: "all 0.2s"
                  }}
                  title={editMode ? "Cancel" : "Select Items"}
                >
                  {editMode ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                      <line x1="1" y1="1" x2="23" y2="23" strokeWidth="2.5" />
                    </svg>
                  )}
                </button>
              </div>
            )}
          </div>
          {loading ? [1, 2, 3, 4].map(i => <Skeleton key={i} />) : <SavedList items={items} onUnsave={handleUnsave} removing={removing} selected={selectedSlugs} onToggle={handleToggle} editMode={editMode} isMobile={isMobile} />}
        </div>
      </div>
      <Footer />
    </>
  );
}
