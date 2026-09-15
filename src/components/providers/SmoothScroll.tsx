"use client";

/**
 * Lenis smooth scroll driven by the GSAP ticker so ScrollTrigger and Lenis stay in sync.
 * The ONLY smooth-scroll engine on the site. Bypassed entirely under reduced motion.
 *
 * Anything that must not be hijacked by Lenis (modal bodies, inner scroll areas)
 * gets the attribute `data-lenis-prevent`.
 */
import { ReactLenis, type LenisRef } from "lenis/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<LenisRef>(null);
  const [enabled, setEnabled] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setEnabled(!mq.matches);
    const onChange = () => setEnabled(!mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const update = (time: number) => lenisRef.current?.lenis?.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
    const lenis = lenisRef.current?.lenis;
    lenis?.on("scroll", ScrollTrigger.update);
    // Refresh measurements once everything has loaded (fonts, images).
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    return () => {
      gsap.ticker.remove(update);
      lenis?.off("scroll", ScrollTrigger.update);
      window.removeEventListener("load", onLoad);
    };
  }, [enabled]);

  // Reduced motion (or first server render): native scrolling.
  if (!enabled) return <>{children}</>;

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{ lerp: 0.1, smoothWheel: true, wheelMultiplier: 1, touchMultiplier: 1.4, autoRaf: false, anchors: true }}
    >
      {children}
    </ReactLenis>
  );
}
