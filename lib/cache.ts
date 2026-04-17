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

export async function cachedFetch<T>(
  url: string,
  options?: RequestInit,
  ttlMs = 3 * 60 * 1000,
): Promise<T> {
  const cacheKey = `fetch:${url}`;

  const cached = clientCache.get<T>(cacheKey);
  if (cached !== null) return cached;

  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`);
  const data: T = await res.json();

  clientCache.set(cacheKey, data, ttlMs);
  return data;
}
