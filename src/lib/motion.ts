"use client";

/**
 * Motion helper library — the shared vocabulary every section uses so the whole
 * page moves as one system.
 *
 * Conventions
 *  • Each helper returns a paused-by-nothing gsap.core.Timeline you can `.add()` into a
 *    bigger timeline, and has an `…OnScroll` twin that wires a once-only ScrollTrigger.
 *  • Under `prefers-reduced-motion: reduce` helpers render the FINAL state immediately.
 *  • Always call these inside `useGSAP(() => {...}, { scope })` so cleanup is automatic.
 */
import { gsap, ScrollTrigger, SplitText, prefersReducedMotion } from "./gsap";

type Targets = gsap.TweenTarget;

const asArray = (t: Targets): Element[] => gsap.utils.toArray<Element>(t as gsap.DOMTarget);

/* ───────────────────────── Word reveal (masked, slides up) ───────────────────────── */

export type WordsRevealOptions = {
  duration?: number;
  delay?: number;
  ease?: string;
  stagger?: number | gsap.StaggerVars;
};

/**
 * Splits `el` into words, wraps each word in an overflow-hidden mask and slides the word
 * up from 115% → 0%. Keeps an accessible unsplit label on the element.
 */
export function wordsReveal(el: Element, opts: WordsRevealOptions = {}) {
  const o = { duration: 2, delay: 0, ease: "power4.out", ...opts };
  const tl = gsap.timeline();
  if (prefersReducedMotion()) {
    gsap.set(el, { visibility: "visible" });
    return tl;
  }

  if (!el.getAttribute("aria-label")) el.setAttribute("aria-label", (el.textContent || "").replace(/\s+/g, " ").trim());
  const outer = new SplitText(el, { type: "words", wordsClass: "w-mask" });
  const inner = new SplitText(outer.words, { type: "words", wordsClass: "w-inner" });
  outer.words.forEach((w) => w.setAttribute("aria-hidden", "true"));

  gsap.set(outer.words, { overflow: "hidden", verticalAlign: "top", padding: "0.15em", margin: "-0.15em", display: "inline-block" });
  gsap.set(inner.words, { y: "120%", display: "inline-block" });
  // The parent may start hidden via `[data-reveal]`; the words are masked, so it is safe to show it now.
  gsap.set(el, { visibility: "visible" });
  // will-change is promoted by the *OnScroll wrapper's onEnter (ScrollTrigger renders time 0 at
  // creation, so a position-0 set() would apply it to every heading on first paint) and cleared here.
  tl.fromTo(
    inner.words,
    { y: "115%" },
    {
      y: "0%",
      duration: o.duration,
      stagger: o.stagger ?? (outer.words.length > 5 ? { amount: 0.4 } : 0.1),
      delay: o.delay,
      ease: o.ease,
    },
    0,
  );
  tl.set(inner.words, { willChange: "auto" });
  return tl;
}

/** Promote `will-change` only when a once-only trigger actually fires (its timeline clears it at the end). */
const promoteOnEnter = (targets: Targets) => () => {
  if (!prefersReducedMotion()) gsap.set(targets, { willChange: "transform" });
};

export const wordsRevealOnScroll = (el: Element, opts: WordsRevealOptions = {}) =>
  ScrollTrigger.create({
    trigger: el,
    start: "top 85%",
    animation: wordsReveal(el, opts),
    once: true,
    onEnter: () => {
      if (!prefersReducedMotion()) gsap.set(el.querySelectorAll(".w-inner"), { willChange: "transform" });
    },
  });

/* ───────────────────────── Fade up / fade sideways ───────────────────────── */

export type FadeOptions = {
  fromY?: number | string;
  toY?: number | string;
  fromX?: number | string;
  toX?: number | string;
  duration?: number;
  /** opacity snaps in quickly (default .1s) while the transform eases over `duration` */
  opacityDuration?: number;
  stagger?: number | gsap.StaggerVars;
  ease?: string;
  delay?: number;
};

export function fadeUp(targets: Targets, opts: FadeOptions = {}) {
  const o = { fromY: 70, toY: 0, fromX: 0, toX: 0, duration: 2, opacityDuration: 0.1, stagger: 0.1, ease: "expo.out", delay: 0, ...opts };
  const tl = gsap.timeline({ delay: o.delay });
  const els = asArray(targets);
  if (!els.length) return tl;
  if (prefersReducedMotion()) {
    gsap.set(els, { opacity: 1, visibility: "visible", clearProps: "transform" });
    return tl;
  }
  gsap.set(els, { opacity: 0, visibility: "visible" });
  tl.fromTo(els, { opacity: 0 }, { opacity: 1, duration: o.opacityDuration, stagger: o.stagger }, 0);
  tl.fromTo(els, { y: o.fromY, x: o.fromX }, { y: o.toY, x: o.toX, duration: o.duration, stagger: o.stagger, ease: o.ease }, 0);
  tl.set(els, { willChange: "auto" });
  return tl;
}

