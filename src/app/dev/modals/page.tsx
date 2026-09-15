"use client";

import { useModal } from "@/components/providers/ModalProvider";
import styles from "./page.module.css";

/**
 * Dev-only harness for the three modals. Not linked from the site nav —
 * visit /dev/modals directly. Each button opens one modal via useModal().
 */
export default function DevModalsPage() {
  const { openModal } = useModal();

  return (
    <main className={styles.root}>
      <h1 className={styles.heading}>Modals playground</h1>
      <p className={`t-small ${styles.hint}`}>
        Opens each modal through the same useModal().openModal() call the real buttons use. The Find
        Properties trigger passes dealType=&quot;rent&quot; so the segmented control&apos;s preselect logic is
        visible without wiring up the Services section.
      </p>
      <div className={styles.row}>
        <button
          type="button"
          data-open="find-properties"
          className={styles.trigger}
          onClick={() => openModal("find-properties", { dealType: "rent" })}
        >
          Open Find Properties
        </button>
        <button type="button" data-open="contact" className={styles.trigger} onClick={() => openModal("contact")}>
          Open Contact
        </button>
        <button
          type="button"
          data-open="agent-join"
          className={styles.trigger}
          onClick={() => openModal("agent-join")}
        >
          Open Agent Join
        </button>
      </div>
    </main>
  );
}
