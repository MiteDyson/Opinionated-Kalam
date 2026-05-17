"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, CheckCircle2, X } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "delete" | "publish" | "info";
  isLoading?: boolean;
}

const ACCENT = "#1B2A47";
const TERRA  = "#D38B88";

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "info",
  isLoading = false,
}: ConfirmModalProps) {
  
  const colors = {
    delete: {
      primary: "#c0392b",
      bg: "rgba(192,57,43,0.08)",
      icon: <AlertCircle size={22} color="#c0392b" />,
    },
    publish: {
      primary: "#3a7a3e",
      bg: "rgba(76,140,80,0.08)",
      icon: <CheckCircle2 size={22} color="#3a7a3e" />,
    },
    info: {
      primary: ACCENT,
      bg: "rgba(27,42,71,0.08)",
      icon: <AlertCircle size={22} color={ACCENT} />,
    },
  }[type];

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={isLoading ? undefined : onClose}
            style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            style={{
              position: "relative",
              width: "100%",
              maxWidth: 400,
              backgroundColor: "white",
              borderRadius: 16,
              boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
              padding: 24,
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: colors.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {colors.icon}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "#1A1A1A" }}>{title}</h3>
              </div>
              <button 
                onClick={onClose}
                disabled={isLoading}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#888", padding: 4, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f5f5f5")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <p style={{ margin: "0 0 24px", fontSize: "0.9rem", color: "#555", lineHeight: 1.5 }}>
              {message}
            </p>

            {/* Footer */}
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button
                onClick={onClose}
                disabled={isLoading}
                style={{
                  padding: "10px 18px",
                  borderRadius: 10,
                  border: "1px solid #E5E7EB",
                  backgroundColor: "white",
                  color: "#374151",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f9fafb")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "white")}
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                disabled={isLoading}
                style={{
                  padding: "10px 24px",
                  borderRadius: 10,
                  border: "none",
                  backgroundColor: colors.primary,
                  color: "white",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  opacity: isLoading ? 0.7 : 1,
                  boxShadow: `0 4px 12px ${colors.primary}40`,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(1.1)")}
                onMouseLeave={(e) => (e.currentTarget.style.filter = "none")}
              >
                {isLoading ? "Processing..." : confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
