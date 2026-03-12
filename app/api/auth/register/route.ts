import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";

export async function POST(req: NextRequest) {
  const { name, email, password } = await req.json();
  if (!name || !email || !password) {
    return NextResponse.json({ error: "All fields required" }, { status: 400 });
  }
  await connectDB();
  const existing = await (User as any).findOne({ email });
  if (existing) return NextResponse.json({ error: "Email already registered" }, { status: 409 });
  const hashed = await bcrypt.hash(password, 12);
  await (User as any).create({ name, email, password: hashed, role: "user" });
  return NextResponse.json({ success: true }, { status: 201 });
}
