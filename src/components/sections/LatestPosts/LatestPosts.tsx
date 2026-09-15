"use client";

import { useRef } from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { useGSAP } from "@/lib/gsap";
import { wordsRevealOnScroll, fadeUpOnScroll, afterFonts } from "@/lib/motion";
import type { PostsContent } from "@/content/types";
import { PostEntry } from "./PostEntry";
import styles from "./LatestPosts.module.css";

export function LatestPosts({ data }: { data: PostsContent }) {
  const rootRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const leadRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLUListElement>(null);

  useGSAP(
    () => {
      return afterFonts(() => [
        titleRef.current ? wordsRevealOnScroll(titleRef.current) : null,
        leadRef.current ? fadeUpOnScroll(Array.from(leadRef.current.children), { trigger: leadRef.current }) : null,
        itemsRef.current ? fadeUpOnScroll(Array.from(itemsRef.current.children), { trigger: itemsRef.current, stagger: 0.15 }) : null,
      ]);
    },
    { scope: rootRef },
  );

  return (
    <section className={styles.root} data-section="posts" ref={rootRef}>
      <Container>
        <div className={styles.header}>
          <div className={styles.titleCol}>
            <h2 className={styles.title} ref={titleRef}>
              <span className={styles.line}>{data.title}</span>
              <span className={`${styles.line} em`}>{data.titleEm}</span>
            </h2>
          </div>
          <div className={styles.copyCol} ref={leadRef}>
            <p className={styles.text} data-reveal>
              {data.text}
            </p>
            <div className={styles.actions} data-reveal>
              <Button label={data.cta.label} action={data.cta.action} iconAfter />
            </div>
          </div>
        </div>

        <ul className={styles.items} ref={itemsRef}>
          {data.items.map((post) => (
            <li className={styles.item} data-reveal key={post.href}>
              <PostEntry post={post} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
