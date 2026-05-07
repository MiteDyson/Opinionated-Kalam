import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";
import { verifyToken } from "@/lib/verifyToken";

function getArticleModel() {
  if (mongoose.models.Article) return mongoose.models.Article;
  const schema = new mongoose.Schema({
    slug: { type: String, unique: true },
    likes: { type: Number, default: 0 },
    likedBy: [String],
  }, { strict: false });
  return mongoose.model("Article", schema);
}

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const user = await verifyToken(req.headers.get("Authorization"));
    if (!user) return NextResponse.json({ error: "Login required" }, { status: 401 });

    const uid = user.uid;

    await connectDB();
    const Article = getArticleModel();

    const article = await Article.findOne({ slug: String(params.slug) }).lean() as any;
    if (!article) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const likedBy: string[] = article.likedBy ?? [];
    const alreadyLiked = likedBy.includes(uid);

    const updated = await Article.findOneAndUpdate(
      { slug: String(params.slug) },
      alreadyLiked
        ? { $inc: { likes: -1 }, $pull: { likedBy: uid } }
        : { $inc: { likes: 1 }, $push: { likedBy: uid } },
      { returnDocument: 'after' }
    ).lean() as any;

    return NextResponse.json({
      liked: !alreadyLiked,
      likes: updated?.likes ?? 0,
    });
  } catch (err: any) {
    console.error("[POST /api/articles/[slug]/like]", err.message);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
