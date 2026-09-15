"use client";

import Link from "next/link";
import { clsx } from "clsx";
import type { CSSProperties, MouseEvent, ReactNode } from "react";
import type { Action } from "@/content/types";
import { useModal } from "@/components/providers/ModalProvider";
import styles from "./Button.module.css";

export type ButtonProps = {
  label: string;
  /** Content-driven behaviour. Omit and pass `onClick` for custom buttons. */
  action?: Action;
  onClick?: (e: MouseEvent<HTMLElement>) => void;
  color?: "primary" | "secondary";
  /** Swap the palette for use on dark backgrounds */
  inversed?: boolean;
  /** Show the arrow icon after the label (or pass a custom node) */
  iconAfter?: boolean | ReactNode;
  iconBefore?: ReactNode;
  type?: "button" | "submit";
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  style?: CSSProperties;
  id?: string;
  "aria-label"?: string;
};

export function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 12h15.5M13 5.5l6.5 6.5-6.5 6.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Round pill button. Text "rolls" upward on hover (pointer devices only) and the pill
 * stretches 2% with a springy ease — the site's signature micro-interaction.
 */
export function Button({
  label,
  action,
  onClick,
  color = "primary",
  inversed = false,
  iconAfter,
  iconBefore,
  type = "button",
  disabled,
  loading,
  className,
  style,
  id,
  ...aria
}: ButtonProps) {
  const { runAction } = useModal();

  const content = (
    <span className={styles.content}>
      {iconBefore && <span className={styles.icon}>{iconBefore}</span>}
      <span className={styles.text}>
        <span data-text={label}>{label}</span>
      </span>
      {iconAfter && <span className={styles.icon}>{iconAfter === true ? <ArrowIcon /> : iconAfter}</span>}
      {loading && <span className={styles.spinner} aria-hidden="true" />}
    </span>
  );

  const cls = clsx(styles.root, styles[color], inversed && styles.inversed, loading && styles.loading, className);

  if (action?.type === "link") {
    if (action.external) {
      return (
        <a id={id} className={cls} style={style} href={action.href} target="_blank" rel="noopener noreferrer" onClick={onClick} {...aria}>
          {content}
        </a>
      );
    }
    return (
      <Link id={id} className={cls} style={style} href={action.href} onClick={onClick} {...aria}>
        {content}
      </Link>
    );
  }

  return (
    <button
      id={id}
      type={type}
      className={cls}
      style={style}
      disabled={disabled || loading}
      onClick={(e) => {
        onClick?.(e);
        if (action && !e.defaultPrevented) runAction(action);
      }}
      {...aria}
    >
      {content}
    </button>
  );
}
