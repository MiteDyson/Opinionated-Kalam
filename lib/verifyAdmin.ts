import { NextRequest } from "next/server";
import { adminAuth } from "./firebaseAdmin";

const ADMIN_EMAIL = "opinionatedkalam@gmail.com";

export async function verifyAdmin(req: NextRequest): Promise<{ uid: string } | null> {
  try {
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) return null;
    const decoded = await adminAuth.verifyIdToken(token);
    if (decoded.email !== ADMIN_EMAIL) return null;
    return { uid: decoded.uid };
  } catch {
    return null;
  }
}
