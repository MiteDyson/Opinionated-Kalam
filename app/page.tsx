"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import SideMenu from "@/components/layout/SideMenu";
import Footer from "@/components/layout/Footer";

function toSlug(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const HERO = {
  title: "Indians are Sunroof-Suckers?",
  excerpt: "Indians are preferring to have a sunroof, as a feature in their cars, than features that may value or be a necessity to the user. In 2021, sunroof penetration in cars was 17.8%, and by 2025, ...",
  author: "Vineet Mestry", date: "5 March, 2026",
  image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1280&h=720&q=80",
};

const OTHER_STORIES = [
  { title: "How Volkswagen fooled the American Government for 7 Years?", date: "7 March, 2026", image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" },
  { title: "Pakistan vs Afghanistan War might change Pak forever, Officials worry?", date: "3 March, 2026", image: "https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" },
  { title: "Why is Japan so Prone to Earthquakes? Explained", date: "2 March, 2026", image: "https://images.unsplash.com/photo-1498036882173-b41c28af5c01?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" },
  { title: "Why is Japan so Prone to Earthquakes? Explained", date: "2 March, 2026", image: "https://images.unsplash.com/photo-1498036882173-b41c28af5c01?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" },
];

const PODCASTS = [
  { title: "Why is Japan so Prone to Earthquakes? Explained", current: "10:25", total: "15:00", progress: 69, desc: "Japan faces plenty of earthquakes on a regular basis. Due to its unfortunate geological position, the country tackles hundreds moderate to deadly earthquakes annually.", image: "https://images.unsplash.com/photo-1498036882173-b41c28af5c01?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" },
  { title: "How Volkswagen fooled the American Government for 7 Years?", current: "15:00", total: "15:00", progress: 100, desc: "This podcast digs into the unethical doing of Volkswagen. With the intention of saving hundred thousands, how the brand lost millions.", image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" },
];

const RECENT = [
  { title: "Indians are Sunroof-Suckers?", date: "5 March, 2026", author: "Vineet Mestry", excerpt: "Indians are preferring to have a sunroof as a feature in their cars, than features that may value or be a necessity to the user.", image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
  { title: "How Volkswagen Fooled the American Government?", date: "3 March, 2026", author: "Vineet Mestry", excerpt: "A deep dive into the Dieselgate scandal. How one of the world's largest automakers bypassed emissions tests for years.", image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
  { title: "Pakistan vs Afghanistan War Might Change Pak Forever", date: "1 March, 2026", author: "Vineet Mestry", excerpt: "Border tensions have escalated into a situation that military analysts believe could alter the stability of the entire region.", image: "https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
];

const SHORTS = [
  { title: "Quick Fact: Sunroofs vs. AC Efficiency", excerpt: "In a 40C climate, a glass roof requires your AC to work 15% harder.", readTime: "2 min read" },
  { title: "Timeline: VW Scandal", excerpt: "A quick chronological look at how the EPA caught the cheat devices in 2015.", readTime: "3 min read" },
  { title: "Why Japan Gets 1,500 Earthquakes a Year", excerpt: "A fast explainer on tectonic plate convergence and what it means for daily life.", readTime: "2 min read" },
  { title: "Pak-Afghan Border: Key Facts", excerpt: "The Durand Line, tribal tensions, and why this border has always been volatile.", readTime: "4 min read" },
];

function ReadPill({ children = "Read" }: { children?: string }) {
  return (
    <span style={{
      display: "inline-block", padding: "3px 12px", borderRadius: 999,
      fontSize: "0.68rem", fontWeight: 600, textTransform: "uppercase" as const,
      letterSpacing: "0.05em", fontFamily: "'Inter', sans-serif", cursor: "pointer",
      backgroundColor: "var(--terracotta)", color: "var(--text-main)",
    }}>
      {children}
    </span>
  );
}

function SectionLabel({ children }: { children: string }) {
  return (
    <div style={{
      fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: "20px",
      letterSpacing: "0.04em", textTransform: "uppercase" as const,
      color: "#1B2A47", marginBottom: 14,
    }}>
      {children} →
    </div>
  );
}

function PodcastCard({ p }: { p: typeof PODCASTS[0] }) {
  return (
    <article style={{ backgroundColor: "#CCD8C7", borderRadius: 10, padding: 14, display: "flex", gap: 14, alignItems: "stretch" }}>
      <div style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
        <img src={p.image} alt={p.title} style={{ width: 130, height: 100, objectFit: "cover", borderRadius: 8, display: "block" }} />
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", minWidth: 0, gap: 4 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.05rem", lineHeight: 1.2, color: "var(--text-main)", margin: 0 }}>
            {p.title}
          </h3>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <span style={{ color: "#FF3131", fontSize: "0.72rem", fontWeight: 700, fontFamily: "'Inter', sans-serif" }}>{p.current}</span>
            <span style={{ color: "var(--text-muted)", fontSize: "0.7rem", fontFamily: "'Inter', sans-serif" }}>/</span>
            <span style={{ color: "var(--text-muted)", fontSize: "0.72rem", fontFamily: "'Inter', sans-serif" }}>{p.total}</span>
            <button style={{ backgroundColor: "var(--text-main)", color: "white", fontSize: "0.7rem", fontWeight: 600, padding: "3px 13px", borderRadius: 4, border: "none", cursor: "pointer", fontFamily: "'Inter', sans-serif" }}>
              Listen
            </button>
          </div>
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", lineHeight: 1.55, fontFamily: "'Inter', sans-serif", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden", margin: 0 }}>
            {p.desc}
          </p>
        </div>
        <div style={{ height: 3, display: "flex", borderRadius: 2, overflow: "hidden" }}>
          <div style={{ width: `${p.progress}%`, backgroundColor: "#FF3131" }} />
          <div style={{ flex: 1, backgroundColor: "#1A1A1A" }} />
        </div>
      </div>
    </article>
  );
}

function HomeView() {
  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "1.8fr 1fr", gap: 0, marginBottom: 48 }}>
        {/* LEFT — Latest Story */}
        <div style={{ paddingRight: 28, borderRight: "1px solid var(--border)" }}>
          <SectionLabel>Latest Story</SectionLabel>
          <Link href="/article/indians-are-sunroof-suckers" style={{ textDecoration: "none", color: "inherit" }}>
            <article style={{ display: "flex", flexDirection: "column", gap: 11, cursor: "pointer" }}>
              <img src={HERO.image} alt={HERO.title} style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", borderRadius: 8 }} />
              <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.9rem", lineHeight: 1.1, marginTop: 4, color: "var(--text-main)" }}>
                {HERO.title}
              </h2>
              <div style={{ fontSize: "0.73rem", color: "var(--text-muted)", fontFamily: "'Inter', sans-serif" }}>
                {HERO.date} &nbsp;&nbsp; {HERO.author}
              </div>
              <p style={{ fontSize: "0.88rem", color: "var(--text-main)", lineHeight: 1.7, fontFamily: "'Inter', sans-serif" }}>
                {HERO.excerpt}
              </p>
              <div style={{ marginTop: 4 }}><ReadPill>Read Further</ReadPill></div>
            </article>
          </Link>
        </div>

        {/* RIGHT — Other Stories, gap increased to 28px */}
        <div style={{ paddingLeft: 24 }}>
          <SectionLabel>Other Stories</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            {OTHER_STORIES.map((a, i) => (
              <Link key={i} href={`/article/${toSlug(a.title)}`} style={{ textDecoration: "none", color: "inherit" }}>
                <article style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <img src={a.image} alt={a.title} style={{ width: 80, height: 56, objectFit: "cover", borderRadius: 6, flexShrink: 0 }} />
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                    <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "0.95rem", lineHeight: 1.3, color: "var(--text-main)", margin: 0 }}>
                      {a.title}
                    </h3>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: "0.65rem", color: "var(--text-muted)", fontFamily: "'Inter', sans-serif" }}>{a.date}</span>
                      <ReadPill />
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <hr style={{ border: "none", borderTop: "1px solid var(--border)", marginBottom: 40 }} />

      <section style={{ marginBottom: 60 }}>
        <SectionLabel>Latest Podcasts</SectionLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {PODCASTS.map((p, i) => <PodcastCard key={i} p={p} />)}
        </div>
      </section>
    </>
  );
}

