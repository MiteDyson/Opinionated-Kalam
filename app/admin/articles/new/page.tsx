"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
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
import ImageUpload from "@/components/admin/ImageUpload";
import AudioUpload from "@/components/admin/AudioUpload";
import TagSelector from "@/components/admin/TagSelector";

const ACCENT = "#1B2A47";
const BG     = "#D5D2CB";
const TERRA  = "#D38B88";
const TEXT   = "#1A1A1A";
const MUTED  = "#555555";
const WPM    = 200;

const FONT_SIZES    = ["12","14","16","18","20","24","28","32","36","48"];
const FONT_FAMILIES = [
  { label: "Default (Inter)",  value: "Inter, sans-serif" },
  { label: "DM Serif",         value: "'DM Serif Display', serif" },
  { label: "Georgia",          value: "Georgia, serif" },
  { label: "Times New Roman",  value: "'Times New Roman', serif" },
  { label: "Courier New",      value: "'Courier New', monospace" },
  { label: "Arial",            value: "Arial, sans-serif" },
];
const TEXT_COLORS      = ["#1A1A1A","#D92323","#1B2A47","#D38B88","#555555","#3a7a3e","#8a6a00","#ffffff"];
const HIGHLIGHT_COLORS = ["#FFF3CD","#D1ECF1","#D4EDDA","#F8D7DA","#E2E3E5","#FFE0F0","#D5D2CB"];

function TBtn({ active, onClick, children, title }: { active?: boolean; onClick: () => void; children: React.ReactNode; title?: string }) {
  return (
    <button title={title} onClick={onClick}
      style={{ padding: "5px 7px", borderRadius: 5, border: "none", cursor: "pointer", backgroundColor: active ? ACCENT : "transparent", color: active ? "white" : TEXT, fontSize: "0.82rem", fontFamily: "'Inter', sans-serif", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", minWidth: 28, height: 28, transition: "background 0.12s" }}
      onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = "#CFCBC3"; }}
      onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
    >{children}</button>
  );
}
function TDivider() { return <div style={{ width: 1, height: 20, backgroundColor: "#CFCBC3", margin: "0 3px", flexShrink: 0 }} />; }

function ColorPicker({ colors, onSelect, label, currentColor }: { colors: string[]; onSelect: (c: string) => void; label: string; currentColor?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <button title={label} onClick={() => setOpen(o => !o)}
        style={{ padding: "5px 7px", borderRadius: 5, border: "none", cursor: "pointer", backgroundColor: "transparent", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, minWidth: 28, height: 28, transition: "background 0.12s" }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#CFCBC3")}
        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")}
      >
        <span style={{ fontSize: "0.82rem", fontWeight: 700, color: TEXT, lineHeight: 1 }}>A</span>
        <div style={{ width: 16, height: 3, borderRadius: 2, backgroundColor: currentColor ?? TEXT }} />
      </button>
      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, zIndex: 50, backgroundColor: "white", borderRadius: 8, padding: 8, border: "1px solid #CFCBC3", boxShadow: "0 4px 16px rgba(0,0,0,0.1)", display: "flex", flexWrap: "wrap", gap: 4, width: 130 }}>
          {colors.map(c => <button key={c} title={c} onClick={() => { onSelect(c); setOpen(false); }} style={{ width: 22, height: 22, borderRadius: 4, border: c === "#ffffff" ? "1px solid #CFCBC3" : "none", backgroundColor: c, cursor: "pointer", outline: currentColor === c ? `2px solid ${ACCENT}` : "none", outlineOffset: 1 }} />)}
          <input type="color" title="Custom" onChange={(e) => { onSelect(e.target.value); setOpen(false); }} style={{ width: 22, height: 22, borderRadius: 4, border: "1px solid #CFCBC3", cursor: "pointer", padding: 0 }} />
        </div>
      )}
    </div>
  );
}

