"use client";

import { useRouter, useParams } from "next/navigation";
import Header from "@/components/layout/Header";
import SideMenu from "@/components/layout/SideMenu";
import Footer from "@/components/layout/Footer";
import { useState } from "react";

const ARTICLES = [
  { slug: "indians-are-sunroof-suckers",
    title: "Indians are Sunroof-Suckers?", date: "5 March, 2026", author: "Vineet Mestry",
    image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1280&h=720&q=80",
    content: `<p>In India, for most buyers, a car is a luxury rather than a utility. They buy it more as a flex than an actual mode of transport. But having more absolutely makes sense when you want things that actually matter. In a country where temperatures jump around 40°C, what would you go for — a Sunroof or Ventilated Seats?</p><p>In a survey, 70% voted for Ventilated Seats, yet cars with sunroofs are selling out! Probably 95% of people buying sunroofs only do it to stick out of it. It feels fresh until a cop stops you and fines you ₹5000 for dangerous driving under the Motor Vehicle Act.</p><h3>The Numbers Don't Lie</h3><p>In 2021, sunroof penetration in cars was 17.8%. By 2025, that number has grown dramatically. Manufacturers have caught on — it's become a key sales lever even in entry-level segments, despite the obvious climate mismatch.</p>` },
  { slug: "how-volkswagen-fooled-the-american-government-for-7-years",
    title: "How Volkswagen fooled the American Government for 7 Years?", date: "7 March, 2026", author: "Vineet Mestry",
    image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1280&h=720&q=80",
    content: `<p>In 2015, the EPA issued a notice of violation to Volkswagen Group. The charge? Using a "defeat device" in their diesel engines to bypass emissions standards. For seven years, VW marketed their cars as "Clean Diesel" while secretly emitting up to 40 times the permitted levels of nitrogen oxide.</p><p>This wasn't a glitch; it was a deliberate software code designed to recognize when the car was on a testing stand. The fallout cost VW over $30 billion in fines and shattered consumer trust in diesel technology forever.</p><h3>How It Unravelled</h3><p>Independent researchers at West Virginia University first spotted the discrepancy in 2014. When the EPA threatened to withhold certification for 2016 models, VW had nowhere to hide.</p>` },
  { slug: "pakistan-vs-afghanistan-war-might-change-pak-forever-officials-worry",
    title: "Pakistan vs Afghanistan War might change Pak forever, Officials worry?", date: "3 March, 2026", author: "Vineet Mestry",
    image: "https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1280&h=720&q=80",
    content: `<p>The Durand Line, the disputed 2,640-kilometer border between Afghanistan and Pakistan, has historically been a flashpoint. Recent military skirmishes indicate a severe breakdown in diplomatic relations.</p><p>Officials worry that if the localized conflicts escalate into a full-blown geopolitical crisis, the ramifications will destabilize the entire South Asian region.</p><h3>What's at Stake</h3><p>Any full escalation would force regional powers — India, China, and Iran — to take sides, redrawing the geopolitical map of South Asia entirely.</p>` },
  { slug: "why-is-japan-so-prone-to-earthquakes-explained",
    title: "Why is Japan so Prone to Earthquakes? Explained", date: "2 March, 2026", author: "Vineet Mestry",
    image: "https://images.unsplash.com/photo-1498036882173-b41c28af5c01?ixlib=rb-4.0.3&auto=format&fit=crop&w=1280&h=720&q=80",
    content: `<p>Japan experiences hundreds of tremors a year because it sits squarely on the "Pacific Ring of Fire." Specifically, it rests on a complex intersection of four major tectonic plates: the Pacific, Philippine Sea, Eurasian, and North American plates.</p><p>As these plates grind, subduct, and catch on one another, massive amounts of stress build up. When that stress releases, the earth shakes.</p><h3>Living With It</h3><p>Japanese architecture, emergency preparedness culture, and early warning systems are among the most advanced in the world — born out of necessity over centuries of seismic activity.</p>` },
];

function slugify(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function ArticlePage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;
  const [menuOpen, setMenuOpen] = useState(false);

  const article = ARTICLES.find(a => a.slug === slug)
    ?? ARTICLES.find(a => slugify(a.title) === slug)
    ?? ARTICLES[0];

  return (
    <>
      <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} onTabChange={() => router.push("/")} />
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
        <Header onMenuOpen={() => setMenuOpen(true)} activeTab="" onTabChange={() => router.push("/")} />

        <div style={{ maxWidth: 800, margin: "0 auto 80px" }}>

          {/* ← Back */}
          <button
            onClick={() => router.back()}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              fontSize: "0.9rem", fontWeight: 600,
              color: "var(--text-muted)", background: "none",
              border: "1px solid transparent", borderRadius: 4,
              padding: "5px 10px", cursor: "pointer",
              marginBottom: 30,
              fontFamily: "'Inter', sans-serif",
              transition: "color 0.2s, border-color 0.2s, background 0.2s",
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

          {/* Centred header */}
          <div style={{ textAlign: "center", marginBottom: 30 }}>
            <h1 style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "3rem", lineHeight: 1.1,
              marginBottom: 15, color: "var(--text-main)",
            }}>
              {article.title}
            </h1>
            <div style={{
              display: "flex", justifyContent: "center", gap: 20,
              color: "var(--text-muted)", fontSize: "0.9rem",
              fontFamily: "'Inter', sans-serif",
            }}>
              <span>{article.date}</span>
              <span style={{ opacity: 0.4 }}>|</span>
              <span>{article.author}</span>
            </div>
          </div>

          {/* Hero image */}
          <img
            src={article.image}
            alt={article.title}
            style={{
              width: "100%", aspectRatio: "16/9",
              objectFit: "cover", borderRadius: 4,
              display: "block", marginBottom: 40,
            }}
          />

          {/* Body */}
          <div className="article-body" dangerouslySetInnerHTML={{ __html: article.content }} />
        </div>
      </div>
      <Footer />
    </>
  );
}
