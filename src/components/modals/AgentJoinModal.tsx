"use client";

import { site } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { ModalShell } from "./ModalShell";
import { FormField } from "./FormField";
import { SuccessView } from "./SuccessView";
import { useModalForm } from "./useModalForm";
import formStyles from "./form.module.css";
import styles from "./modal.module.css";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AgentJoinModal({ open, onOpenChange }: Props) {
  const content = site.modals.agentJoin;
  const { values, errors, submitting, submitted, setValue, submit } = useModalForm(content.fields, open);

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
