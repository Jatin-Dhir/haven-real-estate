"use client";

import { clsx } from "clsx";
import type { FormField as FormFieldSpec } from "@/content/types";
import styles from "./form.module.css";

function ChevronIcon() {
  return (
    <svg className={styles.chevron} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

type Props = {
  field: FormFieldSpec;
  value: string;
  error?: string;
  onChange: (name: string, value: string) => void;
};

/** One labelled, underlined form control. Renders text/email/tel/textarea/select from content. */
export function FormField({ field, value, error, onChange }: Props) {
  const id = `field-${field.name}`;
  const errorId = `${id}-error`;

  return (
    <div className={clsx(styles.field, field.colSpan === 6 ? styles.half : styles.full)}>
      <label htmlFor={id} className={styles.label}>
        {field.label}
        {field.required && (
          <span className={styles.required} aria-hidden="true">
            *
          </span>
        )}
      </label>

      {field.type === "textarea" ? (
        <textarea
          id={id}
          name={field.name}
          rows={3}
          placeholder={field.placeholder}
          value={value}
          onChange={(e) => onChange(field.name, e.target.value)}
          className={styles.control}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
        />
      ) : field.type === "select" ? (
        <div className={styles.controlWrap}>
          <select
            id={id}
            name={field.name}
            value={value}
            onChange={(e) => onChange(field.name, e.target.value)}
            className={styles.control}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
          >
            <option value="" disabled hidden>
              {field.placeholder}
            </option>
            {field.options?.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <ChevronIcon />
        </div>
      ) : (
        <input
          id={id}
          name={field.name}
          type={field.type}
          placeholder={field.placeholder}
          value={value}
          onChange={(e) => onChange(field.name, e.target.value)}
          className={styles.control}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
        />
      )}

      {error && (
        <p id={errorId} className={styles.error} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
