import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import mongoose from "mongoose";
import { adminAuth } from "./firebase-admin";
import { getCachedToken, setCachedToken } from "./tokenCache";

const MAIN_ADMIN_EMAIL = process.env.ADMIN_EMAIL;

function getAdminModel() {
  if (mongoose.models.Admin) return mongoose.models.Admin;
  const schema = new mongoose.Schema({
    email:   { type: String, required: true, unique: true, lowercase: true },
    name:    { type: String, required: true },
    role:    { type: String, default: "author" },
    addedBy: { type: String },
    addedAt: { type: Date, default: Date.now },
    isMain:  { type: Boolean, default: false },
  });
  return mongoose.model("Admin", schema);
}

export { getAdminModel };

export async function verifyAdmin(
  req: NextRequest
): Promise<{ uid: string; email: string; isMain: boolean; role: string } | null> {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) return null;
    
    const token = authHeader.substring(7);
    if (!token) return null;

    // Check cache first — avoids Firebase network round-trip
    let uid: string;
    let email: string;

    const cached = getCachedToken(token);
    if (cached) {
      uid = cached.uid;
      email = cached.email;
    } else {
      // SECURE: Verify the ID token using Firebase Admin SDK
      const decodedToken = await adminAuth.verifyIdToken(token);
      email = decodedToken.email ?? "";
      uid = decodedToken.uid;

      // Cache for subsequent requests
      setCachedToken(token, uid, email, decodedToken.exp);
    }

    if (!email) return null;

    // Main admin always has full access
    if (email === MAIN_ADMIN_EMAIL) {
      return { uid, email, isMain: true, role: "admin" };
    }

    // Check team admin collection
    await connectDB();
    const Admin = getAdminModel();
    // SECURE: Use a simple string for the query to prevent injection
    const adminRecord = await Admin.findOne({ email: String(email).toLowerCase() } as any).lean() as any;
    
    if (!adminRecord) return null;

    return {
      uid,
      email,
      isMain: false,
      role: adminRecord.role ?? "author",
    };
  } catch (err: any) {
    console.error("[verifyAdmin] Verification Failed:", err.message);
    return null;
  }
}

export async function isMainAdmin(email: string): Promise<boolean> {
  return email === MAIN_ADMIN_EMAIL;
}
