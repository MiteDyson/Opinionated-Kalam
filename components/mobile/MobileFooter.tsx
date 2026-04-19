"use client";

const DARK_FOOTER = "#1a1a1a";

export default function MobileFooter() {
  return (
    <footer
      style={{
        backgroundColor: DARK_FOOTER,
        padding: "28px 24px 20px",
        marginTop: 40,
      }}
    >
      {/* Two-column grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h4
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              fontSize: "0.75rem",
              color: "white",
              marginBottom: 10,
              letterSpacing: "0.05em",
            }}
          >
            Learn
          </h4>
          <a
            href="#"
            style={{
              display: "block",
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.72rem",
              color: "#aaa",
              textDecoration: "none",
              marginBottom: 6,
            }}
          >
            About Us
          </a>
          <a
            href="#"
            style={{
              display: "block",
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.72rem",
              color: "#aaa",
              textDecoration: "none",
              marginBottom: 6,
            }}
          >
            Contact Us
          </a>
        </div>

        <div style={{ textAlign: "center" }}>
          <h4
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              fontSize: "0.75rem",
              color: "white",
              marginBottom: 10,
              letterSpacing: "0.05em",
            }}
          >
            Legal
          </h4>
          <a
            href="/terms"
            style={{
              display: "block",
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.72rem",
              color: "#aaa",
              textDecoration: "none",
              marginBottom: 6,
            }}
          >
            Terms of Service
          </a>
          <a
            href="/privacy"
            style={{
              display: "block",
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.72rem",
              color: "#aaa",
              textDecoration: "none",
              marginBottom: 6,
            }}
          >
            Privacy Policy
          </a>
          <a
            href="#"
            style={{
              display: "block",
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.72rem",
              color: "#aaa",
              textDecoration: "none",
            }}
          >
            Grievance Redressal
          </a>
        </div>
      </div>

      {/* Brand name centred */}
      <div
        style={{
          textAlign: "center",
          paddingTop: 20,
          borderTop: "1px solid #333",
        }}
      >
        <h2
          style={{
            fontFamily: "'Playfair Display', 'DM Serif Display', Georgia, serif",
            fontSize: "1.6rem",
            fontWeight: 900,
            color: "white",
            marginBottom: 8,
            letterSpacing: "-0.01em",
          }}
        >
          Opinionated Kalam
        </h2>
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.65rem",
            color: "#666",
          }}
        >
          © {new Date().getFullYear()} Opinionated Kalam. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
