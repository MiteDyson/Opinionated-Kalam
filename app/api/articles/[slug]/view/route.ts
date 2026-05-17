import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import mongoose from "mongoose";
import { verifyToken } from "@/lib/auth/verifyToken";

import { Article } from "@/lib/db/Article";

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

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug: rawSlug } = await params;
    const slug = String(rawSlug);

    // Re-enforce logged-in only rule
    const user = await verifyToken(req.headers.get("Authorization"));
    if (!user) {
      await connectDB();
      const article = await Article.findOne({ slug }).lean() as any;
      return NextResponse.json({ views: article?.views ?? 0, isNew: false });
    }

    const uid = user.uid;

    await connectDB();
    const ViewLog  = getViewLogModel();

    // Try inserting view log — fails if already exists
    let isNew = false;
    try {
      await ViewLog.create({ uid, slug });
      isNew = true;
    } catch (err: any) {
      if (err.code !== 11000) throw err;
    }

    let currentViews = 0;
    if (isNew) {
      const updated = await Article.findOneAndUpdate(
        { slug },
        { $inc: { views: 1 } },
        { new: true }
      ).lean() as any;
      currentViews = updated?.views ?? 0;
    } else {
      const article = await Article.findOne({ slug }).lean() as any;
      currentViews = article?.views ?? 0;
    }

    return NextResponse.json({ views: currentViews, isNew });
  } catch (err: any) {
    console.error("[POST /api/articles/[slug]/view]", err.message);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
