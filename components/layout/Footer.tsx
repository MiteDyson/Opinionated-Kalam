import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "#151515", color: "#F8F8F8", padding: "60px 0 40px", marginTop: 80 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 120, marginBottom: 80 }}>
          {[
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
          ].map((col) => (
            <div key={col.title} style={{ textAlign: "center" }}>
              <h3
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 700,
                  fontSize: "1rem",
                  marginBottom: 20,
                  color: "white",
                }}
              >
                {col.title}
              </h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      style={{
                        color: "#888",
                        fontSize: "0.88rem",
                        fontFamily: "'Inter', sans-serif",
                        textDecoration: "none",
                        transition: "color 0.15s",
                      }}
                      onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "white")}
                      onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "#888")}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "clamp(2.5rem, 7vw, 5rem)",
              color: "white",
              lineHeight: 1,
            }}
          >
            Opinionated Kalam
          </div>
          <p
            style={{
              color: "#555",
              fontSize: "0.75rem",
              marginTop: 16,
              fontFamily: "'Inter', sans-serif",
            }}
          >
            © {new Date().getFullYear()} Opinionated Kalam. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}