function HighlightPicker({ colors, onSelect, label, currentColor }: { colors: string[]; onSelect: (c: string | null) => void; label: string; currentColor?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <button title={label} onClick={() => setOpen(o => !o)}
        style={{ padding: "5px 7px", borderRadius: 5, border: "none", cursor: "pointer", backgroundColor: "transparent", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, minWidth: 28, height: 28, transition: "background 0.12s" }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#CFCBC3")}
        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")}
      >
        <span style={{ fontSize: "0.78rem", fontWeight: 700, color: TEXT, lineHeight: 1 }}>H</span>
        <div style={{ width: 16, height: 3, borderRadius: 2, backgroundColor: currentColor ?? "#FFF3CD" }} />
      </button>
      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, zIndex: 50, backgroundColor: "white", borderRadius: 8, padding: 8, border: "1px solid #CFCBC3", boxShadow: "0 4px 16px rgba(0,0,0,0.1)", display: "flex", flexWrap: "wrap", gap: 4, width: 130 }}>
          {colors.map(c => <button key={c} title={c} onClick={() => { onSelect(c); setOpen(false); }} style={{ width: 22, height: 22, borderRadius: 4, border: "1px solid #CFCBC3", backgroundColor: c, cursor: "pointer", outline: currentColor === c ? `2px solid ${ACCENT}` : "none", outlineOffset: 1 }} />)}
          <button title="Remove" onClick={() => { onSelect(null); setOpen(false); }} style={{ width: 22, height: 22, borderRadius: 4, border: "1px solid #CFCBC3", backgroundColor: "white", cursor: "pointer", fontSize: "0.7rem", color: "#e05555" }}>✕</button>
        </div>
      )}
    </div>
  );
}

