"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Menu, LogOut, User, ShieldCheck, Bookmark, CreditCard } from "lucide-react";

const RED = "#c0392b";
const BLACK = "#111111";
const BG = "#f5f0eb";
const BORDER = "#e0d8d0";
const MUTED = "#666666";
const ACCENT = "#1B2A47";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onTabChange: (tab: string) => void;
  onBeatSelect?: (beat: string) => void;
}

export default function MobileSideMenu({ isOpen, onClose, onTabChange, onBeatSelect }: Props) {
  const { user, logout, isAdmin } = useAuth();

  const itemStyle: React.CSSProperties = {
    display: "flex", alignItems: "center", gap: 12,
    fontFamily: "'Inter', sans-serif", fontSize: "1rem", fontWeight: 400, color: BLACK,
    padding: "11px 0", cursor: "pointer", background: "none", border: "none",
    width: "100%", textAlign: "left",
  };

  return (
    <>
      {/* Overlay */}
      <div 
        onClick={onClose} 
        className={`fixed inset-0 bg-black/35 z-[199] transition-all duration-300 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`} 
      />

      {/* Panel */}
      <div className={`fixed top-0 bottom-0 left-0 w-[62%] max-w-[260px] h-full bg-[#f5f0eb] z-[200] shadow-[4px_0_24px_rgba(0,0,0,0.15)] transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        {/* Header row */}
        <div className="flex items-center gap-[10px] px-5 pt-5 pb-4">
          <button onClick={onClose} className="bg-none border-none cursor-pointer flex p-0">
            <Menu size={22} className="text-[#c0392b]" />
          </button>
          <span className="font-sans font-bold text-[1.1rem] text-[#c0392b]">Menu</span>
        </div>

        {/* Scrollable items */}
        <div className="flex-1 px-5 overflow-y-auto">
          {[
            { label: "Saved Content", href: "/saved", icon: Bookmark },
            { label: "My Subscriptions", href: "/subscriptions", icon: CreditCard },
          ].map((item) => (
            <a 
              key={item.label} 
              href={item.href} 
              onClick={onClose} 
              className="flex items-center gap-3 font-sans text-base font-normal text-[#111111] py-[11px] no-underline hover:text-[#c0392b] transition-colors"
            >
              <item.icon size={18} />
              {item.label}
            </a>
          ))}
        </div>

        {/* Bottom: user + admin button + signout */}
        <div className="px-5 pt-4 pb-[28px] border-t border-[#e0d8d0]">
          {user ? (
            <>
              {/* User info */}
              <div className="mb-3 pb-3 border-b border-[#e0d8d0] flex items-center gap-[10px]">
                <User size={24} className="text-[#666666]" />
                <div className="flex-1 min-w-0">
                  <div className="font-sans text-[0.8rem] font-semibold text-[#111111] mb-[1px] truncate">
                    {user.displayName?.trim() || "User"}
                  </div>
                  <div className="font-sans text-[0.7rem] text-[#666666] truncate">{user.email}</div>
                </div>
              </div>

              {/* Admin Panel */}
              {isAdmin && (
                <button
                  onClick={() => { window.location.href = "/admin"; onClose(); }}
                  className="w-full py-[10px] mb-[10px] rounded-[7px] border-[1.5px] border-[#1B2A47] bg-transparent text-[#1B2A47] font-sans text-[0.85rem] font-semibold cursor-pointer flex items-center justify-center gap-2 hover:bg-[#1B2A47] hover:text-white transition-all"
                >
                  <ShieldCheck size={16} />
                  Admin Panel
                </button>
              )}

              {/* Sign out */}
              <button onClick={() => { logout(); onClose(); }} className="w-full py-[10px] rounded-[7px] border border-[#e05555]/40 bg-transparent text-[#e05555] font-sans text-[0.85rem] font-medium cursor-pointer flex items-center justify-center gap-2 hover:bg-[#e05555]/5 transition-colors">
                <LogOut size={16} />
                Sign out
              </button>
            </>
          ) : (
            <>
              <a href="/login" onClick={onClose} className="block text-center py-[11px] font-sans text-[0.92rem] text-[#111111] no-underline mb-2 border-b border-[#e0d8d0] hover:text-[#c0392b] transition-colors">Log In</a>
              <a href="/login" onClick={onClose} className="block text-center py-[11px] font-sans text-[0.92rem] text-[#c0392b] no-underline font-medium hover:opacity-80 transition-opacity">Create an Account</a>
            </>
          )}
        </div>
      </div>
    </>
  );
}
