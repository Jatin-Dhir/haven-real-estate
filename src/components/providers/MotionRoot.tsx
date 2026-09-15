"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "@/lib/gsap";
import { whenFontsReady } from "@/lib/motion";

/**
 * Marks the document as motion-capable (`html.has-motion`) so `[data-reveal]` elements can
 * start hidden without breaking the no-JS experience, and refreshes ScrollTrigger once fonts
 * have loaded (line breaks / heights change when the web font swaps in).
 */
export function MotionRoot() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduce) document.documentElement.classList.add("has-motion");
    whenFontsReady().then(() => ScrollTrigger.refresh());
    return () => document.documentElement.classList.remove("has-motion");
  }, []);
  return null;
}
