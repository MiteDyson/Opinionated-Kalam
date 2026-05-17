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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 48 }}>
      <h2
        style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: "1.8rem",
          fontWeight: 400,
          color: "#111111",
          marginBottom: "0.6em",
          lineHeight: 1.2,
          display: "block"
        }}
      >
        {title}
        <span style={{ fontSize: "1.4rem", marginLeft: "12px", display: "inline-block", verticalAlign: "middle" }}>→</span>
      </h2>
      <div style={{ fontFamily: "'Radley', serif", fontSize: "1.1rem", lineHeight: 1.6, color: "#1a1a1a" }}>
        {children}
      </div>
    </section>
  );
}

export default function ContactPage() {
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
            Contact Us
          </h1>
          <p style={{ fontFamily: "'Radley', serif", fontSize: "1.15rem", color: "#666666", margin: 0 }}>
            Get in touch with the team.
          </p>
        </div>

        {/* Intro */}
        <div style={{ fontFamily: "'Radley', serif", fontSize: "1.1rem", lineHeight: 1.6, color: "#1a1a1a", marginBottom: 40 }}>
          <p style={{ marginBottom: "1em" }}>Have a question, a news tip, or just want to talk about one of our investigations? We value direct communication and honest feedback.</p>
          <p>Since we are a small, independent team, reaching out via email is the best way to get a timely response.</p>
        </div>

        <Section title="General Enquiries">
          <p style={{ marginBottom: "1em" }}>For general questions about our platform, Partnership Ideas, or just want to say “Hello!”.</p>
          <p><strong>Email:</strong> <a href="mailto:hello@opinionatedkalam.com" style={{ color: "#111111", textDecoration: "underline" }}>hello@opinionatedkalam.com</a></p>
        </Section>

        <Section title="Report an Error">
          <p style={{ marginBottom: "1em" }}>Accuracy is our top priority. If you spot a factual error in any of our articles or podcasts, please let us know immediately so we can fix it.</p>
          <p>For formal complaints, please visit our <button onClick={() => router.push("/grievance")} style={{ background: "none", border: "none", padding: 0, textDecoration: "underline", fontFamily: "'Radley', serif", fontSize: "1.1rem", cursor: "pointer", color: "#111111" }}>Grievance Redressal</button> page.</p>
        </Section>

        <Section title="Want to Collaborate/Advertise">
          <p style={{ marginBottom: "1em" }}>We welcome incredible ideas with utmost honesty and respect. If you want to advertise your brand, product, etc., you may contact us through this email.</p>
          <p><strong>Email:</strong> <a href="mailto:business@opinionatedkalam.com" style={{ color: "#111111", textDecoration: "underline" }}>business@opinionatedkalam.com</a></p>
        </Section>

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
