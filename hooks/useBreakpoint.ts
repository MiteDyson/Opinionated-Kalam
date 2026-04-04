"use client";

import { useState, useEffect } from "react";

export type Breakpoint = "mobile" | "tablet" | "desktop";

export function useBreakpoint(): Breakpoint {
  const [bp, setBp] = useState<Breakpoint>("desktop");

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 768) setBp("mobile");
      else if (w < 1024) setBp("tablet");
      else setBp("desktop");
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return bp;
}

// Responsive style helper — picks the right value for current breakpoint
export function r<T>(
  bp: Breakpoint,
  values: { mobile?: T; tablet?: T; desktop: T }
): T {
  if (bp === "mobile" && values.mobile !== undefined) return values.mobile;
  if (bp === "tablet" && values.tablet !== undefined) return values.tablet;
  return values.desktop;
}
