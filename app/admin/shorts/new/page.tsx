"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { auth } from "@/lib/firebase";
import ImageUpload from "@/components/admin/ImageUpload";
import TagSelector from "@/components/admin/TagSelector";

const ACCENT = "#1B2A47";
const BG     = "#D5D2CB";
const TERRA  = "#D38B88";
const TEXT   = "#1A1A1A";
const MUTED  = "#555555";
const WPM    = 200;

function TBtn({ active, onClick, children, title }: { active?: boolean; onClick: () => void; children: React.ReactNode; title?: string }) {
  return (
    <button title={title} onClick={onClick} style={{ padding: "5px 7px", borderRadius: 5, border: "none", cursor: "pointer", backgroundColor: active ? ACCENT : "transparent", color: active ? "white" : TEXT, fontSize: "0.82rem", fontFamily: "'Inter', sans-serif", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", minWidth: 28, height: 28, transition: "background 0.12s" }}
      onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = "#CFCBC3"; }}
      onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
    >{children}</button>
  );
}
function TDivider() { return <div style={{ width: 1, height: 20, backgroundColor: "#CFCBC3", margin: "0 3px", flexShrink: 0 }} />; }

const field: React.CSSProperties = { width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #CFCBC3", backgroundColor: "white", color: TEXT, fontSize: "0.88rem", fontFamily: "'Inter', sans-serif", outline: "none", boxSizing: "border-box" };
const labelStyle: React.CSSProperties = { display: "block", fontFamily: "'Inter', sans-serif", fontSize: "0.72rem", fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 };

export default function NewShortPage() {
  const router = useRouter();
  const [title, setTitle]         = useState("");
  const [excerpt, setExcerpt]     = useState("");
  const [coverImage, setCover]    = useState("");
  const [tags, setTags]           = useState<string[]>([]);
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState("");
  const [wordCount, setWordCount] = useState(0);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: "Keep it short and punchy — facts, timelines, quick explainers…" }),
    ],
    content: "",
    onUpdate: ({ editor }) => {
      const text = editor.getText();
      setWordCount(text.trim() ? text.trim().split(/\s+/).length : 0);
    },
    editorProps: { attributes: { class: "tiptap-editor" } },
  });

  const readTime = Math.max(1, Math.ceil(wordCount / WPM));

  const handleSave = async (publishNow = false) => {
    if (!title.trim()) { setError("Title is required."); return; }
    const content = editor?.getHTML() ?? "";
    if (!content || content === "<p></p>") { setError("Content is required."); return; }
    setSaving(true); setError("");
    try {
      if (!auth.currentUser) { setError("Not signed in."); setSaving(false); return; }
      const token = await auth.currentUser.getIdToken(true);
      const res = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title, excerpt, content, coverImage, type: "short", tags, status: publishNow ? "published" : "draft", author: "Vineet Mestry", readTime }),
      });
      if (!res.ok) { const d = await res.json(); setError(d.error ?? "Save failed"); return; }
      router.push("/admin");
    } finally { setSaving(false); }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: BG, color: TEXT }}>
      <style>{`
        .tiptap-editor { min-height: 300px; padding: 22px 26px; font-family: 'Inter', sans-serif; font-size: 1rem; line-height: 1.85; color: ${TEXT}; outline: none; }
        .tiptap-editor p { margin: 0 0 1em; }
        .tiptap-editor h2 { font-family: 'DM Serif Display', serif; font-size: 1.4rem; font-weight: 400; margin: 1.2em 0 0.4em; }
        .tiptap-editor h3 { font-family: 'DM Serif Display', serif; font-size: 1.1rem; font-weight: 400; margin: 1em 0 0.4em; }
        .tiptap-editor ul, .tiptap-editor ol { padding-left: 1.5em; margin: 0.5em 0 1em; }
        .tiptap-editor blockquote { border-left: 3px solid ${TERRA}; margin: 1.2em 0; padding: 8px 16px; background: rgba(211,139,136,0.06); color: ${MUTED}; font-style: italic; }
        .tiptap-editor strong { font-weight: 700; }
        .tiptap-editor p.is-editor-empty:first-child::before { content: attr(data-placeholder); color: #bbb; pointer-events: none; float: left; height: 0; }
      `}</style>

      {/* Top bar */}
      <div style={{ backgroundColor: TEXT, padding: "0 28px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 52, position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => router.push("/admin/create")} style={{ background: "none", border: "none", color: "#888", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: "0.83rem", fontFamily: "'Inter', sans-serif" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
            Back
          </button>
          <span style={{ color: "rgba(255,255,255,0.12)" }}>|</span>
          <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1rem", color: "white" }}>⚡ New Short Read</span>
          {wordCount > 0 && (
            <span style={{ fontSize: "0.72rem", color: "#888", fontFamily: "'Inter', sans-serif", backgroundColor: "rgba(255,255,255,0.07)", padding: "2px 8px", borderRadius: 20 }}>
              {wordCount.toLocaleString()} words · {readTime} min read
            </span>
          )}
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {error && <span style={{ color: "#ff6b6b", fontSize: "0.78rem", fontFamily: "'Inter', sans-serif" }}>{error}</span>}
          <button onClick={() => handleSave(false)} disabled={saving} style={{ padding: "0 16px", height: 32, borderRadius: 6, border: "1px solid rgba(255,255,255,0.18)", backgroundColor: "transparent", color: "#ccc", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600, fontFamily: "'Inter', sans-serif" }}>Save Draft</button>
          <button onClick={() => handleSave(true)} disabled={saving} style={{ padding: "0 18px", height: 32, borderRadius: 6, border: "none", backgroundColor: TERRA, color: TEXT, cursor: "pointer", fontSize: "0.8rem", fontWeight: 700, fontFamily: "'Inter', sans-serif", opacity: saving ? 0.7 : 1 }}>
            {saving ? "Publishing…" : "Publish"}
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 820, margin: "0 auto", padding: "32px 24px", display: "flex", flexDirection: "column", gap: 22 }}>

        {/* Tip banner */}
        <div style={{ padding: "10px 14px", backgroundColor: "rgba(184,92,88,0.08)", borderRadius: 8, border: "1px solid rgba(184,92,88,0.2)", fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", color: "#b85c58" }}>
          ⚡ Short reads are under 500 words — quick facts, timelines, or micro-explainers
        </div>

        {/* Title */}
        <div>
          <label style={labelStyle}>Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter short read title…" style={{ ...field, fontSize: "1.1rem", fontFamily: "'DM Serif Display', serif" }} />
        </div>

        {/* Excerpt */}
        <div>
          <label style={labelStyle}>Summary</label>
          <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="One sentence hook shown on the card…" rows={2} style={{ ...field, resize: "vertical", lineHeight: 1.6 }} />
        </div>

        {/* Cover image */}
        <ImageUpload value={coverImage} onChange={setCover} label="Cover Image" folder="shorts" />

        {/* Tags */}
        <TagSelector selected={tags} onChange={setTags} />

        {/* Editor */}
        <div>
          <label style={labelStyle}>Content</label>
          <div style={{ backgroundColor: "white", borderRadius: 10, border: "1px solid #CFCBC3" }}>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 2, padding: "6px 10px", borderBottom: "1px solid #CFCBC3", backgroundColor: "#faf9f7", borderRadius: "10px 10px 0 0" }}>
              <TBtn onClick={() => editor?.chain().focus().toggleBold().run()}      active={editor?.isActive("bold")}      title="Bold"><b>B</b></TBtn>
              <TBtn onClick={() => editor?.chain().focus().toggleItalic().run()}    active={editor?.isActive("italic")}    title="Italic"><i>I</i></TBtn>
              <TBtn onClick={() => editor?.chain().focus().toggleStrike().run()}    active={editor?.isActive("strike")}    title="Strike"><s>S</s></TBtn>
              <TDivider />
              <TBtn onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} active={editor?.isActive("heading", { level: 2 })} title="H2">H2</TBtn>
              <TBtn onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()} active={editor?.isActive("heading", { level: 3 })} title="H3">H3</TBtn>
              <TDivider />
              <TBtn onClick={() => editor?.chain().focus().toggleBulletList().run()}  active={editor?.isActive("bulletList")}  title="Bullets">• •</TBtn>
              <TBtn onClick={() => editor?.chain().focus().toggleOrderedList().run()} active={editor?.isActive("orderedList")} title="Numbers">1.</TBtn>
              <TBtn onClick={() => editor?.chain().focus().toggleBlockquote().run()}  active={editor?.isActive("blockquote")}  title="Quote">"</TBtn>
              <TBtn onClick={() => editor?.chain().focus().setHorizontalRule().run()} title="Divider">—</TBtn>
              <TDivider />
              <TBtn onClick={() => editor?.chain().focus().undo().run()} title="Undo"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 0 0-4-4H4"/></svg></TBtn>
              <TBtn onClick={() => editor?.chain().focus().redo().run()} title="Redo"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 14 20 9 15 4"/><path d="M4 20v-7a4 4 0 0 1 4-4h12"/></svg></TBtn>
            </div>
            <EditorContent editor={editor} />
            <div style={{ borderTop: "1px solid #CFCBC3", padding: "7px 18px", display: "flex", justifyContent: "space-between", backgroundColor: "#faf9f7", borderRadius: "0 0 10px 10px" }}>
              <span style={{ fontSize: "0.72rem", color: wordCount > 500 ? "#c0392b" : "#aaa", fontFamily: "'Inter', sans-serif", fontWeight: wordCount > 500 ? 600 : 400 }}>
                {wordCount > 0 ? `${wordCount.toLocaleString()} words${wordCount > 500 ? " (consider trimming!)" : ""}` : "Start writing…"}
              </span>
              {wordCount > 0 && <span style={{ fontSize: "0.7rem", fontFamily: "'Inter', sans-serif", color: "white", backgroundColor: ACCENT, padding: "1px 8px", borderRadius: 20, fontWeight: 600 }}>{readTime} min read</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
