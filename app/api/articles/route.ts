import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

function getArticleModel() {
  if (mongoose.models.Article) return mongoose.models.Article;
  const schema = new mongoose.Schema({
    title:       { type: String, required: true },
    slug:        { type: String, required: true, unique: true },
    type:        { type: String, default: "article" },
    excerpt:     { type: String, default: "" },
    content:     { type: String, default: "" },
    coverImage:  { type: String, default: "" },
    author:      { type: String, default: "Vineet Mestry" },
    tags:        [String],
    status:      { type: String, default: "draft" },
    likes:       { type: Number, default: 0 },
    views:       { type: Number, default: 0 },
    readTime:    { type: String, default: "" },
    likedBy:     [String],
    savedBy:     [String],
    audioUrl:    { type: String, default: "" },
    episode:     { type: String, default: "" },
    duration:    { type: String, default: "" },
    publishedAt: { type: Date },
    createdAt:   { type: Date, default: Date.now },
    updatedAt:   { type: Date, default: Date.now },
  });
  return mongoose.model("Article", schema);
}

function decodeToken(token: string) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(
      Buffer.from(parts[1].replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8")
    );
    if (payload.exp * 1000 < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

function calcReadTime(content: string) {
  const words = content.replace(/<[^>]+>/g, "").split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 200))} min read`;
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const Article = getArticleModel();
    const { searchParams } = new URL(req.url);
    const type   = searchParams.get("type");
    const status = searchParams.get("status") ?? "published";
    const tag    = searchParams.get("tag");
    const uid    = searchParams.get("uid");

    // For draft requests, verify admin token
    if (status === "draft") {
      const token = req.headers.get("Authorization")?.replace("Bearer ", "");
      if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      const payload = decodeToken(token);
      if (!payload || payload.email !== ADMIN_EMAIL) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    const query: Record<string, any> = { status };
    if (type) query.type = type;
    if (tag)  query.tags = tag;

    const articles = await Article.find(query).sort({ createdAt: -1 }).lean();
    const result = articles.map((a: any) => ({
      ...a,
      isLiked: uid ? (a.likedBy ?? []).includes(uid) : false,
      isSaved: uid ? (a.savedBy ?? []).includes(uid) : false,
    }));
    return NextResponse.json(result);
  } catch (err: any) {
    console.error("[GET /api/articles]", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = decodeToken(token);
    if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (payload.email !== ADMIN_EMAIL) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    await connectDB();
    const Article = getArticleModel();
    const body = await req.json();

    body.slug = body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Check for slug collision and append timestamp if needed
    const existing = await Article.findOne({ slug: body.slug });
    if (existing) {
      body.slug = `${body.slug}-${Date.now()}`;
    }

    body.publishedAt = body.status === "published" ? new Date() : null;
    body.updatedAt   = new Date();
    if (body.content) body.readTime = calcReadTime(body.content);

    const article = await Article.create(body);
    console.log("[POST /api/articles] Created:", article.slug);
    return NextResponse.json(article, { status: 201 });
  } catch (err: any) {
    console.error("[POST /api/articles] Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
