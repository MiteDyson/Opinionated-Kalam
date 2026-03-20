"use client";

import { useState, useEffect, useCallback } from "react";
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
import TagSelector from "@/components/admin/TagSelector";

const ACCENT = "#1B2A47";
const BG     = "#D5D2CB";
const TERRA  = "#D38B88";
const TEXT   = "#1A1A1A";
const MUTED  = "#555555";
const WPM    = 200;

const ExtendedTextStyle = Mark.create({
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
});

function TBtn({ active, onClick, children, title }: { active?: boolean; onClick: () => void; children: React.ReactNode; title?: string }) {
  return (
    <button title={title} onClick={onClick} style={{
      padding: "5px 7px", borderRadius: 5, border: "none", cursor: "pointer",
      backgroundColor: active ? ACCENT : "transparent", color: active ? "white" : TEXT,
      fontSize: "0.82rem", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center",
      minWidth: 28, height: 28,
    }}
      onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = "#CFCBC3"; }}
      onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
    >{children}</button>
  );
}

function TDivider() { return <div style={{ width: 1, height: 20, backgroundColor: "#CFCBC3", margin: "0 3px" }} />; }

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams();
  const slug   = params?.slug as string;

  const [title, setTitle]         = useState("");
  const [excerpt, setExcerpt]     = useState("");
  const [coverImage, setCover]    = useState("");
  const [type, setType]           = useState<"article" | "short" | "podcast">("article");
  const [status, setStatus]       = useState<"draft" | "published">("draft");
  const [selectedTags, setTags]   = useState<string[]>([]);
  const [tagInput, setTagInput]   = useState("");
  const [audioUrl, setAudioUrl]   = useState("");
  const [episode, setEpisode]     = useState("");
  const [duration, setDuration]   = useState("");
  const [saving, setSaving]       = useState(false);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [coverUploading, setCoverUploading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit, Underline,
      ImageExt.configure({ inline: false, allowBase64: true }),
      LinkExt.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: "Start writing..." }),
      TextAlign.configure({ types: ["heading","paragraph"] }),
      ExtendedTextStyle,
      Highlight.configure({ multicolor: true }),
    ],
    content: "",
    onUpdate: ({ editor }) => {
      const text = editor.getText();
      setWordCount(text.trim() ? text.trim().split(/\s+/).length : 0);
    },
    editorProps: { attributes: { class: "tiptap-editor" } },
  });

  const readTime = Math.max(1, Math.ceil(wordCount / WPM));

  // Load existing article
  useEffect(() => {
    if (!slug || !editor) return;
    const load = async () => {
      try {
        const res = await fetch(`/api/articles/${slug}?status=any`);
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();
        setTitle(data.title ?? "");
        setExcerpt(data.excerpt ?? "");
        setCover(data.coverImage ?? "");
        setType(data.type ?? "article");
        setStatus(data.status ?? "draft");
        setTags(data.tags ?? []);
        setAudioUrl(data.audioUrl ?? "");
        setEpisode(data.episode ?? "");
        setDuration(data.duration ?? "");
        if (data.content) editor.commands.setContent(data.content);
      } catch (e) {
        setError("Failed to load article.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug, editor]);

  const toggleTag = (tag: string) =>
    setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);

  const addCustomTag = () => {
    const t = tagInput.trim();
    if (t && !selectedTags.includes(t)) setTags(prev => [...prev, t]);
    setTagInput("");
  };

  const addImage = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file"; input.accept = "image/*"; input.multiple = true;
    input.onchange = async () => {
      const files = Array.from(input.files ?? []);
      if (!files.length) return;
      try {
        const { uploadToImageKit } = await import("@/lib/imagekit");
        for (const file of files) {
          const url = await uploadToImageKit(file, "articles");
          editor?.chain().focus().setImage({ src: url }).run();
        }
      } catch (err: any) { setError("Image upload failed: " + err.message); }
    };
    input.click();
  }, [editor]);

  const setLink = useCallback(() => {
    const url = window.prompt("Enter URL:");
    if (!url) return;
    editor?.chain().focus().setLink({ href: url }).run();
  }, [editor]);

  const handleSave = async (publishNow = false) => {
    if (!title.trim()) { setError("Title is required."); return; }
    const content = editor?.getHTML() ?? "";
    setSaving(true); setError("");
    try {
      if (!auth.currentUser) { setError("Not signed in."); return; }
      const token = await auth.currentUser.getIdToken(true);
      const res = await fetch(`/api/articles/${slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          title, excerpt, content, coverImage, type, audioUrl, episode, duration,
          tags: selectedTags,
          status: publishNow ? "published" : status,
          readTime: `${readTime} min read`,
          updatedAt: new Date(),
          ...(publishNow ? { publishedAt: new Date() } : {}),
        }),
      });
      if (!res.ok) { const d = await res.json(); setError(d.error ?? "Save failed"); return; }
      router.push("/admin");
    } finally { setSaving(false); }
  };

  const field: React.CSSProperties = {
    width: "100%", padding: "10px 14px", borderRadius: 8,
    border: "1px solid #CFCBC3", backgroundColor: "white",
    color: TEXT, fontSize: "0.9rem", fontFamily: "'Inter', sans-serif",
    outline: "none", boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    display: "block", fontFamily: "'Inter', sans-serif",
    fontSize: "0.75rem", fontWeight: 700, color: MUTED,
    textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 7,
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", backgroundColor: BG, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', sans-serif", color: MUTED }}>
      Loading...
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", backgroundColor: BG, color: TEXT }}>
      <style>{`
        .tiptap-editor { min-height: 480px; padding: 24px 28px; font-family: 'Inter', sans-serif; font-size: 1rem; line-height: 1.85; color: ${TEXT}; outline: none; }
        .tiptap-editor p { margin: 0 0 1em; }
        .tiptap-editor h2 { font-family: 'DM Serif Display', serif; font-size: 1.6rem; font-weight: 400; color: ${TEXT}; margin: 1.4em 0 0.5em; }
        .tiptap-editor h3 { font-family: 'DM Serif Display', serif; font-size: 1.2rem; font-weight: 400; color: ${TEXT}; margin: 1.2em 0 0.4em; }
        .tiptap-editor ul, .tiptap-editor ol { padding-left: 1.5em; margin: 0.5em 0 1em; }
        .tiptap-editor blockquote { border-left: 3px solid ${TERRA}; margin: 1.5em 0; padding: 8px 20px; background: rgba(211,139,136,0.06); color: ${MUTED}; font-style: italic; border-radius: 0 6px 6px 0; }
        .tiptap-editor img { max-width: 100%; border-radius: 8px; margin: 16px 0; display: block; }
        .tiptap-editor a { color: ${ACCENT}; }
        .tiptap-editor hr { border: none; border-top: 1px solid #CFCBC3; margin: 2em 0; }
        .tiptap-editor p.is-editor-empty:first-child::before { content: attr(data-placeholder); color: #bbb; pointer-events: none; float: left; height: 0; }
      `}</style>

      {/* Top bar */}
      <div style={{ backgroundColor: TEXT, padding: "14px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button onClick={() => router.push("/admin")} style={{ background: "none", border: "none", color: "#888", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: "0.85rem", fontFamily: "'Inter', sans-serif" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
            Back
          </button>
          <span style={{ color: "rgba(255,255,255,0.2)" }}>|</span>
          <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.2rem", color: "white" }}>Edit {type === "podcast" ? "Podcast" : type === "short" ? "Short Read" : "Article"}</span>
          {wordCount > 0 && (
            <span style={{ fontSize: "0.75rem", color: "#888", fontFamily: "'Inter', sans-serif", backgroundColor: "rgba(255,255,255,0.07)", padding: "3px 10px", borderRadius: 20 }}>
              {wordCount.toLocaleString()} words · {readTime} min read
            </span>
          )}
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {error && <span style={{ color: "#ff6b6b", fontSize: "0.8rem", fontFamily: "'Inter', sans-serif" }}>{error}</span>}
          <button onClick={() => handleSave(false)} disabled={saving} style={{ padding: "8px 18px", borderRadius: 7, border: "1px solid rgba(255,255,255,0.2)", backgroundColor: "transparent", color: "#ccc", cursor: "pointer", fontSize: "0.83rem", fontWeight: 600, fontFamily: "'Inter', sans-serif" }}>
            Save Draft
          </button>
          <button onClick={() => handleSave(true)} disabled={saving} style={{ padding: "8px 20px", borderRadius: 7, border: "none", backgroundColor: TERRA, color: TEXT, cursor: "pointer", fontSize: "0.83rem", fontWeight: 700, fontFamily: "'Inter', sans-serif", opacity: saving ? 0.7 : 1 }}>
            {saving ? "Saving..." : "Publish"}
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "40px 24px", display: "flex", flexDirection: "column", gap: 24 }}>

        {/* Type toggle */}
        <div style={{ display: "flex", gap: 0, backgroundColor: "white", borderRadius: 10, padding: 4, border: "1px solid #CFCBC3", width: "fit-content" }}>
          {(["article","short","podcast"] as const).map(t => (
            <button key={t} onClick={() => setType(t)} style={{ padding: "7px 18px", borderRadius: 7, border: "none", cursor: "pointer", backgroundColor: type===t ? ACCENT : "transparent", color: type===t ? "white" : MUTED, fontSize: "0.83rem", fontWeight: 600, fontFamily: "'Inter', sans-serif", transition: "all 0.15s" }}>
              {t === "article" ? "Article" : t === "short" ? "Short Read" : "Podcast"}
            </button>
          ))}
        </div>

        {/* Title */}
        <div>
          <label style={labelStyle}>Title *</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title..."
            style={{ ...field, fontSize: "1.6rem", fontFamily: "'DM Serif Display', serif", fontWeight: 400 }} />
        </div>

        {/* Excerpt */}
        <div>
          <label style={labelStyle}>Excerpt</label>
          <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Short summary..." rows={2} style={{ ...field, resize: "vertical", lineHeight: 1.6 }} />
        </div>

        {/* Cover image */}
        <div>
          <label style={labelStyle}>Cover Image</label>
          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <input value={coverImage} onChange={(e) => setCover(e.target.value)} placeholder="Paste URL or upload..." style={{ ...field, flex: 1 }} />
            <label style={{ padding: "10px 16px", borderRadius: 8, border: "1px solid #CFCBC3", backgroundColor: "white", cursor: coverUploading ? "not-allowed" : "pointer", fontSize: "0.83rem", fontFamily: "'Inter', sans-serif", color: TEXT, whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 6 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              {coverUploading ? "Uploading..." : "Upload"}
              <input type="file" accept="image/*" style={{ display: "none" }} onChange={async (e) => {
                const file = e.target.files?.[0]; if (!file) return;
                setCoverUploading(true);
                try { const { uploadToImageKit } = await import("@/lib/imagekit"); const url = await uploadToImageKit(file,"covers"); setCover(url); }
                catch (err: any) { setError("Upload failed: " + err.message); }
                finally { setCoverUploading(false); }
              }} />
            </label>
          </div>
          {coverImage && <img src={coverImage} alt="preview" style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", borderRadius: 8, border: "1px solid #CFCBC3" }} />}
        </div>

        {/* Podcast fields */}
        {type === "podcast" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={labelStyle}>Episode</label>
                <input value={episode} onChange={(e) => setEpisode(e.target.value)} placeholder="EP01" style={field} />
              </div>
              <div>
                <label style={labelStyle}>Duration <span style={{ fontSize: "0.7rem", color: "#aaa", fontWeight: 400 }}>(auto-detected)</span></label>
                <input value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="Auto-detected..." style={{ ...field, color: duration ? TEXT : "#aaa" }} />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Audio File</label>
              <input value={audioUrl} onChange={(e) => setAudioUrl(e.target.value)} placeholder="Paste archive.org URL..." style={field} />
              {audioUrl && (
                <audio controls src={audioUrl} style={{ width: "100%", borderRadius: 8, marginTop: 8 }}
                  onLoadedMetadata={(e) => {
                    const secs = Math.floor((e.target as HTMLAudioElement).duration);
                    if (!isNaN(secs) && secs > 0) {
                      const m = Math.floor(secs/60);
                      const s = (secs%60).toString().padStart(2,"0");
                      setDuration(`${m}:${s}`);
                    }
                  }}
                />
              )}
            </div>
          </>
        )}

        {/* Tags */}
        <TagSelector selectedTags={selectedTags} onToggle={toggleTag} onAdd={addCustomTag} tagInput={tagInput} setTagInput={setTagInput} />

        {/* Content editor (not for podcasts) */}
        {type !== "podcast" && (
          <div>
            <label style={labelStyle}>Content</label>
            <div style={{ backgroundColor: "white", borderRadius: 10, border: "1px solid #CFCBC3", overflow: "visible" }}>
              {/* Toolbar */}
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 2, padding: "7px 10px", borderBottom: "1px solid #CFCBC3", backgroundColor: "#faf9f7", borderRadius: "10px 10px 0 0" }}>
                <TBtn onClick={() => editor?.chain().focus().toggleBold().run()} active={editor?.isActive("bold")} title="Bold"><b>B</b></TBtn>
                <TBtn onClick={() => editor?.chain().focus().toggleItalic().run()} active={editor?.isActive("italic")} title="Italic"><i>I</i></TBtn>
                <TBtn onClick={() => editor?.chain().focus().toggleUnderline().run()} active={editor?.isActive("underline")} title="Underline"><u>U</u></TBtn>
                <TBtn onClick={() => editor?.chain().focus().toggleStrike().run()} active={editor?.isActive("strike")} title="Strike"><s>S</s></TBtn>
                <TDivider />
                <TBtn onClick={() => editor?.chain().focus().toggleHeading({level:2}).run()} active={editor?.isActive("heading",{level:2})} title="H2">H2</TBtn>
                <TBtn onClick={() => editor?.chain().focus().toggleHeading({level:3}).run()} active={editor?.isActive("heading",{level:3})} title="H3">H3</TBtn>
                <TDivider />
                <TBtn onClick={() => editor?.chain().focus().toggleBulletList().run()} active={editor?.isActive("bulletList")} title="Bullet list">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/><line x1="9" y1="18" x2="20" y2="18"/><circle cx="4" cy="6" r="1.5" fill="currentColor" stroke="none"/><circle cx="4" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="4" cy="18" r="1.5" fill="currentColor" stroke="none"/></svg>
                </TBtn>
                <TBtn onClick={() => editor?.chain().focus().toggleOrderedList().run()} active={editor?.isActive("orderedList")} title="Numbered">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/></svg>
                </TBtn>
                <TDivider />
                <TBtn onClick={() => editor?.chain().focus().toggleBlockquote().run()} active={editor?.isActive("blockquote")} title="Blockquote">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1zm12 0c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>
                </TBtn>
                <TBtn onClick={() => editor?.chain().focus().setHorizontalRule().run()} title="Divider">—</TBtn>
                <TDivider />
                <TBtn onClick={setLink} active={editor?.isActive("link")} title="Link">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                </TBtn>
                <TBtn onClick={addImage} title="Image">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                </TBtn>
                <TDivider />
                <TBtn onClick={() => editor?.chain().focus().clearNodes().unsetAllMarks().run()} title="Clear formatting">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </TBtn>
                <TBtn onClick={() => editor?.chain().focus().undo().run()} title="Undo">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 0 0-4-4H4"/></svg>
                </TBtn>
                <TBtn onClick={() => editor?.chain().focus().redo().run()} title="Redo">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 14 20 9 15 4"/><path d="M4 20v-7a4 4 0 0 1 4-4h12"/></svg>
                </TBtn>
              </div>
              <EditorContent editor={editor} />
              <div style={{ borderTop: "1px solid #CFCBC3", padding: "8px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#faf9f7", borderRadius: "0 0 10px 10px" }}>
                <span style={{ fontSize: "0.75rem", color: "#aaa", fontFamily: "'Inter', sans-serif" }}>{wordCount > 0 ? `${wordCount.toLocaleString()} words` : "Start writing..."}</span>
                {wordCount > 0 && <span style={{ fontSize: "0.72rem", fontFamily: "'Inter', sans-serif", color: "white", backgroundColor: ACCENT, padding: "2px 10px", borderRadius: 20, fontWeight: 600 }}>{readTime} min read</span>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
