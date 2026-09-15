"use client";

/** Two bars that cross into an X. Drives the mobile burger menu. */
import { clsx } from "clsx";
import styles from "./BurgerButton.module.css";

type Props = {
  open: boolean;
  onClick: () => void;
  /** id of the panel this button controls */
  controls: string;
  openLabel?: string;
  closeLabel?: string;
  className?: string;
};

export function BurgerButton({ open, onClick, controls, openLabel = "Open menu", closeLabel = "Close menu", className }: Props) {
  return (
    <button
      type="button"
      className={clsx(styles.btn, open && styles.active, className)}
      aria-label={open ? closeLabel : openLabel}
      aria-expanded={open}
      aria-controls={controls}
      onClick={onClick}
    >
      <span className={styles.bar} aria-hidden="true" />
      <span className={styles.bar} aria-hidden="true" />
    </button>
  );
}
