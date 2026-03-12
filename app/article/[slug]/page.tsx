"use client";

import { useRouter, useParams } from "next/navigation";
import { useState } from "react";
import Header from "@/components/layout/Header";
import SideMenu from "@/components/layout/SideMenu";
import Footer from "@/components/layout/Footer";

const ACCENT = "#1B2A47";

const ARTICLES = [
  {
    slug: "indians-are-sunroof-suckers",
    title: "Indians are Sunroof-Suckers?",
    date: "5 March, 2026", author: "Vineet Mestry", readTime: "4 min read",
    tags: ["Automotive", "India"],
    image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1280&h=720&q=80",
    content: `<p>In India, for most buyers, a car is a luxury rather than a utility. They buy it more as a flex than an actual mode of transport. But having more absolutely makes sense when you want things that actually matter. In a country where temperatures jump around 40°C, what would you go for — a Sunroof or Ventilated Seats?</p><p>In a survey, 70% voted for Ventilated Seats, yet cars with sunroofs are selling out. Probably 95% of people buying sunroofs only do it to stick out of it. It feels fresh until a cop stops you and fines you for dangerous driving under the Motor Vehicle Act.</p><h3>The Numbers Don't Lie</h3><p>In 2021, sunroof penetration in cars was 17.8%. By 2025, that number has grown dramatically. Manufacturers have caught on — it's become a key sales lever even in entry-level segments, despite the obvious climate mismatch.</p>`,
  },
  {
    slug: "how-volkswagen-fooled-the-american-government-for-7-years",
    title: "How Volkswagen fooled the American Government for 7 Years?",
    date: "7 March, 2026", author: "Vineet Mestry", readTime: "6 min read",
    tags: ["Scandals", "Automotive"],
    image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1280&h=720&q=80",
    content: `<p>In 2015, the EPA issued a notice of violation to Volkswagen Group. The charge? Using a "defeat device" in their diesel engines to bypass emissions standards. For seven years, VW marketed their cars as "Clean Diesel" while secretly emitting up to 40 times the permitted levels of nitrogen oxide.</p><p>This wasn't a glitch; it was a deliberate software code designed to recognise when the car was on a testing stand. The fallout cost VW over $30 billion in fines and shattered consumer trust in diesel technology forever.</p><h3>How It Unravelled</h3><p>Independent researchers at West Virginia University first spotted the discrepancy in 2014. When the EPA threatened to withhold certification for 2016 models, VW had nowhere to hide.</p>`,
  },
  {
    slug: "pakistan-vs-afghanistan-war-might-change-pak-forever-officials-worry",
    title: "Pakistan vs Afghanistan War might change Pak forever, Officials worry?",
    date: "3 March, 2026", author: "Vineet Mestry", readTime: "5 min read",
    tags: ["Geo Politics"],
    image: "https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1280&h=720&q=80",
    content: `<p>The Durand Line, the disputed 2,640-kilometer border between Afghanistan and Pakistan, has historically been a flashpoint. Recent military skirmishes indicate a severe breakdown in diplomatic relations.</p><p>Officials worry that if the localised conflicts escalate into a full-blown geopolitical crisis, the ramifications will destabilise the entire South Asian region.</p><h3>What's at Stake</h3><p>Any full escalation would force regional powers — India, China, and Iran — to take sides, redrawing the geopolitical map of South Asia entirely.</p>`,
  },
  {
    slug: "why-is-japan-so-prone-to-earthquakes-explained",
    title: "Why is Japan so Prone to Earthquakes? Explained",
    date: "2 March, 2026", author: "Vineet Mestry", readTime: "4 min read",
    tags: ["Explainers"],
    image: "https://images.unsplash.com/photo-1498036882173-b41c28af5c01?ixlib=rb-4.0.3&auto=format&fit=crop&w=1280&h=720&q=80",
    content: `<p>Japan experiences hundreds of tremors a year because it sits squarely on the "Pacific Ring of Fire." Specifically, it rests on a complex intersection of four major tectonic plates: the Pacific, Philippine Sea, Eurasian, and North American plates.</p><p>As these plates grind, subduct, and catch on one another, massive amounts of stress build up. When that stress releases, the earth shakes.</p><h3>Living With It</h3><p>Japanese architecture, emergency preparedness culture, and early warning systems are among the most advanced in the world — born out of necessity over centuries of seismic activity.</p>`,
  },
];

