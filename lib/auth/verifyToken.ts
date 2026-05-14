import { adminAuth } from "./firebase-admin";
import { getCachedToken, setCachedToken } from "./tokenCache";

/**
 * Verify a Firebase ID token from the Authorization header.
 * Returns { uid, email } on success, or null on failure.
 *
 * Uses an in-memory cache to avoid a Firebase round-trip on every request.
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

    // Check cache first — avoids Firebase network call
    const cached = getCachedToken(token);
    if (cached) {
      return { uid: cached.uid, email: cached.email };
    }

    const decoded = await adminAuth.verifyIdToken(token);
    const uid = decoded.uid;
    const email = decoded.email ?? "";

    if (!uid) return null;

    // Cache for subsequent requests
    setCachedToken(token, uid, email, decoded.exp);

    return { uid, email };
  } catch (err: any) {
    console.error("[verifyToken] Verification failed:", err.message);
    return null;
  }
}

