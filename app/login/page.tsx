"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

const ADMIN_EMAIL = "admin@opinionatedkalam.com";

type Tab = "user" | "admin";
type Mode = "login" | "register";

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "11px 14px", borderRadius: 8,
  border: "1px solid var(--border)", backgroundColor: "white",
  fontSize: "0.9rem", fontFamily: "'Inter', sans-serif",
  color: "var(--text-main)", outline: "none", boxSizing: "border-box",
};

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("user");
  const [mode, setMode] = useState<Mode>("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function cleanError(code: string) {
    if (code.includes("user-not-found") || code.includes("wrong-password") || code.includes("invalid-credential"))
      return "Incorrect email or password.";
    if (code.includes("email-already-in-use")) return "An account with this email already exists.";
    if (code.includes("weak-password")) return "Password must be at least 6 characters.";
    if (code.includes("invalid-email")) return "Please enter a valid email address.";
    if (code.includes("popup-closed")) return "Sign-in popup was closed. Please try again.";
    return "Something went wrong. Please try again.";
  }

  const handleGoogle = async () => {
    setError(""); setLoading(true);
    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      if (result.user) router.push("/");
    } catch (err: any) {
      setError(cleanError(err.code || ""));
    } finally { setLoading(false); }
  };

  const handleUserAuth = async () => {
    setError("");
    if (!email.trim() || !password.trim()) { setError("Please fill in all fields."); return; }
    if (mode === "register" && !username.trim()) { setError("Please enter a username."); return; }
    setLoading(true);
    try {
      if (mode === "register") {
        const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
        await updateProfile(cred.user, { displayName: username.trim() });
      } else {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      }
      router.push("/");
    } catch (err: any) {
      setError(cleanError(err.code || ""));
    } finally { setLoading(false); }
  };

  const handleAdminAuth = async () => {
    setError("");
    if (!adminEmail.trim() || !adminPassword.trim()) { setError("Please fill in all fields."); return; }
    if (adminEmail.trim() !== ADMIN_EMAIL) { setError("This account does not have admin access."); return; }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, adminEmail.trim(), adminPassword);
      router.push("/admin");
    } catch (err: any) {
      setError(cleanError(err.code || ""));
    } finally { setLoading(false); }
  };

  return (
    <div style={{
      minHeight: "100vh", backgroundColor: "var(--bg)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "24px", fontFamily: "'Inter', sans-serif",
    }}>
      <div style={{
        width: "100%", maxWidth: 420, backgroundColor: "white",
        borderRadius: 16, padding: "40px 36px",
        boxShadow: "0 4px 32px rgba(0,0,0,0.08)",
      }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.7rem", color: "var(--text-main)" }}>
            Opinionated Kalam
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", borderRadius: 8, overflow: "hidden", border: "1px solid var(--border)", marginBottom: 28 }}>
          {(["user", "admin"] as Tab[]).map((t) => (
            <button key={t} onClick={() => { setTab(t); setError(""); }} style={{
              flex: 1, padding: "9px 0", border: "none", cursor: "pointer",
              fontSize: "0.85rem", fontWeight: 600, fontFamily: "'Inter', sans-serif",
              backgroundColor: tab === t ? "var(--text-main)" : "white",
              color: tab === t ? "white" : "var(--text-muted)",
              transition: "all 0.15s",
            }}>
              {t === "user" ? "Reader Login" : "Admin Login"}
            </button>
          ))}
        </div>

        {/* USER TAB */}
        {tab === "user" && (
          <>
            <p style={{ fontSize: "0.83rem", color: "var(--text-muted)", textAlign: "center", marginBottom: 20, marginTop: 0 }}>
              {mode === "login" ? "Sign in to your account" : "Create a free account"}
            </p>

            <button onClick={handleGoogle} disabled={loading} style={{
              width: "100%", padding: "11px 0", borderRadius: 8,
              border: "1px solid var(--border)", backgroundColor: "white",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              fontSize: "0.9rem", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer",
              marginBottom: 20, fontFamily: "'Inter', sans-serif", opacity: loading ? 0.6 : 1,
            }}>
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
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>or</span>
              <div style={{ flex: 1, height: 1, backgroundColor: "var(--border)" }} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {mode === "register" && (
                <input placeholder="Username" value={username}
                  onChange={(e) => setUsername(e.target.value)} style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "#1B2A47")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--border)")} />
              )}
              <input type="email" placeholder="Email address" value={email}
                onChange={(e) => setEmail(e.target.value)} style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "#1B2A47")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border)")} />
              <input type="password" placeholder="Password" value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleUserAuth()}
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "#1B2A47")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border)")} />
            </div>

            {error && <p style={{ fontSize: "0.82rem", color: "#D92323", marginTop: 10, marginBottom: 0 }}>{error}</p>}

            <button onClick={handleUserAuth} disabled={loading} style={{
              width: "100%", marginTop: 16, padding: "12px 0", borderRadius: 8,
              backgroundColor: "var(--text-main)", color: "white", border: "none",
              fontSize: "0.9rem", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1, fontFamily: "'Inter', sans-serif",
            }}>
              {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
            </button>

            <p style={{ textAlign: "center", marginTop: 18, fontSize: "0.83rem", color: "var(--text-muted)" }}>
              {mode === "login" ? "Don't have an account? " : "Already have an account? "}
              <button onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#1B2A47", fontWeight: 600, fontSize: "0.83rem", fontFamily: "'Inter', sans-serif", padding: 0 }}>
                {mode === "login" ? "Sign up" : "Sign in"}
              </button>
            </p>
          </>
        )}

        {/* ADMIN TAB */}
        {tab === "admin" && (
          <>
            <div style={{
              backgroundColor: "#fff8f0", border: "1px solid #f0d9c0",
              borderRadius: 8, padding: "10px 14px", marginBottom: 20,
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#b8860b" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              <span style={{ fontSize: "0.78rem", color: "#8a6000", fontWeight: 500 }}>
                Admin access only. Unauthorized attempts are logged.
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <input type="email" placeholder="Admin email" value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)} style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "#1B2A47")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border)")} />
              <input type="password" placeholder="Admin password" value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAdminAuth()}
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "#1B2A47")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border)")} />
            </div>

            {error && <p style={{ fontSize: "0.82rem", color: "#D92323", marginTop: 10, marginBottom: 0 }}>{error}</p>}

            <button onClick={handleAdminAuth} disabled={loading} style={{
              width: "100%", marginTop: 16, padding: "12px 0", borderRadius: 8,
              backgroundColor: "#1B2A47", color: "white", border: "none",
              fontSize: "0.9rem", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1, fontFamily: "'Inter', sans-serif",
            }}>
              {loading ? "Verifying..." : "Access Admin Panel"}
            </button>
          </>
        )}

      </div>
    </div>
  );
}
