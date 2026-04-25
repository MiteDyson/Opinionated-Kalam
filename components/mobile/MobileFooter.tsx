"use client";

import Link from "next/link";

const BLACK = "#111111";
const MUTED = "#666666";
const BG    = "#f5f0eb";
const BORDER = "#e0d8d0";

export default function MobileFooter() {
  const COLUMNS = [
    {
      title: "Learn",
      links: [
        { label: "About Us", href: "/?tab=about" },
        { label: "Our Team", href: "#" },
      ]
    },
    {
      title: "Connect",
      links: [
        { label: "Contact Us", href: "#" },
        { label: "Grievance Redressal", href: "/?tab=grievance" },
      ]
    },
    {
      title: "Legal",
      links: [
        { label: "Terms of Service", href: "/terms" },
        { label: "Privacy Policy", href: "/privacy" },
      ]
    }
  ];

  return (
    <footer style={{ backgroundColor: "#222222", color: "#F8F8F8", padding: "40px 20px 30px", marginTop: 40, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 60 }}>
        
        {COLUMNS.map((col, idx) => (
          <div key={idx} style={{ textAlign: "center" }}>
            <h4 style={{
              fontFamily: "'DM Serif Display', serif", fontWeight: 400, fontSize: "1.1rem",
              marginBottom: 20, color: "#e8e5e0", letterSpacing: "0.02em",
            }}>
              {col.title}
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
              {col.links.map(link => (
                <li key={link.label}>
                  <Link href={link.href} style={{
                    color: "#d0ccc5", fontSize: "0.7rem", fontFamily: "'Inter', sans-serif",
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
          fontSize: "2.4rem", color: "#e8e5e0", lineHeight: 1,
        }}>
          Opinionated Kalam
        </div>
        <p style={{
          color: "#999", fontSize: "0.65rem", marginTop: 10,
          fontFamily: "'Inter', sans-serif",
        }}>
          © {new Date().getFullYear()} Opinionated Kalam. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