export const fadeUpOnScroll = (targets: Targets, opts: FadeOptions & { trigger?: Element; start?: string } = {}) => {
  const els = asArray(targets);
  const { trigger, start, ...rest } = opts;
  return ScrollTrigger.create({
    trigger: trigger ?? els[0],
    start: start ?? "top 85%",
    animation: fadeUp(els, rest),
    once: true,
    onEnter: promoteOnEnter(els),
  });
};

export function fadeX(targets: Targets, opts: FadeOptions = {}) {
  return fadeUp(targets, { fromX: 70, toX: 0, fromY: 0, toY: 0, ...opts });
}

export const fadeXOnScroll = (targets: Targets, opts: FadeOptions & { trigger?: Element; start?: string } = {}) => {
  const els = asArray(targets);
  const { trigger, start, ...rest } = opts;
  return ScrollTrigger.create({
    trigger: trigger ?? els[0],
    start: start ?? "top 85%",
    animation: fadeX(els, rest),
    once: true,
    onEnter: promoteOnEnter(els),
  });
};

/* ───────────────────────── Simple fade in ───────────────────────── */

export function fadeIn(targets: Targets, opts: { from?: number; to?: number; duration?: number; stagger?: number; delay?: number } = {}) {
  const o = { from: 0, to: 1, duration: 1, stagger: 0.1, delay: 0, ...opts };
  const tl = gsap.timeline({ delay: o.delay });
  const els = asArray(targets);
  if (!els.length) return tl;
  if (prefersReducedMotion()) {
    gsap.set(els, { opacity: o.to, visibility: "visible" });
    return tl;
  }
  gsap.set(els, { opacity: o.from, visibility: "visible" });
  tl.fromTo(els, { opacity: o.from }, { opacity: o.to, duration: o.duration, stagger: o.stagger }, 0);
  return tl;
}

export const fadeInOnScroll = (targets: Targets, opts: Parameters<typeof fadeIn>[1] & { trigger?: Element; start?: string } = {}) => {
  const els = asArray(targets);
  const { trigger, start, ...rest } = opts;
  return ScrollTrigger.create({ trigger: trigger ?? els[0], start: start ?? "top 85%", animation: fadeIn(els, rest), once: true });
};

/* ───────────────────────── Clip reveal (wipes left → right) ───────────────────────── */

export type ClipRevealOptions = { from?: string; to?: string; duration?: number; stagger?: number | gsap.StaggerVars; ease?: string; delay?: number };

export function clipReveal(targets: Targets, opts: ClipRevealOptions = {}) {
  const o = { from: "inset(0 100% 0 0)", to: "inset(0 0% 0 0)", duration: 2, stagger: { amount: 0.15 }, ease: "power3.out", delay: 0, ...opts };
  const tl = gsap.timeline({ delay: o.delay });
  const els = asArray(targets);
  if (!els.length) return tl;
  if (prefersReducedMotion()) {
    gsap.set(els, { clipPath: "none", visibility: "visible" });
    return tl;
  }
  gsap.set(els, { visibility: "visible" });
  tl.fromTo(els, { clipPath: o.from }, { clipPath: o.to, duration: o.duration, stagger: o.stagger, ease: o.ease, clearProps: "clipPath" });
  return tl;
}

export const clipRevealOnScroll = (targets: Targets, opts: ClipRevealOptions & { trigger?: Element; start?: string } = {}) => {
  const els = asArray(targets);
  const { trigger, start, ...rest } = opts;
  return ScrollTrigger.create({
    trigger: trigger ?? els[0],
    start: start ?? "top 85%",
    animation: clipReveal(els, rest),
    once: true,
    onEnter: promoteOnEnter(els),
    onLeave: () => gsap.set(els, { willChange: "auto" }),
  });
};

/* ───────────────────────── Scrubbed parallax ───────────────────────── */

export type ParallaxOptions = {
  fromY?: string | number;
  toY?: string | number;
  fromScale?: number;
  toScale?: number;
  /** >0 fades the element in over the first part of the scrub */
  opacityDuration?: number;
  scaleDuration?: number;
  transformOrigin?: string;
};

