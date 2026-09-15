"use client";

/**
 * Full-screen mobile menu. The white sheet unrolls from the top edge (scaleY 0→1,
 * .7s on a custom .76/0/.2/1 curve), then the nav labels word-reveal and the actions
 * fade up. Closing fades the content and rolls the sheet back up.
 * Items with children are accordion groups whose height is tweened by GSAP.
 */
import Link from "next/link";
import { clsx } from "clsx";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { CustomEase, gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { fadeUp, wordsReveal } from "@/lib/motion";
import type { BrandContent, NavItem } from "@/content/types";
import { ChevronIcon, isComingSoon } from "./DropMenu";
import styles from "./BurgerMenu.module.css";

const PANEL_EASE = "0.76, 0, 0.2, 1";
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

type Props = {
  id: string;
  brand: BrandContent;
  nav: NavItem[];
  open: boolean;
  onClose: () => void;
};

export function BurgerMenu({ id, brand, nav, open, onClose }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const hasOpened = useRef(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  /* Lock the page while the sheet is up (Lenis is told to keep its hands off the panel). */
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        // hand focus back to the burger button so keyboard users keep their place
        requestAnimationFrame(() => document.querySelector<HTMLElement>(`button[aria-controls="${id}"]`)?.focus());
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  /* ── open / close choreography ───────────────────────────────────────────── */
  useGSAP(
    () => {
      const root = rootRef.current;
      const backdrop = backdropRef.current;
      const content = contentRef.current;
      const actions = actionsRef.current;
      if (!root || !backdrop || !content || !actions) return;

      const reduce = prefersReducedMotion();
      const labels = gsap.utils.toArray<HTMLElement>("[data-nav-label]", root);
      const chevrons = gsap.utils.toArray<HTMLElement>("[data-nav-chevron]", root);

      if (open) {
        hasOpened.current = true;
        gsap.set(root, { autoAlpha: 1, pointerEvents: "auto" });

        if (reduce) {
          gsap.set(backdrop, { scaleY: 1 });
          gsap.set([content, actions, ...chevrons], { opacity: 1, visibility: "visible" });
          return;
        }

        // Restore the untouched label markup so repeat opens never nest SplitText output.
        labels.forEach((el) => {
          if (el.dataset.raw === undefined) el.dataset.raw = el.innerHTML;
          else el.innerHTML = el.dataset.raw;
        });

        const ease = CustomEase.create("headerPanel", PANEL_EASE);
        const tl = gsap.timeline();
        tl.set(content, { opacity: 1 }, 0);
        tl.set(chevrons, { opacity: 0 }, 0);
        tl.fromTo(backdrop, { scaleY: 0 }, { scaleY: 1, duration: 0.7, ease, transformOrigin: "top center" }, 0);
        labels.forEach((el, i) => tl.add(wordsReveal(el, { duration: 1.4, stagger: 0.06 }), 0.4 + i * 0.06));
        tl.to(chevrons, { opacity: 1, duration: 0.6, stagger: 0.06, ease: "power2.out" }, 0.6);
        tl.add(fadeUp(actions, { duration: 1.4, fromY: 40 }), 0.6);
        return;
      }

      if (!hasOpened.current) return;

      const settle = () => {
        gsap.set(root, { autoAlpha: 0, pointerEvents: "none" });
        setExpanded(null);
      };

      if (reduce) {
        settle();
        return;
      }

      const ease = CustomEase.create("headerPanel", PANEL_EASE);
      const tl = gsap.timeline({ onComplete: settle });
      tl.to([content, actions], { opacity: 0, duration: 0.35, ease: "power2.out" }, 0);
      tl.to(backdrop, { scaleY: 0, duration: 0.7, ease, transformOrigin: "top center" }, 0.1);
    },
    { dependencies: [open], scope: rootRef },
  );

  /* ── accordions ──────────────────────────────────────────────────────────── */
  useGSAP(
    () => {
      const panels = gsap.utils.toArray<HTMLElement>("[data-acc]", rootRef.current);
      panels.forEach((panel) => {
        const isOpen = panel.dataset.acc === expanded;
        const vars = { height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 };
        if (prefersReducedMotion()) gsap.set(panel, vars);
        else gsap.to(panel, { ...vars, duration: 0.45, ease: "power2.inOut", overwrite: "auto" });
      });
    },
    { dependencies: [expanded], scope: rootRef },
  );

  return (
    <div ref={rootRef} id={id} className={styles.wrapper} data-lenis-prevent>
      <div ref={backdropRef} className={styles.backdrop} aria-hidden="true" />

      <div ref={contentRef} className={styles.content}>
        <nav className={styles.nav} aria-label={`${brand.name} menu`}>
          {nav.map((item) => {
            const children = item.children ?? [];
            if (!children.length) {
              return (
                // aria-label survives the word-split (split words are aria-hidden).
                <Link key={item.label} className={styles.navItem} href={item.href ?? "#"} aria-label={item.label} onClick={onClose}>
                  <span className={styles.navLabel} data-nav-label>
                    {item.label}
                  </span>
                </Link>
              );
            }
            const isOpen = expanded === item.label;
            const panelId = `${id}-${slug(item.label)}`;
            return (
              <div key={item.label}>
                <button
                  type="button"
                  className={styles.navItem}
                  aria-label={item.label}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setExpanded(isOpen ? null : item.label)}
                >
                  <span className={styles.navLabel} data-nav-label>
                    {item.label}
                  </span>
                  <span className={clsx(styles.navChevron, isOpen && styles.rotated)} data-nav-chevron>
                    <ChevronIcon />
                  </span>
                </button>
                <div id={panelId} className={styles.accordion} data-acc={item.label} inert={!isOpen}>
                  <div className={styles.accordionInner}>
                    {children.map((child) =>
                      isComingSoon(child) ? (
                        <span key={child.label} className={clsx(styles.subItem, styles.disabled)} aria-disabled="true">
                          {child.label}
                        </span>
                      ) : (
                        <Link
                          key={child.label}
                          className={styles.subItem}
                          href={child.href}
                          target={child.external ? "_blank" : undefined}
                          rel={child.external ? "noopener noreferrer" : undefined}
                          onClick={onClose}
                        >
                          {child.label}
                        </Link>
                      ),
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </nav>
      </div>

      <div ref={actionsRef} className={styles.actions}>
        <Button label={brand.signIn.label} action={brand.signIn.action} onClick={onClose} />
      </div>
    </div>
  );
}
