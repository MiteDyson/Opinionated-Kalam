import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/verifyAdmin";
import { adminAuth, adminDB } from "@/lib/firebaseAdmin";

// GET — list all current admins
export async function GET(req: NextRequest) {
  const admin = await verifyAdmin(req);
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const snapshot = await adminDB.collection("admins").get();
  const admins = await Promise.all(
    snapshot.docs.map(async (doc) => {
      const uid = doc.id;
      try {
        const user = await adminAuth.getUser(uid);
        return {
          uid,
          email: user.email ?? "—",
          name: user.displayName ?? "—",
          photo: user.photoURL ?? null,
          addedAt: doc.data().addedAt ?? null,
        };
      } catch {
        // UID in Firestore but not in Auth (deleted user)
        return { uid, email: "Unknown user", name: "—", photo: null, addedAt: null };
      }
    })
  );

  return NextResponse.json(admins);
}

// POST — add a new admin by email
export async function POST(req: NextRequest) {
  const admin = await verifyAdmin(req);
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

  try {
    const user = await adminAuth.getUserByEmail(email);
    await adminDB.collection("admins").doc(user.uid).set({
      role: "admin",
      addedAt: new Date().toISOString(),
      addedBy: admin.uid,
    });
    return NextResponse.json({
      uid: user.uid,
      email: user.email,
      name: user.displayName ?? "—",
      photo: user.photoURL ?? null,
    });
  } catch (err: any) {
    if (err.code === "auth/user-not-found") {
      return NextResponse.json({ error: "No user found with that email. They must sign in at least once first." }, { status: 404 });
    }
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

// DELETE — remove an admin by uid
export async function DELETE(req: NextRequest) {
  const admin = await verifyAdmin(req);
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { uid } = await req.json();
  if (!uid) return NextResponse.json({ error: "UID required" }, { status: 400 });

  // Prevent removing yourself
  if (uid === admin.uid) {
    return NextResponse.json({ error: "You cannot remove yourself as admin" }, { status: 400 });
  }

  await adminDB.collection("admins").doc(uid).delete();
  return NextResponse.json({ success: true });
}
