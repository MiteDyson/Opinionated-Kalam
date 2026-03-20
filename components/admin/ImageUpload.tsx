"use client";

import { useState, useRef } from "react";
import { uploadToImageKit } from "@/lib/imagekit";

const ACCENT = "#1B2A47";
const TEXT   = "#1A1A1A";
const MUTED  = "#555555";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  folder?: string;
}

export default function ImageUpload({ value, onChange, label = "Cover Image", folder = "articles" }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError]         = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true); setError("");
    try {
      const url = await uploadToImageKit(file, folder);
      onChange(url);
    } catch (err: any) {
      setError("Upload failed: " + err.message);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  // Handle paste event on the input
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const items = e.clipboardData.items;
    for (const item of Array.from(items)) {
      if (item.type.startsWith("image/")) {
        e.preventDefault();
        const file = item.getAsFile();
        if (!file) return;
        setUploading(true); setError("");
        uploadToImageKit(file, folder)
          .then(url => onChange(url))
          .catch(err => setError("Upload failed: " + err.message))
          .finally(() => setUploading(false));
        return;
      }
    }
  };

  const labelStyle: React.CSSProperties = {
    display: "block", fontFamily: "'Inter', sans-serif",
    fontSize: "0.72rem", fontWeight: 700, color: MUTED,
    textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 7,
  };

  return (
    <div>
      <label style={labelStyle}>{label}</label>

      {/* Single input row with upload icon on right */}
      <div style={{ position: "relative" }}>
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onPaste={handlePaste}
          placeholder="Paste image URL or link — or click ↑ to upload from device"
          style={{
            width: "100%", padding: "10px 44px 10px 14px",
            borderRadius: 8, border: "1px solid #CFCBC3",
            backgroundColor: "white", color: TEXT,
            fontSize: "0.86rem", fontFamily: "'Inter', sans-serif",
            outline: "none", boxSizing: "border-box",
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
          title="Upload image from device"
          style={{
            position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)",
            width: 28, height: 28, borderRadius: 6,
            border: "1px solid #CFCBC3", backgroundColor: uploading ? "#f0f0ee" : "white",
            cursor: uploading ? "not-allowed" : "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: uploading ? "#aaa" : MUTED, transition: "all 0.14s",
          }}
          onMouseEnter={(e) => { if (!uploading) { (e.currentTarget as HTMLElement).style.borderColor = ACCENT; (e.currentTarget as HTMLElement).style.color = ACCENT; } }}
          onMouseLeave={(e) => { if (!uploading) { (e.currentTarget as HTMLElement).style.borderColor = "#CFCBC3"; (e.currentTarget as HTMLElement).style.color = MUTED; } }}
        >
          {uploading ? (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: "spin 0.8s linear infinite" }}>
              <path d="M12 2a10 10 0 0 1 10 10" strokeOpacity="0.9"/>
              <circle cx="12" cy="12" r="10" strokeOpacity="0.15"/>
            </svg>
          ) : (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
          )}
        </button>

        <style>{`@keyframes spin{to{transform:translateY(-50%) rotate(360deg)}}`}</style>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
      </div>

      {error && <p style={{ fontSize: "0.72rem", color: "#c0392b", fontFamily: "'Inter', sans-serif", marginTop: 4, margin: "4px 0 0" }}>{error}</p>}

      {/* Preview */}
      {value && !uploading && (
        <div style={{ marginTop: 8, position: "relative", display: "inline-block", width: "100%" }}>
          <img
            src={value}
            alt="preview"
            style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", borderRadius: 8, border: "1px solid #CFCBC3", display: "block" }}
            onError={() => { /* silently ignore broken URLs while typing */ }}
          />
          <button
            onClick={() => onChange("")}
            style={{ position: "absolute", top: 7, right: 7, width: 24, height: 24, borderRadius: "50%", backgroundColor: "rgba(0,0,0,0.55)", border: "none", cursor: "pointer", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.85rem", lineHeight: 1 }}
          >×</button>
        </div>
      )}
    </div>
  );
}
