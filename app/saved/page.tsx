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
import { auth } from "@/lib/firebase";
import { useMobile } from "@/hooks/useMobile";

const ACCENT = "#1B2A47";
const RED    = "#D92323";
const BLACK  = "#111111";
const BG     = "#f5f0eb";
const BORDER = "#e0d8d0";
const MUTED  = "#666666";

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
  const map: Record<string, { label: string; color: string; bg: string }> = {
    article: { label: "Article", color: ACCENT,    bg: "rgba(27,42,71,0.1)" },
    podcast: { label: "Podcast", color: "#3a7a3e", bg: "rgba(76,140,80,0.1)" },
    short:   { label: "Short",   color: "#b85c58", bg: "rgba(184,92,88,0.1)" },
  };
  const s = map[type] ?? map.article;
  return (
    <span style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "'Inter', sans-serif", color: s.color, backgroundColor: s.bg, padding: "2px 7px", borderRadius: 4 }}>
      {s.label}
    </span>
  );
}

function SavedList({ items, onUnsave, removing }: { items: SavedItem[]; onUnsave: (slug: string) => void; removing: string | null }) {
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
      {items.map((item, i) => (
        <div key={item._id} style={{ display: "flex", gap: 14, padding: "16px 0", borderBottom: i < items.length - 1 ? `1px solid ${BORDER}` : "none", alignItems: "flex-start" }}>
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
              {item.tags[0] && <span style={{ fontSize: "0.6rem", fontWeight: 700, color: RED, fontFamily: "'Inter', sans-serif", textTransform: "uppercase", letterSpacing: "0.04em" }}>{item.tags[0]}</span>}
            </div>
            <Link href={hrefFor(item)} style={{ textDecoration: "none", color: "inherit" }}>
              <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "0.95rem", lineHeight: 1.3, color: BLACK, margin: "0 0 5px", fontWeight: 400, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" } as any}>
                {item.title}
              </h3>
            </Link>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span style={{ fontSize: "0.67rem", color: MUTED, fontFamily: "'Inter', sans-serif" }}>{item.author}</span>
              {item.publishedAt && <><span style={{ fontSize: "0.6rem", color: BORDER }}>·</span><span style={{ fontSize: "0.67rem", color: MUTED, fontFamily: "'Inter', sans-serif" }}>{dateStr(item.publishedAt)}</span></>}
            </div>
          </div>
          <button onClick={() => onUnsave(item.slug)} disabled={removing === item.slug} title="Remove"
            style={{ flexShrink: 0, width: 30, height: 30, borderRadius: 6, border: "1px solid rgba(192,57,43,0.25)", backgroundColor: "transparent", color: "#c0392b", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: removing === item.slug ? 0.4 : 1 }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
          </button>
        </div>
      ))}
    </div>
  );
}

export default function SavedPage() {
  const router   = useRouter();
  const { user, loading: authLoading } = useAuth();
  const isMobile = useMobile();

  const [desktopMenuOpen, setDesktopMenuOpen] = useState(false);
  const [mobileMenuOpen,  setMobileMenuOpen]  = useState(false);
  const [items,    setItems]    = useState<SavedItem[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [removing, setRemoving] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) router.replace("/login");
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const token = await auth.currentUser?.getIdToken();
        const res   = await fetch("/api/saved", { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) { const d = await res.json(); setItems(Array.isArray(d) ? d : []); }
      } catch { /* silent */ } finally { setLoading(false); }
    })();
  }, [user]);

  const handleUnsave = async (slug: string) => {
    setRemoving(slug);
    try {
      const token = await auth.currentUser?.getIdToken();
      await fetch(`/api/articles/${slug}/save`, { method: "POST", headers: { Authorization: `Bearer ${token}` } });
      setItems(prev => prev.filter(i => i.slug !== slug));
    } catch { /* silent */ } finally { setRemoving(null); }
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
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.7rem", fontWeight: 400, color: BLACK, marginBottom: 4 }}>Saved</h1>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", color: MUTED, marginBottom: 20 }}>
            {loading ? "Loading…" : `${items.length} ${items.length === 1 ? "item" : "items"}`}
          </p>
          {loading ? [1, 2, 3].map(i => <Skeleton key={i} />) : <SavedList items={items} onUnsave={handleUnsave} removing={removing} />}
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
          <div style={{ marginBottom: 32 }}>
            <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "2.2rem", fontWeight: 400, color: "var(--text-main)", marginBottom: 6 }}>Saved</h1>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", color: "var(--text-muted)", margin: 0 }}>
              {loading ? "Loading…" : `${items.length} ${items.length === 1 ? "item" : "items"} saved`}
            </p>
          </div>
          {loading ? [1, 2, 3, 4].map(i => <Skeleton key={i} />) : <SavedList items={items} onUnsave={handleUnsave} removing={removing} />}
        </div>
      </div>
      <Footer />
    </>
  );
}
