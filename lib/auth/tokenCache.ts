/**
 * In-memory cache for verified Firebase ID tokens.
 *
 * Firebase tokens are valid for 1 hour. Caching the decoded result
 * avoids a network round-trip to Firebase on every API request while
 * maintaining the same security guarantee — tokens are still fully
 * verified on first encounter.
 *
 * The cache is bounded (MAX_SIZE) and entries are evicted when they
 * expire, so memory usage stays predictable under load.
 */

interface CachedToken {
  uid: string;
  email: string;
  exp: number; // Unix seconds
}

const MAX_SIZE = 500;
const cache = new Map<string, CachedToken>();

export function getCachedToken(token: string): CachedToken | null {
  const entry = cache.get(token);
  if (!entry) return null;

  // Expired — evict and miss
  if (entry.exp <= Date.now() / 1000) {
    cache.delete(token);
    return null;
  }

  return entry;
}

export function setCachedToken(
  token: string,
  uid: string,
  email: string,
  exp: number
): void {
  // Evict oldest entries if cache is full
  if (cache.size >= MAX_SIZE) {
    const firstKey = cache.keys().next().value;
    if (firstKey) cache.delete(firstKey);
  }

  cache.set(token, { uid, email, exp });
}
