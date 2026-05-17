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

export default function GrievancePage() {
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
            Grievance Redressal
          </h1>
          <p style={{ fontFamily: "'Radley', serif", fontSize: "1.15rem", color: "#666666", margin: 0 }}>
            Honesty, Transparency, and Accuracy.
          </p>
        </div>

        {/* Intro */}
        <div style={{ fontFamily: "'Radley', serif", fontSize: "1.1rem", lineHeight: 1.6, color: "#1a1a1a", marginBottom: 40 }}>
          <p style={{ marginBottom: "1em" }}>We, at Opinionated Kalam, believe in providing content with utmost Honesty, Transparency, and Accuracy.</p>
          <p style={{ marginBottom: "1em" }}>We understand spreading awareness requires Trust, and trust requires Accountability.</p>
          <p>If you believe any format of our content has fallen short in terms of our principles mentioned above, we have a structured mechanism in place to address and resolve your concerns promptly.</p>
        </div>

        <Section title="What Constitutes a Grievance?">
          <p style={{ marginBottom: "1em" }}>You can file a formal Grievance regarding the content published on our Website & Social Media Channels if it involves this -</p>
          <ul style={{ paddingLeft: "1.5em", listStyleType: "disc", marginBottom: "1.5em" }}>
            <li style={{ marginBottom: "0.5em" }}><span style={{ textDecoration: "underline" }}>Factual Inaccuracies</span> - Demonstrable errors in data, quotes, or historical facts.</li>
            <li style={{ marginBottom: "0.5em" }}><span style={{ textDecoration: "underline" }}>Misleading Information</span> - Data or context presented in a way that distorts the truth.</li>
            <li><span style={{ textDecoration: "underline" }}>Ethical Violations</span> - Breaches of standard Journalistic ethics, including issues related to privacy, plagiarism, or conflict of interest.</li>
          </ul>
          <p style={{ color: "#D92323", fontStyle: "italic" }}>Note - Disagreements with opinions/perspectives do not constitute a formal grievance, unless they contain factual errors.</p>
        </Section>

        <Section title="How to File a Grievance?">
          <p style={{ marginBottom: "1em" }}>To ensure your concern is addressed efficiently, please submit your grievance in writing via email.</p>
          <p style={{ marginBottom: "0.5em" }}><span style={{ textDecoration: "underline" }}>Send your email to</span> - grievance@opinionatedkalam.com</p>
          <p style={{ marginBottom: "1.5em" }}><span style={{ textDecoration: "underline" }}>Subject Line</span> - Grievance regarding [Insert Title of Article/Podcast/Short Article]</p>
          
          <p style={{ marginBottom: "1em" }}>Please include the following details in your email -</p>
          <ul style={{ paddingLeft: "1.5em", listStyleType: "disc" }}>
            <li style={{ marginBottom: "0.5em" }}>Your Full Name and Contact Information.</li>
            <li style={{ marginBottom: "0.5em" }}>The Exact Link (URL) to the specific article, podcast, short article in question.</li>
            <li style={{ marginBottom: "0.5em" }}><span style={{ textDecoration: "underline" }}>The Specific Concern</span> - Quote the exact text or timestamp the audio you are disputing.</li>
            <li><span style={{ textDecoration: "underline" }}>Supporting Evidence</span> - Provide verifiable data, documents, or links that demonstrate why the content is inaccurate or violates our standards.</li>
          </ul>
        </Section>

        <Section title="Our Resolution Process">
          <p style={{ marginBottom: "1em" }}>We treat every valid complaint with the seriousness it deserves. Here is what you can expect once you submit a grievance -</p>
          <ul style={{ paddingLeft: "1.5em", listStyleType: "disc" }}>
            <li style={{ marginBottom: "0.5em" }}><span style={{ textDecoration: "underline" }}>Acknowledgement</span> - You will receive a confirmation of receipt from our team within 24 hours.</li>
            <li style={{ marginBottom: "0.5em" }}><span style={{ textDecoration: "underline" }}>Investigation</span> - Our editorial team, independent of the original author, will review the provided evidence against our reporting data.</li>
            <li style={{ marginBottom: "0.5em" }}><span style={{ textDecoration: "underline" }}>Resolution</span> - We aim to resolve all grievances within 15 days of receipt.</li>
            <li><span style={{ textDecoration: "underline" }}>Action</span> - If a factual error is found, we will immediately update the content and append a clear, transparent "Correction" note at the bottom of the article detailing what was changed and when.</li>
          </ul>
        </Section>

        <Section title="Grievance Redressal Officer">
          <p style={{ marginBottom: "1em" }}>In accordance with the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, the contact details of the Grievance Officer are provided below -</p>
          <div style={{ marginTop: "16px", lineHeight: "1.8" }}>
            <span style={{ textDecoration: "underline" }}>Name</span> - Mitesh Shetye<br />
            <span style={{ textDecoration: "underline" }}>Designation</span> - Grievance Redressal Officer<br />
            <span style={{ textDecoration: "underline" }}>Email</span> - grievance@opinionatedkalam.com<br />
            <span style={{ textDecoration: "underline" }}>Working Hours</span> - Monday to Friday, 10:00 AM to 6:00 PM (IST)
          </div>
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