export function parallax(el: Targets, opts: ParallaxOptions = {}) {
  const o = { fromY: "10%", toY: "-10%", fromScale: 1, toScale: 1, opacityDuration: 0, scaleDuration: 1, transformOrigin: "center", ...opts };
  const tl = gsap.timeline();
  if (prefersReducedMotion()) return tl;
  gsap.set(el, { transformOrigin: o.transformOrigin });
  tl.set(el, { willChange: "transform", immediateRender: false });
  if (o.opacityDuration) tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: o.opacityDuration, ease: "none" }, 0);
  if (o.fromScale !== o.toScale && o.scaleDuration) tl.fromTo(el, { scale: o.fromScale }, { scale: o.toScale, duration: o.scaleDuration, ease: "none" }, 0);
  tl.fromTo(el, { y: o.fromY }, { y: o.toY, duration: 1, ease: "none" }, 0);
  tl.set(el, { willChange: "auto" });
  return tl;
}

/**
 * Parallax that runs while `trigger` travels through the viewport ("top bottom" → "bottom top").
 * Use `image` for the inner <img> of an overflow-hidden frame; set the image ~120% tall.
 */
export const parallaxOnScroll = (el: Targets, trigger: Element, opts: ParallaxOptions & Partial<ScrollTrigger.Vars> = {}) => {
  const { fromY, toY, fromScale, toScale, opacityDuration, scaleDuration, transformOrigin, ...st } = opts;
  if (prefersReducedMotion()) return null;
  return ScrollTrigger.create({
    trigger,
    start: "top bottom",
    end: "bottom top",
    scrub: 1.5,
    animation: parallax(el, { fromY, toY, fromScale, toScale, opacityDuration, scaleDuration, transformOrigin }),
    ...st,
  });
};

/* ───────────────────────── Scrubbed line highlight ───────────────────────── */

export type ScrubbedLinesOptions = {
  /** Overlay color that hides the text before it is "read"; usually the section bg at .8 alpha */
  color?: string;
  origin?: string;
  start?: string;
  end?: string;
};

/**
 * Splits `el` into lines and covers each line with a colored overlay that shrinks from
 * `origin` as the user scrolls — the paragraph appears to be read line by line.
 * Wire it after fonts are ready (see `whenFontsReady`).
 */
export function scrubbedLines(el: HTMLElement, opts: ScrubbedLinesOptions = {}) {
  const o = { color: "rgba(255,255,255,0.8)", origin: "right center", start: "top bottom-=200px", end: "center center", ...opts };
  if (prefersReducedMotion()) return null;
  const split = new SplitText(el, { type: "lines", linesClass: "line" });
  const overlays: HTMLElement[] = [];
  split.lines.forEach((line) => {
    const l = line as HTMLElement;
    l.style.position = "relative";
    l.style.display = "block";
    const overlay = document.createElement("span");
    overlay.setAttribute("aria-hidden", "true");
    Object.assign(overlay.style, {
      position: "absolute",
      inset: "0",
      background: o.color,
      transformOrigin: o.origin,
      pointerEvents: "none",
    } as CSSStyleDeclaration);
    l.appendChild(overlay);
    overlays.push(overlay);
  });
  const tl = gsap.timeline();
  tl.fromTo(overlays, { scaleX: 1 }, { scaleX: 0, ease: "none", stagger: 0.6, duration: 1 });
  const st = ScrollTrigger.create({ trigger: el, start: o.start, end: o.end, scrub: true, animation: tl });
  return { split, st, revert: () => { st.kill(); tl.kill(); split.revert(); } };
}

/* ───────────────────────── Utilities ───────────────────────── */

/** Resolve once web fonts are loaded — split text AFTER this so line breaks are final. */
export const whenFontsReady = (): Promise<void> =>
  typeof document !== "undefined" && "fonts" in document ? document.fonts.ready.then(() => undefined) : Promise.resolve();

/**
 * Run `create` once fonts are ready and return a cleanup that kills every ScrollTrigger it made.
 * Triggers created after an `await` fall outside the `useGSAP` context and would otherwise leak
 * across client-side navigations — always `return afterFonts(...)` from the `useGSAP` callback.
 */
export function afterFonts(create: () => Array<ScrollTrigger | null | undefined | false>): () => void {
  let cancelled = false;
  let created: ScrollTrigger[] = [];
  whenFontsReady().then(() => {
    if (cancelled) return;
    created = create().filter((st): st is ScrollTrigger => Boolean(st));
  });
  return () => {
    cancelled = true;
    created.forEach((st) => {
      const anim = st.animation;
      st.kill();
      anim?.kill();
    });
    created = [];
  };
}

/** Call after layout-affecting changes (media loaded, accordion opened) */
export const refreshScroll = () => ScrollTrigger.refresh();
