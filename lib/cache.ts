/**
 * Client-side in-memory cache with TTL.
 * Lives in the browser tab — shared across all components.
 */

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

class ClientCache {
  private store = new Map<string, CacheEntry<unknown>>();

  set<T>(key: string, data: T, ttlMs = 3 * 60 * 1000): void {
    this.store.set(key, { data, expiresAt: Date.now() + ttlMs });
  }

  get<T>(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return entry.data as T;
  }

  invalidate(prefix: string): void {
    for (const key of this.store.keys()) {
      if (key.startsWith(prefix)) this.store.delete(key);
    }
  }

  clear(): void {
    this.store.clear();
  }
}

export const clientCache = new ClientCache();

const inFlight = new Map<string, Promise<any>>();

export async function cachedFetch<T>(
  url: string,
  options?: RequestInit,
  ttlMs = 3 * 60 * 1000,
): Promise<T> {
  const cacheKey = `fetch:${url}`;

  // 1. Check if we have a fresh cached version
  const cached = clientCache.get<T>(cacheKey);
  if (cached !== null) return cached;

  // 2. Check if a request is already in flight for this exact URL
  if (inFlight.has(cacheKey)) {
    return inFlight.get(cacheKey) as Promise<T>;
  }

  // 3. Start a new request and track it
  const fetchPromise = (async () => {
    try {
      const res = await fetch(url, options);
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`);
      const data: T = await res.json();
      clientCache.set(cacheKey, data, ttlMs);
      return data;
    } finally {
      inFlight.delete(cacheKey);
    }
  })();

  inFlight.set(cacheKey, fetchPromise);
  return fetchPromise as Promise<T>;
}
