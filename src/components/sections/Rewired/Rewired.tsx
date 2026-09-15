"use client";

import { useRef } from "react";
import { clsx } from "clsx";
import { useGSAP } from "@/lib/gsap";
import { fadeUpOnScroll, wordsRevealOnScroll, afterFonts } from "@/lib/motion";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import type { RewiredContent } from "@/content/types";
import styles from "./Rewired.module.css";

/**
 * Rewired — asymmetric grid: a two-line headline + CTA on the left, a
 * numbered "how it works" list on the right, separated by hairlines.
 */
export function Rewired({ data }: { data: RewiredContent }) {
  const rootRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const heading = headingRef.current;
      const cleanupFonts = heading ? afterFonts(() => [wordsRevealOnScroll(heading)]) : undefined;
      fadeUpOnScroll(`.${styles.ctaWrap}`);
      fadeUpOnScroll(`.${styles.stepsLabel}`);
      fadeUpOnScroll(`.${styles.step}`, { stagger: 0.12 });
      return cleanupFonts;
    },
    { scope: rootRef },
  );

  return (
    <section ref={rootRef} className={styles.root} data-section="rewired">
      <Container>
        <div className={styles.row}>
          <div className={styles.left}>
            <h2
              ref={headingRef}
              className={clsx(styles.heading, "t-h-md")}
              aria-label={`${data.headlineLine1} ${data.headlineLine2}`}
            >
              <span className={styles.line}>{data.headlineLine1}</span>
              <span className={clsx(styles.line, "em")}>{data.headlineLine2}</span>
            </h2>
            <div className={styles.ctaWrap} data-reveal>
              <Button label={data.cta.label} action={data.cta.action} iconAfter />
            </div>
          </div>

          <div className={styles.right}>
            <p className={clsx(styles.stepsLabel, "t-lead")} data-reveal>
              {data.stepsLabel}
            </p>
            <div className={styles.steps}>
              {data.steps.map((step, i) => (
                <div key={step.title} className={styles.step} data-reveal>
                  <span className={styles.index}>{String(i + 1).padStart(2, "0")}</span>
                  <p className={styles.stepText}>
                    <span>{step.title}</span> <span className="em">{step.text}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
