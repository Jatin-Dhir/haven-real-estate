"use client";

import { useRef } from "react";
import { useGSAP } from "@/lib/gsap";
import { fadeUpOnScroll, scrubbedLines, whenFontsReady, wordsRevealOnScroll } from "@/lib/motion";
import { Container } from "@/components/ui/Container";
import { Img } from "@/components/ui/Img";
import { Button, ArrowIcon } from "@/components/ui/Button";
import { useModal } from "@/components/providers/ModalProvider";
import type { ServicesContent } from "@/content/types";
import styles from "./Services.module.css";

/**
 * Dark "how we can help" section: a scrubbed-reveal heading over three full-bleed
 * rows (one per deal type). Each row is a real <button> — clicking it opens the
 * Find Properties modal preselected to that deal type.
 */
export function Services({ data }: { data: ServicesContent }) {
  const rootRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const briefRef = useRef<HTMLParagraphElement>(null);
  const { openModal } = useModal();

  useGSAP(
    () => {
      let cancelled = false;
      let scrubbed: ReturnType<typeof scrubbedLines> = null;

      whenFontsReady().then(() => {
        if (cancelled || !titleRef.current) return;
        scrubbed = scrubbedLines(titleRef.current, { color: "rgba(21,23,23,.8)" });
      });

      fadeUpOnScroll(`.${styles.caption}`);
      fadeUpOnScroll(`.${styles.item}`, { stagger: 0.1 });
      if (briefRef.current) wordsRevealOnScroll(briefRef.current);
      fadeUpOnScroll(`.${styles.action}`);

      return () => {
        cancelled = true;
        scrubbed?.revert();
      };
    },
    { scope: rootRef },
  );

  return (
    <section ref={rootRef} data-section="services" data-theme="dark" className={styles.root}>
      <Container>
        <div className={styles.hgrid}>
          <p className={styles.caption}>{data.caption}</p>
          <h2 ref={titleRef} className={styles.title}>
            {data.title}
            <br />
            <span className="em">{data.titleEm}</span>
          </h2>
        </div>
      </Container>

      <div className={styles.items}>
        {data.items.map((item, i) => (
          <button
            key={item.dealType}
            type="button"
            className={styles.item}
            aria-label={`${item.label}: ${item.text}`}
            onClick={() => openModal("find-properties", { dealType: item.dealType })}
          >
            <Img asset={item.image} fill className={styles.itemBg} aria-hidden="true" />
            <Container className={styles.itemInner}>
              <span className={styles.itemNum} aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className={styles.itemText}>{item.text}</h3>
              <span className={styles.itemMore} aria-hidden="true">
                <span className={styles.itemLabel}>{item.label}</span>
                <ArrowIcon className={styles.itemArrow} />
              </span>
            </Container>
          </button>
        ))}
      </div>

      <Container>
        <p ref={briefRef} className={styles.brief}>
          {data.brief} <span className="em">{data.briefEm}</span>
        </p>
        <div className={styles.action}>
          <Button label={data.cta.label} action={data.cta.action} color="secondary" inversed iconAfter />
        </div>
      </Container>
    </section>
  );
}
