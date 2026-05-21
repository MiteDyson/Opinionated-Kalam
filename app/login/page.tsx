"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import { auth } from "@/lib/auth/firebase";
import { useAuth } from "@/context/AuthContext";
import { MoveLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const MAX_USERNAME = 15;

type Mode = "login" | "register" | "forgot" | "set-username";

// ── Validators ────────────────────────────────────────────────
function validatePassword(pw: string): string | null {
  if (pw.length < 8) return "At least 8 characters required.";
  if (!/[A-Za-z]/.test(pw)) return "Must contain at least one letter.";
  if (!/[0-9]/.test(pw)) return "Must contain at least one number.";
  if (!/[^A-Za-z0-9]/.test(pw)) return "Must contain at least one special character.";
  return null;
}

function validateUsername(name: string): string | null {
  const trimmed = name.trim();
  if (!trimmed) return "Username is required.";
  if (trimmed.length > MAX_USERNAME) return `Username must be ${MAX_USERNAME} characters or fewer.`;
  if (trimmed.length < 2) return "Username must be at least 2 characters.";
  if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) return "Only letters, numbers, and underscores allowed.";
  return null;
}

// ── Password strength bar ─────────────────────────────────────
function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;
  const checks = [
    password.length >= 8,
    /[A-Za-z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const score = checks.filter(Boolean).length;
  const colors = ["#D92323", "#e07b00", "#e0b800", "#3a9e40"];
  return (
    <div style={{ marginTop: -4 }}>
      <div style={{ display: "flex", gap: 4, marginBottom: 5 }}>
        {[0, 1, 2, 3].map(i => (
          <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, backgroundColor: i < score ? colors[score - 1] : "#e0ddd8", transition: "background-color 0.2s" }} />
        ))}
      </div>
      <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 3 }}>
        {([
          ["8+ characters", password.length >= 8],
          ["Contains a letter", /[A-Za-z]/.test(password)],
          ["Contains a number", /[0-9]/.test(password)],
          ["Contains a special character", /[^A-Za-z0-9]/.test(password)],
        ] as [string, boolean][]).map(([label, ok]) => (
          <li key={label} style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.72rem", color: ok ? "#3a9e40" : "#aaa", display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ fontSize: "0.65rem" }}>{ok ? "✓" : "○"}</span>
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const { user, isAdmin, loading: authLoading } = useAuth();

  const formVariants = {
    initial: { opacity: 0, x: 12 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] as const } },
    exit: { opacity: 0, x: -12, transition: { duration: 0.2, ease: [0.76, 0, 0.24, 1] as const } }
  };

  const [mode, setMode] = useState<Mode>("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // ── Sync mode with query params ─────────────────────────────
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const m = params.get("mode") as Mode;
    if (m === "register" || m === "login" || m === "forgot") {
      setMode(m);
    }
  }, []);

  // When true, we just completed our own register flow and already called
  // router.replace() ourselves — the useEffect should not intercept.
  const justRegistered = useRef(false);

  // ── Redirect already-logged-in visitors ──────────────────────
  useEffect(() => {
    if (!user) return;
    if (justRegistered.current) return;

    if (!user.displayName || user.displayName.trim() === "") {
      setMode("set-username");
      return;
    }

    if (!authLoading) {
      router.replace(isAdmin ? "/admin" : "/");
    }
  }, [user, isAdmin, authLoading, router]);

  const reset = () => { setError(""); setSuccess(""); };

  // ── Register / Login ──────────────────────────────────────────
  const handleEmailAuth = async () => {
    reset();

    if (mode === "register") {
      const uErr = validateUsername(username);
      if (uErr) { setError(uErr); return; }
      const pErr = validatePassword(password);
      if (pErr) { setError(pErr); return; }
    }

    setLoading(true);
    try {
      if (mode === "register") {
        // Step 1 – create the Firebase account
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        // Step 2 – immediately persist the username they entered on the form
        await updateProfile(cred.user, { displayName: username.trim() });
        // Step 3 – flag so useEffect doesn't re-trigger the set-username screen
        justRegistered.current = true;
        // Step 4 – navigate directly
        const isAdmin = cred.user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;
        router.replace(isAdmin ? "/admin" : "/");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        window.location.href = "/";
      }
    } catch (err: any) {
      setLoading(false);
      const c = err.code;
      if (c === "auth/user-not-found" || c === "auth/wrong-password" || c === "auth/invalid-credential") {
        setError("Invalid email or password.");
      } else if (c === "auth/email-already-in-use") {
        setError("An account with this email already exists.");
      } else if (c === "auth/weak-password") {
        setError("Password must be at least 8 characters.");
      } else if (c === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  // ── Google sign-in ────────────────────────────────────────────
  // Google accounts already have a displayName from the Google profile,
  // so they go straight through. If somehow it's missing, useEffect catches it.
  const handleGoogle = async () => {
    reset();
    setLoading(true);
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      window.location.href = "/";
    } catch {
      setError("Google sign-in failed. Please try again.");
      setLoading(false);
    }
  };

  // ── Forgot password ───────────────────────────────────────────
  const handleForgotPassword = async () => {
    reset();
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess("Reset link sent! Check your inbox.");
    } catch (err: any) {
      const c = err.code;
      if (c === "auth/user-not-found") setError("No account found with this email.");
      else if (c === "auth/invalid-email") setError("Please enter a valid email address.");
      else setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Set username — only for old accounts that never had one ──
  const handleSetUsername = async () => {
    reset();
    const uErr = validateUsername(username);
    if (uErr) { setError(uErr); return; }
    setLoading(true);
    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: username.trim() });
        const isAdmin = auth.currentUser.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;
        router.replace(isAdmin ? "/admin" : "/");
      }
    } catch {
      setError("Failed to save username. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (m: Mode) => {
    setMode(m); reset(); setUsername(""); setEmail(""); setPassword("");
  };

  // ── Shared styles ─────────────────────────────────────────────
  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "11px 14px", borderRadius: 8,
    border: "1px solid var(--border)", backgroundColor: "white",
    fontSize: "0.9rem", fontFamily: "'Inter', sans-serif",
    color: "var(--text-main)", outline: "none", boxSizing: "border-box",
    transition: "border-color 0.2s, box-shadow 0.2s",
  };
  const onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = "#1B2A47";
    e.target.style.boxShadow = "0 0 0 3px rgba(27,42,71,0.08)";
  };
  const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = "var(--border)";
    e.target.style.boxShadow = "none";
  };

  const usernameChars = username.trim().length;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <motion.div
        layout
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 90, damping: 14 }}
        style={{ width: "100%", maxWidth: 420, backgroundColor: "white", borderRadius: 16, padding: "40px 36px", boxShadow: "0 4px 32px rgba(0,0,0,0.08)", overflow: "hidden" }}
      >

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.8rem", color: "var(--text-main)", lineHeight: 1 }}>
            Opinionated Kalam
          </div>
          <div style={{ overflow: "hidden", height: 20, marginTop: 8 }}>
            <AnimatePresence mode="wait">
              <motion.p
                key={mode}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", color: "var(--text-muted)", margin: 0 }}
              >
                {mode === "login" ? "Sign in to your account"
                  : mode === "register" ? "Create a free account"
                    : mode === "set-username" ? "Choose your username"
                      : "Reset your password"}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* ══ SET USERNAME — old accounts only ══════════════════ */}
          {mode === "set-username" && (
            <motion.div
              key="set-username"
              variants={formVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              style={{ display: "flex", flexDirection: "column", gap: 14 }}
            >
              <div style={{ padding: "12px 14px", backgroundColor: "rgba(27,42,71,0.06)", borderRadius: 8, fontFamily: "'Inter', sans-serif", fontSize: "0.82rem", color: "#1B2A47", lineHeight: 1.6, border: "1px solid rgba(27,42,71,0.12)" }}>
                You're signed in but haven't set a username yet. Pick one to complete your profile.
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <label style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", fontWeight: 600, color: "var(--text-muted)" }}>Username</label>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.72rem", color: "var(--text-muted)" }}>
                    {usernameChars}/{MAX_USERNAME}
                  </span>
                </div>
                <input
                  type="text"
                  placeholder={`Up to ${MAX_USERNAME} characters`}
                  value={username}
                  onChange={(e) => setUsername(e.target.value.slice(0, MAX_USERNAME))}
                  onKeyDown={(e) => e.key === "Enter" && handleSetUsername()}
                  maxLength={MAX_USERNAME}
                  autoFocus
                  style={inputStyle}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", color: "var(--text-muted)", marginTop: 5 }}>
                  Letters, numbers, and underscores only.
                </p>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    style={{ overflow: "hidden" }}
                    transition={{ duration: 0.2 }}
                  >
                    <p style={{ fontSize: "0.82rem", color: "#D92323", fontFamily: "'Inter', sans-serif", margin: 0 }}>{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                onClick={handleSetUsername}
                disabled={loading || !username.trim()}
                whileHover={loading || !username.trim() ? {} : { scale: 1.015 }}
                whileTap={loading || !username.trim() ? {} : { scale: 0.98 }}
                style={{ width: "100%", padding: "12px 0", borderRadius: 8, backgroundColor: "var(--text-main)", color: "white", border: "none", fontSize: "0.9rem", fontWeight: 700, fontFamily: "'Inter', sans-serif", cursor: loading || !username.trim() ? "not-allowed" : "pointer", opacity: loading || !username.trim() ? 0.6 : 1 }}
              >
                {loading ? "Saving…" : "Set Username"}
              </motion.button>
            </motion.div>
          )}

          {/* ══ FORGOT PASSWORD ════════════════════════════════════ */}
          {mode === "forgot" && (
            <motion.div
              key="forgot"
              variants={formVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              style={{ display: "flex", flexDirection: "column", gap: 14 }}
            >
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontFamily: "'Inter', sans-serif", margin: 0, lineHeight: 1.6 }}>
                Enter your email and we'll send you a link to reset your password.
              </p>
              <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleForgotPassword()} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    style={{ overflow: "hidden" }}
                    transition={{ duration: 0.2 }}
                  >
                    <p style={{ fontSize: "0.82rem", color: "#D92323", fontFamily: "'Inter', sans-serif", margin: 0 }}>{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {success && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    style={{ overflow: "hidden" }}
                    transition={{ duration: 0.2 }}
                  >
                    <div style={{ padding: "10px 14px", borderRadius: 8, backgroundColor: "rgba(76,175,80,0.08)", border: "1px solid rgba(76,175,80,0.2)" }}>
                      <p style={{ fontSize: "0.82rem", color: "#3a9e40", fontFamily: "'Inter', sans-serif", margin: 0 }}>{success}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                onClick={handleForgotPassword}
                disabled={loading || !email.trim()}
                whileHover={loading || !email.trim() ? {} : { scale: 1.015 }}
                whileTap={loading || !email.trim() ? {} : { scale: 0.98 }}
                style={{ width: "100%", padding: "12px 0", borderRadius: 8, backgroundColor: "var(--text-main)", color: "white", border: "none", fontSize: "0.9rem", fontWeight: 700, fontFamily: "'Inter', sans-serif", cursor: loading || !email.trim() ? "not-allowed" : "pointer", opacity: loading || !email.trim() ? 0.6 : 1 }}
              >
                {loading ? "Sending…" : "Send Reset Link"}
              </motion.button>
              <motion.button
                onClick={() => switchMode("login")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{ background: "none", border: "1px solid rgb(221, 221, 221)", borderRadius: "6px", padding: "5px 12px", cursor: "pointer", color: "#1B2A47", fontWeight: 600, fontSize: "0.85rem", fontFamily: "'Inter', sans-serif", display: "flex", alignItems: "center", gap: "6px", justifyContent: "center" }}
              >
                <MoveLeft size={16} /> Back to Sign in
              </motion.button>
            </motion.div>
          )}

          {/* ══ LOGIN ═══════════════════════════════════════════════ */}
          {mode === "login" && (
            <motion.div
              key="login"
              variants={formVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              style={{ display: "flex", flexDirection: "column" }}
            >
              {/* Google */}
              <motion.button
                onClick={handleGoogle}
                disabled={loading}
                whileHover={{ scale: 1.01, backgroundColor: "#f9f9f9" }}
                whileTap={{ scale: 0.99 }}
                style={{ width: "100%", padding: "11px 0", borderRadius: 8, border: "1px solid var(--border)", backgroundColor: "white", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontSize: "0.9rem", fontWeight: 600, fontFamily: "'Inter', sans-serif", cursor: "pointer", marginBottom: 20 }}
              >
                <svg width="18" height="18" viewBox="0 0 48 48">
                  <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
                  <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
                  <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
                  <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
                </svg>
                Continue with Google
              </motion.button>

              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                <div style={{ flex: 1, height: 1, backgroundColor: "var(--border)" }} />
                <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontFamily: "'Inter', sans-serif" }}>or</span>
                <div style={{ flex: 1, height: 1, backgroundColor: "var(--border)" }} />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {/* Email */}
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={inputStyle}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />

                {/* Password */}
                <div>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleEmailAuth()}
                      style={{ ...inputStyle, paddingRight: 42 }}
                      onFocus={onFocus}
                      onBlur={onBlur}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(s => !s)}
                      style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 0, display: "flex" }}
                    >
                      {showPassword
                        ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                        : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                      }
                    </button>
                  </div>
                </div>

                {/* Forgot link */}
                <div style={{ textAlign: "right", marginTop: -6 }}>
                  <button onClick={() => switchMode("forgot")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", fontSize: "0.8rem", fontFamily: "'Inter', sans-serif", padding: 0, textDecoration: "underline" }}>
                    Forgot password?
                  </button>
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      style={{ overflow: "hidden" }}
                      transition={{ duration: 0.2 }}
                    >
                      <p style={{ fontSize: "0.82rem", color: "#D92323", fontFamily: "'Inter', sans-serif", margin: 0 }}>{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button
                  onClick={handleEmailAuth}
                  disabled={loading}
                  whileHover={loading ? {} : { scale: 1.015 }}
                  whileTap={loading ? {} : { scale: 0.98 }}
                  style={{ width: "100%", padding: "12px 0", borderRadius: 8, backgroundColor: "var(--text-main)", color: "white", border: "none", fontSize: "0.9rem", fontWeight: 700, fontFamily: "'Inter', sans-serif", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}
                >
                  {loading ? "Please wait…" : "Sign in"}
                </motion.button>
              </div>

              <p style={{ textAlign: "center", marginTop: 20, fontSize: "0.85rem", fontFamily: "'Inter', sans-serif", color: "var(--text-muted)", marginBottom: 0 }}>
                Don't have an account?{" "}
                <button onClick={() => switchMode("register")} style={{ background: "none", border: "none", cursor: "pointer", color: "#1B2A47", fontWeight: 600, fontSize: "0.85rem", fontFamily: "'Inter', sans-serif", padding: 0 }}>
                  Sign up
                </button>
              </p>

              <div style={{ textAlign: "center", marginTop: 24 }}>
                <motion.button
                  onClick={() => router.push("/")}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{ background: "none", border: "1px solid rgb(221, 221, 221)", borderRadius: "6px", padding: "5px 12px", cursor: "pointer", color: "var(--text-muted)", fontSize: "0.85rem", fontFamily: "'Inter', sans-serif", display: "inline-flex", alignItems: "center", gap: "6px" }}
                >
                  <MoveLeft size={14} /> Back to home
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* ══ REGISTER ═══════════════════════════════════════════ */}
          {mode === "register" && (
            <motion.div
              key="register"
              variants={formVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              style={{ display: "flex", flexDirection: "column" }}
            >
              {/* Google */}
              <motion.button
                onClick={handleGoogle}
                disabled={loading}
                whileHover={{ scale: 1.01, backgroundColor: "#f9f9f9" }}
                whileTap={{ scale: 0.99 }}
                style={{ width: "100%", padding: "11px 0", borderRadius: 8, border: "1px solid var(--border)", backgroundColor: "white", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontSize: "0.9rem", fontWeight: 600, fontFamily: "'Inter', sans-serif", cursor: "pointer", marginBottom: 20 }}
              >
                <svg width="18" height="18" viewBox="0 0 48 48">
                  <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
                  <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
                  <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
                  <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
                </svg>
                Continue with Google
              </motion.button>

              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                <div style={{ flex: 1, height: 1, backgroundColor: "var(--border)" }} />
                <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontFamily: "'Inter', sans-serif" }}>or</span>
                <div style={{ flex: 1, height: 1, backgroundColor: "var(--border)" }} />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {/* Username */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <label style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", fontWeight: 600, color: "var(--text-muted)" }}>Username</label>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.72rem", color: "var(--text-muted)" }}>
                      {usernameChars}/{MAX_USERNAME}
                    </span>
                  </div>
                  <input
                    type="text"
                    placeholder={`Up to ${MAX_USERNAME} characters`}
                    value={username}
                    onChange={(e) => setUsername(e.target.value.slice(0, MAX_USERNAME))}
                    maxLength={MAX_USERNAME}
                    style={inputStyle}
                    onFocus={onFocus}
                    onBlur={onBlur}
                  />
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", color: "var(--text-muted)", marginTop: 4 }}>
                    Letters, numbers, and underscores only.
                  </p>
                </div>

                {/* Email */}
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={inputStyle}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />

                {/* Password */}
                <div>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password (8+ chars, letters + numbers + symbol)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleEmailAuth()}
                      style={{ ...inputStyle, paddingRight: 42 }}
                      onFocus={onFocus}
                      onBlur={onBlur}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(s => !s)}
                      style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 0, display: "flex" }}
                    >
                      {showPassword
                        ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                        : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                      }
                    </button>
                  </div>
                  <AnimatePresence>
                    {password && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        style={{ overflow: "hidden", marginTop: 10 }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <PasswordStrength password={password} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      style={{ overflow: "hidden" }}
                      transition={{ duration: 0.2 }}
                    >
                      <p style={{ fontSize: "0.82rem", color: "#D92323", fontFamily: "'Inter', sans-serif", margin: 0 }}>{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button
                  onClick={handleEmailAuth}
                  disabled={loading}
                  whileHover={loading ? {} : { scale: 1.015 }}
                  whileTap={loading ? {} : { scale: 0.98 }}
                  style={{ width: "100%", padding: "12px 0", borderRadius: 8, backgroundColor: "var(--text-main)", color: "white", border: "none", fontSize: "0.9rem", fontWeight: 700, fontFamily: "'Inter', sans-serif", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}
                >
                  {loading ? "Please wait…" : "Create account"}
                </motion.button>
              </div>

              <p style={{ textAlign: "center", marginTop: 20, fontSize: "0.85rem", fontFamily: "'Inter', sans-serif", color: "var(--text-muted)", marginBottom: 0 }}>
                Already have an account?{" "}
                <button onClick={() => switchMode("login")} style={{ background: "none", border: "none", cursor: "pointer", color: "#1B2A47", fontWeight: 600, fontSize: "0.85rem", fontFamily: "'Inter', sans-serif", padding: 0 }}>
                  Sign in
                </button>
              </p>

              <div style={{ textAlign: "center", marginTop: 24 }}>
                <motion.button
                  onClick={() => router.push("/")}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{ background: "none", border: "1px solid rgb(221, 221, 221)", borderRadius: "6px", padding: "5px 12px", cursor: "pointer", color: "var(--text-muted)", fontSize: "0.85rem", fontFamily: "'Inter', sans-serif", display: "inline-flex", alignItems: "center", gap: "6px" }}
                >
                  <MoveLeft size={14} /> Back to home
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
