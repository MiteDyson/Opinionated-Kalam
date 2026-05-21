"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { auth } from "@/lib/auth/firebase";
import { useAuth } from "@/context/AuthContext";
import { clientCache } from "@/lib/services/cache";
import ImageUpload from "@/components/admin/ImageUpload";
import AudioUpload from "@/components/admin/AudioUpload";
import TagSelector from "@/components/admin/TagSelector";
import ConfirmModal from "@/components/admin/ConfirmModal";
import { Mic } from "lucide-react";

const ACCENT = "#1B2A47";
const BG     = "#D5D2CB";
const TERRA  = "#D38B88";
const TEXT   = "#1A1A1A";
const MUTED  = "#555555";

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

// Skeleton
const Skeleton = ({ h = 40, w = "100%" }: { h?: number; w?: string }) => (
  <div style={{ height: h, width: w, borderRadius: 8, background: "linear-gradient(90deg,#e8e5e0 25%,#f0eeea 50%,#e8e5e0 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite" }} />
);

export default function EditPodcastPage() {
  const router = useRouter();
  const params = useParams();
  const slug   = params?.slug as string;
  const { userName } = useAuth();

  const [title, setTitle]       = useState("");
  const [coverImage, setCover]  = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [duration, setDuration] = useState("");
  const [excerpt, setExcerpt]   = useState("");
  const [tags, setTags]         = useState<string[]>([]);
  const [status, setStatus]     = useState("draft");
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState("");
  const [showConfirmPublish, setShowConfirmPublish] = useState(false);

  useEffect(() => {
    if (!slug) return;
    const load = async () => {
      try {
        const token = await auth.currentUser?.getIdToken();
        const res = await fetch(`/api/articles/${slug}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();
        setTitle(data.title ?? "");
        setCover(data.coverImage ?? "");
        setAudioUrl(data.audioUrl ?? "");
        setDuration(data.duration ?? "");
        setExcerpt(data.excerpt ?? "");
        setTags(data.tags ?? []);
        setStatus(data.status ?? "draft");
      } catch (e: any) {
        setError("Failed to load: " + e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  const handleSave = async (publish?: boolean) => {
    if (!title.trim()) { setError("Title is required."); return; }
    
    const newStatus = publish !== undefined ? (publish ? "published" : "draft") : status;

    if (newStatus === "published" && status !== "published" && !showConfirmPublish) {
      setShowConfirmPublish(true);
      return;
    }

    setSaving(true); setError("");
    try {
      const token = await auth.currentUser?.getIdToken(true);
      const res = await fetch(`/api/articles/${slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          title, excerpt, coverImage, audioUrl, duration, tags,
          type: "podcast",
          status: newStatus,
          author: userName || undefined,
          publishedAt: newStatus === "published" ? new Date() : null,
        }),
      });
      if (!res.ok) { const d = await res.json(); setError(d.error ?? "Save failed"); return; }
      setStatus(newStatus);
      clientCache.invalidate("fetch:/api/articles");
      window.location.href = "/admin";
    } finally { 
      setSaving(false); 
      setShowConfirmPublish(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: BG, color: TEXT }}>
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>

      {/* Top bar */}
      <div style={{ backgroundColor: TEXT, padding: "0 26px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 52, position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button onClick={() => router.push("/admin")} style={{ background: "none", border: "none", color: "#888", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: "0.83rem", fontFamily: "'Inter', sans-serif" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
            Back
          </button>
          <span style={{ color: "rgba(255,255,255,0.12)" }}>|</span>
          <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.1rem", color: "white", display: "flex", alignItems: "center", gap: 6 }}>
            <Mic size={14} style={{ color: "white" }} /> Edit Podcast
          </span>
          {!loading && (
            <span style={{ fontSize: "0.72rem", padding: "2px 8px", borderRadius: 4, fontFamily: "'Inter', sans-serif", fontWeight: 600, backgroundColor: status === "published" ? "rgba(76,140,80,0.2)" : "rgba(255,200,0,0.2)", color: status === "published" ? "#3a7a3e" : "#8a6a00" }}>
              {status}
            </span>
          )}
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {error && <span style={{ color: "#ff6b6b", fontSize: "0.78rem", fontFamily: "'Inter', sans-serif", maxWidth: 240 }}>{error}</span>}
          <button onClick={() => router.push("/admin")} disabled={saving || loading} style={{ padding: "0 16px", height: 34, borderRadius: 7, border: "1px solid rgba(255,255,255,0.18)", backgroundColor: "transparent", color: "#ccc", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600, fontFamily: "'Inter', sans-serif" }}>
            Cancel
          </button>
          <button onClick={() => handleSave()} disabled={saving || loading} style={{ padding: "0 18px", height: 34, borderRadius: 7, border: "none", backgroundColor: TERRA, color: TEXT, cursor: "pointer", fontSize: "0.8rem", fontWeight: 700, fontFamily: "'Inter', sans-serif", opacity: saving ? 0.7 : 1 }}>
            {saving ? "Saving…" : "Update"}
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "32px 24px", display: "flex", flexDirection: "column", gap: 22 }}>
        {loading ? (
          <>
            <Skeleton h={46} />
            <Skeleton h={180} />
            <Skeleton h={46} />
            <Skeleton h={46} />
            <Skeleton h={36} w="60%" />
          </>
        ) : (
          <>
            {/* 1. Episode Title */}
            <div>
              <label style={labelStyle}>Episode Title</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter episode title…" style={{ ...field, fontSize: "1.05rem", fontFamily: "'DM Serif Display', serif" }} />
            </div>

            {/* 2. Cover Image */}
            <ImageUpload value={coverImage} onChange={setCover} label="Cover Image" folder="podcasts" />

            {/* 3. Audio File URL */}
            <AudioUpload
              value={audioUrl}
              onChange={setAudioUrl}
              onDurationDetected={setDuration}
              label="Audio File"
            />

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
          </>
        )}
      </div>

      <ConfirmModal
        isOpen={showConfirmPublish}
        onClose={() => setShowConfirmPublish(false)}
        onConfirm={() => handleSave(true)}
        title="Publish Podcast"
        message="Ready to share this podcast episode? It will be available immediately."
        confirmText="Publish"
        type="publish"
        isLoading={saving}
      />
    </div>
  );
}
