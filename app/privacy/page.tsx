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

const BRAND = "Opinionated Kalam";
const EFFECTIVE = "March 21, 2026";
const EMAIL = "hello@opinionatedkalam.com";

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

export default function PrivacyPolicyPage() {
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
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.72rem",
              color: "#111111",
              backgroundColor: "transparent",
              border: "1px solid #e0d8d0",
              borderRadius: "4px",
              padding: "4px 10px",
              cursor: "pointer",
              whiteSpace: "nowrap"
            }}
          >
            ← Back
          </button>
        </div>

        {/* Header Content */}
        <div style={{ textAlign: "center", marginBottom: 50 }}>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "2.8rem", fontWeight: 400, color: "#111111", margin: "0 0 10px" }}>
            Privacy Policy
          </h1>
          <p style={{ fontFamily: "'Radley', serif", fontSize: "1.1rem", color: "#111111", margin: 0 }}>
            Effective Date: {EFFECTIVE}
          </p>
        </div>

        {/* Intro */}
        <p style={{ fontFamily: "'Radley', serif", fontSize: "1.1rem", lineHeight: 1.6, color: "#1a1a1a", marginBottom: 40 }}>
          At <strong>{BRAND}</strong>, we take your privacy seriously. This Privacy Policy explains what information we collect, how we use it, and the choices you have regarding your data when you use our platform.
        </p>

        <Section title="1. Information we Collect">
          <div style={{ marginBottom: "1.5em" }}>
            <p style={{ marginBottom: "0.8em" }}>a) Information you provide directly -</p>
            <ul style={{ paddingLeft: "1.5em", listStyleType: "disc" }}>
              <li style={{ marginBottom: "0.5em" }}><strong>Account registration details</strong> - name, email address, and password (stored securely via bcrypt hashing).</li>
              <li style={{ marginBottom: "0.5em" }}><strong>Google account information</strong> if you sign in via Google OAuth (name, email, profile photo).</li>
              <li><strong>Comments</strong> or other content you submit on the platform.</li>
            </ul>
          </div>
          
          <div style={{ marginBottom: "1.5em" }}>
            <p style={{ marginBottom: "0.8em" }}>b) Information collected automatically -</p>
            <ul style={{ paddingLeft: "1.5em", listStyleType: "disc" }}>
              <li style={{ marginBottom: "0.5em" }}><strong>Usage data</strong> - pages visited, articles read, likes and saves.</li>
              <li style={{ marginBottom: "0.5em" }}><strong>Device and browser information</strong> (type, OS, screen size).</li>
              <li style={{ marginBottom: "0.5em" }}><strong>IP address</strong> and approximate geographic location.</li>
              <li><strong>Referring URLs</strong> and session duration.</li>
            </ul>
          </div>

          <div>
            <p style={{ marginBottom: "0.8em" }}>c) Media uploads -</p>
            <p>
              If you are an admin user, images and audio files you upload are stored via ImageKit and referenced in our database. These files are hosted on ImageKit's CDN infrastructure.
            </p>
          </div>
        </Section>

        <Section title="2. How We Use Your Information">
          <p style={{ marginBottom: "1em" }}>We use the information we collect to -</p>
          <ul style={{ paddingLeft: "1.5em", listStyleType: "disc", marginBottom: "1.5em" }}>
            <li style={{ marginBottom: "0.5em" }}>Create and manage your user account.</li>
            <li style={{ marginBottom: "0.5em" }}>Personalise your experience (saved articles, liked content).</li>
            <li style={{ marginBottom: "0.5em" }}>Authenticate your identity via Firebase Authentication.</li>
            <li style={{ marginBottom: "0.5em" }}>Moderate comments and enforce our Terms of Service.</li>
            <li style={{ marginBottom: "0.5em" }}>Improve and maintain the platform.</li>
            <li style={{ marginBottom: "0.5em" }}>Communicate important updates or security notices.</li>
            <li>Analyse aggregate usage trends to improve content offerings.</li>
          </ul>
          <p>
            We do not sell, rent, or share your personal information with third-party advertisers. Opinionated Kalam is an ad-free publication.
          </p>
        </Section>

        <Section title="3. Third-Party Services We Use">
          <p style={{ marginBottom: "1em" }}>We rely on the following third-party services to operate Opinionated Kalam. Each has its own privacy policy governing the data they process -</p>
          <ul style={{ paddingLeft: "1.5em", listStyleType: "disc", marginBottom: "1.5em" }}>
            <li style={{ marginBottom: "0.5em" }}><strong>Firebase (Google)</strong> - Authentication and identity management. Privacy policy: firebase.google.com.</li>
            <li style={{ marginBottom: "0.5em" }}><strong>MongoDB Atlas</strong> - Cloud database for storing articles, user data, and comments.</li>
            <li><strong>ImageKit</strong> - Image and audio CDN for media hosting.</li>
          </ul>
          <p>
            When you sign in with Google, Google may collect data in accordance with Google's own privacy policies. We only receive basic profile information (name, email, avatar) from Google.
          </p>
        </Section>

        <Section title="4. Cookies and Tracking">
          <p style={{ marginBottom: "1.5em" }}>
            Opinionated Kalam uses minimal cookies necessary for the platform to function, including session cookies for authentication. We do not use third-party advertising trackers or behavioural profiling cookies.
          </p>
          <div style={{ marginBottom: "1.5em" }}>
            <p style={{ marginBottom: "0.8em" }}>Cookies we may set include -</p>
            <ul style={{ paddingLeft: "1.5em", listStyleType: "disc" }}>
              <li style={{ marginBottom: "0.5em" }}>Authentication session tokens (Firebase Auth).</li>
              <li style={{ marginBottom: "0.5em" }}>Basic preference storage (e.g. browser session state).</li>
              <li>You can disable cookies in your browser settings; however, this may prevent certain features (such as staying logged in) from working correctly.</li>
            </ul>
          </div>
        </Section>

        <Section title="5. Data Retention">
          <p>
            We retain your account data for as long as your account is active. If you delete your account, we will remove your personal information from our database within a reasonable timeframe, except where we are required to retain it for legal or operational reasons.
          </p>
        </Section>

        <Section title="6. Data Security">
          <p style={{ marginBottom: "1em" }}>We take reasonable technical and organisational measures to protect your data, including -</p>
          <ul style={{ paddingLeft: "1.5em", listStyleType: "disc", marginBottom: "1.5em" }}>
            <li style={{ marginBottom: "0.5em" }}>Passwords hashed using bcrypt before storage.</li>
            <li style={{ marginBottom: "0.5em" }}>All data transmitted over HTTPS/TLS encryption.</li>
            <li style={{ marginBottom: "0.5em" }}>Firebase Admin SDK for secure server-side token verification.</li>
            <li style={{ marginBottom: "0.5em" }}>Role-based access controls - admin features are restricted to verified admin accounts.</li>
            <li>No method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.</li>
          </ul>
        </Section>

        <Section title="7. Your Rights">
          <p style={{ marginBottom: "1em" }}>Depending on your jurisdiction, you may have the right to -</p>
          <ul style={{ paddingLeft: "1.5em", listStyleType: "disc", marginBottom: "1.5em" }}>
            <li style={{ marginBottom: "0.5em" }}>Access the personal data we hold about you.</li>
            <li style={{ marginBottom: "0.5em" }}>Request correction of inaccurate data.</li>
            <li style={{ marginBottom: "0.5em" }}>Request deletion of your account and associated data.</li>
            <li style={{ marginBottom: "0.5em" }}>Object to or restrict how we process your data.</li>
            <li>Withdraw consent for optional data processing at any time.</li>
          </ul>
          <p>
            To exercise any of these rights, please contact us at <a href={`mailto:${EMAIL}`} style={{ textDecoration: "underline" }}>{EMAIL}</a>. We will respond within a reasonable timeframe.
          </p>
        </Section>

        <Section title="8. Children's Privacy">
          <p>
            Opinionated Kalam is not directed at children under the age of 13. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us and we will take steps to delete it.
          </p>
        </Section>

        <Section title="9. Changes to This Policy">
          <p>
            We may update this Privacy Policy from time to time. When we do, we will revise the effective date at the top of this page. We encourage you to review this policy periodically. Continued use of the platform after changes constitutes acceptance of the revised policy.
          </p>
        </Section>

        <Section title="10. Contact Us">
          <p style={{ marginBottom: "1.5em" }}>
            If you have any questions, concerns, or requests regarding this Privacy Policy or your personal data, please reach out to us:
          </p>
          <p style={{ marginBottom: "0.5em" }}>
            <strong>Email:</strong> <a href={`mailto:${EMAIL}`} style={{ textDecoration: "underline" }}>{EMAIL}</a>
          </p>
          <p>
            <strong>Publication:</strong> {BRAND}
          </p>
        </Section>

        {/* Bottom Navigation Links */}
        <div style={{ marginTop: 80, marginBottom: 40, textAlign: "center", display: "flex", flexDirection: "column", gap: "15px" }}>
          <p style={{ fontFamily: "'Radley', serif", fontSize: "1.1rem", margin: 0 }}>
            Go through <button onClick={() => router.push("/terms")} style={{ background: "none", border: "none", cursor: "pointer", color: "#111111", padding: 0, textDecoration: "underline", font: "inherit" }}>Terms of Service</button> →
          </p>
          <p style={{ fontFamily: "'Radley', serif", fontSize: "1.1rem", margin: 0 }}>
            Go through <button onClick={() => router.push("/?tab=team")} style={{ background: "none", border: "none", cursor: "pointer", color: "#111111", padding: 0, textDecoration: "underline", font: "inherit" }}>Our Team</button> →
          </p>
          <p style={{ fontFamily: "'Radley', serif", fontSize: "1.1rem", margin: 0 }}>
            Go to <button onClick={() => router.push("/")} style={{ background: "none", border: "none", cursor: "pointer", color: "#111111", padding: 0, textDecoration: "underline", font: "inherit" }}>Back</button> →
          </p>
        </div>

      </div>
      {isMobile ? <MobileFooter /> : <Footer />}
    </div>
  );
}
