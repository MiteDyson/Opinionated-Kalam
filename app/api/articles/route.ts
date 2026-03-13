import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Article } from "@/models/Article";
import { verifyAdmin } from "@/lib/verifyAdmin";

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
  const admin = await verifyAdmin(req);
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  await connectDB();
  const body = await req.json();
  const article = await (Article as any).findOneAndUpdate({ slug: params.slug }, body, { new: true });
  return NextResponse.json(article);
}

export async function DELETE(req: NextRequest, { params }: { params: { slug: string } }) {
  const admin = await verifyAdmin(req);
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  await connectDB();
  await (Article as any).findOneAndDelete({ slug: params.slug });
  return NextResponse.json({ success: true });
}
