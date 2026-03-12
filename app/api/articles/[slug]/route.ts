import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Article } from "@/models/Article";
import { auth } from "@/lib/auth";

export async function GET(_: NextRequest, { params }: { params: { slug: string } }) {
  await connectDB();
  const article = await (Article as any).findOneAndUpdate(
    { slug: params.slug },
    { $inc: { views: 1 } },
    { new: true }
  ).lean();
  if (!article) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(article);
}

export async function PATCH(req: NextRequest, { params }: { params: { slug: string } }) {
  const session = await auth();
  if ((session?.user as any)?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  await connectDB();
  const body = await req.json();
  const article = await (Article as any).findOneAndUpdate({ slug: params.slug }, body, { new: true });
  return NextResponse.json(article);
}

export async function DELETE(_: NextRequest, { params }: { params: { slug: string } }) {
  const session = await auth();
  if ((session?.user as any)?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  await connectDB();
  await (Article as any).findOneAndDelete({ slug: params.slug });
  return NextResponse.json({ success: true });
}
