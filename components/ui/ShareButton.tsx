"use client";

import { useState, useEffect, useRef } from "react";
import { Share, Check, Copy, Mail, X as LucideX, Share2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMobile } from "@/hooks/useMobile";

// Social SVG Icons for perfect custom resolution
const XIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.46h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
  </svg>
);

const RedditIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M12 0C5.373 0 0 5.373 0 12c0 3.314 1.343 6.314 3.515 8.485l-2.286 2.286C.775 23.225 1.097 24 1.738 24H12c6.627 0 12-5.373 12-12S18.627 0 12 0Zm4.388 3.199c1.104 0 1.999.895 1.999 1.999 0 1.105-.895 2-1.999 2-.946 0-1.739-.657-1.947-1.539v.002c-1.147.162-2.032 1.15-2.032 2.341v.007c1.776.067 3.4.567 4.686 1.363.473-.363 1.064-.58 1.707-.58 1.547 0 2.802 1.254 2.802 2.802 0 1.117-.655 2.081-1.601 2.531-.088 3.256-3.637 5.876-7.997 5.876-4.361 0-7.905-2.617-7.998-5.87-.954-.447-1.614-1.415-1.614-2.538 0-1.548 1.255-2.802 2.803-2.802.645 0 1.239.218 1.712.585 1.275-.79 2.881-1.291 4.64-1.365v-.01c0-1.663 1.263-3.034 2.88-3.207.188-.911.993-1.595 1.959-1.595Zm-8.085 8.376c-.784 0-1.459.78-1.506 1.797-.047 1.016.64 1.429 1.426 1.429.786 0 1.371-.369 1.418-1.385.047-1.017-.553-1.841-1.338-1.841Zm7.406 0c-.786 0-1.385.824-1.338 1.841.047 1.017.634 1.385 1.418 1.385.785 0 1.473-.413 1.426-1.429-.046-1.017-.721-1.797-1.506-1.797Zm-3.703 4.013c-.974 0-1.907.048-2.77.135-.147.015-.241.168-.183.305.483 1.154 1.622 1.964 2.953 1.964 1.33 0 2.47-.81 2.953-1.964.057-.137-.037-.29-.184-.305-.863-.087-1.795-.135-2.769-.135Z" />
  </svg>
);


interface ShareButtonProps {
  title: string;
  url?: string;
  variant: "barefoot" | "pill";
  size?: "mobile" | "desktop";
}

