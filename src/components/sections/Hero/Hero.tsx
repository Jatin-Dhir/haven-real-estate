"use client";

import { useRef } from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Img } from "@/components/ui/Img";
import { wordmark, WORDMARK_MASK_URL } from "@/components/ui/Wordmark";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { fadeUp, refreshScroll, wordsReveal } from "@/lib/motion";
import type { BrandContent, HeroContent } from "@/content/types";
import { ProceduralCloud, ProceduralSmoke } from "./Clouds";
import styles from "./Hero.module.css";

/**
 * HERO — the signature scroll scene.
 *
 * The section is 500vh tall; a 100vh stage sticks to the top of the viewport for the first
 * 400vh of that travel while a scrubbed timeline plays the story:
 *   title fades out → the building rises and grows → the wordmark draws itself on in outline →
 *   the outline dissolves and the building is only visible *through* the letters →
 *   clouds drift apart → smoke and a white gradient swallow the scene before the pin releases.
 *
 * Everything that can be swapped lives in content: `data.background` (sky), `data.house`
 * (THE BUILDING — any photo or transparent cutout), optional `data.cloud` / `data.smoke`.
 * With no cloud/smoke assets we draw them procedurally (see Clouds.tsx).
 */
export function Hero({ data, brand }: { data: HeroContent; brand: BrandContent }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const [content] = q(`.${styles.content}`);
      const [h1] = q(`.${styles.headline}`);
      const [back] = q(`.${styles.back}`);
      const [logo] = q(`.${styles.logo}`);
      const [logoPath] = q(`.${styles.logoPath}`);
      const [composite] = q(`.${styles.composite}`);
      const [housePlain] = q(`.${styles.housePlain}`);
      const [cloud1] = q(`.${styles.cloud1}`);
      const [cloud2] = q(`.${styles.cloud2}`);
      const [smokeFront] = q(`.${styles.smokeFront}`);
      const houses = q(`.${styles.house}`);
      const houseImgs = q(`.${styles.houseImg}`);
      const copy = q(`.${styles.text}, .${styles.actions}`);

      /* Reduced motion: render the final state of the intro and wire no scroll animation. */
      if (prefersReducedMotion()) {
        gsap.set(root.current, { autoAlpha: 1 });
        gsap.set(copy, { opacity: 1, visibility: "visible" });
        return;
      }

      /* ── Intro: plays 200ms after mount ───────────────────────────────────────── */
      const intro = gsap.timeline({ delay: 0.2 });
      intro.fromTo(root.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6 }, 0);
      if (h1) intro.add(wordsReveal(h1, { duration: 2, stagger: 0.1 }), 0);
      intro.add(fadeUp(copy, { stagger: 0.1 }), 0.4);
      intro.from(back, { scale: 1.1, duration: 5, ease: "expo.out" }, 0);
      intro.from(cloud1, { yPercent: 50, duration: 3, ease: "expo.out" }, 0);
      intro.from(cloud2, { yPercent: 100, duration: 4, ease: "expo.out" }, 0.1);
      intro.from(houseImgs, { opacity: 0, duration: 0.6, ease: "none" }, 0.2);
      intro.from(houseImgs, { yPercent: 10, duration: 3, ease: "expo.out" }, 0.2);

      /* ── Scrubbed scene: timeline seconds = fraction of the 500vh travel ──────── */
      const scene = gsap.timeline({
        defaults: { ease: "power1.out" },
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: 0.1 },
      });
      scene.fromTo(houses, { yPercent: 0, scale: 1 }, { yPercent: -40, scale: 1.3, duration: 1 }, 0);
      /* y:0 alongside yPercent so GSAP replaces the CSS translateY(70%) instead of adding to it */
      scene.fromTo(smokeFront, { yPercent: 70, y: 0 }, { yPercent: 0, y: 0, duration: 1 }, 0);
      scene.fromTo(cloud1, { xPercent: 0 }, { xPercent: -15, duration: 1 }, 0);
      scene.fromTo(cloud2, { xPercent: 0 }, { xPercent: 15, duration: 1 }, 0);
      scene.fromTo(content, { yPercent: 0, scale: 1 }, { yPercent: 20, scale: 0.9, duration: 1 }, 0);
      scene.to(content, { autoAlpha: 0, duration: 0.2 }, 0);
      scene.to(logo, { opacity: 1, duration: 0.01 }, 0.1);
      scene.fromTo(logoPath, { drawSVG: "0% 0%" }, { drawSVG: "0% 100%", duration: 0.3 }, 0.1);
      scene.to(logo, { opacity: 0, duration: 0.2 }, 0.28);
      scene.to(composite, { opacity: 1, duration: 0.1 }, 0.3);
      scene.to(housePlain, { opacity: 0, duration: 0.1 }, 0.3);
    },
    { scope: root },
  );

  // A transparent cutout is shown crisp; an ordinary photo gets its edges soft-masked into the sky.
  const houseImgClass = data.houseIsCutout ? styles.houseImg : `${styles.houseImg} ${styles.houseSoft}`;

  const house = (
    <div className={`${styles.house} ${styles.housePlain}`}>
      <Img asset={data.house} className={houseImgClass} priority onLoad={refreshScroll} />
    </div>
  );

  return (
    <section ref={root} className={styles.root} data-section="hero" data-reveal data-cutout={data.houseIsCutout ? "true" : "false"}>
      <div className={styles.top}>
        <div className={styles.bg}>
          {/* 1 · sky */}
          <div className={styles.back}>
            <Img asset={data.background} fill priority onLoad={refreshScroll} />
          </div>

          {/* 2 · the building */}
          {house}

          {/* 3 · the same building, seen through the brand letters */}
          <div
            className={styles.composite}
            aria-hidden="true"
            style={{ maskImage: `url("${WORDMARK_MASK_URL}")`, WebkitMaskImage: `url("${WORDMARK_MASK_URL}")` }}
          >
            <div className={styles.house}>
              <Img asset={data.house} className={houseImgClass} priority />
            </div>
            {/* keeps the letterforms readable when the building photo is as pale as the sky */}
            <div className={styles.compositeTint} />
          </div>

          {/* 4 · clouds */}
          <div className={styles.clouds}>
            <div className={`${styles.cloud} ${styles.cloud1}`}>
              {data.cloud ? <Img asset={data.cloud} className={styles.weatherImg} /> : <ProceduralCloud seed={4} />}
            </div>
            <div className={`${styles.cloud} ${styles.cloud2}`}>
              {data.cloud ? <Img asset={data.cloud} className={styles.weatherImg} /> : <ProceduralCloud seed={19} />}
            </div>
          </div>

          {/* 5 · wordmark outline, drawn on with DrawSVG in the exact box of the composite mask */}
          <div className={styles.logo}>
            <svg viewBox={wordmark.viewBox} role="img" aria-label={brand.name} focusable="false">
              <path className={styles.logoPath} d={wordmark.d} fill="none" stroke="#000" strokeWidth={12} strokeLinejoin="round" />
            </svg>
          </div>

          {/* 6 · smoke bank across the base of the building */}
          <div className={`${styles.smoke} ${styles.smokeFront}`}>
            {data.smoke ? <Img asset={data.smoke} className={styles.weatherImg} /> : <ProceduralSmoke seed={11} />}
          </div>
        </div>

        {/* 7 · copy */}
        <div className={styles.content}>
          <Container className={styles.column}>
            <h1 className={`t-h-xl ${styles.headline}`}>{data.title}</h1>
            <div className={styles.text} data-reveal>
              <p className="t-lead">
                {data.subtitle} <span className="em">{data.subtitleEm}</span>
              </p>
            </div>
            <div className={styles.actions} data-reveal>
              <Button label={data.cta.label} action={data.cta.action} iconAfter />
            </div>
          </Container>
        </div>
      </div>

      {/* The scene dissolves into the white section that follows: a second smoke bank and a
          white gradient ride up through the last screens of the pin; the next section then
          slides over the stage (root has margin-bottom: -100vh and the section a higher z-index). */}
      <div className={styles.overlap} aria-hidden="true">
        <div className={styles.smoke}>
          {data.smoke ? <Img asset={data.smoke} className={styles.weatherImg} /> : <ProceduralSmoke seed={31} />}
        </div>
        <div className={styles.overlay} />
      </div>
    </section>
  );
}
