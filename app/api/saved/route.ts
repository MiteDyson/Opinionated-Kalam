import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";
import { verifyToken } from "@/lib/verifyToken";

function getArticleModel() {
  if (mongoose.models.Article) return mongoose.models.Article;
  const schema = new mongoose.Schema({
    slug: { type: String, unique: true },
    savedBy: [String],
  }, { strict: false });
  return mongoose.model("Article", schema);
}

// GET /api/saved — returns all articles saved by the logged-in user
export async function GET(req: NextRequest) {
  try {
    const user = await verifyToken(req.headers.get("Authorization"));
    if (!user) return NextResponse.json({ error: "Login required" }, { status: 401 });

    const uid = user.uid;

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
