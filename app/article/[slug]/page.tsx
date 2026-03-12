"use client";

import { useRouter } from "next/navigation";

// Placeholder — replace with real Supabase fetch by slug
const MOCK = {
  title: "Indians are Sunroof-Suckers?",
  date: "5 March, 2026",
  author: "Vineet Mestry",
  image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1280&h=720&q=80",
  content: `
    <p>In India, for most buyers, a car is a luxury rather than a utility. They buy it more as a flex than an actual mode of transport. But having more absolutely makes sense when you want things that actually matter. In a country where temperatures jump around 40°C, what would you go for — a Sunroof or Ventilated Seats?</p>
    <p>In a survey, 70% voted for Ventilated Seats, yet cars with sunroofs are selling out! Probably 95% of people buying sunroofs only do it to stick out of it. It feels fresh until a cop stops you and fines you ₹5000 for dangerous driving under the Motor Vehicle Act.</p>
    <h3>The Numbers Don't Lie</h3>
    <p>In 2021, sunroof penetration in cars was 17.8%. By 2025, that number has grown dramatically. Manufacturers have caught on — it's become a key sales lever even in entry-level segments, despite the obvious climate mismatch.</p>
    <p>The irony is stark. In the same scorching markets where sunroofs sell best, the AC is working hardest. Opening that glass panel negates every efficiency gain you might have expected from modern powertrain technology.</p>
  `,
};

export default function ArticlePage() {
  const router = useRouter();

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
      <div style={{ maxWidth: 800, margin: "0 auto 80px" }}>

        {/* ← Back to list */}
        <button
          onClick={() => router.back()}
          style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            fontSize: "0.9rem", fontWeight: 600,
            color: "var(--text-muted)", background: "none",
            border: "1px solid transparent", borderRadius: 4,
            padding: "5px 10px", cursor: "pointer",
            marginBottom: 30, marginTop: 24,
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

        {/* Centred article header */}
        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <h1 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "3rem", lineHeight: 1.1,
            marginBottom: 15, color: "var(--text-main)",
          }}>
            {MOCK.title}
          </h1>
          <div style={{
            display: "flex", justifyContent: "center", gap: 20,
            color: "var(--text-muted)", fontSize: "0.9rem",
            fontFamily: "'Inter', sans-serif",
          }}>
            <span>{MOCK.date}</span>
            <span style={{ opacity: 0.4 }}>|</span>
            <span>{MOCK.author}</span>
          </div>
        </div>

        {/* Hero image — 16:9 */}
        <img
          src={MOCK.image}
          alt={MOCK.title}
          style={{
            width: "100%", aspectRatio: "16/9",
            objectFit: "cover", borderRadius: 4,
            display: "block", marginBottom: 40,
          }}
        />

        {/* Article body — styles from globals.css .article-body */}
        <div
          className="article-body"
          dangerouslySetInnerHTML={{ __html: MOCK.content }}
        />

      </div>
    </div>
  );
}
