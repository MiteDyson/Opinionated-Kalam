import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin, getAdminModel, isMainAdmin } from "@/lib/auth/verifyAdmin";
import { connectDB } from "@/lib/db/mongodb";
import { addTeamMemberSchema, removeTeamMemberByEmailSchema, updateTeamMemberRoleSchema, validateBody } from "@/lib/security/validators";

// GET — list all admins (main admin only)
export async function GET(req: NextRequest) {
  const admin = await verifyAdmin(req);
  if (!admin || !admin.isMain) {
    return NextResponse.json({ error: "Forbidden — main admin only" }, { status: 403 });
  }

  await connectDB();
  const Admin = getAdminModel();
  const admins = await Admin.find({} as any).sort({ addedAt: -1 }).lean();
  return NextResponse.json(admins);
}

// POST — add a new admin (main admin only)
export async function POST(req: NextRequest) {
  const admin = await verifyAdmin(req);
  if (!admin || !admin.isMain) {
    return NextResponse.json({ error: "Forbidden — main admin only" }, { status: 403 });
  }

  const rawBody = await req.json();
  const parsed = validateBody(addTeamMemberSchema, rawBody);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const { email, name, role } = parsed.data;

  if (await isMainAdmin(email)) {
    return NextResponse.json({ error: "Cannot add main admin through this panel" }, { status: 400 });
  }

  await connectDB();
  const Admin = getAdminModel();

  const existing = await Admin.findOne({ email } as any);
  if (existing) {
    return NextResponse.json({ error: "This email already has admin access" }, { status: 409 });
  }

  const record = await Admin.create({
    email,
    name,
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

  const rawBody = await req.json();
  const parsed = validateBody(removeTeamMemberByEmailSchema, rawBody);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const { email } = parsed.data;

  if (await isMainAdmin(email)) {
    return NextResponse.json({ error: "Cannot remove the main admin" }, { status: 400 });
  }

  await connectDB();
  const Admin = getAdminModel();
  await Admin.findOneAndDelete({ email: email.toLowerCase() } as any);
  return NextResponse.json({ success: true });
}
// PATCH — update admin role (main admin only)
export async function PATCH(req: NextRequest) {
  const admin = await verifyAdmin(req);
  if (!admin || !admin.isMain) {
    return NextResponse.json({ error: "Forbidden — main admin only" }, { status: 403 });
  }

  const rawBody = await req.json();
  const parsed = validateBody(updateTeamMemberRoleSchema, rawBody);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const { email, role } = parsed.data;

  await connectDB();
  const Admin = getAdminModel();
  await Admin.findOneAndUpdate({ email: email.toLowerCase() } as any, { role }, {} as any);
  return NextResponse.json({ success: true });
}
