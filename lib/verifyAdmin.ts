import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";

const MAIN_ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "opinionatedkalam@gmail.com";

function getAdminModel() {
  if (mongoose.models.Admin) return mongoose.models.Admin;
  const schema = new mongoose.Schema({
    email:     { type: String, required: true, unique: true, lowercase: true },
    name:      { type: String, required: true },
    role:      { type: String, default: "author" }, // "admin" | "author"
    addedBy:   { type: String },
    addedAt:   { type: Date, default: Date.now },
    isMain:    { type: Boolean, default: false },
  });
  return mongoose.model("Admin", schema);
}

export { getAdminModel };

export async function verifyAdmin(req: NextRequest): Promise<{ uid: string; email: string; isMain: boolean } | null> {
  try {
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) return null;

    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload = JSON.parse(
      Buffer.from(parts[1].replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8")
    );

    if (payload.exp * 1000 < Date.now()) return null;

    const email: string = payload.email ?? "";

    // Main admin always has access
    if (email === MAIN_ADMIN_EMAIL) {
      return { uid: payload.user_id ?? payload.sub, email, isMain: true };
    }

    // Check if email is in the admin collection
    await connectDB();
    const Admin = getAdminModel();
    const adminRecord = await Admin.findOne({ email: email.toLowerCase() }).lean();
    if (!adminRecord) return null;

    return { uid: payload.user_id ?? payload.sub, email, isMain: false };
  } catch (err: any) {
    console.log("[verifyAdmin] Error:", err.message);
    return null;
  }
}

export async function isMainAdmin(email: string): Promise<boolean> {
  return email === MAIN_ADMIN_EMAIL;
}
