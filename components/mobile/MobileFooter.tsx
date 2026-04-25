"use client";

import Link from "next/link";

const BLACK = "#111111";
const MUTED = "#666666";
const BG    = "#f5f0eb";
const BORDER = "#e0d8d0";

const FOOTER_COLS = [
  {
    title: "Learn",
    links: [
      { label: "About Us", href: "#" },
      { label: "Our Team", href: "#" },
    ],
  },
  {
    title: "Connect",
    links: [
      { label: "Contact Us", href: "#" },
      { label: "Grievance Redressal", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms of Service", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
    ],
  },
];

export default function MobileFooter() {
  return (
    <footer style={{ backgroundColor: "#151515", color: "#F8F8F8", padding: "36px 20px 28px", marginTop: 32 }}>
      {/* Three columns */}
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 32 }}>
        {FOOTER_COLS.map(col => (
          <div key={col.title} style={{ flex: 1, textAlign: "center" }}>
            <h4 style={{
              fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: "0.78rem",
              marginBottom: 12, color: "white", letterSpacing: "0.03em",
            }}>
              {col.title}
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
              {col.links.map(link => (
                <li key={link.label}>
                  <Link href={link.href} style={{
                    color: "#888", fontSize: "0.72rem", fontFamily: "'Inter', sans-serif",
                    textDecoration: "none",
                  }}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Brand */}
      <div style={{ textAlign: "center" }}>
        <div style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: "1.5rem", color: "white", lineHeight: 1,
        }}>
          Opinionated Kalam
        </div>
        <p style={{
          color: "#555", fontSize: "0.65rem", marginTop: 10,
          fontFamily: "'Inter', sans-serif",
        }}>
          © {new Date().getFullYear()} Opinionated Kalam. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
