import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";

import { verifyAdmin } from "@/lib/verifyAdmin";

function getArticleModel() {
  if (mongoose.models.Article) return mongoose.models.Article;
  const schema = new mongoose.Schema({
    title: String, slug: { type: String, unique: true },
    type: { type: String, default: "article" },
    status: { type: String, default: "draft" },
    likes: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    publishedAt: Date,
    createdAt: { type: Date, default: Date.now },
  });
  return mongoose.model("Article", schema);
}

export async function GET(req: NextRequest) {
  const admin = await verifyAdmin(req);
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await connectDB();
  const Article = getArticleModel();

  const [total, published, drafts, totals] = await Promise.all([
    Article.countDocuments({}),
    Article.countDocuments({ status: "published" }),
    Article.countDocuments({ status: "draft" }),
    Article.aggregate([{ $group: { _id: null, views: { $sum: "$views" }, likes: { $sum: "$likes" } } }]),
  ]);

  const byType = await Article.aggregate([
    { $group: { _id: "$type", count: { $sum: 1 }, views: { $sum: "$views" } } }
  ]);

  return NextResponse.json({
    total, published, drafts,
    totalViews: totals[0]?.views ?? 0,
    totalLikes: totals[0]?.likes ?? 0,
    byType,
  });
}
