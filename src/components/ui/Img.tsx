"use client";

import { clsx } from "clsx";
import { useEffect, useState, type CSSProperties, type ImgHTMLAttributes } from "react";
import type { ImageAsset } from "@/content/types";
import { withBase } from "@/lib/paths";
import styles from "./Img.module.css";

export const FALLBACK_IMAGE = withBase("/placeholders/image.svg");

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt" | "width" | "height"> & {
  asset: ImageAsset;
  /** Absolutely fill the (positioned) parent with object-fit: cover */
  fill?: boolean;
  /** Load eagerly with high priority (above-the-fold only) */
  priority?: boolean;
  className?: string;
  style?: CSSProperties;
};

/**
 * Plain <img> with a graceful fallback: if the remote asset fails to load we swap in a
 * neutral local placeholder instead of showing a broken image. Content editors can point
 * `asset.src` at any URL or /public path.
 */
export function Img({ asset, fill, priority, className, style, ...rest }: Props) {
  const resolved = asset.src ? withBase(asset.src) : FALLBACK_IMAGE;
  const [src, setSrc] = useState(resolved);
  useEffect(() => setSrc(resolved), [resolved]);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={asset.alt}
      width={asset.width}
      height={asset.height}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : undefined}
      draggable={false}
      onError={() => src !== FALLBACK_IMAGE && setSrc(FALLBACK_IMAGE)}
      className={clsx(fill && styles.fill, className)}
      style={style}
      {...rest}
    />
  );
}
