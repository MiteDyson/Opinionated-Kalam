import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin, getAdminModel } from "@/lib/verifyAdmin";
import { connectDB } from "@/lib/mongodb";

// GET — list all current team members (admins/authors)
export async function GET(req: NextRequest) {
  const admin = await verifyAdmin(req);
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    await connectDB();
    const AdminModel = getAdminModel();
    const admins = await AdminModel.find({}).sort({ addedAt: -1 }).lean();

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
    const { email, name, role } = await req.json();
    if (!email || !name) return NextResponse.json({ error: "Email and Name required" }, { status: 400 });

    await connectDB();
    const AdminModel = getAdminModel();

    // Check if already exists
    const existing = await AdminModel.findOne({ email: email.toLowerCase() });
    if (existing) return NextResponse.json({ error: "Member already exists" }, { status: 400 });

    const newMember = await AdminModel.create({
      email: email.toLowerCase(),
      name,
      role: role || "author",
      addedBy: admin.email,
      addedAt: new Date(),
    });

    return NextResponse.json({
      uid: newMember._id.toString(),
      email: newMember.email,
      name: newMember.name,
      role: newMember.role,
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
    const { uid } = await req.json();
    if (!uid) return NextResponse.json({ error: "UID required" }, { status: 400 });

    await connectDB();
    const AdminModel = getAdminModel();

    const target = await AdminModel.findById(uid);
    if (!target) return NextResponse.json({ error: "Member not found" }, { status: 404 });

    if (target.isMain) return NextResponse.json({ error: "Cannot remove main admin" }, { status: 400 });

    await AdminModel.findByIdAndDelete(uid);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[DELETE /api/admin/users]", err.message);
    return NextResponse.json({ error: "Failed to remove member" }, { status: 500 });
  }
}
