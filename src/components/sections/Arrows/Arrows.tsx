"use client";

import { useRef } from "react";
import { clsx } from "clsx";
import { useGSAP } from "@/lib/gsap";
import { fadeUpOnScroll, parallaxOnScroll, wordsRevealOnScroll, afterFonts } from "@/lib/motion";
import { Container } from "@/components/ui/Container";
import { Img } from "@/components/ui/Img";
import type { ArrowsContent } from "@/content/types";
import styles from "./Arrows.module.css";

/**
 * Arrows — centered heading, a row of chevron-shaped photo tiles (each
 * clipped into a right-pointing arrow band), then a centered paragraph.
 * Tiles fade up with a stagger; each photo drifts on scroll inside its
 * own chevron mask.
 */
export function Arrows({ data }: { data: ArrowsContent }) {
  const rootRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const title = titleRef.current;
      const cleanupFonts = title ? afterFonts(() => [wordsRevealOnScroll(title)]) : undefined;
      fadeUpOnScroll(`.${styles.tile}`, { stagger: 0.1 });
      fadeUpOnScroll(`.${styles.text}`);

      const tiles = rootRef.current?.querySelectorAll<HTMLElement>(`.${styles.tile}`) ?? [];
      tiles.forEach((tile) => {
        const img = tile.querySelector<HTMLElement>(`.${styles.tileImg}`);
        if (img) parallaxOnScroll(img, tile, { fromY: "-8%", toY: "8%" });
      });
      return cleanupFonts;
    },
    { scope: rootRef },
  );

  const images = data.images.slice(0, 4);

  return (
    <section ref={rootRef} className={styles.root} data-section="arrows">
      <Container>
        <h2 ref={titleRef} className={clsx(styles.title, "t-h-md")}>
          {data.title} <span className="em">{data.titleEm}</span>
        </h2>

        <div className={styles.row}>
          {images.map((image, i) => (
            <div key={image.src || i} className={styles.tile} data-reveal>
              <Img asset={image} className={styles.tileImg} />
            </div>
          ))}
        </div>

        <p className={clsx(styles.text, "t-lead")}>
          {data.text} <span className="em">{data.textEm}</span>
        </p>
      </Container>
    </section>
  );
}
