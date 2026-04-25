"use client";

import Link from "next/link";

const BLACK = "#111111";
const MUTED = "#666666";
const BG    = "#f5f0eb";
const BORDER = "#e0d8d0";

export default function MobileFooter() {
  const LEFT_COL = [
    { label: "About Us", href: "#" },
    { label: "Contact Us", href: "#" },
  ];

  const RIGHT_COL = [
    { label: "Terms of Service", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Grievance Redressal", href: "#" },
  ];

  return (
    <footer style={{ backgroundColor: "#222222", color: "#F8F8F8", padding: "40px 20px 30px", marginTop: 40, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 60 }}>
        
        {/* Left Column - Learn */}
        <div style={{ textAlign: "center" }}>
          <h4 style={{
            fontFamily: "'DM Serif Display', serif", fontWeight: 400, fontSize: "1.2rem",
            marginBottom: 20, color: "#e8e5e0", letterSpacing: "0.02em",
          }}>
            Learn
          </h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
            {LEFT_COL.map(link => (
              <li key={link.label}>
                <Link href={link.href} style={{
                  color: "#d0ccc5", fontSize: "0.8rem", fontFamily: "'Inter', sans-serif",
                  textDecoration: "none",
                }}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Column - Legal */}
        <div style={{ textAlign: "center" }}>
          <h4 style={{
            fontFamily: "'DM Serif Display', serif", fontWeight: 400, fontSize: "1.2rem",
            marginBottom: 20, color: "#e8e5e0", letterSpacing: "0.02em",
          }}>
            Legal
          </h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
            {RIGHT_COL.map(link => (
              <li key={link.label}>
                <Link href={link.href} style={{
                  color: "#d0ccc5", fontSize: "0.8rem", fontFamily: "'Inter', sans-serif",
                  textDecoration: "none",
                }}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        
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
