export default function Footer() {
  return (
    <footer style={{
      backgroundColor: "var(--footer-bg)",
      color: "#F8F8F8",
      padding: "60px 0 40px",
      marginTop: 80,
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
        {/* Links grid */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: "clamp(40px, 8vw, 100px)",
          marginBottom: 60,
          textAlign: "center",
          flexWrap: "wrap",
        }}>
          {[
            {
              title: "Explore",
              links: ["Automotive", "Geo Politics", "Scandals", "Crime", "Explainers"],
            },
            {
              title: "Learn",
              links: ["About Us", "Contact Us"],
            },
            {
              title: "Legal",
              links: ["Terms of Service", "Privacy Policy", "Sitemap"],
            },
          ].map((col) => (
            <div key={col.title}>
              <h3 style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "1.2rem",
                fontWeight: 400,
                marginBottom: 18,
              }}>
                {col.title}
              </h3>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      style={{ color: "#A3A3A3", fontSize: "0.9rem", transition: "color 0.15s" }}
                      onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "white")}
                      onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "#A3A3A3")}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <div style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "3rem",
            color: "white",
            lineHeight: 1,
          }}>
            Opinionated Kalam
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.75rem", color: "white" }}>
            by{" "}
            <span style={{
              backgroundColor: "white",
              color: "black",
              padding: "2px 7px",
              borderRadius: 6,
              fontWeight: 600,
              fontSize: "0.65rem",
              letterSpacing: "0.5px",
            }}>
              dense
            </span>
          </div>
          <p style={{ color: "#A3A3A3", fontSize: "0.8rem", marginTop: 12 }}>
            © 2026 Opinionated Kalam. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