function RecentView() {
  return (
    <div>
      <div style={{ borderBottom: "1px solid var(--border)", paddingBottom: 10, marginBottom: 32 }}>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "2rem" }}>Recent Stories</h1>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "48px 28px", marginBottom: 60 }}>
        {RECENT.map((a, i) => (
          <Link key={i} href={`/article/${toSlug(a.title)}`} style={{ textDecoration: "none", color: "inherit" }}>
            <article style={{ display: "flex", flexDirection: "column", gap: 14, cursor: "pointer" }}>
              <img src={a.image} alt={a.title} style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", borderRadius: 8 }} />
              <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.5rem", lineHeight: 1.2 }}>{a.title}</h2>
              <div style={{ fontSize: "0.73rem", color: "var(--text-muted)", fontFamily: "'Inter', sans-serif" }}>{a.date} · {a.author}</div>
              <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.75 }}>{a.excerpt}</p>
              <div><ReadPill /></div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}

function PodcastsView() {
  return (
    <div>
      <div style={{ borderBottom: "1px solid var(--border)", paddingBottom: 10, marginBottom: 32 }}>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "2rem" }}>Podcasts</h1>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 60 }}>
        {PODCASTS.map((p, i) => <PodcastCard key={i} p={p} />)}
      </div>
    </div>
  );
}

function ShortsView() {
  return (
    <div>
      <div style={{ borderBottom: "1px solid var(--border)", paddingBottom: 10, marginBottom: 32 }}>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "2rem" }}>Short Reads</h1>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 24, marginBottom: 60 }}>
        {SHORTS.map((s, i) => (
          <Link key={i} href={`/shorts/${toSlug(s.title)}`} style={{ textDecoration: "none", color: "inherit" }}>
            <article style={{
              display: "flex", flexDirection: "column", gap: 10, padding: 20,
              border: "1px solid var(--border)", borderRadius: 8, cursor: "pointer",
              transition: "border-color 0.2s", height: "100%",
            }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--text-main)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--border)")}
            >
              <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.2rem", lineHeight: 1.2 }}>{s.title}</h2>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.6 }}>{s.excerpt}</p>
              <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "auto", paddingTop: 6, fontFamily: "'Inter', sans-serif" }}>{s.readTime}</div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);

  const renderTab = () => {
    switch (activeTab) {
      case "home":     return <HomeView />;
      case "recent":   return <RecentView />;
      case "podcasts": return <PodcastsView />;
      case "shorts":   return <ShortsView />;
      default:         return <HomeView />;
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
