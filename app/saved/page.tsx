"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";
import SideMenu from "@/components/layout/SideMenu";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase";

const ACCENT = "#1B2A47";
const RED    = "#D92323";
const TERRA  = "#D38B88";

interface SavedItem {
  _id: string;
  slug: string;
  title: string;
  excerpt?: string;
  coverImage?: string;
  author: string;
  type: "article" | "podcast" | "short";
  tags: string[];
  readTime?: string;
  duration?: string;
  publishedAt?: string;
  likes: number;
}

function Skeleton() {
  return (
    <div style={{ display: "flex", gap: 16, padding: "20px 0", borderBottom: "1px solid var(--border)" }}>
      <div style={{ width: 100, height: 68, borderRadius: 8, backgroundColor: "#e0ddd8", flexShrink: 0, animation: "pulse 1.5s ease-in-out infinite" }} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ height: 16, width: "70%", borderRadius: 4, backgroundColor: "#e0ddd8", animation: "pulse 1.5s ease-in-out infinite" }} />
        <div style={{ height: 12, width: "40%", borderRadius: 4, backgroundColor: "#e0ddd8", animation: "pulse 1.5s ease-in-out infinite" }} />
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
    <span style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "'Inter', sans-serif", color: s.color, backgroundColor: s.bg, padding: "2px 7px", borderRadius: 4 }}>
      {s.label}
    </span>
  );
}

export default function DesktopSavedPage() {
  const router   = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [items,   setItems]     = useState<SavedItem[]>([]);
  const [loading, setLoading]   = useState(true);
  const [removing, setRemoving] = useState<string | null>(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) router.replace("/login");
  }, [user, authLoading, router]);

  // Fetch saved articles
  useEffect(() => {
    if (!user) return;
    const fetchSaved = async () => {
      try {
        const token = await auth.currentUser?.getIdToken();
        const res = await fetch(`/api/saved`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setItems(Array.isArray(data) ? data : []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchSaved();
  }, [user]);

  const handleUnsave = async (slug: string) => {
    setRemoving(slug);
    try {
      const token = await auth.currentUser?.getIdToken();
      await fetch(`/api/articles/${slug}/save`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(prev => prev.filter(i => i.slug !== slug));
    } catch { /* silent */ }
    finally { setRemoving(null); }
  };

  const hrefFor = (item: SavedItem) =>
    item.type === "podcast" ? `/podcasts/${item.slug}`
    : item.type === "short" ? `/shorts/${item.slug}`
    : `/article/${item.slug}`;

  const dateStr = (d?: string) =>
    d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "";

  if (authLoading) return null;

  return (
    <>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>

      <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} onTabChange={(tab) => router.push(`/?tab=${tab}`)} />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
        <Header onMenuOpen={() => setMenuOpen(true)} activeTab="" onTabChange={(tab) => router.push(`/?tab=${tab}`)} />

        <div style={{ maxWidth: 720, margin: "0 auto 80px" }}>

          {/* Page header */}
          <div style={{ marginBottom: 32 }}>
            <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "2.2rem", fontWeight: 400, color: "var(--text-main)", marginBottom: 6 }}>
              Saved
            </h1>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", color: "var(--text-muted)", margin: 0 }}>
              {loading ? "Loading…" : `${items.length} ${items.length === 1 ? "item" : "items"} saved`}
            </p>
          </div>

          {/* List */}
          {loading ? (
            <>{[1,2,3,4].map(i => <Skeleton key={i} />)}</>
          ) : items.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
              <div style={{ fontSize: "3rem" }}>🔖</div>
              <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.4rem", fontWeight: 400, color: "var(--text-main)", margin: 0 }}>Nothing saved yet</h3>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.88rem", color: "var(--text-muted)", margin: 0 }}>
                Hit the bookmark button on any article or podcast to save it here.
              </p>
              <Link href="/" style={{ marginTop: 8, padding: "9px 20px", backgroundColor: "var(--text-main)", color: "white", borderRadius: 8, textDecoration: "none", fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", fontWeight: 600 }}>
                Browse content →
              </Link>
            </div>
          ) : (
            <div>
              {items.map((item, i) => (
                <div key={item._id} style={{ display: "flex", gap: 16, padding: "20px 0", borderBottom: i < items.length - 1 ? "1px solid var(--border)" : "none", alignItems: "flex-start" }}>
                  {/* Thumbnail */}
                  <Link href={hrefFor(item)} style={{ flexShrink: 0, display: "block" }}>
                    {item.coverImage ? (
                      <img src={item.coverImage} alt={item.title} style={{ width: 100, height: 68, objectFit: "cover", borderRadius: 8, display: "block" }} />
                    ) : (
                      <div style={{ width: 100, height: 68, backgroundColor: "#CFCBC3", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem" }}>
                        {item.type === "podcast" ? "🎙" : item.type === "short" ? "⚡" : "📄"}
                      </div>
                    )}
                  </Link>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 6, flexWrap: "wrap" }}>
                      <TypeBadge type={item.type} />
                      {item.tags[0] && (
                        <span style={{ fontSize: "0.62rem", fontWeight: 600, color: RED, fontFamily: "'Inter', sans-serif", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                          {item.tags[0]}
                        </span>
                      )}
                    </div>

                    <Link href={hrefFor(item)} style={{ textDecoration: "none", color: "inherit" }}>
                      <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.05rem", lineHeight: 1.3, color: "var(--text-main)", margin: "0 0 6px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>
                        {item.title}
                      </h3>
                    </Link>

                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                      <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontFamily: "'Inter', sans-serif" }}>
                        {item.author}
                      </span>
                      {item.publishedAt && (
                        <><span style={{ fontSize: "0.6rem", color: "var(--border)" }}>·</span>
                          <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontFamily: "'Inter', sans-serif" }}>{dateStr(item.publishedAt)}</span>
                        </>
                      )}
                      {(item.readTime || item.duration) && (
                        <><span style={{ fontSize: "0.6rem", color: "var(--border)" }}>·</span>
                          <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontFamily: "'Inter', sans-serif" }}>
                            {item.readTime ?? item.duration}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Unsave button */}
                  <button
                    onClick={() => handleUnsave(item.slug)}
                    disabled={removing === item.slug}
                    title="Remove from saved"
                    style={{ flexShrink: 0, width: 32, height: 32, borderRadius: 7, border: "1px solid var(--border)", backgroundColor: "transparent", color: "var(--text-muted)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.14s", opacity: removing === item.slug ? 0.4 : 1 }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "#fff0f0"; (e.currentTarget as HTMLElement).style.borderColor = "#e05555"; (e.currentTarget as HTMLElement).style.color = "#e05555"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"; }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
