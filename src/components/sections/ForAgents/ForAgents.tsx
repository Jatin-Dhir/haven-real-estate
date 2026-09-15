"use client";

import { useRef } from "react";
import { clsx } from "clsx";
import { useGSAP } from "@/lib/gsap";
import { wordsRevealOnScroll, clipRevealOnScroll, parallaxOnScroll, fadeUpOnScroll } from "@/lib/motion";
import { Container } from "@/components/ui/Container";
import { Img } from "@/components/ui/Img";
import { Button } from "@/components/ui/Button";
import type { ForAgentsContent } from "@/content/types";
import styles from "./ForAgents.module.css";

export function ForAgents({ data }: { data: ForAgentsContent }) {
  const rootRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const smallImgRef = useRef<HTMLDivElement>(null);
  const imgFrameRef = useRef<HTMLDivElement>(null);
  const imgInnerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (headingRef.current) wordsRevealOnScroll(headingRef.current);
      if (smallImgRef.current) clipRevealOnScroll(smallImgRef.current);
      if (imgFrameRef.current) {
        clipRevealOnScroll(imgFrameRef.current, { delay: 0.1 });
        if (imgInnerRef.current) parallaxOnScroll(imgInnerRef.current, imgFrameRef.current);
      }
      if (textRef.current && ctaRef.current) {
        fadeUpOnScroll([textRef.current, ctaRef.current], { stagger: 0.12 });
      }
    },
    { scope: rootRef },
  );

  return (
    <section ref={rootRef} className={styles.root} data-section="forAgents">
      <Container>
        <div className={styles.row}>
          <div className={styles.left}>
            <p className={clsx("t-label", styles.label)}>{data.label}</p>
            <div className={styles.smallImg} ref={smallImgRef} data-reveal>
              <Img asset={data.smallImage} fill className={styles.smallImgEl} />
            </div>
          </div>

          <div className={styles.right}>
            <h2 ref={headingRef} className={styles.heading}>
              {data.title} <span className="em">{data.titleEm}</span>
            </h2>

            <div className={styles.imgFrame} ref={imgFrameRef} data-reveal>
              <div className={styles.imgInner} ref={imgInnerRef}>
                <Img asset={data.image} fill className={styles.imgEl} />
              </div>
            </div>

            <div className={styles.textBlock}>
              <p ref={textRef} className={clsx("t-lead", styles.text)} data-reveal>
                {data.text}
                {data.textEm ? (
                  <>
                    {" "}
                    <span className="em">{data.textEm}</span>
                  </>
                ) : null}
              </p>
              <div ref={ctaRef} className={styles.ctaWrap} data-reveal>
                <Button label={data.cta.label} action={data.cta.action} />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
