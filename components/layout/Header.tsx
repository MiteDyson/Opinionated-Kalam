"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, Youtube } from "lucide-react";
import Logo from "./Logo";
import SideMenu from "./SideMenu";
import { formatDate } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Home",     href: "/" },
  { label: "Recent",   href: "/articles" },
  { label: "Videos",   href: "/videos" },
  { label: "Podcasts", href: "/podcasts" },
  { label: "Shorts",   href: "/shorts" },
];

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      <header
        className="sticky top-0 z-30"
        style={{
          backgroundColor: "var(--bg)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="max-w-[1200px] mx-auto px-5">

          {/* Top bar */}
          <div className="flex items-center justify-between py-5">
            <div className="w-48 hidden md:block">
              <p className="text-xs font-sans" style={{ color: "var(--text-muted)" }}>
                {formatDate(new Date())}
              </p>
            </div>

            <Logo size="md" />

            <div className="w-48 flex items-center justify-end gap-4">
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="hover:opacity-75 transition-opacity"
                style={{ color: "var(--red)" }}
              >
                <Youtube size={26} strokeWidth={1.8} />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
                className="hover:opacity-60 transition-opacity"
                style={{ color: "var(--text-main)" }}
              >
                <XIcon className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Nav bar */}
          <nav
            className="flex items-center justify-between py-3"
            style={{ borderTop: "1px solid var(--border)" }}
          >
            {/* Left */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMenuOpen(true)}
                className="hover:opacity-60 transition-opacity"
                aria-label="Open menu"
                style={{ color: "var(--text-main)" }}
              >
                <Menu size={22} strokeWidth={1.8} />
              </button>
              <Link
                href="/search"
                className="flex items-center gap-1.5 text-sm transition-colors hover:opacity-80"
                style={{ color: "var(--text-muted)" }}
              >
                <Search size={16} strokeWidth={1.8} />
                <span className="hidden sm:inline">Search</span>
              </Link>
            </div>

            {/* Center nav links */}
            <div className="flex items-center gap-6 md:gap-8">
              {NAV_LINKS.map((link) => {
                const isActive =
                  link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="relative text-sm transition-colors pb-3 -mb-3"
                    style={{
                      color: isActive ? "var(--text-main)" : "var(--text-muted)",
                      fontWeight: isActive ? 600 : 500,
                    }}
                  >
                    {link.label}
                    {isActive && (
                      <span
                        className="absolute bottom-0 left-0 w-full"
                        style={{ height: "2px", backgroundColor: "var(--text-main)" }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Right */}
            <div>
              <Link
                href="/subscribe"
                className="hidden sm:inline-flex items-center gap-1 text-sm font-medium px-3 py-1.5 rounded-full transition-all duration-200"
                style={{
                  border: "1px solid var(--text-main)",
                  color: "var(--text-main)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = "var(--text-main)";
                  (e.currentTarget as HTMLElement).style.color = "var(--bg)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                  (e.currentTarget as HTMLElement).style.color = "var(--text-main)";
                }}
              >
                Subscribe
              </Link>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}
