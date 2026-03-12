import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Article } from "@/models/Article";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const type   = searchParams.get("type") ?? "article";
  const status = searchParams.get("status") ?? "published";
  const articles = await (Article as any).find({ type, status }).sort({ publishedAt: -1 }).lean();
  return NextResponse.json(articles);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if ((session?.user as any)?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  await connectDB();
  const body = await req.json();
  // Auto-generate slug
  body.slug = body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  body.publishedAt = body.status === "published" ? new Date() : null;
  const article = await (Article as any).create(body);
  return NextResponse.json(article, { status: 201 });
}
