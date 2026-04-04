import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";
import { verifyAdmin } from "@/lib/verifyAdmin";

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

// GET — fetch article WITHOUT incrementing views (views are tracked via POST /view)
export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    await connectDB();
    const Article = getArticleModel();
    const { searchParams } = new URL(req.url);
    const uid = searchParams.get("uid") ?? "";

    // Fetch WITHOUT view increment — views are counted by POST /api/articles/[slug]/view
    const article = await Article.findOne({ slug: params.slug }).lean() as any;

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

// PATCH — allow main admin OR any team admin
export async function PATCH(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const admin = await verifyAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    await connectDB();
    const Article = getArticleModel();
    const body = await req.json();
    const article = await Article.findOneAndUpdate(
      { slug: params.slug },
      { ...body, updatedAt: new Date() },
      { new: true }
    );
    return NextResponse.json(article);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE — allow main admin OR any team admin with admin role
export async function DELETE(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const admin = await verifyAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    // Only main admin or team admins (not just authors) can delete
    if (!admin.isMain && admin.role !== "admin") {
      return NextResponse.json({ error: "Forbidden — admin role required to delete" }, { status: 403 });
    }
    await connectDB();
    const Article = getArticleModel();
    await Article.findOneAndDelete({ slug: params.slug });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
