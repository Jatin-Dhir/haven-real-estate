import type { CSSProperties } from "react";
import { wordmark, WORDMARK_MASK_URL } from "@/generated/wordmark";

type Props = {
  className?: string;
  style?: CSSProperties;
  /** "fill" (default) paints the letters; "stroke" draws only outlines (used by the hero draw-on) */
  mode?: "fill" | "stroke";
  strokeWidth?: number;
  /** Accessible name; pass "" to hide from assistive tech when decorative */
  title?: string;
};

/**
 * Brand wordmark as vector paths generated from `brand.name` in Instrument Sans Bold
 * (see scripts/generate-wordmark.mjs). Inherits `color` for fill/stroke.
 */
export function Wordmark({ className, style, mode = "fill", strokeWidth = 12, title = wordmark.text }: Props) {
  const decorative = title === "";
  return (
    <svg
      className={className}
      style={style}
      viewBox={wordmark.viewBox}
      role={decorative ? undefined : "img"}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : title}
      focusable="false"
    >
      <path
        d={wordmark.d}
        fill={mode === "fill" ? "currentColor" : "none"}
        stroke={mode === "stroke" ? "currentColor" : undefined}
        strokeWidth={mode === "stroke" ? strokeWidth : undefined}
        strokeLinejoin="round"
        vectorEffect={mode === "stroke" ? "non-scaling-stroke" : undefined}
      />
    </svg>
  );
}

export { wordmark, WORDMARK_MASK_URL };
