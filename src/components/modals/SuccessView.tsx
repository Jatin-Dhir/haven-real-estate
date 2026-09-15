"use client";

import { Button } from "@/components/ui/Button";
import styles from "./modal.module.css";

type Props = {
  title: string;
  text: string;
  onDone: () => void;
};

/** Replaces the form once a submission "succeeds" (simulated, no backend). */
export function SuccessView({ title, text, onDone }: Props) {
  return (
    <div className={styles.success}>
      <h4 className="t-h-sm">{title}</h4>
      <p className={`t-small ${styles.successText}`}>{text}</p>
      <div className={styles.successActions}>
        <Button label="Done" onClick={onDone} />
      </div>
    </div>
  );
}
