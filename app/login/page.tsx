"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode]       = useState<"login" | "register">("login");
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [name, setName]       = useState("");
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  const handleCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (mode === "register") {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error ?? "Registration failed");
        setLoading(false);
        return;
      }
    }

    const result = await signIn("credentials", {
      email, password, redirect: false,
    });

    setLoading(false);
    if (result?.error) {
      setError("Invalid email or password");
    } else {
      router.push("/");
    }
  };

  const handleGoogle = () => signIn("google", { callbackUrl: "/" });

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "11px 14px", borderRadius: 8,
    border: "1px solid var(--border)", backgroundColor: "white",
    fontSize: "0.9rem", fontFamily: "'Inter', sans-serif",
    color: "var(--text-main)", outline: "none",
    transition: "border-color 0.2s",
  };

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
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.8rem", color: "var(--text-main)", lineHeight: 1 }}>
            Opinionated Kalam
          </div>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", color: "var(--text-muted)", marginTop: 8 }}>
            {mode === "login" ? "Sign in to your account" : "Create a free account"}
          </p>
        </div>

        {/* Google */}
        <button onClick={handleGoogle} style={{
          width: "100%", padding: "11px 0", borderRadius: 8,
          border: "1px solid var(--border)", backgroundColor: "white",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
          fontSize: "0.9rem", fontWeight: 600, fontFamily: "'Inter', sans-serif",
          cursor: "pointer", marginBottom: 20, transition: "background 0.15s",
        }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#f9f9f9")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "white")}
        >
          {/* Google icon */}
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

        {/* Form */}
        <form onSubmit={handleCredentials} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {mode === "register" && (
            <input
              type="text" placeholder="Full name" value={name}
              onChange={(e) => setName(e.target.value)}
              required style={inputStyle}
              onFocus={(e) => ((e.target as HTMLElement).style.borderColor = "#1B2A47")}
              onBlur={(e) => ((e.target as HTMLElement).style.borderColor = "var(--border)")}
            />
          )}
          <input
            type="email" placeholder="Email address" value={email}
            onChange={(e) => setEmail(e.target.value)}
            required style={inputStyle}
            onFocus={(e) => ((e.target as HTMLElement).style.borderColor = "#1B2A47")}
            onBlur={(e) => ((e.target as HTMLElement).style.borderColor = "var(--border)")}
          />
          <input
            type="password" placeholder="Password" value={password}
            onChange={(e) => setPassword(e.target.value)}
            required style={inputStyle}
            onFocus={(e) => ((e.target as HTMLElement).style.borderColor = "#1B2A47")}
            onBlur={(e) => ((e.target as HTMLElement).style.borderColor = "var(--border)")}
          />

          {error && (
            <p style={{ fontSize: "0.82rem", color: "var(--red)", fontFamily: "'Inter', sans-serif", margin: 0 }}>
              {error}
            </p>
          )}

          <button type="submit" disabled={loading} style={{
            width: "100%", padding: "12px 0", borderRadius: 8,
            backgroundColor: "var(--text-main)", color: "white", border: "none",
            fontSize: "0.9rem", fontWeight: 700, fontFamily: "'Inter', sans-serif",
            cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1,
            transition: "opacity 0.15s",
          }}>
            {loading ? "Please wait..." : mode === "login" ? "Sign in" : "Create account"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: 20, fontSize: "0.85rem", fontFamily: "'Inter', sans-serif", color: "var(--text-muted)" }}>
          {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }} style={{
            background: "none", border: "none", cursor: "pointer",
            color: "#1B2A47", fontWeight: 600, fontSize: "0.85rem",
            fontFamily: "'Inter', sans-serif", padding: 0,
          }}>
            {mode === "login" ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}
