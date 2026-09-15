"use client";

import { useRef } from "react";
import { useGSAP } from "@/lib/gsap";
import { fadeUpOnScroll, wordsRevealOnScroll } from "@/lib/motion";
import { Container } from "@/components/ui/Container";
import { Img } from "@/components/ui/Img";
import { Button } from "@/components/ui/Button";
import type { FeaturesContent } from "@/content/types";
import styles from "./Features.module.css";

/**
 * Dark "support beyond the sale" section: an asymmetric header (heading | text + cta)
 * followed by three cover-photo cards, each with its own CTA pinned to the bottom.
 */
export function Features({ data }: { data: FeaturesContent }) {
  const rootRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      if (titleRef.current) wordsRevealOnScroll(titleRef.current);
      fadeUpOnScroll(`.${styles.text}, .${styles.action}`, { stagger: 0.1 });
      fadeUpOnScroll(`.${styles.item}`, { stagger: 0.1 });
    },
    { scope: rootRef },
  );

  return (
    <section ref={rootRef} data-section="features" data-theme="dark" className={styles.root}>
      <Container>
        <div className={styles.hgrid}>
          <h2 ref={titleRef} className={styles.title}>
            {data.title}
            <br />
            <span className="em">{data.titleEm}</span>
          </h2>
          <div>
            <p className={styles.text}>
              {data.text} <span className="em">{data.textEm}</span>
            </p>
            <div className={styles.action}>
              <Button label={data.cta.label} action={data.cta.action} color="primary" inversed />
            </div>
          </div>
        </div>
      </Container>

      <Container>
        <div className={styles.items}>
          {data.items.map((item) => (
            <div key={item.title} className={styles.item}>
              <span className={styles.cardBg} aria-hidden="true">
                <Img asset={item.image} fill className={styles.cardImg} />
                <span className={styles.cardGradient} />
              </span>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p className={styles.cardText}>{item.text}</p>
                <div className={styles.cardAction}>
                  <Button label={item.cta.label} action={item.cta.action} color="secondary" inversed iconAfter />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
