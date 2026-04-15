/**
 * useIsMobile.ts
 * 
 * Hook that detects if the current viewport is mobile (< 768px).
 * Used by layout wrapper to serve completely separate mobile vs desktop components.
 */
"use client";

import { useState, useEffect } from "react";

export function useIsMobile(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);

  return isMobile;
}
