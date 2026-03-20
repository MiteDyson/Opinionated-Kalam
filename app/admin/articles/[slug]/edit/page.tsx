"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageExt from "@tiptap/extension-image";
import LinkExt from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { Mark, mergeAttributes } from "@tiptap/core";
import Highlight from "@tiptap/extension-highlight";
import { auth } from "@/lib/firebase";
import { uploadToImageKit } from "@/lib/imagekit";

const ACCENT = "#1B2A47";
const BG     = "#D5D2CB";
const TERRA  = "#D38B88";
const TEXT   = "#1A1A1A";
const MUTED  = "#555555";
const WPM    = 200;
const PRESET_TAGS = ["Automotive","Geo Politics","Scandals","Crime","Explainers"];

function TBtn({ active, onClick, children, title }: { active?: boolean; onClick: () => void; children: React.ReactNode; title?: string }) {
  return (
    <button title={title} onClick={onClick} style={{ padding: "5px 7px", borderRadius: 5, border: "none", cursor: "pointer", backgroundColor: active ? ACCENT : "transparent", color: active ? "white" : TEXT, fontSize: "0.82rem", fontFamily: "'Inter', sans-serif", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", minWidth: 28, height: 28, transition: "background 0.12s" }}
      onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = "#CFCBC3"; }}
      onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
    >{children}</button>
  );
}
function TDivider() { return <div style={{ width: 1, height: 20, backgroundColor: "#CFCBC3", margin: "0 3px", flexShrink: 0 }} />; }

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams();
  const slug   = params?.slug as string;

  const [title, setTitle]         = useState("");
  const [excerpt, setExcerpt]     = useState("");
  const [coverImage, setCover]    = useState("");
  const [selectedTags, setTags]   = useState<string[]>([]);
  const [tagInput, setTagInput]   = useState("");
  const [saving, setSaving]       = useState(false);
  const [loadingArticle, setLoadingArticle] = useState(true);
  const [error, setError]         = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [imgUploading, setImgUploading] = useState(false);
  const [articleStatus, setArticleStatus] = useState("draft");

  const editor = useEditor({
    extensions: [
      StarterKit, Underline,
      ImageExt.configure({ inline: false, allowBase64: true }),
      LinkExt.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: "Start writing..." }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Mark.create({
        name: "textStyle",
        addAttributes() {
          return {
            color:      { default: null, parseHTML: el => el.style.color || null,      renderHTML: a => a.color      ? { style: `color: ${a.color}` }           : {} },
            fontSize:   { default: null, parseHTML: el => el.style.fontSize || null,   renderHTML: a => a.fontSize   ? { style: `font-size: ${a.fontSize}` }     : {} },
            fontFamily: { default: null, parseHTML: el => el.style.fontFamily || null, renderHTML: a => a.fontFamily ? { style: `font-family: ${a.fontFamily}` } : {} },
          };
        },
        parseHTML() { return [{ tag: "span" }]; },
        renderHTML({ HTMLAttributes }) { return ["span", mergeAttributes(HTMLAttributes), 0]; },
      }),
      Highlight.configure({ multicolor: true }),
    ],
    content: "",
    onUpdate: ({ editor }) => {
      const text = editor.getText();
      setWordCount(text.trim() ? text.trim().split(/\s+/).length : 0);
    },
    editorProps: { attributes: { class: "tiptap-editor" } },
  });

  useEffect(() => {
    if (!slug || !editor) return;
    const load = async () => {
      try {
        const token = await auth.currentUser?.getIdToken();
        const res = await fetch(`/api/articles/${slug}`, { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) throw new Error("Article not found");
        const data = await res.json();
        setTitle(data.title ?? "");
        setExcerpt(data.excerpt ?? "");
        setCover(data.coverImage ?? "");
        setTags(data.tags ?? []);
        setArticleStatus(data.status ?? "draft");
        if (data.content) editor.commands.setContent(data.content);
      } catch (e: any) {
        setError("Failed to load: " + e.message);
      } finally {
        setLoadingArticle(false);
      }
    };
    load();
  }, [slug, editor]);

  const readTime = Math.max(1, Math.ceil(wordCount / WPM));

  const addImage = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file"; input.accept = "image/*"; input.multiple = true;
    input.onchange = async () => {
      const files = Array.from(input.files ?? []);
      if (!files.length) return;
      setImgUploading(true);
      try {
        for (const file of files) {
          const url = await uploadToImageKit(file, "articles");
          editor?.chain().focus().setImage({ src: url }).run();
        }
      } catch (err: any) { setError("Image upload failed: " + err.message); }
      finally { setImgUploading(false); }
    };
    input.click();
  }, [editor]);

  const setLink = useCallback(() => {
    const url = window.prompt("Enter URL:");
    if (!url) return;
    editor?.chain().focus().setLink({ href: url }).run();
  }, [editor]);

  const toggleTag    = (tag: string) => setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  const addCustomTag = () => { const t = tagInput.trim(); if (t && !selectedTags.includes(t)) setTags(prev => [...prev, t]); setTagInput(""); };

  const handleSave = async (publish?: boolean) => {
    if (!title.trim()) { setError("Title is required."); return; }
    const content = editor?.getHTML() ?? "";
    if (!content || content === "<p></p>") { setError("Content is required."); return; }
    setSaving(true); setError("");
    try {
      const token = await auth.currentUser?.getIdToken(true);
      const newStatus = publish !== undefined ? (publish ? "published" : "draft") : articleStatus;
      const res = await fetch(`/api/articles/${slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          title, excerpt, content, coverImage, tags: selectedTags,
          status: newStatus,
          publishedAt: newStatus === "published" ? new Date() : null,
          readTime,
        }),
      });
      if (!res.ok) { const d = await res.json(); setError(d.error ?? "Save failed"); return; }
      setArticleStatus(newStatus);
      router.push("/admin");
    } finally { setSaving(false); }
  };

  const field: React.CSSProperties = { width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #CFCBC3", backgroundColor: "white", color: TEXT, fontSize: "0.9rem", fontFamily: "'Inter', sans-serif", outline: "none", boxSizing: "border-box" };
  const labelStyle: React.CSSProperties = { display: "block", fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 7 };

  if (loadingArticle) return (
    <div style={{ minHeight: "100vh", backgroundColor: BG, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', sans-serif", color: MUTED }}>
      Loading article...
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", backgroundColor: BG, color: TEXT }}>
      <style>{`
        .tiptap-editor { min-height: 480px; padding: 24px 28px; font-family: 'Inter', sans-serif; font-size: 1rem; line-height: 1.85; color: ${TEXT}; outline: none; }
        .tiptap-editor p { margin: 0 0 1em; }
        .tiptap-editor h2 { font-family: 'DM Serif Display', serif; font-size: 1.6rem; font-weight: 400; margin: 1.4em 0 0.5em; }
        .tiptap-editor h3 { font-family: 'DM Serif Display', serif; font-size: 1.2rem; font-weight: 400; margin: 1.2em 0 0.4em; }
        .tiptap-editor ul, .tiptap-editor ol { padding-left: 1.5em; margin: 0.5em 0 1em; }
        .tiptap-editor blockquote { border-left: 3px solid ${TERRA}; margin: 1.5em 0; padding: 8px 20px; background: rgba(211,139,136,0.06); color: ${MUTED}; font-style: italic; }
        .tiptap-editor img { max-width: 100%; border-radius: 8px; margin: 16px 0; display: block; }
        .tiptap-editor a { color: ${ACCENT}; text-decoration: underline; }
        .tiptap-editor p.is-editor-empty:first-child::before { content: attr(data-placeholder); color: #bbb; pointer-events: none; float: left; height: 0; }
      `}</style>

      {/* Top bar */}
      <div style={{ backgroundColor: TEXT, padding: "14px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button onClick={() => router.push("/admin")} style={{ background: "none", border: "none", color: "#888", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: "0.85rem", fontFamily: "'Inter', sans-serif" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
            Back
          </button>
          <span style={{ color: "rgba(255,255,255,0.15)" }}>|</span>
          <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.2rem", color: "white" }}>Edit Article</span>
          <span style={{ fontSize: "0.72rem", padding: "2px 8px", borderRadius: 4, backgroundColor: articleStatus === "published" ? "rgba(76,140,80,0.2)" : "rgba(255,200,0,0.2)", color: articleStatus === "published" ? "#3a7a3e" : "#8a6a00", fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>
            {articleStatus}
          </span>
          {wordCount > 0 && <span style={{ fontSize: "0.75rem", color: "#888", fontFamily: "'Inter', sans-serif", backgroundColor: "rgba(255,255,255,0.07)", padding: "3px 10px", borderRadius: 20 }}>{wordCount.toLocaleString()} words · {readTime} min read</span>}
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {error && <span style={{ color: "#ff6b6b", fontSize: "0.8rem", fontFamily: "'Inter', sans-serif" }}>{error}</span>}
          <button onClick={() => handleSave(false)} disabled={saving} style={{ padding: "8px 18px", borderRadius: 7, border: "1px solid rgba(255,255,255,0.2)", backgroundColor: "transparent", color: "#ccc", cursor: "pointer", fontSize: "0.83rem", fontWeight: 600, fontFamily: "'Inter', sans-serif" }}>
            Save Draft
          </button>
          <button onClick={() => handleSave()} disabled={saving} style={{ padding: "8px 18px", borderRadius: 7, border: "1px solid rgba(255,255,255,0.2)", backgroundColor: "transparent", color: "#ccc", cursor: "pointer", fontSize: "0.83rem", fontWeight: 600, fontFamily: "'Inter', sans-serif" }}>
            Save
          </button>
          <button onClick={() => handleSave(true)} disabled={saving} style={{ padding: "8px 20px", borderRadius: 7, border: "none", backgroundColor: TERRA, color: TEXT, cursor: "pointer", fontSize: "0.83rem", fontWeight: 700, fontFamily: "'Inter', sans-serif", opacity: saving ? 0.7 : 1 }}>
            {saving ? "Saving..." : articleStatus === "published" ? "Update" : "Publish"}
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "40px 24px", display: "flex", flexDirection: "column", gap: 24 }}>

        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Article title..."
          style={{ width: "100%", fontSize: "1.9rem", padding: "14px 0", fontFamily: "'DM Serif Display', serif", border: "none", borderBottom: "2px solid #CFCBC3", borderRadius: 0, backgroundColor: "transparent", color: TEXT, outline: "none", boxSizing: "border-box", fontWeight: 400 }}
        />

        <div>
          <label style={labelStyle}>Excerpt</label>
          <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="A short summary..." rows={2} style={{ ...field, resize: "vertical", lineHeight: 1.6 }} />
        </div>

        <div>
          <label style={labelStyle}>Cover Image URL</label>
          <input value={coverImage} onChange={(e) => setCover(e.target.value)} placeholder="https://..." style={field} />
          {coverImage && <img src={coverImage} alt="preview" style={{ marginTop: 10, width: "100%", aspectRatio: "16/9", objectFit: "cover", borderRadius: 8, border: "1px solid #CFCBC3" }} />}
        </div>

        <div>
          <label style={labelStyle}>Tags</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 10 }}>
            {PRESET_TAGS.map(tag => {
              const active = selectedTags.includes(tag);
              return (
                <button key={tag} onClick={() => toggleTag(tag)} style={{ padding: "5px 12px", borderRadius: 20, cursor: "pointer", border: `1.5px solid ${active ? ACCENT : "#CFCBC3"}`, backgroundColor: active ? ACCENT : "white", color: active ? "white" : MUTED, fontSize: "0.78rem", fontWeight: 600, fontFamily: "'Inter', sans-serif", display: "flex", alignItems: "center", gap: 6, transition: "all 0.15s" }}>
                  {tag}{active && <span style={{ fontSize: "0.85rem", opacity: 0.7 }}>×</span>}
                </button>
              );
            })}
            {selectedTags.filter(t => !PRESET_TAGS.includes(t)).map(tag => (
              <button key={tag} onClick={() => toggleTag(tag)} style={{ padding: "5px 12px", borderRadius: 20, cursor: "pointer", border: `1.5px solid ${TERRA}`, backgroundColor: TERRA, color: TEXT, fontSize: "0.78rem", fontWeight: 600, fontFamily: "'Inter', sans-serif", display: "flex", alignItems: "center", gap: 6 }}>
                {tag}<span style={{ fontSize: "0.85rem", opacity: 0.7 }}>×</span>
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCustomTag(); } }} placeholder="Add custom tag..." style={{ flex: 1, padding: "8px 14px", borderRadius: 8, border: "1px solid #CFCBC3", backgroundColor: "white", color: TEXT, fontSize: "0.85rem", fontFamily: "'Inter', sans-serif", outline: "none" }} />
            <button onClick={addCustomTag} style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #CFCBC3", backgroundColor: "white", color: TEXT, cursor: "pointer", fontSize: "0.83rem", fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>Add</button>
          </div>
        </div>

        <div>
          <label style={labelStyle}>Content</label>
          <div style={{ backgroundColor: "white", borderRadius: 10, border: "1px solid #CFCBC3" }}>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 2, padding: "7px 10px", borderBottom: "1px solid #CFCBC3", backgroundColor: "#faf9f7", borderRadius: "10px 10px 0 0" }}>
              <TBtn onClick={() => editor?.chain().focus().toggleBold().run()}      active={editor?.isActive("bold")}      title="Bold"><b>B</b></TBtn>
              <TBtn onClick={() => editor?.chain().focus().toggleItalic().run()}    active={editor?.isActive("italic")}    title="Italic"><i>I</i></TBtn>
              <TBtn onClick={() => editor?.chain().focus().toggleUnderline().run()} active={editor?.isActive("underline")} title="Underline"><u>U</u></TBtn>
              <TDivider />
              <TBtn onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} active={editor?.isActive("heading", { level: 2 })} title="H2">H2</TBtn>
              <TBtn onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()} active={editor?.isActive("heading", { level: 3 })} title="H3">H3</TBtn>
              <TDivider />
              <TBtn onClick={() => editor?.chain().focus().toggleBulletList().run()}  active={editor?.isActive("bulletList")}  title="Bullet list">• List</TBtn>
              <TBtn onClick={() => editor?.chain().focus().toggleOrderedList().run()} active={editor?.isActive("orderedList")} title="Numbered">1. List</TBtn>
              <TDivider />
              <TBtn onClick={() => editor?.chain().focus().toggleBlockquote().run()} active={editor?.isActive("blockquote")} title="Quote">"</TBtn>
              <TBtn onClick={setLink} active={editor?.isActive("link")} title="Link"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg></TBtn>
              <TBtn onClick={imgUploading ? () => {} : addImage} title="Image"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></TBtn>
              <TDivider />
              <TBtn onClick={() => editor?.chain().focus().undo().run()} title="Undo"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 0 0-4-4H4"/></svg></TBtn>
              <TBtn onClick={() => editor?.chain().focus().redo().run()} title="Redo"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 14 20 9 15 4"/><path d="M4 20v-7a4 4 0 0 1 4-4h12"/></svg></TBtn>
            </div>
            <EditorContent editor={editor} />
            <div style={{ borderTop: "1px solid #CFCBC3", padding: "8px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#faf9f7", borderRadius: "0 0 10px 10px" }}>
              <span style={{ fontSize: "0.75rem", color: "#aaa", fontFamily: "'Inter', sans-serif" }}>{wordCount > 0 ? `${wordCount.toLocaleString()} words` : "Start writing..."}</span>
              {wordCount > 0 && <span style={{ fontSize: "0.72rem", fontFamily: "'Inter', sans-serif", color: "white", backgroundColor: ACCENT, padding: "2px 10px", borderRadius: 20, fontWeight: 600 }}>{readTime} min read</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
