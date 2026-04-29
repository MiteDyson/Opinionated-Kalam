"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import ImageUpload from "@/components/admin/ImageUpload";
import TagSelector from "@/components/admin/TagSelector";

const ACCENT = "#1B2A47";
const BG     = "#D5D2CB";
const TERRA  = "#D38B88";
const TEXT   = "#1A1A1A";
const MUTED  = "#555555";

const field: React.CSSProperties = { width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #CFCBC3", backgroundColor: "white", color: TEXT, fontSize: "0.88rem", fontFamily: "'Inter', sans-serif", outline: "none", boxSizing: "border-box" };
const labelStyle: React.CSSProperties = { display: "block", fontFamily: "'Inter', sans-serif", fontSize: "0.72rem", fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 };

export default function NewPodcastPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [title, setTitle]       = useState("");
  const [coverImage, setCover]  = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [duration, setDuration] = useState("");
  const [excerpt, setExcerpt]   = useState("");
  const [tags, setTags]         = useState<string[]>([]);
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState("");

  const handleSave = async (publishNow = false) => {
    if (!title.trim()) { setError("Title is required."); return; }
    if (!audioUrl.trim()) { setError("Audio URL is required."); return; }
    setSaving(true); setError("");
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title, excerpt, coverImage, audioUrl, duration, type: "podcast", tags, status: publishNow ? "published" : "draft", author: user?.displayName || "Unknown Author" }),
      });
      if (!res.ok) { const d = await res.json(); setError(d.error ?? "Save failed"); return; }
      router.push("/admin");
    } finally { setSaving(false); }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: BG, color: TEXT }}>

      {/* Top bar */}
      <div style={{ backgroundColor: TEXT, padding: "0 28px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 52, position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => router.push("/admin/create")} style={{ background: "none", border: "none", color: "#888", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: "0.83rem", fontFamily: "'Inter', sans-serif" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
            Back
          </button>
          <span style={{ color: "rgba(255,255,255,0.12)" }}>|</span>
          <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1rem", color: "white" }}>🎙 New Podcast</span>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {error && <span style={{ color: "#ff6b6b", fontSize: "0.78rem", fontFamily: "'Inter', sans-serif" }}>{error}</span>}
          <button onClick={() => handleSave(false)} disabled={saving} style={{ padding: "0 16px", height: 32, borderRadius: 6, border: "1px solid rgba(255,255,255,0.18)", backgroundColor: "transparent", color: "#ccc", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600, fontFamily: "'Inter', sans-serif" }}>Save Draft</button>
          <button onClick={() => handleSave(true)} disabled={saving} style={{ padding: "0 18px", height: 32, borderRadius: 6, border: "none", backgroundColor: TERRA, color: TEXT, cursor: "pointer", fontSize: "0.8rem", fontWeight: 700, fontFamily: "'Inter', sans-serif", opacity: saving ? 0.7 : 1 }}>
            {saving ? "Publishing…" : "Publish"}
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "32px 24px", display: "flex", flexDirection: "column", gap: 22 }}>

        {/* 1. Episode Title */}
        <div>
          <label style={labelStyle}>Episode Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter episode title…" style={{ ...field, fontSize: "1.05rem", fontFamily: "'DM Serif Display', serif" }} />
        </div>

        {/* 2. Cover Image */}
        <ImageUpload value={coverImage} onChange={setCover} label="Cover Image" folder="podcasts" />

        {/* 3. Audio File URL */}
        <div>
          <label style={labelStyle}>Audio File URL</label>
          <input value={audioUrl} onChange={(e) => setAudioUrl(e.target.value)} placeholder="https://storage.example.com/episode.mp3" style={field} />
          {audioUrl && (
            <div style={{ marginTop: 10 }}>
              <audio controls src={audioUrl} style={{ width: "100%", borderRadius: 8 }}
                onLoadedMetadata={(e) => {
                  const secs = Math.floor((e.target as HTMLAudioElement).duration);
                  if (!isNaN(secs) && secs > 0) {
                    const m = Math.floor(secs / 60);
                    const s = (secs % 60).toString().padStart(2, "0");
                    setDuration(`${m}:${s}`);
                  }
                }}
              />
              {duration && (
                <p style={{ fontSize: "0.75rem", color: "#3a7a3e", fontFamily: "'Inter', sans-serif", marginTop: 5 }}>
                  ✓ Duration detected: {duration}
                </p>
              )}
            </div>
          )}
          <p style={{ fontSize: "0.72rem", color: "#aaa", fontFamily: "'Inter', sans-serif", marginTop: 5 }}>
            Upload to Firebase Storage, Cloudinary, or S3, then paste the URL here.
          </p>
        </div>

        <div>
          <label style={labelStyle}>Description / Episode Notes</label>
          <textarea 
            value={excerpt} 
            onChange={(e) => setExcerpt(e.target.value)} 
            placeholder="Tell listeners what this episode is about…" 
            style={{ ...field, minHeight: 120, resize: "vertical" }} 
          />
        </div>

        {/* 6. Tags */}
        <TagSelector selected={tags} onChange={setTags} />

        {/* Preview card */}
        {(title || coverImage) && (
          <div>
            <label style={labelStyle}>Preview</label>
            <div style={{ backgroundColor: "#CCD8C7", borderRadius: 10, padding: 14, display: "flex", gap: 14, alignItems: "stretch", border: "1px solid #CFCBC3" }}>
              {coverImage
                ? <img src={coverImage} alt={title} style={{ width: 100, height: 76, objectFit: "cover", borderRadius: 7, flexShrink: 0 }} />
                : <div style={{ width: 100, height: 76, backgroundColor: "#bfbcb5", borderRadius: 7, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem" }}>🎙</div>
              }
              <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  {tags[0] && <div style={{ fontSize: "0.6rem", fontWeight: 800, color: "#D92323", fontFamily: "'Inter', sans-serif", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>{tags[0]}</div>}
                  <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "0.92rem", color: TEXT, lineHeight: 1.2 }}>{title || "Episode title"}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 26, height: 26, borderRadius: "50%", backgroundColor: TEXT, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  </div>
                  <span style={{ fontSize: "0.7rem", color: MUTED, fontFamily: "'Inter', sans-serif" }}>{duration || "00:00"}</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