function Tag({ label }: { label: string }) {
  return (
    <span style={{
      display: "inline-block", padding: "3px 10px", borderRadius: 4,
      fontSize: "0.65rem", fontWeight: 600, textTransform: "uppercase" as const,
      letterSpacing: "0.05em", fontFamily: "'Inter', sans-serif",
      backgroundColor: "rgba(27,42,71,0.1)", color: ACCENT,
    }}>
      {label}
    </span>
  );
}

export default function ArticlePage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;
  const [menuOpen, setMenuOpen] = useState(false);

  // Interaction state
  const [liked, setLiked]   = useState(false);
  const [saved, setSaved]   = useState(false);
  const [likes, setLikes]   = useState(142);
  const [copied, setCopied] = useState(false);

  const article = ARTICLES.find(a => a.slug === slug) ?? ARTICLES[0];

  const handleLike = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback for older browsers
      const el = document.createElement("textarea");
      el.value = url;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const actionBtn = (active: boolean): React.CSSProperties => ({
    display: "flex", alignItems: "center", gap: 7,
    padding: "8px 16px", borderRadius: 8, cursor: "pointer",
    fontFamily: "'Inter', sans-serif", fontSize: "0.82rem", fontWeight: 600,
    border: `1px solid ${active ? "var(--text-main)" : "var(--border)"}`,
    backgroundColor: active ? "var(--text-main)" : "transparent",
    color: active ? "white" : "var(--text-main)",
    transition: "all 0.15s",
  });

  return (
    <>
      <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} onTabChange={() => router.push("/")} />
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
        <Header onMenuOpen={() => setMenuOpen(true)} activeTab="" onTabChange={() => router.push("/")} />

        <div style={{ maxWidth: 800, margin: "0 auto 80px" }}>

          {/* Back */}
          <button onClick={() => router.back()} style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            fontSize: "0.9rem", fontWeight: 600, color: "var(--text-muted)",
            background: "none", border: "1px solid transparent", borderRadius: 4,
            padding: "5px 10px", cursor: "pointer", marginBottom: 30,
            fontFamily: "'Inter', sans-serif", transition: "all 0.2s",
          }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.color = "var(--text-main)";
              el.style.borderColor = "var(--border)";
              el.style.background = "rgba(0,0,0,0.03)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.color = "var(--text-muted)";
              el.style.borderColor = "transparent";
              el.style.background = "none";
            }}
          >
            <svg viewBox="0 0 24 24" style={{ width: 16, height: 16, stroke: "currentColor", strokeWidth: 2, fill: "none" }}>
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back to list
          </button>

          {/* Tags */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
            {article.tags.map(t => <Tag key={t} label={t} />)}
          </div>

          {/* Title */}
          <div style={{ textAlign: "center", marginBottom: 30 }}>
            <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "3rem", lineHeight: 1.1, marginBottom: 15, color: "var(--text-main)" }}>
              {article.title}
            </h1>
            <div style={{ display: "flex", justifyContent: "center", gap: 20, color: "var(--text-muted)", fontSize: "0.88rem", fontFamily: "'Inter', sans-serif" }}>
              <span>{article.date}</span>
              <span style={{ opacity: 0.4 }}>|</span>
              <span>{article.author}</span>
              <span style={{ opacity: 0.4 }}>|</span>
              <span>{article.readTime}</span>
            </div>
          </div>

          {/* Hero image */}
          <img src={article.image} alt={article.title} style={{
            width: "100%", aspectRatio: "16/9", objectFit: "cover",
            borderRadius: 4, display: "block", marginBottom: 40,
          }} />

          {/* Body */}
          <div className="article-body" dangerouslySetInnerHTML={{ __html: article.content }} />

          {/* ── Action bar: Like, Save, Share ── */}
          <div style={{
            display: "flex", alignItems: "center", gap: 12,
            marginTop: 48, paddingTop: 32,
            borderTop: "1px solid var(--border)",
          }}>
            {/* Like */}
            <button style={actionBtn(liked)} onClick={handleLike}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              {likes.toLocaleString()} Likes
            </button>

            {/* Save */}
            <button style={actionBtn(saved)} onClick={() => setSaved(!saved)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
              </svg>
              {saved ? "Saved" : "Save"}
            </button>

            {/* Share */}
            <button style={actionBtn(copied)} onClick={handleShare}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
              </svg>
              {copied ? "Link Copied!" : "Share"}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
