import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";

function getArticleModel() {
  if (mongoose.models.Article) return mongoose.models.Article;
  const schema = new mongoose.Schema({
    slug: { type: String, unique: true },
    savedBy: [String],
  }, { strict: false });
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

// GET /api/saved — returns all articles saved by the logged-in user
export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ error: "Login required" }, { status: 401 });

    const payload = decodeToken(token);
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const uid = payload.user_id ?? payload.sub ?? payload.uid;
    if (!uid) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    await connectDB();
    const Article = getArticleModel();

    const saved = await Article.find({
      savedBy: uid,
      status: "published",
    })
      .sort({ publishedAt: -1 })
      .select("slug title excerpt coverImage author type tags readTime duration publishedAt likes")
      .lean();

    return NextResponse.json(saved);
  } catch (err: any) {
    console.error("[GET /api/saved]", err.message);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
