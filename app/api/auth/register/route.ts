import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db/mongodb";
import { User } from "@/lib/db/User";
import { registerSchema, validateBody } from "@/lib/security/validators";

export async function POST(req: NextRequest) {
  const rawBody = await req.json();
  const parsed = validateBody(registerSchema, rawBody);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const { name, email, password } = parsed.data;

  await connectDB();
  const existing = await (User as any).findOne({ email: String(email) });
  if (existing) return NextResponse.json({ error: "Email already registered" }, { status: 409 });
  const hashed = await bcrypt.hash(password, 12);
  await (User as any).create({ name, email, password: hashed, role: "user" });
  return NextResponse.json({ success: true }, { status: 201 });
}
