"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, FileText, Mic, Video, Image,
  MessageSquare, Tag, Users, Settings, LogOut,
  ChevronLeft, ChevronRight,
} from "lucide-react";

const NAV = [
  {
    section: "Content",
    items: [
      { label: "Dashboard",   href: "/admin",            icon: LayoutDashboard },
      { label: "Articles",    href: "/admin/posts",       icon: FileText },
      { label: "Podcasts",    href: "/admin/podcasts",    icon: Mic },
      { label: "Videos",      href: "/admin/videos",      icon: Video },
      { label: "Media",       href: "/admin/media",       icon: Image },
    ],
  },
  {
    section: "Community",
    items: [
      { label: "Comments",    href: "/admin/comments",    icon: MessageSquare },
      { label: "Authors",     href: "/admin/authors",     icon: Users },
      { label: "Categories",  href: "/admin/categories",  icon: Tag },
    ],
  },
  {
    section: "System",
    items: [
      { label: "Settings",    href: "/admin/settings",    icon: Settings },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className="flex h-screen overflow-hidden font-sans"
      style={{ backgroundColor: "#0F0F0F", color: "white" }}
    >
      {/* Sidebar */}
      <aside
        className="flex flex-col flex-shrink-0 transition-all duration-300"
        style={{
          width: collapsed ? 64 : 220,
          backgroundColor: "#151515",
          borderRight: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        {/* Logo */}
        <div
          className="flex items-center justify-between px-4 py-5"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
        >
          {!collapsed && (
            <div>
              <span className="font-serif text-lg leading-none text-white block">OK</span>
              <span className="text-[10px]" style={{ color: "#6b7280" }}>Admin</span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-md transition-colors ml-auto"
            style={{ color: "#6b7280" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = "white";
              (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.1)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = "#6b7280";
              (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
            }}
          >
            {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-5">
          {NAV.map((group) => (
            <div key={group.section}>
              {!collapsed && (
                <p
                  className="text-[10px] font-semibold uppercase tracking-widest px-2 mb-1.5"
                  style={{ color: "#4b5563" }}
                >
                  {group.section}
                </p>
              )}
              <ul className="space-y-0.5">
                {group.items.map(({ label, href, icon: Icon }) => {
                  const active =
                    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
                  return (
                    <li key={href}>
                      <Link
                        href={href}
                        title={collapsed ? label : undefined}
                        className="flex items-center gap-3 px-2.5 py-2 rounded-md text-sm transition-colors"
                        style={{
                          color: active ? "white" : "#9ca3af",
                          backgroundColor: active ? "rgba(255,255,255,0.1)" : "transparent",
                          fontWeight: active ? 500 : 400,
                          justifyContent: collapsed ? "center" : undefined,
                        }}
                      >
                        <Icon size={16} strokeWidth={1.8} className="flex-shrink-0" />
                        {!collapsed && <span>{label}</span>}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-2 py-4" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <button
            className="flex items-center gap-3 px-2.5 py-2 rounded-md text-sm w-full transition-colors"
            style={{
              color: "#6b7280",
              justifyContent: collapsed ? "center" : undefined,
            }}
          >
            <LogOut size={16} strokeWidth={1.8} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header
          className="flex items-center justify-between px-6 py-4 flex-shrink-0"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
        >
          <h1 className="text-sm font-medium text-white">
            Opinionated Kalam — Admin
          </h1>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="text-xs transition-colors"
              style={{ color: "#9ca3af" }}
            >
              View site ↗
            </Link>
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold text-white"
              style={{ backgroundColor: "var(--terracotta)" }}
            >
              V
            </div>
          </div>
        </header>

        {/* Page */}
        <main className="flex-1 overflow-y-auto p-6" style={{ backgroundColor: "#0F0F0F" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
