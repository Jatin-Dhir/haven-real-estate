"use client";

import { useEffect, useState } from "react";
import type { FormField } from "@/content/types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Values = Record<string, string>;
type Errors = Record<string, string>;

/**
 * Local form state shared by all three modals: values, inline validation,
 * a simulated 900ms submit, and a success flag. No backend calls — this only
 * ever resolves locally. State resets whenever `open` flips to true so a
 * reopened modal always starts clean.
 */
export function useModalForm(fields: FormField[], open: boolean) {
  const [values, setValues] = useState<Values>({});
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!open) return;
    setValues({});
    setErrors({});
    setSubmitting(false);
    setSubmitted(false);
  }, [open]);

  const setValue = (name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => (prev[name] ? { ...prev, [name]: "" } : prev));
  };

  const validate = () => {
    const next: Errors = {};
    for (const field of fields) {
      const value = values[field.name]?.trim() ?? "";
      if (field.required && !value) {
        next[field.name] = "This field is required.";
      } else if (value && field.type === "email" && !EMAIL_RE.test(value)) {
        next[field.name] = "Enter a valid email address.";
      }
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = () => {
    if (submitting || !validate()) return;
    setSubmitting(true);
    window.setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 900);
  };

  return { values, errors, submitting, submitted, setValue, submit };
}
