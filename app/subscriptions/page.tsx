"use client";

import { useRouter } from "next/navigation";
import Footer from "@/components/layout/Footer";
import MobileHeader from "@/components/mobile/MobileHeader";
import MobileSideMenu from "@/components/mobile/MobileSideMenu";
import { useMobile } from "@/hooks/useMobile";
import { useState } from "react";

const BLACK = "#111111";
const BG    = "#f5f0eb";
const MUTED = "#666666";

export default function SubscriptionsPage() {
  const router   = useRouter();
  const isMobile = useMobile();
  const [menuOpen, setMenuOpen] = useState(false);

  if (isMobile) {
    return (
      <div style={{ backgroundColor: BG, minHeight: "100vh" }}>
        <MobileSideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} onTabChange={(t) => router.push(`/?tab=${t}`)} onBeatSelect={() => router.push("/")} />
        <MobileHeader activeTab="" onTabChange={(t) => router.push(`/?tab=${t}`)} onMenuOpen={() => setMenuOpen(true)} />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 24px", textAlign: "center", minHeight: "60vh" }}>
          <div style={{ fontSize: "3rem", marginBottom: 20 }}>🛠️</div>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.8rem", fontWeight: 400, color: BLACK, marginBottom: 12, lineHeight: 1.2 }}>Work in Progress</h1>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.88rem", color: MUTED, maxWidth: 340, lineHeight: 1.7, marginBottom: 28 }}>
            Subscriptions are being built. Check back soon — we're working on something worth subscribing to.
          </p>
          <button onClick={() => router.push("/")} style={{ padding: "10px 22px", backgroundColor: BLACK, color: "white", borderRadius: 8, border: "none", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", fontWeight: 600 }}>
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  // Desktop (original)
  return (
    <>
      <div style={{ minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 24px", textAlign: "center" }}>
        <div style={{ fontSize: "3.5rem", marginBottom: 24 }}>🛠️</div>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(2rem, 5vw, 2.8rem)", fontWeight: 400, color: "var(--text-main)", marginBottom: 16, lineHeight: 1.1 }}>Work in Progress</h1>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "1rem", color: "var(--text-muted)", maxWidth: 420, lineHeight: 1.75, marginBottom: 36 }}>
          Subscriptions are being built. Check back soon — we're working on something worth subscribing to.
        </p>
        <button onClick={() => router.push("/")} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 22px", backgroundColor: "var(--text-main)", color: "white", borderRadius: 8, border: "none", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: "0.88rem", fontWeight: 600 }}>
          ← Back to Home
        </button>
      </div>
      <Footer />
    </>
  );
}