export default function ShareButton({ title, url, variant, size = "desktop" }: ShareButtonProps) {
  const isMobile = useMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const popoverRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setShareUrl(url || window.location.href);
  }, [url]);

  // Click outside to close desktop popover
  useEffect(() => {
    if (!isOpen || isMobile) return;

    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, [isOpen, isMobile]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      const el = document.createElement("textarea");
      el.value = shareUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          url: shareUrl,
        });
      } catch (err) {
        // Fall back to opening sheet if user cancels or it fails
        if ((err as Error).name !== "AbortError") {
          setIsOpen(true);
        }
      }
    } else {
      setIsOpen(true);
    }
  };

  const toggleOpen = () => {
    if (isMobile) {
      handleNativeShare();
    } else {
      setIsOpen((prev) => !prev);
    }
  };

  // Share social media links
  const socialShares = [
    {
      name: "X",
      icon: <XIcon />,
      color: "#111111",
      hoverBg: "#222222",
      link: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: "Instagram",
      icon: <InstagramIcon />,
      color: "#E1306C",
      hoverBg: "#c13584",
      link: `https://www.instagram.com/`,
    },
    {
      name: "Facebook",
      icon: <FacebookIcon />,
      color: "#1877F2",
      hoverBg: "#166fe5",
      link: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: "Reddit",
      icon: <RedditIcon />,
      color: "#FF4500",
      hoverBg: "#e03d00",
      link: `https://www.reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(title)}`,
    },
    {
      name: "WhatsApp",
      icon: <WhatsAppIcon />,
      color: "#25D366",
      hoverBg: "#20ba56",
      link: `https://api.whatsapp.com/send?text=${encodeURIComponent(title + " " + shareUrl)}`,
    },
    {
      name: "Email",
      icon: <Mail size={18} />,
      color: "#666666",
      hoverBg: "#555555",
      link: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(shareUrl)}`,
    },
  ];

  // Button styles mapping
  const getTriggerStyle = (): React.CSSProperties => {
    if (variant === "barefoot") {
      return {
        background: "none",
        border: "none",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 6,
        fontFamily: "'Inter', sans-serif",
        fontSize: "0.9rem",
        fontWeight: 600,
        color: "var(--text-main)",
        padding: 0,
      };
    }

    // Pill variant
    if (size === "mobile") {
      return {
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "8px 14px",
        borderRadius: 8,
        cursor: "pointer",
        fontFamily: "'Inter', sans-serif",
        fontSize: "0.8rem",
        fontWeight: 600,
        border: "1.5px solid #e0d8d0",
        backgroundColor: "white",
        color: "#111111",
        justifyContent: "center",
        flex: 1,
        minWidth: 0,
      };
    }

    return {
      display: "flex",
      alignItems: "center",
      gap: 6,
      padding: "8px 16px",
      borderRadius: 8,
      cursor: "pointer",
      fontFamily: "'Inter', sans-serif",
      fontSize: "0.82rem",
      fontWeight: 600,
      border: "1px solid var(--border)",
      backgroundColor: "transparent",
      color: "var(--text-main)",
    };
  };

  return (
    <div ref={triggerRef} style={{ position: "relative", display: "inline-block" }}>
      {/* ── Trigger Button with Micro-Animations ── */}
      <motion.button
        onClick={toggleOpen}
        style={getTriggerStyle()}
        whileHover={{ scale: 1.03, y: -1 }}
        whileTap={{ scale: 0.96 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <motion.div
          animate={isOpen ? { rotate: 15, scale: 1.05 } : { rotate: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          style={{ display: "flex", alignItems: "center" }}
        >
          {variant === "barefoot" ? <Share size={20} /> : <Share size={14} />}
        </motion.div>
        <span>Share</span>
      </motion.button>

      {/* ── Desktop Popover ── */}
      <AnimatePresence>
        {isOpen && !isMobile && (
          <motion.div
            ref={popoverRef}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", duration: 0.25 }}
            style={{
              position: "absolute",
              bottom: "calc(100% + 12px)",
              left: "50%",
              transform: "translateX(-50%)",
              width: 320,
              backgroundColor: "#FAF7F2",
              backdropFilter: "blur(12px)",
              border: "1px solid #dcd7ce",
              borderRadius: 14,
              padding: 16,
              boxShadow: "0 10px 25px -5px rgba(0,0,0,0.08), 0 8px 10px -6px rgba(0,0,0,0.05)",
              zIndex: 50,
            }}
          >
            {/* Popover Arrow */}
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: "50%",
                transform: "translateX(-50%)",
                width: 0,
                height: 0,
                borderLeft: "8px solid transparent",
                borderRight: "8px solid transparent",
                borderTop: "8px solid #dcd7ce",
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: "50%",
                transform: "translateX(-50%) translateY(-1px)",
                width: 0,
                height: 0,
                borderLeft: "8px solid transparent",
                borderRight: "8px solid transparent",
                borderTop: "8px solid #FAF7F2",
                pointerEvents: "none",
              }}
            />

            <h3
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.85rem",
                fontWeight: 700,
                color: "#1a1a1a",
                marginBottom: 12,
              }}
            >
              Share this post
            </h3>

            {/* Input URL and Copy Container */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#f0ebe1",
                border: "1px solid #e0d8cc",
                borderRadius: 8,
                padding: "4px 4px 4px 10px",
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.78rem",
                  color: "#666",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  flex: 1,
                  paddingRight: 8,
                }}
              >
                {shareUrl}
              </div>
              <motion.button
                onClick={handleCopy}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                animate={copied ? { backgroundColor: "#10b981" } : { backgroundColor: "#1a1a1a" }}
                style={{
                  color: "white",
                  border: "none",
                  borderRadius: 6,
                  padding: "6px 12px",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  minWidth: 80,
                  justifyContent: "center",
                  transition: "background-color 0.2s ease",
                }}
              >
                {copied ? <Check size={12} strokeWidth={3} /> : <Copy size={12} />}
                {copied ? "Copied" : "Copy"}
              </motion.button>
            </div>

            {/* Social Share Title */}
            <div
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.68rem",
                fontWeight: 700,
                color: "#888",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: 8,
              }}
            >
              Or share via
            </div>

            {/* Social icons row */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {socialShares.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    backgroundColor: "white",
                    border: "1px solid #e0d8cc",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: social.color,
                    cursor: "pointer",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.04)",
                  }}
                  title={`Share on ${social.name}`}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Mobile Custom Sheet (Fallback if native sharing gets canceled or isn't supported) ── */}
      <AnimatePresence>
        {isOpen && isMobile && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.4)",
                backdropFilter: "blur(4px)",
                zIndex: 999,
              }}
            />

            {/* Bottom Drawer Sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              style={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: "#FAF7F2",
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                padding: "24px 20px 34px",
                zIndex: 1000,
                boxShadow: "0 -8px 24px rgba(0,0,0,0.12)",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {/* Drag Handle Bar */}
              <div
                style={{
                  width: 36,
                  height: 4,
                  backgroundColor: "#dcd7ce",
                  borderRadius: 2,
                  margin: "-12px auto 20px",
                }}
              />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#1a1a1a", margin: 0 }}>
                  Share this post
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  style={{
                    background: "#f0ebe1",
                    border: "none",
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#666",
                    cursor: "pointer",
                  }}
                >
                  <LucideX size={15} strokeWidth={2.5} />
                </button>
              </div>

              {/* URL Display */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "#f0ebe1",
                  border: "1px solid #e0d8cc",
                  borderRadius: 10,
                  padding: "5px 5px 5px 12px",
                  marginBottom: 24,
                }}
              >
                <div
                  style={{
                    fontSize: "0.8rem",
                    color: "#555",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    flex: 1,
                    paddingRight: 10,
                  }}
                >
                  {shareUrl}
                </div>
                <motion.button
                  onClick={handleCopy}
                  whileTap={{ scale: 0.95 }}
                  animate={copied ? { backgroundColor: "#10b981" } : { backgroundColor: "#1a1a1a" }}
                  style={{
                    color: "white",
                    border: "none",
                    borderRadius: 8,
                    padding: "8px 16px",
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    minWidth: 90,
                    justifyContent: "center",
                    transition: "background-color 0.2s ease",
                  }}
                >
                  {copied ? <Check size={12} strokeWidth={3} /> : <Copy size={12} />}
                  {copied ? "Copied" : "Copy"}
                </motion.button>
              </div>

              {/* Social Channels label */}
              <div
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  color: "#888",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: 12,
                }}
              >
                Share directly via
              </div>

              {/* Social Buttons list */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                {socialShares.map((social) => (
                  <a
                    key={social.name}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsOpen(false)}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 8,
                      textDecoration: "none",
                    }}
                  >
                    <div
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: "50%",
                        backgroundColor: "white",
                        border: "1px solid #e0d8cc",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: social.color,
                        boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
                      }}
                    >
                      {social.icon}
                    </div>
                    <span style={{ fontSize: "0.7rem", color: "#555", fontWeight: 500 }}>
                      {social.name}
                    </span>
                  </a>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