function TSelect({ value, onChange, options, width = 90, title }: { value: string; onChange: (v: string) => void; options: { label: string; value: string }[]; width?: number; title?: string }) {
  return (
    <select title={title} value={value} onChange={(e) => onChange(e.target.value)}
      style={{ padding: "3px 6px", borderRadius: 5, border: "1px solid #CFCBC3", backgroundColor: "white", color: TEXT, fontSize: "0.78rem", fontFamily: "'Inter', sans-serif", cursor: "pointer", height: 28, width, outline: "none" }}>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

const field: React.CSSProperties = { width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #CFCBC3", backgroundColor: "white", color: TEXT, fontSize: "0.88rem", fontFamily: "'Inter', sans-serif", outline: "none", boxSizing: "border-box" };
const labelStyle: React.CSSProperties = { display: "block", fontFamily: "'Inter', sans-serif", fontSize: "0.72rem", fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 7 };

export default function NewArticlePage() {
  const router = useRouter();
  const [title, setTitle]         = useState("");
  const [excerpt, setExcerpt]     = useState("");
  const [coverImage, setCover]    = useState("");
  const [audioUrl, setAudioUrl]   = useState("");
  const [audioDuration, setAudioDuration] = useState("");
  const [type, setType]           = useState<"article" | "short">("article");
  const [tags, setTags]           = useState<string[]>([]);
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [imgUploading, setImgUploading] = useState(false);
  const [fontSize, setFontSize]   = useState("16");
  const [fontFamily, setFontFamily] = useState("Inter, sans-serif");
  const [copiedFormat, setCopiedFormat] = useState<Record<string, any> | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      ImageExt.configure({ inline: false, allowBase64: true }),
      LinkExt.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: "Start writing your article here…" }),
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

  const applyFontSize   = (size: string)   => { setFontSize(size);     editor?.chain().focus().setMark("textStyle", { fontSize: `${size}px` }).run(); };
  const applyFontFamily = (family: string) => { setFontFamily(family); editor?.chain().focus().setMark("textStyle", { fontFamily: family }).run(); };

  const copyFormat = () => {
    if (!editor) return;
    const marks: Record<string, any> = {};
    if (editor.isActive("bold"))      marks.bold = true;
    if (editor.isActive("italic"))    marks.italic = true;
    if (editor.isActive("underline")) marks.underline = true;
    if (editor.isActive("textStyle")) marks.textStyle = editor.getAttributes("textStyle");
    if (editor.isActive("highlight")) marks.highlight = editor.getAttributes("highlight");
    setCopiedFormat(marks);
  };

  const pasteFormat = () => {
    if (!editor || !copiedFormat) return;
    const chain = editor.chain().focus();
    if (copiedFormat.bold)      chain.setBold();
    if (copiedFormat.italic)    chain.setItalic();
    if (copiedFormat.underline) chain.setUnderline();
    // if (copiedFormat.textStyle?.color) chain.setColor(copiedFormat.textStyle.color);
    if (copiedFormat.highlight?.color) chain.setHighlight({ color: copiedFormat.highlight.color });
    chain.run(); setCopiedFormat(null);
  };

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
        body: JSON.stringify({
          title, excerpt, content, coverImage, type, tags,
          audioUrl: audioUrl.trim() || undefined,
          duration: audioDuration || undefined,
          status: publishNow ? "published" : "draft",
          author: "Vineet Mestry",
          readTime,
        }),
      });
      if (!res.ok) { const d = await res.json(); setError(d.error ?? "Save failed"); return; }
      router.push("/admin");
    } finally { setSaving(false); }
  };

  const currentTextColor = editor?.getAttributes("textStyle")?.color;
  const currentHighlight = editor?.getAttributes("highlight")?.color;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: BG, color: TEXT }}>
      <style>{`
        .tiptap-editor { min-height: 480px; padding: 24px 28px; font-family: 'Inter', sans-serif; font-size: 1rem; line-height: 1.85; color: ${TEXT}; outline: none; }
        .tiptap-editor p { margin: 0 0 1em; }
        .tiptap-editor h2 { font-family: 'DM Serif Display', serif; font-size: 1.6rem; font-weight: 400; color: ${TEXT}; margin: 1.4em 0 0.5em; }
        .tiptap-editor h3 { font-family: 'DM Serif Display', serif; font-size: 1.2rem; font-weight: 400; color: ${TEXT}; margin: 1.2em 0 0.4em; }
        .tiptap-editor ul, .tiptap-editor ol { padding-left: 1.5em; margin: 0.5em 0 1em; }
        .tiptap-editor li { margin: 0.3em 0; }
        .tiptap-editor blockquote { border-left: 3px solid ${TERRA}; margin: 1.5em 0; padding: 8px 20px; background: rgba(211,139,136,0.06); color: ${MUTED}; font-style: italic; border-radius: 0 6px 6px 0; }
        .tiptap-editor code { background: rgba(27,42,71,0.08); color: ${ACCENT}; padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em; }
        .tiptap-editor pre { background: #1A1A1A; color: #e8e8e8; padding: 16px 20px; border-radius: 8px; overflow-x: auto; margin: 1em 0; }
        .tiptap-editor pre code { background: none; color: inherit; padding: 0; }
        .tiptap-editor img { max-width: 100%; border-radius: 8px; margin: 16px 0; display: block; }
        .tiptap-editor a { color: ${ACCENT}; text-decoration: underline; }
        .tiptap-editor hr { border: none; border-top: 1px solid #CFCBC3; margin: 2em 0; }
        .tiptap-editor p.is-editor-empty:first-child::before { content: attr(data-placeholder); color: #bbb; pointer-events: none; float: left; height: 0; }
      `}</style>

      {/* Top bar — 64px */}
      <div style={{ backgroundColor: TEXT, padding: "0 28px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64, position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button onClick={() => router.push("/admin/create")} style={{ background: "none", border: "none", color: "#888", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: "0.83rem", fontFamily: "'Inter', sans-serif" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
            Back
          </button>
          <span style={{ color: "rgba(255,255,255,0.12)" }}>|</span>
          <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.1rem", color: "white" }}>New Article</span>
          {wordCount > 0 && (
            <span style={{ fontSize: "0.72rem", color: "#888", fontFamily: "'Inter', sans-serif", backgroundColor: "rgba(255,255,255,0.07)", padding: "2px 9px", borderRadius: 20 }}>
              {wordCount.toLocaleString()} words · {readTime} min read
            </span>
          )}
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {error && <span style={{ color: "#ff6b6b", fontSize: "0.78rem", fontFamily: "'Inter', sans-serif", maxWidth: 240 }}>{error}</span>}
          <button onClick={() => handleSave(false)} disabled={saving} style={{ padding: "0 16px", height: 34, borderRadius: 7, border: "1px solid rgba(255,255,255,0.18)", backgroundColor: "transparent", color: "#ccc", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600, fontFamily: "'Inter', sans-serif" }}>Save Draft</button>
          <button onClick={() => handleSave(true)} disabled={saving} style={{ padding: "0 18px", height: 34, borderRadius: 7, border: "none", backgroundColor: TERRA, color: TEXT, cursor: "pointer", fontSize: "0.8rem", fontWeight: 700, fontFamily: "'Inter', sans-serif", opacity: saving ? 0.7 : 1 }}>
            {saving ? "Publishing…" : "Publish"}
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "32px 24px", display: "flex", flexDirection: "column", gap: 22 }}>

        {/* Type toggle */}
        <div style={{ display: "flex", backgroundColor: "white", borderRadius: 8, padding: 3, border: "1px solid #CFCBC3", width: "fit-content" }}>
          {(["article","short"] as const).map(t => (
            <button key={t} onClick={() => setType(t)} style={{ padding: "6px 18px", borderRadius: 6, border: "none", cursor: "pointer", backgroundColor: type === t ? ACCENT : "transparent", color: type === t ? "white" : MUTED, fontSize: "0.8rem", fontWeight: 600, fontFamily: "'Inter', sans-serif", transition: "all 0.14s" }}>
              {t === "article" ? "📄 Article" : "⚡ Short Read"}
            </button>
          ))}
        </div>

        {/* Title */}
        <div>
          <label style={labelStyle}>Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter article title…" style={{ ...field, fontSize: "1.05rem", fontFamily: "'DM Serif Display', serif" }} />
        </div>

        {/* Excerpt */}
        <div>
          <label style={labelStyle}>Excerpt</label>
          <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="A short summary shown on article cards…" rows={2} style={{ ...field, resize: "vertical", lineHeight: 1.6 }} />
        </div>

        {/* Cover image */}
        <ImageUpload value={coverImage} onChange={setCover} label="Cover Image" folder="articles" />

        {/* Audio — "Listen to Article" */}
        <AudioUpload
          value={audioUrl}
          onChange={setAudioUrl}
          onDurationDetected={setAudioDuration}
          label="Audio File"
          folder="audio"
        />

        {/* Tags */}
        <TagSelector selected={tags} onChange={setTags} />

        {/* Full Tiptap Editor */}
        <div>
          <label style={labelStyle}>Content</label>
          <div style={{ backgroundColor: "white", borderRadius: 10, border: "1px solid #CFCBC3", overflow: "visible" }}>

            {/* Toolbar */}
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 2, padding: "7px 10px", borderBottom: "1px solid #CFCBC3", backgroundColor: "#faf9f7", borderRadius: "10px 10px 0 0" }}>
              <TSelect title="Font family" value={fontFamily} onChange={applyFontFamily} width={120} options={FONT_FAMILIES.map(f => ({ label: f.label, value: f.value }))} />
              <TDivider />
              <TSelect title="Font size" value={fontSize} onChange={applyFontSize} width={56} options={FONT_SIZES.map(s => ({ label: s, value: s }))} />
              <TDivider />
              <TBtn onClick={() => editor?.chain().focus().toggleBold().run()}      active={editor?.isActive("bold")}      title="Bold"><b>B</b></TBtn>
              <TBtn onClick={() => editor?.chain().focus().toggleItalic().run()}    active={editor?.isActive("italic")}    title="Italic"><i>I</i></TBtn>
              <TBtn onClick={() => editor?.chain().focus().toggleUnderline().run()} active={editor?.isActive("underline")} title="Underline"><u>U</u></TBtn>
              <TBtn onClick={() => editor?.chain().focus().toggleStrike().run()}    active={editor?.isActive("strike")}    title="Strike"><s>S</s></TBtn>
              <TDivider />
              <ColorPicker colors={TEXT_COLORS} label="Text color" currentColor={currentTextColor} onSelect={(c) => editor?.chain().focus().setMark("textStyle", { color: c }).run()} />
              <HighlightPicker colors={HIGHLIGHT_COLORS} label="Highlight" currentColor={currentHighlight} onSelect={(c) => c ? editor?.chain().focus().setHighlight({ color: c }).run() : editor?.chain().focus().unsetHighlight().run()} />
              <TDivider />
              <TBtn onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} active={editor?.isActive("heading", { level: 2 })} title="Heading 2">H2</TBtn>
              <TBtn onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()} active={editor?.isActive("heading", { level: 3 })} title="Heading 3">H3</TBtn>
              <TDivider />
              <TBtn onClick={() => editor?.chain().focus().setTextAlign("left").run()}   active={editor?.isActive({ textAlign: "left" })}   title="Left"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="18" y2="18"/></svg></TBtn>
              <TBtn onClick={() => editor?.chain().focus().setTextAlign("center").run()} active={editor?.isActive({ textAlign: "center" })} title="Center"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg></TBtn>
              <TBtn onClick={() => editor?.chain().focus().setTextAlign("right").run()}  active={editor?.isActive({ textAlign: "right" })}  title="Right"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="9" y1="12" x2="21" y2="12"/><line x1="6" y1="18" x2="21" y2="18"/></svg></TBtn>
              <TDivider />
              <TBtn onClick={() => editor?.chain().focus().toggleBulletList().run()}  active={editor?.isActive("bulletList")}  title="Bullet list"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/><line x1="9" y1="18" x2="20" y2="18"/><circle cx="4" cy="6" r="1.5" fill="currentColor" stroke="none"/><circle cx="4" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="4" cy="18" r="1.5" fill="currentColor" stroke="none"/></svg></TBtn>
              <TBtn onClick={() => editor?.chain().focus().toggleOrderedList().run()} active={editor?.isActive("orderedList")} title="Numbered list"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/></svg></TBtn>
              <TDivider />
              <TBtn onClick={() => editor?.chain().focus().toggleBlockquote().run()} active={editor?.isActive("blockquote")} title="Blockquote"><svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1zm12 0c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg></TBtn>
              <TBtn onClick={() => editor?.chain().focus().toggleCodeBlock().run()} active={editor?.isActive("codeBlock")} title="Code block"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg></TBtn>
              <TBtn onClick={() => editor?.chain().focus().setHorizontalRule().run()} title="Divider">—</TBtn>
              <TDivider />
              <TBtn onClick={setLink} active={editor?.isActive("link")} title="Add link"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg></TBtn>
              <TBtn onClick={imgUploading ? () => {} : addImage} active={imgUploading} title={imgUploading ? "Uploading…" : "Add image"}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></TBtn>
              <TDivider />
              <TBtn onClick={copiedFormat ? pasteFormat : copyFormat} active={!!copiedFormat} title={copiedFormat ? "Paste formatting" : "Copy formatting"}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg></TBtn>
              <TBtn onClick={() => editor?.chain().focus().clearNodes().unsetAllMarks().run()} title="Clear formatting"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></TBtn>
              <TDivider />
              <TBtn onClick={() => editor?.chain().focus().undo().run()} title="Undo"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 0 0-4-4H4"/></svg></TBtn>
              <TBtn onClick={() => editor?.chain().focus().redo().run()} title="Redo"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 14 20 9 15 4"/><path d="M4 20v-7a4 4 0 0 1 4-4h12"/></svg></TBtn>
            </div>

            <EditorContent editor={editor} />

            <div style={{ borderTop: "1px solid #CFCBC3", padding: "7px 18px", display: "flex", justifyContent: "space-between", backgroundColor: "#faf9f7", borderRadius: "0 0 10px 10px" }}>
              <span style={{ fontSize: "0.72rem", color: "#aaa", fontFamily: "'Inter', sans-serif" }}>{wordCount > 0 ? `${wordCount.toLocaleString()} words` : "Start writing…"}</span>
              {wordCount > 0 && <span style={{ fontSize: "0.7rem", fontFamily: "'Inter', sans-serif", color: "white", backgroundColor: ACCENT, padding: "1px 9px", borderRadius: 20, fontWeight: 600 }}>{readTime} min read</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
