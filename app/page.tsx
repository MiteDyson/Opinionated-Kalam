"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import SideMenu from "@/components/layout/SideMenu";
import Footer from "@/components/layout/Footer";

/* ─────────────────────────────────────────────────────────
   Mock data
───────────────────────────────────────────────────────── */
const HERO = {
  title: "Indians are Sunroof-Suckers?",
  excerpt:
    "Indians are preferring to have a sunroof as a feature in their cars over features that may actually be necessities. In 2021, sunroof penetration was 17.8%, and by 2025 it has risen to 27.4%...",
  author: "Vineet Mestry",
  date: "5 March, 2026",
  image:
    "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80",
};

const SIDE_ARTICLES = [
  {
    title: "How Volkswagen Fooled the American Government for 7 Years?",
    date: "5 March, 2026",
    author: "Vineet Mestry",
    image:
      "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    pill: "Read",
    pillOutline: false,
  },
  {
    title: "Pakistan vs Afghanistan War Might Change Pak Forever, Officials Worry",
    date: "5 March, 2026",
    author: "Vineet Mestry",
    image:
      "https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    pill: "Read",
    pillOutline: false,
  },
  {
    title: "Why is Japan so Prone to Earthquakes? Explained",
    date: "10:00 Video Format",
    author: "",
    image:
      "https://images.unsplash.com/photo-1498036882173-b41c28af5c01?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    pill: "Watch Ad Free",
    pillOutline: true,
  },
];

const RECENT = [
  {
    title: "Indians are Sunroof-Suckers?",
    date: "5 March, 2026",
    author: "Vineet Mestry",
    excerpt: "Indians are preferring to have a sunroof as a feature in their cars...",
    image:
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "How Volkswagen Fooled the American Government?",
    date: "3 March, 2026",
    author: "Vineet Mestry",
    excerpt:
      "A deep dive into the Dieselgate scandal. How one of the world's largest automakers bypassed emissions...",
    image:
      "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "Pakistan vs Afghanistan War Might Change Pak Forever",
    date: "1 March, 2026",
    author: "Vineet Mestry",
    excerpt:
      "Border tensions have escalated into a situation that military analysts believe could alter the stability...",
    image:
      "https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
  },
];

const VIDEOS = [
  {
    title: "Why is Japan so Prone to Earthquakes? Explained",
    duration: "10:45",
    category: "Mini Documentary",
    image:
      "https://images.unsplash.com/photo-1498036882173-b41c28af5c01?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "The Great Dieselgate Scam Breakdown",
    duration: "15:20",
    category: "Automotive",
    image:
      "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
  },
];

const SHORTS = [
  {
    title: "Quick Fact: Sunroofs vs. AC Efficiency",
    excerpt:
      "In a 40°C climate, a glass roof requires your AC to work 15% harder, draining battery life on EVs.",
    readTime: "2 min read",
  },
  {
    title: "Timeline: VW Scandal",
    excerpt:
      "A quick chronological look at how the EPA caught the cheat devices in 2015.",
    readTime: "3 min read",
  },
  {
    title: "Why Japan Gets 1,500 Earthquakes a Year",
    excerpt:
      "A fast explainer on tectonic plate convergence and what it means for daily life in Japan.",
    readTime: "2 min read",
  },
  {
    title: "Pak-Afghan Border: Key Facts",
    excerpt:
      "The Durand Line, tribal tensions, and why this border has always been volatile.",
    readTime: "4 min read",
  },
];

