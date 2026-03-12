import Link from "next/link";
import { Youtube } from "lucide-react";

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const footerLinks = [
  {
    heading: "Explore",
    links: [
      { label: "Automotive",  href: "/category/automotive" },
      { label: "Geopolitics", href: "/category/geopolitics" },
      { label: "Scandals",    href: "/category/scandals" },
      { label: "Crime",       href: "/category/crime" },
      { label: "Explainers",  href: "/category/explainers" },
    ],
  },
  {
    heading: "Formats",
    links: [
      { label: "Long Reads",   href: "/articles" },
      { label: "Short Reads",  href: "/shorts" },
      { label: "Video Essays", href: "/videos" },
      { label: "Podcasts",     href: "/podcasts" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About Us",    href: "/about" },
      { label: "Contact Us",  href: "/contact" },
      { label: "Write for Us",href: "/write-for-us" },
      { label: "Advertise",   href: "/advertise" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Terms of Service", href: "/terms" },
      { label: "Privacy Policy",   href: "/privacy" },
      { label: "Sitemap",          href: "/sitemap.xml" },
    ],
  },
];

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "var(--footer-bg)", color: "white", marginTop: "5rem" }}>
      <div className="max-w-[1200px] mx-auto px-5 py-14">

        {/* Links grid */}
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-10 pb-14"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}
        >
          {footerLinks.map((col) => (
            <div key={col.heading}>
              <h4 className="font-serif text-base mb-4 text-white">{col.heading}</h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm transition-colors"
                      style={{ color: "#9ca3af" }}
                      onMouseEnter={(e) =>
                        ((e.target as HTMLElement).style.color = "white")
                      }
                      onMouseLeave={(e) =>
                        ((e.target as HTMLElement).style.color = "#9ca3af")
                      }
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="pt-10 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex flex-col items-start gap-1">
            <span className="font-serif text-3xl text-white leading-none">
              Opinionated Kalam
            </span>
            <span className="flex items-center gap-1.5 text-xs" style={{ color: "#9ca3af" }}>
              by{" "}
              <span className="inline-block bg-white text-black px-1.5 py-0.5 rounded-md text-[10px] font-semibold tracking-wider">
                dense
              </span>
            </span>
          </div>

          {/* Socials */}
          <div className="flex items-center gap-5">
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="hover:opacity-75 transition-opacity"
              style={{ color: "#ef4444" }}
            >
              <Youtube size={24} strokeWidth={1.8} />
            </a>
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X"
              className="transition-colors"
              style={{ color: "#9ca3af" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "white")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#9ca3af")}
            >
              <XIcon className="w-5 h-5" />
            </a>
          </div>
        </div>

        <p className="mt-8 text-xs text-center md:text-left" style={{ color: "#4b4b4b" }}>
          © {new Date().getFullYear()} Opinionated Kalam. All Rights Reserved. Made with care by{" "}
          <a href="https://dense.studio" className="hover:underline" style={{ color: "#6b6b6b" }}>
            Dense
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
