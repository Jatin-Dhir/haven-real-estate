"use client";

import { useRef } from "react";
import { clsx } from "clsx";
import { useGSAP } from "@/lib/gsap";
import { clipRevealOnScroll, fadeUpOnScroll, parallaxOnScroll, wordsRevealOnScroll, afterFonts } from "@/lib/motion";
import { Container } from "@/components/ui/Container";
import { Img } from "@/components/ui/Img";
import { withBase } from "@/lib/paths";
import type { WhyContent } from "@/content/types";
import styles from "./WhyUs.module.css";

/**
 * Why us — asymmetric label / statement row, then a full-width media frame
 * below it (autoplaying video when `video.src` is set, otherwise the poster
 * image). The frame clip-reveals on scroll and the media inside drifts with
 * a subtle parallax.
 */
export function WhyUs({ data }: { data: WhyContent }) {
  const rootRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const statementRef = useRef<HTMLHeadingElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (labelRef.current) fadeUpOnScroll(labelRef.current);
      const statement = statementRef.current;
      const cleanupFonts = statement ? afterFonts(() => [wordsRevealOnScroll(statement)]) : undefined;
      if (frameRef.current) {
        clipRevealOnScroll(frameRef.current);
        if (mediaRef.current) parallaxOnScroll(mediaRef.current, frameRef.current, { fromY: "-6%", toY: "6%" });
      }
      return cleanupFonts;
    },
    { scope: rootRef },
  );

  const hasVideo = Boolean(data.video.src);

  return (
    <section ref={rootRef} className={styles.root} data-section="why">
      <Container>
        <div className={styles.row}>
          <p ref={labelRef} className={clsx(styles.label, "t-label")} data-reveal>
            {data.label}
          </p>
          <h2 ref={statementRef} className={clsx(styles.statement, "t-display")}>
            {data.text} <span className="em">{data.textEm}</span>
          </h2>
        </div>

        <div ref={frameRef} className={styles.frame} data-reveal>
          <div ref={mediaRef} className={styles.media}>
            {hasVideo ? (
              <video
                className={styles.mediaEl}
                autoPlay
                muted
                loop
                playsInline
                poster={withBase(data.video.poster.src)}
                aria-label={data.video.poster.alt}
              >
                <source src={withBase(data.video.src)} />
              </video>
            ) : (
              <Img asset={data.video.poster} fill className={styles.mediaEl} />
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
