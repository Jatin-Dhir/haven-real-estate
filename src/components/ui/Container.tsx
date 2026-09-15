import { clsx } from "clsx";
import type { CSSProperties, ElementType, ReactNode } from "react";
import styles from "./Container.module.css";

type Props = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Narrower side padding (4rem) for full-bleed layouts */
  wide?: boolean;
  as?: ElementType;
  id?: string;
};

/** Page gutter: 2.5rem on mobile, 10rem on desktop, max 1920px. */
export function Container({ children, className, style, wide, as: Tag = "div", id }: Props) {
  return (
    <Tag id={id} className={clsx(styles.container, wide && styles.wide, className)} style={style}>
      {children}
    </Tag>
  );
}
