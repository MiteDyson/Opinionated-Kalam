import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";

function getArticleModel() {
  if (mongoose.models.Article) return mongoose.models.Article;
  const schema = new mongoose.Schema({ slug: { type: String, unique: true }, views: { type: Number, default: 0 } }, { strict: false });
  return mongoose.model("Article", schema);
}

function getViewLogModel() {
  if (mongoose.models.ViewLog) return mongoose.models.ViewLog;
  const schema = new mongoose.Schema({
    uid:      { type: String, required: true },
    slug:     { type: String, required: true },
    viewedAt: { type: Date, default: Date.now },
  });
  schema.index({ uid: 1, slug: 1 }, { unique: true });
  return mongoose.model("ViewLog", schema);
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

export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    // Only logged-in users count
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) {
      // Not logged in — return current views without incrementing
      await connectDB();
      const Article = getArticleModel();
      const article = await Article.findOne({ slug: params.slug }).lean() as any;
      return NextResponse.json({ views: article?.views ?? 0, isNew: false });
    }

    const payload = decodeToken(token);
    if (!payload) {
      await connectDB();
      const Article = getArticleModel();
      const article = await Article.findOne({ slug: params.slug }).lean() as any;
      return NextResponse.json({ views: article?.views ?? 0, isNew: false });
    }

    const uid = payload.user_id ?? payload.sub ?? payload.uid;
    if (!uid) {
      return NextResponse.json({ views: 0, isNew: false });
    }

    await connectDB();
    const Article  = getArticleModel();
    const ViewLog  = getViewLogModel();

    // Try inserting view log — fails silently if already exists (duplicate key)
    let isNew = false;
    try {
      await ViewLog.create({ uid, slug: params.slug });
      isNew = true;
    } catch (err: any) {
      if (err.code !== 11000) throw err;
    }

    let currentViews = 0;
    if (isNew) {
      const updated = await Article.findOneAndUpdate(
        { slug: params.slug },
        { $inc: { views: 1 } },
        { returnDocument: 'after' }
      ).lean() as any;
      currentViews = updated?.views ?? 0;
    } else {
      const article = await Article.findOne({ slug: params.slug }).lean() as any;
      currentViews = article?.views ?? 0;
    }

    return NextResponse.json({ views: currentViews, isNew });
  } catch (err: any) {
    console.error("[POST /api/articles/[slug]/view]", err.message);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
