"use client";

import { useRef } from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Img } from "@/components/ui/Img";
import { useGSAP } from "@/lib/gsap";
import { wordsRevealOnScroll, fadeUpOnScroll, parallaxOnScroll, afterFonts } from "@/lib/motion";
import type { OutroContent } from "@/content/types";
import styles from "./Outro.module.css";

export function Outro({ data }: { data: OutroContent }) {
  const rootRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const imgEl = rootRef.current?.querySelector<HTMLElement>(`.${styles.bgImg}`);
      if (imgEl && rootRef.current) parallaxOnScroll(imgEl, rootRef.current);

      return afterFonts(() => [
        titleRef.current ? wordsRevealOnScroll(titleRef.current) : null,
        actionsRef.current ? fadeUpOnScroll(actionsRef.current, { delay: 0.2 }) : null,
      ]);
    },
    { scope: rootRef },
  );

  return (
    <section className={styles.root} data-section="outro" data-theme="dark" ref={rootRef}>
      <div className={styles.bg} aria-hidden="true">
        <Img asset={data.background} className={styles.bgImg} />
        <div className={styles.tint} />
      </div>

      <Container className={styles.content}>
        <h2 className={styles.title} ref={titleRef}>
          <span className={styles.line}>{data.title}</span>
          <span className={`${styles.line} em`}>{data.titleEm}</span>
        </h2>
        <div className={styles.actions} data-reveal ref={actionsRef}>
          <Button label={data.cta.label} action={data.cta.action} color="primary" inversed iconAfter />
        </div>
      </Container>
    </section>
  );
}
