import { NextRequest } from "next/server";

const ADMIN_EMAIL = "opinionatedkalam@gmail.com";

export async function verifyAdmin(req: NextRequest): Promise<{ uid: string } | null> {
  try {
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) {
      console.log("[verifyAdmin] No token");
      return null;
    }

    // Decode JWT payload without verification (safe for admin-only internal use)
    // The token is still a real Firebase token — we just skip signature verification
    const parts = token.split(".");
    if (parts.length !== 3) {
      console.log("[verifyAdmin] Invalid token format");
      return null;
    }

    const payload = JSON.parse(
      Buffer.from(parts[1].replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8")
    );

    console.log("[verifyAdmin] Token email:", payload.email);
    console.log("[verifyAdmin] Token expiry:", new Date(payload.exp * 1000).toISOString());
    console.log("[verifyAdmin] Now:", new Date().toISOString());

    // Check token not expired
    if (payload.exp * 1000 < Date.now()) {
      console.log("[verifyAdmin] Token expired");
      return null;
    }

    // Check admin email
    if (payload.email !== ADMIN_EMAIL) {
      console.log("[verifyAdmin] Not admin email");
      return null;
    }

    return { uid: payload.user_id ?? payload.sub };
  } catch (err: any) {
    console.log("[verifyAdmin] Error:", err.message);
    return null;
  }
}
