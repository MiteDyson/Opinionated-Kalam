"use client";

import { useRouter } from "next/navigation";
import Footer from "@/components/layout/Footer";

const BRAND = "Opinionated Kalam";
const EFFECTIVE = "March 21, 2026";
const EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
// TODO: update SITE when domain is confirmed
const SITE = "opinionatedkalam.com";
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

export default function TermsOfServicePage() {
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
            Terms of Service
          </h1>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.88rem", color: "var(--text-muted)" }}>
            Effective Date: <strong>{EFFECTIVE}</strong>
          </p>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.95rem", color: "#2A2A2A", lineHeight: 1.8, marginTop: 16 }}>
            Welcome to <strong>{BRAND}</strong>. By accessing or using our website at{" "}
            <strong>{SITE}</strong>, you agree to be bound by these Terms of Service. Please read
            them carefully before using the platform.
          </p>
        </div>

        <Section title="1. Acceptance of Terms">
          <P>
            By accessing, browsing, or using {BRAND} in any way, you acknowledge that you have
            read, understood, and agree to be bound by these Terms of Service and our Privacy
            Policy. If you do not agree, please discontinue your use of the platform immediately.
          </P>
          <P>
            We reserve the right to update these Terms at any time. Continued use of the platform
            after changes constitutes your acceptance of the revised Terms. We will indicate the
            effective date at the top of this page.
          </P>
        </Section>

        <Section title="2. Description of Service">
          <P>
            {BRAND} is an independent digital publication offering articles, podcasts, video
            essays, and short reads covering topics including but not limited to automotive,
            geopolitics, scandals, crime, and explainers.
          </P>
          <P>The platform provides:</P>
          <UL items={[
            "Free access to published articles, podcasts, videos, and short reads",
            "User accounts for saving articles, liking content, and leaving comments",
            "Admin tools for content creation and management (admin users only)",
          ]} />
        </Section>

        <Section title="3. User Accounts">
          <P>
            To access certain features (liking, saving, commenting), you may create an account
            via email/password or Google Sign-In. You are responsible for maintaining the
            confidentiality of your credentials and for all activity that occurs under your account.
          </P>
          <P>You agree to:</P>
          <UL items={[
            "Provide accurate and truthful registration information",
            "Not share your account credentials with third parties",
            "Notify us immediately at " + EMAIL + " if you suspect unauthorized access",
            "Not create accounts under false pretences or impersonate others",
          ]} />
          <P>
            We reserve the right to suspend or terminate any account that violates these Terms,
            without prior notice.
          </P>
        </Section>

        <Section title="4. User-Generated Content">
          <P>
            If you submit comments or other content on the platform, you grant {BRAND} a
            non-exclusive, royalty-free, worldwide licence to display, reproduce, and distribute
            that content in connection with the platform.
          </P>
          <P>You agree not to post content that:</P>
          <UL items={[
            "Is defamatory, abusive, harassing, threatening, or hateful",
            "Infringes any intellectual property rights of a third party",
            "Contains spam, malware, or unsolicited advertising",
            "Violates any applicable law or regulation",
            "Is sexually explicit or promotes violence",
          ]} />
          <P>
            All comments are subject to moderation. We reserve the right to remove any content
            at our sole discretion.
          </P>
        </Section>

        <Section title="5. Intellectual Property">
          <P>
            All content published on {BRAND} — including articles, podcasts, graphics, logos,
            and the overall design — is the intellectual property of {BRAND} or its respective
            contributors, protected under applicable copyright and intellectual property laws.
          </P>
          <P>You may not:</P>
          <UL items={[
            "Reproduce, redistribute, or republish any content without prior written permission",
            "Scrape, crawl, or systematically extract content from the platform",
            "Use our branding or trademarks without explicit authorisation",
          ]} />
          <P>
            Limited personal, non-commercial use (e.g. sharing links, quoting brief excerpts with
            attribution) is permitted.
          </P>
        </Section>

        <Section title="6. Third-Party Services">
          <P>
            {BRAND} uses third-party services including Firebase (authentication), MongoDB
            (database), ImageKit (media hosting), and Vercel (hosting). Use of these services
            is subject to their respective terms and privacy policies. We are not responsible
            for any third-party service outages, data handling, or policy changes.
          </P>
        </Section>

        <Section title="7. Disclaimers">
          <P>
            The content published on {BRAND} is for informational and editorial purposes only.
            It does not constitute professional legal, financial, medical, or any other form of
            advice.
          </P>
          <P>
            {BRAND} is provided on an "as is" and "as available" basis. We make no warranties,
            express or implied, regarding the accuracy, reliability, or completeness of any
            content. We do not guarantee uninterrupted or error-free access to the platform.
          </P>
        </Section>

        <Section title="8. Limitation of Liability">
          <P>
            To the fullest extent permitted by law, {BRAND} and its operators shall not be
            liable for any indirect, incidental, consequential, or punitive damages arising out
            of your use of, or inability to use, the platform or its content — even if we have
            been advised of the possibility of such damages.
          </P>
        </Section>

        <Section title="9. Prohibited Conduct">
          <P>You agree not to:</P>
          <UL items={[
            "Attempt to gain unauthorised access to any part of the platform or its systems",
            "Interfere with or disrupt the platform's infrastructure or servers",
            "Use automated tools to access, scrape, or download content at scale",
            "Attempt to reverse-engineer any part of the platform",
            "Use the platform for any unlawful purpose",
          ]} />
        </Section>

        <Section title="10. Termination">
          <P>
            We reserve the right to suspend or terminate your access to {BRAND} at any time,
            for any reason, including breach of these Terms. Upon termination, all licences
            granted to you under these Terms will immediately cease.
          </P>
        </Section>

        <Section title="11. Governing Law">
          <P>
            These Terms shall be governed by and construed in accordance with the laws of India.
            Any disputes arising under or in connection with these Terms shall be subject to the
            exclusive jurisdiction of the courts located in India.
          </P>
        </Section>

        <Section title="12. Contact Us">
          <P>
            If you have any questions about these Terms of Service, please contact us at:
          </P>
          <P>
            <strong>Email:</strong>{" "}
            <a href={`mailto:${EMAIL}`} style={{ color: ACCENT }}>
              {EMAIL}
            </a>
          </P>
        </Section>

        {/* Divider */}
        <div style={{ borderTop: "1px solid var(--border)", paddingTop: 24, marginTop: 8 }}>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", color: "var(--text-muted)" }}>
            © {new Date().getFullYear()} {BRAND}. All rights reserved.{" "}
            <button
              onClick={() => router.push("/privacy")}
              style={{ background: "none", border: "none", cursor: "pointer", color: ACCENT, fontWeight: 600, fontSize: "0.8rem", fontFamily: "'Inter', sans-serif", padding: 0, textDecoration: "underline" }}
            >
              Privacy Policy →
            </button>
          </p>
        </div>

      </div>
      <Footer />
    </>
  );
}