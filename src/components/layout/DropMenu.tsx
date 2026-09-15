"use client";

/**
 * Accessible hover/focus dropdown for a nav item that has `children`.
 * Hand-rolled (no Radix dependency): opens on hover (fine pointers) and on click/Enter,
 * closes on Escape, outside click, focus loss and item activation. Arrow keys / Home / End
 * move a roving focus through the panel, per the WAI-ARIA menu-button pattern.
 */
import Link from "next/link";
import { clsx } from "clsx";
import { useCallback, useEffect, useId, useRef, type KeyboardEvent as ReactKeyboardEvent } from "react";
import type { LinkItem, NavItem } from "@/content/types";
import navStyles from "./nav.module.css";
import styles from "./DropMenu.module.css";

export function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <path d="M4 8.5 12 16.5 20 8.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Items with no destination — or flagged "(coming soon)" in the content — render muted. */
export const isComingSoon = (child: LinkItem) => !child.href || /\(\s*coming soon\s*\)/i.test(child.label);

const finePointer = () => typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;

type Props = {
  item: NavItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DropMenu({ item, open, onOpenChange }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelId = `${useId().replace(/[^a-zA-Z0-9_-]/g, "")}-menu`;
  const children = item.children ?? [];

  const close = useCallback(() => onOpenChange(false), [onOpenChange]);

  useEffect(() => {
    if (!open) return;
    const outside = (target: EventTarget | null) => !rootRef.current?.contains(target as Node);
    const onPointerDown = (e: PointerEvent) => {
      if (outside(e.target)) close();
    };
    const onFocusIn = (e: FocusEvent) => {
      if (outside(e.target)) close();
    };
    // Escape works wherever focus happens to be — the panel can be opened by hover alone.
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const hadFocus = rootRef.current?.contains(document.activeElement);
      close();
      if (hadFocus) triggerRef.current?.focus();
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, close]);

  const menuItems = () => Array.from(panelRef.current?.querySelectorAll<HTMLElement>("[data-menuitem]") ?? []);

  const focusItem = (index: number) => {
    const els = menuItems();
    if (!els.length) return;
    els[(index + els.length) % els.length].focus();
  };

  const onTriggerKeyDown = (e: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      onOpenChange(true);
      requestAnimationFrame(() => focusItem(0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      onOpenChange(true);
      requestAnimationFrame(() => focusItem(-1));
    }
  };

  const onPanelKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    const els = menuItems();
    const current = els.indexOf(document.activeElement as HTMLElement);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      focusItem(current + 1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      focusItem(current - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      focusItem(0);
    } else if (e.key === "End") {
      e.preventDefault();
      focusItem(els.length - 1);
    } else if (e.key === "Tab") {
      close();
      triggerRef.current?.focus();
    }
  };

  return (
    <div
      ref={rootRef}
      className={styles.root}
      onMouseEnter={() => finePointer() && onOpenChange(true)}
      onMouseLeave={() => finePointer() && close()}
    >
      <button
        ref={triggerRef}
        type="button"
        className={navStyles.item}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onClick={() => onOpenChange(!open)}
        onKeyDown={onTriggerKeyDown}
      >
        <span className={navStyles.label}>
          <span data-text={item.label}>{item.label}</span>
        </span>
        <span className={clsx(navStyles.arrow, open && navStyles.rotated)}>
          <ChevronIcon />
        </span>
      </button>

      {open && (
        <div ref={panelRef} id={panelId} className={styles.panel} role="menu" aria-label={item.label} onKeyDown={onPanelKeyDown}>
          {children.map((child) =>
            isComingSoon(child) ? (
              <span
                key={child.label}
                className={clsx(styles.item, styles.disabled)}
                role="menuitem"
                aria-disabled="true"
                tabIndex={-1}
                data-menuitem
              >
                {child.label}
              </span>
            ) : (
              <Link
                key={child.label}
                href={child.href}
                className={styles.item}
                role="menuitem"
                tabIndex={-1}
                data-menuitem
                target={child.external ? "_blank" : undefined}
                rel={child.external ? "noopener noreferrer" : undefined}
                onClick={close}
              >
                {child.label}
              </Link>
            ),
          )}
        </div>
      )}
    </div>
  );
}
