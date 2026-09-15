import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Img } from "@/components/ui/Img";
import type { Post } from "@/content/types";
import styles from "./PostEntry.module.css";

/**
 * One blog entry: thumbnail + date/title/excerpt/cta. DOM order puts the thumbnail
 * first (mobile default); on desktop CSS `order` swaps it after the text column.
 */
export function PostEntry({ post }: { post: Post }) {
  return (
    <article className={styles.root}>
      <div className={styles.grid}>
        <Link href={post.href} className={styles.thumbnail} tabIndex={-1} aria-hidden="true">
          <Img asset={post.image} fill className={styles.thumbnailImg} />
        </Link>

        <div className={styles.textCol}>
          <p className={styles.date}>{post.date}</p>
          <h3 className={styles.title}>
            <Link href={post.href}>{post.title}</Link>
          </h3>
          <p className={styles.excerpt}>{post.excerpt}</p>
          <div className={styles.action}>
            <Button label={post.readMoreLabel} action={{ type: "link", href: post.href }} color="secondary" iconAfter />
          </div>
        </div>
      </div>
    </article>
  );
}
