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

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ error: "Login required" }, { status: 401 });

    const payload = decodeToken(token);
    if (!payload) return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });

    const uid = payload.user_id ?? payload.sub ?? payload.uid;
    if (!uid) return NextResponse.json({ error: "Invalid token: no uid" }, { status: 401 });

    await connectDB();
    const Article = getArticleModel();

    const article = await Article.findOne({ slug: params.slug }).lean() as any;
    if (!article) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const savedBy: string[] = article.savedBy ?? [];
    const alreadySaved = savedBy.includes(uid);

    await Article.findOneAndUpdate(
      { slug: params.slug },
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
