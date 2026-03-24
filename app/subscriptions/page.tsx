"use client";

import { useRouter } from "next/navigation";
import Footer from "@/components/layout/Footer";

export default function SubscriptionsPage() {
  const router = useRouter();

  return (
    <>
      <div
        style={{
          minHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px 24px",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "3.5rem", marginBottom: 24 }}>🛠️</div>
        <h1
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(2rem, 5vw, 2.8rem)",
            fontWeight: 400,
            color: "var(--text-main)",
            marginBottom: 16,
            lineHeight: 1.1,
          }}
        >
          Work in Progress
        </h1>
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "1rem",
            color: "var(--text-muted)",
            maxWidth: 420,
            lineHeight: 1.75,
            marginBottom: 36,
          }}
        >
          Subscriptions are being built. Check back soon — we're working on
          something worth subscribing to.
        </p>
        <button
          onClick={() => router.push("/")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 22px",
            backgroundColor: "var(--text-main)",
            color: "white",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.88rem",
            fontWeight: 600,
          }}
        >
          ← Back to Home
        </button>
      </div>
      <Footer />
    </>
  );
}
