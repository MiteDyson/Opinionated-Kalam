import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/db/mongodb";
import mongoose from "mongoose";
import { verifyAdmin } from "@/lib/auth/verifyAdmin";
import { createArticleSchema, validateBody } from "@/lib/security/validators";
import { sanitizeHtml } from "@/lib/security/sanitize";
import { sendArticleNotification } from "@/lib/services/email";

function getArticleModel() {
  if (mongoose.models.Article) return mongoose.models.Article;
  const schema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    type: { type: String, default: "article" },
    excerpt: { type: String, default: "" },
    content: { type: String, default: "" },
    coverImage: { type: String, default: "" },
    author: { type: String, default: "Author" },
    tags: [String],
    status: { type: String, default: "draft" },
    likes: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    readTime: { type: String, default: "" },
    likedBy: [String],
    savedBy: [String],
    audioUrl: { type: String, default: "" },
    episode: { type: String, default: "" },
    duration: { type: String, default: "" },
    publishedAt: { type: Date },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  });
  schema.index({ status: 1, type: 1, createdAt: -1 });
  schema.index({ tags: 1 });


  return mongoose.model("Article", schema);
}

function calcReadTime(content: string) {
  const words = content.replace(/<[^>]+>/g, "").split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 200))} minute read`;
}

// GET — list articles
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const Article = getArticleModel();
    const { searchParams } = new URL(req.url);
    const all = searchParams.get("all") === "true";
    const uid = String(searchParams.get("uid") || "");
    const status = String(searchParams.get("status") ?? "published");

    // Draft requests require admin auth
    if (status === "draft") {
      const admin = await verifyAdmin(req);
      if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (all) {
      // Fetch all published content in one go
      const items = await Article.find({ status } as any).sort({ createdAt: -1 }).lean();
      const result = items.map((a: any) => ({
        ...a,
        isLiked: uid ? (a.likedBy ?? []).includes(uid) : false,
        isSaved: uid ? (a.savedBy ?? []).includes(uid) : false,
      }));

      const structured = {
        articles: result.filter((a: any) => a.type === "article"),
        podcasts: result.filter((a: any) => a.type === "podcast"),
        shorts: result.filter((a: any) => a.type === "short"),
      };

      const response = NextResponse.json(structured);
      if (status === "published" && !uid) {
        response.headers.set("Cache-Control", "public, s-maxage=60, stale-while-revalidate=120");
      }
      return response;
    }

    const type = searchParams.get("type");
    const tag = searchParams.get("tag");

    const query: Record<string, any> = { status };
    if (type) query.type = String(type);
    if (tag) query.tags = String(tag);

    const articles = await Article.find(query as any).sort({ createdAt: -1 }).lean();

    const result = articles.map((a: any) => ({
      ...a,
      isLiked: uid ? (a.likedBy ?? []).includes(uid) : false,
      isSaved: uid ? (a.savedBy ?? []).includes(uid) : false,
    }));

    const response = NextResponse.json(result);

    // HTTP cache headers — only for public published content without uid
    if (status === "published" && !uid) {
      response.headers.set(
        "Cache-Control",
        "public, s-maxage=120, stale-while-revalidate=300"
      );
    } else {
      response.headers.set("Cache-Control", "private, no-store");
    }

    return response;
  } catch (err: any) {
    console.error("[GET /api/articles]", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST — create article
export async function POST(req: NextRequest) {
  try {
    const admin = await verifyAdmin(req);
    if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const rawBody = await req.json();
    const parsed = validateBody(createArticleSchema, rawBody);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const body = parsed.data as any;

    // Sanitize HTML content before saving to DB
    if (body.content) {
      body.content = sanitizeHtml(body.content);
      body.readTime = calcReadTime(body.content);
    }

    body.slug = body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    await connectDB();
    const Article = getArticleModel();

    const existing = await Article.findOne({ slug: String(body.slug) } as any);
    if (existing) body.slug = `${body.slug}-${Date.now()}`;

    body.publishedAt = body.status === "published" ? new Date() : null;
    body.updatedAt = new Date();

    const article = await Article.create(body);

    if (article.status === "published") {
      sendArticleNotification(article).catch(err => 
        console.error("[POST /api/articles] Notification failed:", err.message)
      );
    }

    revalidatePath("/");
    return NextResponse.json(article, { status: 201 });
  } catch (err: any) {
    console.error("[POST /api/articles]", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
