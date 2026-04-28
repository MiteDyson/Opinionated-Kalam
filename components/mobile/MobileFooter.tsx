"use client";

import Link from "next/link";

const BLACK = "#111111";
const MUTED = "#666666";
const BG    = "#f5f0eb";
const BORDER = "#e0d8d0";

export default function MobileFooter() {
  const COLUMNS = [
    {
      title: "Legal",
      links: [
        { label: "Terms of Service", href: "/terms" },
        { label: "Privacy Policy", href: "/privacy" },
      ]
    },
    {
      title: "Connect",
      links: [
        { label: "Grievance Redressal", href: "/?tab=grievance" },
        { label: "Contact Us", href: "#" },
      ]
    },
    {
      title: "Learn",
      links: [
        { label: "Our Team", href: "/?tab=team" },
        { label: "About Us", href: "/?tab=about" },
      ]
    }
  ];

  return (
    <footer className="bg-[#222222] text-[#F8F8F8] px-4 pt-[40px] pb-[30px] mt-10 rounded-t-[10px]">
      <div className="grid grid-cols-3 gap-[10px] mb-[60px]">
        {COLUMNS.map((col, idx) => (
          <div key={idx} className="text-center">
            <h4 className="font-serif font-normal text-[1.1rem] mb-5 text-[#e8e5e0] tracking-[0.02em]">
              {col.title}
            </h4>
            <ul className="list-none p-0 m-0 flex flex-col gap-3">
              {col.links.map(link => (
                <li key={link.label}>
                  <Link href={link.href} className="text-[#d0ccc5] text-[0.7rem] font-sans no-underline hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Brand */}
      <div className="text-center">
        <div className="font-serif text-[2.4rem] text-[#e8e5e0] leading-none">
          Opinionated Kalam
        </div>
        <p className="text-[#999999] text-[0.65rem] mt-[10px] font-sans">
          © {new Date().getFullYear()} Opinionated Kalam. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
