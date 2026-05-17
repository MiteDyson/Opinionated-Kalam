"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import SideMenu from "@/components/layout/SideMenu";
import Footer from "@/components/layout/Footer";
import MobileHeader from "@/components/mobile/MobileHeader";
import MobileSideMenu from "@/components/mobile/MobileSideMenu";
import MobileFooter from "@/components/mobile/MobileFooter";
import { useMobileReady } from "@/hooks/useMobile";
import { MoveLeft } from "lucide-react";

export default function AboutPage() {
  const router = useRouter();
  const [isMobile, mobileReady] = useMobileReady();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("home");

  if (!mobileReady) return <div style={{ minHeight: "100vh", backgroundColor: "#f4efea" }} />;

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    router.push(`/?tab=${tab}`);
  };

  return (
    <div style={{ backgroundColor: "#f4efea", minHeight: "100vh" }}>
      {isMobile ? (
        <>
          <MobileHeader activeTab={activeTab} onTabChange={handleTabChange} onMenuOpen={() => setMenuOpen(true)} />
          <MobileSideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} onTabChange={handleTabChange} />
        </>
      ) : (
        <>
          <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} onTabChange={handleTabChange} />
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
            <Header onMenuOpen={() => setMenuOpen(true)} activeTab={activeTab} onTabChange={handleTabChange} />
          </div>
        </>
      )}

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "20px 20px 80px" }}>
        
        {/* Navigation */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: 30 }}>
          <button 
            onClick={() => router.push("/")} 
            style={{
              background: "none", border: "1px solid rgb(221, 221, 221)", borderRadius: "6px",
              padding: "5px 12px", cursor: "pointer", fontFamily: "'Inter', sans-serif",
              fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "4px",
              color: "#111111", whiteSpace: "nowrap"
            }}
          >
            <MoveLeft size={14} /> Back
          </button>
        </div>

        {/* Header Content */}
        <div style={{ textAlign: "center", marginBottom: 50 }}>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "2.8rem", fontWeight: 400, color: "#111111", margin: "0 0 10px" }}>
            About Us
          </h1>
          <p style={{ fontFamily: "'Radley', serif", fontSize: "1.15rem", color: "#666666", margin: 0 }}>
            Learn What, Why & Who
          </p>
        </div>

        {/* Core Content */}
        <div style={{ display: "flex", flexDirection: "column", gap: "32px", fontFamily: "'Radley', serif", fontSize: "1.1rem", lineHeight: 1.6, color: "#1a1a1a" }}>
          <div>
            <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: "1.35rem", fontWeight: 600, color: "#111111", marginTop: "1em", marginBottom: "0.8em", letterSpacing: "-0.02em" }}>
              What is <span style={{ fontFamily: "'DM Serif Display', serif", fontWeight: 400 }}>Opinionated Kalam</span>?
            </h2>
            <p style={{ marginBottom: "1em" }}>
              Opinionated Kalam is an Independent Journalism platform made to cater the audience with appropriate, rational, and logic-driven perspectives on vast topics.
            </p>
            <p>
              It moves forward with an approach fueled by Curiosity, which helps the platform cover the topics that are actually Important and Need to be shed light upon.
            </p>
          </div>

          <div>
            <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: "1.35rem", fontWeight: 600, color: "#111111", marginTop: "1em", marginBottom: "0.8em", letterSpacing: "-0.02em" }}>
              Why is <span style={{ fontFamily: "'DM Serif Display', serif", fontWeight: 400 }}>Opinionated Kalam</span>?
            </h2>
            <p style={{ marginBottom: "1em" }}>
              The Conventional Media has created unnecessary chaos around your ears, further not letting you focus on what is more important.
            </p>
            <p>
              We help you learn, grow, and understand the requisite while serving to your Curiosity with a pinch of Entertainment.
            </p>
          </div>

          <div>
            <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: "1.35rem", fontWeight: 600, color: "#111111", marginTop: "1em", marginBottom: "0.8em", letterSpacing: "-0.02em" }}>
              Why Choose Us?
            </h2>
            <h3 style={{ fontStyle: "italic", fontSize: "1.1rem", fontWeight: 400, color: "#111111", marginTop: "1.5em", marginBottom: "0.8em" }}>
              We Play Fair!
            </h3>
            <p style={{ marginBottom: "1em" }}>
              We, at Opinionated Kalam, present opinions/perspectives that are not partial, but are Balanced, Fair, and those that are pushed by Truth.
            </p>
            <p>
              Just learning what has happened might seem too basic, but doing the same with various perspectives presented would help you evaluate the nucleus better!
            </p>
          </div>

          <div>
            <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: "1.35rem", fontWeight: 600, color: "#111111", marginTop: "1em", marginBottom: "0.8em", letterSpacing: "-0.02em" }}>
              When & by Whom was <span style={{ fontFamily: "'DM Serif Display', serif", fontWeight: 400 }}>Opinionated Kalam</span> established?
            </h2>
            <p>
              Opinionated Kalam got established in 2026 by Vineet Mestry, a Journalism student with a drive and plenty of passion to make it better for the audience.
            </p>
          </div>
        </div>

        {/* Bottom Navigation Links */}
        <div style={{ marginTop: 80, marginBottom: 40, textAlign: "center", display: "flex", flexDirection: "column", gap: "15px" }}>
          <p style={{ fontFamily: "'Radley', serif", fontSize: "1.1rem", margin: 0 }}>
            Go through <button onClick={() => router.push("/team")} style={{ background: "none", border: "none", cursor: "pointer", color: "#111111", padding: 0, textDecoration: "underline", font: "inherit" }}>Our Team</button> →
          </p>
        </div>

      </div>
      {isMobile ? <MobileFooter /> : <Footer />}
    </div>
  );
}
