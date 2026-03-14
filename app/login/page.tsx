"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

const ADMIN_EMAIL = "opinionatedkalam@gmail.com";

type Mode = "login" | "register" | "forgot";

export default function LoginPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [mode, setMode]         = useState<Mode>("login");
  const [username, setUsername] = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState("");
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    if (user) router.replace(user.email === ADMIN_EMAIL ? "/admin" : "/");
  }, [user, router]);

  const reset = () => { setError(""); setSuccess(""); };

  const handleEmailAuth = async () => {
    reset(); setLoading(true);
    try {
      if (mode === "register") {
        if (!username.trim()) { setError("Please enter a username."); setLoading(false); return; }
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(cred.user, { displayName: username.trim() });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      const c = err.code;
      if (c === "auth/user-not-found" || c === "auth/wrong-password" || c === "auth/invalid-credential") {
        setError("Invalid email or password.");
      } else if (c === "auth/email-already-in-use") {
        setError("An account with this email already exists.");
      } else if (c === "auth/weak-password") {
        setError("Password must be at least 6 characters.");
      } else if (c === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    reset(); setLoading(true);
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch {
      setError("Google sign-in failed. Please try again.");
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    reset(); setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess("Reset link sent! Check your inbox.");
    } catch (err: any) {
      const c = err.code;
      if (c === "auth/user-not-found") {
        setError("No account found with this email.");
      } else if (c === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (m: Mode) => { setMode(m); reset(); setUsername(""); setEmail(""); setPassword(""); };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "11px 14px", borderRadius: 8,
    border: "1px solid var(--border)", backgroundColor: "white",
    fontSize: "0.9rem", fontFamily: "'Inter', sans-serif",
    color: "var(--text-main)", outline: "none", boxSizing: "border-box",
    transition: "border-color 0.2s",
  };

  const focusStyle = (e: React.FocusEvent<HTMLInputElement>) =>
    ((e.target as HTMLInputElement).style.borderColor = "#1B2A47");
  const blurStyle = (e: React.FocusEvent<HTMLInputElement>) =>
    ((e.target as HTMLInputElement).style.borderColor = "var(--border)");

  return (
    <div style={{
      minHeight: "100vh", backgroundColor: "var(--bg)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "24px",
    }}>
      <div style={{
        width: "100%", maxWidth: 420,
        backgroundColor: "white", borderRadius: 16,
        padding: "40px 36px", boxShadow: "0 4px 32px rgba(0,0,0,0.08)",
        transition: "all 0.2s",
      }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.8rem", color: "var(--text-main)", lineHeight: 1 }}>
            Opinionated Kalam
          </div>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", color: "var(--text-muted)", marginTop: 8, marginBottom: 0 }}>
            {mode === "login"    ? "Sign in to your account"
            : mode === "register" ? "Create a free account"
            : "Reset your password"}
          </p>
        </div>

        {/* ── FORGOT PASSWORD VIEW ── */}
        {mode === "forgot" ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontFamily: "'Inter', sans-serif", margin: 0, lineHeight: 1.6 }}>
              Enter your email and we'll send you a link to reset your password.
            </p>
            <input
              type="email" placeholder="Email address" value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleForgotPassword()}
              style={inputStyle} onFocus={focusStyle} onBlur={blurStyle}
            />

            {error && <p style={{ fontSize: "0.82rem", color: "var(--red)", fontFamily: "'Inter', sans-serif", margin: 0 }}>{error}</p>}
            {success && (
              <div style={{ padding: "10px 14px", borderRadius: 8, backgroundColor: "rgba(76,175,80,0.08)", border: "1px solid rgba(76,175,80,0.2)" }}>
                <p style={{ fontSize: "0.82rem", color: "#3a9e40", fontFamily: "'Inter', sans-serif", margin: 0 }}>{success}</p>
              </div>
            )}

            <button onClick={handleForgotPassword} disabled={loading || !email.trim()} style={{
              width: "100%", padding: "12px 0", borderRadius: 8,
              backgroundColor: "var(--text-main)", color: "white", border: "none",
              fontSize: "0.9rem", fontWeight: 700, fontFamily: "'Inter', sans-serif",
              cursor: loading || !email.trim() ? "not-allowed" : "pointer",
              opacity: loading || !email.trim() ? 0.6 : 1,
            }}>
              {loading ? "Sending..." : "Send Reset Link"}
            </button>

            <button onClick={() => switchMode("login")} style={{
              background: "none", border: "none", cursor: "pointer",
              color: "#1B2A47", fontWeight: 600, fontSize: "0.85rem",
              fontFamily: "'Inter', sans-serif", padding: 0, textAlign: "center" as const,
            }}>
              ← Back to Sign in
            </button>
          </div>

        ) : (
          /* ── LOGIN / REGISTER VIEW ── */
          <>
            {/* Google */}
            <button onClick={handleGoogle} disabled={loading} style={{
              width: "100%", padding: "11px 0", borderRadius: 8,
              border: "1px solid var(--border)", backgroundColor: "white",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              fontSize: "0.9rem", fontWeight: 600, fontFamily: "'Inter', sans-serif",
              cursor: "pointer", marginBottom: 20,
            }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#f9f9f9")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "white")}
            >
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
                <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
                <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
                <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
              </svg>
              Continue with Google
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <div style={{ flex: 1, height: 1, backgroundColor: "var(--border)" }} />
              <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontFamily: "'Inter', sans-serif" }}>or</span>
              <div style={{ flex: 1, height: 1, backgroundColor: "var(--border)" }} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Username — only on register */}
              {mode === "register" && (
                <input
                  type="text" placeholder="Username" value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={inputStyle} onFocus={focusStyle} onBlur={blurStyle}
                />
              )}

              <input
                type="email" placeholder="Email address" value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle} onFocus={focusStyle} onBlur={blurStyle}
              />
              <input
                type="password" placeholder="Password" value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleEmailAuth()}
                style={inputStyle} onFocus={focusStyle} onBlur={blurStyle}
              />

              {/* Forgot password link — only on login */}
              {mode === "login" && (
                <div style={{ textAlign: "right", marginTop: -6 }}>
                  <button onClick={() => switchMode("forgot")} style={{
                    background: "none", border: "none", cursor: "pointer",
                    color: "var(--text-muted)", fontSize: "0.8rem",
                    fontFamily: "'Inter', sans-serif", padding: 0,
                    textDecoration: "underline",
                  }}>
                    Forgot password?
                  </button>
                </div>
              )}

              {error && <p style={{ fontSize: "0.82rem", color: "var(--red)", fontFamily: "'Inter', sans-serif", margin: 0 }}>{error}</p>}

              <button onClick={handleEmailAuth} disabled={loading} style={{
                width: "100%", padding: "12px 0", borderRadius: 8,
                backgroundColor: "var(--text-main)", color: "white", border: "none",
                fontSize: "0.9rem", fontWeight: 700, fontFamily: "'Inter', sans-serif",
                cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1,
              }}>
                {loading ? "Please wait..." : mode === "login" ? "Sign in" : "Create account"}
              </button>
            </div>

            <p style={{ textAlign: "center", marginTop: 20, fontSize: "0.85rem", fontFamily: "'Inter', sans-serif", color: "var(--text-muted)", marginBottom: 0 }}>
              {mode === "login" ? "Don't have an account? " : "Already have an account? "}
              <button onClick={() => switchMode(mode === "login" ? "register" : "login")} style={{
                background: "none", border: "none", cursor: "pointer",
                color: "#1B2A47", fontWeight: 600, fontSize: "0.85rem",
                fontFamily: "'Inter', sans-serif", padding: 0,
              }}>
                {mode === "login" ? "Sign up" : "Sign in"}
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