/* ─────────────────────────────────────────────────────────
   Pill components
───────────────────────────────────────────────────────── */
function Pill({ outline, children, small }: { outline?: boolean; children: React.ReactNode; small?: boolean }) {
  const base: React.CSSProperties = {
    display: "inline-block",
    padding: small ? "3px 10px" : "4px 14px",
    borderRadius: 999,
    fontSize: small ? "0.65rem" : "0.72rem",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    cursor: "pointer",
    fontFamily: "'Inter', sans-serif",
  };

  if (outline) {
    return (
      <span style={{ ...base, border: "1px solid var(--text-main)", color: "var(--text-main)", background: "transparent" }}>
        {children}
      </span>
    );
  }
  return (
    <span style={{ ...base, backgroundColor: "var(--terracotta)", color: "var(--text-main)" }}>
      {children}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────
   Tab views
───────────────────────────────────────────────────────── */
function HomeView() {
  return (
    <div style={{ display: "flex", gap: 40, marginBottom: 60, flexWrap: "wrap" }}>
      {/* Main hero article */}
      <article style={{ flex: "1 1 55%", minWidth: 280, display: "flex", flexDirection: "column", gap: 14 }}>
        <img
          src={HERO.image}
          alt={HERO.title}
          style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", borderRadius: 2, display: "block" }}
        />
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", lineHeight: 1.1 }}>
          {HERO.title}
        </h2>
        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
          {HERO.date} &nbsp;&nbsp; {HERO.author}
        </div>
        <p style={{
          fontSize: "0.9rem",
          color: "var(--text-muted)",
          display: "-webkit-box",
          WebkitLineClamp: 4,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}>
          {HERO.excerpt}
        </p>
        <div><Pill>Read further</Pill></div>
      </article>

      {/* Side articles */}
      <aside style={{
        flex: "1 1 35%",
        minWidth: 260,
        display: "flex",
        flexDirection: "column",
        gap: 0,
        paddingLeft: "clamp(20px, 4vw, 40px)",
        borderLeft: "2px solid var(--text-main)",
      }}>
        {SIDE_ARTICLES.map((a, i) => (
          <article
            key={i}
            style={{
              display: "flex",
              gap: 14,
              alignItems: "center",
              borderBottom: i < SIDE_ARTICLES.length - 1 ? "1px solid var(--border)" : "none",
              paddingBottom: 18,
              marginBottom: 18,
            }}
          >
            <img
              src={a.image}
              alt={a.title}
              style={{ width: 130, height: 78, objectFit: "cover", borderRadius: 2, flexShrink: 0 }}
            />
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.05rem", lineHeight: 1.2 }}>
                {a.title}
              </h3>
              <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                {a.date}{a.author ? ` · ${a.author}` : ""}
              </div>
              <div><Pill small outline={a.pillOutline}>{a.pill}</Pill></div>
            </div>
          </article>
        ))}
      </aside>
    </div>
  );
}

function RecentView() {
  return (
    <div>
      <div style={{ borderBottom: "1px solid var(--border)", paddingBottom: 10, marginBottom: 30 }}>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "2rem" }}>Recent Stories</h1>
      </div>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: "40px 30px",
        marginBottom: 60,
      }}>
        {RECENT.map((a, i) => (
          <article key={i} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <img
              src={a.image}
              alt={a.title}
              style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", borderRadius: 2 }}
            />
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.4rem", lineHeight: 1.2 }}>
              {a.title}
            </h2>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "flex", gap: 10 }}>
              <span>{a.date}</span><span>{a.author}</span>
            </div>
            <p style={{
              fontSize: "0.9rem",
              color: "var(--text-muted)",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}>
              {a.excerpt}
            </p>
            <div><Pill>Read</Pill></div>
          </article>
        ))}
      </div>
    </div>
  );
}

function VideosView() {
  return (
    <div>
      <div style={{ borderBottom: "1px solid var(--border)", paddingBottom: 10, marginBottom: 30 }}>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "2rem" }}>Video Essays & Reports</h1>
      </div>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: "40px 30px",
        marginBottom: 60,
      }}>
        {VIDEOS.map((v, i) => (
          <article key={i} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ position: "relative" }}>
              <img
                src={v.image}
                alt={v.title}
                style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", borderRadius: 2 }}
              />
              {/* Play button */}
              <div style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 52,
                height: 52,
                backgroundColor: "rgba(0,0,0,0.72)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}>
                <svg viewBox="0 0 24 24" fill="white" style={{ width: 20, height: 20, marginLeft: 3 }}>
                  <path d="M5 3l14 9-14 9V3z"/>
                </svg>
              </div>
            </div>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.4rem", lineHeight: 1.2 }}>
              {v.title}
            </h2>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "flex", gap: 10 }}>
              <span>{v.duration} Duration</span><span>{v.category}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function ShortsView() {
  return (
    <div>
      <div style={{ borderBottom: "1px solid var(--border)", paddingBottom: 10, marginBottom: 30 }}>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "2rem" }}>Short Reads</h1>
      </div>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
        gap: "30px 24px",
        marginBottom: 60,
      }}>
        {SHORTS.map((s, i) => (
          <article
            key={i}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              padding: "20px",
              border: "1px solid var(--border)",
              borderRadius: 4,
              cursor: "pointer",
              transition: "border-color 0.2s",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--text-main)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--border)")}
          >
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.25rem", lineHeight: 1.2 }}>
              {s.title}
            </h2>
            <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
              {s.excerpt}
            </p>
            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "auto", paddingTop: 6 }}>
              {s.readTime}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Main page
───────────────────────────────────────────────────────── */
export default function HomePage() {
  const [activeTab, setActiveTab] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);

  const renderTab = () => {
    switch (activeTab) {
      case "home":    return <HomeView />;
      case "recent":  return <RecentView />;
      case "videos":  return <VideosView />;
      case "shorts":  return <ShortsView />;
      default:        return <HomeView />;
    }
  };

  return (
    <>
      <SideMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        onTabChange={setActiveTab}
      />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
        <Header
          onMenuOpen={() => setMenuOpen(true)}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <main key={activeTab} style={{ animation: "fadeIn 0.35s ease forwards" }}>
          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(6px); }
              to   { opacity: 1; transform: translateY(0); }
            }
          `}</style>
          {renderTab()}
        </main>
      </div>

      <Footer />
    </>
  );
}
