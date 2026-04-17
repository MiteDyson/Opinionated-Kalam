"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { cachedFetch, clientCache } from "@/lib/cache";

export interface Article {
  _id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  author: string;
  tags: string[];
  type: "article" | "podcast" | "short";
  readTime: string;
  publishedAt: string;
  likes: number;
  views: number;
  episode?: string;
  duration?: string;
  audioUrl?: string;
}

export interface ArticlesState {
  articles: Article[];
  podcasts: Article[];
  shorts: Article[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const inFlight = new Map<string, Promise<Article[]>>();

async function fetchType(type: string, uid: string): Promise<Article[]> {
  const url = `/api/articles?type=${type}&status=published${uid ? `&uid=${uid}` : ""}`;
  const key = `inflight:${url}`;
  if (inFlight.has(key)) return inFlight.get(key)!;
  const promise = cachedFetch<Article[]>(url, undefined, 3 * 60 * 1000)
    .finally(() => inFlight.delete(key));
  inFlight.set(key, promise);
  return promise;
}

export function useArticles(uid = ""): ArticlesState {
  const [articles, setArticles] = useState<Article[]>([]);
  const [podcasts, setPodcasts] = useState<Article[]>([]);
  const [shorts,   setShorts]   = useState<Article[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState<string | null>(null);
  const mounted = useRef(true);

  const load = useCallback(async (showLoading = true) => {
    const artUrl = `/api/articles?type=article&status=published${uid ? `&uid=${uid}` : ""}`;
    const podUrl = `/api/articles?type=podcast&status=published${uid ? `&uid=${uid}` : ""}`;
    const shrUrl = `/api/articles?type=short&status=published${uid ? `&uid=${uid}` : ""}`;

    const cachedArt = clientCache.get<Article[]>(`fetch:${artUrl}`);
    const cachedPod = clientCache.get<Article[]>(`fetch:${podUrl}`);
    const cachedShr = clientCache.get<Article[]>(`fetch:${shrUrl}`);

    if (cachedArt && cachedPod && cachedShr) {
      setArticles(cachedArt);
      setPodcasts(cachedPod);
      setShorts(cachedShr);
      setLoading(false);
      showLoading = false;
    }

    if (showLoading) setLoading(true);
    setError(null);

    try {
      const [art, pod, shr] = await Promise.allSettled([
        fetchType("article", uid),
        fetchType("podcast", uid),
        fetchType("short",   uid),
      ]);
      if (!mounted.current) return;
      setArticles(art.status === "fulfilled" ? art.value : []);
      setPodcasts(pod.status === "fulfilled" ? pod.value : []);
      setShorts(  shr.status === "fulfilled" ? shr.value : []);
      if (art.status === "rejected" && pod.status === "rejected" && shr.status === "rejected") {
        setError("Failed to load content. Please check your connection.");
      }
    } catch (e: any) {
      if (mounted.current) setError(e.message ?? "Unknown error");
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, [uid]);

  useEffect(() => {
    mounted.current = true;
    load();
    return () => { mounted.current = false; };
  }, [load]);

  const refetch = useCallback(() => {
    clientCache.invalidate("fetch:/api/articles");
    load(true);
  }, [load]);

  return { articles, podcasts, shorts, loading, error, refetch };
}
