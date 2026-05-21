"use client";

import { useState, useRef } from "react";
import { Play, Trash2, Volume2, Upload, Loader2 } from "lucide-react";
import { auth } from "@/lib/auth/firebase";

const ACCENT = "#1B2A47";
const TEXT   = "#1A1A1A";
const MUTED  = "#555555";

interface AudioUploadProps {
  value: string;
  onChange: (url: string) => void;
  onDurationDetected?: (duration: string) => void;
  label?: string;
  folder?: string;
}

export default function AudioUpload({
  value,
  onChange,
  onDurationDetected,
  label = "Audio File",
}: AudioUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError]         = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontFamily: "'Inter', sans-serif",
    fontSize: "0.72rem",
    fontWeight: 700,
    color: MUTED,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    marginBottom: 7,
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("audio/")) {
      setError("Please select an audio file (MP3, WAV, M4A, etc.)");
      return;
    }

    // Validate size — 150 MB limit
    if (file.size > 150 * 1024 * 1024) {
      setError("File too large. Max 150 MB.");
      return;
    }

    setUploading(true);
    setError("");

    try {
      if (!auth.currentUser) {
        setError("Not signed in.");
        setUploading(false);
        return;
      }
      
      const token = await auth.currentUser.getIdToken(true);
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload-archive", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to upload file to archive.org");
      }

      const data = await res.json();
      onChange(data.url);
    } catch (err: any) {
      setError(err.message ?? "Unknown upload error.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div>
      <label style={labelStyle}>
        {label}
        <span style={{ marginLeft: 8, fontSize: "0.65rem", fontWeight: 400, color: "#aaa", textTransform: "none", letterSpacing: 0 }}>
          optional — enables "Listen to Content" player
        </span>
      </label>

      {/* URL input */}
      <div style={{ position: "relative" }}>
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste direct audio URL — or click ↑ to upload from device"
          disabled={uploading}
          style={{
            width: "100%",
            padding: "10px 44px 10px 14px",
            borderRadius: 8,
            border: "1px solid #CFCBC3",
            backgroundColor: uploading ? "#faf9f7" : "white",
            color: TEXT,
            fontSize: "0.86rem",
            fontFamily: "'Inter', sans-serif",
            outline: "none",
            boxSizing: "border-box",
            transition: "border-color 0.15s",
          }}
          onFocus={(e) => (e.target.style.borderColor = ACCENT)}
          onBlur={(e)  => (e.target.style.borderColor = "#CFCBC3")}
        />

        {/* Upload icon button — right side of input */}
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          title="Upload audio file directly to archive.org"
          style={{
            position: "absolute",
            right: 6,
            top: "50%",
            transform: "translateY(-50%)",
            width: 28,
            height: 28,
            borderRadius: 6,
            border: "1px solid #CFCBC3",
            backgroundColor: uploading ? "#f0f0ee" : "white",
            cursor: uploading ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: uploading ? "#aaa" : MUTED,
            transition: "all 0.14s",
          }}
          onMouseEnter={(e) => {
            if (!uploading) {
              (e.currentTarget as HTMLElement).style.borderColor = ACCENT;
              (e.currentTarget as HTMLElement).style.color = ACCENT;
            }
          }}
          onMouseLeave={(e) => {
            if (!uploading) {
              (e.currentTarget as HTMLElement).style.borderColor = "#CFCBC3";
              (e.currentTarget as HTMLElement).style.color = MUTED;
            }
          }}
        >
          {uploading ? (
            <Loader2 size={13} style={{ animation: "spin-audio 0.8s linear infinite" }} />
          ) : (
            <Upload size={13} />
          )}
        </button>

        <style>{`@keyframes spin-audio { to { transform: translateY(-50%) rotate(360deg); } }`}</style>
        <input
          ref={fileRef}
          type="file"
          accept="audio/*"
          onChange={handleFile}
          style={{ display: "none" }}
        />
      </div>

      {uploading && (
        <p style={{
          fontFamily: "'Inter', sans-serif", fontSize: "0.72rem",
          color: MUTED, marginTop: 5,
        }}>
          Uploading directly to archive.org… please wait, this may take a moment.
        </p>
      )}

      {error && (
        <p style={{
          fontSize: "0.72rem", color: "#c0392b",
          fontFamily: "'Inter', sans-serif", marginTop: 4,
          lineHeight: 1.4,
        }}>
          ⚠️ {error}
        </p>
      )}

      {!uploading && !error && (
        <p style={{
          fontSize: "0.72rem", color: "#aaa",
          fontFamily: "'Inter', sans-serif", marginTop: 6,
        }}>
          Upload audio directly from your device, or paste a link from{" "}
          <a href="https://archive.org" target="_blank" rel="noopener noreferrer" style={{ color: "#D38B88", textDecoration: "underline" }}>
            archive.org
          </a>.
        </p>
      )}

      {/* Audio preview + player mockup */}
      {value && !uploading && (
        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
          {/* Native player for verification */}
          <audio
            controls
            src={value}
            style={{ width: "100%", borderRadius: 8 }}
            onLoadedMetadata={(e) => {
              if (!onDurationDetected) return;
              const secs = Math.floor((e.target as HTMLAudioElement).duration);
              if (!isNaN(secs) && secs > 0) {
                const m = Math.floor(secs / 60);
                const s = (secs % 60).toString().padStart(2, "0");
                onDurationDetected(`${m}:${s}`);
              }
            }}
          />

          {/* Player UI preview */}
          <div style={{
            padding: "14px 18px",
            backgroundColor: "white",
            borderRadius: 10,
            border: "1px solid #e8e5e0",
            display: "flex",
            alignItems: "center",
            gap: 14,
            opacity: 0.75,
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 9,
              backgroundColor: "#1A1A1A",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <Play size={14} fill="white" />
            </div>
            <div style={{ flexShrink: 0 }}>
              <div style={{
                fontFamily: "'Inter', sans-serif", fontSize: "0.6rem",
                fontWeight: 700, textTransform: "uppercase" as const,
                letterSpacing: "0.08em", color: "#888", marginBottom: 3,
              }}>
                Listen to Content
              </div>
              <div style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "1rem", fontStyle: "italic", color: "#1A1A1A",
              }}>
                Preview
              </div>
            </div>
            <div style={{ flex: 1, height: 4, backgroundColor: "#e0ddd8", borderRadius: 2 }} />
            <div style={{
              fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", color: "#555",
            }}>
              0:00 / —
            </div>
            <div style={{
              padding: "4px 10px", borderRadius: 7,
              border: "1px solid #e0ddd8", backgroundColor: "#f5f4f2",
              fontFamily: "'Inter', sans-serif", fontSize: "0.78rem",
              fontWeight: 700, color: "#333",
            }}>
              1X
            </div>
            <Volume2 size={18} color="#888" />
          </div>

          {/* Remove button */}
          <button
            onClick={() => { onChange(""); if (onDurationDetected) onDurationDetected(""); }}
            style={{
              alignSelf: "flex-start",
              padding: "4px 12px",
              borderRadius: 6,
              border: "1px solid rgba(192,57,43,0.25)",
              backgroundColor: "transparent",
              color: "#c0392b",
              cursor: "pointer",
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.75rem",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 5,
              transition: "all 0.13s",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(192,57,43,0.06)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
          >
            <Trash2 size={12} />
            Remove audio
          </button>
        </div>
      )}
    </div>
  );
}
