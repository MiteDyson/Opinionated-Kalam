"use client";

import { useRouter, useParams } from "next/navigation";
import { useState } from "react";
import Header from "@/components/layout/Header";
import SideMenu from "@/components/layout/SideMenu";
import Footer from "@/components/layout/Footer";

const ACCENT = "#1B2A47";

const SHORTS = [
  {
    slug: "quick-fact-sunroofs-vs-ac-efficiency",
    title: "Quick Fact: Sunroofs vs. AC Efficiency",
    excerpt: "In a 40C climate, a glass roof requires your AC to work 15% harder.",
    readTime: "2 min read", tags: ["Automotive"],
    content: `<p>A panoramic sunroof adds roughly 30–50 kg to a car's kerb weight and increases aerodynamic drag. In Indian summer conditions (38–44°C), IR-blocking glass only mitigates about 60% of solar heat gain — meaning your cabin AC still has to work significantly harder, reducing fuel efficiency by an estimated 10–15%.</p><p>This is the trade-off most sunroof buyers don't calculate when they're swayed by the showroom demo on a cloudy day.</p>`,
  },
  {
    slug: "timeline-vw-scandal",
    title: "Timeline: VW Scandal",
    excerpt: "A quick chronological look at how the EPA caught the cheat devices in 2015.",
    readTime: "3 min read", tags: ["Scandals"],
    content: `<p><strong>2009</strong> — VW begins installing defeat device software in TDI diesel engines sold in the US.</p><p><strong>2014</strong> — West Virginia University researchers publish anomalous emissions data. VW dismisses it as "technical irregularities."</p><p><strong>Sept 2015</strong> — EPA issues formal Notice of Violation. VW admits to 11 million affected vehicles worldwide.</p><p><strong>2017</strong> — VW pleads guilty to three federal felony charges and agrees to pay $4.3B in penalties. Total fallout exceeds $30B.</p>`,
  },
  {
    slug: "why-japan-gets-1-500-earthquakes-a-year",
    title: "Why Japan Gets 1,500 Earthquakes a Year",
    excerpt: "A fast explainer on tectonic plate convergence and what it means for daily life.",
    readTime: "2 min read", tags: ["Explainers"],
    content: `<p>Japan sits at the convergence of four major tectonic plates: Pacific, Philippine Sea, Eurasian, and North American. The Pacific Plate subducts beneath the North American Plate at about 8 cm per year — creating constant seismic stress.</p><p>Most of Japan's 1,500 annual quakes are minor (under magnitude 3.0) and unfelt. But the same geology produces the megathrust events like 2011's Tohoku earthquake (M9.0) that triggered a devastating tsunami.</p>`,
  },
  {
    slug: "pak-afghan-border-key-facts",
    title: "Pak-Afghan Border: Key Facts",
    excerpt: "The Durand Line, tribal tensions, and why this border has always been volatile.",
    readTime: "4 min read", tags: ["Geo Politics"],
    content: `<p>The Durand Line — drawn in 1893 by Sir Mortimer Durand under British colonial administration — bisects the Pashtun tribal belt, splitting communities, families, and traditional territories across two countries.</p><p>Afghanistan has never formally recognised the line as a permanent international border. This legal ambiguity, combined with decades of cross-border militant activity and refugee flows, makes it one of the most contested frontiers in the world.</p><h3>Why It Matters Now</h3><p>The Taliban's return to power in 2021 emboldened anti-Pakistan factions including the TTP (Tehrik-i-Taliban Pakistan), dramatically escalating cross-border attacks and putting both states on a war footing.</p>`,
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

export default function ShortPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;
  const [menuOpen, setMenuOpen] = useState(false);
  const [liked, setLiked]   = useState(false);
  const [saved, setSaved]   = useState(false);
  const [likes, setLikes]   = useState(38);
  const [copied, setCopied] = useState(false);

  const short = SHORTS.find(s => s.slug === slug) ?? SHORTS[0];

  const handleLike = () => { setLiked(!liked); setLikes(liked ? likes - 1 : likes + 1); };

  const handleShare = async () => {
    try { await navigator.clipboard.writeText(window.location.href); }
    catch { /* fallback */ }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

        <div style={{ maxWidth: 680, margin: "0 auto 80px" }}>

          {/* Back */}
          <button onClick={() => router.back()} style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            fontSize: "0.9rem", fontWeight: 600, color: "var(--text-muted)",
            background: "none", border: "1px solid transparent", borderRadius: 4,
            padding: "5px 10px", cursor: "pointer", marginBottom: 30,
            fontFamily: "'Inter', sans-serif", transition: "all 0.2s",
          }}
            onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.color = "var(--text-main)"; el.style.borderColor = "var(--border)"; }}
            onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.color = "var(--text-muted)"; el.style.borderColor = "transparent"; }}
          >
            <svg viewBox="0 0 24 24" style={{ width: 16, height: 16, stroke: "currentColor", strokeWidth: 2, fill: "none" }}>
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back
          </button>

          {/* Tags + read time */}
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginBottom: 16 }}>
            {short.tags.map(t => <Tag key={t} label={t} />)}
            <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontFamily: "'Inter', sans-serif" }}>
              ⚡ {short.readTime}
            </span>
          </div>

          {/* Title */}
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "2.6rem", lineHeight: 1.1, marginBottom: 32, color: "var(--text-main)" }}>
            {short.title}
          </h1>

          {/* Content */}
          <div className="article-body" dangerouslySetInnerHTML={{ __html: short.content }} />

          {/* Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 40, paddingTop: 28, borderTop: "1px solid var(--border)" }}>
            <button style={actionBtn(liked)} onClick={handleLike}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              {likes} Likes
            </button>
            <button style={actionBtn(saved)} onClick={() => setSaved(!saved)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
              </svg>
              {saved ? "Saved" : "Save"}
            </button>
            <button style={actionBtn(copied)} onClick={handleShare}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
              </svg>
              {copied ? "Copied!" : "Share"}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
