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

export default function TeamPage() {
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
            Our Team
          </h1>
          <p style={{ fontFamily: "'Radley', serif", fontSize: "1.15rem", color: "#666666", margin: 0 }}>
            Opinionated Kalam is run by two lads filled with immense passion for their own respective fields →
          </p>
        </div>

        {/* Core Content */}
        <div style={{ display: "flex", flexDirection: "column", gap: "48px" }}>

          <div style={{ borderBottom: "1px solid #e0d8d0", paddingBottom: "30px" }}>
            <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: "1.8rem", fontWeight: 600, color: "#111111", margin: "0 0 4px", letterSpacing: "-0.02em" }}>
              Vineet Mestry
            </h2>
            <span style={{ fontFamily: "'Radley', serif", fontSize: "1.1rem", color: "#666666", display: "block", marginBottom: "20px" }}>
              Founder & Writer
            </span>
            <p style={{ fontFamily: "'Radley', serif", fontSize: "1.1rem", lineHeight: 1.6, color: "#1a1a1a", marginLeft: "20px", marginBottom: "12px" }}>
              Vineet is a Journalism student and the voice behind the investigations you read here. He created this space to focus on deep-dive reporting and honest analysis. His goal is simple: to stop the spread of noise and start providing factual stories that spark curiosity and solve problems.
            </p>
            <div style={{ fontFamily: "'Radley', serif", fontSize: "1.1rem", color: "#111111", marginLeft: "20px" }}>
              Contact - <a href="mailto:workingvineet@gmail.com" style={{ color: "#111111", textDecoration: "underline" }}>workingvineet@gmail.com</a>
            </div>
          </div>

          <div>
            <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: "1.8rem", fontWeight: 600, color: "#111111", margin: "0 0 4px", letterSpacing: "-0.02em" }}>
              Mitesh Shetye
            </h2>
            <span style={{ fontFamily: "'Radley', serif", fontSize: "1.1rem", color: "#666666", display: "block", marginBottom: "20px" }}>
              Founder & Developer
            </span>
            <p style={{ fontFamily: "'Radley', serif", fontSize: "1.1rem", lineHeight: 1.6, color: "#1a1a1a", marginLeft: "20px", marginBottom: "12px" }}>
              Mitesh is the developer behind the platform you interact with here. He built this space to focus on scalable full-stack solutions and production-ready engineering. His goal is simple: to stop relying on boilerplate code and start delivering custom systems that solve real problems and create seamless user experiences.
            </p>
            <div style={{ fontFamily: "'Radley', serif", fontSize: "1.1rem", color: "#111111", marginLeft: "20px" }}>
              Contact - <a href="mailto:mitesh.shetye154@gmail.com" style={{ color: "#111111", textDecoration: "underline" }}>mitesh.shetye154@gmail.com</a>
            </div>
          </div>

        </div>

        {/* Bottom Navigation Links */}
        <div style={{ marginTop: 80, marginBottom: 40, textAlign: "center", display: "flex", flexDirection: "column", gap: "15px" }}>
          <p style={{ fontFamily: "'Radley', serif", fontSize: "1.1rem", margin: 0 }}>
            Go through <button onClick={() => router.push("/about")} style={{ background: "none", border: "none", cursor: "pointer", color: "#111111", padding: 0, textDecoration: "underline", font: "inherit" }}>About Us</button> →
          </p>
        </div>

      </div>
      {isMobile ? <MobileFooter /> : <Footer />}
    </div>
  );
}
