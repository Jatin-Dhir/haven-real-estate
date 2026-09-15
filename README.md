# HAVEN — real-estate marketing site (Next.js 15)

A from-scratch rebuild of the structure, layout, and motion language of a premium real-estate
marketing site, with **dummy, fully editable content**. Stack: Next.js 15 (App Router) · TypeScript ·
CSS Modules · GSAP 3 (ScrollTrigger, SplitText, DrawSVG) · Lenis smooth scroll · Swiper · Radix Dialog.

```bash
npm install
npm run dev      # http://localhost:3000  (also regenerates the wordmark)
npm run build    # production build
npm run typecheck
```

## Edit the content

Everything a non-developer might change lives in **`src/content/site.ts`** (typed by
`src/content/types.ts`): brand name, navigation, every heading/paragraph/button, testimonials,
services, blog cards, footer, and the three modal forms. Components never hard-code copy.

- **Images** are royalty-free Unsplash photos by default. Swap any `src` for your own file placed in
  `/public` (e.g. `"/media/my-house.png"`) or any URL. If an image fails to load, a neutral placeholder is shown.
- **The building in the hero** is `hero.house`. A transparent PNG cutout of a building gives the
  floating-house look of the original; a normal photo also works (its edges are soft-masked into the sky).
  `hero.cloud` / `hero.smoke` are optional PNGs with transparency — when omitted, the hero renders
  procedural clouds.
- **The brand wordmark** (header, footer, and the hero mask/outline) is generated from `brand.name` as real
  vector paths in Instrument Sans Bold: run `npm run wordmark` after changing the name (it also runs
  automatically before `dev`/`build`). Keep the name short (3–6 letters) so the mark composes well.
- **Buttons** take an `action`: `{ type: "link", href }` or `{ type: "modal", modal: "find-properties" | "contact" | "agent-join" }`.
- **Video** in the "Why" section: set `why.video.src` to an mp4/webm URL; empty string shows the poster.

Every route linked from the nav/footer resolves to a placeholder page (`src/app/[...slug]/page.tsx`)
until you add real pages (e.g. `src/app/search/page.tsx`).

## Where things live

```
src/app/                 layout (fonts, providers, header, footer), home page, catch-all placeholder page
src/content/             site.ts (content) + types.ts (schema)
src/components/sections/ one folder per home-page section (Hero, WhyUs, Arrows, Rewired, ForAgents,
                         Testimonials, Services, Features, LatestPosts, Outro), each with its CSS module
src/components/layout/   Header + dropdowns + burger menu, Footer
src/components/modals/   FindPropertiesModal, ContactModal, AgentJoinModal (Radix Dialog)
src/components/ui/       Button, Container, Img, Wordmark
src/components/providers SmoothScroll (Lenis ↔ GSAP ticker), ModalProvider, MotionRoot
src/lib/                 gsap.ts (plugin registry), motion.ts (shared reveal/parallax helpers)
src/generated/           wordmark.ts (auto-generated — do not edit)
scripts/                 generate-wordmark.mjs, scaffold-stubs.mjs
docs/BUILD-SPEC.md       the build specification the sections were implemented against
```

Motion conventions, tokens (`1rem = 10px at 1920px`, fluid), and the per-section spec are documented in
`docs/BUILD-SPEC.md`. Reduced-motion users get the final state of every animation and native scrolling.

## Licenses

Fonts: Instrument Sans and Lora (SIL Open Font License) via `next/font/google`; a static copy of
Instrument Sans Bold in `scripts/fonts/` is used only to generate the wordmark paths. Photos: Unsplash License;
the hero building cutout (`public/media/hero-building.png`) is a Pexels photo (Pexels License) with its
background removed using the open-source `rembg` model, then solidified so glass and windows stay opaque.
