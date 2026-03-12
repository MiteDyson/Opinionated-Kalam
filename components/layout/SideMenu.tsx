"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X, ChevronRight } from "lucide-react";

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuSections = [
  {
    label: "Topics",
    items: [
      { label: "Geopolitics",  href: "/category/geopolitics" },
      { label: "Automotive",   href: "/category/automotive" },
      { label: "Scandals",     href: "/category/scandals" },
      { label: "Crime",        href: "/category/crime" },
      { label: "Explainers",   href: "/category/explainers" },
      { label: "Economy",      href: "/category/economy" },
    ],
  },
  {
    label: "Formats",
    items: [
      { label: "Long Reads",   href: "/articles" },
      { label: "Short Reads",  href: "/shorts" },
      { label: "Video Essays", href: "/videos" },
      { label: "Podcasts",     href: "/podcasts" },
    ],
  },
  {
    label: "About",
    items: [
      { label: "About Us",      href: "/about" },
      { label: "Contact",       href: "/contact" },
      { label: "Write for Us",  href: "/write-for-us" },
    ],
  },
];

export default function SideMenu({ isOpen, onClose }: SideMenuProps) {
  const [openSection, setOpenSection] = useState<string | null>("Topics");

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 transition-all duration-300"
        style={{
          background: "rgba(0,0,0,0.4)",
          opacity: isOpen ? 1 : 0,
          visibility: isOpen ? "visible" : "hidden",
        }}
      />

      {/* Drawer */}
      <aside
        className="fixed top-0 left-0 h-full z-50 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out"
        style={{
          width: 300,
          backgroundColor: "var(--bg)",
          transform: isOpen ? "translateX(0)" : "translateX(-100%)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 pt-6 pb-5"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <span className="font-serif text-xl" style={{ color: "var(--text-main)" }}>
            Menu
          </span>
          <button
            onClick={onClose}
            className="p-1 rounded-md transition-colors hover:bg-black/5"
            aria-label="Close menu"
          >
            <X size={22} />
          </button>
        </div>

        {/* Sections */}
        <nav className="flex-1 overflow-y-auto px-6 py-5 space-y-1">
          {menuSections.map((section) => (
            <div key={section.label}>
              <button
                onClick={() =>
                  setOpenSection(openSection === section.label ? null : section.label)
                }
                className="flex items-center justify-between w-full py-2.5 text-sm font-semibold uppercase tracking-widest transition-colors"
                style={{ color: "var(--text-muted)" }}
              >
                {section.label}
                <ChevronRight
                  size={13}
                  className="transition-transform duration-200"
                  style={{
                    transform: openSection === section.label ? "rotate(90deg)" : "rotate(0deg)",
                  }}
                />
              </button>

              <div
                className="overflow-hidden transition-all duration-300"
                style={{
                  maxHeight: openSection === section.label ? "400px" : "0px",
                  opacity: openSection === section.label ? 1 : 0,
                }}
              >
                <ul className="pl-3 pb-3 space-y-1">
                  {section.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className="block py-1.5 text-sm transition-colors"
                        style={{ color: "var(--text-main)" }}
                        onMouseEnter={(e) =>
                          ((e.target as HTMLElement).style.color = "var(--red)")
                        }
                        onMouseLeave={(e) =>
                          ((e.target as HTMLElement).style.color = "var(--text-main)")
                        }
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-6 py-5" style={{ borderTop: "1px solid var(--border)" }}>
          <div className="flex gap-4 text-xs" style={{ color: "var(--text-muted)" }}>
            <Link href="/terms" className="hover:underline">Terms</Link>
            <Link href="/privacy" className="hover:underline">Privacy</Link>
          </div>
        </div>
      </aside>
    </>
  );
}
