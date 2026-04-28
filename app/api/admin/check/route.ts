import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/verifyAdmin";

export async function GET(req: NextRequest) {
  const admin = await verifyAdmin(req);
  if (!admin) {
    return NextResponse.json({ isAdmin: false });
  }
  return NextResponse.json({
    isAdmin: true,
    isMain: admin.isMain,
    role: admin.role,
    email: admin.email,
  });
}
