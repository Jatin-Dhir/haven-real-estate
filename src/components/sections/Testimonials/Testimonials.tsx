"use client";

import { useRef } from "react";
import { clsx } from "clsx";
import { Swiper, SwiperSlide } from "swiper/react";
import type { SwiperClass } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { useGSAP } from "@/lib/gsap";
import { wordsRevealOnScroll, clipRevealOnScroll, parallaxOnScroll, fadeUpOnScroll } from "@/lib/motion";
import { Container } from "@/components/ui/Container";
import { Img } from "@/components/ui/Img";
import type { TestimonialsContent } from "@/content/types";
import styles from "./Testimonials.module.css";

/** Original 10-point star polygon (own trig derivation, not traced from any reference asset). */
const STAR_PATH = "M10,1 12.06,7.17 18.56,7.22 13.33,11.08 15.29,17.28 10,13.5 4.71,17.28 6.67,11.08 1.44,7.22 7.94,7.17Z";

function Stars({ rating }: { rating: number }) {
  return (
    <span className={styles.stars} role="img" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className={styles.star} viewBox="0 0 20 20" aria-hidden="true" focusable="false">
          <path
            d={STAR_PATH}
            fill={i < rating ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth={i < rating ? 0 : 1.2}
            strokeLinejoin="round"
          />
        </svg>
      ))}
    </span>
  );
}

/** Original closing-quote glyph: two mirrored rounded-comma shapes, drawn from scratch. */
function QuoteGlyph() {
  return (
    <svg className={styles.quoteGlyph} viewBox="0 0 64 48" aria-hidden="true" focusable="false">
      <path fill="currentColor" d="M9 0C4 0 0 4.2 0 9.4c0 4.6 3 8.2 7 9L2 48h8l7-30V9.4C17 4.2 13 0 9 0Z" />
      <path fill="currentColor" d="M42 0c-5 0-9 4.2-9 9.4c0 4.6 3 8.2 7 9l-5 29.6h8l7-30V9.4C50 4.2 46 0 42 0Z" />
    </svg>
  );
}

export function Testimonials({ data }: { data: TestimonialsContent }) {
  const rootRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const textColRef = useRef<HTMLDivElement>(null);
  const photoFrameRef = useRef<HTMLDivElement>(null);
  const photoInnerRef = useRef<HTMLDivElement>(null);
  const paginationRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (headingRef.current) wordsRevealOnScroll(headingRef.current);
      if (textColRef.current) fadeUpOnScroll(textColRef.current);
      if (photoFrameRef.current) {
        clipRevealOnScroll(photoFrameRef.current);
        if (photoInnerRef.current) parallaxOnScroll(photoInnerRef.current, photoFrameRef.current);
      }
    },
    { scope: rootRef },
  );

  return (
    <section ref={rootRef} className={styles.root} data-section="testimonials">
      <Container>
        <h2 ref={headingRef} className={clsx("t-h-md", styles.title)}>
          {data.title} <span className="em">{data.titleEm}</span>
        </h2>

        <div className={styles.grid}>
          <div className={styles.textCol} ref={textColRef} data-reveal>
            <div className={styles.divider} />

            <div className={styles.paginationRow}>
              <div className={styles.bullets} ref={paginationRef} />
              <QuoteGlyph />
            </div>

            <div className={styles.carousel}>
              <Swiper
                modules={[Pagination]}
                onBeforeInit={(swiper: SwiperClass) => {
                  const pagination = swiper.params.pagination;
                  if (pagination && typeof pagination !== "boolean") {
                    pagination.el = paginationRef.current;
                  }
                }}
                pagination={{
                  clickable: true,
                  renderBullet: (index, className) =>
                    `<button type="button" class="${className}" aria-label="Go to slide ${index + 1}">${index + 1}</button>`,
                }}
                speed={300}
                slidesPerView={1}
                spaceBetween={0}
                loop={false}
                effect="slide"
                autoHeight={false}
                className={styles.swiper}
              >
                {data.items.map((item, i) => (
                  <SwiperSlide key={i} className={styles.slide}>
                    <p className={clsx("t-quote", styles.quote)}>&ldquo;{item.quote}&rdquo;</p>
                    <div className={styles.info}>
                      <span className={styles.author}>{item.author}</span>
                      <span className={styles.sep} aria-hidden="true">
                        /
                      </span>
                      <Stars rating={item.rating} />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>

          <div className={styles.photoCol}>
            <div className={styles.photoFrame} ref={photoFrameRef} data-reveal>
              <div className={styles.photoInner} ref={photoInnerRef}>
                <Img asset={data.image} fill className={styles.photoImg} />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
