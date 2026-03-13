"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { auth } from "@/lib/firebase";

const ACCENT  = "#1B2A47";
const SURFACE = "#1a1a1a";
const RED     = "#e05555";

interface AdminUser {
  uid: string;
  email: string;
  name: string;
  photo: string | null;
  addedAt: string | null;
}

export default function AdminUsersPage() {
  const [admins, setAdmins]     = useState<AdminUser[]>([]);
  const [loading, setLoading]   = useState(true);
  const [email, setEmail]       = useState("");
  const [adding, setAdding]     = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState("");
  const currentUid = auth.currentUser?.uid;

  const getToken = async () => await auth.currentUser?.getIdToken();

  const loadAdmins = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const res = await fetch("/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setAdmins(Array.isArray(data) ? data : []);
    } catch {
      setError("Failed to load admins.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAdmins(); }, []);

  const handleAdd = async () => {
    if (!email.trim()) return;
    setError(""); setSuccess(""); setAdding(true);
    try {
      const token = await getToken();
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      setSuccess(`${data.email} is now an admin.`);
      setEmail("");
      await loadAdmins();
    } catch {
      setError("Something went wrong.");
    } finally {
      setAdding(false);
    }
  };

  const handleRemove = async (uid: string, adminEmail: string) => {
    if (!confirm(`Remove ${adminEmail} as admin?`)) return;
    setError(""); setSuccess(""); setRemoving(uid);
    try {
      const token = await getToken();
      const res = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ uid }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      setSuccess(`${adminEmail} removed.`);
      await loadAdmins();
    } catch {
      setError("Something went wrong.");
    } finally {
      setRemoving(null);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0f0f0f", color: "#e8e8e8" }}>

      {/* Top bar */}
      <div style={{ backgroundColor: SURFACE, borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.5rem", color: "white" }}>
          Admin — Opinionated Kalam
        </div>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <Link href="/admin" style={{ color: "#888", fontSize: "0.85rem", fontFamily: "'Inter', sans-serif", textDecoration: "none" }}>
            ← Dashboard
          </Link>
          <Link href="/" style={{ color: "#888", fontSize: "0.85rem", fontFamily: "'Inter', sans-serif", textDecoration: "none" }}>
            View Site
          </Link>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 32px" }}>

        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "2rem", color: "white", marginBottom: 8 }}>
          Manage Admins
        </h1>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.88rem", color: "#666", marginBottom: 36 }}>
          Add or remove admin access. The person must have signed in to the site at least once before you can add them.
        </p>

        {/* Add admin */}
        <div style={{ backgroundColor: SURFACE, borderRadius: 12, padding: "24px", border: "1px solid rgba(255,255,255,0.06)", marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: "0.95rem", color: "white", margin: "0 0 16px" }}>
            Add New Admin
          </h2>
          <div style={{ display: "flex", gap: 12 }}>
            <input
              type="email"
              placeholder="Enter their email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              style={{
                flex: 1, padding: "10px 14px", borderRadius: 8,
                backgroundColor: "#111", border: "1px solid rgba(255,255,255,0.1)",
                color: "white", fontSize: "0.9rem", fontFamily: "'Inter', sans-serif",
                outline: "none",
              }}
            />
            <button
              onClick={handleAdd}
              disabled={adding || !email.trim()}
              style={{
                padding: "10px 22px", borderRadius: 8, border: "none",
                backgroundColor: ACCENT, color: "white",
                fontSize: "0.88rem", fontWeight: 600,
                fontFamily: "'Inter', sans-serif", cursor: "pointer",
                opacity: adding || !email.trim() ? 0.5 : 1,
                whiteSpace: "nowrap",
              }}
            >
              {adding ? "Adding..." : "Add Admin"}
            </button>
          </div>

          {error && (
            <div style={{ marginTop: 12, padding: "10px 14px", borderRadius: 8, backgroundColor: "rgba(224,85,85,0.1)", border: "1px solid rgba(224,85,85,0.2)", color: RED, fontSize: "0.83rem", fontFamily: "'Inter', sans-serif" }}>
              {error}
            </div>
          )}
          {success && (
            <div style={{ marginTop: 12, padding: "10px 14px", borderRadius: 8, backgroundColor: "rgba(76,175,80,0.1)", border: "1px solid rgba(76,175,80,0.2)", color: "#4CAF50", fontSize: "0.83rem", fontFamily: "'Inter', sans-serif" }}>
              {success}
            </div>
          )}
        </div>

        {/* Current admins list */}
        <div style={{ backgroundColor: SURFACE, borderRadius: 12, border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden" }}>
          <div style={{ padding: "18px 24px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            <h2 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: "0.95rem", color: "white", margin: 0 }}>
              Current Admins ({admins.length})
            </h2>
          </div>

          {loading ? (
            <div style={{ padding: "40px 24px", textAlign: "center", color: "#555", fontFamily: "'Inter', sans-serif", fontSize: "0.88rem" }}>
              Loading...
            </div>
          ) : admins.length === 0 ? (
            <div style={{ padding: "40px 24px", textAlign: "center", color: "#555", fontFamily: "'Inter', sans-serif", fontSize: "0.88rem" }}>
              No admins found.
            </div>
          ) : (
            admins.map((a, i) => (
              <div key={a.uid} style={{
                display: "flex", alignItems: "center", gap: 16,
                padding: "16px 24px",
                borderBottom: i < admins.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
              }}>
                {/* Avatar */}
                {a.photo ? (
                  <img src={a.photo} alt={a.name} style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
                ) : (
                  <div style={{ width: 40, height: 40, borderRadius: "50%", backgroundColor: ACCENT, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "1rem", fontWeight: 700, color: "white", fontFamily: "'Inter', sans-serif" }}>
                    {a.email[0].toUpperCase()}
                  </div>
                )}

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", fontWeight: 600, color: "white" }}>
                    {a.name !== "—" ? a.name : a.email}
                    {a.uid === currentUid && (
                      <span style={{ marginLeft: 8, fontSize: "0.7rem", padding: "1px 7px", borderRadius: 4, backgroundColor: "rgba(27,42,71,0.5)", color: "#7b99cc", fontWeight: 600 }}>
                        You
                      </span>
                    )}
                  </div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", color: "#666", marginTop: 2 }}>
                    {a.email}
                    {a.addedAt && (
                      <span style={{ marginLeft: 12 }}>
                        Added {new Date(a.addedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    )}
                  </div>
                </div>

                {/* Remove button — hidden for yourself */}
                {a.uid !== currentUid && (
                  <button
                    onClick={() => handleRemove(a.uid, a.email)}
                    disabled={removing === a.uid}
                    style={{
                      padding: "6px 14px", borderRadius: 6,
                      border: "1px solid rgba(224,85,85,0.3)",
                      backgroundColor: "transparent",
                      color: RED, fontSize: "0.8rem",
                      fontFamily: "'Inter', sans-serif",
                      cursor: "pointer", opacity: removing === a.uid ? 0.5 : 1,
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "rgba(224,85,85,0.1)")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")}
                  >
                    {removing === a.uid ? "Removing..." : "Remove"}
                  </button>
                )}
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
