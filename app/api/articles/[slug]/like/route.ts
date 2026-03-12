import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Article } from "@/models/Article";
import { User } from "@/models/User";
import { auth } from "@/lib/auth";

export async function POST(_: NextRequest, { params }: { params: { slug: string } }) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Login required" }, { status: 401 });
  await connectDB();
  const user = await (User as any).findOne({ email: session.user.email });
  const alreadyLiked = user.likedArticles.includes(params.slug);
  if (alreadyLiked) {
    user.likedArticles.pull(params.slug);
    await (Article as any).findOneAndUpdate({ slug: params.slug }, { $inc: { likes: -1 } });
  } else {
    user.likedArticles.push(params.slug);
    await (Article as any).findOneAndUpdate({ slug: params.slug }, { $inc: { likes: 1 } });
  }
  await user.save();
  return NextResponse.json({ liked: !alreadyLiked });
}
