"use client";

export default function MobileFooter() {
  return (
    <footer style={{ backgroundColor: "#151515", color: "#F8F8F8", padding: "40px 24px 32px", marginTop: 48 }}>
      <div style={{ display: "flex", justifyContent: "space-around", marginBottom: 48 }}>
        <div style={{ textAlign: "center" }}>
          <h3 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: "0.9rem", marginBottom: 16, color: "white" }}>Learn</h3>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
            <li><a href="#" style={{ color: "#888", fontSize: "0.82rem", fontFamily: "'Inter', sans-serif", textDecoration: "none" }}>About Us</a></li>
            <li><a href="#" style={{ color: "#888", fontSize: "0.82rem", fontFamily: "'Inter', sans-serif", textDecoration: "none" }}>Contact Us</a></li>
          </ul>
        </div>
        <div style={{ textAlign: "center" }}>
          <h3 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: "0.9rem", marginBottom: 16, color: "white" }}>Legal</h3>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
            <li><a href="/terms" style={{ color: "#888", fontSize: "0.82rem", fontFamily: "'Inter', sans-serif", textDecoration: "none" }}>Terms of Service</a></li>
            <li><a href="/privacy" style={{ color: "#888", fontSize: "0.82rem", fontFamily: "'Inter', sans-serif", textDecoration: "none" }}>Privacy Policy</a></li>
            <li><a href="#" style={{ color: "#888", fontSize: "0.82rem", fontFamily: "'Inter', sans-serif", textDecoration: "none" }}>Grievance Redressal</a></li>
          </ul>
        </div>
      </div>

      <div style={{ textAlign: "center" }}>
        <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(1.8rem, 8vw, 2.8rem)", color: "white", lineHeight: 1.1, marginBottom: 12 }}>
          Opinionated Kalam
        </div>
        <p style={{ color: "#555", fontSize: "0.72rem", fontFamily: "'Inter', sans-serif" }}>
          © {new Date().getFullYear()} Opinionated Kalam. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
