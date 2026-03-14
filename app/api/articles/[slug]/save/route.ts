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

    const article = await (Article as any).findOne({ slug: params.slug });
    if (!article) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const savedBy: string[] = article.savedBy ?? [];
    const alreadySaved = savedBy.includes(uid);

    await (Article as any).findOneAndUpdate(
      { slug: params.slug },
      alreadySaved
        ? { $pull: { savedBy: uid } }
        : { $push: { savedBy: uid } }
    );

    return NextResponse.json({ saved: !alreadySaved });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
