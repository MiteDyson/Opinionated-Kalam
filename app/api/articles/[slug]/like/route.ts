import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Article } from "@/models/Article";
import { adminAuth } from "@/lib/firebaseAdmin";

export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ error: "Login required" }, { status: 401 });
    const decoded = await adminAuth.verifyIdToken(token);
    const uid = decoded.uid;

    await connectDB();

    // Use Firebase UID stored in a simple likes collection approach
    // Store liked slugs array on article's likedBy field
    const article = await (Article as any).findOne({ slug: params.slug });
    if (!article) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const likedBy: string[] = article.likedBy ?? [];
    const alreadyLiked = likedBy.includes(uid);

    await (Article as any).findOneAndUpdate(
      { slug: params.slug },
      alreadyLiked
        ? { $inc: { likes: -1 }, $pull: { likedBy: uid } }
        : { $inc: { likes: 1 },  $push: { likedBy: uid } }
    );

    return NextResponse.json({ liked: !alreadyLiked });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
