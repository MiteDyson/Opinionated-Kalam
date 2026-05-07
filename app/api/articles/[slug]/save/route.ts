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

    const savedBy: string[] = article.savedBy ?? [];
    const alreadySaved = savedBy.includes(uid);

    await Article.findOneAndUpdate(
      { slug: String(params.slug) },
      alreadySaved
        ? { $pull: { savedBy: uid } }
        : { $push: { savedBy: uid } }
    );

    return NextResponse.json({ saved: !alreadySaved });
  } catch (err: any) {
    console.error("[POST /api/articles/[slug]/save]", err.message);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
