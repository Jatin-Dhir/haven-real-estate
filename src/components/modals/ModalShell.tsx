"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useLenis } from "lenis/react";
import { useEffect, type ReactNode } from "react";
import { useModal } from "@/components/providers/ModalProvider";
import styles from "./modal.module.css";

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 5L19 19M19 5L5 19" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

type ModalShellProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Accessible name AND the visible heading text. */
  title: string;
  /** Visible + accessible (aria-describedby) supporting copy. */
  description: string;
  children: ReactNode;
};

/**
 * Shared Radix Dialog chrome for every modal: overlay, sliding panel, close button, and the
 * visible heading doubling as the dialog's accessible name (one announcement, not two).
 *
 * Scroll lock: Radix locks body scrolling, but Lenis drives the page with `window.scrollTo`,
 * which `overflow: hidden` does not stop — so the smooth-scroll engine is paused while open.
 * Focus: these dialogs are state-driven (no Radix Trigger), so focus is returned to the
 * element that opened the modal via ModalProvider.
 */
export function ModalShell({ open, onOpenChange, title, description, children }: ModalShellProps) {
  const lenis = useLenis();
  const { restoreFocus } = useModal();

  useEffect(() => {
    if (!open) return;
    document.documentElement.classList.add("modal-open");
    lenis?.stop();
    return () => {
      document.documentElement.classList.remove("modal-open");
      lenis?.start();
    };
  }, [open, lenis]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} data-lenis-prevent />
        <Dialog.Content
          className={styles.content}
          data-lenis-prevent
          onCloseAutoFocus={(e) => {
            e.preventDefault();
            restoreFocus();
          }}
        >
          <div className={styles.header}>
            <Dialog.Title asChild>
              <h3 className={`t-h-sm ${styles.title}`}>{title}</h3>
            </Dialog.Title>
            {description ? (
              <Dialog.Description className={`t-small ${styles.description}`}>{description}</Dialog.Description>
            ) : (
              <Dialog.Description className={styles.visuallyHidden}>{title}</Dialog.Description>
            )}
          </div>
          {children}
          <Dialog.Close className={styles.close} aria-label="Close">
            <CloseIcon />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
