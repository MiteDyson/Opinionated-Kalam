"use client";

import { useState, useRef } from "react";
import { uploadToImageKit } from "@/lib/imagekit";
import { Loader2, Upload, X } from "lucide-react";

const ACCENT = "#1B2A47";
const TEXT   = "#1A1A1A";
const MUTED  = "#555555";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  folder?: string;
  /** aspect ratio for preview, e.g. "16/9" (default) or "1/1" */
  aspectRatio?: string;
  /** "cover" fills the box (default), "contain" letterboxes smaller images */
  fit?: "cover" | "contain";
}

export default function ImageUpload({
  value,
  onChange,
  label = "Cover Image",
  folder = "articles",
  aspectRatio = "16/9",
  fit = "cover",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError]         = useState("");
  const [imgSize, setImgSize]     = useState<{ w: number; h: number } | null>(null);
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

  // Detect actual image dimensions when loaded
  const onImgLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.target as HTMLImageElement;
    setImgSize({ w: img.naturalWidth, h: img.naturalHeight });
  };

  // If image is smaller than 1920×1080, use "contain" to avoid upscale blurring
  const effectiveFit = imgSize && (imgSize.w < 1920 || imgSize.h < 1080) ? "contain" : fit;

  return (
    <div>
      {label && <label style={labelStyle}>{label}</label>}

      {/* Input row */}
      <div style={{ position: "relative" }}>
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onPaste={handlePaste}
          placeholder="Paste image URL — or click ↑ to upload"
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
            <Loader2 size={13} style={{ animation: "spin 0.8s linear infinite" }} />
          ) : (
            <Upload size={13} />
          )}
        </button>
        <style>{`@keyframes spin{to{transform:translateY(-50%) rotate(360deg)}}`}</style>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
      </div>

      {error && <p style={{ fontSize: "0.72rem", color: "#c0392b", fontFamily: "'Inter', sans-serif", marginTop: 4 }}>{error}</p>}

      {/* Preview — 16:9 (1920×1080 standard) */}
      {value && !uploading && (
        <div style={{ marginTop: 10, position: "relative" }}>
          {/* Aspect-ratio container */}
          <div style={{
            width: "100%",
            paddingTop: aspectRatio === "16/9" ? "56.25%" : aspectRatio === "1/1" ? "100%" : "56.25%",
            position: "relative",
            borderRadius: 10,
            overflow: "hidden",
            border: "1px solid #CFCBC3",
            backgroundColor: "#f0eeea",
          }}>
            <img
              src={value}
              alt="Cover preview"
              onLoad={onImgLoad}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "auto",
                minHeight: "100px",
                objectFit: effectiveFit,
                objectPosition: "center",
                display: "block",
              }}
              onError={() => { /* ignore broken URLs while typing */ }}
            />
            {/* Remove button */}
            <button
              onClick={() => { onChange(""); setImgSize(null); }}
              style={{
                position: "absolute", top: 8, right: 8,
                width: 28, height: 28, borderRadius: "50%",
                backgroundColor: "rgba(0,0,0,0.6)", border: "none",
                cursor: "pointer", color: "white",
                display: "flex", alignItems: "center", justifyContent: "center",
                zIndex: 2,
              }}
            ><X size={16} /></button>
          </div>

          {/* Dimension badge */}
          {imgSize && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 6 }}>
              <p style={{ fontSize: "0.7rem", color: MUTED, fontFamily: "'Inter', sans-serif", margin: 0 }}>
                Original size: {imgSize.w}×{imgSize.h}px
                {imgSize.w < 1920 && ` · Recommended: 1920×1080 for best quality`}
              </p>
              {imgSize.w >= 1920 && imgSize.h >= 1080 && (
                <span style={{ fontSize: "0.65rem", color: "#3a7a3e", fontFamily: "'Inter', sans-serif", fontWeight: 700, backgroundColor: "rgba(76,140,80,0.1)", padding: "2px 8px", borderRadius: 4 }}>
                  ✓ HD Ready
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
