import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";

function getArticleModel() {
  if (mongoose.models.Article) return mongoose.models.Article;
  const schema = new mongoose.Schema({
    title: String, slug: { type: String, unique: true },
    type: { type: String, default: "article" },
    excerpt: { type: String, default: "" },
    content: { type: String, default: "" },
    coverImage: { type: String, default: "" },
    author: String, tags: [String], status: { type: String, default: "draft" },
    likes: { type: Number, default: 0 }, views: { type: Number, default: 0 },
    readTime: { type: String, default: "" },
    likedBy: [String], savedBy: [String],
    audioUrl: String, episode: String, duration: String,
    publishedAt: Date, createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
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
  } catch { return null; }
}

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    await connectDB();
    const Article = getArticleModel();
    const { searchParams } = new URL(req.url);
    const uid = searchParams.get("uid") ?? "";

    const article = await Article.findOneAndUpdate(
      { slug: params.slug },  // allow draft loading for admin edit
      { $inc: { views: 1 } },
      { new: true }
    ).lean() as any;

    if (!article) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({
      ...article,
      isLiked: uid ? (article.likedBy ?? []).includes(uid) : false,
      isSaved: uid ? (article.savedBy ?? []).includes(uid) : false,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = decodeToken(token);
    if (!payload || payload.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    await connectDB();
    const Article = getArticleModel();
    const body = await req.json();
    const article = await Article.findOneAndUpdate({ slug: params.slug }, body, { new: true });
    return NextResponse.json(article);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = decodeToken(token);
    if (!payload || payload.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    await connectDB();
    const Article = getArticleModel();
    await Article.findOneAndDelete({ slug: params.slug });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
