import { NextRequest } from "next/server";
import { adminAuth, adminDB } from "./firebaseAdmin";

export async function verifyAdmin(req: NextRequest): Promise<{ uid: string } | null> {
  try {
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) return null;

    const decoded = await adminAuth.verifyIdToken(token);
    const uid = decoded.uid;

    // Check Firestore admins collection
    const doc = await adminDB.collection("admins").doc(uid).get();
    if (!doc.exists) return null;

    return { uid };
  } catch {
    return null;
  }
}
