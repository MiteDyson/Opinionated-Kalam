"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import ImageExt from "@tiptap/extension-image";
import { uploadToImageKit } from "@/lib/services/imagekit";
import { auth } from "@/lib/auth/firebase";
import ImageUpload from "@/components/admin/ImageUpload";
import TagSelector from "@/components/admin/TagSelector";
import { useAuth } from "@/context/AuthContext";
import { clientCache } from "@/lib/services/cache";
import ConfirmModal from "@/components/admin/ConfirmModal";
import { Zap } from "lucide-react";

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
  const { user, userName } = useAuth();
  const [title, setTitle]         = useState("");
  const [excerpt, setExcerpt]     = useState("");
  const [coverImage, setCover]    = useState("");
  const [tags, setTags]           = useState<string[]>([]);
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [imgUploading, setImgUploading] = useState(false);
  const [showConfirmPublish, setShowConfirmPublish] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      ImageExt.configure({ allowBase64: true }),
      Placeholder.configure({ placeholder: "Keep it short and punchy — facts, timelines, quick explainers…" }),
    ],
    content: "",
    onUpdate: ({ editor }) => {
      const text = editor.getText();
      setWordCount(text.trim() ? text.trim().split(/\s+/).length : 0);
    },
    editorProps: { attributes: { class: "tiptap-editor" } },
    immediatelyRender: false,
  });
  const addImage = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file"; input.accept = "image/*"; input.multiple = true;
    input.onchange = async () => {
      const files = Array.from(input.files ?? []);
      if (!files.length) return;
      setImgUploading(true);
      try {
        const urls: string[] = [];
        for (const file of files) {
          const url = await uploadToImageKit(file, "shorts");
          urls.push(url);
        }
        if (urls.length) {
          editor?.chain().focus().insertContent(
            urls.map(url => ({ type: "image", attrs: { src: url } }))
          ).run();
        }
      } catch (err: any) { setError("Image upload failed: " + err.message); }
      finally { setImgUploading(false); }
    };
    input.click();
  }, [editor]);

  const readTime = Math.max(1, Math.ceil(wordCount / WPM));

  const handleSave = async () => {
    if (!title.trim()) { setError("Title is required."); return; }
    const content = editor?.getHTML() ?? "";
    if (!content || content === "<p></p>") { setError("Content is required."); return; }

    if (!showConfirmPublish) {
      setShowConfirmPublish(true);
      return;
    }

    setSaving(true); setError("");
    try {
      if (!auth.currentUser) { setError("Not signed in."); setSaving(false); return; }
      const token = await auth.currentUser.getIdToken(true);
      const res = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title, excerpt, content, coverImage, type: "short", tags, status: "published", author: userName || user?.displayName || "Unknown Author", readTime }),
      });
      if (!res.ok) { const d = await res.json(); setError(d.error ?? "Save failed"); return; }
      clientCache.invalidate("fetch:/api/articles");
      window.location.href = "/admin";
    } finally { 
      setSaving(false); 
      setShowConfirmPublish(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: BG, color: TEXT }}>
      <style>{`
        .tiptap-editor { min-height: 300px; padding: 22px 26px; font-family: 'Radley', serif; font-size: 18px; line-height: 1.85; color: ${TEXT}; outline: none; }
        .tiptap-editor p { margin: 0 0 1em; }
        .tiptap-editor h2 { font-family: 'DM Serif Display', serif; font-size: 1.4rem; font-weight: 400; margin: 1.2em 0 0.4em; }
        .tiptap-editor h3 { font-family: 'DM Serif Display', serif; font-size: 1.1rem; font-weight: 400; margin: 1em 0 0.4em; }
        .tiptap-editor ul { list-style: disc; padding-left: 1.5em; margin: 0.5em 0 1em; }
        .tiptap-editor ol { list-style: decimal; padding-left: 1.5em; margin: 0.5em 0 1em; }
        .tiptap-editor blockquote { border-left: 3px solid ${TERRA}; margin: 1.2em 0; padding: 8px 16px; background: rgba(217,35,35,0.06); color: ${MUTED}; font-style: italic; }
        .tiptap-editor strong { font-weight: 700; }
        .tiptap-editor img { max-width: 100%; height: auto; border-radius: 8px; margin: 1.2rem auto; display: block; cursor: pointer; transition: outline 0.15s; }
        .tiptap-editor img.ProseMirror-selectednode { outline: 3px solid ${ACCENT}; outline-offset: 2px; }
        .tiptap-editor p.is-editor-empty:first-child::before { content: attr(data-placeholder); color: #bbb; pointer-events: none; float: left; height: 0; }
      `}</style>

      {/* Top bar */}
      <div style={{ backgroundColor: TEXT, padding: "0 14px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 52, position: "sticky", top: 0, zIndex: 10, gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0, overflow: "hidden" }}>
          <button onClick={() => router.push("/admin/create")} style={{ background: "none", border: "none", color: "#888", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: "0.83rem", fontFamily: "'Inter', sans-serif", flexShrink: 0 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
            Back
          </button>
          <span style={{ color: "rgba(255,255,255,0.12)", flexShrink: 0 }}>|</span>
          <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1rem", color: "white", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", display: "flex", alignItems: "center", gap: 6 }}>
            <Zap size={14} style={{ color: "white" }} /> New Short Read
          </span>
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
          {error && <span style={{ color: "#ff6b6b", fontSize: "0.72rem", fontFamily: "'Inter', sans-serif", maxWidth: 80, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{error}</span>}
          <button onClick={() => router.push("/admin")} disabled={saving} style={{ padding: "0 10px", height: 30, borderRadius: 6, border: "1px solid rgba(255,255,255,0.18)", backgroundColor: "transparent", color: "#ccc", cursor: "pointer", fontSize: "0.75rem", fontWeight: 600, fontFamily: "'Inter', sans-serif", whiteSpace: "nowrap", flexShrink: 0 }}>Cancel</button>
          <button onClick={() => handleSave()} disabled={saving} style={{ padding: "0 12px", height: 30, borderRadius: 6, border: "none", backgroundColor: TERRA, color: TEXT, cursor: "pointer", fontSize: "0.75rem", fontWeight: 700, fontFamily: "'Inter', sans-serif", opacity: saving ? 0.7 : 1, whiteSpace: "nowrap", flexShrink: 0 }}>
            {saving ? "…" : "Publish"}
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 820, margin: "0 auto", padding: "32px 24px", display: "flex", flexDirection: "column", gap: 22 }}>

        {/* Tip banner */}
        <div style={{ padding: "10px 14px", backgroundColor: "rgba(217,35,35,0.08)", borderRadius: 8, border: "1px solid rgba(217,35,35,0.2)", fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", color: "#D92323" }}>
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
              <TBtn onClick={imgUploading ? () => {} : addImage} active={imgUploading} title={imgUploading ? "Uploading…" : "Add image"}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              </TBtn>
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

      <ConfirmModal
        isOpen={showConfirmPublish}
        onClose={() => setShowConfirmPublish(false)}
        onConfirm={() => handleSave()}
        title="Publish Short Read"
        message="Ready to publish this short read? It will be live instantly."
        confirmText="Publish"
        type="publish"
        isLoading={saving}
      />
    </div>
  );
}
