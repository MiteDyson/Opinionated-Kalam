export default function Footer() {
  return (
    <footer style={{ backgroundColor: "#151515", color: "#F8F8F8", padding: "60px 0 36px", marginTop: 80 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: "clamp(40px, 8vw, 100px)", marginBottom: 64, textAlign: "center", flexWrap: "wrap" }}>
          {[
            { title: "Explore", links: ["Automotive", "Geo Politics", "Scandals", "Crime", "Explainers"] },
            { title: "Learn",   links: ["About Us", "Contact Us"] },
            { title: "Legal",   links: ["Terms of Service", "Privacy Policy", "Sitemap"] },
          ].map((col) => (
            <div key={col.title}>
              <h3 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: "1rem", marginBottom: 20, color: "white" }}>{col.title}</h3>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 11 }}>
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" style={{ color: "#888", fontSize: "0.88rem", fontFamily: "'Inter', sans-serif", transition: "color 0.15s" }}
                      onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "white")}
                      onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "#888")}
                    >{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(2rem, 6vw, 3.5rem)", color: "white", lineHeight: 1 }}>
            Opinionated Kalam
          </div>
          <p style={{ color: "#666", fontSize: "0.78rem", marginTop: 4, fontFamily: "'Inter', sans-serif" }}>
            © 2026 Opinionated Kalam. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
