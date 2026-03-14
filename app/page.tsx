"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";
import SideMenu from "@/components/layout/SideMenu";
import Footer from "@/components/layout/Footer";
import { auth } from "@/lib/firebase";

function toSlug(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const ACCENT   = "#1B2A47";
const TERRA    = "#D38B88";
const ALL_TAGS = ["Automotive","Geo Politics","Scandals","Crime","Explainers"];

interface Article {
  _id: string; slug: string; title: string; excerpt: string;
  coverImage: string; author: string; tags: string[];
  type: string; readTime: string; publishedAt: string;
  likes: number; episode?: string; duration?: string;
  audioUrl?: string;
}

/* ── Shared UI ── */
function ReadPill({ children = "Read" }: { children?: string }) {
  return (
    <span style={{ display: "inline-block", padding: "3px 12px", borderRadius: 999, fontSize: "0.68rem", fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.05em", fontFamily: "'Inter', sans-serif", cursor: "pointer", backgroundColor: TERRA, color: "#1A1A1A" }}>
      {children}
    </span>
  );
}

function SectionLabel({ children }: { children: string }) {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: "20px", letterSpacing: "0.04em", textTransform: "uppercase" as const, color: ACCENT, marginBottom: 14 }}>
      {children} →
    </div>
  );
}

