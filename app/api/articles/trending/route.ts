import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import mongoose from "mongoose";

function getArticleModel() {
  if (mongoose.models.Article) return mongoose.models.Article;
  const schema = new mongoose.Schema({
    title: String, slug: { type: String, unique: true },
    type: { type: String, default: "article" },
    status: { type: String, default: "draft" },
    views: { type: Number, default: 0 },
    recentViews: { type: Number, default: 0 }, // views in past 2-3 days
    publishedAt: Date,
    createdAt: { type: Date, default: Date.now },
  }, { strict: false });
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
  schema.index({ viewedAt: -1 });            // trending aggregation window
  schema.index({ slug: 1, viewedAt: -1 });   // per-article view history
  return mongoose.model("ViewLog", schema);
}

/**
 * GET /api/articles/trending
 * Returns articles sorted by views in the past 2-3 days.
 * Falls back to past 7 days if fewer than 5 results in 3-day window.
 * Query params:
 *   - type: "article" | "short" | "podcast" (optional)
 *   - limit: number of results (default 20)
 */
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const Article = getArticleModel();
    const ViewLog = getViewLogModel();

    const { searchParams } = new URL(req.url);
    const type  = searchParams.get("type");
    const limit = parseInt(searchParams.get("limit") ?? "20");

    // Initial window: past 3 days
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    // Aggregate ViewLog to count views per slug in past 3 days
    const recentViewAgg = await ViewLog.aggregate([
      { $match: { viewedAt: { $gte: threeDaysAgo } } },
      { $group: { _id: "$slug", recentViews: { $sum: 1 } } },
      { $sort: { recentViews: -1 } },
    ]);

    let windowUsed = "3days";

    // If fewer than 5 slugs had views in 3 days, expand to 7 days
    let viewAgg = recentViewAgg;
    if (recentViewAgg.length < 5) {
      windowUsed = "7days";
      viewAgg = await ViewLog.aggregate([
        { $match: { viewedAt: { $gte: sevenDaysAgo } } },
        { $group: { _id: "$slug", recentViews: { $sum: 1 } } },
        { $sort: { recentViews: -1 } },
      ]);
    }

    // Build map of slug → recentViews
    const recentViewMap = new Map<string, number>();
    for (const row of viewAgg) {
      recentViewMap.set(row._id, row.recentViews);
    }

    // Fetch all published articles of the requested type
    const query: Record<string, any> = { status: "published" };
    if (type) query.type = type;

    const articles = await Article.find(query as any)
      .select("slug title excerpt coverImage author tags type readTime publishedAt likes views duration episode audioUrl")
      .lean();

    // Score by recent views, then total views as tiebreaker
    const scored = (articles as any[]).map(a => ({
      ...a,
      recentViews: recentViewMap.get(a.slug) ?? 0,
    }));

    scored.sort((a, b) => {
      if (b.recentViews !== a.recentViews) return b.recentViews - a.recentViews;
      return (b.views ?? 0) - (a.views ?? 0);
    });

    const result = scored.slice(0, limit);

    const res = NextResponse.json({ articles: result, windowUsed });
    res.headers.set("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");
    return res;
  } catch (err: any) {
    console.error("[GET /api/articles/trending]", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
