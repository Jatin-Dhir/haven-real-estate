"use client";

/**
 * Single GSAP entry point. Import gsap and plugins from here (never from "gsap" directly)
 * so plugins are registered exactly once.
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { CustomEase } from "gsap/CustomEase";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin, CustomEase, useGSAP);
  gsap.defaults({ ease: "expo.out" });
}

/** Site-wide easing tokens (mirror of the CSS custom properties in globals.css). */
export const EASE = {
  expoOut: "expo.out",
  power4Out: "power4.out",
  power3Out: "power3.out",
  /** cubic-bezier(.76, 0, .2, 1) — used for panel/menu open + close */
  panel: "power3.inOut",
} as const;

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export { gsap, ScrollTrigger, SplitText, DrawSVGPlugin, CustomEase, useGSAP };
