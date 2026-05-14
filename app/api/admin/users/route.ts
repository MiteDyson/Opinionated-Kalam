import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin, getAdminModel } from "@/lib/auth/verifyAdmin";
import { connectDB } from "@/lib/db/mongodb";
import { addTeamMemberSchema, removeTeamMemberSchema, validateBody } from "@/lib/security/validators";

// GET — list all current team members (admins/authors)
export async function GET(req: NextRequest) {
  const admin = await verifyAdmin(req);
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    await connectDB();
    const AdminModel = getAdminModel();
    const admins = await AdminModel.find({} as any).sort({ addedAt: -1 }).lean();

    const result = admins.map((a: any) => ({
      uid: a._id.toString(),
      email: a.email,
      name: a.name,
      role: a.role,
      addedAt: a.addedAt,
      isMain: a.isMain,
    }));

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("[GET /api/admin/users]", err.message);
    return NextResponse.json({ error: "Failed to fetch team members" }, { status: 500 });
  }
}

// POST — add a new team member
export async function POST(req: NextRequest) {
  const admin = await verifyAdmin(req);
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (!admin.isMain) return NextResponse.json({ error: "Only main admin can add members" }, { status: 403 });

  try {
    const rawBody = await req.json();
    const parsed = validateBody(addTeamMemberSchema, rawBody);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const { email, name, role } = parsed.data;

    await connectDB();
    const AdminModel = getAdminModel();

    // Check if already exists
    const existing = await AdminModel.findOne({ email } as any);
    if (existing) return NextResponse.json({ error: "Member already exists" }, { status: 400 });

    const newMember = await AdminModel.create({
      email,
      name,
      role: role || "author",
      addedBy: admin.email,
      addedAt: new Date(),
    });

    return NextResponse.json({
      uid: (newMember as any)._id.toString(),
      email: (newMember as any).email,
      name: (newMember as any).name,
      role: (newMember as any).role,
    });
  } catch (err: any) {
    console.error("[POST /api/admin/users]", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE — remove a member
export async function DELETE(req: NextRequest) {
  const admin = await verifyAdmin(req);
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (!admin.isMain) return NextResponse.json({ error: "Only main admin can remove members" }, { status: 403 });

  try {
    const rawBody = await req.json();
    const parsed = validateBody(removeTeamMemberSchema, rawBody);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const { uid } = parsed.data;

    await connectDB();
    const AdminModel = getAdminModel();

    const target = await (AdminModel as any).findById(String(uid));
    if (!target) return NextResponse.json({ error: "Member not found" }, { status: 404 });

    if (target.isMain) return NextResponse.json({ error: "Cannot remove main admin" }, { status: 400 });

    await (AdminModel as any).findByIdAndDelete(String(uid));
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[DELETE /api/admin/users]", err.message);
    return NextResponse.json({ error: "Failed to remove member" }, { status: 500 });
  }
}
