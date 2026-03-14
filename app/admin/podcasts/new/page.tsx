"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";

const ACCENT = "#1B2A47";
const BG     = "#D5D2CB";
const TERRA  = "#D38B88";
const TEXT   = "#1A1A1A";
const MUTED  = "#555555";

const ALL_TAGS = ["Automotive","Geo Politics","Scandals","Crime","Explainers","India","Economy","Science","Technology","Culture"];

export default function NewPodcastPage() {
  const router = useRouter();
  const [title, setTitle]       = useState("");
  const [excerpt, setExcerpt]   = useState("");
  const [coverImage, setCover]  = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [episode, setEpisode]   = useState("EP01");
  const [duration, setDuration] = useState("");
  const [selectedTags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [status, setStatus]     = useState<"draft" | "published">("draft");
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState("");

  const toggleTag = (tag: string) =>
    setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);

  const addCustomTag = () => {
    const t = tagInput.trim();
    if (t && !selectedTags.includes(t)) setTags(prev => [...prev, t]);
    setTagInput("");
  };

  const handleSave = async (publishNow = false) => {
    if (!title.trim()) { setError("Title is required."); return; }
    if (!audioUrl.trim()) { setError("Audio URL is required."); return; }
    setSaving(true); setError("");
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          title, excerpt, coverImage, audioUrl, episode, duration,
          type: "podcast", tags: selectedTags,
          status: publishNow ? "published" : status,
          author: "Vineet Mestry",
        }),
      });
      if (!res.ok) { const d = await res.json(); setError(d.error ?? "Save failed"); return; }
      router.push("/admin");
    } finally {
      setSaving(false);
    }
  };

  const field: React.CSSProperties = {
    width: "100%", padding: "10px 14px", borderRadius: 8,
    border: "1px solid #CFCBC3", backgroundColor: "white",
    color: TEXT, fontSize: "0.9rem",
    fontFamily: "'Inter', sans-serif", outline: "none",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    display: "block", fontFamily: "'Inter', sans-serif",
    fontSize: "0.75rem", fontWeight: 700, color: MUTED,
    textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 7,
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: BG, color: TEXT }}>

      {/* Sticky top bar */}
      <div style={{
        backgroundColor: TEXT, padding: "14px 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button onClick={() => router.push("/admin")} style={{
            background: "none", border: "none", color: "#888", cursor: "pointer",
            display: "flex", alignItems: "center", gap: 6,
            fontSize: "0.85rem", fontFamily: "'Inter', sans-serif",
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
            Back
          </button>
          <span style={{ color: "rgba(255,255,255,0.15)" }}>|</span>
          <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.2rem", color: "white" }}>New Podcast</span>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {error && <span style={{ color: "#ff6b6b", fontSize: "0.8rem", fontFamily: "'Inter', sans-serif" }}>{error}</span>}
          <button onClick={() => handleSave(false)} disabled={saving} style={{
            padding: "8px 18px", borderRadius: 7,
            border: "1px solid rgba(255,255,255,0.2)",
            backgroundColor: "transparent", color: "#ccc", cursor: "pointer",
            fontSize: "0.83rem", fontWeight: 600, fontFamily: "'Inter', sans-serif",
          }}>
            Save Draft
          </button>
          <button onClick={() => handleSave(true)} disabled={saving} style={{
            padding: "8px 20px", borderRadius: 7, border: "none",
            backgroundColor: TERRA, color: TEXT, cursor: "pointer",
            fontSize: "0.83rem", fontWeight: 700, fontFamily: "'Inter', sans-serif",
            opacity: saving ? 0.7 : 1,
          }}>
            {saving ? "Publishing..." : "Publish"}
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "40px 24px", display: "flex", flexDirection: "column", gap: 24 }}>

        {/* Title */}
        <div>
          <input
            value={title} onChange={(e) => setTitle(e.target.value)}
            placeholder="Podcast episode title..."
            style={{
              ...field, fontSize: "1.8rem", padding: "14px 0",
              fontFamily: "'DM Serif Display', serif",
              border: "none", borderBottom: "2px solid #CFCBC3",
              borderRadius: 0, backgroundColor: "transparent",
            }}
          />
        </div>

        {/* Episode + Duration */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <label style={labelStyle}>Episode Number</label>
            <input
              value={episode} onChange={(e) => setEpisode(e.target.value)}
              placeholder="EP01"
              style={field}
            />
          </div>
          <div>
            <label style={labelStyle}>Duration</label>
            <input
              value={duration} onChange={(e) => setDuration(e.target.value)}
              placeholder="25:06"
              style={field}
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label style={labelStyle}>Description</label>
          <textarea
            value={excerpt} onChange={(e) => setExcerpt(e.target.value)}
            placeholder="What's this episode about? (shown on podcast cards)"
            rows={3}
            style={{ ...field, resize: "vertical", lineHeight: 1.6 }}
          />
        </div>

        {/* Cover Image */}
        <div>
          <label style={labelStyle}>Cover Image URL</label>
          <input
            value={coverImage} onChange={(e) => setCover(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            style={field}
          />
          {coverImage && (
            <div style={{ marginTop: 10, display: "flex", gap: 12, alignItems: "center" }}>
              <img src={coverImage} alt="cover" style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8, border: "1px solid #CFCBC3" }} />
              <span style={{ fontSize: "0.8rem", color: MUTED, fontFamily: "'Inter', sans-serif" }}>Cover preview</span>
            </div>
          )}
        </div>

        {/* Audio URL */}
        <div>
          <label style={labelStyle}>Audio File URL</label>
          <input
            value={audioUrl} onChange={(e) => setAudioUrl(e.target.value)}
            placeholder="https://storage.example.com/podcast.mp3"
            style={field}
          />
          {audioUrl && (
            <div style={{ marginTop: 10 }}>
              <audio controls src={audioUrl} style={{ width: "100%", borderRadius: 8 }} />
            </div>
          )}
          <p style={{ fontSize: "0.75rem", color: "#aaa", fontFamily: "'Inter', sans-serif", marginTop: 6 }}>
            Upload your audio file to cloud storage (e.g. Firebase Storage, Cloudinary) and paste the URL here.
          </p>
        </div>

        {/* Tags */}
        <div>
          <label style={labelStyle}>Tags</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 10 }}>
            {ALL_TAGS.map(tag => (
              <button key={tag} onClick={() => toggleTag(tag)} style={{
                padding: "5px 12px", borderRadius: 20, cursor: "pointer",
                border: `1.5px solid ${selectedTags.includes(tag) ? ACCENT : "#CFCBC3"}`,
                backgroundColor: selectedTags.includes(tag) ? ACCENT : "white",
                color: selectedTags.includes(tag) ? "white" : MUTED,
                fontSize: "0.78rem", fontWeight: 600, fontFamily: "'Inter', sans-serif",
                transition: "all 0.15s",
              }}>
                {tag}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              value={tagInput} onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCustomTag(); } }}
              placeholder="Custom tag..."
              style={{ ...field, flex: 1 }}
            />
            <button onClick={addCustomTag} style={{
              padding: "10px 16px", borderRadius: 8,
              border: "1px solid #CFCBC3", backgroundColor: "white",
              color: TEXT, cursor: "pointer",
              fontSize: "0.83rem", fontFamily: "'Inter', sans-serif",
            }}>
              Add
            </button>
          </div>
        </div>

        {/* Podcast preview card */}
        {(title || coverImage) && (
          <div>
            <label style={labelStyle}>Preview</label>
            <div style={{
              backgroundColor: "#CCD8C7", borderRadius: 10, padding: 14,
              display: "flex", gap: 14, alignItems: "stretch",
              border: "1px solid #CFCBC3",
            }}>
              {coverImage ? (
                <img src={coverImage} alt={title} style={{ width: 110, height: 85, objectFit: "cover", borderRadius: 8, flexShrink: 0 }} />
              ) : (
                <div style={{ width: 110, height: 85, backgroundColor: "#bfbcb5", borderRadius: 8, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: "1.5rem" }}>🎙</span>
                </div>
              )}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  {selectedTags[0] && (
                    <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "#D92323", fontFamily: "'Inter', sans-serif", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>
                      {selectedTags[0]} → {episode}
                    </div>
                  )}
                  <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1rem", color: TEXT, lineHeight: 1.2 }}>
                    {title || "Episode title"}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", backgroundColor: TEXT, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  </div>
                  <span style={{ fontSize: "0.72rem", color: MUTED, fontFamily: "'Inter', sans-serif" }}>
                    {duration || "00:00"} / {duration || "00:00"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
