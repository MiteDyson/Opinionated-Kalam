import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/db/mongodb";
import mongoose from "mongoose";
import { verifyAdmin } from "@/lib/auth/verifyAdmin";
import { updateArticleSchema, validateBody } from "@/lib/security/validators";
import { sanitizeHtml } from "@/lib/security/sanitize";
import { sendArticleNotification } from "@/lib/services/email";

function getArticleModel() {
  if (mongoose.models.Article) return mongoose.models.Article;
  const schema = new mongoose.Schema({
    title: String, slug: { type: String, unique: true },
    type: { type: String, default: "article" },
    excerpt: { type: String, default: "" },
    content: { type: String, default: "" },
    coverImage: { type: String, default: "" },
    author: String, tags: [String], status: { type: String, default: "draft" },
    likes: { type: Number, default: 0 }, views: { type: Number, default: 0 },
    readTime: { type: String, default: "" },
    likedBy: [String], savedBy: [String],
    audioUrl: String, episode: String, duration: String,
    publishedAt: Date,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  });
  return mongoose.model("Article", schema);
}

// GET /api/articles/[slug]
// Published articles cached at CDN for 2 min; uid-scoped skips CDN
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    await connectDB();
    const Article = getArticleModel();
    const { searchParams } = new URL(req.url);
    const uid = searchParams.get("uid") ?? "";

    const article = await Article.findOne({ slug: String(slug) } as any).lean() as any;
    if (!article) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const body = {
      ...article,
      isLiked: uid ? (article.likedBy ?? []).includes(uid) : false,
      isSaved: uid ? (article.savedBy ?? []).includes(uid) : false,
    };

    const res = NextResponse.json(body);

    // Cache public published articles for 2 min at CDN
    if (article.status === "published" && !uid) {
      res.headers.set("Cache-Control", "public, s-maxage=120, stale-while-revalidate=300");
    } else {
      res.headers.set("Cache-Control", "private, no-store");
    }

    return res;
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PATCH /api/articles/[slug]
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const admin = await verifyAdmin(req);
    if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const rawBody = await req.json();
    const parsed = validateBody(updateArticleSchema, rawBody);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const body = parsed.data as any;

    // Sanitize HTML content and calculate read time before saving
    if (body.content) {
      body.content = sanitizeHtml(body.content);
      const words = body.content.replace(/<[^>]+>/g, "").split(/\s+/).filter(Boolean).length;
      body.readTime = `${Math.max(1, Math.ceil(words / 200))} minute read`;
    }

    await connectDB();
    const Article = getArticleModel();

    // Fetch original article to detect draft -> published transition
    const originalArticle = await Article.findOne({ slug: String(slug) } as any).lean() as any;

    const article = await Article.findOneAndUpdate(
      { slug: String(slug) } as any,
      { ...body, updatedAt: new Date() },
      { new: true } as any
    ).lean() as any;

    if (article && originalArticle && originalArticle.status === "draft" && article.status === "published") {
      sendArticleNotification(article).catch(err => 
        console.error("[PATCH /api/articles/[slug]] Notification failed:", err.message)
      );
    }

    revalidatePath("/");
    return NextResponse.json(article);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE /api/articles/[slug]
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const admin = await verifyAdmin(req);
    if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    if (!admin.isMain && admin.role !== "admin") {
      return NextResponse.json({ error: "Forbidden — admin role required" }, { status: 403 });
    }
    await connectDB();
    const Article = getArticleModel();
    await Article.findOneAndDelete({ slug: String(slug) } as any);
    revalidatePath("/");
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
