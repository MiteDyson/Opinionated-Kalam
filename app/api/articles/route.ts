import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Article } from "@/models/Article";

const ADMIN_EMAIL = "opinionatedkalam@gmail.com";

function decodeToken(token: string) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(
      Buffer.from(parts[1].replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8")
    );
    if (payload.exp * 1000 < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

function calcReadTime(content: string) {
  const words = content.replace(/<[^>]+>/g, "").split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 200))} min read`;
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const type   = searchParams.get("type");
    const status = searchParams.get("status") ?? "published";
    const tag    = searchParams.get("tag");
    const uid    = searchParams.get("uid");

    const query: Record<string, any> = { status };
    if (type) query.type = type;
    if (tag)  query.tags = tag;

    const articles = await (Article as any).find(query).sort({ publishedAt: -1 }).lean();
    const result = articles.map((a: any) => ({
      ...a,
      isLiked: uid ? (a.likedBy ?? []).includes(uid) : false,
      isSaved: uid ? (a.savedBy ?? []).includes(uid) : false,
    }));
    return NextResponse.json(result);
  } catch (err: any) {
    console.error("[GET /api/articles]", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = decodeToken(token);
    if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (payload.email !== ADMIN_EMAIL) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    await connectDB();
    const body = await req.json();

    body.slug = body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    body.publishedAt = body.status === "published" ? new Date() : null;
    body.updatedAt   = new Date();
    if (body.content) body.readTime = calcReadTime(body.content);

    const article = await (Article as any).create(body);
    console.log("[POST /api/articles] Created:", article.slug);
    return NextResponse.json(article, { status: 201 });
  } catch (err: any) {
    console.error("[POST /api/articles] Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}