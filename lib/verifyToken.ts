import { adminAuth } from "./firebase-admin";

/**
 * Verify a Firebase ID token from the Authorization header.
 * Returns { uid, email } on success, or null on failure.
 *
 * This is a lightweight verifier for user-level endpoints (like, save, view).
 * For admin endpoints, use verifyAdmin from ./verifyAdmin instead.
 */
export async function verifyToken(
  authHeader: string | null
): Promise<{ uid: string; email: string } | null> {
  try {
    if (!authHeader?.startsWith("Bearer ")) return null;

    const token = authHeader.substring(7);
    if (!token) return null;

    const decoded = await adminAuth.verifyIdToken(token);
    const uid = decoded.uid;
    const email = decoded.email ?? "";

    if (!uid) return null;

    return { uid, email };
  } catch (err: any) {
    console.error("[verifyToken] Verification failed:", err.message);
    return null;
  }
}
