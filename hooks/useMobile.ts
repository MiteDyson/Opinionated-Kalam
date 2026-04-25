"use client";

import { useState, useEffect } from "react";

export function useMobile(): boolean {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const check = () => {
      const ua = navigator.userAgent;
      const isPhone = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
      setIsMobile(isPhone || window.innerWidth < 768);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Return false during SSR / first render to avoid hydration mismatch,
  // but use null internally to let consumers show nothing until decided.
  // We expose a boolean: null maps to false so the hook signature stays boolean.
  // Consumers that need to hide content during indeterminate state should
  // use useMobileReady() instead.
  return isMobile ?? false;
}

/**
 * Returns [isMobile, isReady].
 * isReady is false during SSR/hydration — lets consumers avoid flash.
 */
export function useMobileReady(): [boolean, boolean] {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const check = () => {
      const ua = navigator.userAgent;
      const isPhone = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
      setIsMobile(isPhone || window.innerWidth < 768);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return [isMobile ?? false, isMobile !== null];
}
