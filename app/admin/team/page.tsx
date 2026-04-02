"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";

const ACCENT = "#1B2A47";
const BG     = "#D5D2CB";
const TERRA  = "#D38B88";
const TEXT   = "#1A1A1A";
const MUTED  = "#555555";
const MAIN_ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL ;

interface TeamMember {
  _id: string;
  email: string;
  name: string;
  role: string;
  addedBy: string;
  addedAt: string;
  isMain: boolean;
}

const field: React.CSSProperties = {
  width: "100%", padding: "10px 14px", borderRadius: 8,
  border: "1px solid #CFCBC3", backgroundColor: "white",
  color: TEXT, fontSize: "0.88rem", fontFamily: "'Inter', sans-serif",
  outline: "none", boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  display: "block", fontFamily: "'Inter', sans-serif",
  fontSize: "0.72rem", fontWeight: 700, color: MUTED,
  textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 7,
};

export default function AdminTeamPage() {
  const router = useRouter();
  const [team, setTeam]         = useState<TeamMember[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [removing, setRemoving] = useState<string | null>(null);

  // Form state
  const [formEmail, setFormEmail] = useState("");
  const [formName, setFormName]   = useState("");
  const [formRole, setFormRole]   = useState("author");
  const [adding, setAdding]       = useState(false);
  const [addError, setAddError]   = useState("");
  const [addSuccess, setAddSuccess] = useState("");

  const getToken = async () => auth.currentUser?.getIdToken();

  const fetchTeam = async () => {
    setLoading(true); setError("");
    try {
      const token = await getToken();
      const res = await fetch("/api/admin/team", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load team");
      const data = await res.json();
      setTeam(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTeam(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError(""); setAddSuccess("");
    if (!formEmail.trim() || !formName.trim()) {
      setAddError("Email and name are required.");
      return;
    }
    setAdding(true);
    try {
      const token = await getToken();
      const res = await fetch("/api/admin/team", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ email: formEmail.trim(), name: formName.trim(), role: formRole }),
      });
      const data = await res.json();
      if (!res.ok) { setAddError(data.error ?? "Failed to add"); return; }
      setAddSuccess(`${formName} added successfully!`);
      setFormEmail(""); setFormName(""); setFormRole("author");
      fetchTeam();
    } catch {
      setAddError("Something went wrong.");
    } finally {
      setAdding(false);
    }
  };

  const handleRemove = async (email: string, name: string) => {
    if (!confirm(`Remove admin access for ${name} (${email})?`)) return;
    setRemoving(email);
    try {
      const token = await getToken();
      await fetch("/api/admin/team", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ email }),
      });
      setTeam(prev => prev.filter(m => m.email !== email));
    } catch {
      alert("Failed to remove.");
    } finally {
      setRemoving(null);
    }
  };

  const roleBadge = (role: string, isMain?: boolean) => {
    if (isMain) return { bg: "rgba(211,139,136,0.2)", color: "#b85c58", label: "Owner" };
    if (role === "admin") return { bg: "rgba(27,42,71,0.12)", color: ACCENT, label: "Admin" };
    return { bg: "rgba(76,140,80,0.12)", color: "#3a7a3e", label: "Author" };
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: BG, color: TEXT }}>
      {/* Top bar */}
      <div style={{ backgroundColor: TEXT, padding: "0 28px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button onClick={() => router.push("/admin")} style={{ background: "none", border: "none", color: "#888", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: "0.83rem", fontFamily: "'Inter', sans-serif" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
            Back
          </button>
          <span style={{ color: "rgba(255,255,255,0.12)" }}>|</span>
          <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.1rem", color: "white" }}>Team Management</span>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px", display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: 28, alignItems: "start" }}>

        {/* ── Add Admin Form ── */}
        <div style={{ backgroundColor: "white", borderRadius: 14, padding: "28px 24px", border: "1px solid #CFCBC3", position: "sticky", top: 80 }}>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.4rem", marginBottom: 6 }}>Add Team Member</h2>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", color: MUTED, marginBottom: 24, lineHeight: 1.6 }}>
            Grant admin access to anyone who already has a {" "}
            <strong>Firebase account</strong> on this platform.
          </p>

          <form onSubmit={handleAdd} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={labelStyle}>Full Name</label>
              <input value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="e.g. Priya Sharma" style={field}
                onFocus={(e) => (e.target.style.borderColor = ACCENT)}
                onBlur={(e)  => (e.target.style.borderColor = "#CFCBC3")}
              />
            </div>
            <div>
              <label style={labelStyle}>Email Address</label>
              <input type="email" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} placeholder="priya@example.com" style={field}
                onFocus={(e) => (e.target.style.borderColor = ACCENT)}
                onBlur={(e)  => (e.target.style.borderColor = "#CFCBC3")}
              />
            </div>
            <div>
              <label style={labelStyle}>Role</label>
              <select value={formRole} onChange={(e) => setFormRole(e.target.value)} style={{ ...field, cursor: "pointer" }}>
                <option value="author">Author — can create & edit posts</option>
                <option value="admin">Admin — full access</option>
              </select>
            </div>

            {addError && (
              <div style={{ padding: "9px 12px", backgroundColor: "rgba(217,35,35,0.08)", border: "1px solid rgba(217,35,35,0.2)", borderRadius: 8, fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", color: "#c0392b" }}>
                {addError}
              </div>
            )}
            {addSuccess && (
              <div style={{ padding: "9px 12px", backgroundColor: "rgba(76,140,80,0.08)", border: "1px solid rgba(76,140,80,0.2)", borderRadius: 8, fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", color: "#3a7a3e" }}>
                ✓ {addSuccess}
              </div>
            )}

            <button type="submit" disabled={adding} style={{ padding: "11px 0", borderRadius: 9, border: "none", backgroundColor: ACCENT, color: "white", fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: "0.88rem", cursor: adding ? "not-allowed" : "pointer", opacity: adding ? 0.7 : 1, transition: "opacity 0.15s" }}>
              {adding ? "Adding…" : "Add Member"}
            </button>
          </form>
        </div>

        {/* ── Team List ── */}
        <div>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.4rem", marginBottom: 16 }}>Current Team</h2>

          {error && (
            <div style={{ padding: "10px 14px", backgroundColor: "rgba(217,35,35,0.08)", border: "1px solid rgba(217,35,35,0.2)", borderRadius: 8, marginBottom: 16, fontFamily: "'Inter', sans-serif", fontSize: "0.82rem", color: "#c0392b" }}>
              {error}
            </div>
          )}

          {/* Main admin (always shown) */}
          <div style={{ backgroundColor: "white", borderRadius: 12, border: "1px solid #CFCBC3", marginBottom: 10, padding: "16px 18px", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", backgroundColor: "rgba(211,139,136,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#b85c58" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: "0.9rem", color: TEXT }}>Vineet Mestry</div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", color: MUTED, marginTop: 2 }}>{MAIN_ADMIN_EMAIL}</div>
            </div>
            <span style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "'Inter', sans-serif", padding: "3px 8px", borderRadius: 4, backgroundColor: "rgba(211,139,136,0.2)", color: "#b85c58" }}>Owner</span>
          </div>

          {/* Team members */}
          {loading ? (
            <>{[1,2].map(i => (
              <div key={i} style={{ backgroundColor: "white", borderRadius: 12, border: "1px solid #CFCBC3", marginBottom: 10, padding: "16px 18px", display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", backgroundColor: "#e8e5e0", animation: "shimmer 1.4s infinite" }} />
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 7 }}>
                  <div style={{ height: 13, width: "40%", borderRadius: 4, backgroundColor: "#e8e5e0" }} />
                  <div style={{ height: 10, width: "60%", borderRadius: 4, backgroundColor: "#e8e5e0" }} />
                </div>
              </div>
            ))}</>
          ) : team.length === 0 ? (
            <div style={{ padding: "32px 18px", textAlign: "center", backgroundColor: "white", borderRadius: 12, border: "1px solid #CFCBC3" }}>
              <div style={{ fontSize: "2rem", marginBottom: 8 }}>👥</div>
              <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.1rem", color: TEXT, marginBottom: 4 }}>No team members yet</div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", color: MUTED }}>Add contributors using the form on the left.</div>
            </div>
          ) : (
            team.map(member => {
              const badge = roleBadge(member.role);
              const initials = member.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
              return (
                <div key={member._id} style={{ backgroundColor: "white", borderRadius: 12, border: "1px solid #CFCBC3", marginBottom: 10, padding: "16px 18px", display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", backgroundColor: "rgba(27,42,71,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: "0.82rem", color: ACCENT }}>
                    {initials}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: "0.9rem", color: TEXT }}>{member.name}</div>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.73rem", color: MUTED, marginTop: 2 }}>{member.email}</div>
                    {member.addedAt && (
                      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.67rem", color: "#aaa", marginTop: 2 }}>
                        Added {new Date(member.addedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </div>
                    )}
                  </div>
                  <span style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "'Inter', sans-serif", padding: "3px 8px", borderRadius: 4, backgroundColor: badge.bg, color: badge.color, flexShrink: 0 }}>
                    {badge.label}
                  </span>
                  <button
                    onClick={() => handleRemove(member.email, member.name)}
                    disabled={removing === member.email}
                    title="Remove access"
                    style={{ width: 30, height: 30, borderRadius: 6, border: "1px solid rgba(192,57,43,0.25)", backgroundColor: "transparent", color: "#c0392b", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, opacity: removing === member.email ? 0.4 : 1, transition: "all 0.13s" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(192,57,43,0.07)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>
                  </button>
                </div>
              );
            })
          )}

          <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
        </div>
      </div>
    </div>
  );
}
