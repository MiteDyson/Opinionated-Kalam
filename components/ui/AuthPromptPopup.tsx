"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, UserPlus, LogIn, Bookmark, Heart } from "lucide-react";
import { useRouter } from "next/navigation";

interface AuthPromptPopupProps {
  isOpen: boolean;
  onClose: () => void;
  type?: "like" | "save" | "general";
}

const AuthPromptPopup: React.FC<AuthPromptPopupProps> = ({ isOpen, onClose, type = "general" }) => {
  const router = useRouter();

  // Auto-dismiss after 3 seconds
  React.useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose, type]); // Reset timer if type changes (like -> save)

  const title = type === "like" ? "Like this article?" : type === "save" ? "Save for later?" : "Join the community";
  const description = type === "like"
    ? "Sign in to like this article and support the author."
    : type === "save"
      ? "Sign in to save this article to your reading list."
      : "Sign in to interact with our content.";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            zIndex: 1000,
            width: "300px",
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0 10px 40px rgba(0,0,0,0.12)",
            padding: "20px",
            border: "1px solid rgba(0,0,0,0.05)",
          }}
        >
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: "12px",
              right: "12px",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#999",
              padding: "4px"
            }}
          >
            <X size={16} />
          </button>

          <div style={{ display: "flex", gap: "12px", alignItems: "flex-start", marginBottom: "16px" }}>
            <div style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              backgroundColor: "rgba(0,0,0,0.04)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#111",
              flexShrink: 0
            }}>
              {type === "like" ? <Heart size={20} /> : type === "save" ? <Bookmark size={20} /> : <UserPlus size={20} />}
            </div>
            <div style={{ paddingRight: "16px" }}>
              <h3 style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "1.1rem",
                margin: "0 0 4px",
                color: "#111",
                lineHeight: 1.2
              }}>
                {title}
              </h3>
              <p style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.78rem",
                color: "#666",
                margin: 0,
                lineHeight: 1.4
              }}>
                {description}
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => router.push("/login?mode=register")}
              style={{
                flex: 1,
                backgroundColor: "#111",
                color: "white",
                border: "none",
                borderRadius: "8px",
                padding: "10px 0",
                fontSize: "0.75rem",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                transition: "opacity 0.2s"
              }}
              onMouseOver={(e) => (e.currentTarget.style.opacity = "0.9")}
              onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
            >
              <UserPlus size={14} /> Sign up
            </button>
            <button
              onClick={() => router.push("/login?mode=login")}
              style={{
                flex: 1,
                backgroundColor: "white",
                color: "#111",
                border: "1px solid #111",
                borderRadius: "8px",
                padding: "10px 0",
                fontSize: "0.75rem",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                transition: "background-color 0.2s"
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.02)")}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "white")}
            >
              <LogIn size={14} /> Sign In
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthPromptPopup;
