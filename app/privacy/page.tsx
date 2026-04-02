"use client";

import { useRouter } from "next/navigation";
import Footer from "@/components/layout/Footer";

const BRAND = "Opinionated Kalam";
const EFFECTIVE = "March 21, 2026";
const EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
const ACCENT = "#1B2A47";
const TERRA = "#D38B88";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 40 }}>
      <h2
        style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: "1.5rem",
          fontWeight: 400,
          color: ACCENT,
          marginBottom: 12,
          paddingBottom: 8,
          borderBottom: `2px solid ${TERRA}`,
        }}
      >
        {title}
      </h2>
      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.95rem", lineHeight: 1.85, color: "#2A2A2A" }}>
        {children}
      </div>
    </section>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p style={{ marginBottom: 14, marginTop: 0 }}>{children}</p>;
}

function UL({ items }: { items: string[] }) {
  return (
    <ul style={{ paddingLeft: "1.4rem", marginBottom: 14, marginTop: 0 }}>
      {items.map((item, i) => (
        <li key={i} style={{ marginBottom: 6 }}>{item}</li>
      ))}
    </ul>
  );
}

export default function PrivacyPolicyPage() {
  const router = useRouter();

  return (
    <>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "48px 24px 80px" }}>

        {/* Back */}
        <button
          onClick={() => router.push("/")}
          style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            fontSize: "0.85rem", fontWeight: 600, color: "var(--text-muted)",
            background: "none", border: "none", cursor: "pointer",
            fontFamily: "'Inter', sans-serif", padding: 0, marginBottom: 40,
          }}
        >
          <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, stroke: "currentColor", strokeWidth: 2, fill: "none" }}>
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back to Home
        </button>

        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: TERRA, marginBottom: 12 }}>
            Legal
          </p>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(2.2rem, 5vw, 3rem)", fontWeight: 400, color: "#1A1A1A", lineHeight: 1.1, marginBottom: 16 }}>
            Privacy Policy
          </h1>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.88rem", color: "var(--text-muted)" }}>
            Effective Date: <strong>{EFFECTIVE}</strong>
          </p>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.95rem", color: "#2A2A2A", lineHeight: 1.8, marginTop: 16 }}>
            At <strong>{BRAND}</strong>, we take your privacy seriously. This Privacy Policy
            explains what information we collect, how we use it, and the choices you have
            regarding your data when you use our platform.
          </p>
        </div>

        <Section title="1. Information We Collect">
          <P><strong>a) Information you provide directly:</strong></P>
          <UL items={[
            "Account registration details: name, email address, and password (stored securely via bcrypt hashing)",
            "Google account information if you sign in via Google OAuth (name, email, profile photo)",
            "Comments or other content you submit on the platform",
          ]} />
          <P><strong>b) Information collected automatically:</strong></P>
          <UL items={[
            "Usage data: pages visited, articles read, likes and saves",
            "Device and browser information (type, OS, screen size)",
            "IP address and approximate geographic location",
            "Referring URLs and session duration",
          ]} />
          <P><strong>c) Media uploads:</strong></P>
          <P>
            If you are an admin user, images and audio files you upload are stored via ImageKit
            and referenced in our database. These files are hosted on ImageKit's CDN infrastructure.
          </P>
        </Section>

        <Section title="2. How We Use Your Information">
          <P>We use the information we collect to:</P>
          <UL items={[
            "Create and manage your user account",
            "Personalise your experience (saved articles, liked content)",
            "Authenticate your identity via Firebase Authentication",
            "Moderate comments and enforce our Terms of Service",
            "Improve and maintain the platform",
            "Communicate important updates or security notices",
            "Analyse aggregate usage trends to improve content offerings",
          ]} />
          <P>
            We do not sell, rent, or share your personal information with third-party advertisers.
            {BRAND} is an ad-free publication.
          </P>
        </Section>

        <Section title="3. Third-Party Services We Use">
          <P>
            We rely on the following third-party services to operate {BRAND}. Each has its own
            privacy policy governing the data they process:
          </P>
          <UL items={[
            "Firebase (Google) — Authentication and identity management. Privacy policy: firebase.google.com",
            "MongoDB Atlas — Cloud database for storing articles, user data, and comments",
            "ImageKit — Image and audio CDN for media hosting",
            "Vercel — Hosting and serverless infrastructure",
            "Google Fonts — Font delivery (DM Serif Display, Inter)",
          ]} />
          <P>
            When you sign in with Google, Google may collect data in accordance with Google's own
            privacy policies. We only receive basic profile information (name, email, avatar) from
            Google.
          </P>
        </Section>

        <Section title="4. Cookies and Tracking">
          <P>
            {BRAND} uses minimal cookies necessary for the platform to function, including
            session cookies for authentication. We do not use third-party advertising trackers
            or behavioural profiling cookies.
          </P>
          <P>Cookies we may set include:</P>
          <UL items={[
            "Authentication session tokens (Firebase Auth)",
            "Basic preference storage (e.g. browser session state)",
          ]} />
          <P>
            You can disable cookies in your browser settings; however, this may prevent certain
            features (such as staying logged in) from working correctly.
          </P>
        </Section>

        <Section title="5. Data Retention">
          <P>
            We retain your account data for as long as your account is active. If you delete
            your account, we will remove your personal information from our database within a
            reasonable timeframe, except where we are required to retain it for legal or
            operational reasons.
          </P>
          <P>
            Comments you have posted may remain visible in anonymised or redacted form even
            after account deletion, unless you request their removal.
          </P>
        </Section>

        <Section title="6. Data Security">
          <P>
            We take reasonable technical and organisational measures to protect your data,
            including:
          </P>
          <UL items={[
            "Passwords hashed using bcrypt before storage",
            "All data transmitted over HTTPS/TLS encryption",
            "Firebase Admin SDK for secure server-side token verification",
            "Role-based access controls — admin features are restricted to verified admin accounts",
          ]} />
          <P>
            No method of transmission over the internet or electronic storage is 100% secure.
            While we strive to protect your data, we cannot guarantee absolute security.
          </P>
        </Section>

        <Section title="7. Your Rights">
          <P>Depending on your jurisdiction, you may have the right to:</P>
          <UL items={[
            "Access the personal data we hold about you",
            "Request correction of inaccurate data",
            "Request deletion of your account and associated data",
            "Object to or restrict how we process your data",
            "Withdraw consent for optional data processing at any time",
          ]} />
          <P>
            To exercise any of these rights, please contact us at{" "}
            <a href={`mailto:${EMAIL}`} style={{ color: ACCENT }}>{EMAIL}</a>. We will respond
            within a reasonable timeframe.
          </P>
        </Section>

        <Section title="8. Children's Privacy">
          <P>
            {BRAND} is not directed at children under the age of 13. We do not knowingly
            collect personal information from children. If you believe a child has provided us
            with personal information, please contact us and we will take steps to delete it.
          </P>
        </Section>

        <Section title="9. Changes to This Policy">
          <P>
            We may update this Privacy Policy from time to time. When we do, we will revise the
            effective date at the top of this page. We encourage you to review this policy
            periodically. Continued use of the platform after changes constitutes acceptance of
            the revised policy.
          </P>
        </Section>

        <Section title="10. Contact Us">
          <P>
            If you have any questions, concerns, or requests regarding this Privacy Policy or
            your personal data, please reach out to us:
          </P>
          <P>
            <strong>Email:</strong>{" "}
            <a href={`mailto:${EMAIL}`} style={{ color: ACCENT }}>
              {EMAIL}
            </a>
          </P>
          <P>
            <strong>Publication:</strong> {BRAND}
          </P>
        </Section>

        {/* Divider */}
        <div style={{ borderTop: "1px solid var(--border)", paddingTop: 24, marginTop: 8 }}>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", color: "var(--text-muted)" }}>
            © {new Date().getFullYear()} {BRAND}. All rights reserved.{" "}
            <button
              onClick={() => router.push("/terms")}
              style={{ background: "none", border: "none", cursor: "pointer", color: ACCENT, fontWeight: 600, fontSize: "0.8rem", fontFamily: "'Inter', sans-serif", padding: 0, textDecoration: "underline" }}
            >
              Terms of Service →
            </button>
          </p>
        </div>

      </div>
      <Footer />
    </>
  );
}