function PodcastCard({ a }: { a: Article }) {
  const [playing, setPlaying] = useState(false);
  return (
    <article style={{ backgroundColor: "#CCD8C7", borderRadius: 10, padding: 14, display: "flex", gap: 14 }}>
      <img src={a.coverImage} alt={a.title} style={{ width: 130, height: 100, objectFit: "cover", borderRadius: 8, flexShrink: 0 }} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", minWidth: 0 }}>
        <div>
          {a.tags[0] && (
            <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "#D92323", fontFamily: "'Inter', sans-serif", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>
              {a.tags[0]}{a.episode ? ` → ${a.episode}` : ""}
            </div>
          )}
          <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1rem", lineHeight: 1.25, color: "#1A1A1A", margin: "0 0 6px" }}>{a.title}</h3>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button onClick={() => setPlaying(p => !p)} style={{ width: 30, height: 30, borderRadius: "50%", backgroundColor: "#1A1A1A", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
              {playing
                ? <svg width="10" height="10" viewBox="0 0 24 24" fill="white"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                : <svg width="10" height="10" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              }
            </button>
            <span style={{ fontSize: "0.72rem", color: "#555", fontFamily: "'Inter', sans-serif" }}>
              {a.duration ?? "–"} / {a.duration ?? "–"}
            </span>
          </div>
          <p style={{ fontSize: "0.75rem", color: "#555", lineHeight: 1.55, fontFamily: "'Inter', sans-serif", margin: "6px 0 0", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>
            {a.excerpt}
          </p>
        </div>
        <div style={{ height: 3, display: "flex", borderRadius: 2, overflow: "hidden", marginTop: 8 }}>
          <div style={{ width: "0%", backgroundColor: "#FF3131" }} />
          <div style={{ flex: 1, backgroundColor: "#1A1A1A" }} />
        </div>
      </div>
    </article>
  );
}

/* ── Beats view ── */
function BeatsView({ articles, podcasts, shorts }: { articles: Article[]; podcasts: Article[]; shorts: Article[] }) {
  const [selectedTag, setSelectedTag] = useState(ALL_TAGS[0]);

  const filtered = {
    articles: articles.filter(a => a.tags.includes(selectedTag)),
    podcasts: podcasts.filter(a => a.tags.includes(selectedTag)),
    shorts:   shorts.filter(a => a.tags.includes(selectedTag)),
  };

  const hasContent = filtered.articles.length + filtered.podcasts.length + filtered.shorts.length > 0;

  return (
    <div>
      <div style={{ borderBottom: "1px solid var(--border)", paddingBottom: 10, marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "2rem", marginBottom: 6 }}>Beats</h1>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", color: "#555", margin: 0 }}>
          Filter all content by topic
        </p>
      </div>

      {/* Tag selector */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 36 }}>
        {ALL_TAGS.map(tag => (
          <button key={tag} onClick={() => setSelectedTag(tag)} style={{
            padding: "8px 18px", borderRadius: 999, cursor: "pointer",
            border: `2px solid ${selectedTag === tag ? ACCENT : "var(--border)"}`,
            backgroundColor: selectedTag === tag ? ACCENT : "white",
            color: selectedTag === tag ? "white" : "#555",
            fontSize: "0.83rem", fontWeight: 700, fontFamily: "'Inter', sans-serif",
            transition: "all 0.15s",
          }}>
            {tag}
          </button>
        ))}
      </div>

      {!hasContent ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#aaa", fontFamily: "'Inter', sans-serif", fontSize: "0.9rem" }}>
          No content tagged "{selectedTag}" yet.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 48, marginBottom: 60 }}>

          {/* Articles */}
          {filtered.articles.length > 0 && (
            <section>
              <SectionLabel>Articles</SectionLabel>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "32px 24px" }}>
                {filtered.articles.map(a => (
                  <Link key={a._id} href={`/article/${a.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                    <article style={{ display: "flex", flexDirection: "column", gap: 10, cursor: "pointer" }}>
                      {a.coverImage && <img src={a.coverImage} alt={a.title} style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", borderRadius: 8 }} />}
                      <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.3rem", lineHeight: 1.2, margin: 0 }}>{a.title}</h3>
                      <p style={{ fontSize: "0.83rem", color: "#555", lineHeight: 1.6, margin: 0 }}>{a.excerpt}</p>
                      <ReadPill />
                    </article>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Podcasts */}
          {filtered.podcasts.length > 0 && (
            <section>
              <SectionLabel>Podcasts</SectionLabel>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {filtered.podcasts.map(a => <PodcastCard key={a._id} a={a} />)}
              </div>
            </section>
          )}

          {/* Short Reads */}
          {filtered.shorts.length > 0 && (
            <section>
              <SectionLabel>Short Reads</SectionLabel>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 20 }}>
                {filtered.shorts.map(a => (
                  <Link key={a._id} href={`/shorts/${a.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                    <article style={{ display: "flex", flexDirection: "column", gap: 10, padding: 20, border: "1px solid var(--border)", borderRadius: 8, cursor: "pointer", height: "100%" }}>
                      <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.1rem", lineHeight: 1.2, margin: 0 }}>{a.title}</h3>
                      <p style={{ fontSize: "0.82rem", color: "#555", lineHeight: 1.6, margin: 0 }}>{a.excerpt}</p>
                      <div style={{ fontSize: "0.7rem", color: "#aaa", marginTop: "auto", paddingTop: 6, fontFamily: "'Inter', sans-serif" }}>{a.readTime}</div>
                    </article>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Root ── */
export default function HomePage() {
  const searchParams = useSearchParams();
  const initialTab   = searchParams?.get("tab") ?? "home";

  const [activeTab, setActiveTab] = useState(initialTab);
  const [menuOpen, setMenuOpen]   = useState(false);

  const [articles, setArticles] = useState<Article[]>([]);
  const [podcasts, setPodcasts] = useState<Article[]>([]);
  const [shorts,   setShorts]   = useState<Article[]>([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const uid = auth.currentUser?.uid ?? "";
        const uidQ = uid ? `&uid=${uid}` : "";
        const [artRes, podRes, shrRes] = await Promise.all([
          fetch(`/api/articles?type=article&status=published${uidQ}`),
          fetch(`/api/articles?type=podcast&status=published${uidQ}`),
          fetch(`/api/articles?type=short&status=published${uidQ}`),
        ]);
        const [art, pod, shr] = await Promise.all([artRes.json(), podRes.json(), shrRes.json()]);
        setArticles(Array.isArray(art) ? art : []);
        setPodcasts(Array.isArray(pod) ? pod : []);
        setShorts(Array.isArray(shr) ? shr : []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const hero        = articles[0];
  const otherStories = articles.slice(1, 5);

  const renderTab = () => {
    if (loading) return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 300 }}>
        <div style={{ fontFamily: "'Inter', sans-serif", color: "#aaa", fontSize: "0.9rem" }}>Loading...</div>
      </div>
    );

    switch (activeTab) {
      case "home": return (
        <>
          {/* Latest Story + Other Stories */}
          {hero && (
            <div style={{ display: "grid", gridTemplateColumns: "1.8fr 1fr", gap: 0, marginBottom: 48 }}>
              <div style={{ paddingRight: 28, borderRight: "1px solid var(--border)" }}>
                <SectionLabel>Latest Story</SectionLabel>
                <Link href={`/article/${hero.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <article style={{ display: "flex", flexDirection: "column", gap: 11, cursor: "pointer" }}>
                    {hero.coverImage && <img src={hero.coverImage} alt={hero.title} style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", borderRadius: 8 }} />}
                    <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.9rem", lineHeight: 1.1, margin: "4px 0 0", color: "var(--text-main)" }}>{hero.title}</h2>
                    <div style={{ fontSize: "0.73rem", color: "var(--text-muted)", fontFamily: "'Inter', sans-serif" }}>
                      {new Date(hero.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })} &nbsp;&nbsp; {hero.author}
                    </div>
                    <p style={{ fontSize: "0.88rem", color: "var(--text-main)", lineHeight: 1.7, fontFamily: "'Inter', sans-serif", margin: 0 }}>{hero.excerpt}</p>
                    <div style={{ marginTop: 4 }}><ReadPill>Read Further</ReadPill></div>
                  </article>
                </Link>
              </div>

              <div style={{ paddingLeft: 24 }}>
                <SectionLabel>Other Stories</SectionLabel>
                <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                  {otherStories.map(a => (
                    <Link key={a._id} href={`/article/${a.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                      <article style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                        {a.coverImage && <img src={a.coverImage} alt={a.title} style={{ width: 80, height: 56, objectFit: "cover", borderRadius: 6, flexShrink: 0 }} />}
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                          <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "0.95rem", lineHeight: 1.3, color: "var(--text-main)", margin: 0 }}>{a.title}</h3>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ fontSize: "0.65rem", color: "var(--text-muted)", fontFamily: "'Inter', sans-serif" }}>
                              {new Date(a.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                            </span>
                            <ReadPill />
                          </div>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          {podcasts.length > 0 && (
            <>
              <hr style={{ border: "none", borderTop: "1px solid var(--border)", marginBottom: 40 }} />
              <section style={{ marginBottom: 60 }}>
                <SectionLabel>Latest Podcasts</SectionLabel>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {podcasts.slice(0, 2).map(p => <PodcastCard key={p._id} a={p} />)}
                </div>
              </section>
            </>
          )}
        </>
      );

      case "recent": return (
        <div>
          <div style={{ borderBottom: "1px solid var(--border)", paddingBottom: 10, marginBottom: 32 }}>
            <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "2rem" }}>Recent Stories</h1>
          </div>
          {articles.length === 0 ? (
            <p style={{ color: "#aaa", fontFamily: "'Inter', sans-serif" }}>No articles yet.</p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "48px 28px", marginBottom: 60 }}>
              {articles.map(a => (
                <Link key={a._id} href={`/article/${a.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <article style={{ display: "flex", flexDirection: "column", gap: 14, cursor: "pointer" }}>
                    {a.coverImage && <img src={a.coverImage} alt={a.title} style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", borderRadius: 8 }} />}
                    <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.5rem", lineHeight: 1.2, margin: 0 }}>{a.title}</h2>
                    <div style={{ fontSize: "0.73rem", color: "var(--text-muted)", fontFamily: "'Inter', sans-serif" }}>
                      {new Date(a.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} · {a.author}
                    </div>
                    <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.75, margin: 0 }}>{a.excerpt}</p>
                    <ReadPill />
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      );

      case "podcasts": return (
        <div>
          <div style={{ borderBottom: "1px solid var(--border)", paddingBottom: 10, marginBottom: 32 }}>
            <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "2rem" }}>Podcasts</h1>
          </div>
          {podcasts.length === 0 ? (
            <p style={{ color: "#aaa", fontFamily: "'Inter', sans-serif" }}>No podcasts yet.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 60 }}>
              {podcasts.map(p => <PodcastCard key={p._id} a={p} />)}
            </div>
          )}
        </div>
      );

      case "shorts": return (
        <div>
          <div style={{ borderBottom: "1px solid var(--border)", paddingBottom: 10, marginBottom: 32 }}>
            <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "2rem" }}>Short Reads</h1>
          </div>
          {shorts.length === 0 ? (
            <p style={{ color: "#aaa", fontFamily: "'Inter', sans-serif" }}>No short reads yet.</p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 24, marginBottom: 60 }}>
              {shorts.map(s => (
                <Link key={s._id} href={`/shorts/${s.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <article style={{ display: "flex", flexDirection: "column", gap: 10, padding: 20, border: "1px solid var(--border)", borderRadius: 8, cursor: "pointer", height: "100%" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--text-main)")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--border)")}
                  >
                    <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.2rem", lineHeight: 1.2, margin: 0 }}>{s.title}</h2>
                    <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.6, margin: 0 }}>{s.excerpt}</p>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "auto", paddingTop: 6, fontFamily: "'Inter', sans-serif" }}>{s.readTime}</div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      );

      case "beats": return <BeatsView articles={articles} podcasts={podcasts} shorts={shorts} />;

      default: return null;
    }
  };

  return (
    <>
      <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} onTabChange={setActiveTab} />
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
        <Header onMenuOpen={() => setMenuOpen(true)} activeTab={activeTab} onTabChange={setActiveTab} />
        <main key={activeTab} style={{ animation: "fadeIn 0.3s ease forwards" }}>
          <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}`}</style>
          {renderTab()}
        </main>
      </div>
      <Footer />
    </>
  );
}
