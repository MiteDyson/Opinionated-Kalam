import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin, getAdminModel, isMainAdmin } from "@/lib/verifyAdmin";
import { connectDB } from "@/lib/mongodb";

// GET — list all admins (main admin only)
export async function GET(req: NextRequest) {
  const admin = await verifyAdmin(req);
  if (!admin || !admin.isMain) {
    return NextResponse.json({ error: "Forbidden — main admin only" }, { status: 403 });
  }

  await connectDB();
  const Admin = getAdminModel();
  const admins = await Admin.find({}).sort({ addedAt: -1 }).lean();
  return NextResponse.json(admins);
}

// POST — add a new admin (main admin only)
export async function POST(req: NextRequest) {
  const admin = await verifyAdmin(req);
  if (!admin || !admin.isMain) {
    return NextResponse.json({ error: "Forbidden — main admin only" }, { status: 403 });
  }

  const { email, name, role } = await req.json();
  if (!email || !name) {
    return NextResponse.json({ error: "Email and name are required" }, { status: 400 });
  }

  const normalizedEmail = email.toLowerCase().trim();

  // Can't add the main admin (they always exist)
  if (await isMainAdmin(normalizedEmail)) {
    return NextResponse.json({ error: "Cannot add main admin through this panel" }, { status: 400 });
  }

  await connectDB();
  const Admin = getAdminModel();

  const existing = await Admin.findOne({ email: normalizedEmail });
  if (existing) {
    return NextResponse.json({ error: "This email already has admin access" }, { status: 409 });
  }

  const record = await Admin.create({
    email: normalizedEmail,
    name: name.trim(),
    role: role ?? "author",
    addedBy: admin.email,
    isMain: false,
  });

  return NextResponse.json(record, { status: 201 });
}

// DELETE — remove an admin (main admin only)
export async function DELETE(req: NextRequest) {
  const admin = await verifyAdmin(req);
  if (!admin || !admin.isMain) {
    return NextResponse.json({ error: "Forbidden — main admin only" }, { status: 403 });
  }

  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

  if (await isMainAdmin(email)) {
    return NextResponse.json({ error: "Cannot remove the main admin" }, { status: 400 });
  }

  await connectDB();
  const Admin = getAdminModel();
  await Admin.findOneAndDelete({ email: email.toLowerCase() });
  return NextResponse.json({ success: true });
}
