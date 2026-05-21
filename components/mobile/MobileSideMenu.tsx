"use client";

import { useAuth } from "@/context/AuthContext";
import { Menu, LogOut, User, ShieldCheck, Bookmark, CreditCard, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const RED = "#c0392b";
const BLACK = "#111111";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onTabChange: (tab: string) => void;
  onBeatSelect?: (beat: string) => void;
}

// ── Motion Variants for Staggered Links ──────────────────────────
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 350, damping: 25 },
  },
};

export default function MobileSideMenu({ isOpen, onClose, onTabChange, onBeatSelect }: Props) {
  const { user, logout, isAdmin, isMainAdmin } = useAuth();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div 
            onClick={onClose} 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-0 bg-black/35 z-[199]" 
          />

          {/* Panel */}
          <motion.div 
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 220 }}
            className="fixed top-0 bottom-0 left-0 w-[62%] max-w-[260px] h-full bg-[#f5f0eb] z-[200] shadow-[4px_0_24px_rgba(0,0,0,0.15)] flex flex-col"
          >
            {/* Header row */}
            <div className="flex items-center gap-[10px] px-5 pt-5 pb-4">
              <motion.button 
                whileTap={{ scale: 0.88 }}
                onClick={onClose} 
                className="bg-none border-none cursor-pointer flex p-0"
              >
                <Menu size={22} className="text-[#c0392b]" />
              </motion.button>
              <span className="font-sans font-bold text-[1.1rem] text-[#c0392b]">Menu</span>
            </div>

            {/* Scrollable items */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="flex-1 px-5 overflow-y-auto"
            >
              {[
                { label: "Saved Content", href: "/saved", icon: Bookmark },
                { label: "My Subscriptions", href: "/subscriptions", icon: CreditCard },
              ].map((item) => (
                <motion.div 
                  key={item.label}
                  variants={itemVariants}
                  whileTap={{ scale: 0.98 }}
                >
                  <a 
                    href={item.href} 
                    onClick={onClose} 
                    className="flex items-center gap-3 font-sans text-base font-normal text-[#111111] py-[11px] no-underline hover:text-[#c0392b] transition-colors"
                  >
                    <item.icon size={18} />
                    {item.label}
                  </a>
                </motion.div>
              ))}
            </motion.div>

            {/* Bottom: user + admin button + signout */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12, type: "spring", stiffness: 350, damping: 26 }}
              className="px-5 pt-4 pb-[28px] border-t border-[#e0d8d0]"
            >
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
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      whileHover={{ scale: 1.01 }}
                      onClick={() => { window.location.href = "/admin"; onClose(); }}
                      className="w-full py-[10px] mb-[10px] rounded-[7px] border-[1.5px] border-[#1B2A47] bg-transparent text-[#1B2A47] font-sans text-[0.85rem] font-semibold cursor-pointer flex items-center justify-center gap-2 hover:bg-[#1B2A47] hover:text-white transition-all"
                    >
                      <ShieldCheck size={16} />
                      Admin Panel
                    </motion.button>
                  )}

                  {/* Manage Team */}
                  {isMainAdmin && (
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      whileHover={{ scale: 1.01 }}
                      onClick={() => { window.location.href = "/admin/team"; onClose(); }}
                      className="w-full py-[10px] mb-[10px] rounded-[7px] border-[1.5px] border-[#1B2A47] bg-transparent text-[#1B2A47] font-sans text-[0.85rem] font-semibold cursor-pointer flex items-center justify-center gap-2 hover:bg-[#1B2A47] hover:text-white transition-all"
                    >
                      <Users size={16} />
                      Manage Team
                    </motion.button>
                  )}

                  {/* Sign out */}
                  <motion.button 
                    whileTap={{ scale: 0.97 }}
                    whileHover={{ scale: 1.01 }}
                    onClick={() => { logout(); onClose(); }} 
                    className="w-full py-[10px] rounded-[7px] border border-[#e05555]/40 bg-transparent text-[#e05555] font-sans text-[0.85rem] font-medium cursor-pointer flex items-center justify-center gap-2 hover:bg-[#e05555]/5 transition-colors"
                  >
                    <LogOut size={16} />
                    Sign out
                  </motion.button>
                </>
              ) : (
                <>
                  <motion.div whileTap={{ scale: 0.98 }}>
                    <a href="/login" onClick={onClose} className="block text-center py-[11px] font-sans text-[0.92rem] text-[#111111] no-underline mb-2 border-b border-[#e0d8d0] hover:text-[#c0392b] transition-colors">Log In</a>
                  </motion.div>
                  <motion.div whileTap={{ scale: 0.98 }}>
                    <a href="/login" onClick={onClose} className="block text-center py-[11px] font-sans text-[0.92rem] text-[#c0392b] no-underline font-medium hover:opacity-80 transition-opacity">Create an Account</a>
                  </motion.div>
                </>
              )}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
