import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { auth } from "@/lib/auth";

export async function POST(_: NextRequest, { params }: { params: { slug: string } }) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Login required" }, { status: 401 });
  await connectDB();
  const user = await (User as any).findOne({ email: session.user.email });
  const alreadySaved = user.savedArticles.includes(params.slug);
  if (alreadySaved) {
    user.savedArticles.pull(params.slug);
  } else {
    user.savedArticles.push(params.slug);
  }
  await user.save();
  return NextResponse.json({ saved: !alreadySaved });
}
