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

const BRAND = "Opinionated Kalam";
const EFFECTIVE = "March 21, 2026";
const EMAIL = "help@opinionatedkalam.com";
const SITE = "opinionatedkalam.com";

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

export default function TermsOfServicePage() {
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
            Terms of Service
          </h1>
          <p style={{ fontFamily: "'Radley', serif", fontSize: "1.1rem", color: "#111111", margin: 0 }}>
            Effective Date: {EFFECTIVE}
          </p>
        </div>

        {/* Intro */}
        <p style={{ fontFamily: "'Radley', serif", fontSize: "1.1rem", lineHeight: 1.6, color: "#1a1a1a", marginBottom: 40 }}>
          Welcome to <strong>{BRAND}</strong>. By accessing or using our website at <strong>{SITE}</strong>, you agree to be bound by these Terms of Service. Please read them carefully before using the platform.
        </p>

        <Section title="1. Acceptance of Terms">
          <p style={{ marginBottom: "1.5em" }}>
            By using this platform, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy. If you do not agree, please discontinue use.
          </p>
          <p>
            We may update these terms to reflect the evolving nature of our platform; your continued use after such updates constitutes acceptance.
          </p>
        </Section>

        <Section title="2. Our Mission & Services">
          <p style={{ marginBottom: "1.5em" }}>
            Opinionated Kalam is an independent digital journalism platform. We provide opinion/perspective-based, problem-solving content designed to serve your curiosity with a touch of entertainment.
          </p>
          <div style={{ marginBottom: "1.5em" }}>
            <p style={{ marginBottom: "0.8em" }}>Content Formats:</p>
            <ul style={{ paddingLeft: "1.5em", listStyleType: "disc" }}>
              <li style={{ marginBottom: "0.5em" }}><strong>Articles</strong> - Deep-dive perspectives on complex issues.</li>
              <li style={{ marginBottom: "0.5em" }}><strong>Short Articles</strong> - Concise, high-impact news for the reader on the go.</li>
              <li><strong>Audio Podcasts</strong> - Insightful narrations.</li>
            </ul>
          </div>
          <div>
            <p style={{ marginBottom: "0.8em" }}>Our Core Beats:</p>
            <p>
              We focus strictly on requisite matters across Mobility, Geo-Politics, Business, Environment, Governance, Society, Technology, and Media.
            </p>
          </div>
        </Section>

        <Section title="3. User Accounts & Interactions">
          <p style={{ marginBottom: "1.5em" }}>
            To help you personalize your experience, we allow user accounts via email or Google Sign-In.
          </p>
          <ul style={{ paddingLeft: "1.5em", listStyleType: "disc", marginBottom: "1.5em" }}>
            <li style={{ marginBottom: "0.8em" }}>
              <strong>Features</strong> - Accounts allow you to save, like, and share the content.
            </li>
            <li style={{ marginBottom: "0.8em" }}>
              <strong>Comments</strong> - Currently, Opinionated Kalam does not allow public comments on any content format.
            </li>
            <li>
              <strong>Responsibility</strong> - You are responsible for keeping your account details secure. Notify us at <a href={`mailto:${EMAIL}`} style={{ textDecoration: "underline" }}>{EMAIL}</a> if you suspect a breach. We reserve the right to terminate accounts that violate our community standards or use false identities.
            </li>
          </ul>
        </Section>

        <Section title="4. Accuracy & Grievance Redressal">
          <p style={{ marginBottom: "1.5em" }}>
            We are committed to factual accuracy. As an opinion-based journalism platform, our perspectives are built on a foundation of verified facts.
          </p>
          <p style={{ marginBottom: "1.5em" }}>
            If you believe a piece of content contains a factual error, please visit our <button onClick={() => router.push("/?tab=grievance")} style={{ background: "none", border: "none", cursor: "pointer", color: "#111111", padding: 0, textDecoration: "underline", font: "inherit", fontWeight: "bold" }}>Grievance Redressal Page</button> and contact our Grievance Officer.
          </p>
          <p>
            In accordance with the Indian Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, we will acknowledge your grievance within 24 hours and aim for a resolution within 15 days.
          </p>
        </Section>

        <Section title="5. Intellectual Property">
          <p style={{ marginBottom: "1.5em" }}>
            All content, including text, audio, graphics, and logos, is the property of Opinionated Kalam.
          </p>
          <ul style={{ paddingLeft: "1.5em", listStyleType: "disc" }}>
            <li style={{ marginBottom: "0.8em" }}>
              <strong>You May</strong> - Share links and quote brief excerpts with clear attribution for non-commercial purposes.
            </li>
            <li>
              <strong>You May Not</strong> - Reproduce, republish, or redistribute our content in full, nor use automated tools (scrapers/crawlers) to extract our data for AI training or other commercial uses without explicit written authorization.
            </li>
          </ul>
        </Section>

        <Section title="6. Third Party Infrastructure">
          <p style={{ marginBottom: "1.5em" }}>
            We utilize robust third-party services to ensure a seamless experience - Firebase (Auth), MongoDB (Data), ImageKit (Media), and Vercel (Hosting).
          </p>
          <p>
            While we choose our partners carefully, we are not responsible for their independent service outages or policy changes.
          </p>
        </Section>

        <Section title="7. Disclaimer & Limitation of Liability">
          <ul style={{ paddingLeft: "1.5em", listStyleType: "disc" }}>
            <li style={{ marginBottom: "0.8em" }}>
              <strong>Non-Professional Advice</strong> - Our content is for informational and educational purposes. It does not constitute legal, financial, or professional advice.
            </li>
            <li>
              <strong>"As Is" Basis</strong> - We provide this service without warranties of any kind. We are not liable for any incidental or consequential damages resulting from your use of the platform.
            </li>
          </ul>
        </Section>

        <Section title="8. Prohibited Content">
          <p style={{ marginBottom: "1.5em" }}>
            You agree not to disrupt our infrastructure, attempt unauthorized access, or use our platform for any unlawful purpose.
          </p>
          <p>
            We reserve the right to block access to any user who interferes with our mission to provide a clean, streamlined media environment.
          </p>
        </Section>

        <Section title="9. Governing Law">
          <p>
            These Terms are governed by the laws of India. Any disputes will be subject to the exclusive jurisdiction of the courts in India.
          </p>
        </Section>

        <Section title="10. Contact Us">
          <p style={{ marginBottom: "1.5em" }}>
            For questions regarding these Terms, reach out to -
          </p>
          <p>
            Email: <a href="mailto:hello@opinionatedkalam.com" style={{ textDecoration: "underline" }}>hello@opinionatedkalam.com</a>
          </p>
        </Section>

        {/* Bottom Navigation Links */}
        <div style={{ marginTop: 80, marginBottom: 40, textAlign: "center", display: "flex", flexDirection: "column", gap: "15px" }}>
          <p style={{ fontFamily: "'Radley', serif", fontSize: "1.1rem", margin: 0 }}>
            Go through <button onClick={() => router.push("/privacy")} style={{ background: "none", border: "none", cursor: "pointer", color: "#111111", padding: 0, textDecoration: "underline", font: "inherit" }}>Privacy Policy</button> →
          </p>
          <p style={{ fontFamily: "'Radley', serif", fontSize: "1.1rem", margin: 0 }}>
            Go through <button onClick={() => router.push("/?tab=team")} style={{ background: "none", border: "none", cursor: "pointer", color: "#111111", padding: 0, textDecoration: "underline", font: "inherit" }}>Our Team</button> →
          </p>
          <p style={{ fontFamily: "'Radley', serif", fontSize: "1.1rem", margin: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: "8px" }}>
            Go to <button onClick={() => router.push("/")} style={{ background: "none", border: "1px solid rgb(221, 221, 221)", borderRadius: "6px", padding: "5px 12px", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "4px", color: "#111111" }}><MoveLeft size={16} />Back</button> →
          </p>
        </div>

      </div>
      {isMobile ? <MobileFooter /> : <Footer />}
    </div>
  );
}