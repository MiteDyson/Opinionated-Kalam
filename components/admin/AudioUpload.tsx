"use client";

import { useState, useRef } from "react";
import { uploadToImageKit } from "@/lib/imagekit";

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
  folder = "audio",
}: AudioUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress]   = useState(0);
  const [error, setError]         = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("audio/")) {
      setError("Please select an audio file (MP3, WAV, M4A, etc.)");
      return;
    }

    // Validate size — 200 MB limit
    if (file.size > 200 * 1024 * 1024) {
      setError("File too large. Max 200 MB.");
      return;
    }

    setUploading(true);
    setError("");
    setProgress(0);

    try {
      // Simulate progress while uploading (ImageKit doesn't expose real progress)
      const progressInterval = setInterval(() => {
        setProgress(p => Math.min(p + 8, 85));
      }, 300);

      const url = await uploadToImageKit(file, folder);

      clearInterval(progressInterval);
      setProgress(100);
      onChange(url);

      // Auto-detect duration from uploaded file
      if (onDurationDetected) {
        const audio = new Audio(url);
        audio.onloadedmetadata = () => {
          const secs = Math.floor(audio.duration);
          if (!isNaN(secs) && secs > 0) {
            const m = Math.floor(secs / 60);
            const s = (secs % 60).toString().padStart(2, "0");
            onDurationDetected(`${m}:${s}`);
          }
        };
      }

      setTimeout(() => setProgress(0), 1000);
    } catch (err: any) {
      setError("Upload failed: " + (err.message ?? "Unknown error"));
      setProgress(0);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

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

  const fileSizeLabel = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  return (
    <div>
      <label style={labelStyle}>
        {label}
        <span style={{ marginLeft: 8, fontSize: "0.65rem", fontWeight: 400, color: "#aaa", textTransform: "none", letterSpacing: 0 }}>
          optional — enables "Listen to Article" player
        </span>
      </label>

      {/* URL input + upload button row */}
      <div style={{ position: "relative" }}>
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste audio URL — or click ↑ to upload from device"
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
          title="Upload audio file from device"
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
            <svg
              width="13" height="13" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2"
              style={{ animation: "spin-audio 0.8s linear infinite" }}
            >
              <path d="M12 2a10 10 0 0 1 10 10" strokeOpacity="0.9"/>
              <circle cx="12" cy="12" r="10" strokeOpacity="0.15"/>
            </svg>
          ) : (
            // Waveform / audio upload icon
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
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

      {/* Upload progress bar */}
      {uploading && (
        <div style={{ marginTop: 8 }}>
          <div style={{
            height: 4, borderRadius: 2, backgroundColor: "#e8e5e0", overflow: "hidden",
          }}>
            <div style={{
              height: "100%",
              width: `${progress}%`,
              backgroundColor: ACCENT,
              borderRadius: 2,
              transition: "width 0.3s ease",
            }} />
          </div>
          <p style={{
            fontFamily: "'Inter', sans-serif", fontSize: "0.72rem",
            color: MUTED, marginTop: 5,
          }}>
            Uploading… {progress < 100 ? `${progress}%` : "Processing…"}
          </p>
        </div>
      )}

      {error && (
        <p style={{
          fontSize: "0.72rem", color: "#c0392b",
          fontFamily: "'Inter', sans-serif", marginTop: 4,
        }}>
          {error}
        </p>
      )}

      <p style={{
        fontSize: "0.72rem", color: "#aaa",
        fontFamily: "'Inter', sans-serif", marginTop: 6,
      }}>
        Accepts MP3, WAV, M4A, AAC, OGG · Max 200 MB
      </p>

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
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
            </div>
            <div style={{ flexShrink: 0 }}>
              <div style={{
                fontFamily: "'Inter', sans-serif", fontSize: "0.6rem",
                fontWeight: 700, textTransform: "uppercase" as const,
                letterSpacing: "0.08em", color: "#888", marginBottom: 3,
              }}>
                Listen to Article
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
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
            </svg>
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
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
            </svg>
            Remove audio
          </button>
        </div>
      )}
    </div>
  );
}
