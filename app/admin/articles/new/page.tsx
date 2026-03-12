"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const ACCENT  = "#1B2A47";
const SURFACE = "#1a1a1a";

const ALL_TAGS = ["Automotive", "Geo Politics", "Scandals", "Crime", "Explainers", "India", "Economy", "Science", "Technology", "Culture"];

/* ── Quill editor — loaded from CDN, no npm install needed ── */
function QuillEditor({ onChange }: { onChange: (html: string) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const quillRef     = useRef<any>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Load Quill CSS
    if (!document.getElementById("quill-css")) {
      const link = document.createElement("link");
      link.id   = "quill-css";
      link.rel  = "stylesheet";
      link.href = "https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.snow.css";
      document.head.appendChild(link);
    }

    // Load Quill JS
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.js";
    script.async = true;
    script.onload = () => setReady(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (!ready || !containerRef.current || quillRef.current) return;

    const Quill = (window as any).Quill;
    if (!Quill) return;

    quillRef.current = new Quill(containerRef.current, {
      theme: "snow",
      placeholder: "Write your article content here...",
      modules: {
        toolbar: [
          [{ header: [2, 3, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["blockquote", "code-block"],
          ["link", "image"],
          [{ align: [] }],
          ["clean"],
        ],
      },
    });

    // Emit HTML on every change
    quillRef.current.on("text-change", () => {
      const html = quillRef.current.root.innerHTML;
      onChange(html === "<p><br></p>" ? "" : html);
    });

    // Handle image — base64 embed (no upload server needed)
    const toolbar = quillRef.current.getModule("toolbar");
    toolbar.addHandler("image", () => {
      const input = document.createElement("input");
      input.setAttribute("type", "file");
      input.setAttribute("accept", "image/*");
      input.click();
      input.onchange = () => {
        const file = input.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64 = e.target?.result as string;
          const range = quillRef.current.getSelection(true);
          quillRef.current.insertEmbed(range.index, "image", base64);
          quillRef.current.setSelection(range.index + 1);
        };
        reader.readAsDataURL(file);
      };
    });
  }, [ready, onChange]);

  return (
    <>
      <style>{`
        /* Dark theme for Quill */
        .ql-toolbar.ql-snow {
          background: #1e1e1e !important;
          border-color: rgba(255,255,255,0.1) !important;
          border-radius: 8px 8px 0 0;
        }
        .ql-toolbar.ql-snow .ql-stroke { stroke: #aaa !important; }
        .ql-toolbar.ql-snow .ql-fill  { fill: #aaa !important; }
        .ql-toolbar.ql-snow .ql-picker-label { color: #aaa !important; }
        .ql-toolbar.ql-snow button:hover .ql-stroke,
        .ql-toolbar.ql-snow button.ql-active .ql-stroke { stroke: white !important; }
        .ql-toolbar.ql-snow button:hover .ql-fill,
        .ql-toolbar.ql-snow button.ql-active .ql-fill  { fill: white !important; }
        .ql-toolbar.ql-snow .ql-picker-options {
          background: #2a2a2a !important;
          border-color: rgba(255,255,255,0.1) !important;
        }
        .ql-toolbar.ql-snow .ql-picker-item { color: #ccc !important; }
        .ql-container.ql-snow {
          background: #111 !important;
          border-color: rgba(255,255,255,0.1) !important;
          border-radius: 0 0 8px 8px;
          min-height: 340px;
        }
        .ql-editor {
          color: #e8e8e8 !important;
          font-family: 'Inter', sans-serif !important;
          font-size: 0.95rem !important;
          line-height: 1.8 !important;
          min-height: 340px;
        }
        .ql-editor.ql-blank::before {
          color: #444 !important;
          font-style: normal !important;
        }
        .ql-editor h2 { font-family: 'DM Serif Display', serif !important; color: white !important; }
        .ql-editor h3 { color: white !important; }
        .ql-editor blockquote {
          border-left: 4px solid #d38b88 !important;
          color: #aaa !important;
        }
        .ql-editor img { max-width: 100%; border-radius: 6px; margin: 12px 0; }
        .ql-snow .ql-tooltip { background: #2a2a2a !important; border-color: rgba(255,255,255,0.1) !important; color: #ccc !important; }
        .ql-snow .ql-tooltip input[type=text] { background: #111 !important; color: #e8e8e8 !important; border-color: rgba(255,255,255,0.2) !important; }
      `}</style>

      {!ready && (
        <div style={{
          minHeight: 340, backgroundColor: "#111", borderRadius: 8,
          border: "1px solid rgba(255,255,255,0.1)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#555", fontFamily: "'Inter', sans-serif", fontSize: "0.85rem",
        }}>
          Loading editor...
        </div>
      )}

      <div style={{ display: ready ? "block" : "none" }}>
        <div ref={containerRef} />
      </div>
    </>
  );
}

/* ── Main page ── */
export default function NewArticlePage() {
  const router = useRouter();
  const [title, setTitle]       = useState("");
  const [excerpt, setExcerpt]   = useState("");
  const [content, setContent]   = useState("");
  const [coverImage, setCover]  = useState("");
  const [type, setType]         = useState<"article" | "short" | "podcast">("article");
  const [status, setStatus]     = useState<"draft" | "published">("draft");
  const [selectedTags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
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
    if (!title.trim())   { setError("Title is required"); return; }
    if (!content.trim()) { setError("Content is required"); return; }
    setSaving(true); setError("");
    const res = await fetch("/api/articles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title, excerpt, content, coverImage, type,
        tags: selectedTags,
        status: publishNow ? "published" : status,
        author: "Vineet Mestry",
      }),
    });
    setSaving(false);
    if (!res.ok) { const d = await res.json(); setError(d.error ?? "Save failed"); return; }
    router.push("/admin");
  };

  const field: React.CSSProperties = {
    width: "100%", padding: "10px 14px", borderRadius: 8,
    border: "1px solid rgba(255,255,255,0.1)", backgroundColor: "#111",
    color: "#e8e8e8", fontSize: "0.9rem", fontFamily: "'Inter', sans-serif", outline: "none",
  };

  const label: React.CSSProperties = {
    display: "block", fontFamily: "'Inter', sans-serif",
    fontSize: "0.8rem", fontWeight: 600, color: "#888",
    textTransform: "uppercase" as const, letterSpacing: "0.05em", marginBottom: 6,
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0f0f0f", color: "#e8e8e8" }}>

      {/* Top bar */}
      <div style={{ backgroundColor: SURFACE, borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button onClick={() => router.push("/admin")} style={{ background: "none", border: "none", color: "#888", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: "0.88rem", fontFamily: "'Inter', sans-serif" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
            Back
          </button>
          <span style={{ color: "rgba(255,255,255,0.15)" }}>|</span>
          <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.3rem", color: "white" }}>New Article</span>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => handleSave(false)} disabled={saving} style={{
            padding: "8px 18px", borderRadius: 7, border: "1px solid rgba(255,255,255,0.2)",
            backgroundColor: "transparent", color: "#ccc", cursor: "pointer",
            fontSize: "0.85rem", fontWeight: 600, fontFamily: "'Inter', sans-serif",
          }}>
            Save Draft
          </button>
          <button onClick={() => handleSave(true)} disabled={saving} style={{
            padding: "8px 18px", borderRadius: 7, border: "none",
            backgroundColor: ACCENT, color: "white", cursor: "pointer",
            fontSize: "0.85rem", fontWeight: 600, fontFamily: "'Inter', sans-serif",
            opacity: saving ? 0.7 : 1,
          }}>
            {saving ? "Publishing..." : "Publish"}
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 32px", display: "flex", flexDirection: "column", gap: 28 }}>

        {error && (
          <div style={{ padding: "12px 16px", backgroundColor: "rgba(217,35,35,0.15)", border: "1px solid rgba(217,35,35,0.3)", borderRadius: 8, color: "#ff6b6b", fontSize: "0.88rem", fontFamily: "'Inter', sans-serif" }}>
            {error}
          </div>
        )}

        {/* Type + Status */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <div>
            <span style={label}>Content Type</span>
            <div style={{ display: "flex", gap: 8 }}>
              {(["article", "short", "podcast"] as const).map(t => (
                <button key={t} onClick={() => setType(t)} style={{
                  padding: "8px 16px", borderRadius: 7, cursor: "pointer",
                  border: `1px solid ${type === t ? ACCENT : "rgba(255,255,255,0.12)"}`,
                  backgroundColor: type === t ? ACCENT : "transparent",
                  color: type === t ? "white" : "#888",
                  fontSize: "0.82rem", fontWeight: 600, fontFamily: "'Inter', sans-serif",
                  textTransform: "capitalize",
                }}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <span style={label}>Status</span>
            <div style={{ display: "flex", gap: 8 }}>
              {(["draft", "published"] as const).map(s => (
                <button key={s} onClick={() => setStatus(s)} style={{
                  padding: "8px 16px", borderRadius: 7, cursor: "pointer",
                  border: `1px solid ${status === s ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.12)"}`,
                  backgroundColor: status === s ? "rgba(255,255,255,0.1)" : "transparent",
                  color: status === s ? "white" : "#888",
                  fontSize: "0.82rem", fontWeight: 600, fontFamily: "'Inter', sans-serif",
                  textTransform: "capitalize",
                }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Title */}
        <div>
          <span style={label}>Title *</span>
          <input value={title} onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter article title..."
            style={{ ...field, fontSize: "1.4rem", padding: "12px 16px", fontFamily: "'DM Serif Display', serif" }}
          />
        </div>

        {/* Excerpt */}
        <div>
          <span style={label}>Excerpt / Summary</span>
          <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)}
            placeholder="A short description shown on cards (1–2 sentences)..."
            rows={3} style={{ ...field, resize: "vertical" }}
          />
        </div>

        {/* Cover Image */}
        <div>
          <span style={label}>Cover Image URL</span>
          <input value={coverImage} onChange={(e) => setCover(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            style={field}
          />
          {coverImage && (
            <img src={coverImage} alt="preview" style={{ marginTop: 12, width: "100%", aspectRatio: "16/9", objectFit: "cover", borderRadius: 8 }} />
          )}
        </div>

        {/* Tags */}
        <div>
          <span style={label}>Tags (SEO)</span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
            {ALL_TAGS.map(tag => (
              <button key={tag} onClick={() => toggleTag(tag)} style={{
                padding: "5px 12px", borderRadius: 5, cursor: "pointer",
                border: `1px solid ${selectedTags.includes(tag) ? ACCENT : "rgba(255,255,255,0.12)"}`,
                backgroundColor: selectedTags.includes(tag) ? ACCENT : "transparent",
                color: selectedTags.includes(tag) ? "white" : "#888",
                fontSize: "0.78rem", fontWeight: 600, fontFamily: "'Inter', sans-serif",
              }}>
                {tag}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <input value={tagInput} onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCustomTag(); } }}
              placeholder="Add custom tag and press Enter..."
              style={{ ...field, flex: 1 }}
            />
            <button onClick={addCustomTag} style={{
              padding: "10px 16px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.15)",
              backgroundColor: "transparent", color: "#ccc", cursor: "pointer",
              fontSize: "0.85rem", fontFamily: "'Inter', sans-serif",
            }}>
              Add
            </button>
          </div>
          {selectedTags.length > 0 && (
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 10 }}>
              {selectedTags.map(t => (
                <span key={t} style={{
                  display: "inline-flex", alignItems: "center", gap: 5,
                  padding: "3px 10px", borderRadius: 4, backgroundColor: ACCENT,
                  color: "white", fontSize: "0.72rem", fontFamily: "'Inter', sans-serif",
                }}>
                  {t}
                  <button onClick={() => toggleTag(t)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.7)", cursor: "pointer", padding: 0, fontSize: "1rem", lineHeight: 1 }}>×</button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Quill Editor */}
        <div>
          <span style={label}>Content *</span>
          <QuillEditor onChange={setContent} />
          <p style={{ marginTop: 8, fontSize: "0.75rem", color: "#444", fontFamily: "'Inter', sans-serif" }}>
            Use the toolbar to format text, add headings, lists, links, and embed images directly from your device.
          </p>
        </div>

      </div>
    </div>
  );
}
