"use client";

import { useEffect, useState } from "react";
import { site } from "@/content/site";
import type { DealType } from "@/content/types";
import { Button } from "@/components/ui/Button";
import { ModalShell } from "./ModalShell";
import { FormField } from "./FormField";
import { SegmentedControl } from "./SegmentedControl";
import { SuccessView } from "./SuccessView";
import { useModalForm } from "./useModalForm";
import formStyles from "./form.module.css";
import styles from "./modal.module.css";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dealType?: DealType;
};

export function FindPropertiesModal({ open, onOpenChange, dealType }: Props) {
  const content = site.modals.findProperties;
  const [deal, setDeal] = useState<DealType>(dealType ?? "buy");
  const { values, errors, submitting, submitted, setValue, submit } = useModalForm(content.fields, open);

  // Re-sync the segmented control every time the modal opens, so the deal
  // type passed to openModal() (e.g. from a Services row) always wins.
  useEffect(() => {
    if (open) setDeal(dealType ?? "buy");
  }, [open, dealType]);

  return (
    <ModalShell open={open} onOpenChange={onOpenChange} title={content.title} description={content.description}>
      {submitted ? (
        <SuccessView title={content.successTitle} text={content.successText} onDone={() => onOpenChange(false)} />
      ) : (
        <form
          className={styles.form}
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <div className={styles.dealTypes}>
            <SegmentedControl options={content.dealTypes} value={deal} onChange={setDeal} ariaLabel="Deal type" />
          </div>

          <div className={formStyles.grid}>
            {content.fields.map((field) => (
              <FormField
                key={field.name}
                field={field}
                value={values[field.name] ?? ""}
                error={errors[field.name]}
                onChange={setValue}
              />
            ))}
          </div>

          <div className={styles.actions}>
            <Button type="submit" label={content.submitLabel} iconAfter loading={submitting} />
          </div>
        </form>
      )}
    </ModalShell>
  );
}
