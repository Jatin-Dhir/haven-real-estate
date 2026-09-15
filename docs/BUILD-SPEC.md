# HAVEN — build spec for section agents

We are rebuilding the structure, layout, and motion of a reference real-estate marketing site
(findrealestate.com) as an original Next.js codebase with dummy, editable content. Read this whole
file before writing code.

## 0. Hard rules

1. **Original code and content only.** Never paste the reference site's CSS/JS, copy its text,
   testimonials, logo, or images. Use the reference material below to *measure* (sizes, spacing,
   timing, easing) and to understand the choreography, then write your own implementation with your
   own class names. All copy comes from `src/content/site.ts` — never hard-code text.
2. **Do not edit shared files**: `src/content/*`, `src/lib/*`, `src/components/ui/*`,
   `src/components/providers/*`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`,
   `package.json`. If you truly need a new content field or shared helper, use a local default inside
   your component and list the request in your final report. Only touch files you own (see §6).
3. **Units:** every size in `rem`. `1rem = 10px at 1920px` (fluid `0.5208vw` on desktop, `2.667vw`
   on mobile, capped at 10px ≥1920). The measurement tables below are in px at a 1280px-wide desktop
   viewport where `1rem = 6.667px` → divide px by 6.667 to get rem, or just read the module CSS in
   `ref/css-modules/*.css` which is already in rem. Mobile-first CSS, desktop at
   `@media (min-width: 768px)`.
4. **Motion stack:** GSAP via `@/lib/gsap` (never import `gsap` directly), helpers from
   `@/lib/motion`, `useGSAP(() => {...}, { scope: rootRef })` for automatic cleanup. Lenis smooth
   scroll is already global (`SmoothScroll`); never add another scroll engine. Never animate
   layout properties on scroll (only transform / opacity / clip-path).
5. **Reduced motion:** helpers already render final states under `prefers-reduced-motion`. For any
   custom tween, check `prefersReducedMotion()` from `@/lib/gsap` and render the end state.
6. **Accessibility:** split text keeps an `aria-label` on the parent (helpers do this); interactive
   elements are real `<button>`/`<a>`; visible `:focus-visible` (global); images through `<Img>`
   with the asset's alt.
7. **Verify** before reporting: `npx tsc --noEmit` passes; the dev server renders your section with
   no console errors; compare against the reference screenshots at desktop and mobile widths.

## 1. Reference material (read-only)

Scratch folder: `C:/Users/HEART/AppData/Local/Temp/claude/C--dev-projects-New-folder/4f4c4724-11cd-443d-858f-2995ed14134c/scratchpad/ref/`

| Path | What it is |
| --- | --- |
| `shots/d-*.png` | Desktop (1440×900) screenshots: hero at many scroll offsets (`d-hero-0300.png` = scrollY 300), each section (`d-05-testimonials-0.png`), hover states, nav dropdowns, modal, footer |
| `shots/m-*.png` | Mobile (390×844) screenshots incl. open burger menu |
| `css-modules/<module>.css` | The reference site's CSS for that module, prettified, in rem. Use for exact paddings/sizes/breakpoints. Module names: header, burger-menu, burger-btn, hero, why-us, arrows-section, rewired, for-agents, assymetric-cols, assymetric-image-split, testimonials, services, features, latest-posts, post-entry, outro, footer, drop-menu, find-properties-modal, contact-us-modal, button, container |
| `probe.json` / `probe-summary.txt` | Computed styles at a 1440×900 viewport (there `1rem = 7.5px`): typography per element, section boxes, buttons, header, and `heroSnaps` = hero layer transforms/opacity at 23 scroll offsets. Read the summary first. |
| `interactions.txt` | DOM outlines of every section (nesting + class names + inline styles), nav dropdown contents, modal outline, services hover styles, Swiper params, footer outline, header class at scroll |
| `gsap-calls.txt` | Their animation helper semantics (already ported to `src/lib/motion.ts`) |

Class names in the reference look like `hero_top__N0Loz` — the part before `__` is the meaningful name.

## 2. Architecture (already in place)

```
src/app/layout.tsx          fonts (Instrument Sans + Lora via next/font), SmoothScroll, ModalProvider, Header, Footer
src/app/page.tsx            assembles the 10 sections in order, passing `site.<key>` as `data`
src/app/globals.css         tokens: colors, eases, type scale utilities (.t-h-md …), .em, [data-theme="dark"]
src/content/types.ts        content schema        src/content/site.ts   the editable dummy content
src/lib/gsap.ts             gsap + ScrollTrigger + SplitText + DrawSVGPlugin + CustomEase + useGSAP, prefersReducedMotion()
src/lib/motion.ts           wordsReveal / fadeUp / fadeX / fadeIn / clipReveal / parallax / scrubbedLines (+ *OnScroll twins), whenFontsReady, refreshScroll
src/components/ui/Container fluid gutter (2.5rem mobile / 10rem desktop, max 1920)
src/components/ui/Button    pill button, rolling label on hover, colors primary|secondary, `inversed`, `iconAfter`, runs content `Action`s (links or modals)
src/components/ui/Img       <img> with fallback, `fill` prop = absolute cover
src/components/ui/Wordmark  brand wordmark SVG (vector paths generated from brand.name) + WORDMARK_MASK_URL for CSS masks
src/components/providers/ModalProvider   useModal() → openModal("find-properties" | "contact" | "agent-join", { dealType })
```

Design tokens (globals.css): `--color-dark #151717`, `--color-light #f1f1f1`, `--color-muted #b3b3b3`,
`--color-text-50/80`, `--color-white-40/50/80`, `--color-line`, eases `--ease-out-expo`
`cubic-bezier(.16,1,.3,1)`, `--ease-spring cubic-bezier(.34,3.56,.64,1)`, `--ease-panel cubic-bezier(.76,0,.2,1)`.
Dark sections set `data-theme="dark"` on the `<section>` (white text, `.em` becomes white/40).

Type scale (desktop): hero h1 14rem/700; section h2 7.2rem/500 lh 1 ls -.04em; big statement 5.6rem/500
lh 1.15; sub-heads 4.4rem/500 lh 1.15; lead 3.2rem/500 lh 1.3; body 2.4rem/500; label 2rem/600; quote Lora 3.2rem.
Section vertical padding: 15rem desktop, 6rem mobile (4rem for arrows/rewired). Container inner width at 1280 = 1131px.

The **asymmetric two-column grid** used by why-us, rewired, for-agents, services header, features header,
posts header: row is flex; first column `flex: 1`; second column `flex-basis: 97.6rem; flex-shrink: 0`;
column gap 4rem (mobile, stacked) / row on desktop. Left column holds the small label or heading, right
column the statement/copy. See `ref/css-modules/assymetric-cols.css`.

## 3. Motion system (shared vocabulary)

Every section follows the reference's reveal grammar:
- **Headings**: `wordsRevealOnScroll(h2)` — words slide up 115%→0 inside overflow-hidden masks,
  2s `power4.out`, stagger .1 (or `{amount:.4}` when >5 words).
- **Paragraphs / buttons / cards**: `fadeUpOnScroll(els, { stagger: .1 })` — opacity snaps in .1s, y 70→0 over 2s `expo.out`.
- **Images**: `clipRevealOnScroll(img, ...)` wipes `inset(0 100% 0 0)`→`inset(0 0 0 0)` 2s `power3.out`; or
  `parallaxOnScroll(innerImg, frame, { fromY: "10%", toY: "-10%" })` scrub 1.5 for framed photos (inner img 120% tall).
- **Scrubbed statement text** (services h2, rewired big text, brief): `scrubbedLines(el, { color })` — a colored
  overlay per line scales away as you scroll (start `top bottom-=200px`, end `center center`).
- Triggers are once-only, `start: "top 85%"`. Wait for `whenFontsReady()` before splitting text.
- Hover states in CSS: `.7s`–`.9s` `var(--ease-out-expo)`; image zoom scale 1→1.06 `.7s`.

## 4. Page structure and per-section spec

Measurements: desktop 1280 viewport (1rem = 6.667px), content width 1131, gutter 66.7px (10rem).

### Header (`header`, sticky top, z 50)
- Grid `25rem 1fr 25rem` desktop (`1fr auto` mobile); min-height 7.8rem desktop / 8.4rem mobile.
- Left: `<Wordmark>` 9.1rem × 2.6rem linking home. Center nav gap 4rem, items 2rem/500 lh 1.25 with a
  rolling-label hover (same trick as Button: `span[data-text]::after` at top 105%, translateY(-105%)
  .9s expo). Dropdown items have a small chevron; dropdown panel = `ref/css-modules/drop-menu.css`
  (white panel, `drop-menu_appear` keyframe) with links from `nav[i].children`.
- Right: Sign In `<Button color="primary">` (mobile: hidden, shown inside burger). Burger button (two bars).
- States (confirmed): base `background: #fff`, `transition: background-color .3s, transform .3s ease-in-out`.
  `transparent` (home page, while `scrollY` is ~0) → `background: transparent`. Once the user scrolls,
  add `-fixed` → white background returns. Scrolling **down** adds `-hidden` → `transform: translateY(-100%)`;
  scrolling **up** removes it. At scrollY 3100 the reference header had classes `transparent -fixed -hidden`
  (white, translated out of view). Keep the header `position: sticky; top: 0; z-index: 50`.
  Dropdown/burger open state must cancel `-hidden` and use the opaque background.
- Burger menu (mobile): full-screen white panel; opens with `scaleY 0→1 .7s cubic-bezier(.76,0,.2,1)`
  (transform-origin top), then nav items word-reveal at +.4s, actions fade up at +.6s; close reverses
  (scaleY→0, content fades .7s). Accordion sub-items for dropdown groups. Locks body scroll
  (`document.body.style.overflow = "hidden"` + `data-lenis-prevent`). See `m-burger-open.png`, `m-burger-join-open.png`.

### 1. Hero (`hero`) — the signature scroll scene
Structure: `section.root` height **500vh**, `position: relative`. Inside: `div.top` `position: sticky; top: 0; height: 100vh; overflow: hidden` holding the scene, then `div.overlap` `position: absolute; top: 0; width: 100%; height: 400vh; pointer-events: none` holding a second smoke layer near its bottom (top ≈ 342vh) and a `linear-gradient(transparent, #fff)` overlay in its last ~28vh, both `z-index: 3`, so the pinned scene fades into the white section that follows.

Layers inside `.top` (all `position: absolute`, in paint order):
1. `.back` sky photo, full-bleed cover (`data.background`).
2. `.house` (the building, `data.house`): wrapper `top: 60%`, width ~100%, centered; at 1280 its box was 1268×1141, so the roof pokes up from below and the rest sits behind the smoke. If the asset is a plain photo, soft-mask its edges (`mask-image: radial-gradient(ellipse 70% 60% at 50% 45%, #000 45%, transparent 100%)`) so it blends into the sky.
3. `.composite` — a second copy of the house in the exact same position, `opacity: 0`, with `mask-image: url(WORDMARK_MASK_URL)`, `mask-repeat: no-repeat`, `mask-size: 51%`, `mask-position: 50% 30%` (wordmark box at 1280 was 651×282 at x 307, y 219). It shows the house *through the brand letters*.
4. `.clouds` (z 2): two cloud layers left/right (`cloud1` box −226,180 749×318; `cloud2` 866,144 624×265). Use `data.cloud` if provided, otherwise procedural clouds (SVG `feTurbulence` + blur, white, ~.9 opacity). No hand-drawn illustration paths.
5. `.logo` (wordmark outline, `opacity: 0`): inline `<svg>` with the wordmark path stroked (`stroke: #000; fill: none; stroke-width ~1.5`), same box as the mask (651×282 at 307,219 → 51% wide, top 30%). Uses DrawSVG.
6. `.smoke` (z 3): a soft white cloud bank across the bottom (box 0,307 1265×413) covering the base of the house. Procedural or `data.smoke`.
7. `.content` (relative, full height): centered column ~26% from the top: `h1.t-h-xl` (14rem/700, centered, each word in its own mask), `p.t-lead` subtitle (with `<span class="em">` for `subtitleEm`, `.em` here is `var(--color-text-50)`), `<Button>` for `data.cta` (opens Find Properties modal). Margins: h1 → p 14px (2.1rem), p → button 26px (3.9rem).

**Intro timeline** (plays 200ms after mount; section starts `visibility: hidden`):
`root autoAlpha 0→1 .6s @0` · `wordsReveal(h1, {duration:2, stagger:.1}) @0` · `fadeUp([p, button]) @.4` ·
`back from scale 1.1, 5s expo.out @0` · `cloud1 from y 50%, 3s expo.out @0` · `cloud2 from y 100%, 4s expo.out @.1` ·
`house imgs from opacity 0 .6s @.2` and `from y 10%, 3s expo.out @.2`.

**Scrubbed timeline** (`ScrollTrigger` trigger root, `start: "top top"`, `end: "bottom top"`, `scrub: .1`; duration units are timeline seconds = fraction of the 500vh travel):
`houses (both) → y -40%, scale 1.3, dur 1 @0` · `smoke → y 0%, dur 1 @0` · `cloud1 → x -15% @0` · `cloud2 → x 15% @0` ·
`content → y 20%, scale .9, dur 1 @0` · `content → opacity 0, dur .2 @0` · `logo → opacity 1, dur .01 @.1` ·
`logo path fromTo drawSVG 0%→100%, dur .3 @.1` · `logo → opacity 0, dur .2 @.28` · `composite → opacity 1, dur .1 @.3` ·
`house (plain) → opacity 0, dur .1 @.3`.
Net story: title fades as the building rises and grows; the wordmark outline draws itself on; the outline
dissolves and the building is seen only through the letters; clouds drift apart; the scene fades to white.
Cross-check against `probe.json → heroSnaps` and `shots/d-hero-*.png`.

Confirmed at 1440×900 (`probe-summary.txt`): root 4500px tall (500vh); house wrapper `top: 60%` (540px),
`width: 100%` (1440×1281 — natural aspect of the building image, so height follows width), transform-origin
bottom center (`720px 1281px`) — set `transform-origin: 50% 100%` on the house wrappers so the scale grows
upward. Scroll → house: y −3→−471px and scale 1.002→1.276 across 0→3200; plain house opacity 1→0 between
scroll 1400–1800 while composite opacity 0→1 over the same range (that is timeline .31–.40 of the 4500px travel).
Mobile (`m-hero-*.png`): same structure, h1 wraps to 2 lines (5.4rem), house ~100vw wide.

### 2. Why us (`why-us`) — white, padding 15rem
Asymmetric grid: left label `data.label` (2rem/600); right statement 5.6rem/500 lh 1.15 ls -.03em, `text` then
`<span class="em">textEm</span>`. Below (gap 10rem): full-width media frame 1131×651 (≈16:9.2, radius per module
CSS) with `data.video` — autoplay muted loop playsinline when `src` non-empty, else the poster `<Img>`. Reveal:
label + statement words, then media `clipReveal`/`fadeUp`; inner media parallax scrub.

### 3. Arrows (`arrows-section`) — padding 15rem
Centered h2 (`title` + `<span class="em">titleEm</span>`, 7.2rem) → a centered row of 4 **chevron-shaped**
photo tiles pointing right (see `d-02-arrows-section-0.png`): at 1440 the row is 1240×330 and each tile
259.5×330 (≈34.6rem × 44rem) with `object-fit: cover` images. The reference shapes each tile with a CSS
`mask-image` SVG chevron (data URL): a polygon like `0,0 → 62%,0 → 100%,50% → 62%,100% → 0,100% → 38%,50%`
(a right-pointing arrow band). Write your own polygon; `clip-path: polygon(...)` is fine too. Then a
centered paragraph 3.2rem/500 (text + em), max-width ~81rem. Tiles reveal with a stagger (`clipReveal`
left→right or `fadeUp`), and the images drift with a subtle `parallaxOnScroll`.

### 4. Rewired (`rewired`) — padding 15rem, asymmetric grid
Left: two-line heading 7.2rem/500 lh 1 (`headlineLine1` black, `headlineLine2` as `.em` muted — see
`d-03-section-0.png`), then `<Button iconAfter>` (`data.cta`) with a 4rem gap. Right column
(`flex-basis: 97.6rem`): `stepsLabel` (3.2rem/500, mb 3rem), a hairline, then 3 rows each with a small
muted index "01/02/03" (1.6rem/500, `--color-muted`) in a 5rem-wide left column and the step text at
4.4rem/500 lh 1.15: `title` in black followed by `text` in `.em` grey on the same line(s). Rows are
~16rem tall with hairline dividers (`--color-line`) between and after. Reveal: heading words, then rows
`fadeUp` with stagger. See `REWIRED OUTLINE` in `interactions.txt`.

### 5. For agents (`for-agents` + `assymetric-image-split`) — padding 15rem
Left column (hidden on mobile): label `data.label` (2rem/600) and a small landscape image lower down
(`smallImage`). Right column: h2 `title` + `<span class="em">titleEm</span>` (7.2rem/500 lh 1.15), a
large portrait image frame 651 wide (`image`, parallax inner), then `text` (3.2rem/500 lh 1.3) and the
`<Button>` (`data.cta`). Reveals: words, clip image, fade-up text/button.

### 6. Testimonials (`testimonials`) — bg `--color-light`, padding 15rem
h2 (`title` + em, 7.2rem). Then a two-column grid (gap ~9rem), see `d-05-testimonials-0.png`:
- **Left**: photo frame `image` 732×516 at 1440 (97.6rem × 68.8rem), `object-fit: cover`, inner parallax.
- **Right** (65.2rem wide): a 1px black divider on top; below it a row with the **numbered pagination
  bullets** (35px = 4.67rem circles, 1px border, 1.6rem/500 numerals; active = dark border + black text,
  inactive = muted) on the left and a large closing quotation mark glyph (”, ~6rem, black) on the right;
  then the Swiper. Slide = quote in Lora 3.2rem lh 1.15 (`t-quote`), then an author row: `author` in Lora
  1.8rem/500 uppercase, a "/" separator, and 5 small black stars.
Swiper params (confirmed): `effect: "slide"`, `speed: 300`, `loop: false`, `slidesPerView: 1`,
`spaceBetween: 0`, clickable pagination, no navigation arrows, **no autoplay**. Use `swiper/react`
(`Swiper`, `SwiperSlide`, module `Pagination` with `renderBullet` printing the index) and import
`swiper/css` + `swiper/css/pagination`; style bullets via a CSS-module class passed to `pagination.bulletClass`
or `:global(.swiper-pagination-bullet)`.

### 7. Services (`services`) — dark (`data-theme="dark"`, bg `--color-dark`), padding 15rem
Header grid: caption (2rem/600) | h2 `title` + `<br/>` + em (7.2rem lh 1.05) with `scrubbedLines(h2, { color: "rgba(21,23,23,.8)" })`.
Then 3 full-bleed rows (`items`), each a `<button>` **40rem tall** (300px at 1440) with a 1px border
`rgb(56,58,58)` top (and bottom on the last), inner `<Container>` grid: number badge (4.67rem circle outline,
1.6rem "01"…), h3 text 2.4rem/500 lh 1.5 (40rem wide, starts 10.7rem from the container edge), the giant
label (`label`, 24rem/400 lh .95 ls -.05em, centered in the remaining space) and an arrow icon (3.2rem) at
the far right. **Hover (confirmed values)**: the background photo wrapper goes from
`opacity: 0; clip-path: inset(100% 0 0); transform: scale(1.05)` to `opacity: .4; clip-path: inset(0);
transform: scale(1.02)` with `transition: opacity .4s, transform 4s cubic-bezier(.5,1,.89,1), clip-path 1s
var(--ease-out-expo)`; text stays white above it (`d-services-hover-sell.png`). Click →
`openModal("find-properties", { dealType })`. Reveal: rows `fadeUp` staggered on scroll.
Below: `brief` + em (4.4rem/500, 517px wide) and right-aligned `<Button color="secondary" inversed iconAfter>` for `data.cta`.

### 8. Features / Support (`features`) — dark, padding 15rem
Header grid: h2 (`title` / em over 2–3 lines, 7.2rem lh 1) | `text` + em (3.2rem lh 1.15) and
`<Button color="primary" inversed>` (`data.cta`, white pill). Then (10rem below) 3 cards in a row filling the container (row 1290×353 at 1440 → each card ≈47rem tall,
gap ~2.5rem, padding 5rem): cover photo background with a dark gradient for legibility, h3 4.4rem/500 lh 1.15,
p 2rem/400 lh 1.5 (mt 4rem), and a `<Button color="secondary" inversed iconAfter>` "Learn More" pinned to the
bottom. Hover zooms the photo 1→1.06 over .7s. See `d-07-features-0.png`, `d-features-hover.png`. Mobile: cards stack.

### 9. Latest posts (`latest-posts` + `post-entry`) — bg `--color-light`, padding 15rem
Header grid: h2 `title` + em (8rem lh 1, "Blog &" / "Resources") | `text` (3.2rem) + `<Button iconAfter>`
(`data.cta`). Then a hairline and 3 stacked entries separated by hairlines (`d-08-latest-posts-0.png`):
**left** text column (71.5rem): date 2rem/500 (mb 6.9rem), title 4.4rem/500 lh 1.15, excerpt 1.6rem/500
lh 1.5 (mt 2.4rem), then `<Button color="secondary" iconAfter>` "Read More" (outline pill) linking to `href`;
**right** thumbnail `image` 97.6rem × 45rem, `object-fit: cover`. Entry padding ≈3rem top/bottom. Hover:
thumbnail zooms 1→1.06 (`d-post-hover.png`). Reveal: entries `fadeUp` staggered.

### 10. Outro (`outro`) — height 90rem desktop / 55rem mobile
Full-bleed background photo (`background`, cover, subtle parallax) with a dark tint; centered white h2
`title` + `<span class="em">titleEm</span>` (7.2rem lh 1.15, em = white/40) and `<Button color="primary" inversed iconAfter>` (`data.cta` → contact modal).

### Footer (`footer`) — dark `--color-dark`, white text, ≈101rem tall at 1440
Layout per `d-footer.png` + `FOOTER OUTLINE` (content fades up on scroll). Inside a `<Container>`:
1. Top row, two groups. **Left** (~86rem wide): newsletter — `newsletter.title` 3.2rem/500, then a form
   with an underlined text input (placeholder `newsletter.placeholder`, 1px bottom border white/40) and an
   arrow submit button (aria-label `newsletter.submitLabel`; on submit show `successText`). Below it
   (gap ~8rem) three contact blocks side by side: label (`contact.officeLabel` … 2rem, white/50) over the
   value (2rem, white): `office` lines, `mailto:` email, `tel:` phone.
   **Right**: `quickLinks` as a vertical list of large links (3.2rem/500, rolling-label hover) and, further
   right, `socials` (2rem/500) as a second column.
2. The giant `<Wordmark>` left-aligned, ~half the container width (≈97rem), margin ~10rem above/below.
3. Bottom row (1.6rem, white/50): `legal` links + `notices` spans inline with wrapping, then
   `brand.legalName` and `copyright` at the far right.
Mobile (`m-footer.png`): everything stacks; wordmark full width.

### Modals (Radix Dialog) — `find-properties`, `contact`, `agent-join`
Overlay `rgba(0,0,0,.5)` fade; panel slides down/up (`slideDown`/`slideUp` keyframes in
`ref/css-modules/find-properties-modal.css`, `contact-us-modal.css`). Panel: white, radius ~2.4rem, title
(4.4rem/500), description (muted), a form from `content.fields` (6/12 column spans, floating labels or
underlined inputs per the module CSS), submit `<Button type="submit" iconAfter>` with loading state and a
success view (`successTitle`/`successText`). Find-properties has a Buy/Rent/Sell segmented control
preselected from `dealType`. Body gets `data-lenis-prevent`; lock page scroll while open. Close button
(×) top-right, Escape and overlay click close. Validate required fields client-side (no backend: simulate
a 900ms submit, then show success).

### Mobile (390×844, `1rem = 10.4px`)
All sections stack to one column; section padding 6rem (4rem for arrows/rewired); hero h1 5.4rem over two
lines; asymmetric grids become a single column with the left label above the right content; features
cards and services rows stack; testimonials photo above the carousel; footer stacks. Use the `m-*.png`
shots as the source of truth for order and spacing.

## 5. Verification workflow
1. `npx tsc --noEmit` from the project root.
2. Dev server: the orchestrator runs it on http://localhost:3000 — do not start a second one.
   Screenshot helper (run with the sandbox disabled):
   `node "C:/Users/HEART/AppData/Local/Temp/claude/C--dev-projects-New-folder/4f4c4724-11cd-443d-858f-2995ed14134c/scratchpad/pw/shot-local.mjs" <outfile.png> [scrollY|#selector] [mobile]`
   then `Read` the PNG and compare with the reference screenshot. Iterate until the section matches
   in layout, rhythm, and motion (check console errors with the helper's output).
3. Test reduced motion mentally: with `prefersReducedMotion()` true, everything must be visible.

## 6. File ownership

| Agent | Owns (create/edit freely) |
| --- | --- |
| hero | `src/components/sections/Hero/**` |
| header | `src/components/layout/Header*`, `src/components/layout/BurgerMenu*`, `src/components/layout/DropMenu*`, `src/components/layout/nav.module.css` |
| why-arrows-rewired | `src/components/sections/WhyUs/**`, `Arrows/**`, `Rewired/**` |
| agents-testimonials | `src/components/sections/ForAgents/**`, `Testimonials/**` |
| services-features | `src/components/sections/Services/**`, `Features/**` |
| posts-outro-footer | `src/components/sections/LatestPosts/**`, `Outro/**`, `src/components/layout/Footer*` |
| modals | `src/components/modals/**` |

Component signatures are fixed (see the stubs): sections receive `{ data }` (Hero also `brand`),
`Header({ brand, nav })`, `Footer({ brand, data })`, modals `({ open, onOpenChange, dealType? })`.
Keep each section a `"use client"` component with a `<Name>.module.css` next to it.
