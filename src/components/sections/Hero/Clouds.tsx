"use client";

import { useId } from "react";

/**
 * Procedural weather.
 *
 * The reference site ships hand-painted cloud/smoke PNGs. When the content provides
 * `hero.cloud` / `hero.smoke` we render those instead (see Hero.tsx); when it does not, we
 * build the shapes here out of primitives: plain white ellipses pushed through
 * feTurbulence → feDisplacementMap (rips the clean elliptical edge into vapour) →
 * feGaussianBlur (softens what is left). No illustration paths, so any brand palette or
 * viewport size still gets believable volume.
 *
 * `preserveAspectRatio="none"` lets one shape fill whatever box the layout gives it; the
 * viewBox ratios below match the CSS boxes, so nothing is visibly stretched.
 */

type ShapeProps = {
  className?: string;
  /** feTurbulence seed — change it to get a different (but equally soft) shape. */
  seed?: number;
};

/** Stable, selector-safe id for the filter (useId is SSR-safe but emits ":" characters). */
const useFilterId = (prefix: string) => `${prefix}-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;

export function ProceduralCloud({ className, seed = 4 }: ShapeProps) {
  const id = useFilterId("hero-cloud");
  return (
    <svg className={className} viewBox="0 0 800 340" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <defs>
        <filter id={id} x="-30%" y="-45%" width="160%" height="190%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.009 0.018" numOctaves="5" seed={seed} result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="105" xChannelSelector="R" yChannelSelector="G" result="warp" />
          <feGaussianBlur in="warp" stdDeviation="11" />
        </filter>
        {/* feathers the whole puff so it dissolves into the sky instead of ending */}
        <radialGradient id={`${id}-fade`} cx="0.5" cy="0.54" r="0.6">
          <stop offset="0.42" stopColor="#fff" stopOpacity="1" />
          <stop offset="0.76" stopColor="#fff" stopOpacity="0.6" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask id={`${id}-mask`} maskUnits="userSpaceOnUse" x="0" y="0" width="800" height="340">
          <rect x="0" y="0" width="800" height="340" fill={`url(#${id}-fade)`} />
        </mask>
      </defs>
      <g mask={`url(#${id}-mask)`}>
        <g filter={`url(#${id})`} fill="#fff">
          <ellipse cx="345" cy="196" rx="245" ry="80" opacity="0.9" />
          <ellipse cx="470" cy="148" rx="170" ry="72" opacity="0.85" />
          <ellipse cx="255" cy="146" rx="125" ry="58" opacity="0.8" />
          <ellipse cx="612" cy="200" rx="150" ry="60" opacity="0.85" />
          <ellipse cx="155" cy="214" rx="135" ry="54" opacity="0.8" />
          <ellipse cx="690" cy="234" rx="110" ry="42" opacity="0.75" />
        </g>
      </g>
    </svg>
  );
}

export function ProceduralSmoke({ className, seed = 11 }: ShapeProps) {
  const id = useFilterId("hero-smoke");
  return (
    <svg className={className} viewBox="0 0 1440 460" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <defs>
        <filter id={id} x="-12%" y="-30%" width="124%" height="170%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.005 0.012" numOctaves="5" seed={seed} result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="130" xChannelSelector="R" yChannelSelector="G" result="warp" />
          <feGaussianBlur in="warp" stdDeviation="13" />
        </filter>
      </defs>
      {/* The base slab is drawn well outside the viewBox so displacement never eats the edges. */}
      <g filter={`url(#${id})`} fill="#fff">
        <rect x="-220" y="196" width="1880" height="560" opacity="0.97" />
        <ellipse cx="180" cy="186" rx="300" ry="104" opacity="0.92" />
        <ellipse cx="520" cy="158" rx="260" ry="112" opacity="0.9" />
        <ellipse cx="880" cy="190" rx="240" ry="96" opacity="0.92" />
        <ellipse cx="1230" cy="166" rx="290" ry="108" opacity="0.9" />
        <ellipse cx="350" cy="246" rx="220" ry="92" opacity="0.9" />
        <ellipse cx="1050" cy="244" rx="230" ry="88" opacity="0.9" />
        <ellipse cx="700" cy="258" rx="200" ry="82" opacity="0.88" />
      </g>
    </svg>
  );
}
